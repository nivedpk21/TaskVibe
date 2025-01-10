import { useEffect, useState } from "react";
import Navigation from "../../../layout/Navigation";
import "./earnUrlShortner.css";
import axiosInstance from "./../../../utils/axiosInstance.js";

export default function EarnUrlShortner() {
  const token = localStorage.getItem("token");
  const [data, setData] = useState([]); // Stores the list of tasks
  const [objData, setObjData] = useState(null); // Stores a single task object if returned
  const [currentPage, setCurrentPage] = useState(1); // Tracks the current page
  const [totalPages, setTotalPages] = useState(1); // Total number of pages
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    // Initial fetch on component mount
    loadTasks(currentPage);
    // Event listener to refresh tasks on window focus
    const handleFocus = () => {
      loadTasks(currentPage); // Refetch tasks when the main window regains focus
    };
    window.addEventListener("focus", handleFocus);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, [currentPage]);

  const loadTasks = (page) => {
    setLoading(true);
    setError(null); // Reset error before making a request

    axiosInstance
      .get(`/user/list-url-shortener-tasks?page=${page}&limit=6`, {
        headers: { Authorization: `bearer ${token}` },
      })
      .then((response) => {
        console.log(response);
        const result = response?.data?.data;
        // Check if pagination object exists before accessing totalPages
        const pagination = response?.data?.pagination;
        setTotalPages(pagination ? pagination.totalPages : 1); // Default to 1 if pagination is undefined

        if (Array.isArray(result)) {
          setData(result); // Set new tasks on page change
          setObjData(null); // Reset objData when multiple tasks are returned
        } else if (typeof result === "object" && result !== null) {
          setObjData(result); // Set objData when a single task is returned
        }
      })
      .catch((error) => {
        console.log(error);
        setError("Failed to load tasks. Please try again later.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleViewTask = (taskId) => {
    axiosInstance
      .get(`/user/start-task/${taskId}`, { headers: { Authorization: `bearer ${token}` } })
      .then((response) => {
        console.log(response);
        window.open(response.data.data);
      })
      .catch((error) => {
        console.log(error);
        alert("Failed to start task.");
      });
  };

  const cancelTask = (taskId) => {
    axiosInstance
      .get(`/user/cancel-shorturltask/${taskId}`, { headers: { Authorization: `bearer ${token}` } })
      .then((response) => {
        console.log(response);
        setObjData(null); // Clear objData after canceling
        setCurrentPage(1); // Reset to the first page
        setData([]); // Clear existing data
        loadTasks(1); // Reload tasks after canceling
      })
      .catch((error) => {
        console.log(error);
        alert("Failed to cancel task.");
      });
  };

  const handleRemove = (taskId) => {
    axiosInstance
      .get(`/user/removetask/${taskId}`, { headers: { Authorization: `bearer ${token}` } })
      .then((response) => {
        console.log(response);
        setData((prevData) => prevData.filter((task) => task._id !== taskId));
      })
      .catch((error) => {
        console.log(error);
        alert("Failed to remove task.");
      });
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1); // Decrement page
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1); // Increment page
    }
  };

  return (
    <>
      <Navigation />
      <div className="background-page">
        <h3 className="text-center mb-4">Earn ShortUrl</h3>
        <div className="view-shorturl-header-div border mb-2">
          <div>
            <p>Name</p>
          </div>
          <div>
            <p>Pay</p>
          </div>
          <div>
            <p>Time</p>
          </div>
          <div>
            <p>Actions</p>
          </div>
        </div>

        {error && <p className="text-danger text-center">{error}</p>}

        {Array.isArray(data) && data.length > 0 ? (
          data.map((item) => (
            <div key={item._id} className="view-shorturl-div border rounded-4 shadow-sm p-3 mb-3">
              <div>
                <p>{item.name}</p>
              </div>
              <div>
                <p className="text-success">{item.payPerView.$numberDecimal.toString()}$</p>
              </div>
              <div>
                <p>15:00 min</p>
              </div>
              <div>
                <button
                  onClick={() => handleRemove(item._id)}
                  type="button"
                  className="btn btn-outline-danger me-1 btn-sm">
                  Remove
                </button>
                <button
                  onClick={() => handleViewTask(item._id)}
                  type="button"
                  className="btn btn-primary btn-sm">
                  View
                </button>
              </div>
            </div>
          ))
        ) : objData ? (
          <>
            <div className="view-shorturl-div border rounded-4 shadow-sm p-3 border-danger">
              <div>
                <p>{objData.name}</p>
              </div>
              <div>
                <p className="text-success">{objData.payPerView.$numberDecimal.toString()}$</p>
              </div>
              <div>
                <p>15:00 min</p>
              </div>
              <div>
                <button
                  onClick={() => cancelTask(objData._id)}
                  type="button"
                  className="btn btn-outline-danger me-1 btn-sm">
                  Cancel
                </button>
                <button
                  onClick={() => handleViewTask(objData._id)}
                  type="button"
                  className="btn btn-primary btn-sm">
                  View
                </button>
              </div>
            </div>
            <p className="text-center mt-5 text-secondary">
              Complete or cancel the above task to view more active tasks!
            </p>
          </>
        ) : (
          <p className="text-center mt-5 text-secondary">No more tasks!</p>
        )}

        {/* Bootstrap 5 Pagination */}
        {Array.isArray(data) && data.length > 0 && (
          <div className="d-flex justify-content-center mt-4">
            <ul className="pagination">
              <li className="page-item">
                <button onClick={handlePreviousPage} className="page-link" disabled={currentPage === 1}>
                  Previous
                </button>
              </li>
              <li className="page-item disabled">
                <span className="page-link">
                  {currentPage} of {totalPages}
                </span>
              </li>
              <li className="page-item">
                <button onClick={handleNextPage} className="page-link" disabled={currentPage === totalPages}>
                  Next
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </>
  );
}
