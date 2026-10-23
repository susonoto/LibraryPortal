import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, BookOpen, Users, Armchair, Calendar, 
  UserCog, Link2, Globe, Library, ScanLine
} from 'lucide-react';

const links = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/scan', icon: ScanLine, label: 'Scan Center' },
  { to: '/borrowings', icon: Users, label: 'Borrowings' },
  { to: '/books', icon: BookOpen, label: 'Books' },
  { to: '/seats', icon: Armchair, label: 'Seat Occupancy' },
  { to: '/events', icon: Calendar, label: 'Events' },
  { to: '/staff', icon: UserCog, label: 'Library Staff' },
  { to: '/resources', icon: Link2, label: 'Resources' },
  { to: '/websites', icon: Globe, label: 'College Sites' },
];

export default function Sidebar({ open }) {
  return (
    <aside 
      className={`fixed top-0 left-0 h-full z-40 transition-all duration-300 
        ${open ? 'w-64' : 'w-20'} 
        bg-neo-light dark:bg-neo-dark border-r border-black/5 dark:border-white/5`}
    >
      <div className="flex flex-col h-full p-4">
        {/* Logo — flat, no raised neo shadow */}
        <div className={`flex items-center gap-3 mb-8 ${open ? 'px-2' : 'justify-center'}`}>
          <div className="w-10 h-10 rounded-xl bg-neo-accent/10 flex items-center justify-center shrink-0">
            <Library className="w-5 h-5 text-neo-accent" />
          </div>
          {open && (
            <div>
              <h1 className="font-bold text-lg leading-tight">Library</h1>
              <p className="text-xs opacity-60">Management System</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1.5">
          {links.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200
                ${isActive 
                  ? 'neo-btn shadow-neo-sm dark:shadow-neo-sm-dark text-neo-accent font-medium' 
                  : 'hover:bg-black/5 dark:hover:bg-white/5 opacity-70 hover:opacity-100'
                }
                ${!open && 'justify-center'}`
              }
            >
              <Icon className="w-5 h-5 shrink-0" />
              {open && <span className="text-sm">{label}</span>}
            </NavLink>
          ))}
        </nav>

        {open && (
          <div className="mt-auto pt-4 text-center text-xs opacity-40">
            <p>© 2025 College Library</p>
            <p className="mt-0.5">MERN Stack</p>
          </div>
        )}
      </div>
    </aside>
  );
}
