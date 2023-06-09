import { BrowserRouter, Routes, Route } from "react-router-dom";
import RoleRoutes from "./rbac/RoleRoutes";
import PublicRoutes from "./PublicRoutes/PublicRoutes";
import axios from "axios";
import { useContext, useEffect } from "react";
import { UserContext } from "./contexts/UserContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./App.css";

function App() {
  const { user } = useContext(UserContext);
  console.log(process.env.NODE_ENV);
  axios.defaults.baseURL =
    process.env.NODE_ENV === "production"
      ? window.location.origin
      : "http://localhost:8080";
  axios.defaults.headers.userId = user.phoneNo;

  return (
    <div className="app_container">
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <BrowserRouter>
        <Routes>
          <Route path="/dashboard/*" element={<RoleRoutes />} />
          <Route path="/*" element={<PublicRoutes />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
