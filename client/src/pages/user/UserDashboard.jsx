import { useEffect, useState } from "react";
import Navigation from "../../layout/Navigation";
import "./userDashboard.css";
import axiosInstance from "./../../utils/axiosInstance.js";
import { getAuthData } from "./../../utils/auth.js";

export default function UserDashboard() {
  // const { token } = getAuthData();
  const token = localStorage.getItem("token");
  const [data, setData] = useState({});

  useEffect(() => {
    axiosInstance
      .get("/user/dashboard-data", { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => {
        console.log("response", response);
        setData(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [token]);

  const walletBalance = parseFloat(data?.walletBalance?.$numberDecimal).toFixed(4);

  return (
    <>
      <Navigation />
      <div className="background-page">
        <h3 className="text-center mb-5">User Dashboard</h3>
        <div id="dashboard-div" className="container">
          <div className="dash-info text-center border rounded-3 shadow-sm">
            <span>Todays Earnings</span>
            <br />
            <span>{data.todaysEarning} $</span>
          </div>
          <div className="dash-info text-center border rounded-3 shadow-sm">
            <span>Wallet Balance</span>
            <br />
            <span>{walletBalance} $</span>
          </div>
          <div className="dash-info text-center border rounded-3 shadow-sm">
            <span>Completed Tasks</span>
            <br />
            <span>{data.completedTasks}</span>
          </div>
          <div className="dash-info text-center border rounded-3 shadow-sm">
            <span>Live Campaigns</span>
            <br />
            <span>{data.liveCampaigns}</span>
          </div>
        </div>
      </div>
    </>
  );
}
