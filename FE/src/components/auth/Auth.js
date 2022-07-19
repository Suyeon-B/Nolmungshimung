import { useState, createContext, useContext, useEffect } from "react";
import { deleteCookie, getCookie } from "./cookie";
import { Navigate } from "react-router-dom";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    // console.log("auth auth");
    //To know my current status, send Auth request
    fetch(`http://${process.env.REACT_APP_SERVER_IP}:8443/users/auth`, {
      method: "get",
      headers: {
        "content-type": "application/json",
      },
      credentials: "include",
    })
      .then((response) => response.json())
      .then((response) => {
        // console.log("response : " + JSON.stringify(response));
        //Not Loggined in Status
        if (!response.isAuth) {
          console.log("로그인 해주세요");
          window.location.replace("/signin");
          // navigate("/signin", { replace: true });
          //Loggined in Status
        } else {
          // console.log(JSON.stringify(response.user_name.user_projects));
          // console.log("sss", response.user_name.user_projects);
          setUser(response.user_name); // isAuth가 true임이 증명되어야 화면을 나타내도록 처리
          // setUserProjects(response.user_name.user_projects);

          //supposed to be Admin page, but not admin person wants to go inside
          // navigate("/", { replace: true });
          // window.location.replace("/");
        }
      });
  }, []);
  // }, [user]);

  console.log("AuthProvider");
  console.log(user);
  // console.log("ss", userProjects);

  // sessionStorage.setItem("information", userProjects);
  const login = async (user) => {
    await setUser(user);
  };

  const logout = async () => {
    // cookie 삭제
    // console.log("auth logout");
    deleteCookie("w_access");
    deleteCookie("w_refresh");
    await setUser(null);
    sessionStorage.clear();
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export const RequireAuth = ({ children }) => {
  const auth = useAuth();
  // console.log(`auth in Auth: ${JSON.stringify(auth)}`);

  if (!auth?.user) {
    // console.log(`auth in Auth : ${JSON.stringify(auth)}`);
    // console.log(`auth.user in Auth: ${JSON.stringify(auth.user)}`);

    // return children;
    return <Navigate to="/signin" />;
  }
  return children;
};

export const NotRequireAuth = ({ children }) => {
  const auth = useAuth();
  // console.log(`auth in Auth: ${JSON.stringify(auth)}`);

  if (auth?.user) {
    // console.log(`auth in Auth : ${JSON.stringify(auth)}`);
    // console.log(`auth.user in Auth: ${JSON.stringify(auth.user)}`);

    // return children;
    return <Navigate to="/" />;
  }
  return children;
};
