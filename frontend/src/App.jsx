import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Borrowings from './pages/Borrowings';
import Seats from './pages/Seats';
import Events from './pages/Events';
import StaffPage from './pages/StaffPage';
import Resources from './pages/Resources';
import Websites from './pages/Websites';
import Books from './pages/Books';
import Scan from './pages/Scan';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark' || 
      (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  return (
    <div className="flex min-h-screen bg-neo-light dark:bg-neo-dark transition-colors duration-300">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <Header 
          darkMode={darkMode} 
          setDarkMode={setDarkMode} 
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        <main className="flex-1 p-6 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/scan" element={<Scan />} />
            <Route path="/borrowings" element={<Borrowings />} />
            <Route path="/books" element={<Books />} />
            <Route path="/seats" element={<Seats />} />
            <Route path="/events" element={<Events />} />
            <Route path="/staff" element={<StaffPage />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/websites" element={<Websites />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
