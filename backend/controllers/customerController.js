import Customer from '../models/Customer.js';
import sendResponse from '../helpers/sendResponse.js';

const getCustomers = async (req, res) => {
  try {
    // Only get customers created by the logged-in user
    const customers = await Customer.find({ createdBy: req.user._id })
      .sort({ createdAt: -1 });
    
    console.log(`User ${req.user._id} has ${customers.length} customers`);
    sendResponse(res, 200, customers, false, 'Customers fetched successfully');
  } catch (error) {
    console.error('Error in getCustomers:', error);
    sendResponse(res, 500, null, true, error.message);
  }
};

const getCustomer = async (req, res) => {
  try {
    // Make sure the customer belongs to the logged-in user
    const customer = await Customer.findOne({
      _id: req.params.id,
      createdBy: req.user._id
    });
    
    if (!customer) {
      return sendResponse(res, 404, null, true, 'Customer not found');
    }
    sendResponse(res, 200, customer, false, 'Customer fetched successfully');
  } catch (error) {
    console.error('Error in getCustomer:', error);
    sendResponse(res, 500, null, true, error.message);
  }
};

const createCustomer = async (req, res) => {
  try {
    const customer = await Customer.create({
      ...req.body,
      createdBy: req.user._id  // Automatically set the creator
    });
    sendResponse(res, 201, customer, false, 'Customer created successfully');
  } catch (error) {
    console.error('Error in createCustomer:', error);
    sendResponse(res, 500, null, true, error.message);
  }
};

const updateCustomer = async (req, res) => {
  try {
    // Make sure the customer belongs to the logged-in user
    const customer = await Customer.findOneAndUpdate(
      {
        _id: req.params.id,
        createdBy: req.user._id  // Only update if user owns it
      },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!customer) {
      return sendResponse(res, 404, null, true, 'Customer not found or unauthorized');
    }
    sendResponse(res, 200, customer, false, 'Customer updated successfully');
  } catch (error) {
    console.error('Error in updateCustomer:', error);
    sendResponse(res, 500, null, true, error.message);
  }
};

const deleteCustomer = async (req, res) => {
  try {
    // Make sure the customer belongs to the logged-in user
    const customer = await Customer.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user._id  // Only delete if user owns it
    });
    
    if (!customer) {
      return sendResponse(res, 404, null, true, 'Customer not found or unauthorized');
    }
    sendResponse(res, 200, { message: 'Customer deleted' }, false, 'Customer deleted successfully');
  } catch (error) {
    console.error('Error in deleteCustomer:', error);
    sendResponse(res, 500, null, true, error.message);
  }
};

export default { getCustomers, getCustomer, createCustomer, updateCustomer, deleteCustomer };