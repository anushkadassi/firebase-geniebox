'use client'; //Using client side instead of default server 

// Importing necessary modules from React anf Next. js
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

//Main component for the Home Page 
export default function Home() {
  const router = useRouter();
  
  //useeffect hook to handle redirection or one can also say routing
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/login');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  // Styling - Backgrpund creation, logo, card style, Heading and a more responsive design inclusion
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      flexDirection: 'column', 
      minHeight: '100vh',
      background: `
        repeating-linear-gradient(
          45deg,
          #E3F2FD,
          #E3F2FD 15px,
          #BBDEFB 15px,
          #BBDEFB 30px,
          #90CAF9 30px,
          #90CAF9 45px,
          #1976D2 45px,
          #1976D2 60px
        )
      `,
      backgroundSize: '200px 200px'
    }}>
      <div style={{
        background: 'white',
        padding: '2.5rem',
        borderRadius: '1rem',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        maxWidth: '32rem', // Increased to accommodate the tagline
        width: '90%'
      }}>
        <div style={{
          width: '150px',
          height: '150px',
          position: 'relative',
          marginBottom: '1.5rem',
          background: 'white',
          padding: '4px',
          borderRadius: '8px'
        }}>
          <Image
            src="/geniebox.jpg"
            alt="Firebase Geniebox Logo"
            layout="fill"
            objectFit="contain"
            priority
          />
        </div>
        <h1 style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          color: '#1f2937',
          textAlign: 'center',
          margin: '0 0 1rem 0', // Added bottom margin for spacing
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}>
          Welcome to Geniebox!
        </h1>
        <p style={{
          fontSize: '1.125rem',
          color: '#4b5563',
          textAlign: 'center',
          margin: 0,
          lineHeight: '1.5',
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          maxWidth: '90%' // Ensures the text doesn't get too wide
        }}>
          Your inbox's genie- granting you instant access to offers, memories, and hidden treasures with a simple wish!
        </p>
      </div>
    </div>
  );
}