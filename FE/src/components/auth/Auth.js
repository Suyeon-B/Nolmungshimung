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

async function fetchLogOut(id) {
  // console.log("fetch Log Out", id);
  const data = {
    _id: id,
  };
  const response = await fetch(
    `https://${process.env.REACT_APP_SERVER_IP}:8443/users/signout`,
    {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    }
  );
  return response.json();
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(null);
  useEffect(() => {
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
    // console.log(user);
    // setUser(userAuth);
  }, []);

  const login = async (user) => {
    setUser(user);
    setLoading(true);
    // window.location.href = "/";
  };

  const logout = async (data) => {
    // cookie 삭제
    // console.log(data);
    // deleteCookie("w_access");
    // deleteCookie("w_refresh");
    fetchLogOut(data);
    setUser(null);

    sessionStorage.clear();
    setLoading(false);
    window.location.replace("/");
    // window.location.href = "/";
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
