import { useEffect, useState } from "react";
import Navigation from "../../../layout/Navigation";
import "./earnUrlShortner.css";
import axiosInstance from "./../../../utils/axiosInstance.js";
import toast from "react-hot-toast";

export default function EarnUrlShortner() {
  const token = localStorage.getItem("token");
  const [data, setData] = useState([]); // Stores the list of tasks
  const [objData, setObjData] = useState(null); // Stores a single task object if returned
  const [currentPage, setCurrentPage] = useState(1); // Tracks the current page
  const [totalPages, setTotalPages] = useState(1); // Total number of pages
  const [loading, setLoading] = useState(false); // Loading state
  const [loadingItem, setLoadingItem] = useState(null); // clicked task id
  const [message, setMessage] = useState("loading..");
  const [reportMessage, setReportMessage] = useState("");
  const [currentTaskId, setCurrentTaskId] = useState(null);

  useEffect(() => {
    // Initial fetch on component mount
    loadTasks(currentPage);

    // Add an event listener to detect when the user returns to the page
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        loadTasks(currentPage); // Refresh data when the page becomes visible
        setLoadingItem(null);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [currentPage]);

  const loadTasks = (page) => {
    setLoading(true);
    axiosInstance
      .get(`/user/list-url-shortener-tasks?page=${page}&limit=6`, {
        headers: { Authorization: `bearer ${token}` },
      })
      .then((response) => {
        const result = response?.data?.data;
        // Check if pagination object exists before accessing totalPages
        const pagination = response?.data?.pagination;
        setTotalPages(pagination ? pagination.totalPages : 1); // Default to 1 if pagination is undefined
        if (Array.isArray(result)) {
          setData(result); // Set new tasks on page change
          setObjData(null); // Reset objData when multiple tasks are returned
        } else if (typeof result === "object" && result !== null) {
          setObjData(result); // Set objData when a single task is returned
          setData([]);
        } else {
          // Handle case when no tasks are returned
          setData([]);
          setObjData(null);
        }
        setMessage(response.data.message || "No tasks found.");
      })
      .catch((error) => {
        setMessage("Failed to load tasks. Please try again later.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // manage task
  const handleViewTask = async (taskId) => {
    setLoading(true);
    setLoadingItem(taskId);

    try {
      const response = await axiosInstance.get(`/user/start-task/${taskId}`, {
        headers: { Authorization: `bearer ${token}` },
      });
      // First  the URL in a new window
      window.open(response?.data?.data, "_blank");
    } catch (error) {
      alert("Failed to start task.");
    } finally {
      setLoading(false);
    }
  };
  const cancelTask = (taskId) => {
    axiosInstance
      .get(`/user/cancel-shorturltask/${taskId}`, { headers: { Authorization: `bearer ${token}` } })
      .then((response) => {
        setObjData(null); // Clear objData after canceling
        setCurrentPage(1); // Reset to the first page
        setData([]); // Clear existing data
        loadTasks(1); // Reload tasks after canceling
      })
      .catch((error) => {
        alert("Failed to cancel task.");
      })
      .finally(() => {
        setLoadingItem(null);
      });
  };
  const handleRemove = (taskId) => {
    axiosInstance
      .get(`/user/removetask/${taskId}`, { headers: { Authorization: `bearer ${token}` } })
      .then((response) => {
        setData((prevData) => prevData.filter((task) => task._id !== taskId));
      })
      .catch((error) => {
        alert("Failed to remove task.");
      });
  };

  // manage task report
  const submitReport = async (taskId) => {

    if (!reportMessage.trim()) {
      toast.error("Please enter a report message.");
      return;
    }

    try {
      const response = await axiosInstance.post(
        `/user/report-task/${taskId}`,
        { message: reportMessage },
        { headers: { Authorization: `bearer ${token}` } }
      );
      toast.success(response.data.message);
      setReportMessage(""); // Clear the report message
      setCurrentTaskId(null); // Clear the current task ID

      // Close the modal programmatically
      const modalElement = document.getElementById("exampleModal");
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      modalInstance?.hide();
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred while reporting the task.");
    }
  };

  // manage pages
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
        {/**new design start */}

        <div className="view-shorturl-div">
          <div className="table-responsive">
            <table className="table table-striped table-bordered">
              <thead className="table-dark">
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Task Name</th>
                  <th scope="col">Pay</th>
                  <th scope="col">Time</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(data) && data.length > 0 ? (
                  data.map((item, index) => (
                    <tr key={item._id}>
                      <th scope="row">{index + 1}</th>
                      <td>{item.name}</td>
                      <td className="text-success">{item.payPerView.$numberDecimal.toString()}$</td>
                      <td>15min</td>
                      <td>
                        <div className="d-flex justify-content-around flex-wrap">
                          {/*view  handling*/}
                          {loading && loadingItem == item._id ? (
                            <>
                              <button
                                name="removeTask"
                                className="btn btn-outline-danger btn-sm mb-1 disabled">
                                <i className="bi bi-trash"></i>
                              </button>
                              <button name="viewTask" className="btn btn-primary btn-sm mb-1">
                                <span class="spinner-border spinner-border-sm" aria-hidden="true"></span>
                              </button>
                              <button name="reportTask" className="btn btn-warning btn-sm mb-1 disabled">
                                <i className="bi bi-flag"></i>
                              </button>
                            </>
                          ) : loading && loadingItem !== item._id ? (
                            <>
                              <button
                                name="removeTask"
                                className="btn btn-outline-danger btn-sm mb-1 disabled">
                                <i className="bi bi-trash"></i>
                              </button>
                              <button name="viewTask" className="btn btn-primary btn-sm mb-1 disabled">
                                <i className="bi bi-eye"></i>
                              </button>
                              <button name="reportTask" className="btn btn-warning btn-sm mb-1 disabled">
                                <i className="bi bi-flag"></i>
                              </button>
                            </>
                          ) : loadingItem && loadingItem == item._id ? (
                            <>
                              <button
                                onClick={() => cancelTask(objData._id)}
                                className="btn btn-outline-danger btn-sm mb-1">
                                <i className="bi bi-x"></i>
                              </button>
                              <button
                                onClick={() => handleViewTask(item._id)}
                                name="viewTask"
                                className="btn btn-primary btn-sm mb-1">
                                <i className="bi bi-eye"></i>
                              </button>
                              <button
                                onClick={() => setCurrentTaskId(item._id)}
                                data-bs-toggle="modal"
                                data-bs-target="#exampleModal"
                                name="reportTask"
                                className="btn btn-warning btn-sm mb-1 ">
                                <i className="bi bi-flag"></i>
                              </button>
                            </>
                          ) : loadingItem && loadingItem !== item._id ? (
                            <>
                              <button
                                name="removeTask"
                                className="btn btn-outline-danger btn-sm mb-1 disabled">
                                <i className="bi bi-trash"></i>
                              </button>
                              <button name="viewTask" className="btn btn-primary btn-sm mb-1 disabled">
                                <i className="bi bi-eye"></i>
                              </button>
                              <button name="reportTask" className="btn btn-warning btn-sm mb-1 disabled">
                                <i className="bi bi-flag"></i>
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => handleRemove(item._id)}
                                name="removeTask"
                                className="btn btn-outline-danger btn-sm mb-1">
                                <i className="bi bi-trash"></i>
                              </button>
                              <button
                                onClick={() => handleViewTask(item._id)}
                                name="viewTask"
                                className="btn btn-primary btn-sm mb-1">
                                <i className="bi bi-eye"></i>
                              </button>
                              <button
                                onClick={() => setCurrentTaskId(item._id)}
                                data-bs-toggle="modal"
                                data-bs-target="#exampleModal"
                                name="reportTask"
                                className="btn btn-warning btn-sm mb-1">
                                <i className="bi bi-flag"></i>
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : objData ? (
                  <>
                    <tr key={objData._id}>
                      <th scope="row">{1}</th>
                      <td>{objData.name}</td>
                      <td className="text-success">{objData.payPerView.$numberDecimal.toString()}</td>
                      <td>15min</td>
                      <td>
                        <div className="d-flex justify-content-around flex-wrap">
                          <button
                            onClick={() => cancelTask(objData._id)}
                            className="btn btn-outline-danger btn-sm mb-1">
                            <i className="bi bi-x"></i>
                          </button>
                          <button
                            onClick={() => handleViewTask(objData._id)}
                            className="btn btn-primary btn-sm mb-1">
                            <i className="bi bi-eye"></i>
                          </button>
                          <button
                            onClick={() => setCurrentTaskId(item._id)}
                            data-bs-toggle="modal"
                            data-bs-target="#exampleModal"
                            className="btn btn-warning btn-sm mb-1">
                            <i className="bi bi-flag"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={5} className="text-center text-secondary">
                        complete or cancel this task to load more tasks !
                      </td>
                    </tr>
                  </>
                ) : (
                  // No tasks or data loading
                  <tr>
                    <td colSpan="5" className="text-center">
                      {loading ? "Loading tasks..." : message}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/**new design end */}

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

        {/* <!-- Modal --> */}
        <div
          className="modal fade report-modal"
          id="exampleModal"
          tabIndex={-1}
          aria-labelledby="exampleModalLabel"
          aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h3 className="modal-title fs-5" id="exampleModalLabel">
                  Report Task
                </h3>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
              </div>
              <div className="modal-body">
                <div>
                  <textarea
                    className="form-control report-input"
                    rows={3}
                    value={reportMessage}
                    name="reportMessage"
                    onChange={(e) => setReportMessage(e.target.value)}
                    placeholder={"Type your message here..."}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  onClick={() => {
                    setCurrentTaskId(null);
                    setReportMessage("");
                  }}
                  type="button"
                  className="btn btn-sm btn-secondary"
                  data-bs-dismiss="modal">
                  Close
                </button>
                <button
                  onClick={() => submitReport(currentTaskId)}
                  type="button"
                  className="btn btn-sm btn-primary">
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
