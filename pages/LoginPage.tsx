'use client'

import { useState } from 'react';
import { useRouter } from 'next/router';
import { signInWithGoogle, saveUserData } from './firebase';

const LoginPage = () => {
    const router = useRouter();

    const handleGoogleLogin = () => {
        signInWithGoogle()
            .then((result) => {
                const user = result.user;
                // Redirect to the dashboard page after successful login
                router.push('/dashboard');
                const userData = {
                    displayName: user.displayName,
                    email: user.email,
                    lastLogin: new Date().toISOString(),
                  };
                  saveUserData(user.uid, userData);
                })
            .catch((error) => {
                console.error('Error during sign-in: ', error);
            });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
            <div className="bg-white p-8 rounded-lg shadow-xl w-96">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome to Email Dashboard</h1>
                    <p className="text-gray-600">Sign in to access your dashboard</p>
                </div>
                
                <button onClick={handleGoogleLogin} className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 rounded-lg px-6 py-3 text-gray-700 hover:bg-gray-50">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px">
                        {/* SVG paths for Google icon */}
                        <path fill="#4285F4" d="..." />
                        <path fill="#34A853" d="..." />
                        <path fill="#FBBC05" d="..." />
                        <path fill="#EA4335" d="..." />
                    </svg>
                    Sign in with Google
                </button>

                <p className="text-sm text-center text-gray-500 mt-4">
                    By signing in, you agree to our Terms and Privacy Policy
                </p>
            </div>
        </div>
    );
}

export default LoginPage;




// 'use client'

// import { useRouter } from 'next/navigation';
// import { signInWithGoogle } from './firebase';

// const LoginPage = ({ onLoginSuccess }) => {
//   const router = useRouter();

//   const handleGoogleLogin = () => {
//     signInWithGoogle()
//       .then(() => {
//         onLoginSuccess(); // Set the authenticated state to true
//         router.push('/dashboard');
//       })
//       .catch((error) => {
//         console.error('Error during sign-in: ', error);
//       });
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
//       <div className="bg-white p-8 rounded-lg shadow-xl w-96">
//         <div className="text-center mb-8">
//           <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome to Email Dashboard</h1>
//           <p className="text-gray-600">Sign in to access your dashboard</p>
//         </div>
//         <button onClick={handleGoogleLogin} className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 rounded-lg px-6 py-3 text-gray-700 hover:bg-gray-50">
//           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px">
//             {/* SVG paths */}
//           </svg>
//           Sign in with Google
//         </button>
//         <p className="text-sm text-center text-gray-500 mt-4">
//           By signing in, you agree to our Terms and Privacy Policy
//         </p>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;
