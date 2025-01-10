import { useEffect, useState } from "react";
import Navigation from "../../layout/Navigation";
import "./tasklog.css";
import axiosInstance from "../../utils/axiosInstance";

const TaskLog = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Current page number
  const [totalPages, setTotalPages] = useState(1); // Total number of pages
  const [loading, setLoading] = useState(false); // Loading state
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchTaskLog(currentPage);
  }, [currentPage]);

  const fetchTaskLog = (page) => {
    setLoading(true);
    axiosInstance
      .get(`/user/tasklog?page=${page}&limit=6`, { headers: { Authorization: `bearer ${token}` } })
      .then((response) => {
        console.log(response);
        setData(response.data.data);
        setTotalPages(response.data.pagination.totalPages); // Set total pages
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <>
      <Navigation />
      <div className="background-page">
        <h2 className="mb-4 text-center">Task Log</h2>
        {loading ? (
          <p className="text-center text-secondary">Loading...</p>
        ) : data.length > 0 ? (
          <>
            <div className="table-responsive task-log-div">
              <table className="table table-striped table-bordered">
                <thead className="table-dark">
                  <tr>
                    <th>Date</th>
                    <th>Task ID</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item) => (
                    <tr key={item._id}>
                      <td>{new Date(item.createdAt).toLocaleDateString("en-us")}</td>
                      <td>{item._id}</td>
                      <td>
                        {item.isCompleted ? (
                          <span className="badge bg-success">Completed</span>
                        ) : (
                          <span className="badge bg-danger">Cancelled</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Bootstrap 5 Pagination Controls */}
            <nav aria-label="Task log pagination" className="mt-4">
              <ul className="pagination justify-content-center">
                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}>
                    Previous
                  </button>
                </li>

                {Array.from({ length: totalPages }, (_, index) => (
                  <li key={index + 1} className={`page-item ${currentPage === index + 1 ? "active" : ""}`}>
                    <button className="page-link" onClick={() => handlePageChange(index + 1)}>
                      {index + 1}
                    </button>
                  </li>
                ))}

                <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}>
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </>
        ) : (
          <p className="text-center mt-5 text-secondary">No task log found!</p>
        )}
      </div>
    </>
  );
};

export default TaskLog;
