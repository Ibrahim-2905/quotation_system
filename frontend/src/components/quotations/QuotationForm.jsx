import React, { useState, useEffect } from 'react';
import { getCustomers, createQuotation, updateQuotation } from '../../services/api';
import toast from 'react-hot-toast';
import { Plus, Trash2, Calculator, User, FileText, Calendar, DollarSign } from 'lucide-react';

const QuotationForm = ({ quotation, onSuccess }) => {
  const [customers, setCustomers] = useState([]);
  const [formData, setFormData] = useState({
    customer: '',
    items: [{ description: '', quantity: 1, unitPrice: 0, total: 0 }],
    subtotal: 0,
    tax: 0,
    discount: 0,
    total: 0,
    notes: '',
    validUntil: ''
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCustomers();
    if (quotation) {
      setFormData(quotation);
    }
  }, [quotation]);

  const fetchCustomers = async () => {
    try {
      const response = await getCustomers();
      console.log('Customers response:', response.data);
      
      // Extract array from nested structure
      const customerData = response.data.data || response.data || [];
      
      // Ensure it's an array
      if (Array.isArray(customerData)) {
        setCustomers(customerData);
      } else {
        console.error('Customer data is not an array:', customerData);
        setCustomers([]);
        toast.error('Failed to load customers');
      }
    } catch (error) {
      console.error('Fetch customers error:', error);
      toast.error('Failed to load customers');
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { description: '', quantity: 1, unitPrice: 0, total: 0 }]
    });
  };

  const updateItem = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    
    if (field === 'quantity' || field === 'unitPrice') {
      newItems[index].total = newItems[index].quantity * newItems[index].unitPrice;
    }
    
    const subtotal = newItems.reduce((sum, item) => sum + item.total, 0);
    const total = subtotal + formData.tax - formData.discount;
    
    setFormData({ ...formData, items: newItems, subtotal, total });
  };

  const removeItem = (index) => {
    if (formData.items.length === 1) {
      toast.error('At least one item is required');
      return;
    }
    const newItems = formData.items.filter((_, i) => i !== index);
    const subtotal = newItems.reduce((sum, item) => sum + item.total, 0);
    const total = subtotal + formData.tax - formData.discount;
    setFormData({ ...formData, items: newItems, subtotal, total });
  };

  const handleTaxChange = (value) => {
    const tax = Number(value) || 0;
    const total = formData.subtotal + tax - formData.discount;
    setFormData({ ...formData, tax, total });
  };

  const handleDiscountChange = (value) => {
    const discount = Number(value) || 0;
    const total = formData.subtotal + formData.tax - discount;
    setFormData({ ...formData, discount, total });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    // Validation
    if (!formData.customer) {
      toast.error('Please select a customer');
      setSubmitting(false);
      return;
    }
    
    if (formData.items.length === 0) {
      toast.error('Please add at least one item');
      setSubmitting(false);
      return;
    }
    
    // Check if all items have description
    const hasEmptyDescription = formData.items.some(item => !item.description.trim());
    if (hasEmptyDescription) {
      toast.error('All items must have a description');
      setSubmitting(false);
      return;
    }
    
    try {
      if (quotation) {
        await updateQuotation(quotation._id, formData);
        toast.success('Quotation updated successfully!');
      } else {
        await createQuotation(formData);
        toast.success('Quotation created successfully!');
      }
      onSuccess();
    } catch (error) {
      console.error('Save quotation error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to save quotation';
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading customers...</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Customer Selection */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-blue-100 p-2 rounded-lg">
            <User className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Customer Information</h3>
            <p className="text-sm text-gray-600">Select the customer for this quotation</p>
          </div>
        </div>
        
        <div>
          <label className="block mb-3 font-medium text-gray-700">Customer *</label>
          <select
            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            value={formData.customer}
            onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
            required
          >
            <option value="">Select Customer</option>
            {customers.length > 0 ? (
              customers.map((customer) => (
                <option key={customer._id} value={customer._id}>
                  {customer.name} - {customer.email}
                </option>
              ))
            ) : (
              <option value="" disabled>No customers available</option>
            )}
          </select>
          {customers.length === 0 && (
            <p className="text-sm text-red-500 mt-2 flex items-center">
              <User className="w-4 h-4 mr-1" />
              Please add customers first before creating quotations
            </p>
          )}
        </div>
      </div>

      {/* Items Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Items & Services</h3>
              <p className="text-sm text-gray-600">Add items or services to this quotation</p>
            </div>
          </div>
          <button
            type="button"
            className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200"
            onClick={addItem}
          >
            <Plus className="w-4 h-4" />
            <span>Add Item</span>
          </button>
        </div>
        
        {/* Items Header */}
        <div className="grid grid-cols-12 gap-4 mb-3 px-2 text-sm font-medium text-gray-600">
          <div className="col-span-5">Description</div>
          <div className="col-span-2 text-center">Quantity</div>
          <div className="col-span-2 text-center">Unit Price</div>
          <div className="col-span-2 text-center">Total</div>
          <div className="col-span-1"></div>
        </div>
        
        {formData.items.map((item, index) => (
          <div key={index} className="grid grid-cols-12 gap-4 mb-4 items-center">
            <input
              className="col-span-5 px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Item description"
              value={item.description}
              onChange={(e) => updateItem(index, 'description', e.target.value)}
              required
            />
            <input
              type="number"
              min="1"
              className="col-span-2 px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-center"
              placeholder="Qty"
              value={item.quantity}
              onChange={(e) => updateItem(index, 'quantity', Number(e.target.value))}
              required
            />
            <input
              type="number"
              min="0"
              step="0.01"
              className="col-span-2 px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-center"
              placeholder="0.00"
              value={item.unitPrice}
              onChange={(e) => updateItem(index, 'unitPrice', Number(e.target.value))}
              required
            />
            <div className="col-span-2 px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg text-center font-medium text-blue-700">
              ${item.total.toFixed(2)}
            </div>
            <button
              type="button"
              className="col-span-1 flex items-center justify-center text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors duration-200"
              onClick={() => removeItem(index)}
              title="Remove item"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Pricing Section */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-blue-500 p-2 rounded-lg">
            <Calculator className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Pricing Summary</h3>
            <p className="text-sm text-gray-600">Review the quotation total</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Tax ($)</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="number"
                min="0"
                step="0.01"
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                value={formData.tax}
                onChange={(e) => handleTaxChange(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Discount ($)</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="number"
                min="0"
                step="0.01"
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                value={formData.discount}
                onChange={(e) => handleDiscountChange(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-medium">${formData.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tax:</span>
              <span className="font-medium">${formData.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Discount:</span>
              <span className="font-medium text-red-500">-${formData.discount.toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-200 pt-3 flex justify-between text-lg font-bold">
              <span className="text-gray-800">Total Amount:</span>
              <span className="text-blue-600">${formData.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-blue-100 p-2 rounded-lg">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Notes</h3>
              <p className="text-sm text-gray-600">Additional terms or comments</p>
            </div>
          </div>
          <textarea
            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            rows="4"
            placeholder="Enter any additional notes, terms, or conditions..."
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          />
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Validity</h3>
              <p className="text-sm text-gray-600">Quotation expiration date</p>
            </div>
          </div>
          <input
            type="date"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            value={formData.validUntil ? formData.validUntil.split('T')[0] : ''}
            onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
          />
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 rounded-xl hover:from-blue-600 hover:to-blue-700 font-semibold transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
      >
        {submitting ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span>Processing...</span>
          </>
        ) : (
          <>
            <FileText className="w-5 h-5" />
            <span>{quotation ? 'Update Quotation' : 'Create Quotation'}</span>
          </>
        )}
      </button>
    </form>
  );
};

export default QuotationForm;