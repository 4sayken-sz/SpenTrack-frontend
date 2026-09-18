import {ToastContainer} from "react-toastify";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Guard from "./components/Guard";
import {lazy, Suspense} from "react";
import Loader from "./components/Shared/Loader";

// UI components
const PageNotFound = lazy(() => import("./components/PageNotFound"));
const Homepage = lazy(() => import("./components/Home"));
const Signup = lazy(() => import("./components/Home/Signup"));
const ForgotPassword = lazy(() => import("./components/Home/ForgotPassword"));
const Dashboard = lazy(() => import("./components/Shared/Dashboard"));
const Transactions = lazy(() => import("./components/Shared/Transactions"));
const Report = lazy(() => import("./components/Shared/Report"));
const Users = lazy(() => import("./components/Shared/Users"));

// User components
const Userlayout = lazy(() => import("./components/User/Userlayout"));

// Admin components
const Adminlayout = lazy(() => import("./components/Admin/Adminlayout"));

const App = () => {
  return (
    <BrowserRouter>
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/signup" element={<Signup />} />

        {/* Guarded nested routes for admin  */}
        <Route path="/app/admin" element={<Guard endpoint="/api/user/session" role="admin"><Adminlayout /></Guard>}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="report" element={<Report />} />
        </Route>

        {/* Guarded nested routes for user  */}
        <Route path="/app/user" element={<Guard endpoint="/api/user/session" role="user"><Userlayout /></Guard>}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="report" element={<Report />} />
        </Route>
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/*" element={<PageNotFound />} />
      </Routes>
    </Suspense>
      <ToastContainer />
    </BrowserRouter>
  );
};

export default App;