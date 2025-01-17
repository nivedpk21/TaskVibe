import "./wallet.css";
import Navigation from "../../layout/Navigation";
import { useEffect, useState } from "react";
import axiosInstance from "./../../utils/axiosInstance.js";
import toast from "react-hot-toast";

export default function Wallet() {
  const token = localStorage.getItem("token");
  const [balance, setBalance] = useState("0");
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    axiosInstance
      .get(`/user/wallet?page=${currentPage}&limit=6`, { headers: { Authorization: `bearer ${token}` } })
      .then((response) => {
        setData(response.data.data.transactionLog);
        setBalance(response.data.data.walletBalance);
        setTotalPages(response.data.pagination.totalPages); // Set total pages from pagination metadata
      })
      .catch((error) => {
        toast.error("an error occured");
      });
  }, [currentPage, token]); // Fetch transactions whenever currentPage changes

  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <>
      <Navigation />
      <div className="background-page">
        <div className="container wallet-div">
          {/* Wallet Balance Section */}
          <div className="card shadow-sm mb-4">
            <div className="card-body text-center">
              <h5 className="card-title">Wallet Balance</h5>
              <h2 className="text-primary fw-bold">${balance}</h2>
            </div>
          </div>

          {/* Transaction Log Section */}
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">Transaction Log</h5>
            </div>
            <div className="card-body">
              {data.length > 0 ? (
                <>
                  <div className="table-responsive">
                    <table className="table table-bordered">
                      <thead className="table-light">
                        <tr>
                          <th scope="col">Date</th>
                          <th scope="col">TaskId</th>
                          <th scope="col">Type</th>
                          <th scope="col">Amount ($)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.map((transaction) => (
                          <tr key={transaction._id}>
                            <td>{new Date(transaction.createdAt).toLocaleDateString("en-us")}</td>
                            <td>{transaction._id}</td>
                            <td>{transaction.type}</td>
                            <td className={transaction.type === "credit" ? "text-success" : "text-danger"}>
                              {transaction.amount.$numberDecimal.toString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {/* Pagination Controls */}
                  <nav>
                    <ul className="pagination justify-content-center">
                      <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                        <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>
                          Previous
                        </button>
                      </li>
                      {[...Array(totalPages).keys()].map((i) => (
                        <li key={i + 1} className={`page-item ${currentPage === i + 1 ? "active" : ""}`}>
                          <button className="page-link" onClick={() => handlePageChange(i + 1)}>
                            {i + 1}
                          </button>
                        </li>
                      ))}
                      <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                        <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>
                          Next
                        </button>
                      </li>
                    </ul>
                  </nav>
                </>
              ) : (
                <p className="text-muted">No transactions found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
