import "./signup.css";
import { useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import Navigation from "../../layout/Navigation";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function UpdatePassword() {
  //update new password via user profile (edit password)
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [inputData, setInputData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const inputChange = (e) => {
    setInputData({ ...inputData, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const validate = (values) => {
    var error = {};
    if (!values.currentPassword) {
      error.currentPassword = "enter current password";
    }
    if (!values.newPassword) {
      error.newPassword = "enter new password";
    } else if (values.newPassword.length < 6) {
      error.newPassword = "require min 6 character";
    }
    if (!values.confirmPassword) {
      error.confirmPassword = "confirm new password";
    } else if (values.newPassword !== values.confirmPassword) {
      error.confirmPassword = "passwords do not match";
    }
    return error;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newError = validate(inputData);
    setFormErrors(newError);

    if (Object.keys(newError).length === 0) {
      setIsSubmit(true);
      axiosInstance
        .post("/user/update-password", inputData, { headers: { Authorization: `bearer ${token}` } })
        .then((response) => {
          setIsSuccess(true);
          toast.success(response.data.message);
          setTimeout(() => {
            navigate("/user/profile");
          }, 3000);
        })
        .catch((error) => {
          toast.error(error.response?.data?.message || "An error occured");
        })
        .finally(() => {
          setIsSubmit(false);
        });
    }
  };

  return (
    <>
      <Navigation />
      <div className="background-page">
        {isSuccess ? (
          <>
            <p className="text-center">
              password changed successfully ! <br />
            </p>
          </>
        ) : (
          <>
            <div id="signupdiv" className="container  shadow-sm  rounded-3 p-3">
              <h4 className="text-center text-dark mt-4">Update Password</h4>
              <form className="mt-4" onSubmit={handleSubmit}>
                <div>
                  <div className={formErrors.currentPassword ? "mb-2" : "mb-3"}>
                    <div className="d-flex">
                      <input
                        type={showPassword ? "text" : "password"}
                        className={formErrors.currentPassword ? "form-control is-invalid" : "form-control"}
                        id="password-input"
                        name="currentPassword"
                        onChange={inputChange}
                        placeholder="Enter current password"
                        disabled={isSubmit}
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary btn-sm eye-btn"
                        onClick={togglePasswordVisibility}
                        disabled={isSubmit}>
                        {showPassword ? (
                          <>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              className="bi bi-eye"
                              viewBox="0 0 16 16">
                              <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
                              <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
                            </svg>
                          </>
                        ) : (
                          <>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              className="bi bi-eye-slash"
                              viewBox="0 0 16 16">
                              <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-2.79.588l.77.771A6 6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755q-.247.248-.517.486z" />
                              <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829" />
                              <path d="M3.35 5.47q-.27.24-.518.487A13 13 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7 7 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12z" />
                            </svg>
                          </>
                        )}
                      </button>
                    </div>
                    <span className="text-danger small">{formErrors.currentPassword}</span>
                  </div>
                  <div className={formErrors.newPassword ? "mb-2" : "mb-3"}>
                    <input
                      type={showPassword ? "text" : "password"}
                      className={formErrors.newPassword ? "form-control is-invalid" : "form-control"}
                      name="newPassword"
                      onChange={inputChange}
                      placeholder="Enter new password"
                      disabled={isSubmit}
                    />
                    <span className="invalid-feedback">{formErrors.newPassword}</span>
                  </div>
                  <div className={formErrors.confirmPassword ? "mb-2" : "mb-3"}>
                    <input
                      type={showPassword ? "text" : "password"}
                      className={formErrors.confirmPassword ? "form-control is-invalid" : "form-control"}
                      name="confirmPassword"
                      onChange={inputChange}
                      placeholder="Confirm new password"
                      disabled={isSubmit}
                    />
                    <span className="invalid-feedback">{formErrors.confirmPassword}</span>
                  </div>
                </div>

                <div className="d-grid gap-2 mb-3">
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
            </div>{" "}
          </>
        )}
      </div>
    </>
  );
}
