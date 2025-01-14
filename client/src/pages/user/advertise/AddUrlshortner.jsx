import { useEffect, useMemo, useState } from "react";
import Navigation from "./../../../layout/Navigation.jsx";
import "./addUrlShortner.css";
import axiosInstance from "../../../utils/axiosInstance.js";
import toast from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";
import { getAuthData } from "../../../utils/auth.js";

export default function AddUrlshortner() {
  const { role, token } = getAuthData();

  const [display, setDisplay] = useState("");
  const [data, setData] = useState([]);
  const [button, setButton] = useState(false);
  const [balance, setBalance] = useState(0);
  const [userId, setUserId] = useState("");
  const [uniqueId, setUniqueId] = useState(null);
  // there is also tracking time stamp method instead of boolean
  const [fetch, setFetch] = useState(true);

  const [loading, setLoading] = useState(false);

  const apiUrl = useMemo(() => {
    if (userId && uniqueId) {
      return `http://taskvibe.icu/destination-shortUrl/${userId}/${uniqueId}`;
    }
    return "";
  }, [userId, uniqueId]);
  // const apiUrl = `taskvibe.icu/destination-shortUrl/${userId}/${uniqueId}`;

  const [copied, setCopied] = useState(false);
  const [inputData, setInputData] = useState({
    name: "",
    destUrl: "",
    shortUrl: "",
    payPerView: 0.001,
    targetViews: 10,
    status: "active",
  });
  const [formErrors, setFormErrors] = useState({});
  // console.log("inputData", inputData);

  const handleChange = (e) => {
    setInputData({ ...inputData, [e.target.name]: e.target.value });
  };

  const total = (((inputData.payPerView * inputData.targetViews) / 100) * 125).toFixed(5);

  const validate = (values) => {
    var error = {};
    if (!values.name) {
      error.name = "short url name required";
    }
    if (!values.shortUrl) {
      error.shortUrl = "paste short url";
    } else if (
      !/^(https?:\/\/)?([\w-]+(\.[\w-]+)+)(\/[\w-._~:/?#[\]@!$&'()*+,;=]*)?$/.test(values.shortUrl)
    ) {
      error.shortUrl = "enter a valid url";
    }
    if (!values.payPerView) {
      error.payPerView = "set pay per click";
    } else if (values.payPerView < 0.001) {
      error.payPerView = "set minimum 0.001$";
    }
    if (!values.targetViews) {
      error.targetViews = "set target clicks";
    } else if (values.targetViews < 10) {
      error.targetViews = "set minimum 10 clicks";
    }
    if (total > balance) {
      error.total = "insufficient balance";
    }
    return error;
  };

  useEffect(() => {
    //get documents
    axiosInstance
      .get("/user/fetch-document", { headers: { Authorization: `bearer ${token}` } })
      .then((response) => {
        console.log(response.data.data);
        setData(response.data.data);
        if (role === "user" && response.data.data.length === 0) {
          setButton(true);
        }
      })
      .catch((error) => {
        console.log(error);
      });

    // get userData for user_id and balance
    axiosInstance
      .get("/user/profile", { headers: { Authorization: `bearer ${token}` } })
      .then((response) => {
        console.log(response);
        const walletBalance = parseFloat(response?.data?.data?.wallet?.$numberDecimal);
        setBalance(walletBalance);
        setUserId(response.data.data._id);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [token, fetch]);

  const handleFormDisplay = () => {
    const generatedId = uuidv4();
    setUniqueId(generatedId);
    setDisplay("taskForm");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(apiUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate(inputData);
    setFormErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      const formData = {
        name: inputData.name,
        uniqueId: uniqueId,
        shortUrl: inputData.shortUrl,
        targetViews: inputData.targetViews,
        payPerView: inputData.payPerView,
        setAmount: total,
        status: inputData.status,
      };
      // loading
      setLoading(true);
      //api call
      axiosInstance
        .post("/user/add-shorturl-task", formData, {
          headers: { Authorization: `bearer ${token}` },
        })
        .then((response) => {
          console.log(response);
          toast.success(response.data.message);
          setDisplay("");
          setFetch((prev) => !prev);
        })
        .catch((error) => {
          console.log(error);
          toast.error(error.response.data.message || "an error occured");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const handlePause = (taskId) => {
    //api call
    axiosInstance
      .get(`/user/pause-task/${taskId}`, { headers: { Authorization: `bearer ${token}` } })
      .then((response) => {
        console.log(response);
        setFetch((prev) => !prev);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handlePublish = (taskId) => {
    //api call
    axiosInstance
      .get(`/user/publish-task/${taskId}`, { headers: { Authorization: `bearer ${token}` } })
      .then((response) => {
        console.log(response);
        setFetch((prev) => !prev);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDelete = (taskId) => {
    //api call
    axiosInstance
      .get(`/user/delete-task/${taskId}`, { headers: { Authorization: `bearer ${token}` } })
      .then((response) => {
        console.log(response);
        setFetch((prev) => !prev);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <Navigation />
      <div className="background-page">
        {display === "taskForm" ? (
          <>
            {/**Add task*/}
            <div className="form-div  p-3 rounded shadow-sm">
              <h5 className="text-center">Add ShortUrl Task</h5>
              <form onSubmit={handleSubmit}>
                <div className={formErrors.name ? "mb-2" : "mb-3"}>
                  <label htmlFor className="form-label">
                    Name
                  </label>
                  <input
                    type="text"
                    className={formErrors.name ? "form-control is-invalid" : "form-control"}
                    name="name"
                    onChange={handleChange}
                    aria-describedby="emailHelpId"
                    placeholder="Shorturl Name"
                    maxLength="15"
                  />
                  <span className="invalid-feedback">{formErrors.name}</span>
                </div>
                <label htmlFor className="form-label">
                  Api Url (short this url)
                </label>
                <div className="d-flex mb-3">
                  <div className="">
                    <input
                      type="text"
                      className="form-control api-input"
                      aria-describedby="helpId"
                      readOnly
                      value={apiUrl}
                    />
                  </div>
                  <button onClick={handleCopy} type="button" className="btn btn-outline-secondary copy-btn">
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>
                <div className={formErrors.shortUrl ? "mb-2" : "mb-3"}>
                  <label htmlFor className="form-label">
                    Short Url (paste shortened url here)
                  </label>
                  <input
                    type="text"
                    className={formErrors.shortUrl ? "form-control is-invalid" : "form-control"}
                    name="shortUrl"
                    onChange={handleChange}
                    aria-describedby="helpId"
                    placeholder="Paste Short link"
                  />
                  <span className="invalid-feedback">{formErrors.shortUrl}</span>
                </div>

                <div className="d-flex justify-content-space-between mb-4">
                  <div>
                    <label htmlFor className="form-label">
                      Pay Per Click ($)
                    </label>
                    <input
                      type="number"
                      className={formErrors.payPerView ? "form-control is-invalid" : "form-control"}
                      name="payPerView"
                      onChange={handleChange}
                      aria-describedby="helpId"
                      placeholder="0$"
                      step="0.001"
                      min="0"
                      max="10"
                      value={inputData.payPerView}
                    />
                    <span className="invalid-feedback">{formErrors.payPerView}</span>
                  </div>
                  <span className="p-1"></span>
                  <div className="">
                    <label htmlFor className="form-label">
                      Target Clicks
                    </label>
                    <input
                      type="number"
                      className={formErrors.targetViews ? "form-control is-invalid" : "form-control"}
                      name="targetViews"
                      onChange={handleChange}
                      id
                      aria-describedby="helpId"
                      placeholder="0"
                      min="10"
                      max="1000"
                      value={inputData.targetViews}
                    />
                    <span className="invalid-feedback">{formErrors.targetViews}</span>
                  </div>
                </div>

                <div className="mb-3">
                  <p className="mb-1">Total Cost (including 25% Fee)</p>
                  <p className="m-0">{total}$</p>
                  <span className="text-danger small">{formErrors.total}</span>
                </div>

                <div className="d-flex">
                  <button
                    onClick={() => setDisplay("")}
                    type="button"
                    className="btn btn-outline-danger ms-auto btn-sm me-1">
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary btn-sm">
                    Publish
                  </button>
                </div>
              </form>
            </div>
          </>
        ) : (
          <>
            {/*Add short url Task*/}
            <div className={button ? "text-center mb-5" : "d-none"}>
              <h5 className="text-center mb-3">Add ShortUrl task</h5>
              <div>
                <button onClick={handleFormDisplay} type="button" className="btn btn-primary">
                  Add Task
                </button>
              </div>
            </div>
            {/*manage live/paused tasks*/}
            <div className="">
              <h5 className="text-center mb-3">Manage ShortUrl task</h5>

              {/**gpt design */}
              <div className="table-responsive tb-width shadow-sm p-3 mb-5 bg-body rounded">
                <table className="table table-hover table-bordered align-middle">
                  <thead className="table-dark">
                    <tr>
                      <th scope="col">Name</th>
                      <th scope="col">Short URL</th>
                      <th scope="col">Pay Per Click</th>
                      <th scope="col">Target Clicks</th>
                      <th scope="col">Hits</th>
                      <th scope="col">Balance</th>
                      <th scope="col">Status</th>
                      <th scope="col">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.map((item) => (
                      <tr key={item._id}>
                        <td>{item.name}</td>
                        <td className="text-nowrap overflow-auto" style={{ maxWidth: "150px" }}>
                          <a
                            href={item.shortUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary text-decoration-none">
                            {item.shortUrl}
                          </a>
                        </td>
                        <td>{parseFloat(item.payPerView.$numberDecimal).toFixed(3)}$</td>
                        <td>{item.targetViews}</td>
                        <td>{item.hits}</td>
                        <td>{parseFloat(item.setAmount.$numberDecimal).toFixed(4)}$</td>
                        <td
                          className={
                            item.status === "active" ? "text-success fw-bold" : "text-danger fw-bold"
                          }>
                          {item.status === "active" ? "Active" : "Paused"}
                        </td>
                        <td>
                          <div className="d-flex gap-2">
                            {item.status === "active" ? (
                              <button
                                onClick={() => handlePause(item._id)}
                                type="button"
                                className="btn btn-sm btn-outline-warning">
                                Pause
                              </button>
                            ) : (
                              <button
                                onClick={() => handlePublish(item._id)}
                                type="button"
                                className="btn btn-sm btn-outline-success">
                                Publish
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(item._id)}
                              type="button"
                              className="btn btn-sm btn-outline-danger">
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
