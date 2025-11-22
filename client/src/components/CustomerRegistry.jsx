import React, { useState } from 'react';
import axios from 'axios';
import { UserPlus, Mail, Phone } from 'lucide-react';

const CustomerRegistry = ({ customers, fetchCustomers, businessId }) => {
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post(`http://localhost:3000/api/customers?businessId=${businessId}`, formData);
            setFormData({ name: '', email: '', phone: '' });
            setShowForm(false);
            fetchCustomers();
        } catch (error) {
            console.error('Failed to add customer', error);
            alert('Failed to add customer: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">Customer Registry</h2>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center text-sm font-medium transition"
                >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add Customer
                </button>
            </div>

            {showForm && (
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">New Customer Registration</h3>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input
                            type="text"
                            placeholder="Full Name"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            className="bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                            required
                        />
                        <input
                            type="email"
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                            className="bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                            required
                        />
                        <input
                            type="text"
                            placeholder="Phone (Optional)"
                            value={formData.phone}
                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                            className="bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                        <div className="md:col-span-3 flex justify-end">
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-medium transition"
                            >
                                {loading ? 'Registering...' : 'Register Customer'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-800/50 border-b border-slate-700">
                                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Contact Info</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Purchases</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {customers.map((customer) => (
                                <tr key={customer.id} className="hover:bg-slate-800/30 transition">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <div className="h-8 w-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold mr-3">
                                                {customer.name.charAt(0)}
                                            </div>
                                            <span className="text-slate-200 font-medium">{customer.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="space-y-1">
                                            <div className="flex items-center text-sm text-slate-400">
                                                <Mail className="w-3 h-3 mr-2" /> {customer.email}
                                            </div>
                                            {customer.phone && (
                                                <div className="flex items-center text-sm text-slate-400">
                                                    <Phone className="w-3 h-3 mr-2" /> {customer.phone}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                                            {customer.purchasedProducts.length} Items
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-emerald-400 text-xs font-medium bg-emerald-400/10 px-2 py-1 rounded-full">
                                            Active
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CustomerRegistry;
