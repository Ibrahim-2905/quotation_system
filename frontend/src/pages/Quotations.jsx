import React, { useState, useEffect } from 'react';
import QuotationList from '../components/quotations/QuotationList';
import QuotationForm from '../components/quotations/QuotationForm';
import { Plus, X, FileText, TrendingUp, DollarSign, Calendar } from 'lucide-react';
import { getQuotations } from '../services/api';

const Quotations = () => {
  const [showForm, setShowForm] = useState(false);
  const [stats, setStats] = useState({
    totalQuotations: 0,
    thisMonth: 0,
    pending: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuotationsStats();
  }, []);

  const fetchQuotationsStats = async () => {
    try {
      const response = await getQuotations();
      const quotations = Array.isArray(response.data.data) 
        ? response.data.data 
        : Array.isArray(response.data) 
        ? response.data 
        : [];

      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      
      // Calculate stats
      const thisMonthCount = quotations.filter(quote => {
        const quoteDate = new Date(quote.createdAt || quote.date);
        return quoteDate.getMonth() === currentMonth && 
               quoteDate.getFullYear() === currentYear;
      }).length;

      const pendingCount = quotations.filter(quote => 
        quote.status === 'pending' || quote.status === 'draft'
      ).length;

      setStats({
        totalQuotations: quotations.length,
        thisMonth: thisMonthCount,
        pending: pendingCount
      });
    } catch (error) {
      console.error('Error fetching quotations stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = () => {
    setShowForm(false);
    fetchQuotationsStats(); // Refresh stats after creating new quotation
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-2">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-2xl shadow-lg">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-800">Quotations</h1>
              <p className="text-gray-600 mt-1">Manage and create professional quotations</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wide">Total Quotations</h3>
                <p className="text-3xl font-bold text-gray-800 mt-2">
                  {loading ? '...' : stats.totalQuotations}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <FileText className="w-8 h-8 text-blue-500" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wide">This Month</h3>
                <p className="text-3xl font-bold text-gray-800 mt-2">
                  {loading ? '...' : stats.thisMonth}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <TrendingUp className="w-8 h-8 text-green-500" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wide">Pending</h3>
                <p className="text-3xl font-bold text-gray-800 mt-2">
                  {loading ? '...' : stats.pending}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Calendar className="w-8 h-8 text-purple-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-800 mb-2">Quotation Management</h2>
              <p className="text-gray-600">Create, manage, and track your quotations</p>
            </div>
            
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center justify-center space-x-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-xl hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg font-semibold"
            >
              <Plus className="w-5 h-5" />
              <span>Create Quotation</span>
            </button>
          </div>
        </div>

        {/* Quotation List */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="border-b border-gray-200 px-6 py-4 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">Recent Quotations</h2>
              <div className="text-sm text-gray-500">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                  {loading ? 'Loading...' : `${stats.totalQuotations} total quotations`}
                </span>
              </div>
            </div>
          </div>
          <div className="p-6">
            <QuotationList onQuotationUpdate={fetchQuotationsStats} />
          </div>
        </div>
      </div>

      {/* Create Quotation Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-white bg-opacity-20 p-3 rounded-xl">
                    <FileText className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Create New Quotation</h2>
                    <p className="text-blue-100 mt-1">
                      Fill in the details to create a professional quotation
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowForm(false)}
                  className="text-white hover:bg-white hover:bg-opacity-20 p-3 rounded-xl transition-all duration-200 hover:rotate-90"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-8 max-h-[calc(95vh-120px)] overflow-y-auto">
              <QuotationForm onSuccess={handleSuccess} />
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-200 px-8 py-6 bg-gray-50">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setShowForm(false)}
                  className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-xl hover:border-gray-400 transition-colors duration-200 font-medium"
                >
                  Cancel
                </button>
                <div className="text-sm text-gray-500">
                  All fields marked with * are required
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Quotations;