import { createContext, useEffect, useState } from "react";
import { ROLES } from "../constants/role";
import { ROLE_ROUTES } from "../rbac/constants";

export const UserContext = createContext();

const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState({ role: "", phoneNo: "" });
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    console.log("hello from context");
    checkAuthentication();
  }, []);

  const checkAuthentication = () => {
    //get token
    //fetch user
    //get role
    //set everything

    if (!!localStorage.getItem("token")) {
      const obj = JSON.parse(localStorage.getItem("token"));

      if (!!obj.token) {
        console.log("authentication");
        setUser({ role: ROLES.ADMIN, phoneNo: obj.phoneNo });
        setAuthenticated(true);
      }
    } else {
      setAuthenticated(false);
      setUser({ role: "", phoneNo: "" });
    }
  };

  return (
    <UserContext.Provider
      value={{ authenticated, user, setUser, setAuthenticated }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
