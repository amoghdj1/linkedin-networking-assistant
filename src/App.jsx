import { Routes, Route, Link } from "react-router-dom";
import Contacts from "./pages/Contacts";
import Dashboard from "./pages/Dashboard";
import About from "./pages/About";
import Pricing from "./pages/Pricing";
import Login from "./pages/Login";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase-config";
import "./styles.css";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="brand">LinkedIn Assistant</div>
        <div className="nav-links">
          <Link to="/">Dashboard</Link>
          <Link to="/contacts">Contacts</Link>
          <Link to="/about">About</Link>
          <Link to="/pricing">Pricing</Link>
          {user ? (
            <button onClick={() => auth.signOut()} className="logout-btn">
              Logout
            </button>
          ) : (
            <Link to="/login" className="login-btn">
              Login
            </Link>
          )}
        </div>
      </nav>

      <div className="content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/contacts" element={user ? <Contacts /> : <Login />} />
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