import { useMemo, useState } from "react";
import axiosInstance from "./../../utils/axiosInstance.js";
import toast from "react-hot-toast";
import Navigation from "../../layout/Navigation";
import "./signup.css";
import { useNavigate } from "react-router-dom";

/*chat gpt scanned and optimised*/

export default function SignUp() {
  // countries name
  const countries = useMemo(
    () => [
      "Afghanistan",
      "Albania",
      "Algeria",
      "Andorra",
      "Angola",
      "Antigua and Barbuda",
      "Argentina",
      "Armenia",
      "Australia",
      "Austria",
      "Azerbaijan",
      "Bahamas",
      "Bahrain",
      "Bangladesh",
      "Barbados",
      "Belarus",
      "Belgium",
      "Belize",
      "Benin",
      "Bhutan",
      "Bolivia",
      "Bosnia and Herzegovina",
      "Botswana",
      "Brazil",
      "Brunei",
      "Bulgaria",
      "Burkina Faso",
      "Burundi",
      "Cabo Verde",
      "Cambodia",
      "Cameroon",
      "Canada",
      "Central African Republic",
      "Chad",
      "Chile",
      "China",
      "Colombia",
      "Comoros",
      "Congo (Congo-Brazzaville)",
      "Costa Rica",
      "Croatia",
      "Cuba",
      "Cyprus",
      "Czechia (Czech Republic)",
      "Denmark",
      "Djibouti",
      "Dominica",
      "Dominican Republic",
      "Ecuador",
      "Egypt",
      "El Salvador",
      "Equatorial Guinea",
      "Eritrea",
      "Estonia",
      "Eswatini (fmr. Swaziland)",
      "Ethiopia",
      "Fiji",
      "Finland",
      "France",
      "Gabon",
      "Gambia",
      "Georgia",
      "Germany",
      "Ghana",
      "Greece",
      "Grenada",
      "Guatemala",
      "Guinea",
      "Guinea-Bissau",
      "Guyana",
      "Haiti",
      "Holy See",
      "Honduras",
      "Hungary",
      "Iceland",
      "India",
      "Indonesia",
      "Iran",
      "Iraq",
      "Ireland",
      "Israel",
      "Italy",
      "Jamaica",
      "Japan",
      "Jordan",
      "Kazakhstan",
      "Kenya",
      "Kiribati",
      "Kuwait",
      "Kyrgyzstan",
      "Laos",
      "Latvia",
      "Lebanon",
      "Lesotho",
      "Liberia",
      "Libya",
      "Liechtenstein",
      "Lithuania",
      "Luxembourg",
      "Madagascar",
      "Malawi",
      "Malaysia",
      "Maldives",
      "Mali",
      "Malta",
      "Marshall Islands",
      "Mauritania",
      "Mauritius",
      "Mexico",
      "Micronesia",
      "Moldova",
      "Monaco",
      "Mongolia",
      "Montenegro",
      "Morocco",
      "Mozambique",
      "Myanmar (formerly Burma)",
      "Namibia",
      "Nauru",
      "Nepal",
      "Netherlands",
      "New Zealand",
      "Nicaragua",
      "Niger",
      "Nigeria",
      "North Korea",
      "North Macedonia",
      "Norway",
      "Oman",
      "Pakistan",
      "Palau",
      "Palestine State",
      "Panama",
      "Papua New Guinea",
      "Paraguay",
      "Peru",
      "Philippines",
      "Poland",
      "Portugal",
      "Qatar",
      "Romania",
      "Russia",
      "Rwanda",
      "Saint Kitts and Nevis",
      "Saint Lucia",
      "Saint Vincent and the Grenadines",
      "Samoa",
      "San Marino",
      "Sao Tome and Principe",
      "Saudi Arabia",
      "Senegal",
      "Serbia",
      "Seychelles",
      "Sierra Leone",
      "Singapore",
      "Slovakia",
      "Slovenia",
      "Solomon Islands",
      "Somalia",
      "South Africa",
      "South Korea",
      "South Sudan",
      "Spain",
      "Sri Lanka",
      "Sudan",
      "Suriname",
      "Sweden",
      "Switzerland",
      "Syria",
      "Tajikistan",
      "Tanzania",
      "Thailand",
      "Timor-Leste",
      "Togo",
      "Tonga",
      "Trinidad and Tobago",
      "Tunisia",
      "Turkey",
      "Turkmenistan",
      "Tuvalu",
      "Uganda",
      "Ukraine",
      "United Arab Emirates",
      "United Kingdom",
      "United States",
      "Uruguay",
      "Uzbekistan",
      "Vanuatu",
      "Venezuela",
      "Vietnam",
      "Yemen",
      "Zambia",
      "Zimbabwe",
    ],
    []
  );

  const [inputData, setInputData] = useState({
    email: "",
    country: "",
    password: "",
    confirmPassword: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [isChecked, setIsChecked] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const [loading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const inputChange = (e) => {
    setInputData({ ...inputData, [e.target.name]: e.target.value });
  };
  const handleCheckBox = (e) => {
    setIsChecked(e.target.checked);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const validate = (inputValues) => {
    var error = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!inputValues.email) {
      error.email = "email is required";
    } else if (!emailRegex.test(inputValues.email)) {
      error.email = "enter valid email";
    }
    if (!inputValues.country) {
      error.country = "country is required";
    }
    if (!inputValues.password) {
      error.password = "password is required";
    } else if (inputValues.password.length < 6) {
      error.password = "password must be minimum 6 character long";
    }
    if (!inputValues.confirmPassword) {
      error.confirmPassword = "you must confirm password";
    } else if (inputValues.password !== inputValues.confirmPassword) {
      error.confirmPassword = "passwords do not match";
    }

    if (!isChecked) {
      error.term = "you must agree to terms & conditions";
    }
    return error;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate(inputData);
    setFormErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        setIsSubmit(true);
        setIsLoading(true);
        const response = await axiosInstance.post("/user/signup", inputData);
        toast.success(response.data.message);
        setInputData({
          email: "",
          country: "",
          password: "",
          confirmPassword: "",
        });
        setIsChecked(false);
        setTimeout(() => {
          navigate("/signin");
        }, 3000);
      } catch (error) {
        console.error("error", error);
        toast.error(error.response?.data?.message || "An error occured.");
      } finally {
        setIsSubmit(false);
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      <Navigation />
      <div style={{ backgroundColor: "#f9f7f7", width: "100%", minHeight: "100vh", paddingTop: "5rem" }}>
        <div id="signupdiv" className="container  shadow-sm  rounded-3 p-3">
          <h4 className="text-center text-dark mt-4">SignUp</h4>
          <form className="mt-4" onSubmit={handleSubmit}>
            <div className={formErrors.email ? "mb-2" : "mb-3"}>
              <input
                type="email"
                className={formErrors.email ? "form-control is-invalid" : "form-control"}
                aria-describedby="emailHelpId"
                placeholder="email"
                name="email"
                onChange={inputChange}
                maxLength={35}
                disabled={isSubmit}
                value={inputData.email}
              />
              <span className="invalid-feedback">{formErrors.email}</span>
            </div>

            <div className={formErrors.country ? "mb-2" : "mb-3"}>
              <select
                className={
                  formErrors.country
                    ? "form-select form-select-smd text-secondary is-invalid"
                    : "form-select form-select-smd text-secondary"
                }
                name="country"
                onChange={inputChange}
                disabled={isSubmit}
                value={inputData.country}>
                <option value="">Select Country</option>
                {countries.map((country, index) => (
                  <option value={country} key={index}>
                    {country}
                  </option>
                ))}
              </select>
              <span className="invalid-feedback">{formErrors.country}</span>
            </div>

            <div>
              <div className={formErrors.password ? "mb-2" : "mb-3"}>
                <div className="d-flex">
                  <input
                    type={showPassword ? "text" : "password"}
                    className={formErrors.password ? "form-control is-invalid" : "form-control"}
                    id="password-input"
                    name="password"
                    onChange={inputChange}
                    placeholder="password"
                    maxLength={24}
                    disabled={isSubmit}
                    value={inputData.password}
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
                <span className="text-danger small">{formErrors.password}</span>
              </div>

              <div className={formErrors.confirmPassword ? "mb-2" : "mb-3"}>
                <input
                  type={showPassword ? "text" : "password"}
                  className={formErrors.confirmPassword ? "form-control is-invalid" : "form-control"}
                  name="confirmPassword"
                  onChange={inputChange}
                  placeholder="confirmPassword"
                  maxLength={24}
                  disabled={isSubmit}
                  value={inputData.confirmPassword}
                />
                <span className="invalid-feedback">{formErrors.confirmPassword}</span>
              </div>
            </div>
            <div className="form-check mb-3">
              <input
                className={formErrors.term ? "form-check-input is-invalid" : "form-check-input"}
                type="checkbox"
                value="true"
                name="terms"
                checked={isChecked}
                onChange={handleCheckBox}
                disabled={isSubmit}
              />
              <label className="form-check-label small text-secondary">Agree to terms & conditions</label>
              <span className="invalid-feedback">{formErrors.term}</span>
            </div>

            <div className="d-grid gap-2 mb-3">
              {loading ? (
                <>
                  <button type="button" name id className="btn btn-primary">
                    <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
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
      </div>
    </>
  );
}
