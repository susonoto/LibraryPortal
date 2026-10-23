import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import Book from './models/Book.js';
import Student from './models/Student.js';
import Borrow from './models/Borrow.js';
import Seat from './models/Seat.js';
import Event from './models/Event.js';
import Staff from './models/Staff.js';
import Resource from './models/Resource.js';
import Website from './models/Website.js';

dotenv.config();

const seed = async () => {
  await connectDB();
  
  console.log('Clearing existing data...');
  await Promise.all([
    Book.deleteMany({}),
    Student.deleteMany({}),
    Borrow.deleteMany({}),
    Seat.deleteMany({}),
    Event.deleteMany({}),
    Staff.deleteMany({}),
    Resource.deleteMany({}),
    Website.deleteMany({}),
  ]);

  console.log('Seeding books...');
  const books = await Book.insertMany([
    { title: 'Introduction to Algorithms', author: 'CLRS', isbn: '9780262033848', barcode: 'BK-CLRS-001', category: 'Computer Science', totalCopies: 5, availableCopies: 3, publishedYear: 2009 },
    { title: 'Clean Code', author: 'Robert C. Martin', isbn: '9780132350884', barcode: 'BK-CLEAN-002', category: 'Software Engineering', totalCopies: 4, availableCopies: 2, publishedYear: 2008 },
    { title: 'The Pragmatic Programmer', author: 'Andrew Hunt', isbn: '9780201616224', barcode: 'BK-PRAG-003', category: 'Software Engineering', totalCopies: 3, availableCopies: 3, publishedYear: 1999 },
    { title: 'Design Patterns', author: 'Gang of Four', isbn: '9780201633610', barcode: 'BK-GOF-004', category: 'Computer Science', totalCopies: 2, availableCopies: 1, publishedYear: 1994 },
    { title: 'Artificial Intelligence: A Modern Approach', author: 'Russell & Norvig', isbn: '9780134610993', barcode: 'BK-AIMA-005', category: 'AI', totalCopies: 3, availableCopies: 2, publishedYear: 2020 },
    { title: 'Database System Concepts', author: 'Silberschatz', isbn: '9780078022159', barcode: 'BK-DBSC-006', category: 'Databases', totalCopies: 4, availableCopies: 4, publishedYear: 2019 },
    { title: 'Operating System Concepts', author: 'Silberschatz', isbn: '9781118063330', barcode: 'BK-OSC-007', category: 'Systems', totalCopies: 3, availableCopies: 1, publishedYear: 2012 },
    { title: 'Computer Networks', author: 'Tanenbaum', isbn: '9780132126953', barcode: 'BK-NET-008', category: 'Networks', totalCopies: 2, availableCopies: 2, publishedYear: 2010 },
  ]);

  console.log('Seeding students...');
  const students = await Student.insertMany([
    { name: 'Aarav Sharma', email: 'aarav.sharma@college.edu', studentId: 'CS2021001', cardBarcode: 'CARD-CS2021001', department: 'Computer Science', year: 3 },
    { name: 'Priya Patel', email: 'priya.patel@college.edu', studentId: 'CS2021045', cardBarcode: 'CARD-CS2021045', department: 'Computer Science', year: 2 },
    { name: 'Rahul Verma', email: 'rahul.verma@college.edu', studentId: 'EE2021012', cardBarcode: 'CARD-EE2021012', department: 'Electrical', year: 3 },
    { name: 'Sneha Reddy', email: 'sneha.reddy@college.edu', studentId: 'ME2021008', cardBarcode: 'CARD-ME2021008', department: 'Mechanical', year: 4 },
    { name: 'Vikram Singh', email: 'vikram.singh@college.edu', studentId: 'CS2020078', cardBarcode: 'CARD-CS2020078', department: 'Computer Science', year: 4 },
    { name: 'Ananya Gupta', email: 'ananya.gupta@college.edu', studentId: 'IT2022033', cardBarcode: 'CARD-IT2022033', department: 'Information Technology', year: 2 },
  ]);

  console.log('Seeding borrows...');
  const now = new Date();
  const d15 = new Date(now); d15.setDate(d15.getDate() + 10);
  const d5 = new Date(now); d5.setDate(d5.getDate() + 3);
  const overdue = new Date(now); overdue.setDate(overdue.getDate() - 2);

  await Borrow.insertMany([
    { book: books[0]._id, student: students[0]._id, issueDate: new Date(now - 5*86400000), dueDate: d15, status: 'issued', daysAllowed: 15 },
    { book: books[1]._id, student: students[1]._id, issueDate: new Date(now - 12*86400000), dueDate: d5, status: 'issued', daysAllowed: 15 },
    { book: books[3]._id, student: students[2]._id, issueDate: new Date(now - 20*86400000), dueDate: overdue, status: 'overdue', daysAllowed: 15 },
    { book: books[6]._id, student: students[4]._id, issueDate: new Date(now - 8*86400000), dueDate: d15, status: 'issued', daysAllowed: 15 },
  ]);

  // Update available copies
  await Book.findByIdAndUpdate(books[0]._id, { availableCopies: 2 });
  await Book.findByIdAndUpdate(books[1]._id, { availableCopies: 1 });
  await Book.findByIdAndUpdate(books[3]._id, { availableCopies: 0 });
  await Book.findByIdAndUpdate(books[6]._id, { availableCopies: 0 });

  console.log('Seeding seats...');
  const seats = [];
  for (let i = 1; i <= 20; i++) {
    const zone = i <= 8 ? 'Quiet Zone' : i <= 14 ? 'Discussion Area' : 'Computer Lab';
    seats.push({
      seatNumber: `S${String(i).padStart(2, '0')}`,
      zone,
      isOccupied: i % 3 === 0,
      occupiedBy: i % 3 === 0 ? students[i % students.length].name : null,
      occupiedFrom: i % 3 === 0 ? new Date(now - (i % 5) * 3600000) : null,
      occupiedUntil: i % 3 === 0 ? new Date(now.getTime() + (4 + i % 4) * 3600000) : null,
    });
  }
  await Seat.insertMany(seats);

  console.log('Seeding events...');
  await Event.insertMany([
    { title: 'Book Fair 2025', description: 'Annual book fair with discounts and author talks.', date: new Date('2025-11-15'), location: 'Library Courtyard', status: 'upcoming', organizer: 'Library Committee' },
    { title: 'Research Paper Writing Workshop', description: 'Hands-on workshop on academic writing and citations.', date: new Date('2025-10-28'), location: 'Seminar Hall A', status: 'upcoming', organizer: 'Library & Research Cell' },
    { title: 'Digital Literacy Week', description: 'Sessions on e-resources, NPTEL, and research databases.', date: new Date('2025-09-10'), endDate: new Date('2025-09-14'), location: 'Library', status: 'completed', organizer: 'Library Staff' },
    { title: 'Author Meet: Contemporary Indian Literature', description: 'Interactive session with renowned authors.', date: new Date('2025-08-20'), location: 'Main Auditorium', status: 'completed', organizer: 'Literary Club & Library' },
    { title: 'Orientation for Freshers', description: 'Introduction to library resources and services.', date: new Date('2025-08-05'), location: 'Library Hall', status: 'completed', organizer: 'Head Librarian' },
  ]);

  console.log('Seeding staff...');
  await Staff.insertMany([
    { name: 'Dr. Meera Krishnan', role: 'Head Librarian', email: 'meera.k@college.edu', phone: '+91-98765-43210', bio: 'PhD in Library Science with 18 years of experience. Passionate about digital transformation of libraries.', joinDate: new Date('2012-06-01') },
    { name: 'Mr. Suresh Kumar', role: 'Assistant Librarian', email: 'suresh.k@college.edu', phone: '+91-98765-43211', bio: 'Specializes in cataloging and e-resource management.', joinDate: new Date('2016-03-15') },
    { name: 'Ms. Lakshmi Nair', role: 'Library Assistant', email: 'lakshmi.n@college.edu', phone: '+91-98765-43212', bio: 'Handles circulation desk and student support.', joinDate: new Date('2019-08-20') },
    { name: 'Mr. Arjun Das', role: 'Staff', email: 'arjun.d@college.edu', phone: '+91-98765-43213', bio: 'Manages seating and infrastructure.', joinDate: new Date('2021-01-10') },
    { name: 'Ms. Divya R', role: 'Intern', email: 'divya.r@college.edu', bio: 'MLIS student assisting with digital archives.', joinDate: new Date('2025-07-01') },
  ]);

  console.log('Seeding resources...');
  await Resource.insertMany([
    { title: 'NPTEL', url: 'https://nptel.ac.in', category: 'Learning', description: 'National Programme on Technology Enhanced Learning - free courses from IITs.', icon: 'graduation-cap', isFeatured: true },
    { title: 'SWAYAM', url: 'https://swayam.gov.in', category: 'Learning', description: 'Government of India initiative for online education.', icon: 'book-open', isFeatured: true },
    { title: 'IEEE Xplore', url: 'https://ieeexplore.ieee.org', category: 'Research', description: 'Access to IEEE journals and conference papers (campus access).', icon: 'file-text', isFeatured: true },
    { title: 'Google Scholar', url: 'https://scholar.google.com', category: 'Research', description: 'Search scholarly literature across disciplines.', icon: 'search', isFeatured: false },
    { title: 'Coursera', url: 'https://www.coursera.org', category: 'Learning', description: 'Online courses from top universities.', icon: 'monitor', isFeatured: false },
    { title: 'Khan Academy', url: 'https://www.khanacademy.org', category: 'Learning', description: 'Free educational resources for all levels.', icon: 'lightbulb', isFeatured: false },
    { title: 'ResearchGate', url: 'https://www.researchgate.net', category: 'Research', description: 'Share and discover research papers.', icon: 'users', isFeatured: false },
    { title: 'Delnet', url: 'https://delnet.in', category: 'Library Network', description: 'Developing Library Network - inter-library resources.', icon: 'network', isFeatured: true },
  ]);

  console.log('Seeding college websites...');
  await Website.insertMany([
    { name: 'College Official Website', url: 'https://www.college.edu', description: 'Main institutional website', category: 'Official', icon: 'home' },
    { name: 'Student Portal', url: 'https://portal.college.edu', description: 'Results, attendance, fees', category: 'Portal', icon: 'user' },
    { name: 'LMS / Moodle', url: 'https://lms.college.edu', description: 'Learning Management System', category: 'Academic', icon: 'book' },
    { name: 'Exam Cell', url: 'https://exam.college.edu', description: 'Exam schedules and results', category: 'Academic', icon: 'clipboard-list' },
    { name: 'Placement Cell', url: 'https://placements.college.edu', description: 'Career and placement updates', category: 'Career', icon: 'briefcase' },
    { name: 'Library OPAC', url: 'https://library.college.edu', description: 'Online Public Access Catalog', category: 'Library', icon: 'library' },
    { name: 'Alumni Network', url: 'https://alumni.college.edu', description: 'Connect with alumni', category: 'Community', icon: 'users' },
    { name: 'Hostel Portal', url: 'https://hostel.college.edu', description: 'Hostel administration', category: 'Portal', icon: 'building' },
  ]);

  console.log('✅ Seed completed successfully!');
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
