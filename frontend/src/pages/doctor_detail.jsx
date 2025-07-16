"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate ,Link} from "react-router-dom";
import { fetchDoctorDetail, getDoctorReviews } from "../services/api";
import DoctorReviews from "../pages/DoctorReview";

export default function DoctorDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");

  const [doctor, setDoctor] = useState(null);
  const [error, setError] = useState("");
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);

  const formatTimeTo12Hour = (time) => {
    if (!time) return "";
    const [hour, min] = time.split(":");
    const h = parseInt(hour);
    const ampm = h >= 12 ? "PM" : "AM";
    const hour12 = h % 12 === 0 ? 12 : h % 12;
    return `${hour12}:${min} ${ampm}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const doctorData = await fetchDoctorDetail(id);
        setDoctor(doctorData);

        const reviewRes = await getDoctorReviews(id, token);
        setReviews(reviewRes.reviews);

        if (reviewRes.reviews.length > 0) {
          const avg =
            reviewRes.reviews.reduce((sum, r) => sum + r.rating, 0) /
            reviewRes.reviews.length;
          setAverageRating(avg.toFixed(1));
        } else {
          setAverageRating(0);
        }
      } catch (err) {
        setError("Failed to fetch doctor details or reviews.");
        console.error(err);
      }
    };

    fetchData();
  }, [id, token]);

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 px-4">
        {error}
      </div>
    );

  if (!doctor)
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        Loading...
      </div>
    );

  const specializations = [
    doctor.specialization1,
    doctor.specialization2,
    doctor.specialization3,
    doctor.specialization4,
  ].filter(Boolean);


  const renderStars = () => (
    <div className="flex items-center space-x-2">
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-4 h-4 ${
              i < Math.round(averageRating) ? "text-amber-400" : "text-slate-300"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <span className="font-medium text-sm">
        {averageRating} ({reviews.length} reviews)
      </span>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-slate-50 border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-6 sm:space-y-0 sm:space-x-8">
            <div className="relative">
              <img
                src={doctor.profile_pic || "/placeholder.svg?height=120&width=120"}
                alt={doctor.official_name}
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl object-cover"
              />
              <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full border-3 border-white"></div>
            </div>

            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-2">
                {doctor.official_name}
              </h1>
              <p className="text-lg sm:text-xl text-blue-600 font-semibold mb-4">
                {doctor.specialization}
              </p>

              <div className="flex flex-wrap items-center gap-6 text-sm sm:text-base text-slate-600">
                {renderStars()}
                <span>{doctor.experience} years experience</span>
                <span className="font-medium">Consultation Fee:</span> ₹{doctor.consultation_fee}
                <span className="text-sm text-gray-500 italic ml-2">
                  (This fee is only to ensure real users)
                </span>
              </div>
            </div>

            <Link
              to={`/book-appointment/${id}`}
              className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
            >
              Book Appointment
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4">About {doctor.official_name}</h2>
              <p className="text-slate-600 leading-relaxed">{doctor.about_you}</p>
            </section>

            {/* Education */}
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4">Education</h2>
              <div className="border-l-2 border-blue-600 pl-4">
                <p className="text-slate-600">{doctor.education}</p>
              </div>
            </section>

            {/* Specializations */}
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4">Specializations</h2>
              <div className="flex flex-wrap gap-2">
                {specializations.map((spec, index) => (
                  <span key={index} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                    {spec}
                  </span>
                ))}
              </div>
            </section>

            {/* Reviews Section */}
            <DoctorReviews doctorId={doctor.id} />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Contact Info */}
            <section className="bg-slate-50 p-6 rounded-xl">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Contact Information</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-3">
                  <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-slate-600">{doctor.phone_number}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-slate-600">{doctor.email}</span>
                </div>
                <div className="flex items-start space-x-3">
                  <svg className="w-4 h-4 text-slate-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-slate-600">{doctor.address}</span>
                </div>
              </div>
            </section>

            {/* Availability */}
            <section className="bg-slate-50 p-6 rounded-xl">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Availability</h3>
              <div className="space-y-2 text-sm">
                {doctor.availabilities.map((slot, index) => (
                  <div key={index} className="flex justify-between">
                    <span className="text-slate-600 font-medium uppercase">{slot.day}</span>
                    <span className="font-small text-slate-900">
                      {slot.is_off
                        ? "Off"
                        : `${formatTimeTo12Hour(slot.start_time)} - ${formatTimeTo12Hour(slot.end_time)}`}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Quick Stats */}
            <section className="bg-slate-50 p-6 rounded-xl">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Quick Stats</h3>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-slate-900">{doctor.patients_treated}+</div>
                  <div className="text-xs text-slate-600">Patients</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">{doctor.experience}</div>
                  <div className="text-xs text-slate-600">Years Exp</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">{reviews.length}</div>
                  <div className="text-xs text-slate-600">Reviews</div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
