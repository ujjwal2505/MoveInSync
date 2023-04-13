import { ROLE_ROUTES } from "./constants/index";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import "./RoleRoute.scss";
import { UserContext } from "../contexts/UserContext";
import CarContextProvider from "../contexts/CarContext";
//components

const RoleRoutes = () => {
  const navigate = useNavigate();
  const { user, authenticated } = useContext(UserContext);

  useEffect(() => {
    console.log("hello from role routes", user, authenticated);
  }, [authenticated]);

  return authenticated ? (
    <CarContextProvider>
      <Routes>
        {ROLE_ROUTES[user.role]?.map((route) => (
          <Route
            key={route.name}
            path={route.link}
            exact
            element={route.component}
          />
        ))}
      </Routes>
    </CarContextProvider>
  ) : (
    navigate("/")
  );
};

export default RoleRoutes;
