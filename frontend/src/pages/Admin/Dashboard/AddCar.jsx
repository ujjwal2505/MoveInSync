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
import { redirect, useNavigate } from "react-router-dom";
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
    registartionNo: false,
    driverName: false,
    driverPhoneNo: false,
  });

  const handleChange = (key, value) => {
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
    setIsError({ ...isError, [key]: false });
  };

  const handleLocation = (val) => {
    setShowMap(val);
  };

  const checkError = () => {
    let flag = false;
    let registartionRegex =
      /^[A-Z]{2}[ -][0-9]{1,2}[ -](?:[A-Z])?(?:[A-Z]*)?[ -][0-9]{4}$/;
    let phoneRegex = /^\d{10}$/;

    if (
      !fields.registartionNo ||
      !registartionRegex.test(fields.registartionNo)
    ) {
      setIsError({ ...isError, registartionNo: true });
      flag = true;
    } else if (!fields.driverName) {
      setIsError({ ...isError, driverName: true });
      flag = true;
    } else if (
      !fields.driverPhoneNo ||
      !phoneRegex.test(fields.driverPhoneNo)
    ) {
      setIsError({ ...isError, driverPhoneNo: true });
      flag = true;
    }

    return flag;
  };

  const handleSubmit = () => {
    let error = checkError();
    if (error) {
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
            value={fields.registartionNo}
            error={isError.registartionNo}
          />
        )}
        <TextField
          label="Name"
          // placeholder="XX-00-XX-0000"
          variant="outlined"
          onChange={(e) => handleChange("driverName", e.target.value)}
          value={fields.driverName}
          error={isError.driverName}
        />
        <TextField
          label="Phone No"
          variant="outlined"
          onChange={(e) => handleChange("driverPhoneNo", e.target.value)}
          value={fields.driverPhoneNo}
          error={isError.driverPhoneNo}
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
