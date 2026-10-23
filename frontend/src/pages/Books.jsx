import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { BookOpen, Plus, ScanLine } from 'lucide-react';
import { getBooks, createBook } from '../api/client';
import BarcodeScanner from '../components/BarcodeScanner';

export default function Books() {
  const location = useLocation();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [form, setForm] = useState({
    title: '',
    author: '',
    isbn: '',
    barcode: '',
    category: 'General',
    totalCopies: 1,
  });

  const load = async () => {
    try {
      setBooks(await getBooks());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Coming from Scan Center → prefill ISBN/barcode and open form
  useEffect(() => {
    if (location.state?.scanIsbn) {
      const code = location.state.scanIsbn;
      setForm((f) => ({
        ...f,
        isbn: code,
        barcode: code,
      }));
      setShowAdd(true);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await createBook({ ...form, availableCopies: form.totalCopies });
      setShowAdd(false);
      setForm({
        title: '',
        author: '',
        isbn: '',
        barcode: '',
        category: 'General',
        totalCopies: 1,
      });
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed');
    }
  };

  const onScannedCode = (code) => {
    setForm((f) => ({
      ...f,
      isbn: f.isbn || code,
      barcode: code,
    }));
    setShowScanner(false);
    setShowAdd(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Books Catalog</h1>
          <p className="text-sm opacity-60 mt-1">Add books with QR / barcode scanning</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowScanner(true)}
            className="neo-btn px-4 py-2.5 rounded-xl flex items-center gap-2 text-sm font-medium"
          >
            <ScanLine className="w-4 h-4" /> Scan to Add
          </button>
          <button
            onClick={() => setShowAdd(true)}
            className="neo-btn px-4 py-2.5 rounded-xl flex items-center gap-2 text-sm font-medium"
          >
            <Plus className="w-4 h-4" /> Add Book
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-center py-12 opacity-50">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {books.map((b) => (
            <div key={b._id} className="neo-card p-5 rounded-2xl">
              <div className="flex items-start gap-3">
                <div className="p-3 rounded-xl bg-black/5 dark:bg-white/5 text-neo-accent">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm leading-tight truncate">{b.title}</h3>
                  <p className="text-xs opacity-60 mt-0.5">{b.author}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between text-xs">
                <span className="opacity-50">{b.category}</span>
                <span
                  className={
                    b.availableCopies > 0
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-500'
                  }
                >
                  {b.availableCopies}/{b.totalCopies} available
                </span>
              </div>
              {(b.isbn || b.barcode) && (
                <p className="text-[10px] opacity-40 mt-2 font-mono">
                  {b.barcode || b.isbn}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="neo-card p-6 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Add New Book</h3>
            <form onSubmit={handleAdd} className="space-y-3">
              <div>
                <label className="text-xs opacity-60 mb-1 block">Title *</label>
                <input
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="neo-input w-full"
                />
              </div>
              <div>
                <label className="text-xs opacity-60 mb-1 block">Author *</label>
                <input
                  required
                  value={form.author}
                  onChange={(e) => setForm({ ...form, author: e.target.value })}
                  className="neo-input w-full"
                />
              </div>
              <div>
                <label className="text-xs opacity-60 mb-1 block flex items-center justify-between">
                  <span>ISBN</span>
                  <button
                    type="button"
                    onClick={() => setShowScanner(true)}
                    className="text-neo-accent text-[11px] flex items-center gap-1"
                  >
                    <ScanLine className="w-3 h-3" /> Scan
                  </button>
                </label>
                <input
                  value={form.isbn}
                  onChange={(e) => setForm({ ...form, isbn: e.target.value })}
                  className="neo-input w-full font-mono"
                  placeholder="Scan or type ISBN"
                />
              </div>
              <div>
                <label className="text-xs opacity-60 mb-1 block flex items-center justify-between">
                  <span>Barcode / QR code</span>
                  <button
                    type="button"
                    onClick={() => setShowScanner(true)}
                    className="text-neo-accent text-[11px] flex items-center gap-1"
                  >
                    <ScanLine className="w-3 h-3" /> Scan
                  </button>
                </label>
                <input
                  value={form.barcode}
                  onChange={(e) => setForm({ ...form, barcode: e.target.value })}
                  className="neo-input w-full font-mono"
                  placeholder="Physical barcode on book"
                />
              </div>
              <div>
                <label className="text-xs opacity-60 mb-1 block">Category</label>
                <input
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="neo-input w-full"
                />
              </div>
              <div>
                <label className="text-xs opacity-60 mb-1 block">Total Copies</label>
                <input
                  type="number"
                  min={1}
                  value={form.totalCopies}
                  onChange={(e) =>
                    setForm({ ...form, totalCopies: Number(e.target.value) })
                  }
                  className="neo-input w-full"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAdd(false)}
                  className="neo-btn flex-1 py-2.5 rounded-xl text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="neo-btn flex-1 py-2.5 rounded-xl text-sm font-medium text-neo-accent"
                >
                  Add Book
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showScanner && (
        <BarcodeScanner
          title="Scan Book Barcode / QR"
          hint="Scanned code will fill ISBN and Barcode fields"
          onScan={onScannedCode}
          onClose={() => setShowScanner(false)}
        />
      )}
    </div>
  );
}
