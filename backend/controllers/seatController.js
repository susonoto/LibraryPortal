import Seat from '../models/Seat.js';

export const getSeats = async (req, res) => {
  try {
    const seats = await Seat.find().sort({ seatNumber: 1 });
    res.json(seats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const occupySeat = async (req, res) => {
  try {
    const { seatId, occupiedBy, occupiedFrom, occupiedUntil, notes } = req.body;
    const seat = await Seat.findById(seatId);
    if (!seat) return res.status(404).json({ message: 'Seat not found' });
    if (seat.isOccupied) return res.status(400).json({ message: 'Seat already occupied' });

    seat.isOccupied = true;
    seat.occupiedBy = occupiedBy;
    seat.occupiedFrom = occupiedFrom ? new Date(occupiedFrom) : new Date();
    seat.occupiedUntil = occupiedUntil ? new Date(occupiedUntil) : null;
    seat.notes = notes || '';
    await seat.save();
    res.json(seat);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const freeSeat = async (req, res) => {
  try {
    const seat = await Seat.findById(req.params.id);
    if (!seat) return res.status(404).json({ message: 'Seat not found' });

    seat.isOccupied = false;
    seat.occupiedBy = null;
    seat.occupiedFrom = null;
    seat.occupiedUntil = null;
    seat.notes = '';
    await seat.save();
    res.json(seat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createSeat = async (req, res) => {
  try {
    const seat = await Seat.create(req.body);
    res.status(201).json(seat);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateSeat = async (req, res) => {
  try {
    const seat = await Seat.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!seat) return res.status(404).json({ message: 'Seat not found' });
    res.json(seat);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
