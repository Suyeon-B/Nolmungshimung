import React from "react";
import SignUp from "./pages/sign/SignUp";
import SignIn from "./pages/sign/SignIn";
import Home from "./pages/Home";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="signin/*" element={<SignIn />} />
        <Route path="signup/*" element={<SignUp />} />
      </Routes>
    </Router>
    // <Router>
    //   <Home />
    //   <SignIn />
    //   <SignUp />
    // </Router>
  );
}

export default App;
