import mongoose from 'mongoose';

const borrowSchema = new mongoose.Schema({
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  issueDate: { type: Date, default: Date.now },
  dueDate: { type: Date, required: true },
  returnDate: { type: Date, default: null },
  status: { 
    type: String, 
    enum: ['issued', 'returned', 'overdue'], 
    default: 'issued' 
  },
  daysAllowed: { type: Number, default: 15 },
  reminderSent: { type: Boolean, default: false },
  notes: { type: String, default: '' },
}, { timestamps: true });

// Virtual for days remaining / overdue
borrowSchema.virtual('daysRemaining').get(function() {
  if (this.status === 'returned') return 0;
  const now = new Date();
  const diff = Math.ceil((this.dueDate - now) / (1000 * 60 * 60 * 24));
  return diff;
});

borrowSchema.set('toJSON', { virtuals: true });
borrowSchema.set('toObject', { virtuals: true });

export default mongoose.model('Borrow', borrowSchema);
