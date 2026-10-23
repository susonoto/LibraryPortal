import mongoose from 'mongoose';

const staffSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['Head Librarian', 'Assistant Librarian', 'Library Assistant', 'Staff', 'Intern'],
    required: true 
  },
  email: { type: String, default: '' },
  phone: { type: String, default: '' },
  photoUrl: { type: String, default: '' },
  bio: { type: String, default: '' },
  joinDate: { type: Date },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model('Staff', staffSchema);
