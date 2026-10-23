import mongoose from 'mongoose';

const seatSchema = new mongoose.Schema({
  seatNumber: { type: String, required: true, unique: true },
  zone: { type: String, default: 'Main Hall' }, // e.g., Quiet Zone, Discussion, Computer
  isOccupied: { type: Boolean, default: false },
  occupiedBy: { type: String, default: null }, // student name or ID
  occupiedFrom: { type: Date, default: null },
  occupiedUntil: { type: Date, default: null },
  notes: { type: String, default: '' },
}, { timestamps: true });

export default mongoose.model('Seat', seatSchema);
