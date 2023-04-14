import React, { useEffect, useState, useContext } from "react";
import AddMap from "./AddMap";
import axios from "axios";
import { CarContext } from "../../../contexts/CarContext";
import "./AddCar.scss";
import moment from "moment";
import CustomTimePicker from "../../../components/TimePicker";
import TextField from "@mui/material/TextField";
import Switch from "@mui/material/Switch";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import AddLocationAltIcon from "@mui/icons-material/AddLocationAlt";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: "2px",
  },
}));

const AddCar = ({ setShowEditCar, showEditCar, handleFormSubmit }) => {
  const [showMap, setShowMap] = useState(false);
  const {
    fields,
    setFields,
    startGarageLocation,
    setStartGarageLocation,
    endGarageLocation,
    setEndGarageLocation,
  } = useContext(CarContext);

  const [isError, setIsError] = useState({
    registartionNo: { status: false, text: "" },
    driverName: { status: false, text: "" },
    driverPhoneNo: { status: false, text: "" },
  });

  const handleChange = (key, value) => {
    setIsError({ ...isError, [key]: { status: false, text: "" } });
    if (key == "active") {
      setFields({
        ...fields,
        active: !fields.active,
      });
      return;
    }

    setFields({
      ...fields,
      [key]: value,
    });
  };

  const handleLocation = (val) => {
    setShowMap(val);
  };

  const checkError = () => {
    if (
      Object.values(isError).some((el) => el.status === true) ||
      Object.values(endGarageLocation).some((el) => el == "") ||
      Object.values(startGarageLocation).some((el) => el == "") ||
      Object.values(fields).some((el) => el === "")
    ) {
      return true;
    }

    return false;
  };

  const handleSubmit = () => {
    if (checkError()) {
      return;
    }

    const payload = {
      ...fields,
      startGarageLocation,
      endGarageLocation,
    };

    console.log("payload", payload);
    handleFormSubmit(payload);
  };

  const handleBack = () => {
    setShowEditCar({
      ...showEditCar,
      status: false,
    });
  };

  const handleBlur = async (key) => {
    let registartionRegex =
      /^[A-Z]{2}[ -][0-9]{1,2}[ -](?:[A-Z])?(?:[A-Z]*)?[ -][0-9]{4}$/;
    let phoneRegex = /^\d{10}$/;

    if (key === "registartionNo") {
      if (
        !fields.registartionNo ||
        !registartionRegex.test(fields.registartionNo)
      ) {
        setIsError({
          ...isError,
          registartionNo: { status: true, text: "Incorrect Format" },
        });
      } else {
        const res = await axios.get("/api/getSheetData");

        if (
          res.data.data.some(
            (el) => el.registartionNo === fields.registartionNo
          )
        ) {
          setIsError({
            ...isError,
            registartionNo: { status: true, text: "Already Exists" },
          });
        }
      }
    } else if (key === "driverName" && !fields.driverName) {
      setIsError({
        ...isError,
        driverName: { status: true, text: "Required" },
      });
    } else if (
      key === "driverPhoneNo" &&
      (!fields.driverPhoneNo || !phoneRegex.test(fields.driverPhoneNo))
    ) {
      setIsError({
        ...isError,
        driverPhoneNo: { status: true, text: "Incorrect Format" },
      });
    }
  };
  console.log(isError, fields);

  return (
    <>
      <div className="heading_container">
        <div className="heading">
          <ArrowBackIcon onClick={handleBack} />
          {showEditCar?.type === "add" ? "Add" : "Edit"} Car Data
        </div>
        <Switch
          checked={fields.active}
          onChange={() => handleChange("active")}
          inputProps={{ "aria-label": "controlled" }}
        />
      </div>

      <div className="custom-form">
        {showEditCar?.type === "add" && (
          <TextField
            label="Registartion No"
            placeholder="XX-00-XX-0000"
            variant="outlined"
            onChange={(e) => handleChange("registartionNo", e.target.value)}
            onBlur={() => handleBlur("registartionNo")}
            value={fields.registartionNo}
            error={isError.registartionNo.status}
            helperText={isError.registartionNo.text}
          />
        )}
        <TextField
          label="Name"
          // placeholder="XX-00-XX-0000"
          variant="outlined"
          onChange={(e) => handleChange("driverName", e.target.value)}
          onBlur={() => handleBlur("driverName")}
          value={fields.driverName}
          error={isError.driverName.status}
          helperText={isError.driverName.text}
        />
        <TextField
          label="Phone No"
          variant="outlined"
          onChange={(e) => handleChange("driverPhoneNo", e.target.value)}
          onBlur={() => handleBlur("driverPhoneNo")}
          value={fields.driverPhoneNo}
          error={isError.driverPhoneNo.status}
          helperText={isError.driverPhoneNo.text}
        />

        <CustomTimePicker
          onChange={(val) => {
            handleChange("shiftStartTime", val.format());
          }}
          label={"Shift Start Time"}
          value={moment(fields.shiftStartTime)}
        />

        <CustomTimePicker
          onChange={(val) => {
            handleChange("shiftEndTime", val.format());
          }}
          label={"Shift End Time"}
          value={moment(fields.shiftEndTime)}
        />

        <div className="garage-location">
          <div className="garage-location_heading">
            Start Location
            <AddLocationAltIcon onClick={() => handleLocation("startLoc")} />
          </div>
          <div className="garage-location_fields">
            <TextField
              placeholder="Latitude"
              variant="outlined"
              onChange={(e) =>
                setStartGarageLocation({
                  ...startGarageLocation,
                  lat: e.target.value,
                })
              }
              value={startGarageLocation.lat}
            />

            <TextField
              placeholder="Longitude"
              variant="outlined"
              onChange={(e) =>
                setStartGarageLocation({
                  ...startGarageLocation,
                  lng: e.target.value,
                })
              }
              value={startGarageLocation.lng}
            />
          </div>
        </div>

        <div className="garage-location">
          <div className="garage-location_heading">
            End Location
            <AddLocationAltIcon onClick={() => handleLocation("endLoc")} />
          </div>
          <div className="garage-location_fields">
            <TextField
              placeholder="Latitude"
              variant="outlined"
              onChange={(e) =>
                setEndGarageLocation({
                  ...endGarageLocation,
                  lat: e.target.value,
                })
              }
              value={endGarageLocation.lat}
            />

            <TextField
              placeholder="Longitude"
              variant="outlined"
              onChange={(e) =>
                setEndGarageLocation({
                  ...endGarageLocation,
                  lng: e.target.value,
                })
              }
              value={endGarageLocation.lng}
            />
          </div>
        </div>

        <button onClick={handleSubmit} className="custom-btn">
          Save
        </button>
      </div>

      <BootstrapDialog
        onClose={() => setShowMap(false)}
        aria-labelledby="customized-dialog-title"
        open={!!showMap}
      >
        <DialogContent>
          <AddMap
            showMap={showMap}
            setEndGarageLocation={setEndGarageLocation}
            mapCenter={
              showMap === "startLoc" ? startGarageLocation : endGarageLocation
            }
            setMapCenter={
              showMap === "startLoc"
                ? setStartGarageLocation
                : setEndGarageLocation
            }
          />
        </DialogContent>
      </BootstrapDialog>
    </>
  );
};

export default AddCar;
