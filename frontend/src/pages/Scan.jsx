import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ScanLine, BookOpen, IdCard, PlusCircle, PackageCheck, RotateCcw
} from 'lucide-react';
import BarcodeScanner from '../components/BarcodeScanner';
import { getBooks, getStudents, issueBook, returnBook, getBorrows } from '../api/client';

const MODES = [
  {
    id: 'issue',
    title: 'Issue Book',
    desc: 'Scan book QR/barcode, then student library card',
    icon: PackageCheck,
    color: 'text-indigo-500',
  },
  {
    id: 'return',
    title: 'Return Book',
    desc: 'Scan book QR/barcode to mark as returned',
    icon: RotateCcw,
    color: 'text-green-500',
  },
  {
    id: 'add-book',
    title: 'Add Book (ISBN)',
    desc: 'Scan book barcode to fill ISBN and add to catalog',
    icon: PlusCircle,
    color: 'text-blue-500',
  },
  {
    id: 'lookup-book',
    title: 'Lookup Book',
    desc: 'Scan any book code to view details',
    icon: BookOpen,
    color: 'text-amber-500',
  },
  {
    id: 'lookup-student',
    title: 'Lookup Student',
    desc: 'Scan library card to view student & their borrows',
    icon: IdCard,
    color: 'text-purple-500',
  },
];

