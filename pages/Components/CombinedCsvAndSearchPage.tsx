'use client'; //Not using the Server Deafult

// Import necessary dependecies for React, animations, routing and Firebase
import { useEffect, useState } from 'react'; 
import { motion } from 'framer-motion'; 
import { useRouter } from 'next/navigation';
import { signOut, db } from '../../firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';

//Main component definition
const CombinedCsvAndSearchPage = ({ onLogout }) => {
  const router = useRouter(); 
  const [emailData, setEmailData] = useState([]); //State to store email data from database
  const [searchTerm, setSearchTerm] = useState(''); //State for managing the search input 
  const [selectedCategory, setSelectedCategory] = useState(''); //State for managing the selected filter category
  const [loading, setLoading] = useState(false); //State to handle loading status
  const [selectedFile, setSelectedFile] = useState(null); //State for managing the selected CSV file
  const emailCollection = collection(db, 'emails'); //Reference to the Firestore collection

  //Fetch email data from the Firestore database when the component is mounted
  useEffect(() => {
    setLoading(true);
    getDocs(emailCollection)
      .then((querySnapshot) => {
        const savedData = querySnapshot.docs.map((doc) => doc.data());
        setEmailData(savedData);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data: ', error);
        setLoading(false);
      });
  }, []); // Empty dependency array to run on only once

  // Helper function to parse a single line from a CSV file
  const parseCSVLine = (line) => {
    const values = []; //Store parsed values
    let currentValue = ''; //Temporary storage
    let insideQuotes = false; 
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i]; // Processing of current character
      
      if (char === '"') {
        insideQuotes = !insideQuotes; //Quotes toggle
      } else if (char === ',' && !insideQuotes) {
        values.push(currentValue.trim()); // Add the current value to the array
        currentValue = ''; // Reset the value
      } else {
        currentValue += char; // Add character to the current value
      }
    }
    
    values.push(currentValue.trim()); 
    return values.map(val => val.replace(/^"|"$/g, '').trim()); // Remove surrounding quotes and spaces

  //Function to handle file upload and parse the CSV file    
  const handleFileUpload = () => {
    if (!selectedFile) {
      alert('Please select a CSV file first');
      return;
    }
  
    setLoading(true); 
    const reader = new FileReader(); 
    
    //Event handler for when file has been successfully read
    reader.onload = (e) => {
      try {
        const content = e.target.result;
        // Split by newline but handle cases where there might be newlines within quoted fields
        const lines = content.split(/\r?\n/);
        
        // Process data rows
        const processedData = lines
          .slice(1) // Skip header row
          .filter(line => line.trim() !== '') // Remove empty lines
          .map(line => {
            const columns = parseCSVLine(line); // Parse the line into columns
            
            //Maps parsed columns to required object structure
            return {
              title: columns[1] || '', 
              category: columns[2] || '', 
              summary: columns[3] || '', 
              promoCode: (columns[4] || '').toLowerCase() === 'no' ? 'N/A' : columns[4],
              expiryDate: (columns[5] || '').toLowerCase() === 'no' ? 'N/A' : columns[5]
            };
          })
          .filter(row => {
            // Filter rows by valid categories 
            const validCategories = ['Offers', 'Events', 'Reminder/Alerts'];
            return validCategories.includes(row.category) && row.title && row.summary;
          });
  
        if (processedData.length === 0) {
          throw new Error('No entries found with valid categories (Offers, Events, or Reminder/Alerts) in the CSV file.');
        }
  
        setEmailData(processedData); // Update data 
        alert(`Successfully loaded ${processedData.length} entries.`);
        setLoading(false);
      } catch (error) {
        console.error('Error processing CSV:', error);
        alert(error.message);
        setLoading(false);
      }
    };
    
    // Handle file read errors
    reader.onerror = (error) => {
      console.error('Error reading file:', error);
      alert('Error reading the CSV file. Please try again.');
      setLoading(false);
    };
  
    reader.readAsText(selectedFile);
  };

  // Function to handle deleting a row
  const handleDelete = (index) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setEmailData((prevData) => prevData.filter((_, i) => i !== index));
    }
  };

  // Function to save the data to the Firestore database
  const handleSaveToDatabase = async () => {
    setLoading(true);
    try {
      for (const email of emailData) {
        await addDoc(emailCollection, {
          title: email.title,
          category: email.category,
          summary: email.summary,
          promoCode: email.promoCode,
          expiryDate: email.expiryDate,
        });
      }
      setLoading(false);
      alert('Data saved successfully!');
    } catch (error) {
      console.error('Error saving data: ', error);
      setLoading(false);
    }
  };
  
  // Filter the email data based on search term and drop down based on selected category
  const filteredEmailData = emailData.filter((row) => {
    const categoryMatch = selectedCategory ? row.category === selectedCategory : true;
    const searchTermMatch = row.title.toLowerCase().includes(searchTerm.toLowerCase());
    return categoryMatch && searchTermMatch;
  });

  // Styling - hovers, transitions and animations
  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '2rem'
    }}>
      {loading && (
        <motion.div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          backgroundColor: '#3B82F6',
          color: 'white',
          padding: '1rem'
        }}>
          Loading...
        </motion.div>
      )}

