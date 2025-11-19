import React, { useState, useEffect } from 'react';
import { getQuotations, deleteQuotation } from '../../services/api';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Trash2, Eye, Edit, FileText, Search, Filter, Download } from 'lucide-react';

const QuotationList = () => {
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchQuotations();
  }, []);

  const fetchQuotations = async () => {
    try {
      const response = await getQuotations();
      console.log('Full response:', response);
      console.log('Response data:', response.data);
      
      // Extract array from nested structure
      const quotationData = response.data.data || response.data || [];
      console.log('Quotation data:', quotationData);
      
      // Ensure it's an array
      if (Array.isArray(quotationData)) {
        setQuotations(quotationData);
      } else {
        console.error('Quotation data is not an array:', quotationData);
        setQuotations([]);
        toast.error('Invalid data format received');
      }
    } catch (error) {
      console.error('Fetch quotations error:', error);
      toast.error('Failed to load quotations');
      setQuotations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this quotation?')) {
      try {
        await deleteQuotation(id);
        toast.success('Quotation deleted successfully');
        fetchQuotations();
      } catch (error) {
        toast.error('Failed to delete quotation');
      }
    }
  };

  // Filter quotations based on search and status
  const filteredQuotations = quotations.filter(quotation => {
    const matchesSearch = quotation.quotationNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quotation.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || quotation.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading quotations...</p>
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
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Quotations</h1>
            <p className="text-gray-600">Manage and track all your quotations</p>
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
                    placeholder="Search by quotation number or customer..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  />
                </div>
              </div>
              
              {/* Status Filter */}
              <div className="flex gap-4">
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="pl-10 pr-8 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white transition-all duration-200"
                  >
                    <option value="all">All Status</option>
                    <option value="draft">Draft</option>
                    <option value="sent">Sent</option>
                    <option value="accepted">Accepted</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                
                <button className="flex items-center space-x-2 bg-white text-gray-700 px-4 py-3 rounded-xl hover:bg-gray-50 transition-all duration-200 border border-gray-200 shadow-sm">
                  <Download size={20} />
                  <span>Export</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quotations Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-blue-100">
          {filteredQuotations.length === 0 ? (
            <div className="text-center py-16">
              <FileText size={64} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 text-lg mb-2">
                {quotations.length === 0 ? 'No quotations found' : 'No quotations match your search'}
              </p>
              <p className="text-gray-400">
                {quotations.length === 0 ? 'Get started by creating your first quotation' : 'Try adjusting your search or filter'}
              </p>
            </div>
          ) : (
            <>
              {/* Table Header */}
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-white font-semibold text-lg">
                    {filteredQuotations.length} quotation{filteredQuotations.length !== 1 ? 's' : ''} found
                  </h2>
                  <span className="text-blue-100 text-sm">
                    Total: ${filteredQuotations.reduce((sum, q) => sum + (q.total || 0), 0).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                        Quotation Details
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {filteredQuotations.map((quotation) => (
                      <tr 
                        key={quotation._id}
                        className="hover:bg-blue-50 transition-colors duration-150"
                      >
                        {/* Quotation Details */}
                        <td className="px-6 py-4">
                          <Link
                            to={`/quotations/${quotation._id}`}
                            className="group block"
                          >
                            <div className="font-semibold text-blue-600 group-hover:text-blue-800 transition-colors duration-200">
                              {quotation.quotationNumber || 'N/A'}
                            </div>
                            <div className="text-sm text-gray-500 mt-1 line-clamp-2">
                              {quotation.items?.[0]?.description || 'No description'}
                            </div>
                          </Link>
                        </td>

                        {/* Customer */}
                        <td className="px-6 py-4">
                          <div className="text-gray-800 font-medium">
                            {quotation.customer?.name || 'N/A'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {quotation.customer?.company || 'Individual'}
                          </div>
                        </td>

                        {/* Amount */}
                        <td className="px-6 py-4 text-right">
                          <div className="text-lg font-bold text-blue-600">
                            ${quotation.total ? quotation.total.toFixed(2) : '0.00'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {quotation.items?.length || 0} items
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                            quotation.status === 'accepted' ? 'bg-green-100 text-green-800' :
                            quotation.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                            quotation.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {quotation.status || 'draft'}
                          </span>
                        </td>

                        {/* Date */}
                        <td className="px-6 py-4">
                          <div className="text-gray-800">
                            {new Date(quotation.createdAt).toLocaleDateString()}
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(quotation.createdAt).toLocaleTimeString()}
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4">
                          <div className="flex justify-center space-x-3">
                            <Link
                              to={`/quotations/${quotation._id}`}
                              className="flex items-center justify-center w-10 h-10 bg-blue-100 text-blue-600 rounded-xl hover:bg-blue-200 transition-all duration-200 shadow-sm hover:shadow-md"
                              title="View Quotation"
                            >
                              <Eye size={18} />
                            </Link>
                            <Link
                              to={`/quotations/edit/${quotation._id}`}
                              className="flex items-center justify-center w-10 h-10 bg-green-100 text-green-600 rounded-xl hover:bg-green-200 transition-all duration-200 shadow-sm hover:shadow-md"
                              title="Edit Quotation"
                            >
                              <Edit size={18} />
                            </Link>
                            <button
                              onClick={() => handleDelete(quotation._id)}
                              className="flex items-center justify-center w-10 h-10 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-all duration-200 shadow-sm hover:shadow-md"
                              title="Delete Quotation"
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
                  <span>Showing {filteredQuotations.length} of {quotations.length} quotations</span>
                  <span className="text-blue-600 font-medium">
                    Total Value: ${filteredQuotations.reduce((sum, q) => sum + (q.total || 0), 0).toFixed(2)}
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

export default QuotationList;