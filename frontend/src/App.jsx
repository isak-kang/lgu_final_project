import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from "./components/Main.jsx";
import Login from "./components/Login.jsx";
import FAQ from "./components/Faq.jsx";
import Terms from "./components/term.jsx";
import Calendar from "./components/calendar.jsx";
import Join from "./components/join.jsx";
import MyInfo from "./components/my_info.jsx";
import Navbar from "./components/Navbar.jsx";
import Analysis from "./components/Analysis.jsx";
// import Competition from "./components/Competition.jsx";
function App() {
  return (
    <div>
      <BrowserRouter>
      <Navbar /> {/* 모든 페이지에 Navbar 추가 */}
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/login" element={<Login />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/term" element={<Terms />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/join" element={<Join />} />
          <Route path="/myInfo" element={<MyInfo />} />
          <Route path="/analysis" element={<Analysis />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
