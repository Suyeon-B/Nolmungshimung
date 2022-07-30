import React from "react";
import Test from "./Test";
import { BrowserRouter as Navigate } from "react-router-dom";
const SignUp = React.lazy(() => import("./pages/sign/SignUp"));
const SignIn = React.lazy(() => import("./pages/sign/SignIn"));
const Result = React.lazy(() => import("./pages/result/Result"));
const KakaoSignIn = React.lazy(() => import("./components/sign/KakaoSignIn"));
const InviteProject = React.lazy(() =>
  import("./components/invite/InviteProject")
);
const CreateProject = React.lazy(() => import("./components/CreateProject"));
const ProjectPage = React.lazy(() => import("./pages/project/ProjectPage"));
const RecommendPage = React.lazy(() =>
  import("./pages/recommend/RecommendPage")
);
const RecommendPageDetail = React.lazy(() =>
  import("./pages/recommend/RecommendPageDetail")
);
const HomeNew = React.lazy(() => import("./pages/HomeNew"));
export const PAGE_LIST = [
  {
    path: "signin/*",
    element: <SignIn />,
    auth: false,
  },
  {
    path: "signup/*",
    element: <SignUp />,
    auth: false,
  },
  {
    path: "/",
    element: <HomeNew />,
    auth: null,
  },
  {
    path: "/kakao/signin",
    element: <KakaoSignIn />,
    auth: null,
  },
  {
    path: "project/*",
    element: <CreateProject />,
    auth: true,
  },
  {
    path: "project/:projectId",
    element: <ProjectPage />,
    auth: true,
  },
  {
    path: "invite/*",
    element: <InviteProject />,
    auth: true,
  },
  {
    path: "project/:projectId/result",
    element: <Result />,
    auth: true,
  },
  {
    path: "recommend/*",
    element: <RecommendPage />,
    auth: null,
  },
  {
    path: "recommend/project/:projectId",
    element: <RecommendPageDetail />,
    auth: null,
  },
  {
    path: "test/*",
    element: <Test />,
    auth: null,
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
    auth: null,
  },
];
