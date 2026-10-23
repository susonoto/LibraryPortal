import { Menu, Sun, Moon, Bell } from 'lucide-react';

export default function Header({ darkMode, setDarkMode, sidebarOpen, setSidebarOpen }) {
  return (
    <header className="sticky top-0 z-30 px-6 py-4 flex items-center justify-between bg-neo-light/80 dark:bg-neo-dark/80 backdrop-blur-md border-b border-black/5 dark:border-white/5">
      <div className="flex items-center gap-3">
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="neo-btn p-2.5 rounded-xl"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h2 className="font-semibold text-lg">Library Portal</h2>
          <p className="text-xs opacity-50">Manage books, seats & more</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="neo-btn p-2.5 rounded-xl relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <button 
          onClick={() => setDarkMode(!darkMode)}
          className="neo-btn p-2.5 rounded-xl"
          title={darkMode ? 'Switch to Light' : 'Switch to Dark'}
        >
          {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-500" />}
        </button>
      </div>
    </header>
  );
}
