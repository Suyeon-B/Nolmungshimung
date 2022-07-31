import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import styled from "styled-components";
import "./App.css";
import "./reset.css";
import { QueryClient, QueryClientProvider } from "react-query";
import {
  AuthProvider,
  RequireAuth,
  NotRequireAuth,
} from "./components/auth/Auth";
import { PAGE_LIST } from "./routes";
import { ReactQueryDevtools } from "react-query/devtools";
import Loading from "./components/loading/Loading";

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
            <Routes>
              {PAGE_LIST.map(({ path, element, auth }) => {
                if (auth) {
                  return (
                    <Route
                      key={path}
                      path={path}
                      element={
                        <RequireAuth>
                          <Suspense fallback={<Loading />}>{element}</Suspense>
                        </RequireAuth>
                      }
                    />
                  );
                } else if (auth === null) {
                  return (
                    <Route
                      key={path}
                      path={path}
                      element={
                        <Suspense fallback={<Loading />}>{element}</Suspense>
                      }
                    />
                  );
                } else {
                  return (
                    <Route
                      key={path}
                      path={path}
                      element={
                        <NotRequireAuth>
                          <Suspense fallback={<Loading />}>{element}</Suspense>
                        </NotRequireAuth>
                      }
                    />
                  );
                }
              })}
            </Routes>
          </BodyDiv>
        </Router>
      </AuthProvider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

export default App;
