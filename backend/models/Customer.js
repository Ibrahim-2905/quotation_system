import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String },
  company: { type: String },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true,
    index: true  
  },
  createdAt: { type: Date, default: Date.now }
});


customerSchema.index({ createdBy: 1, createdAt: -1 });

export default mongoose.model('Customer', customerSchema);