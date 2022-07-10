import React from "react";
import SignUp from "./pages/sign/SignUp";
import SignIn from "./pages/sign/SignIn";
import SearchMap from "./pages/search/Search";
import Home from "./pages/Home";
// import Editor from "./pages/shareMemo/shareMemo";
import TextEditor from "./pages/shareMemo/TextEditor";
import { BrowserRouter as Router, Switch, Routes, Route, Navigate } from "react-router-dom";
import ProjectSide from "./components/sidebar/ProjectSide";
import PlanSideBar from "./components/sidebar/PlanSideBar";
import CreateProject from "./components/CreateProject";

import "./App.css";
import "./reset.css";
import { QueryClient, QueryClientProvider } from "react-query";

// [수연][TextEditor] socket io 작업
import { v4 as uuidV4 } from "uuid";

const queryClient = new QueryClient(); // 인스턴스 생성

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <ProjectSide />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="signin/*" element={<SignIn />} />
          <Route path="signup/*" element={<SignUp />} />
          {/* <Route path="shareMemo/*" element={<TextEditor />} /> */}
          {/* [수연][TextEditor] line 33 -> 추후 projectID 기준으로 변경 예정 */}
          <Route path="shareMemo/*" element={<Navigate to={`/shareMemo/${uuidV4()}`} replace />} />
          <Route path="/shareMemo/:id" element={<TextEditor />} />
          <Route path="project/*" element={<CreateProject />} />
          <Route path="search/*" element={<SearchMap />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
