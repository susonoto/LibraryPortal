import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  studentId: { type: String, required: true, unique: true },
  cardBarcode: { type: String, unique: true, sparse: true }, // barcode / QR on library card
  department: { type: String, default: '' },
  year: { type: Number },
  phone: { type: String, default: '' },
}, { timestamps: true });

export default mongoose.model('Student', studentSchema);
