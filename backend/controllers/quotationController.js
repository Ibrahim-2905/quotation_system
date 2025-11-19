import Quotation from '../models/Quotation.js';
import Customer from '../models/Customer.js';
import sendResponse from '../helpers/sendResponse.js';

const getQuotations = async (req, res) => {
  try {
    // Only get quotations created by the logged-in user
    const quotations = await Quotation.find({ createdBy: req.user._id })
      .populate('customer')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
    
    console.log(`User ${req.user._id} has ${quotations.length} quotations`);
    sendResponse(res, 200, quotations, false, 'Quotations fetched successfully');
  } catch (error) {
    console.error('Error in getQuotations:', error);
    sendResponse(res, 500, null, true, error.message);
  }
};

const getQuotation = async (req, res) => {
  try {
    // Make sure the quotation belongs to the logged-in user
    const quotation = await Quotation.findOne({
      _id: req.params.id,
      createdBy: req.user._id
    })
      .populate('customer')
      .populate('createdBy', 'name email');
    
    if (!quotation) {
      return sendResponse(res, 404, null, true, 'Quotation not found');
    }
    sendResponse(res, 200, quotation, false, 'Quotation fetched successfully');
  } catch (error) {
    console.error('Error in getQuotation:', error);
    sendResponse(res, 500, null, true, error.message);
  }
};

const createQuotation = async (req, res) => {
  try {
    console.log('=== CREATE QUOTATION START ===');
    console.log('User ID:', req.user._id);
    console.log('Request body:', req.body);
    
    // Validate required fields
    if (!req.body.customer) {
      return sendResponse(res, 400, null, true, 'Customer is required');
    }
    
    // Verify the customer belongs to this user
    const customer = await Customer.findOne({
      _id: req.body.customer,
      createdBy: req.user._id
    });
    
    if (!customer) {
      return sendResponse(res, 403, null, true, 'Customer not found or unauthorized');
    }
    
    if (!req.body.items || req.body.items.length === 0) {
      return sendResponse(res, 400, null, true, 'At least one item is required');
    }
    
    // Validate items
    for (let i = 0; i < req.body.items.length; i++) {
      const item = req.body.items[i];
      if (!item.description) {
        return sendResponse(res, 400, null, true, `Item ${i + 1}: Description is required`);
      }
      if (!item.quantity || item.quantity <= 0) {
        return sendResponse(res, 400, null, true, `Item ${i + 1}: Valid quantity is required`);
      }
      if (!item.unitPrice || item.unitPrice < 0) {
        return sendResponse(res, 400, null, true, `Item ${i + 1}: Valid unit price is required`);
      }
    }
    
    // Generate quotation number for this user
    const userQuotationsCount = await Quotation.countDocuments({ createdBy: req.user._id });
    const quotationNumber = `QUO-${String(userQuotationsCount + 1).padStart(5, '0')}`;
    
    console.log('Generated quotation number:', quotationNumber);
    
    // Prepare quotation data
    const quotationData = {
      quotationNumber: quotationNumber,
      customer: req.body.customer,
      items: req.body.items.map(item => ({
        description: item.description,
        quantity: Number(item.quantity),
        unitPrice: Number(item.unitPrice),
        total: Number(item.quantity) * Number(item.unitPrice)
      })),
      subtotal: Number(req.body.subtotal) || 0,
      tax: Number(req.body.tax) || 0,
      discount: Number(req.body.discount) || 0,
      total: Number(req.body.total) || 0,
      notes: req.body.notes || '',
      status: req.body.status || 'draft',
      validUntil: req.body.validUntil || null,
      createdBy: req.user._id  // Automatically set the creator
    };
    
    console.log('Quotation data to save:', quotationData);
    
    // Create quotation
    const quotation = await Quotation.create(quotationData);
    
    console.log('Quotation created successfully:', quotation._id);
    
    // Populate customer data
    await quotation.populate('customer');
    
    console.log('=== CREATE QUOTATION SUCCESS ===');
    
    sendResponse(res, 201, quotation, false, 'Quotation created successfully');
  } catch (error) {
    console.error('=== CREATE QUOTATION ERROR ===');
    console.error('Error:', error);
    console.error('Error message:', error.message);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return sendResponse(res, 400, null, true, messages.join(', '));
    }
    
    sendResponse(res, 500, null, true, error.message);
  }
};

const updateQuotation = async (req, res) => {
  try {
    // Make sure the quotation belongs to the logged-in user
    const quotation = await Quotation.findOneAndUpdate(
      {
        _id: req.params.id,
        createdBy: req.user._id  // Only update if user owns it
      },
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    ).populate('customer');
    
    if (!quotation) {
      return sendResponse(res, 404, null, true, 'Quotation not found or unauthorized');
    }
    sendResponse(res, 200, quotation, false, 'Quotation updated successfully');
  } catch (error) {
    console.error('Error in updateQuotation:', error);
    sendResponse(res, 500, null, true, error.message);
  }
};

const deleteQuotation = async (req, res) => {
  try {
    // Make sure the quotation belongs to the logged-in user
    const quotation = await Quotation.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user._id  // Only delete if user owns it
    });
    
    if (!quotation) {
      return sendResponse(res, 404, null, true, 'Quotation not found or unauthorized');
    }
    sendResponse(res, 200, { message: 'Quotation deleted' }, false, 'Quotation deleted successfully');
  } catch (error) {
    console.error('Error in deleteQuotation:', error);
    sendResponse(res, 500, null, true, error.message);
  }
};

export default { getQuotations, getQuotation, createQuotation, updateQuotation, deleteQuotation };