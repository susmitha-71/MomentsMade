
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Create from "./pages/Create";
import MyBucket from "./pages/MyBucket";

import "./App.css";

function App() {
  const [theme, setTheme] = useState(
    localStorage.getItem("momentsTheme") || "dark"
  );

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("momentsTheme", theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((previous) =>
      previous === "dark" ? "light" : "dark"
    );
  }

  return (
    <BrowserRouter>
      <div className="app">
        <Navbar theme={theme} toggleTheme={toggleTheme} />

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/create" element={<Create />} />
            <Route path="/my-bucket" element={<MyBucket />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
