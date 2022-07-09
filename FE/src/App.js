import React from "react";
import SignUp from "./pages/sign/SignUp";
import SignIn from "./pages/sign/SignIn";
import Home from "./pages/Home";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ProjectSide from "./components/sidebar/ProjectSide";
import PlanSideBar from "./components/sidebar/PlanSideBar";
import CreateProject from "./components/CreateProject";

import "./App.css";
import "./reset.css";

function App() {
  return (
    <>
      <CreateProject />
      {/* <div style={{ display: "flex" }}>
        <ProjectSide />
        <PlanSideBar />
      </div> */}

      <Router>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="signin/*" element={<SignIn />} />
          <Route path="signup/*" element={<SignUp />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
