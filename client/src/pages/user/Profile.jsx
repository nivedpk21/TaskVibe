import "./profile.css";
import Navigation from "../../layout/Navigation";
import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { Link } from "react-router-dom";

export default function Profile() {
  const token = localStorage.getItem("token");
  const [data, setData] = useState({});

  useEffect(() => {
    axiosInstance
      .get("/user/profile", { headers: { Authorization: `bearer ${token}` } })
      .then((response) => {
        console.log(response);
        setData(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [token]);

  return (
    <>
      <Navigation />
      <div className="background-page">
        <div id="profile-div" className="container  rounded-4 p-2 shadow-sm">
          <div className="profile-pic-div  text-center">
            <div className="profile-pic mx-auto"></div>
            USER
          </div>
          <div className="profile-content-div mt-3">
            <div className="card">
              <ul className="list-group list-group-flush">
                <li className="list-group-item">
                  <span>Email : {data.email ? data.email : " ---"}</span>
                </li>
                <li className="list-group-item">
                  <div className="d-flex">
                    <span className="mb-0">Password : * * * * * </span>
                    <Link
                      className="ms-auto link-css btn btn-sm btn-outline-success rounded-pill"
                      to="/update-password">
                      Edit
                    </Link>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
