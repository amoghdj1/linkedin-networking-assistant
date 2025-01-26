import { Routes, Route, Link } from "react-router-dom";
import Contacts from "./pages/Contacts";
import Dashboard from "./pages/Dashboard";
import About from "./pages/About";
import Pricing from "./pages/Pricing";

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <nav className="bg-indigo-600 text-white p-4 flex gap-6 shadow-md">
        <div className="text-2xl font-bold">LinkedIn Assistant</div>
        <div className="flex gap-4 ml-auto">
          <Link to="/">Dashboard</Link>
          <Link to="/contacts">Contacts</Link>
          <Link to="/about">About</Link>
          <Link to="/pricing">Pricing</Link>
        </div>
      </nav>

      <div className="p-6 flex-grow">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/about" element={<About />} />
          <Route path="/pricing" element={<Pricing />} />
        </Routes>
      </div>

      <footer className="bg-gray-800 text-white text-center p-4 mt-auto">
        &copy; 2025 LinkedIn Assistant. All Rights Reserved.
      </footer>
    </div>
  );
}

export default App;
