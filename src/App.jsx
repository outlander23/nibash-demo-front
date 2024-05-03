import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Table from "./src/ShowTable";
import Home from "./src/Home";

function App() {
  return (
    <Router>
      <nav className="bg-green-500 py-4">
        <div className="container mx-auto">
          <ul className="flex justify-center space-x-4">
            <li>
              <Link
                to="/"
                className="text-white hover:text-gray-200 px-4 py-2 rounded-lg"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/table"
                className="text-white hover:text-gray-200 px-4 py-2 rounded-lg"
              >
                Table
              </Link>
            </li>
          </ul>
        </div>
      </nav>
      <Routes>
        <Route path="/table" element={<Table />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
