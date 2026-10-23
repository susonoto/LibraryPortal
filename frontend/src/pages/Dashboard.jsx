import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, Armchair, Calendar, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { getBorrows, getSeats, getEvents, getBooks } from '../api/client';
import { format } from 'date-fns';

export default function Dashboard() {
  const [stats, setStats] = useState({ books: 0, issued: 0, overdue: 0, seatsOccupied: 0, seatsTotal: 0, upcomingEvents: 0 });
  const [recentBorrows, setRecentBorrows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [borrows, seats, events, books] = await Promise.all([
          getBorrows(),
          getSeats(),
          getEvents(),
          getBooks(),
        ]);
        const issued = borrows.filter(b => b.status === 'issued').length;
        const overdue = borrows.filter(b => b.status === 'overdue').length;
        const seatsOccupied = seats.filter(s => s.isOccupied).length;
        const upcoming = events.filter(e => e.status === 'upcoming').length;

        setStats({
          books: books.length,
          issued,
          overdue,
          seatsOccupied,
          seatsTotal: seats.length,
          upcomingEvents: upcoming,
        });
        setRecentBorrows(borrows.slice(0, 5));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const cards = [
    { label: 'Total Books', value: stats.books, icon: BookOpen, color: 'text-blue-500', to: '/books' },
    { label: 'Active Issues', value: stats.issued, icon: Users, color: 'text-indigo-500', to: '/borrowings' },
    { label: 'Overdue', value: stats.overdue, icon: AlertTriangle, color: 'text-red-500', to: '/borrowings' },
    { label: 'Seats Occupied', value: `${stats.seatsOccupied}/${stats.seatsTotal}`, icon: Armchair, color: 'text-amber-500', to: '/seats' },
    { label: 'Upcoming Events', value: stats.upcomingEvents, icon: Calendar, color: 'text-purple-500', to: '/events' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="neo-card p-8 rounded-2xl animate-pulse">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm opacity-60 mt-1">Overview of library activity</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {cards.map((c) => (
          <Link key={c.label} to={c.to} className="neo-card p-5 rounded-2xl block">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs opacity-60 mb-1">{c.label}</p>
                <p className="text-2xl font-bold">{c.value}</p>
              </div>
              <div className={`p-2.5 rounded-xl bg-black/5 dark:bg-white/5 ${c.color}`}>
                <c.icon className="w-5 h-5" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Borrowings */}
      <div className="neo-card p-6 rounded-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-lg">Recent Borrowings</h2>
          <Link to="/borrowings" className="text-sm text-neo-accent hover:underline">View all</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left opacity-60 border-b border-black/5 dark:border-white/5">
                <th className="pb-3 font-medium">Student</th>
                <th className="pb-3 font-medium">Book</th>
                <th className="pb-3 font-medium">Issue Date</th>
                <th className="pb-3 font-medium">Due Date</th>
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentBorrows.map((b) => (
                <tr key={b._id} className="border-b border-black/5 dark:border-white/5 last:border-0">
                  <td className="py-3">{b.student?.name || '—'}</td>
                  <td className="py-3">{b.book?.title || '—'}</td>
                  <td className="py-3">{format(new Date(b.issueDate), 'dd MMM yyyy')}</td>
                  <td className="py-3">{format(new Date(b.dueDate), 'dd MMM yyyy')}</td>
                  <td className="py-3">
                    <span className={`badge badge-${b.status}`}>
                      {b.status === 'issued' && <Clock className="w-3 h-3 inline mr-1" />}
                      {b.status === 'overdue' && <AlertTriangle className="w-3 h-3 inline mr-1" />}
                      {b.status === 'returned' && <CheckCircle className="w-3 h-3 inline mr-1" />}
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
              {recentBorrows.length === 0 && (
                <tr><td colSpan={5} className="py-8 text-center opacity-50">No borrowings yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
