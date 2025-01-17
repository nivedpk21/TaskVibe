import { useState } from "react";
import Navigation from "../../layout/Navigation";
import "./signup.css";
import axiosInstance from "./../../utils/axiosInstance.js";
import toast from "react-hot-toast";

export default function ForgotPassword() {
  const [isSubmit, setIsSubmit] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [inputData, setInputData] = useState({
    email: "",
  });

  const inputChange = (e) => {
    setInputData({ ...inputData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmit(true);
    axiosInstance
      .post("/user/forgotpassword", inputData)
      .then((response) => {
        toast.success(response?.data?.message);
        setIsSent(true);
      })
      .catch((error) => {
        toast.error(error?.response?.data.message || error.message);
      })
      .finally(() => {
        setIsSubmit(false);
      });
  };

  return (
    <>
      <Navigation />
      <div className="background-page">
        {isSent ? (
          <>
            <div className="text-center mt-5">
              <span className="text-secondary fs-5">Email to reset password sent. Check your inbox !</span>
            </div>
          </>
        ) : (
          <>
            <div id="signupdiv" className="container  shadow-sm  rounded-3 p-3">
              <h4 className="text-center text-dark mt-4">Forgot Password</h4>
              <form className="mt-4" onSubmit={handleSubmit}>
                <div className="mb-3">
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    aria-describedby="emailHelpId"
                    placeholder="email"
                    required
                    onChange={inputChange}
                    disabled={isSubmit}
                  />
                </div>

                <div className="d-grid gap-2 mb-1">
                  {isSubmit ? (
                    <>
                      <button type="button" name id className="btn btn-primary disabled">
                        ...
                      </button>
                    </>
                  ) : (
                    <>
                      <button type="submit" name id className="btn btn-primary">
                        Submit
                      </button>
                    </>
                  )}
                </div>
              </form>
            </div>
          </>
        )}
      </div>
    </>
  );
}
