import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, RotateCcw, CheckCircle, Plus, Clock, ScanLine } from 'lucide-react';
import { getBorrows, getBooks, getStudents, issueBook, returnBook, sendReminder, reissueBook } from '../api/client';
import { format, differenceInDays } from 'date-fns';
import BarcodeScanner from '../components/BarcodeScanner';

export default function Borrowings() {
  const [borrows, setBorrows] = useState([]);
  const [books, setBooks] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [showIssue, setShowIssue] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [scanStep, setScanStep] = useState(0); // 0=book, 1=student
  const [scannedBookId, setScannedBookId] = useState(null);
  const [form, setForm] = useState({ bookId: '', studentId: '', daysAllowed: 15 });
  const [msg, setMsg] = useState(null);
  const [allBooks, setAllBooks] = useState([]);

  const load = async () => {
    setLoading(true);
    try {
      const [b, bk, st] = await Promise.all([getBorrows(), getBooks(), getStudents()]);
      setBorrows(b);
      setAllBooks(bk);
      setBooks(bk.filter(x => x.availableCopies > 0));
      setStudents(st);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = filter === 'all' ? borrows : borrows.filter(b => b.status === filter);

  const handleIssue = async (e) => {
    e.preventDefault();
    try {
      await issueBook(form);
      setMsg({ type: 'success', text: 'Book issued & email sent!' });
      setShowIssue(false);
      setForm({ bookId: '', studentId: '', daysAllowed: 15 });
      load();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to issue' });
    }
  };

  const handleReturn = async (id) => {
    try {
      await returnBook(id);
      setMsg({ type: 'success', text: 'Book returned successfully' });
      load();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Failed' });
    }
  };

  const handleRemind = async (id) => {
    try {
      await sendReminder(id);
      setMsg({ type: 'success', text: 'Reminder email sent!' });
      load();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to send' });
    }
  };

  const handleReissue = async (id) => {
    try {
      await reissueBook(id, 15);
      setMsg({ type: 'success', text: 'Book reissued for 15 more days' });
      load();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Failed' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Borrowings</h1>
          <p className="text-sm opacity-60 mt-1">Track who borrowed what & send reminders — scan to issue faster</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setScanStep(0);
              setScannedBookId(null);
              setShowScanner(true);
            }}
            className="neo-btn px-4 py-2.5 rounded-xl flex items-center gap-2 text-sm font-medium text-neo-accent"
          >
            <ScanLine className="w-4 h-4" /> Scan Issue
          </button>
          <Link
            to="/scan"
            className="neo-btn px-4 py-2.5 rounded-xl flex items-center gap-2 text-sm font-medium"
          >
            Scan Center
          </Link>
          <button onClick={() => setShowIssue(true)} className="neo-btn px-4 py-2.5 rounded-xl flex items-center gap-2 text-sm font-medium">
            <Plus className="w-4 h-4" /> Manual Issue
          </button>
        </div>
      </div>

      {msg && (
        <div className={`neo-card p-4 rounded-xl text-sm ${msg.type === 'success' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
          {msg.text}
          <button onClick={() => setMsg(null)} className="ml-3 opacity-60 hover:opacity-100">✕</button>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {['all', 'issued', 'overdue', 'returned'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`neo-btn px-4 py-2 rounded-xl text-sm capitalize ${filter === f ? 'text-neo-accent font-medium' : 'opacity-70'}`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="neo-card p-6 rounded-2xl overflow-x-auto">
        {loading ? (
          <p className="text-center py-8 opacity-50">Loading...</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left opacity-60 border-b border-black/5 dark:border-white/5">
                <th className="pb-3 font-medium">Student</th>
                <th className="pb-3 font-medium">Book</th>
                <th className="pb-3 font-medium">Issued</th>
                <th className="pb-3 font-medium">Due</th>
                <th className="pb-3 font-medium">Days Left</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => {
                const days = differenceInDays(new Date(b.dueDate), new Date());
                return (
                  <tr key={b._id} className="border-b border-black/5 dark:border-white/5 last:border-0">
                    <td className="py-3">
                      <div className="font-medium">{b.student?.name}</div>
                      <div className="text-xs opacity-50">{b.student?.studentId} · {b.student?.email}</div>
                    </td>
                    <td className="py-3">
                      <div>{b.book?.title}</div>
                      <div className="text-xs opacity-50">{b.book?.author}</div>
                    </td>
                    <td className="py-3">{format(new Date(b.issueDate), 'dd MMM yyyy')}</td>
                    <td className="py-3">{format(new Date(b.dueDate), 'dd MMM yyyy')}</td>
                    <td className="py-3">
                      {b.status === 'returned' ? '—' : (
                        <span className={days < 0 ? 'text-red-500 font-medium' : days <= 3 ? 'text-amber-500' : ''}>
                          {days < 0 ? `${Math.abs(days)} overdue` : `${days} days`}
                        </span>
                      )}
                    </td>
                    <td className="py-3">
                      <span className={`badge badge-${b.status}`}>{b.status}</span>
                    </td>
                    <td className="py-3">
                      <div className="flex gap-1.5">
                        {b.status !== 'returned' && (
                          <>
                            <button onClick={() => handleRemind(b._id)} title="Send Reminder Email" className="neo-btn p-2 rounded-lg">
                              <Mail className="w-4 h-4 text-blue-500" />
                            </button>
                            <button onClick={() => handleReissue(b._id)} title="Reissue +15 days" className="neo-btn p-2 rounded-lg">
                              <RotateCcw className="w-4 h-4 text-purple-500" />
                            </button>
                            <button onClick={() => handleReturn(b._id)} title="Mark Returned" className="neo-btn p-2 rounded-lg">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="py-10 text-center opacity-50">No records found</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Issue Modal */}
      {showIssue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="neo-card p-6 rounded-2xl w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Issue Book</h3>
            <form onSubmit={handleIssue} className="space-y-4">
              <div>
                <label className="text-xs opacity-60 mb-1 block">Student</label>
                <select
                  required
                  value={form.studentId}
                  onChange={e => setForm({ ...form, studentId: e.target.value })}
                  className="neo-input w-full"
                >
                  <option value="">Select student</option>
                  {students.map(s => (
                    <option key={s._id} value={s._id}>{s.name} ({s.studentId})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs opacity-60 mb-1 block">Book (available only)</label>
                <select
                  required
                  value={form.bookId}
                  onChange={e => setForm({ ...form, bookId: e.target.value })}
                  className="neo-input w-full"
                >
                  <option value="">Select book</option>
                  {books.map(b => (
                    <option key={b._id} value={b._id}>{b.title} — {b.availableCopies} left</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs opacity-60 mb-1 block">Days Allowed</label>
                <input
                  type="number"
                  min={1}
                  max={60}
                  value={form.daysAllowed}
                  onChange={e => setForm({ ...form, daysAllowed: e.target.value })}
                  className="neo-input w-full"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowIssue(false)} className="neo-btn flex-1 py-2.5 rounded-xl text-sm">Cancel</button>
                <button type="submit" className="neo-btn flex-1 py-2.5 rounded-xl text-sm font-medium text-neo-accent">Issue & Email</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Scan-to-issue */}
      {showScanner && (
        <BarcodeScanner
          title={scanStep === 0 ? 'Scan Book QR / Barcode' : 'Scan Student Library Card'}
          hint={
            scanStep === 0
              ? 'Scan the barcode or QR printed on the book'
              : 'Scan the barcode / QR on the student library card'
          }
          continuous={scanStep === 0}
          onScan={async (code) => {
            const c = code.trim().toLowerCase();
            try {
              if (scanStep === 0) {
                const book = allBooks.find(
                  (b) =>
                    (b.isbn && b.isbn.toLowerCase() === c) ||
                    (b.barcode && b.barcode.toLowerCase() === c) ||
                    String(b._id) === code
                );
                if (!book) {
                  setMsg({ type: 'error', text: `Book not found: ${code}` });
                  setShowScanner(false);
                  return;
                }
                if (book.availableCopies < 1) {
                  setMsg({ type: 'error', text: `"${book.title}" has no available copies` });
                  setShowScanner(false);
                  return;
                }
                setScannedBookId(book._id);
                setScanStep(1);
                setMsg({ type: 'success', text: `Book: ${book.title}. Now scan student card.` });
                return;
              }
              // step 1 — student
              const student = students.find(
                (s) =>
                  s.studentId.toLowerCase() === c ||
                  (s.cardBarcode && s.cardBarcode.toLowerCase() === c) ||
                  String(s._id) === code
              );
              if (!student) {
                setMsg({ type: 'error', text: `Student not found: ${code}` });
                setShowScanner(false);
                return;
              }
              await issueBook({
                bookId: scannedBookId,
                studentId: student._id,
                daysAllowed: 15,
              });
              setMsg({ type: 'success', text: `Issued to ${student.name}. Email sent.` });
              setShowScanner(false);
              setScanStep(0);
              setScannedBookId(null);
              load();
            } catch (err) {
              setMsg({ type: 'error', text: err.response?.data?.message || 'Scan issue failed' });
              setShowScanner(false);
            }
          }}
          onClose={() => {
            setShowScanner(false);
            setScanStep(0);
            setScannedBookId(null);
          }}
        />
      )}
    </div>
  );
}
