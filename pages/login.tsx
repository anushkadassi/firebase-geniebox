'use client';// Using the client side rather than the default
 
//Import necessary dependencies
import { useState } from 'react';
import { useRouter } from 'next/router';
import { signInWithGoogle, saveUserData } from '../firebase';
import Image from 'next/image';
import googleSignInButton from '../public/0023352_sign-in-with-google-plugin_550.png';
import genieboxLogo from '../public/geniebox.jpg';
 
// LoginPage component definition
const LoginPage = () => {
  const router = useRouter();
  const [termsAccepted, setTermsAccepted] = useState(false);
  
  // Function to handle Google Login
  const handleGoogleLogin = () => { 
    // Ensure the user has accepted terms before proceeding
    if (termsAccepted) {
      signInWithGoogle()
        .then((result) => {
          const user = result.user; // Get user details from the result
          // Redirect to the dashboard page after successful login
          router.push('./Components/CombinedCsvAndSearchPage');
          // Save user details in the database
          const userData = {
            displayName: user.displayName,
            email: user.email,
            lastLogin: new Date().toISOString(), // Current timestamp
          };
          saveUserData(user.uid, userData); // Save data
        })
        .catch((error) => {
          console.error('Error during sign-in: ', error); // Log any errors
        });
    }
  };
 
  //Styling - centered, google login, terms and conditions, background, box container
  return (
    <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        padding: '1rem',
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
        padding: '2rem',
        borderRadius: '0.5rem',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '28rem',
        position: 'relative'
      }}>
        {/* Logo section */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <div style={{
            width: '180px',
            height: '160px',
            position: 'relative',
            marginBottom: '1rem',
            border: '2px solid #e5e7eb',
            borderRadius: '8px',
            padding: '4px',
            background: 'white',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
          }}>
            <div style={{
              width: '100%',
              height: '100%',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <Image
                src="/geniebox.jpg"
                alt="Geniebox Logo"
                layout="fill"
                objectFit="cover"
                style={{ 
                  borderRadius: '4px',
                }}
              />
            </div>
          </div>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#1f2937'
          }}>Sign In to Geniebox</h2>
          <p style={{
            color: '#4b5563',
            marginTop: '0.5rem'
          }}>Login using your Google account</p>
        </div>

        {/* Google Sign In Button */}
        <button
          onClick={handleGoogleLogin}
          disabled={!termsAccepted}
          style={{
            width: '100%',
            padding: '0.75rem 1rem',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            background: 'white',
            border: '2px solid #e5e7eb',
            borderRadius: '0.5rem',
            color: '#374151',
            fontWeight: '500',
            transition: 'all 0.2s',
            cursor: termsAccepted ? 'pointer' : 'not-allowed',
            opacity: termsAccepted ? '1' : '0.5',
            ':hover': termsAccepted ? {
              background: '#f9fafb',
              borderColor: '#d1d5db'
            } : {}
          }}
        >
          <svg style={{ width: '1.25rem', height: '1.25rem' }} viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Login with Google
        </button>

        {/* Terms and Conditions Checkbox */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginTop: '1rem'
        }}>
          <input
            type="checkbox"
            id="termsCheckbox"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            style={{
              width: '1rem',
              height: '1rem',
              borderRadius: '0.25rem',
              borderColor: '#d1d5db'
            }}
          />
          <label 
            htmlFor="termsCheckbox" 
            style={{
              fontSize: '0.875rem',
              color: '#4b5563'
            }}
          >
            By signing in, I accept all the Terms and Conditions
          </label>
        </div>
      </div>
    </div>
  );
};
 
export default LoginPage;


