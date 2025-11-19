import React, { useState, useEffect } from 'react';
import CustomerList from '../components/customers/CustomerList';
import CustomerForm from '../components/customers/CustomerForm';
import { Plus, X, Users, Search } from 'lucide-react';
import { getCustomers, getQuotations } from '../services/api';

const Customers = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    totalCustomers: 0,
    activeProjects: 0,
    newThisMonth: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [customersRes, quotationsRes] = await Promise.all([
        getCustomers(),
        getQuotations()
      ]);

      const customers = Array.isArray(customersRes.data.data) 
        ? customersRes.data.data 
        : Array.isArray(customersRes.data) 
        ? customersRes.data 
        : [];

      const quotations = Array.isArray(quotationsRes.data.data) 
        ? quotationsRes.data.data 
        : Array.isArray(quotationsRes.data) 
        ? quotationsRes.data 
        : [];

      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      
      const newThisMonth = customers.filter(customer => {
        const customerDate = new Date(customer.createdAt || customer.date);
        return customerDate.getMonth() === currentMonth && 
               customerDate.getFullYear() === currentYear;
      }).length;

      const activeProjects = quotations.filter(quote => 
        quote.status === 'active' || quote.status === 'pending'
      ).length;

      setStats({
        totalCustomers: customers.length,
        activeProjects,
        newThisMonth
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (customer) => {
    setSelectedCustomer(customer);
    setShowForm(true);
  };

  const handleSuccess = () => {
    setShowForm(false);
    setSelectedCustomer(null);
    fetchStats(); // Refresh stats after successful operation
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <div className="bg-blue-500 p-2 rounded-xl">
            <Users className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-800">Customers</h1>
            <p className="text-gray-600 mt-1">Manage your customer database</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Customers Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wide">Total Customers</h3>
              <p className="text-3xl font-bold text-gray-800 mt-2">
                {loading ? '...' : stats.totalCustomers}
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </div>
        </div>

        {/* Active Projects Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wide">Active Projects</h3>
              <p className="text-3xl font-bold text-gray-800 mt-2">
                {loading ? '...' : stats.activeProjects}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* New This Month Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wide">New This Month</h3>
              <p className="text-3xl font-bold text-gray-800 mt-2">
                {loading ? '...' : stats.newThisMonth}
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <Plus className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Actions Bar */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-2xl">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search customers by name, email, or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none"
            />
          </div>
          
          {/* Add Customer Button */}
          <button
            onClick={() => {
              setSelectedCustomer(null);
              setShowForm(true);
            }}
            className="flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg font-medium"
          >
            <Plus className="w-5 h-5" />
            <span>Add Customer</span>
          </button>
        </div>
      </div>

      {/* Customer List Section */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">Customer Directory</h2>
            <div className="text-sm text-gray-500">
              Showing <span className="font-semibold text-gray-800">{stats.totalCustomers}</span> customers
            </div>
          </div>
        </div>
        <div className="p-6">
          <CustomerList onEdit={handleEdit} searchTerm={searchTerm} />
        </div>
      </div>

      {/* Customer Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-white">
                    {selectedCustomer ? 'Edit Customer' : 'Add New Customer'}
                  </h2>
                </div>
                <button 
                  onClick={() => setShowForm(false)}
                  className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors duration-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 max-h-[calc(90vh-80px)] overflow-y-auto">
              <CustomerForm 
                customer={selectedCustomer} 
                onSuccess={handleSuccess}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;