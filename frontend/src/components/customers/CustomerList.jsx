import React, { useState, useEffect } from 'react';
import { getCustomers, deleteCustomer } from '../../services/api';
import toast from 'react-hot-toast';
import { Trash2, Edit, Users, Search, Filter, Mail, Phone, Building, User } from 'lucide-react';

const CustomerList = ({ onEdit }) => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [companyFilter, setCompanyFilter] = useState('all');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await getCustomers();
      console.log('Full response:', response);
      console.log('Response data:', response.data);
      
      // Extract array from nested structure
      const customerData = response.data.data || response.data || [];
      console.log('Customer data:', customerData);
      
      // Ensure it's an array
      if (Array.isArray(customerData)) {
        setCustomers(customerData);
      } else {
        console.error('Customer data is not an array:', customerData);
        setCustomers([]);
        toast.error('Invalid data format received');
      }
    } catch (error) {
      console.error('Fetch customers error:', error);
      toast.error('Failed to load customers');
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await deleteCustomer(id);
        toast.success('Customer deleted successfully');
        fetchCustomers();
      } catch (error) {
        toast.error('Failed to delete customer');
      }
    }
  };

  // Filter customers based on search and company
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.phone?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCompany = companyFilter === 'all' || 
                          (companyFilter === 'with' && customer.company) ||
                          (companyFilter === 'without' && !customer.company);
    return matchesSearch && matchesCompany;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading customers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Customers</h1>
            <p className="text-gray-600">Manage your customer database</p>
          </div>

          {/* Search and Filter Section */}
          <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search Input */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search by name, email, or phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  />
                </div>
              </div>
              
              {/* Company Filter */}
              <div className="flex gap-4">
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <select
                    value={companyFilter}
                    onChange={(e) => setCompanyFilter(e.target.value)}
                    className="pl-10 pr-8 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white transition-all duration-200"
                  >
                    <option value="all">All Customers</option>
                    <option value="with">With Company</option>
                    <option value="without">Without Company</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Customers Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-blue-100">
          {filteredCustomers.length === 0 ? (
            <div className="text-center py-16">
              <Users size={64} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 text-lg mb-2">
                {customers.length === 0 ? 'No customers found' : 'No customers match your search'}
              </p>
              <p className="text-gray-400">
                {customers.length === 0 ? 'Get started by adding your first customer' : 'Try adjusting your search or filter'}
              </p>
            </div>
          ) : (
            <>
              {/* Table Header */}
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-white font-semibold text-lg">
                    {filteredCustomers.length} customer{filteredCustomers.length !== 1 ? 's' : ''} found
                  </h2>
                  <span className="text-blue-100 text-sm">
                    Total: {customers.length} customers
                  </span>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                        Customer Details
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                        Contact Information
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                        Company
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {filteredCustomers.map((customer) => (
                      <tr 
                        key={customer._id}
                        className="hover:bg-blue-50 transition-colors duration-150"
                      >
                        {/* Customer Details */}
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0">
                              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                                <User size={20} className="text-blue-600" />
                              </div>
                            </div>
                            <div>
                              <div className="font-semibold text-gray-800 text-lg">
                                {customer.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                Created: {new Date(customer.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Contact Information */}
                        <td className="px-6 py-4">
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Mail size={16} className="text-blue-500" />
                              <span className="text-gray-700">{customer.email}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Phone size={16} className="text-blue-500" />
                              <span className="text-gray-700">{customer.phone}</span>
                            </div>
                            {customer.address && (
                              <div className="text-sm text-gray-500 line-clamp-1">
                                {customer.address}
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Company */}
                        <td className="px-6 py-4">
                          {customer.company ? (
                            <div className="flex items-center space-x-2">
                              <Building size={16} className="text-blue-500" />
                              <span className="text-gray-700 font-medium">{customer.company}</span>
                            </div>
                          ) : (
                            <span className="text-gray-400 text-sm">No company</span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4">
                          <div className="flex justify-center space-x-3">
                            <button
                              onClick={() => onEdit(customer)}
                              className="flex items-center justify-center w-10 h-10 bg-blue-100 text-blue-600 rounded-xl hover:bg-blue-200 transition-all duration-200 shadow-sm hover:shadow-md"
                              title="Edit Customer"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(customer._id)}
                              className="flex items-center justify-center w-10 h-10 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-all duration-200 shadow-sm hover:shadow-md"
                              title="Delete Customer"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Table Footer */}
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <span>Showing {filteredCustomers.length} of {customers.length} customers</span>
                  <span className="text-blue-600 font-medium">
                    {customers.filter(c => c.company).length} with companies
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerList;