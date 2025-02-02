import { Routes, Route, Link } from "react-router-dom";
import Contacts from "./pages/Contacts";
import Dashboard from "./pages/Dashboard";
import About from "./pages/About";
import Pricing from "./pages/Pricing";
import Login from "./pages/Login";
import ContactDetail from "./pages/ContactDetail";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase-config";
import "./styles.css";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="App">
      <header className="header">
        <nav className="nav-links">
          <Link to="/" className="nav-link">Dashboard</Link>
          <Link to="/contacts" className="nav-link">Contacts</Link>
          <Link to="/about" className="nav-link">About</Link>
          <Link to="/pricing" className="nav-link">Pricing</Link>
          <Link to="/login" className="nav-link">Login</Link>
        </nav>
      </header>

      <div className="content">
        <Routes>
          <Route path="/" element={user ? <Dashboard /> : <Login />} />
          <Route path="/contacts" element={user ? <Contacts /> : <Login />} />
          <Route path="/contacts/:id" element={user ? <ContactDetail /> : <Login />} />
          <Route path="/about" element={<About />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>

      <footer className="footer">
        &copy; 2025 LinkedIn Assistant. All Rights Reserved.
      </footer>
    </div>
  );
}

export default App;