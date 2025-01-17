import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Home from "./pages/Home";
import SignUp from "./pages/auth/SignUp";
import SignIn from "./pages/auth/SignIn";
import UserDashboard from "./pages/user/UserDashboard";
import Profile from "./pages/user/Profile";
import Wallet from "./pages/user/Wallet";
import AddUrlShortner from "./pages/user/advertise/AddUrlshortner.jsx";
import EarnUrlShortner from "./pages/user/earn/EarnUrlShortner.jsx";
import ForgotPassword from "./pages/auth/ForgotPassword.jsx";
import ResetPassword from "./pages/auth/ResetPassword.jsx";
import VerifyEmail from "./pages/auth/VerifyEmail.jsx";
import PublicRoutes from "./utils/PublicRoutes.jsx";
import NotFound from "./components/NotFound.jsx";
import ProtectedRoutes from "./utils/ProtectedRoutes.jsx";
import VerifyShortUrlTask from "./pages/user/earn/VerifyShortUrlTask.jsx";
import UnAuthorized from "./components/UnAuthorized.jsx";
import Contact from "./pages/Contact.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import UpdatePassword from "./pages/auth/UpdatePassword.jsx";
import TaskLog from "./pages/user/TaskLog.jsx";
import UserList from "./pages/admin/UserList.jsx";
import Messages from "./pages/admin/Messages.jsx";
import ViewMessage from "./pages/admin/ViewMessage.jsx";

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" reverseOrder={false} containerStyle={{ top: 80 }} />
      <Routes>
        <Route path="*" element={<NotFound />} />
        <Route path="/unauthorized" element={<UnAuthorized />} />
        <Route path="/contact" element={<Contact />} />

        {/*Public Routes*/}
        <Route element={<PublicRoutes />}>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signup/:referredBy" element={<SignUp />} />

          <Route path="/signin" element={<SignIn />} />
          <Route path="/verify-email/:token" element={<VerifyEmail />} />

          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Route>

        {/*User Routes*/}
        <Route element={<ProtectedRoutes requiredRole={["user", "admin"]} />}>
          <Route path="/user/dashboard" element={<UserDashboard />} />
          <Route path="/user/profile" element={<Profile />} />
          <Route path="/update-password" element={<UpdatePassword />} />
          <Route path="/user/wallet" element={<Wallet />} />
          <Route path="/tasklog" element={<TaskLog />} />
          <Route path="/earn/urlshortner" element={<EarnUrlShortner />} />
          <Route path="/destination-shortUrl/:userId/:uniqueId" element={<VerifyShortUrlTask />} />
          <Route path="/add/urlshortner" element={<AddUrlShortner />} />
        </Route>

        {/*Admin Routes*/}
        <Route element={<ProtectedRoutes requiredRole="admin" />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/userlist" element={<UserList />} />
          <Route path="/admin/message" element={<Messages />} />
          <Route path="/admin/viewMessage/:id" element={<ViewMessage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
