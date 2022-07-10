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
import { QueryClient, QueryClientProvider } from "react-query";
import { AuthProvider, RequireAuth } from "./components/auth/Auth";

const queryClient = new QueryClient(); // 인스턴스 생성

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route
              path="/"
              element={
                <RequireAuth>
                  <Home />
                </RequireAuth>
              }
            />
            <Route path="signin/*" element={<SignIn />} />
            <Route path="signup/*" element={<SignUp />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
