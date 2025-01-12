// Navbar.js
import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <a className="navbar-brand" href="/">홈</a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link to="/calendar" className="nav-link">청약캘린더</Link>
            </li>
            <li className="nav-item">
              <Link to="/term" className="nav-link">용어</Link>
            </li>
            <li className="nav-item">
              <Link to="/faq" className="nav-link">FAQ</Link>
            </li>
            <li className="nav-item">
              <Link to="/myInfo" className="nav-link">내정보</Link>
            </li>
            <li className="nav-item">
              <Link to="/analysis" className="nav-link">경쟁률 분석</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
