import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
  category: { type: String, default: 'General' }, // e.g., Learning, Research, Tools
  description: { type: String, default: '' },
  icon: { type: String, default: 'link' }, // lucide icon name
  isFeatured: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('Resource', resourceSchema);
