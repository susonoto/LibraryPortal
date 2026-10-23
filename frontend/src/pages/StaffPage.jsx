import { useEffect, useState } from 'react';
import { Mail, Phone, User } from 'lucide-react';
import { getStaff } from '../api/client';

const roleOrder = ['Head Librarian', 'Assistant Librarian', 'Library Assistant', 'Staff', 'Intern'];

export default function StaffPage() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStaff()
      .then(data => setStaff(data.sort((a, b) => roleOrder.indexOf(a.role) - roleOrder.indexOf(b.role))))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Library Staff</h1>
        <p className="text-sm opacity-60 mt-1">Head, assistants and team members</p>
      </div>

      {loading ? (
        <p className="text-center py-12 opacity-50">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {staff.map(s => (
            <div key={s._id} className="neo-card p-6 rounded-2xl text-center">
              <div className="w-20 h-20 mx-auto rounded-full neo-card flex items-center justify-center mb-4">
                {s.photoUrl ? (
                  <img src={s.photoUrl} alt={s.name} className="w-full h-full rounded-full object-cover" />
                ) : (
                  <User className="w-10 h-10 text-neo-accent opacity-60" />
                )}
              </div>
              <h3 className="font-semibold text-lg">{s.name}</h3>
              <p className="text-sm text-neo-accent mt-0.5">{s.role}</p>
              {s.bio && <p className="text-xs opacity-60 mt-3 line-clamp-3">{s.bio}</p>}
              <div className="mt-4 space-y-1.5 text-xs opacity-70">
                {s.email && (
                  <a href={`mailto:${s.email}`} className="flex items-center justify-center gap-1.5 hover:text-neo-accent">
                    <Mail className="w-3.5 h-3.5" /> {s.email}
                  </a>
                )}
                {s.phone && (
                  <span className="flex items-center justify-center gap-1.5">
                    <Phone className="w-3.5 h-3.5" /> {s.phone}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
