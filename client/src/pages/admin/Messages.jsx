import React from "react";
import Navigation from "../../layout/Navigation";
import { Link } from "react-router-dom";

export default function Messages() {
  const messages = [
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      message: "Hi, I need help with my account.",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane.smith@example.com",
      message: "Can you explain the payment process?",
    },
    {
      id: 3,
      name: "Alex Johnson",
      email: "alex.johnson@example.com",
      message: "I have a question regarding your service.",
    },
  ];

  return (
    <>
      <Navigation />
      <div className="container background-page">
        <h2 className="mb-4 text-center">User Messages</h2>
        <div className="table-responsive">
          <table className="table table-striped table-bordered table-hover text-center">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((msg, index) => (
                <tr key={msg.id}>
                  <td>{index + 1}</td>
                  <td>{msg.name}</td>
                  <td>{msg.email}</td>
                  <td>
                    <Link className="btn btn-sm btn-primary" to={`/admin/viewMessage/123`}>
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
