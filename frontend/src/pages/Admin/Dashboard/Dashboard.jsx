import React, { useEffect, useState } from "react";
import axios from "axios";
import DashboardTable from "./DashboardTable";
import AddCar from "./AddCar";
import moment from "moment";
import "./Dashboard.scss";
import { checkisTimeBetween } from "../../../helper/functions";
import { toast } from "react-toastify";

const Dashboard = () => {
  const [carData, setCarData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [showEditCar, setShowEditCar] = useState({ status: false, type: "" });

  const [stats, setStats] = useState({
    activeCars: 0,
    currentlyActive: 0,
    incomplete: 0,
  });

  const getSheetData = async () => {
    try {
      const res = await axios.get("/api/getSheetData");

      if (res.data.success) {
        setCarData(res.data.data);
        setFilteredData(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    console.log("hello from dashboard");
    (async () => {
      await getSheetData();
    })();
  }, []);

  useEffect(() => {
    let activeCars = 0;
    let currentlyActive = 0;
    let incomplete = 0;
    carData?.map((el) => {
      if (el.active) {
        activeCars++;
      }

      if (checkisTimeBetween(el.shiftStartTime, el.shiftEndTime)) {
        currentlyActive++;
      }
      // console.log(Object.value)
      if (
        Object.values(el).some((value) => {
          // console.log(typeof value === "object");
          if (typeof value === "object") {
            return Object.values(value).some((val) => val === "");
          }
          return value === "";
        })
      ) {
        incomplete++;
      }
    });

    setStats({
      ...stats,
      activeCars,
      currentlyActive,
      incomplete,
    });
  }, [carData]);

  const handleFormSubmit = async (payload) => {
    try {
      let res = {};
      if (showEditCar.type === "add") {
        res = await axios.post("/api/postSheetData", payload);
      } else {
        res = await axios.post("/api/updateSheetData", payload);
      }
      if (res.data.success) {
        toast.success(res.data.message);
        setShowEditCar(false);
        await getSheetData();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleFilter = (filter) => {
    let data = [];
    if (filter === "activeCar") {
      data = carData?.filter((el) => el.active);
    } else if (filter === "currentlyActiveCar") {
      data = carData?.filter((el) =>
        checkisTimeBetween(el.shiftStartTime, el.shiftEndTime)
      );
    } else if (filter === "incomplete") {
      data = carData?.filter((el) =>
        Object.values(el).some((value) => {
          if (typeof value === "object") {
            return Object.values(value).some((val) => val === "");
          }
          return value === "";
        })
      );
    }
    setFilteredData(data);
  };

  if (showEditCar.status) {
    return (
      <div>
        {
          <AddCar
            showEditCar={showEditCar}
            handleFormSubmit={handleFormSubmit}
            setShowEditCar={setShowEditCar}
          />
        }
      </div>
    );
  }

  return (
    <div>
      <h1
        className="dashboard_heading"
        onClick={() => setFilteredData(carData)}
      >
        Welcome
      </h1>
      {/* <div className="company_name">SRS Travels</div> */}

      <div className="dashboard_stats_container">
        <div
          className="dashboard_stats_card"
          onClick={() => handleFilter("activeCar")}
        >
          Active Car: {stats.activeCars}
        </div>
        <div
          className="dashboard_stats_card"
          onClick={() => handleFilter("currentlyActiveCar")}
        >
          Currently Running Car: {stats.currentlyActive}
        </div>
        <div
          className="dashboard_stats_card"
          onClick={() => handleFilter("incomplete")}
        >
          Incomplete Data: {stats.incomplete}
        </div>
      </div>

      <div className="dashboard_table_container">
        <button
          className="custom-btn"
          onClick={() => setShowEditCar({ status: true, type: "add" })}
        >
          Add Car
        </button>

        <DashboardTable
          carData={filteredData}
          setShowEditCar={setShowEditCar}
        />
      </div>
    </div>
  );
};

export default Dashboard;
