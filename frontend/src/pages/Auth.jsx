import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const navigate = useNavigate();

    // Handle Google Login Success
    const handleGoogleSuccess = async (credentialResponse) => {
        setLoading(true);
        try {
            
            const { data } = await axios.post(`http://localhost:8000/api/auth/google`, {
                token: credentialResponse.credential
            });

            
            localStorage.setItem('profile', JSON.stringify(data));
            localStorage.setItem('token', data.token);

            if (data.user.role === 'admin') {
                navigate('/admin-dashboard');
            } else {
                navigate('/home');
            }
            window.location.reload(); 
        } catch (err) {
            console.error("Google Auth Error:", err);
            alert("Google Authentication failed. Check console for details.");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const endpoint = isLogin ? '/auth/login' : '/auth/register';
        
        try {
            const { data } = await axios.post(`http://localhost:8000/api${endpoint}`, formData);
            
            if (isLogin) {
                localStorage.setItem('profile', JSON.stringify(data));
                localStorage.setItem('token', data.token);
                
                if (data.user.role === 'admin') {
                    navigate('/admin-dashboard');
                } else {
                    navigate('/home');
                }
                window.location.reload();
            } else {
                alert("Registration successful! Please login.");
                setIsLogin(true);
            }
        } catch (err) {
            alert(err.response?.data?.message || "Authentication failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-gray-200 p-4">
            <div className="bg-white rounded-3xl shadow-2xl flex flex-col md:flex-row max-w-4xl w-full overflow-hidden border border-white">
                
                {/* Visual Side */}
                <div className="bg-blue-600 md:w-1/2 p-12 text-white flex flex-col justify-center items-center text-center">
                    <h2 className="text-4xl font-extrabold mb-4">
                        {isLogin ? "Welcome Back!" : "Join the Club!"}
                    </h2>
                    <p className="text-blue-100 mb-8 max-w-xs">
                        {isLogin 
                            ? "Sign in to manage your activities and stay connected with your team." 
                            : "Create an account to explore campus clubs and start your journey today."}
                    </p>
                    <div className="w-24 h-1 bg-blue-400 rounded-full opacity-50"></div>
                </div>

                {/* Form Side */}
                <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <header className="mb-6">
                            <h3 className="text-3xl font-bold text-gray-800">{isLogin ? 'Sign In' : 'Sign Up'}</h3>
                            <p className="text-gray-500 text-sm mt-2">Please enter your details to continue.</p>
                        </header>
                        
                        {!isLogin && (
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Full Name</label>
                                <input 
                                    type="text" placeholder="John Doe" 
                                    className="w-full p-3 mt-1 border-b-2 border-gray-100 focus:border-blue-500 outline-none transition-all"
                                    onChange={(e) => setFormData({...formData, name: e.target.value})} required 
                                />
                            </div>
                        )}
                        
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email Address</label>
                            <input 
                                type="email" placeholder="name@college.edu" 
                                className="w-full p-3 mt-1 border-b-2 border-gray-100 focus:border-blue-500 outline-none transition-all"
                                onChange={(e) => setFormData({...formData, email: e.target.value})} required 
                            />
                        </div>
                        
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Password</label>
                            <input 
                                type="password" placeholder="••••••••" 
                                className="w-full p-3 mt-1 border-b-2 border-gray-100 focus:border-blue-500 outline-none transition-all"
                                onChange={(e) => setFormData({...formData, password: e.target.value})} required 
                            />
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className={`w-full bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all transform active:scale-[0.98] mt-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'Processing...' : (isLogin ? 'Login to Dashboard' : 'Create My Account')}
                        </button>

                        {/* Divider */}
                        <div className="relative my-4">
                            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-100"></span></div>
                            <div className="relative flex justify-center text-[10px] uppercase font-bold text-gray-400"><span className="bg-white px-2">Or continue with</span></div>
                        </div>

                        
                        <div className="flex justify-center w-full overflow-hidden">
                            <GoogleLogin 
                                onSuccess={handleGoogleSuccess} 
                                onError={() => alert("Google Login Failed")}
                                theme="outline"
                                shape="pill"
                                width="350" 
                            />
                        </div>

                        <p className="mt-6 text-sm text-center text-gray-600">
                            {isLogin ? "Don't have an account?" : "Already a member?"} 
                            <span 
                                onClick={() => setIsLogin(!isLogin)} 
                                className="text-blue-600 font-bold ml-1 cursor-pointer hover:underline"
                            >
                                {isLogin ? "Register now" : "Login here"}
                            </span>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Auth;