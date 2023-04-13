const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { google } = require("googleapis");

const app = express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* -------------------------------------------------------------------------- */
/*                                 twilio API                                 */
/* -------------------------------------------------------------------------- */

const client = require("twilio")(
  process.env.ACCOUNT_SID,
  process.env.AUTH_TOKEN
);

app.post("/api/getcode", async (req, res) => {
  const verification = await client.verify.v2
    .services(process.env.VERIFY_SERVICE_SID)
    .verifications.create({
      to: `+91${req.body.phoneNo}`,
      channel: req.body.channel,
    });
  if (verification.status == "pending") {
    res.status(200).json({
      success: true,
      message: `OTP SENT to ${req.body.phoneNo}`,
    });
  }

  res;
});

app.post("/api/verifycode", async (req, res) => {
  try {
    client.verify.v2
      .services(process.env.VERIFY_SERVICE_SID)
      .verificationChecks.create({
        to: `+91${req.body.phoneNo}`,
        code: req.body.code,
      })
      .then((verification) => {
        console.log("verification", verification);
        if (verification.valid) {
          return res.status(200).json({
            success: true,
            token: verification.sid,
            role: "ADMIN",
            phoneNo: req.body.phoneNo,
          });
        } else {
          return res.status(404).json({
            success: false,
            message: "WRONG OTP",
          });
        }
      });
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      success: false,
      message: "WRONG OTP",
    });
  }
});

/* -------------------------------------------------------------------------- */
/*                           crud for google sheets                           */
/* -------------------------------------------------------------------------- */

const spreadsheetId = process.env.DATABASE_ID;

function getAuth() {
  const auth = new google.auth.GoogleAuth({
    keyFile: "credentials.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });
  return auth;
}

/* ----------------------- Proccure Google Sheet method ---------------------- */
async function getGoogleSheet(auth) {
  const client = await auth.getClient();
  const googleSheet = google.sheets({ version: "v4", auth: client });
  return googleSheet;
}

/* ----------------------- GET Google Sheet method ---------------------- */

app.get("/api/getSheetData", async (req, res) => {
  const auth = getAuth();
  const googleSheet = await getGoogleSheet(auth);

  const getMetaData = await googleSheet.spreadsheets.get({
    auth,
    spreadsheetId,
  });

  const getSheetData = await googleSheet.spreadsheets.values.get({
    auth,
    spreadsheetId,
    //   range: 'Sheet1!A2:B',
    range: "Sheet1",
  });

  const rows = getSheetData.data.values;
  const headers = rows.shift();
  let data = [];
  data = rows.map((row, idx) => {
    const obj = {};
    headers.forEach((header, index) => {
      if (header === "active") {
        obj[header] = row[index] === "TRUE";
      } else if (
        header == "startGarageLocation" ||
        header == "endGarageLocation"
      ) {
        obj[header] = row[index] === "" ? "" : JSON.parse(row[index]);
      } else {
        obj[header] = !!row[index] ? row[index] : "";
      }
    });
    obj.id = idx + 1;

    return obj;
  });

  data = data.filter((row) => row.uuid == req.headers.userid);
  console.log(data);
  //   console.log(data);

  res.status(200).json({
    success: true,
    metaData: getMetaData,
    data,
  });
});

/* ----------------------- POST Google Sheet method ---------------------- */

app.post("/api/postSheetData", async (req, res) => {
  const auth = getAuth();
  const googleSheet = await getGoogleSheet(auth);
  const {
    registartionNo,
    shiftStartTime,
    shiftEndTime,
    startGarageLocation,
    endGarageLocation,
    active,
    driverName,
    driverPhoneNo,
  } = req.body;
  console.log(req.headers);
  await googleSheet.spreadsheets.values.append({
    auth,
    spreadsheetId,
    range: "Sheet1",
    valueInputOption: "USER_ENTERED",
    resource: {
      values: [
        [
          req.headers.userid,
          registartionNo,
          JSON.stringify(startGarageLocation),
          JSON.stringify(endGarageLocation),
          shiftStartTime,
          shiftEndTime,
          active,
          driverName,
          driverPhoneNo,
        ],
      ],
    },
  });

  res.status(200).json({
    success: true,
    message: "Sucessfully Submitted",
  });
});

/* ----------------------- UPDATE Google Sheet method ---------------------- */

app.post("/api/updateSheetData", async (req, res) => {
  const auth = getAuth();
  const googleSheet = await getGoogleSheet(auth);

  const {
    registartionNo,
    shiftStartTime,
    shiftEndTime,
    startGarageLocation,
    endGarageLocation,
    active,
    id,
    driverName,
    driverPhoneNo,
  } = req.body;

  await googleSheet.spreadsheets.values.update({
    auth,
    spreadsheetId,
    range: `Sheet1!A${id + 1}`,
    valueInputOption: "USER_ENTERED",
    resource: {
      values: [
        [
          req.headers.userid,
          registartionNo,
          JSON.stringify(startGarageLocation),
          JSON.stringify(endGarageLocation),
          shiftStartTime,
          shiftEndTime,
          active,
          driverName,
          driverPhoneNo,
        ],
      ],
    },
  });

  res.status(200).json({
    success: true,
    message: "Sucessfully Updated",
  });
});

/* ----------------------- DELETE Google Sheet method ---------------------- */

app.post("/api/deleteSheetData", async (req, res) => {
  const auth = getAuth();
  const googleSheet = await getGoogleSheet(auth);

  await googleSheet.spreadsheets.values.clear({
    auth,
    spreadsheetId,
    range: "Sheet1",
  });

  res.send("Deleted Successfully");
});

const PORT = 8080;

app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});
