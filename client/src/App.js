import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./components/Home";
import Courses from "./components/Docs";
import Upload from "./components/Upload";
import Search from "./components/Search";
import CourseFiles from './components/CourseFiles';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        
        <Route path="/upload" element={<Upload />} />
        <Route path="/search" element={<Search />} />
        <Route path="/Docs" element={<Courses />} />
        <Route path="/course/:courseId" element={<CourseFiles />} />
      </Routes>
    </Router>
  );
}

export default App;
