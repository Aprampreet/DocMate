"use client";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { FetchDoctorsList } from "../services/api";

export default function DoctorsList() {
  const [doctors, setDoctors] = useState([]);
  const [error, setError] = useState("");
  
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const data = await FetchDoctorsList();
        setDoctors(data);
      } catch (err) {
        setError("Failed to fetch doctor list");
        console.error(err);
      }
    };
    fetchDoctors();
  }, []);

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 px-4">
        {error}
      </div>
    );

  if (!doctors.length)
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <span className="text-slate-500 text-lg animate-pulse">
          Fetching Doctors...
        </span>
      </div>
    );

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-slate-50 border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-3 sm:mb-4">
            Find Your Doctor
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
            Connect with experienced healthcare professionals who are committed
            to providing exceptional medical care tailored to your needs.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:py-16">
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-2 lg:gap-8">
          {doctors.map((doctor) => (
            <div
              key={doctor.id}
              className="bg-white border border-slate-200 rounded-lg sm:rounded-xl p-4 sm:p-6 lg:p-8 hover:shadow-xl hover:border-slate-300 transition-all duration-300"
            >
              <div className="flex items-start space-x-4 lg:space-x-6">
                <div className="relative flex-shrink-0">
                  <img
                    src={doctor.profile_pic || "/placeholder.svg?height=80&width=80"}
                    alt={doctor.name}
                    className="w-15 h-15 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-lg lg:rounded-xl object-cover"
                  />
                  <div className="absolute -bottom-1 -right-1 lg:-bottom-2 lg:-right-2 w-4 h-4 lg:w-6 lg:h-6 bg-emerald-500 rounded-full border-2 lg:border-3 border-white shadow-sm"></div>
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-lg lg:text-xl font-bold text-slate-900 mb-1 lg:mb-2">
                    {doctor.name}
                  </h3>
                  <p className="text-blue-600 font-semibold text-sm lg:text-base mb-3 lg:mb-4">
                    {doctor.specialization}
                  </p>

                  <div className="flex items-center space-x-4 lg:space-x-6 mb-4 lg:mb-6">
                    <div className="flex items-center space-x-1">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-3 h-3 lg:w-4 lg:h-4 ${
                              i < Math.floor(doctor.rating || 4.0)
                                ? "text-amber-400"
                                : "text-slate-300"
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-xs lg:text-sm font-medium text-slate-700 ml-1">
                        {doctor.rating || 4.0}
                      </span>
                    </div>
                    <div className="text-xs lg:text-sm text-slate-600">
                      <span className="font-medium">{doctor.experience}</span>{" "}
                      years experience
                    </div>
                  </div>

                  <Link
                    to={`/doctor/${doctor.id}`}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2.5 lg:py-3 px-4 lg:px-6 rounded-lg transition-colors duration-200 text-sm lg:text-base"
                  >
                    Book Appointment
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
