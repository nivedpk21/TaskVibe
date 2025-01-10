import React, { useState, useEffect } from "react";
import axios from "axios";
import Navigation from "../../layout/Navigation";
import userListData from "./../../data/userListData.json";
import "./userList.css";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const usersPerPage = 5;

  const fetchUsers = async (page) => {
    try {
      const response = await axios.get(`/api/users?page=${page}&limit=${usersPerPage}`);
      setUsers(response.data.users);
      setTotalPages(response.data.totalPages);
      setCurrentPage(response.data.currentPage);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  useEffect(() => {
    // fetchUsers(currentPage);
    setUsers(userListData);
  }, [currentPage]);

  return (
    <>
      <Navigation />
      <div className="container-fluid background-page">
        <h2 className="mb-4 text-center">Registered Users</h2>
        <div className="table-div">
          <table className=" table table-striped table-bordered table-hover">
            <thead>
              <tr>
                <th>#</th>
                <th>Email</th>
                <th>Country</th>
                <th>Wallet ($)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users?.map((user, index) => (
                <tr key={user._id}>
                  <td>{(currentPage - 1) * usersPerPage + index + 1}</td>
                  <td>{user.email}</td>
                  <td>{user.country}</td>
                  <td>{parseFloat(user.wallet.$numberDecimal).toFixed(2)}</td>
                  <td>
                    <button className="btn btn-sm btn-outline-secondary">Manage</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <nav aria-label="Page navigation" className="mt-4">
          <ul className="pagination justify-content-center">
            {[...Array(totalPages).keys()].map((number) => (
              <li key={number + 1} className={`page-item ${number + 1 === currentPage ? "active" : ""}`}>
                <button className="page-link" onClick={() => setCurrentPage(number + 1)}>
                  {number + 1}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}
