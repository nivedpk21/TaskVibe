import { useEffect, useState } from "react";
import axiosInstance from "./../../utils/axiosInstance.js";
import { useNavigate, useParams } from "react-router-dom";

export default function VerifyEmail() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("Verifying...");

  useEffect(() => {
    axiosInstance
      .get(`/user/verify-email/${token}`)
      .then((response) => {
        console.log(response);
        setMessage(response.data.message);
        setTimeout(() => {
          navigate("/signin");
        }, 5000);
      })
      .catch((error) => {
        console.log(error);
        setMessage(error.response.data.message); 
      });
  });
  return (
    <>
      <p className="text-center mt-5">{message}</p>
    </>
  );
}
