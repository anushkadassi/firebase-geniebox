import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import { signOut, db } from '../firebase'; // Assuming 'db' is Firestore instance initialized in firebase.tsx
import { collection, addDoc, getDocs } from 'firebase/firestore';

const CombinedCsvAndSearchPage = ({ onLogout }) => {
  const [emailData, setEmailData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(false);

  const emailCollection = collection(db, 'emails');

  useEffect(() => {
    // Fetch saved email data from Firestore when component mounts
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
  }, []);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const content = e.target.result;
      const rows = content.split('\n').map((row) => row.split(','));

      const filteredData = rows.filter((row) => {
        const category = row[2];
        const expiryDate = parseISO(row[5]);
        return (
          (category === 'Reminder/Alerts' || category === 'Offers' || category === 'Events') &&
          expiryDate > new Date()
        );
      });

      setEmailData(filteredData);
    };

    reader.readAsText(file);
  };

  const handleDelete = (index) => {
    setEmailData((prevData) => prevData.filter((_, i) => i !== index));
  };

  const handleSaveToDatabase = async () => {
    setLoading(true);
    try {
      for (const email of emailData) {
        await addDoc(emailCollection, {
          title: email[1],
          category: email[2],
          summary: email[3],
          promoCode: email[4],
          expiryDate: email[5],
        });
      }
      setLoading(false);
      alert('Data saved successfully!');
    } catch (error) {
      console.error('Error saving data: ', error);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    signOut()
      .then(() => {
        onLogout();
      })
      .catch((error) => {
        console.error('Sign out error: ', error);
      });
  };

  const filteredEmailData = emailData.filter((row) => {
    const categoryMatch = selectedCategory ? row[2] === selectedCategory : true;
    const searchTermMatch = row[1].toLowerCase().includes(searchTerm.toLowerCase());
    return categoryMatch && searchTermMatch;
  });

  return (
    <div className="container mx-auto p-8">
      {loading && <motion.div className="fixed top-0 left-0 right-0 bg-blue-500 text-white p-4">Loading...</motion.div>}

      <motion.div
        className="flex justify-between mb-6 p-4 bg-gradient-to-r from-purple-600 to-blue-500 rounded-lg shadow-md"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white rounded px-4 py-2 shadow-md transition-transform transform hover:scale-105"
        >
          Log Out
        </button>
        <input
          type="file"
          onChange={handleFileUpload}
          accept=".csv"
          className="border border-gray-300 rounded-lg px-4 py-2 cursor-pointer bg-white text-gray-700 shadow-sm hover:shadow-md transition-transform transform hover:scale-105"
        />
      </motion.div>

      <div className="mb-6">
        <motion.input
          type="text"
          placeholder="Search emails..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded-lg p-2 w-full mb-4 shadow-sm"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        />
        <motion.select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border border-gray-300 rounded-lg p-2 w-full mb-4 shadow-sm"
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
        className="bg-white rounded-2xl shadow-lg overflow-hidden"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="bg-[#f5f5f7] text-gray-700">
            <tr>
              <th className="px-6 py-4">Title</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Summary</th>
              <th className="px-6 py-4">Promo Code</th>
              <th className="px-6 py-4">Expiry Date</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmailData.map((row, index) => (
              <motion.tr
                key={index}
                className="border-b hover:bg-gray-100 transition-colors"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <td className="px-6 py-4">{row[1]}</td>
                <td className="px-6 py-4">{row[2]}</td>
                <td className="px-6 py-4">{row[3]}</td>
                <td className="px-6 py-4">{row[4]}</td>
                <td className="px-6 py-4">{format(parseISO(row[5]), 'MMMM d, yyyy')}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleDelete(index)}
                    className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition-transform transform hover:scale-105"
                  >
                    🗑️
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      <div className="flex justify-end mt-6">
        <motion.button
          onClick={handleSaveToDatabase}
          className="bg-green-500 hover:bg-green-600 text-white rounded-lg px-6 py-3 shadow-md transition-transform transform hover:scale-105"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          Save to Database
        </motion.button>
      </div>
    </div>
  );
};

export default CombinedCsvAndSearchPage;
