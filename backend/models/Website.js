import mongoose from 'mongoose';

const websiteSchema = new mongoose.Schema({
  name: { type: String, required: true },
  url: { type: String, required: true },
  description: { type: String, default: '' },
  category: { type: String, default: 'College' }, // Official, Department, Portal etc.
  icon: { type: String, default: 'globe' },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model('Website', websiteSchema);