<motion.div
  style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
    padding: '1rem',
    background: `
    linear-gradient(to right, #9333EA, #3B82F6),
    repeating-linear-gradient(45deg, 
      rgba(255,255,255,0.1) 0px,
      rgba(255,255,255,0.1) 10px,
      transparent 10px,
      transparent 20px
    )
  `,
  backgroundBlendMode: 'overlay',
  borderRadius: '0.5rem',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
  }}
  initial={{ opacity: 0, y: -20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  <button
    onClick={() => handlelogout()}
    style={{
      backgroundColor: '#EF4444',
      color: 'white',
      borderRadius: '0.25rem',
      padding: '0.5rem 1rem',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      transition: 'transform 0.2s',
      cursor: 'pointer',
      border: 'none'
    }}
    onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
    onMouseLeave={e => e.target.style.transform = 'scale(1)'}
  >
    Log Out
  </button>

  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
    <input
      type="file"
      onChange={(e) => {
        setSelectedFile(e.target.files[0]);
        setEmailData([]); // Clear existing data
      }}
      accept=".csv"
      style={{
        border: '1px solid #D1D5DB',
        borderRadius: '0.5rem',
        padding: '0.5rem 1rem',
        cursor: 'pointer',
        backgroundColor: 'white',
        color: '#374151',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
      }}
    />
    
    {selectedFile && (
      <button
        onClick={handleFileUpload}
        style={{
          backgroundColor: '#3B82F6',
          color: 'white',
          borderRadius: '0.5rem',
          padding: '0.5rem 1rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.2s ease',
          cursor: 'pointer',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}
        onMouseEnter={e => {
          e.target.style.backgroundColor = '#2563EB';
          e.target.style.transform = 'scale(1.05)';
        }}
        onMouseLeater={e => {
          e.target.style.backgroundColor = '#3B82F6';
          e.target.style.transform = 'scale(1)';
        }}
      >
        <span>Generate Table</span>
      </button>
    )}
  </div>
</motion.div>

      <div style={{ marginBottom: '1.5rem' }}>
        <motion.input
          type="text"
          placeholder="Search emails..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            border: '1px solid #D1D5DB',
            borderRadius: '0.5rem',
            padding: '0.5rem',
            width: '100%',
            marginBottom: '1rem',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
          }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        />

        <motion.select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{
            border: '1px solid #D1D5DB',
            borderRadius: '0.5rem',
            padding: '0.5rem',
            width: '100%',
            marginBottom: '1rem',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
          }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <option value="">All Categories</option>
          <option value="Reminder/Alerts">Reminder/Alerts</option>
          <option value="Offers">Offers</option>
          <option value="Events">Events</option>
        </motion.select>
      </div>

      <motion.div
        style={{
          backgroundColor: 'white',
          borderRadius: '1rem',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden'
        }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <table style={{
          width: '100%',
          fontSize: '0.875rem',
          textAlign: 'left',
          color: '#6B7280'
        }}>
          <thead style={{
            backgroundColor: '#f5f5f7',
            color: '#374151'
          }}>
            <tr>
              <th style={{ padding: '1rem 1.5rem' }}>Title</th>
              <th style={{ padding: '1rem 1.5rem' }}>Category</th>
              <th style={{ padding: '1rem 1.5rem' }}>Summary</th>
              <th style={{ padding: '1rem 1.5rem' }}>Promo Code</th>
              <th style={{ padding: '1rem 1.5rem' }}>Expiry Date</th>
              <th style={{ padding: '1rem 1.5rem' }}>Delete</th>
            </tr>
          </thead>
          <tbody>
  {filteredEmailData.map((row, index) => (
    <motion.tr
      key={index}
      style={{
        borderBottom: '1px solid #E5E7EB',
        transition: 'background-color 0.2s'
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: index * 0.05 }}
      onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F3F4F6'}
      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
    >
      <td style={{ padding: '1rem 1.5rem' }}>{row.title}</td>
      <td style={{ padding: '1rem 1.5rem' }}>{row.category}</td>
      <td style={{ padding: '1rem 1.5rem' }}>{row.summary}</td>
      <td style={{ padding: '1rem 1.5rem' }}>{row.promoCode}</td>
      <td style={{ padding: '1rem 1.5rem' }}>{row.expiryDate}</td>
      <td style={{ padding: '1rem 1.5rem' }}>
        <button
          onClick={() => handleDelete(index)}
          style={{
            backgroundColor: '#EF4444',
            color: 'white',
            padding: '0.25rem 0.75rem',
            borderRadius: '0.5rem',
            border: 'none',
            cursor: 'pointer',
            transition: 'transform 0.2s, background-color 0.2s'
          }}
          onMouseEnter={e => {
            e.target.style.backgroundColor = '#DC2626';
            e.target.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={e => {
            e.target.style.backgroundColor = '#EF4444';
            e.target.style.transform = 'scale(1)';
          }}
        >
          🗑️
        </button>
      </td>
    </motion.tr>
  ))}
</tbody>
        </table>
      </motion.div>

      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        marginTop: '1.5rem'
      }}>
        <motion.button
          onClick={handleSaveToDatabase}
          style={{
            backgroundColor: '#22C55E',
            color: 'white',
            borderRadius: '0.5rem',
            padding: '0.75rem 1.5rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            border: 'none',
            cursor: 'pointer',
            transition: 'transform 0.2s, background-color 0.2s'
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          onMouseEnter={e => {
            e.target.style.backgroundColor = '#16A34A';
            e.target.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={e => {
            e.target.style.backgroundColor = '#22C55E';
            e.target.style.transform = 'scale(1)';
          }}
        >
          Save to Database
        </motion.button>
      </div>
    </div>
  )
};

export default CombinedCsvAndSearchPage;







  
  



  
 


  