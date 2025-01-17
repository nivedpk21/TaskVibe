import { useEffect, useState } from "react";
import Navigation from "../../layout/Navigation";
import "./userDashboard.css";
import axiosInstance from "./../../utils/axiosInstance.js";
import { getAuthData } from "./../../utils/auth.js";
import toast from "react-hot-toast";

export default function UserDashboard() {
  const { token } = getAuthData();
  const clientUrl = import.meta.env.VITE_CLIENT_URL;
  const [data, setData] = useState({});
  const [copy, setCopy] = useState(false);
  console.log("clientUrl", clientUrl);

  useEffect(() => {
    axiosInstance
      .get("/user/dashboard-data", { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => {
        setData(response.data.data);
      })
      .catch((error) => {
        toast.error("an error occured");
      });
  }, [token]);

  const walletBalance = parseFloat(data?.walletBalance?.$numberDecimal).toFixed(4);

  const referalUrl = `${clientUrl}/signup/${data.refererCode}`;
  const handleCopy = () => {
    console.log("cpiesd");
    navigator.clipboard.writeText(referalUrl).then(() => {
      setCopy(true);
      setTimeout(() => setCopy(false), 2000);
    });
  };
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
        {/**referal div */}
        <div className="">
          <div className="card shadow-sm my-5 border-0 referer-div">
            <div className="card-body text-center p-4">
              <h4 className="card-title fw-bold mb-3">🎉 Refer and Earn!</h4>
              <p className="card-text mb-4 text-light">
                Share your referal link and earn <strong>5% commission</strong> on earnings generated through
                sign-ups using your referral.
              </p>
              <div className="input-group mb-3" style={{ maxWidth: 500, margin: "0 auto" }}>
                <input
                  type="text"
                  className="form-control form-control-lg rounded-start border-0"
                  id="referralLink"
                  readOnly
                  value={referalUrl}
                  style={{ background: "rgba(255, 255, 255, 0.1)", color: "white" }}
                />
                <button
                  className="btn btn-lg btn-light rounded-end px-4 fw-bold"
                  onClick={handleCopy}
                  style={{ boxShadow: "0 4px 8px rgba(0,0,0,0.2)" }}>
                  {copy ? "copied" : "copy"}
                </button>
              </div>
              <p className="small mt-3 text-light">💡 Tip: Share it now and start earning!</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
