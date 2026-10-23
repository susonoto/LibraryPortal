import Staff from '../models/Staff.js';

export const getStaff = async (req, res) => {
  try {
    const staff = await Staff.find({ isActive: true }).sort({ role: 1, name: 1 });
    res.json(staff);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createStaff = async (req, res) => {
  try {
    const staff = await Staff.create(req.body);
    res.status(201).json(staff);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateStaff = async (req, res) => {
  try {
    const staff = await Staff.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!staff) return res.status(404).json({ message: 'Staff not found' });
    res.json(staff);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteStaff = async (req, res) => {
  try {
    const staff = await Staff.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!staff) return res.status(404).json({ message: 'Staff not found' });
    res.json({ message: 'Staff deactivated' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
