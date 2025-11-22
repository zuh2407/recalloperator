import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Shield, Upload, Lock } from 'lucide-react';

const Login = () => {
    const [businessId, setBusinessId] = useState('');
    const [password, setPassword] = useState('');
    const [file, setFile] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const formData = new FormData();
        formData.append('businessId', businessId);
        formData.append('password', password);
        if (file) {
            formData.append('document', file);
        }

        try {
            const res = await axios.post('http://localhost:3000/api/auth/login', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                <div className="bg-indigo-600 p-6 text-center">
                    <Shield className="w-12 h-12 text-white mx-auto mb-2" />
                    <h1 className="text-2xl font-bold text-white">Safety Automation System</h1>
                    <p className="text-indigo-100 text-sm">Business Partner Portal</p>
                </div>

                <div className="p-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">Secure Login</h2>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Business ID</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={businessId}
                                    onChange={(e) => setBusinessId(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                                    placeholder="BID-12345"
                                    required
                                />
                                <Shield className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <div className="relative">
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                                    placeholder="••••••••"
                                    required
                                />
                                <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Verification Document</label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 transition cursor-pointer relative">
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                                <span className="text-sm text-gray-500">
                                    {file ? file.name : 'Upload Business License'}
                                </span>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg transition duration-200 shadow-md hover:shadow-lg mt-6"
                        >
                            Authenticate
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
