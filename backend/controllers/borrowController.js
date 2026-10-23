import Borrow from '../models/Borrow.js';
import Book from '../models/Book.js';
import Student from '../models/Student.js';
import { sendBorrowConfirmation, sendReminderEmail } from '../utils/email.js';

export const getBorrows = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const borrows = await Borrow.find(filter)
      .populate('book', 'title author isbn category')
      .populate('student', 'name email studentId department')
      .sort({ issueDate: -1 });
    
    // Update overdue status
    const now = new Date();
    for (const b of borrows) {
      if (b.status === 'issued' && b.dueDate < now) {
        b.status = 'overdue';
        await b.save();
      }
    }
    res.json(borrows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const issueBook = async (req, res) => {
  try {
    const { bookId, studentId, daysAllowed = 15 } = req.body;
    
    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    if (book.availableCopies < 1) return res.status(400).json({ message: 'No copies available' });

    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const issueDate = new Date();
    const dueDate = new Date(issueDate);
    dueDate.setDate(dueDate.getDate() + Number(daysAllowed));

    const borrow = await Borrow.create({
      book: bookId,
      student: studentId,
      issueDate,
      dueDate,
      daysAllowed: Number(daysAllowed),
      status: 'issued',
    });

    book.availableCopies -= 1;
    await book.save();

    // Send confirmation email
    await sendBorrowConfirmation(student, book, borrow);

    const populated = await Borrow.findById(borrow._id)
      .populate('book', 'title author isbn')
      .populate('student', 'name email studentId');

    res.status(201).json(populated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const returnBook = async (req, res) => {
  try {
    const borrow = await Borrow.findById(req.params.id);
    if (!borrow) return res.status(404).json({ message: 'Borrow record not found' });
    if (borrow.status === 'returned') return res.status(400).json({ message: 'Already returned' });

    borrow.status = 'returned';
    borrow.returnDate = new Date();
    await borrow.save();

    const book = await Book.findById(borrow.book);
    if (book) {
      book.availableCopies += 1;
      await book.save();
    }

    const populated = await Borrow.findById(borrow._id)
      .populate('book', 'title author')
      .populate('student', 'name email studentId');

    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const sendReminder = async (req, res) => {
  try {
    const borrow = await Borrow.findById(req.params.id)
      .populate('book')
      .populate('student');
    if (!borrow) return res.status(404).json({ message: 'Borrow record not found' });
    if (borrow.status === 'returned') return res.status(400).json({ message: 'Book already returned' });

    const result = await sendReminderEmail(borrow.student, borrow.book, borrow);
    borrow.reminderSent = true;
    await borrow.save();

    res.json({ message: 'Reminder sent', emailResult: result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const reissueBook = async (req, res) => {
  try {
    const borrow = await Borrow.findById(req.params.id);
    if (!borrow) return res.status(404).json({ message: 'Borrow record not found' });
    if (borrow.status === 'returned') return res.status(400).json({ message: 'Cannot reissue returned book' });

    const days = req.body.daysAllowed || 15;
    const newDue = new Date();
    newDue.setDate(newDue.getDate() + Number(days));

    borrow.dueDate = newDue;
    borrow.daysAllowed = Number(days);
    borrow.status = 'issued';
    borrow.reminderSent = false;
    await borrow.save();

    const populated = await Borrow.findById(borrow._id)
      .populate('book')
      .populate('student');

    // Optional: send reissue confirmation
    await sendBorrowConfirmation(populated.student, populated.book, populated);

    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
