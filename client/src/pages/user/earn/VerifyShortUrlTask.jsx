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
        console.log(response);
        toast.success(response.data.message);

        setTimeout(() => {
          window.close();
        }, 3000);
      })
      .catch((error) => {
        console.log(error);
        setMessage(error.response.data.message);
        // setTimeout(() => {
        //   window.close();
        // }, 3000);
        // toast.error(error.response.data.message);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <p className="text-center mt-5">{message}</p>
    </>
  );
}
