import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuotation } from '../services/api';
import QuotationForm from '../components/quotations/QuotationForm';
import toast from 'react-hot-toast';
import { ArrowLeft, FileEdit, Loader } from 'lucide-react';

const QuotationEdit = () => {
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
      const quotationData = response.data.data || response.data;
      
      // Format the data for the form
      const formattedQuotation = {
        ...quotationData,
        customer: quotationData.customer?._id || quotationData.customer,
        validUntil: quotationData.validUntil 
          ? new Date(quotationData.validUntil).toISOString().split('T')[0] 
          : ''
      };
      
      setQuotation(formattedQuotation);
    } catch (error) {
      console.error('Fetch quotation error:', error);
      toast.error('Failed to load quotation');
      navigate('/quotations');
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = () => {
    toast.success('Quotation updated successfully!');
    navigate('/quotations');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading quotation details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/quotations')}
            className="flex items-center space-x-3 text-blue-600 hover:text-blue-800 transition-colors duration-200 group"
          >
            <div className="bg-white p-2 rounded-lg shadow-sm group-hover:shadow-md transition-shadow duration-200">
              <ArrowLeft className="w-5 h-5" />
            </div>
            <span className="font-medium text-lg">Back to Quotations</span>
          </button>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-6">
            <div className="flex items-center space-x-4">
              <div className="bg-white bg-opacity-20 p-3 rounded-xl">
                <FileEdit className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Edit Quotation</h1>
                <p className="text-blue-100 mt-1">
                  Update quotation #{quotation?.quotationNumber || 'Loading...'}
                </p>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="p-8">
            <div className="bg-blue-50 rounded-xl p-6 mb-8 border border-blue-200">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Loader className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-blue-800">Editing Mode</h3>
                  <p className="text-blue-600 text-sm mt-1">
                    Make changes to the quotation details below. All fields are editable.
                  </p>
                </div>
              </div>
            </div>

            <QuotationForm quotation={quotation} onSuccess={handleSuccess} />
          </div>
        </div>

        {/* Quick Actions Footer */}
        <div className="mt-6 flex justify-between items-center">
          <button
            onClick={() => navigate('/quotations')}
            className="px-6 py-3 text-gray-600 bg-white border border-gray-300 rounded-xl hover:border-gray-400 transition-colors duration-200 font-medium shadow-sm"
          >
            Cancel
          </button>
          <div className="text-sm text-gray-500">
            Quotation ID: <span className="font-mono text-blue-600">{id}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuotationEdit;