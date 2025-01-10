import React, { useState, useEffect } from "react";
import Navigation from "../../layout/Navigation";
import "./messages.css";
import viewMessageData from "./../../data/viewMessageData.json";

export default function ViewMessage() {
  // Sample data to display
  const [data, setData] = useState({});

  useEffect(() => {
    // This is where you can fetch or set real data if needed
    // For now, it will display the sample data
    setData(viewMessageData);
  }, []);

  return (
    <>
      <Navigation />
      <div className="background-page">
        <h2 className="mb-4 text-center">View Message</h2>

        <div className="card shadow-sm message-div">
          <div className="card-body">
            <h5 className="card-title">{data.name}</h5>
            <p className="card-subtitle mb-2 text-muted">{new Date(data.date).toLocaleDateString()}</p>

            <p className="card-text">{data.body}</p>

            <div className="d-flex justify-content-between align-items-center mt-5">
              <a href={`mailto:${data.email}`} className="btn btn-outline-primary">
                Reply
              </a>
              <p className="mb-0">
                Email:{" "}
                <strong>
                  <a href={`mailto:${data.email}`} className="text-decoration-none">
                    {data.email}
                  </a>
                </strong>
              </p>
              <button type="button" className="btn btn-danger">
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
