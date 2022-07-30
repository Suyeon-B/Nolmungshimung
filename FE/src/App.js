import React, { Suspense } from "react";
// import SignUp from "./pages/sign/SignUp";
const SignUp = React.lazy(() => import("./pages/sign/SignUp"));
// import SignIn from "./pages/sign/SignIn";
const SignIn = React.lazy(() => import("./pages/sign/SignIn"));
// import Result from "./pages/result/Result";
const Result = React.lazy(() => import("./pages/result/Result"));
// import KakaoSignIn from "./components/sign/KakaoSignIn";
const KakaoSignIn = React.lazy(() => import("./components/sign/KakaoSignIn"));
// import VoiceTalk from "./components/voiceTalk/voiceTalk";
const VoiceTalk = React.lazy(() => import("./components/voiceTalk/voiceTalk"));
// import InviteProject from "./components/invite/InviteProject";
const InviteProject = React.lazy(() =>
  import("./components/invite/InviteProject")
);
import Test from "./Test";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
// import CreateProject from "./components/CreateProject";
const CreateProject = React.lazy(() => import("./components/CreateProject"));
import styled from "styled-components";

import "./App.css";
import "./reset.css";
import { QueryClient, QueryClientProvider } from "react-query";
// import ProjectPage from "./pages/project/ProjectPage";
const ProjectPage = React.lazy(() => import("./pages/project/ProjectPage"));
import {
  AuthProvider,
  RequireAuth,
  NotRequireAuth,
} from "./components/auth/Auth";

// import RecommendPage from "./pages/recommend/RecommendPage";
const RecommendPage = React.lazy(() =>
  import("./pages/recommend/RecommendPage")
);
// import RecommendPageDetail from "./pages/recommend/RecommendPageDetail";
const RecommendPageDetail = React.lazy(() =>
  import("./pages/recommend/RecommendPageDetail")
);

// react query devtool
import { ReactQueryDevtools } from "react-query/devtools";
// import HomeNew from "./pages/HomeNew";
import Loading from "./components/loading/Loading";
const HomeNew = React.lazy(() => import("./pages/HomeNew"));

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
                    <Suspense fallback={<Loading />}>
                      <SignIn />
                    </Suspense>
                  </NotRequireAuth>
                }
              />
              <Route
                path="signup/*"
                element={
                  <NotRequireAuth>
                    <Suspense fallback={<Loading />}>
                      <SignUp />
                    </Suspense>
                  </NotRequireAuth>
                }
              />
              <Route
                path="voicetalk/*"
                element={
                  <Suspense fallback={<Loading />}>
                    <VoiceTalk />
                  </Suspense>
                }
              />
              <Route
                path="/"
                element={
                  <Suspense fallback={<Loading />}>
                    <HomeNew />
                  </Suspense>
                }
              />
              <Route
                path="/kakao/signin"
                element={
                  <Suspense fallback={<Loading />}>
                    <KakaoSignIn />
                  </Suspense>
                }
              />
              <Route
                path="project/*"
                element={
                  <RequireAuth>
                    <Suspense fallback={<Loading />}>
                      <CreateProject />
                    </Suspense>
                  </RequireAuth>
                }
              />
              <Route
                path="project/:projectId"
                element={
                  <RequireAuth>
                    <Suspense fallback={<Loading />}>
                      <ProjectPage />
                    </Suspense>
                  </RequireAuth>
                }
              />
              <Route
                path="invite/*"
                element={
                  <RequireAuth>
                    <Suspense fallback={<Loading />}>
                      <InviteProject />
                    </Suspense>
                  </RequireAuth>
                }
              />

              <Route
                path="project/:projectId/result"
                element={
                  <RequireAuth>
                    <Suspense fallback={<Loading />}>
                      <Result />
                    </Suspense>
                  </RequireAuth>
                }
              />
              <Route
                path="recommend/*"
                element={
                  <Suspense fallback={<Loading />}>
                    <RecommendPage />
                  </Suspense>
                }
              />
              <Route
                path="recommend/project/:projectId"
                element={
                  <Suspense fallback={<Loading />}>
                    <RecommendPageDetail />
                  </Suspense>
                }
              />
              <Route
                path="test/*"
                element={
                  <Suspense fallback={<Loading />}>
                    <Test />
                  </Suspense>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BodyDiv>
        </Router>
      </AuthProvider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

export default App;
