import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuotation, updateQuotation } from '../services/api';
import toast from 'react-hot-toast';
import { ArrowLeft, Download, Send, User, Building, Phone, Mail, Calendar, FileText } from 'lucide-react';

const QuotationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quotation, setQuotation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuotation();
  }, [id]);

  const fetchQuotation = async () => {
    try {
      const response = await getQuotation(id);
      console.log('Quotation response:', response.data);
      
      // Extract quotation from nested structure
      const quotationData = response.data.data || response.data;
      console.log('Quotation data:', quotationData);
      
      setQuotation(quotationData);
    } catch (error) {
      console.error('Fetch quotation error:', error);
      toast.error('Failed to load quotation');
      navigate('/quotations');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (status) => {
    try {
      await updateQuotation(id, { ...quotation, status });
      toast.success(`Status updated to ${status}`);
      fetchQuotation();
    } catch (error) {
      console.error('Update status error:', error);
      toast.error('Failed to update status');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading quotation details...</p>
        </div>
      </div>
    );
  }

  if (!quotation) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg border border-blue-100">
          <FileText size={64} className="mx-auto text-blue-500 mb-4" />
          <p className="text-gray-600 mb-6 text-lg">Quotation not found</p>
          <button
            onClick={() => navigate('/quotations')}
            className="bg-blue-500 text-white px-6 py-3 rounded-xl hover:bg-blue-600 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Back to Quotations
          </button>
        </div>
      </div>
    );
  }

  // Safely access nested properties
  const items = quotation.items || [];
  const customer = quotation.customer || {};
  const createdBy = quotation.createdBy || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Actions */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 no-print">
          <button
            onClick={() => navigate('/quotations')}
            className="flex items-center space-x-3 bg-white text-blue-600 px-6 py-3 rounded-xl hover:bg-blue-50 transition-all duration-200 shadow-sm hover:shadow-md border border-blue-100"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back to Quotations</span>
          </button>
          
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-3 bg-white text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md border border-gray-200"
            >
              <Download size={20} />
              <span className="font-medium">Print/Download</span>
            </button>
            {quotation.status === 'draft' && (
              <button
                onClick={() => updateStatus('sent')}
                className="flex items-center space-x-3 bg-blue-500 text-white px-6 py-3 rounded-xl hover:bg-blue-600 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <Send size={20} />
                <span className="font-medium">Mark as Sent</span>
              </button>
            )}
          </div>
        </div>

        {/* Main Quotation Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-blue-100 print:shadow-none">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-8 text-white">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div>
                <h1 className="text-4xl font-bold mb-2">QUOTATION</h1>
                <div className="flex items-center space-x-4 text-blue-100">
                  <div className="flex items-center space-x-2">
                    <FileText size={18} />
                    <span>#{quotation.quotationNumber || 'N/A'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar size={18} />
                    <span>{quotation.createdAt ? new Date(quotation.createdAt).toLocaleDateString() : 'N/A'}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-3">
                <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
                  quotation.status === 'accepted' ? 'bg-green-500 text-white' :
                  quotation.status === 'sent' ? 'bg-blue-400 text-white' :
                  quotation.status === 'rejected' ? 'bg-red-500 text-white' :
                  'bg-gray-400 text-white'
                }`}>
                  {quotation.status?.toUpperCase() || 'DRAFT'}
                </span>
                {quotation.validUntil && (
                  <p className="text-blue-100 text-sm mt-2">
                    Valid until: {new Date(quotation.validUntil).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="p-8 border-b border-gray-100">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* From Section */}
              <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                <h3 className="font-bold text-gray-700 mb-4 flex items-center space-x-2">
                  <User size={20} className="text-blue-500" />
                  <span>From</span>
                </h3>
                <div className="space-y-3 text-gray-600">
                  <p className="font-semibold text-gray-800">{createdBy.name || 'N/A'}</p>
                  <div className="flex items-center space-x-2">
                    <Mail size={16} className="text-blue-500" />
                    <span>{createdBy.email || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* To Section */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h3 className="font-bold text-gray-700 mb-4 flex items-center space-x-2">
                  <Building size={20} className="text-blue-500" />
                  <span>To</span>
                </h3>
                <div className="space-y-3 text-gray-600">
                  <p className="font-semibold text-gray-800">{customer.name || 'N/A'}</p>
                  <div className="flex items-center space-x-2">
                    <Mail size={16} className="text-blue-500" />
                    <span>{customer.email || 'N/A'}</span>
                  </div>
                  {customer.phone && (
                    <div className="flex items-center space-x-2">
                      <Phone size={16} className="text-blue-500" />
                      <span>{customer.phone}</span>
                    </div>
                  )}
                  {customer.company && (
                    <div className="flex items-center space-x-2 text-sm">
                      <Building size={16} className="text-blue-500" />
                      <span>{customer.company}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="p-8">
            <h3 className="font-bold text-gray-700 mb-6 text-lg">Items</h3>
            {items.length > 0 ? (
              <div className="overflow-hidden rounded-xl border border-gray-200">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                    <tr>
                      <th className="text-left p-4 font-semibold">Description</th>
                      <th className="text-right p-4 font-semibold">Quantity</th>
                      <th className="text-right p-4 font-semibold">Unit Price</th>
                      <th className="text-right p-4 font-semibold">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {items.map((item, index) => (
                      <tr 
                        key={index} 
                        className="hover:bg-blue-50 transition-colors duration-150"
                      >
                        <td className="p-4 text-gray-700">{item.description || 'N/A'}</td>
                        <td className="text-right p-4 text-gray-600">{item.quantity || 0}</td>
                        <td className="text-right p-4 text-gray-600">
                          ${(item.unitPrice || 0).toFixed(2)}
                        </td>
                        <td className="text-right p-4 font-semibold text-blue-600">
                          ${(item.total || 0).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
                <FileText size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500 text-lg">No items in this quotation</p>
              </div>
            )}
          </div>

          {/* Totals Section */}
          <div className="p-8 bg-gray-50 border-t border-gray-200">
            <div className="flex justify-end">
              <div className="w-full max-w-md bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="text-gray-800 font-medium">${(quotation.subtotal || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Tax:</span>
                    <span className="text-gray-800 font-medium">${(quotation.tax || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Discount:</span>
                    <span className="text-red-500 font-medium">-${(quotation.discount || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-t border-gray-200">
                    <span className="text-lg font-bold text-gray-800">Total Amount:</span>
                    <span className="text-2xl font-bold text-blue-600">
                      ${(quotation.total || 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notes Section */}
          {quotation.notes && (
            <div className="p-8 border-t border-gray-100">
              <h3 className="font-bold text-gray-700 mb-4 flex items-center space-x-2">
                <FileText size={20} className="text-blue-500" />
                <span>Notes</span>
              </h3>
              <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {quotation.notes}
                </p>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="p-8 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-center no-print">
            <p className="text-lg font-semibold">Thank you for your business!</p>
            <p className="text-blue-100 mt-2">We appreciate the opportunity to serve you</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuotationDetail;