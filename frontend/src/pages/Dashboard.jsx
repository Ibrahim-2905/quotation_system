import React, { useEffect, useState } from 'react';
import { getQuotations, getCustomers } from '../services/api';
import { Link } from 'react-router-dom';
import { FileText, Users, Calendar, Plus, ArrowRight, TrendingUp, User, Building } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalQuotations: 0,
    totalCustomers: 0,
    recentQuotations: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [quotationsRes, customersRes] = await Promise.all([
        getQuotations(),
        getCustomers()
      ]);
      
      // Extract arrays from nested structure
      const quotations = Array.isArray(quotationsRes.data?.data) 
        ? quotationsRes.data.data 
        : Array.isArray(quotationsRes.data) 
        ? quotationsRes.data 
        : [];
        
      const customers = Array.isArray(customersRes.data?.data)
        ? customersRes.data.data
        : Array.isArray(customersRes.data)
        ? customersRes.data
        : [];
      
      // Calculate total value of all quotations
      const totalValue = quotations.reduce((sum, quote) => sum + (quote.total || 0), 0);
      
      setStats({
        totalQuotations: quotations.length,
        totalCustomers: customers.length,
        totalValue: totalValue,
        recentQuotations: quotations.slice(0, 5)
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-blue-600 font-medium">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Dashboard Overview</h1>
        <p className="text-gray-600">Welcome to your quotation management system</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Quotations Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500 transform hover:scale-105 transition-transform duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wide">Total Quotations</h3>
              <p className="text-3xl font-bold text-gray-800 mt-2">{stats.totalQuotations}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <FileText size={24} className="text-blue-500" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-500">
            <TrendingUp size={16} className="mr-1" />
            All time quotations
          </div>
        </div>

        {/* Total Customers Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500 transform hover:scale-105 transition-transform duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wide">Total Customers</h3>
              <p className="text-3xl font-bold text-gray-800 mt-2">{stats.totalCustomers}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Users size={24} className="text-blue-500" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-500">
            <TrendingUp size={16} className="mr-1" />
            Active customers
          </div>
        </div>

        {/* Total Value Card */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-blue-100 text-sm font-medium uppercase tracking-wide">Total Value</h3>
              <p className="text-3xl font-bold mt-2">${(stats.totalValue || 0).toFixed(2)}</p>
            </div>
            <div className="bg-white bg-opacity-20 p-3 rounded-full">
              <TrendingUp size={24} className="text-white" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-blue-100">
            <Calendar size={16} className="mr-1" />
            All quotations value
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Quotations Section */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                <FileText size={20} className="mr-2 text-blue-500" />
                Recent Quotations
              </h2>
              <Link 
                to="/quotations" 
                className="text-blue-500 hover:text-blue-600 font-medium flex items-center"
              >
                View All
                <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>
          </div>
          
          <div className="p-6">
            {stats.recentQuotations.length > 0 ? (
              <div className="space-y-4">
                {stats.recentQuotations.map((quote) => (
                  <Link
                    key={quote._id}
                    to={`/quotations/${quote._id}`}
                    className="block p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-gray-800 group-hover:text-blue-600">
                            {quote.quotationNumber || 'N/A'}
                          </span>
                          <span className="text-lg font-bold text-gray-800">
                            ${quote.total ? quote.total.toFixed(2) : '0.00'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              <User size={14} className="mr-1" />
                              {quote.customer?.name || 'No customer'}
                            </div>
                            {quote.customer?.company && (
                              <div className="flex items-center">
                                <Building size={14} className="mr-1" />
                                {quote.customer.company}
                              </div>
                            )}
                          </div>
                          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            quote.status === 'accepted' ? 'bg-green-100 text-green-800' :
                            quote.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                            quote.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {quote.status || 'draft'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText size={24} className="text-blue-500" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No quotations yet</h3>
                <p className="text-gray-500 mb-6">Get started by creating your first quotation</p>
                <Link
                  to="/quotations/create"
                  className="inline-flex items-center px-4 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors duration-200"
                >
                  <Plus size={20} className="mr-2" />
                  Create Quotation
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions & Stats */}
        <div className="space-y-8">
          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <TrendingUp size={20} className="mr-2 text-blue-500" />
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <Link
                to="/quotations/create"
                className="bg-blue-50 p-4 rounded-xl border border-blue-200 hover:border-blue-300 hover:bg-blue-100 transition-all duration-200 text-center group"
              >
                <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-200">
                  <Plus size={24} className="text-blue-500" />
                </div>
                <span className="font-medium text-gray-700">New Quotation</span>
              </Link>
              
              <Link
                to="/customers"
                className="bg-blue-50 p-4 rounded-xl border border-blue-200 hover:border-blue-300 hover:bg-blue-100 transition-all duration-200 text-center group"
              >
                <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-200">
                  <Users size={24} className="text-blue-500" />
                </div>
                <span className="font-medium text-gray-700">Customers</span>
              </Link>
              
              <Link
                to="/quotations"
                className="bg-blue-50 p-4 rounded-xl border border-blue-200 hover:border-blue-300 hover:bg-blue-100 transition-all duration-200 text-center group"
              >
                <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-200">
                  <FileText size={24} className="text-blue-500" />
                </div>
                <span className="font-medium text-gray-700">All Quotes</span>
              </Link>
              
              <Link
                to="/reports"
                className="bg-blue-50 p-4 rounded-xl border border-blue-200 hover:border-blue-300 hover:bg-blue-100 transition-all duration-200 text-center group"
              >
                <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-200">
                  <TrendingUp size={24} className="text-blue-500" />
                </div>
                <span className="font-medium text-gray-700">Reports</span>
              </Link>
            </div>
          </div>

          {/* System Status */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <Calendar size={20} className="mr-2 text-blue-500" />
              System Status
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Quotations Today</span>
                <span className="font-semibold text-gray-800">0</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Active Customers</span>
                <span className="font-semibold text-green-600">{stats.totalCustomers}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Pending Quotes</span>
                <span className="font-semibold text-yellow-600">
                  {stats.recentQuotations.filter(q => q.status === 'draft' || q.status === 'sent').length}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Accepted Quotes</span>
                <span className="font-semibold text-green-600">
                  {stats.recentQuotations.filter(q => q.status === 'accepted').length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;