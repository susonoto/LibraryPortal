import { useEffect, useState } from 'react';
import { Calendar, MapPin, Users } from 'lucide-react';
import { getEvents } from '../api/client';
import { format } from 'date-fns';

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('upcoming');

  useEffect(() => {
    getEvents()
      .then(setEvents)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = events.filter(e => {
    if (tab === 'upcoming') return e.status === 'upcoming' || e.status === 'ongoing';
    if (tab === 'completed') return e.status === 'completed';
    return true;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Library Events</h1>
        <p className="text-sm opacity-60 mt-1">Upcoming & past events organized by the library</p>
      </div>

      <div className="flex gap-2">
        {['upcoming', 'completed', 'all'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`neo-btn px-4 py-2 rounded-xl text-sm capitalize ${tab === t ? 'text-neo-accent font-medium' : 'opacity-70'}`}>
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-center py-12 opacity-50">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(ev => (
            <div key={ev._id} className="neo-card p-5 rounded-2xl">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className={`badge badge-${ev.status === 'completed' ? 'completed' : 'upcoming'} mb-2`}>
                    {ev.status}
                  </span>
                  <h3 className="font-semibold text-base">{ev.title}</h3>
                  <p className="text-sm opacity-60 mt-1 line-clamp-2">{ev.description}</p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-4 text-xs opacity-70">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {format(new Date(ev.date), 'dd MMM yyyy')}
                  {ev.endDate && ` – ${format(new Date(ev.endDate), 'dd MMM')}`}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  {ev.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" />
                  {ev.organizer}
                </span>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="col-span-full text-center py-12 opacity-50">No events in this category</p>
          )}
        </div>
      )}
    </div>
  );
}
