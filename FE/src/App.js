import React from "react";
import SignUp from "./pages/sign/SignUp";
import SignIn from "./pages/sign/SignIn";
import SearchMap from "./pages/search/Search";
import Home from "./pages/Home";
import Editor from "./pages/shareMemo/shareMemo";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import ProjectSide from "./components/sidebar/ProjectSide";
import PlanSideBar from "./components/sidebar/PlanSideBar";
import CreateProject from "./components/CreateProject";
import styled from "styled-components";

import "./App.css";
import "./reset.css";
import { QueryClient, QueryClientProvider } from "react-query";
import { AuthProvider, RequireAuth } from "./components/auth/Auth";

const queryClient = new QueryClient(); // 인스턴스 생성
const BodyDiv = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
`;
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <BodyDiv>
            <ProjectSide />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="signin/*" element={<SignIn />} />
              <Route path="signup/*" element={<SignUp />} />
              <Route path="shareMemo/*" element={<Editor />} />
              <Route path="project/*" element={<CreateProject />} />
              {/* 로그인안했을시 로그인 페이지로 이동 */}
              <Route
                path="search/*"
                element={
                  <RequireAuth>
                    <SearchMap />
                  </RequireAuth>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BodyDiv>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
