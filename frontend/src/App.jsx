// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import AuthPage from "./pages/auth";
import LoginPage from "./pages/login.jsx";
import RegisterTheUser from "./pages/register.jsx";
import Home from "./pages/home";
import Navbar from "./components/navbar";
import ProfilePage from "./pages/profile";
import DoctorsList from "./pages/doctors_list";
import DoctorDetail  from "./pages/doctor_detail";
import DoctorProfile from "./pages/doctor_profile";
import UpdateAvailability from "./pages/updateavalibality";
import UpdateDoctorProfile from "./pages/doctor_profile_update.jsx";
import ApplyForDoctor from "./pages/ApplyForDoctor.jsx";
import BookAppointment from "./pages/BookAppointment.jsx";
import MyAppointments from "./pages/AppointmentUsersList.jsx";
import DoctorAppointments from "./pages/DoctorsAppointment.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import DoctorRoute from "./components/DoctorRoute.jsx";
import UploadReportPage from "./pages/uploadReportPage.jsx";
import Footer from "./components/footer.jsx";
import About from "./pages/about.jsx";
function App() {
  return (
    <Router>
      <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} pauseOnHover theme="colored" />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/auth" element={<AuthPage />} />
        <Route path="/register" element={<RegisterTheUser />} />
        <Route path="/login" element={<LoginPage />} />

        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/doctors" element={<DoctorsList />} />
          <Route path="/upload/report" element={<UploadReportPage />} />
          <Route path="/doctor/:id" element={<DoctorDetail />} />
          <Route path="/doctor/apply" element={<ApplyForDoctor />} />
          <Route path="/book-appointment/:doctorId" element={<BookAppointment />} />
          <Route path="/my-appointments" element={<MyAppointments />} />
          <Route path="/about" element={<About />} />

        </Route>

        <Route element={<DoctorRoute />}>
          <Route path="/doc-appointments" element={<DoctorAppointments />} />
          <Route path="/doctor/doctor_profile" element={<DoctorProfile />} />
          <Route path="/doctor/update_doctor_profile" element={<UpdateDoctorProfile />} />
          <Route path="/doctor/update_availabilities" element={<UpdateAvailability />} />
          
        </Route>
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
