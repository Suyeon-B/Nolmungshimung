import React from "react";
import SignUp from "./pages/sign/SignUp";
import SignIn from "./pages/sign/SignIn";
import Home from "./pages/Home";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import ProjectSide from "./components/ProjectSide";
import PlanSideBar from "./components/PlanSideBar";
import CreateProject from "./components/CreateProject";
import "./App.css";
import "./reset.css";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="signin/*" element={<SignIn />} />
          <Route path="signup/*" element={<SignUp />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
      {/* <Home />
      <SignIn />
      <SignUp /> */}
    </>
  );
}

export default App;
