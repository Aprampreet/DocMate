
import { useEffect, useState } from "react"
import { userProfile, updateUserProfile } from "../services/api"

export default function ProfilePage() {
  const [profile, setProfile] = useState(null)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({})
  const [loading, setLoading] = useState(true)
  const [previewImage, setPreviewImage] = useState(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await userProfile()
        setProfile(data)
        setFormData(data)
        if (data.profile_pic) {
          setPreviewImage(data.profile_pic)
        }
      } catch (err) {
        console.error("Failed to load profile:", err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData({ ...formData, profile_pic: file })
      
      // Create preview URL
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUpdate = async () => {
    try {
      const updated = await updateUserProfile(formData)
      setProfile(updated)
      setFormData(updated)
      setEditing(false)
    } catch (err) {
      console.error("Update failed", err.message)
    }
  }

  if (loading || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <div className="text-xl text-gray-600 font-medium">Loading your profile...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 transform hover:shadow-2xl">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 sm:p-8 text-white">
            <div className="flex flex-col sm:flex-row items-center justify-between">
              <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                <div className="relative group">
                  <img
                    src={previewImage || "/placeholder-profile.svg"}
                    alt="Profile"
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-white border-opacity-80 shadow-lg object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {editing && (
                    <label className="absolute bottom-0 right-0 cursor-pointer transform translate-y-1/4 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-all duration-200">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </label>
                  )}
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold">{profile.full_name || "User Name"}</h1>
                  <p className="text-blue-100">@{profile.username || "username"}</p>
                </div>
              </div>
              <div className="flex space-x-3">
                {editing ? (
                  <>
                    <button
                      onClick={handleUpdate}
                      className="px-4 py-2 bg-white text-blue-600 font-medium rounded-lg shadow hover:bg-gray-50 transition-all duration-200 flex items-center"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditing(false)
                        setFormData(profile)
                        setPreviewImage(profile.profile_pic)
                      }}
                      className="px-4 py-2 bg-transparent border border-white text-white font-medium rounded-lg hover:bg-white hover:bg-opacity-10 transition-all duration-200"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setEditing(true)}
                    className="px-4 py-2 bg-white text-blue-600 font-medium rounded-lg shadow hover:bg-gray-50 transition-all duration-200 flex items-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-6 sm:p-8">
            {/* Bio Section */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">About</h2>
              {editing ? (
                <textarea
                  name="bio"
                  value={formData.bio || ""}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
                  placeholder="Tell the world about yourself..."
                />
              ) : (
                <p className="text-gray-700 px-2">
                  {profile.bio || "No bio added yet. Share something about yourself!"}
                </p>
              )}
            </div>

            {/* Personal Information */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Full Name</label>
                  {editing ? (
                    <input
                      type="text"
                      name="full_name"
                      value={formData.full_name || ""}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    />
                  ) : (
                    <p className="px-4 py-3 bg-gray-50 rounded-lg">{profile.full_name || "-"}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Email Address</label>
                  {editing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email || ""}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    />
                  ) : (
                    <p className="px-4 py-3 bg-gray-50 rounded-lg">{profile.email || "-"}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Phone Number</label>
                  {editing ? (
                    <input
                      type="tel"
                      name="phone_number"
                      value={formData.phone_number || ""}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    />
                  ) : (
                    <p className="px-4 py-3 bg-gray-50 rounded-lg">{profile.phone_number || "-"}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Date of Birth</label>
                  {editing ? (
                    <input
                      type="date"
                      name="dob"
                      value={formData.dob || ""}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    />
                  ) : (
                    <p className="px-4 py-3 bg-gray-50 rounded-lg">
                      {profile.dob ? new Date(profile.dob).toLocaleDateString() : "-"}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Location</label>
                  {editing ? (
                    <input
                      type="text"
                      name="location"
                      value={formData.location || ""}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    />
                  ) : (
                    <p className="px-4 py-3 bg-gray-50 rounded-lg">{profile.location || "-"}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Gender</label>
                  {editing ? (
                    <select
                    name="gender"
                    value={formData.gender || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    </select>

                  ) : (
                    <p className="px-4 py-3 bg-gray-50 rounded-lg capitalize">{profile.gender || "-"}</p>
                  )}
                </div>
              </div>
            </div>

            
          </div>
        </div>
      </div>
    </div>
  )
}