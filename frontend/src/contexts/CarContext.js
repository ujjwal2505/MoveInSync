import { createContext, useEffect, useState } from "react";
import moment from "moment";
export const CarContext = createContext();

const CarContextProvider = ({ children }) => {
  const [fields, setFields] = useState({
    registartionNo: "",
    shiftStartTime: moment().utc().format(),
    shiftEndTime: moment().utc().format(),
    active: true,
    driverName: "",
    driverPhoneNo: "",
  });
  const [startGarageLocation, setStartGarageLocation] = useState({
    lat: 12.9123485,
    lng: 77.643397,
    formatted_address: "Move In Sync Office",
  });

  const [endGarageLocation, setEndGarageLocation] = useState({
    lat: 12.9123485,
    lng: 77.643397,
    formatted_address: "Move In Sync Office",
  });

  return (
    <CarContext.Provider
      value={{
        fields,
        setFields,
        startGarageLocation,
        setStartGarageLocation,
        endGarageLocation,
        setEndGarageLocation,
      }}
    >
      {children}
    </CarContext.Provider>
  );
};

export default CarContextProvider;
