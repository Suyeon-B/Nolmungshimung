import { useState, createContext, useContext, useEffect } from "react";
import { deleteCookie, getCookie } from "./cookie";
import { Navigate } from "react-router-dom";

const AuthContext = createContext(null);

async function fetchCallAuth() {
  const response = await fetch(
    `https://${process.env.REACT_APP_SERVER_IP}:8443/users/auth`,
    {
      method: "get",
      headers: {
        "content-type": "application/json",
      },
      credentials: "include",
    }
  );

  return response.json();
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(null);
  useEffect(() => {
    // console.log("auth auth");
    //To know my current status, send Auth request
    // async function callAuth() {
    //   await fetch(
    //     `https://${process.env.REACT_APP_SERVER_IP}:8443/users/auth`,
    //     {
    //       method: "get",
    //       headers: {
    //         "content-type": "application/json",
    //       },
    //       credentials: "include",
    //     }
    //   )
    //     .then((response) => response.json())
    //     .then((response) => {
    //       // console.log("response : " + JSON.stringify(response));
    //       //Not Loggined in Status
    //       if (!response.isAuth) {
    //         console.log("로그인 해주세요");
    //         // window.location.replace("/signin");
    //         navigate("/signin", { replace: true });
    //         //Loggined in Status
    //       } else {
    //         const userAuth = response.user_name;
    //         setUser(response.user_name); // isAuth가 true임이 증명되어야 화면을 나타내도록 처리
    //         console.log(response.user_name);
    //       }
    //     });
    // }
    async function callAuth() {
      const data = await fetchCallAuth();
      setUser(data.user_name);
      setLoading(data.success);
      console.log("data : ", data);
    }
    try {
      callAuth();
    } catch {
      console.log("WTF");
    }
    console.log(user);
    // setUser(userAuth);
  }, []);

  const login = async (user) => {
    await setUser(user);
    await setLoading(true);
    // window.location.href = "/";
  };

  const logout = async () => {
    // cookie 삭제
    deleteCookie("w_access");
    deleteCookie("w_refresh");
    await setUser(null);
    sessionStorage.clear();
    window.location.replace("/");
    // window.location.href = "/";
    await setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export const RequireAuth = ({ children }) => {
  const auth = useAuth();

  if (auth.loading === false) {
    return <Navigate to="/signin" />;
  } else if (auth.loading === true) {
    return children;
  }
};

export const NotRequireAuth = ({ children }) => {
  const auth = useAuth();

  if (auth?.user) {
    return <Navigate to="/" />;
  }
  return children;
};
