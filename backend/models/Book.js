import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  author: { type: String, required: true },
  isbn: { type: String, unique: true, sparse: true },
  barcode: { type: String, unique: true, sparse: true }, // physical barcode / QR payload on the book
  category: { type: String, default: 'General' },
  totalCopies: { type: Number, default: 1 },
  availableCopies: { type: Number, default: 1 },
  coverUrl: { type: String, default: '' },
  description: { type: String, default: '' },
  publishedYear: { type: Number },
}, { timestamps: true });

export default mongoose.model('Book', bookSchema);
