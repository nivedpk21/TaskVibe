import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "./../../../utils/axiosInstance.js";
import toast from "react-hot-toast";

export default function VerifyShortUrlTask() {
  const { userId, uniqueId } = useParams();
  const token = localStorage.getItem("token");
  const [message, setMessage] = useState("Verifying Task...Do not close this window");

  useEffect(() => {
    axiosInstance
      .get(`/user/verify-urlshortener-task/${userId}/${uniqueId}`, {
        headers: { Authorization: `bearer ${token}` },
      })
      .then((response) => {
        toast.success(response.data.message);
      })
      .catch((error) => {
        setMessage(error.response.data.message);
        toast.error(error.response.data.message);
      })
      .finally(() => {
        setTimeout(() => {
          window.close();
        }, 3000);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <p className="text-center mt-5">{message}</p>
    </>
  );
}
