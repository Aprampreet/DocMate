"use client"

import { useState } from "react"
import { updateDoctorProfile } from "../services/api"

import { useNavigate,useLocation } from "react-router-dom"

export default function UpdateDoctorProfile() {

  const [formData, setFormData] = useState({
    official_name: "",
    specialization: "",
    specialization1: "",
    specialization2: "",
    specialization3: "",
    specialization4: "",
    experience: "",
    consultation_fee:"",
    education: "",
    phone_number: "",
    address: "",
    about_you: "",
    bio: "",
   
  })
  const nevigate = useNavigate()


  const [profilePic, setProfilePic] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    setProfilePic(file)
    if (file) {
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await updateDoctorProfile(formData, profilePic)
      alert("Profile updated successfully")
      nevigate('/doctor/doctor_profile')
    } catch (error) {
      console.error(error)
      alert("Error updating profile")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-6">
          <h1 className="text-2xl font-bold text-slate-900 mb-6">Update Doctor Profile</h1>
          <span className="text-gray-400 ">Make changes only in desired fields . Rest data will be same.</span>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-start gap-6">
              <div className="flex-1">
                <div className="mb-4">
                  
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img
                        src={previewUrl || "/placeholder.svg"}
                        alt="Profile preview"
                        className="w-20 h-20 rounded-xl object-cover ring-4 ring-blue-100"
                      />
                      {previewUrl && (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <label className="cursor-pointer">
                      <span className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium py-2 px-4 rounded-lg transition-colors text-sm">
                        Change Photo
                      </span>
                      <input
                        type="file"
                        name="doctor_profile_pic"
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Basic Information */}
            <div className="grid md:grid-cols-2 gap-6">
            {[
              ["official_name", "Official Name"],
              ["specialization", "Primary Specialization"],
              ["experience", "Experience (years)"],
              ["education", "Education"],
              ["phone_number", "Phone Number"],
              ["address", "Address"],
              ["consultation_fee", "consultation_fee"],
            ].map(([name, label]) => (
              <div key={name}>
                <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
                <input
                  type="text"
                  name={name}
                  
                  value={formData[name]}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
              </div>
            ))}
          </div>


            {/* Additional Specializations */}
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-3">Additional Specializations</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  ["specialization1", "Specialization 1"],
                  ["specialization2", "Specialization 2"],
                  ["specialization3", "Specialization 3"],
                  ["specialization4", "Specialization 4"],
                ].map(([name, label]) => (
                  <div key={name}>
                    <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
                    <input
                      type="text"
                      name={name}
                      value={formData[name]}
                      onChange={handleChange}
                      className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* About Sections */}
            <div className="grid gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">About You</label>
                <textarea
                  name="about_you"
                  value={formData.about_you}
                  onChange={handleChange}
                  rows={4}
                  className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Short Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={3}
                  className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
              >
                Save Profile
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}