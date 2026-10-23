import { useEffect, useState } from 'react';
import { ExternalLink, GraduationCap, BookOpen, FileText, Search, Monitor, Lightbulb, Users, Network, Link as LinkIcon } from 'lucide-react';
import { getResources } from '../api/client';

const iconMap = {
  'graduation-cap': GraduationCap,
  'book-open': BookOpen,
  'file-text': FileText,
  search: Search,
  monitor: Monitor,
  lightbulb: Lightbulb,
  users: Users,
  network: Network,
  link: LinkIcon,
};

export default function Resources() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getResources()
      .then(setResources)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const featured = resources.filter(r => r.isFeatured);
  const others = resources.filter(r => !r.isFeatured);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Important Links & Resources</h1>
        <p className="text-sm opacity-60 mt-1">NPTEL, SWAYAM, research databases and more</p>
      </div>

      {loading ? (
        <p className="text-center py-12 opacity-50">Loading...</p>
      ) : (
        <>
          {featured.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold opacity-70 uppercase tracking-wide mb-3">Featured</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {featured.map(r => {
                  const Icon = iconMap[r.icon] || LinkIcon;
                  return (
                    <a key={r._id} href={r.url} target="_blank" rel="noopener noreferrer"
                      className="neo-card p-5 rounded-2xl block group">
                      <div className="flex items-start gap-3">
                        <div className="p-3 rounded-xl bg-neo-accent/10 text-neo-accent">
                          <Icon className="w-6 h-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{r.title}</h3>
                            <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-60 transition" />
                          </div>
                          <p className="text-xs opacity-60 mt-1 line-clamp-2">{r.description}</p>
                          <span className="inline-block mt-2 text-[10px] px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/5 opacity-60">
                            {r.category}
                          </span>
                        </div>
                      </div>
                    </a>
                  );
                })}
              </div>
            </section>
          )}

          {others.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold opacity-70 uppercase tracking-wide mb-3">More Resources</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {others.map(r => {
                  const Icon = iconMap[r.icon] || LinkIcon;
                  return (
                    <a key={r._id} href={r.url} target="_blank" rel="noopener noreferrer"
                      className="neo-card p-4 rounded-2xl flex items-center gap-3 group">
                      <div className="p-2.5 rounded-xl bg-black/5 dark:bg-white/5 text-neo-accent">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm">{r.title}</h3>
                        <p className="text-xs opacity-50 truncate">{r.description}</p>
                      </div>
                      <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-50 transition shrink-0" />
                    </a>
                  );
                })}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
