import React from "react";
import SignUp from "./pages/sign/SignUp";
import SignIn from "./pages/sign/SignIn";
import Result from "./pages/Result";
import KakaoSignIn from "./components/sign/KakaoSignIn";
import VoiceTalk from "./components/voiceTalk/voiceTalk";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import CreateProject from "./components/CreateProject";
import styled from "styled-components";
// import TextEditor from "./components/shareMemo/test";
import TestMap from "./components/MarkMap/testMap";

import "./App.css";
import "./reset.css";
import { QueryClient, QueryClientProvider } from "react-query";
import ProjectPage from "./pages/project/ProjectPage";
import { AuthProvider, RequireAuth, NotRequireAuth } from "./components/auth/Auth";

import RecommendPage from "./pages/recommend/RecommendPage";

// react query devtool
import { ReactQueryDevtools } from "react-query/devtools";
import CalendarTest from "./components/CalendarTest";
import HomeNew from "./pages/HomeNew";

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
            {/* <ProjectSide /> */}
            <Routes>
              <Route
                path="signin/*"
                element={
                  <NotRequireAuth>
                    <SignIn />
                  </NotRequireAuth>
                }
              />
              <Route
                path="signup/*"
                element={
                  <NotRequireAuth>
                    <SignUp />
                  </NotRequireAuth>
                }
              />
              <Route path="voicetalk/*" element={<VoiceTalk />} />
              <Route path="testmap/" element={<TestMap />} />
              <Route path="/" element={<HomeNew />} />
              <Route path="/kakao/signin" element={<KakaoSignIn />} />
              <Route
                path="project/*"
                element={
                  <RequireAuth>
                    <CreateProject />
                  </RequireAuth>
                }
              />
              <Route
                path="project/:projectId"
                element={
                  <RequireAuth>
                    <ProjectPage />
                  </RequireAuth>
                }
              />
              <Route path="Calendar/*" element={<CalendarTest />} />
              <Route
                path="project/:projectId/result"
                element={
                  <RequireAuth>
                    <Result />
                  </RequireAuth>
                }
              />
              {/* 로그인안했을시 로그인 페이지로 이동 */}

              {/* <Route
                path="search/*"
                element={
                  // <RequireAuth>
                  <SearchMap />
                  // </RequireAuth>
                }
              /> */}
              <Route path="recommend/*" element={<RecommendPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BodyDiv>
        </Router>
      </AuthProvider>
      {/* <ReactQueryDevtools /> */}
    </QueryClientProvider>
  );
}

export default App;
