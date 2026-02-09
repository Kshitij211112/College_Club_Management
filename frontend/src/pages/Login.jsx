import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google'; // Ensure this is imported

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post('http://localhost:8000/api/auth/google', {
        token: credentialResponse.credential 
      });
      localStorage.setItem('profile', JSON.stringify({
        token: res.data.token,
        user: res.data.user
      }));
      navigate('/home');
      window.location.reload();
    } catch (err) {
      setError("Google Login Failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      {/* Container to match your design */}
      <div className="flex w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden">
        
        {/* Left Side: Welcome Panel (Blue) */}
        <div className="hidden md:flex w-1/2 bg-blue-600 p-12 flex-col justify-center text-white text-center">
          <h2 className="text-4xl font-bold mb-4">Welcome Back!</h2>
          <p className="text-blue-100">Sign in to manage your activities and stay connected with your team.</p>
        </div>

        {/* Right Side: Form Content (White) */}
        <div className="w-full md:w-1/2 p-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Sign In</h2>
          <p className="text-gray-400 mb-8">Please enter your details to continue.</p>

          <form className="space-y-4">
            <input type="email" placeholder="Email Address" className="w-full p-3 border-b border-gray-200 outline-none focus:border-blue-600" />
            <input type="password" placeholder="Password" className="w-full p-3 border-b border-gray-200 outline-none focus:border-blue-600" />
            <button className="w-full bg-blue-600 text-white py-3 rounded-full font-bold shadow-lg hover:bg-blue-700">
              Login to Dashboard
            </button>
          </form>

          {/* --- THE MISSING GOOGLE BUTTON SECTION --- */}
          <div className="relative my-8 text-center">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200"></span>
            </div>
            <span className="relative bg-white px-4 text-xs text-gray-400 uppercase font-bold">Or continue with</span>
          </div>

          <div className="flex justify-center">
            {/* This is the physical button component */}
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError("Google Login Failed")}
              useOneTap
              theme="outline"
              shape="pill"
            />
          </div>
         

          <p className="mt-8 text-center text-sm text-gray-500">
            Don't have an account? <span className="text-blue-600 cursor-pointer font-bold" onClick={() => navigate('/signup')}>Register now</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;