import { useEffect, useState } from 'react';
import { Armchair, User, Clock } from 'lucide-react';
import { getSeats, occupySeat, freeSeat } from '../api/client';
import { format } from 'date-fns';

export default function Seats() {
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ occupiedBy: '', occupiedUntil: '' });

  const load = async () => {
    try {
      setSeats(await getSeats());
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleOccupy = async (e) => {
    e.preventDefault();
    try {
      await occupySeat({
        seatId: selected._id,
        occupiedBy: form.occupiedBy,
        occupiedFrom: new Date().toISOString(),
        occupiedUntil: form.occupiedUntil || null,
      });
      setSelected(null);
      setForm({ occupiedBy: '', occupiedUntil: '' });
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed');
    }
  };

  const handleFree = async (id) => {
    try {
      await freeSeat(id);
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed');
    }
  };

  const zones = [...new Set(seats.map(s => s.zone))];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Seat Occupancy</h1>
        <p className="text-sm opacity-60 mt-1">See which seats are occupied and for how long</p>
      </div>

      {loading ? (
        <p className="text-center py-12 opacity-50">Loading...</p>
      ) : (
        zones.map(zone => (
          <div key={zone} className="space-y-3">
            <h2 className="font-semibold text-sm opacity-70 uppercase tracking-wide">{zone}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {seats.filter(s => s.zone === zone).map(seat => (
                <div
                  key={seat._id}
                  className={`neo-card p-4 rounded-2xl cursor-pointer transition-all ${
                    seat.isOccupied ? 'ring-2 ring-amber-400/50' : 'hover:ring-2 hover:ring-green-400/30'
                  }`}
                  onClick={() => !seat.isOccupied && setSelected(seat)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-lg">{seat.seatNumber}</span>
                    <Armchair className={`w-5 h-5 ${seat.isOccupied ? 'text-amber-500' : 'text-green-500'}`} />
                  </div>
                  {seat.isOccupied ? (
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3 opacity-50" />
                        <span className="truncate">{seat.occupiedBy}</span>
                      </div>
                      {seat.occupiedFrom && (
                        <div className="flex items-center gap-1 opacity-60">
                          <Clock className="w-3 h-3" />
                          <span>From {format(new Date(seat.occupiedFrom), 'HH:mm')}</span>
                        </div>
                      )}
                      {seat.occupiedUntil && (
                        <div className="opacity-60">Until {format(new Date(seat.occupiedUntil), 'HH:mm')}</div>
                      )}
                      <button
                        onClick={(e) => { e.stopPropagation(); handleFree(seat._id); }}
                        className="mt-2 w-full neo-btn py-1.5 rounded-lg text-xs text-red-500"
                      >
                        Free Seat
                      </button>
                    </div>
                  ) : (
                    <span className="badge badge-free text-xs">Available</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="neo-card p-6 rounded-2xl w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-1">Occupy {selected.seatNumber}</h3>
            <p className="text-xs opacity-50 mb-4">{selected.zone}</p>
            <form onSubmit={handleOccupy} className="space-y-3">
              <div>
                <label className="text-xs opacity-60 mb-1 block">Student Name / ID</label>
                <input required value={form.occupiedBy}
                  onChange={e => setForm({ ...form, occupiedBy: e.target.value })}
                  className="neo-input w-full" placeholder="e.g. Aarav Sharma" />
              </div>
              <div>
                <label className="text-xs opacity-60 mb-1 block">Occupied Until (optional)</label>
                <input type="datetime-local" value={form.occupiedUntil}
                  onChange={e => setForm({ ...form, occupiedUntil: e.target.value })}
                  className="neo-input w-full" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setSelected(null)} className="neo-btn flex-1 py-2.5 rounded-xl text-sm">Cancel</button>
                <button type="submit" className="neo-btn flex-1 py-2.5 rounded-xl text-sm font-medium text-neo-accent">Occupy</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
