import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Books
export const getBooks = () => api.get('/books').then(r => r.data);
export const createBook = (data) => api.post('/books', data).then(r => r.data);
export const updateBook = (id, data) => api.put(`/books/${id}`, data).then(r => r.data);
export const deleteBook = (id) => api.delete(`/books/${id}`).then(r => r.data);

// Students
export const getStudents = () => api.get('/students').then(r => r.data);
export const createStudent = (data) => api.post('/students', data).then(r => r.data);

// Borrows
export const getBorrows = (status) => api.get('/borrows', { params: { status } }).then(r => r.data);
export const issueBook = (data) => api.post('/borrows/issue', data).then(r => r.data);
export const returnBook = (id) => api.put(`/borrows/${id}/return`).then(r => r.data);
export const sendReminder = (id) => api.post(`/borrows/${id}/remind`).then(r => r.data);
export const reissueBook = (id, daysAllowed = 15) => api.put(`/borrows/${id}/reissue`, { daysAllowed }).then(r => r.data);

// Seats
export const getSeats = () => api.get('/seats').then(r => r.data);
export const occupySeat = (data) => api.post('/seats/occupy', data).then(r => r.data);
export const freeSeat = (id) => api.put(`/seats/${id}/free`).then(r => r.data);

// Events
export const getEvents = (status) => api.get('/events', { params: { status } }).then(r => r.data);
export const createEvent = (data) => api.post('/events', data).then(r => r.data);

// Staff
export const getStaff = () => api.get('/staff').then(r => r.data);

// Resources & Websites
export const getResources = () => api.get('/resources').then(r => r.data);
export const getWebsites = () => api.get('/websites').then(r => r.data);

export default api;
