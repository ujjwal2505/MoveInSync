import React, { useContext, useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { CarContext } from "../../../contexts/CarContext";
import EditIcon from "@mui/icons-material/Edit";
import moment from "moment";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import Tooltip from "@mui/material/Tooltip";

const DashboardTable = ({ carData, setShowEditCar }) => {
  const { fields, setFields, setStartGarageLocation, setEndGarageLocation } =
    useContext(CarContext);

  const handleEdit = (row) => {
    const {
      registartionNo,
      shiftStartTime,
      shiftEndTime,
      active,
      id,
      driverName,
      driverPhoneNo,
    } = row;

    setFields({
      ...fields,
      registartionNo,
      shiftStartTime,
      shiftEndTime,
      active,
      id,
      driverName,
      driverPhoneNo,
    });

    // const startLoc = row.startGarageLocation.split(",");
    // setStartGarageLocation({
    //   lat: startLoc[0],
    //   lng: startLoc[1],
    // });
    setStartGarageLocation(row.startGarageLocation);
    setEndGarageLocation(row.endGarageLocation);

    // const endLoc = row.endGarageLocation.split(",");
    // setEndGarageLocation({
    //   lat: endLoc[0],
    //   lng: endLoc[1],
    // });
    setShowEditCar({ status: true, type: "edit" });
  };

  const openMapByCoordiates = (val) => {
    const { lat, lng } = val;
    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    window.open(url, "_blank");
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Edit</TableCell>
            <TableCell>Active</TableCell>
            <TableCell>Registration No</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Phone No</TableCell>
            <TableCell>Start Location</TableCell>
            <TableCell>End Location</TableCell>
            <TableCell>Start Time</TableCell>
            <TableCell>End Time</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {carData?.map((row, idx) => {
            return (
              <TableRow
                key={idx}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell>
                  <EditIcon onClick={() => handleEdit(row)} />
                </TableCell>
                <TableCell>
                  {row.active ? (
                    <CheckCircleIcon color={"success"} />
                  ) : (
                    <CancelIcon color={"error"} />
                  )}
                </TableCell>
                <TableCell>{row.registartionNo}</TableCell>
                <TableCell>{row.driverName}</TableCell>
                <TableCell>{row.driverPhoneNo}</TableCell>

                <Tooltip title={row.startGarageLocation.formatted_address}>
                  <TableCell
                    className="pointer"
                    onClick={() => openMapByCoordiates(row.startGarageLocation)}
                  >
                    {`${row.startGarageLocation.lat} , ${row.startGarageLocation.lng}`}
                  </TableCell>
                </Tooltip>

                <Tooltip title={row.endGarageLocation.formatted_address}>
                  <TableCell
                    className="pointer"
                    onClick={() => openMapByCoordiates(row.endGarageLocation)}
                  >
                    {`${row.endGarageLocation.lat} , ${row.endGarageLocation.lng}`}
                  </TableCell>
                </Tooltip>

                <TableCell>
                  {moment(row.shiftStartTime).format("HH:mm")}
                </TableCell>
                <TableCell>
                  {moment(row.shiftEndTime).format("HH:mm")}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DashboardTable;
