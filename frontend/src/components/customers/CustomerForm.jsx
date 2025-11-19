import React, { useState, useEffect } from 'react';
import { createCustomer, updateCustomer } from '../../services/api';
import toast from 'react-hot-toast';
import { User, Mail, Phone, Building, MapPin, Save, UserPlus } from 'lucide-react';

const CustomerForm = ({ customer, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    company: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (customer) {
      setFormData(customer);
    }
  }, [customer]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (customer) {
        await updateCustomer(customer._id, formData);
        toast.success('Customer updated successfully!');
      } else {
        await createCustomer(formData);
        toast.success('Customer created successfully!');
      }
      onSuccess();
    } catch (error) {
      toast.error('Failed to save customer');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-blue-100 p-8 mb-6">
          <div className="flex items-center space-x-4 mb-2">
            <div className="p-3 bg-blue-100 rounded-xl">
              {customer ? (
                <User size={32} className="text-blue-600" />
              ) : (
                <UserPlus size={32} className="text-blue-600" />
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                {customer ? 'Update Customer' : 'Create New Customer'}
              </h1>
              <p className="text-gray-600 mt-1">
                {customer ? 'Update customer information' : 'Add a new customer to your database'}
              </p>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-blue-100 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8">
            <div className="space-y-6">
              {/* Name Field */}
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  <User size={18} className="inline mr-2 text-blue-500" />
                  Full Name *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="name"
                    className="w-full px-4 py-4 pl-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter customer full name"
                    required
                  />
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                </div>
              </div>

              {/* Email Field */}
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  <Mail size={18} className="inline mr-2 text-blue-500" />
                  Email Address *
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    className="w-full px-4 py-4 pl-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email address"
                    required
                  />
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                </div>
              </div>

              {/* Phone Field */}
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  <Phone size={18} className="inline mr-2 text-blue-500" />
                  Phone Number *
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    name="phone"
                    className="w-full px-4 py-4 pl-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    required
                  />
                  <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                </div>
              </div>

              {/* Company Field */}
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  <Building size={18} className="inline mr-2 text-blue-500" />
                  Company
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="company"
                    className="w-full px-4 py-4 pl-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="Enter company name (optional)"
                  />
                  <Building className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                </div>
              </div>

              {/* Address Field */}
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  <MapPin size={18} className="inline mr-2 text-blue-500" />
                  Address
                </label>
                <div className="relative">
                  <textarea
                    name="address"
                    className="w-full px-4 py-4 pl-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white resize-none"
                    rows="4"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter full address (optional)"
                  />
                  <MapPin className="absolute left-4 top-4 transform -translate-y-1/2 text-gray-400" size={20} />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 px-6 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                    <span>Saving...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-3">
                    <Save size={24} />
                    <span>{customer ? 'Update Customer' : 'Create Customer'}</span>
                  </div>
                )}
              </button>

              {/* Required Fields Note */}
              <div className="text-center">
                <p className="text-sm text-gray-500">
                  Fields marked with * are required
                </p>
              </div>
            </div>
          </form>
        </div>

        {/* Info Card */}
        <div className="bg-blue-50 rounded-2xl border border-blue-200 p-6 mt-6">
          <div className="flex items-start space-x-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <User size={20} className="text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Customer Information</h3>
              <p className="text-sm text-gray-600">
                Complete customer details help in creating accurate quotations and maintaining proper records. 
                All information is securely stored and can be updated at any time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerForm;