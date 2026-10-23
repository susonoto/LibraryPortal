import express from 'express';
import * as bookCtrl from '../controllers/bookController.js';
import * as studentCtrl from '../controllers/studentController.js';
import * as borrowCtrl from '../controllers/borrowController.js';
import * as seatCtrl from '../controllers/seatController.js';
import * as eventCtrl from '../controllers/eventController.js';
import * as staffCtrl from '../controllers/staffController.js';
import * as resourceCtrl from '../controllers/resourceController.js';

const router = express.Router();

// Books
router.get('/books', bookCtrl.getBooks);
router.get('/books/:id', bookCtrl.getBook);
router.post('/books', bookCtrl.createBook);
router.put('/books/:id', bookCtrl.updateBook);
router.delete('/books/:id', bookCtrl.deleteBook);

// Students
router.get('/students', studentCtrl.getStudents);
router.get('/students/:id', studentCtrl.getStudent);
router.post('/students', studentCtrl.createStudent);
router.put('/students/:id', studentCtrl.updateStudent);
router.delete('/students/:id', studentCtrl.deleteStudent);

// Borrows
router.get('/borrows', borrowCtrl.getBorrows);
router.post('/borrows/issue', borrowCtrl.issueBook);
router.put('/borrows/:id/return', borrowCtrl.returnBook);
router.post('/borrows/:id/remind', borrowCtrl.sendReminder);
router.put('/borrows/:id/reissue', borrowCtrl.reissueBook);

// Seats
router.get('/seats', seatCtrl.getSeats);
router.post('/seats', seatCtrl.createSeat);
router.post('/seats/occupy', seatCtrl.occupySeat);
router.put('/seats/:id/free', seatCtrl.freeSeat);
router.put('/seats/:id', seatCtrl.updateSeat);

// Events
router.get('/events', eventCtrl.getEvents);
router.post('/events', eventCtrl.createEvent);
router.put('/events/:id', eventCtrl.updateEvent);
router.delete('/events/:id', eventCtrl.deleteEvent);

// Staff
router.get('/staff', staffCtrl.getStaff);
router.post('/staff', staffCtrl.createStaff);
router.put('/staff/:id', staffCtrl.updateStaff);
router.delete('/staff/:id', staffCtrl.deleteStaff);

// Resources & Websites
router.get('/resources', resourceCtrl.getResources);
router.post('/resources', resourceCtrl.createResource);
router.get('/websites', resourceCtrl.getWebsites);
router.post('/websites', resourceCtrl.createWebsite);

// Health
router.get('/health', (req, res) => res.json({ status: 'ok', time: new Date() }));

export default router;
