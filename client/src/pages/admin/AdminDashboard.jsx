import { useState } from "react";
import Navigation from "../../layout/Navigation";
import "./adminDashboard.css";

export default function AdminDashboard() {
  const [data, setData] = useState({});

  return (
    <>
      <Navigation />
      <div className="background-page">
        <h3 className="text-center mb-5">Admin Dashboard</h3>
        <div id="dashboard-div" className="container">
          <div className="dash-info text-center border rounded-3 shadow-sm">
            <span>Total Users</span>
            <br />
            <span>{data.todaysEarnings ? data.todaysEarnings : "..."}</span>
          </div>
          <div className="dash-info text-center border rounded-3 shadow-sm">
            <span>Live Users</span>
            <br />
            <span>{data.walletBalance ? data.walletBalance : "..."}</span>
          </div>
          <div className="dash-info text-center border rounded-3 shadow-sm">
            <span>Todays Users</span>
            <br />
            <span>{data.liveCampaigns ? data.liveCampaigns : "..."}</span>
          </div>
          <div className="dash-info text-center border rounded-3 shadow-sm">
            <span>Total Active Tasks</span>
            <br />
            <span>{data.completedTasks ? data.completedTasks : "..."}</span>
          </div>
          <div className="dash-info text-center border rounded-3 shadow-sm">
            <span>Todays Earnings</span>
            <br />
            <span>{data.liveCampaigns ? data.liveCampaigns : "..."}</span>
          </div>
          <div className="dash-info text-center border rounded-3 shadow-sm">
            <span>Wallet Balance </span>
            <br />
            <span>{data.liveCampaigns ? data.liveCampaigns : "..."}</span>
          </div>
        </div>
      </div>
    </>
  );
}
