import React, { useEffect, useState } from "react";

import moment from "moment";

import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

const CustomTimePicker = ({ onChange, value, label }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <TimePicker label={label} value={value} onChange={onChange} />
    </LocalizationProvider>
  );
};

export default CustomTimePicker;
