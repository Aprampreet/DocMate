"use client"

import { useEffect, useState } from "react"
import { fetchDoctorProfile } from "../services/api"
import { Link } from "react-router-dom"

export default function DoctorProfile() {
  const [doctor, setDoctor] = useState(null)
  const [error, setError] = useState("")



  const formatTimeTo12Hour = (timeStr) => {
  if (!timeStr) return ""
  const [hour, minute] = timeStr.split(":")
  const h = parseInt(hour)
  const ampm = h >= 12 ? "PM" : "AM"
  const hour12 = h % 12 === 0 ? 12 : h % 12
  return `${hour12}:${minute} ${ampm}`
}


  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await fetchDoctorProfile()
        setDoctor(data)
      } catch (err) {
        console.error(err)
        setError(err.message)
      }
    }
    loadProfile()
  }, [])

  if (error) return <p className="text-center text-red-600 mt-10">Error: {error}</p>
  if (!doctor) return <p className="text-center text-gray-500 mt-10">Loading doctor profile...</p>

  const specializations = [
    doctor.specialization1,
    doctor.specialization2,
    doctor.specialization3,
    doctor.specialization4,
  ].filter(Boolean)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <img
                  src={doctor.profile_pic || "/placeholder.svg"}
                  alt={doctor.official_name}
                  className="w-20 h-20 rounded-xl object-cover ring-4 ring-blue-100"
                />
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">{doctor.official_name}</h1>
                <p className="text-blue-600 font-semibold">{doctor.specialization}</p>
                <p className="text-slate-600">{doctor.experience} years experience</p>
              </div>
            </div>
            <Link to={'/doctor/update_doctor_profile'}  className="bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2 px-6 rounded-lg transition-colors">
              Edit
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Personal Details */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Personal Details</h2>
            <div className="space-y-3">
              <Info label="Full Name" value={doctor.full_name} />
              <Info label="Email" value={doctor.email} />
              <Info label="Phone" value={doctor.phone_number} />
              <Info label="Location" value={doctor.location || "Not provided"} />
            </div>
          </div>

          {/* Professional Info */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Professional Info</h2>
            <div className="space-y-3">
              <Info label="Education" value={doctor.education} />
              <Info label="Address" value={doctor.address} />
              <Info label="Experience" value={`${doctor.experience} years`} />
             
              <Info label="Patients" value={`${doctor.patients_treated}+ treated`} />
              <Info label="Consultation Fee" value={` ₹ ${doctor.consultation_fee}`} />
            </div>
          </div>
        </div>

        {/* About */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">About</h2>
          <p className="bg-slate-50 p-4 rounded-lg text-slate-700 leading-relaxed">
            {doctor.about_you || "No description available."}
          </p>
        </div>

        {/* Specializations */}
        {specializations.length > 0 && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Specializations</h2>
            <div className="flex flex-wrap gap-2">
              {specializations.map((spec, index) => (
                <span key={index} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                  {spec}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Availability */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex flex-row justify-between items-center mb-4">
            <h1 className="text-lg font-semibold text-slate-800">Availability</h1>
            <Link to='/doctor/update_availabilities' className="bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2 px-6 rounded-lg transition-colors" >
              Edit Availability
            </Link>
          </div>

          {doctor.availabilities?.length === 0 ? (
            <p className="text-slate-500">No availability data</p>
          ) : (
            <div className="grid sm:grid-cols-2 gap-3">
              {doctor.availabilities?.map((slot, i) => (
                <div key={i} className="bg-slate-50 p-3 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-slate-800 capitalize">{slot.day}</span>
                    <span className="text-slate-600">
                      {slot.is_off
                        ? "Off"
                        : `${formatTimeTo12Hour(slot.start_time)} - ${formatTimeTo12Hour(slot.end_time)}`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

function Info({ label, value }) {
  return (
    <div>
      <label className="text-sm font-medium text-slate-600 block mb-1">{label}</label>
      <p className="text-slate-900 bg-slate-50 px-3 py-2 rounded-lg">{value}</p>
    </div>
  )
}