import React from "react";
import SignUp from "./pages/sign/SignUp";
import SignIn from "./pages/sign/SignIn";
import SearchMap from "./pages/search/Search";
import Home from "./pages/Home";
// import Test from "./pages/Test";
import KakaoSignIn from "./components/sign/KakaoSignIn";
import VoiceTalk from "./components/voiceTalk/voiceTalk";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import ProjectSide from "./components/sidebar/ProjectSide";
import PlanSideBar from "./components/sidebar/PlanSideBar";
import CreateProject from "./components/CreateProject";
import SpotList from "./components/spot/SpotList";
import SpotRoute from "./pages/spotRoute/SpotRoute";
import styled from "styled-components";

import "./App.css";
import "./reset.css";
import { QueryClient, QueryClientProvider } from "react-query";
import ProjectPage from "./pages/project/ProjectPage";
import {
  AuthProvider,
  RequireAuth,
  NotRequireAuth,
} from "./components/auth/Auth";

// react query devtool
import { ReactQueryDevtools } from "react-query/devtools";
import CalendarTest from "./components/CalendarTest";

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
              <Route
                path="signin/*"
                element={
                  // <NotRequireAuth>
                  <SignIn />
                  // </NotRequireAuth>
                }
              />
              <Route
                path="signup/*"
                element={
                  <NotRequireAuth>
                    {" "}
                    <SignUp />{" "}
                  </NotRequireAuth>
                }
              />
              <Route path="voicetalk/*" element={<VoiceTalk />} />
              <Route path="/" element={<Home />} />
              <Route
                path="/kakao/signin"
                element={
                  // <NotRequireAuth>
                  <KakaoSignIn />
                  // </NotRequireAuth>
                }
              />
              <Route
                path="project/*"
                element={
                  // <RequireAuth>
                  <CreateProject />
                }
              />
              <Route path="project/:projectId" element={<ProjectPage />} />
              <Route path="Calendar/*" element={<CalendarTest />} />
              {/* <Route path="result/*" element={<Test />} /> */}
              {/* <Route
                path="project/:projectId/:tripDate"
                element={<ProjectPage />}
              />
              <Route path="test/:tripDate" element={<TextEditor />} /> */}

              {/* 로그인안했을시 로그인 페이지로 이동 */}

              {/* <Route
                path="search/*"
                element={
                  // <RequireAuth>
                  <SearchMap />
                  // </RequireAuth>
                }
              /> */}
              <Route path="*" element={<Navigate to="/" replace />} />
              {/* <Route path="test" element={<MemoTestRtc />} /> */}
            </Routes>
          </BodyDiv>
        </Router>
      </AuthProvider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

export default App;
