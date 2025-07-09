import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getDoctorsBySpecialization } from "../services/api";

export default function DoctorsList({ specialization, token }) {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDoctors() {
      try {
        const data = await getDoctorsBySpecialization(specialization, token);
        setDoctors(data);
      } catch (err) {
        console.error(err);
        alert("Failed to load doctors");
      } finally {
        setLoading(false);
      }
    }

    if (specialization) {
      fetchDoctors();
    }
  }, [specialization, token]);

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-500 animate-pulse">
        Loading available doctors...
      </div>
    );
  }

  if (!doctors.length) {
    return (
      <div className="text-center py-10 text-red-500">
        No doctors found for this specialization.
      </div>
    );
  }

  return (
    <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {doctors.map((doc) => (
        <div
          key={doc.id}
          className="bg-white border border-gray-200 rounded-xl p-6 shadow hover:shadow-md transition"
        >
          <h2 className="text-xl font-bold text-blue-700 text-center mb-2">
            <Link
              to={`/doctor/${doc.id}`}
              className="hover:underline hover:text-blue-800 transition"
            >
              {doc.name}
            </Link>
          </h2>

          <p className="text-center text-gray-600 text-sm mb-2">
            {doc.specialization}
          </p>

          <div className="text-center text-sm text-gray-700">
            <span className="font-medium">{doc.experience}</span> years of
            experience
          </div>

          <div className="text-center mt-2 text-yellow-500 font-medium">
            ⭐ 4.0 Rating
          </div>
        </div>
      ))}
    </div>
  );
}
