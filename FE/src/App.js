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
import ProjectPage from "./pages/project/ProjectPage";

const queryClient = new QueryClient(); // 인스턴스 생성
const BodyDiv = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
`;
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <BodyDiv>
          <ProjectSide />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="signin/*" element={<SignIn />} />
            <Route path="signup/*" element={<SignUp />} />
            <Route path="shareMemo/*" element={<Editor />} />
            <Route path="project/" element={<CreateProject />} />
            <Route path="search/*" element={<SearchMap />} />
            <Route path="project/:projectId" element={<ProjectPage />} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BodyDiv>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