export default function Scan() {
  const navigate = useNavigate();
  const [activeMode, setActiveMode] = useState(null);
  const [step, setStep] = useState(0); // for multi-step (issue)
  const [scannedBook, setScannedBook] = useState(null);
  const [result, setResult] = useState(null);
  const [msg, setMsg] = useState(null);
  const [showScanner, setShowScanner] = useState(false);

  const openMode = (mode) => {
    setActiveMode(mode);
    setStep(0);
    setScannedBook(null);
    setResult(null);
    setMsg(null);
    setShowScanner(true);
  };

  const closeScanner = () => {
    setShowScanner(false);
  };

  const findBookByCode = async (code) => {
    const books = await getBooks();
    const c = code.trim().toLowerCase();
    return books.find(
      (b) =>
        (b.isbn && b.isbn.toLowerCase() === c) ||
        (b.barcode && b.barcode.toLowerCase() === c) ||
        String(b._id) === code
    );
  };

  const findStudentByCode = async (code) => {
    const students = await getStudents();
    const c = code.trim().toLowerCase();
    return students.find(
      (s) =>
        s.studentId.toLowerCase() === c ||
        (s.cardBarcode && s.cardBarcode.toLowerCase() === c) ||
        String(s._id) === code
    );
  };

  const handleScan = async (code) => {
    if (!activeMode) return;

    try {
      if (activeMode === 'issue') {
        if (step === 0) {
          // First scan: book
          const book = await findBookByCode(code);
          if (!book) {
            setMsg({ type: 'error', text: `Book not found for code: ${code}` });
            setShowScanner(false);
            return;
          }
          if (book.availableCopies < 1) {
            setMsg({ type: 'error', text: `"${book.title}" has no available copies` });
            setShowScanner(false);
            return;
          }
          setScannedBook(book);
          setStep(1);
          setMsg({ type: 'info', text: `Book: ${book.title}. Now scan student library card.` });
          // keep scanner open for next scan
          setShowScanner(true);
          return;
        }
        if (step === 1) {
          // Second scan: student
          const student = await findStudentByCode(code);
          if (!student) {
            setMsg({ type: 'error', text: `Student not found for code: ${code}` });
            setShowScanner(false);
            return;
          }
          const issued = await issueBook({
            bookId: scannedBook._id,
            studentId: student._id,
            daysAllowed: 15,
          });
          setResult({ type: 'issue', book: scannedBook, student, issued });
          setMsg({ type: 'success', text: `Issued "${scannedBook.title}" to ${student.name}. Email sent.` });
          setShowScanner(false);
          setActiveMode(null);
          return;
        }
      }

      if (activeMode === 'return') {
        const book = await findBookByCode(code);
        if (!book) {
          setMsg({ type: 'error', text: `Book not found: ${code}` });
          setShowScanner(false);
          return;
        }
        const borrows = await getBorrows('issued');
        const overdue = await getBorrows('overdue');
        const active = [...borrows, ...overdue].find(
          (b) => b.book?._id === book._id || b.book === book._id
        );
        if (!active) {
          setMsg({ type: 'error', text: `"${book.title}" is not currently issued` });
          setShowScanner(false);
          return;
        }
        await returnBook(active._id);
        setMsg({ type: 'success', text: `Returned "${book.title}" successfully` });
        setShowScanner(false);
        setActiveMode(null);
        return;
      }

      if (activeMode === 'add-book') {
        setShowScanner(false);
        setActiveMode(null);
        navigate('/books', { state: { scanIsbn: code } });
        return;
      }

      if (activeMode === 'lookup-book') {
        const book = await findBookByCode(code);
        if (!book) {
          setMsg({ type: 'error', text: `No book matched: ${code}` });
        } else {
          setResult({ type: 'book', book });
          setMsg(null);
        }
        setShowScanner(false);
        return;
      }

      if (activeMode === 'lookup-student') {
        const student = await findStudentByCode(code);
        if (!student) {
          setMsg({ type: 'error', text: `No student matched: ${code}` });
        } else {
          const borrows = await getBorrows();
          const theirs = borrows.filter(
            (b) => b.student?._id === student._id || b.student === student._id
          );
          setResult({ type: 'student', student, borrows: theirs });
          setMsg(null);
        }
        setShowScanner(false);
        return;
      }
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || err.message || 'Scan failed' });
      setShowScanner(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <ScanLine className="w-7 h-7 text-neo-accent" />
          Scan Center
        </h1>
        <p className="text-sm opacity-60 mt-1">
          Use camera or USB barcode scanner for issue, return, add book & lookups
        </p>
      </div>

      {msg && (
        <div
          className={`neo-card p-4 rounded-xl text-sm ${
            msg.type === 'success'
              ? 'text-green-600 dark:text-green-400'
              : msg.type === 'error'
              ? 'text-red-600 dark:text-red-400'
              : 'text-blue-600 dark:text-blue-400'
          }`}
        >
          {msg.text}
          <button onClick={() => setMsg(null)} className="ml-3 opacity-60 hover:opacity-100">
            ✕
          </button>
        </div>
      )}

      {/* Mode cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {MODES.map((m) => (
          <button
            key={m.id}
            onClick={() => openMode(m.id)}
            className="neo-card p-5 rounded-2xl text-left hover:scale-[1.01] transition-transform"
          >
            <div className={`p-3 rounded-xl bg-black/5 dark:bg-white/5 w-fit mb-3 ${m.color}`}>
              <m.icon className="w-6 h-6" />
            </div>
            <h3 className="font-semibold">{m.title}</h3>
            <p className="text-xs opacity-60 mt-1">{m.desc}</p>
          </button>
        ))}
      </div>

      {/* Issue progress */}
      {activeMode === 'issue' && step === 1 && scannedBook && (
        <div className="neo-card p-4 rounded-xl text-sm">
          <span className="opacity-60">Selected book: </span>
          <strong>{scannedBook.title}</strong>
          <span className="opacity-60"> — now scan student card</span>
        </div>
      )}

      {/* Result panels */}
      {result?.type === 'book' && (
        <div className="neo-card p-5 rounded-2xl">
          <h3 className="font-semibold mb-2">Book Found</h3>
          <p className="text-lg font-medium">{result.book.title}</p>
          <p className="text-sm opacity-60">{result.book.author}</p>
          <div className="mt-3 flex flex-wrap gap-3 text-xs">
            <span>ISBN: {result.book.isbn || '—'}</span>
            <span>
              Available: {result.book.availableCopies}/{result.book.totalCopies}
            </span>
            <span>{result.book.category}</span>
          </div>
        </div>
      )}

      {result?.type === 'student' && (
        <div className="neo-card p-5 rounded-2xl">
          <h3 className="font-semibold mb-2">Student Found</h3>
          <p className="text-lg font-medium">{result.student.name}</p>
          <p className="text-sm opacity-60">
            {result.student.studentId} · {result.student.email} · {result.student.department}
          </p>
          <div className="mt-4">
            <p className="text-xs opacity-60 mb-2">Active / past borrows</p>
            {result.borrows.length === 0 ? (
              <p className="text-sm opacity-50">No borrow records</p>
            ) : (
              <ul className="space-y-1 text-sm">
                {result.borrows.slice(0, 8).map((b) => (
                  <li key={b._id} className="flex justify-between gap-2">
                    <span>{b.book?.title || 'Book'}</span>
                    <span className={`badge badge-${b.status}`}>{b.status}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {result?.type === 'issue' && (
        <div className="neo-card p-5 rounded-2xl border border-green-500/20">
          <h3 className="font-semibold text-green-600 dark:text-green-400 mb-2">Issued Successfully</h3>
          <p>
            <strong>{result.book.title}</strong> → {result.student.name} ({result.student.studentId})
          </p>
          <p className="text-xs opacity-60 mt-1">Confirmation email sent to {result.student.email}</p>
        </div>
      )}

      {/* Scanner modal */}
      {showScanner && (
        <BarcodeScanner
          title={
            activeMode === 'issue'
              ? step === 0
                ? 'Scan Book QR / Barcode'
                : 'Scan Student Library Card'
              : MODES.find((m) => m.id === activeMode)?.title || 'Scan'
          }
          hint={
            activeMode === 'issue' && step === 1
              ? 'Scan the barcode / QR on the student library card'
              : 'Use camera or USB barcode scanner'
          }
          continuous={activeMode === 'issue' && step === 0}
          onScan={handleScan}
          onClose={() => {
            closeScanner();
            if (!(activeMode === 'issue' && step === 1)) {
              setActiveMode(null);
              setStep(0);
            }
          }}
        />
      )}
    </div>
  );
}
