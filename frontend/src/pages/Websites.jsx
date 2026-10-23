import { useEffect, useState } from 'react';
import { ExternalLink, Home, User, Book, ClipboardList, Briefcase, Library, Users, Building, Globe } from 'lucide-react';
import { getWebsites } from '../api/client';

const iconMap = {
  home: Home,
  user: User,
  book: Book,
  'clipboard-list': ClipboardList,
  briefcase: Briefcase,
  library: Library,
  users: Users,
  building: Building,
  globe: Globe,
};

export default function Websites() {
  const [websites, setWebsites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getWebsites()
      .then(setWebsites)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const byCategory = websites.reduce((acc, w) => {
    (acc[w.category] = acc[w.category] || []).push(w);
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">College Websites</h1>
        <p className="text-sm opacity-60 mt-1">All active institutional portals in one place</p>
      </div>

      {loading ? (
        <p className="text-center py-12 opacity-50">Loading...</p>
      ) : (
        Object.entries(byCategory).map(([cat, sites]) => (
          <section key={cat}>
            <h2 className="text-sm font-semibold opacity-70 uppercase tracking-wide mb-3">{cat}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {sites.map(w => {
                const Icon = iconMap[w.icon] || Globe;
                return (
                  <a key={w._id} href={w.url} target="_blank" rel="noopener noreferrer"
                    className="neo-card p-5 rounded-2xl flex items-center gap-4 group">
                    <div className="p-3 rounded-xl bg-black/5 dark:bg-white/5 text-neo-accent shrink-0">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-sm">{w.name}</h3>
                        <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-60 transition" />
                      </div>
                      <p className="text-xs opacity-50 mt-0.5 truncate">{w.description || w.url}</p>
                    </div>
                  </a>
                );
              })}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
