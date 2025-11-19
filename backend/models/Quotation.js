import mongoose from 'mongoose';

const quotationItemSchema = new mongoose.Schema({
  description: { type: String, required: true },
  quantity: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
  total: { type: Number, required: true }
});

const quotationSchema = new mongoose.Schema({
  quotationNumber: { type: String,  unique: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  items: [quotationItemSchema],
  subtotal: { type: Number, required: true },
  tax: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  total: { type: Number, required: true },
  notes: { type: String },
  status: { 
    type: String, 
    enum: ['draft', 'sent', 'accepted', 'rejected'], 
    default: 'draft' 
  },
  validUntil: { type: Date },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

quotationSchema.index({ createdBy: 1, createdAt: -1 });

// Auto-increment quotation number
quotationSchema.pre('save', async function(next) {
  if (this.isNew) {
    const count = await this.constructor.countDocuments();
    this.quotationNumber = `QUO-${String(count + 1).padStart(5, '0')}`;
  }
  next();
});




export default mongoose.model('Quotation', quotationSchema);