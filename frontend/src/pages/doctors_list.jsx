"use client"

import { Link } from "react-router-dom"
import { useState, useEffect } from "react"
import { FetchDoctorsList } from "../services/api"
import Pagination from "../components/pagination"

export default function DoctorsList() {
  const [doctors, setDoctors] = useState([])
  const [error, setError] = useState("")
  const [search, setSearch] = useState("")
  const [specialization, setSpecialization] = useState("")
  const [loading, setLoading] = useState(true)
  const [currentPage,setCurrentPage] = useState(1)
  const [postsPerPage , setPostPerPage] = useState(3 )

  const fetchDoctors = async ({ search = "", specialization = "" } = {}) => {
    setLoading(true);
    try {
      const data = await FetchDoctorsList({ search, specialization });
      setDoctors(data);
    } catch (err) {
      setError("Failed to fetch doctor list");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchDoctors()
  }, [])

  const handleSearch = () => {
    fetchDoctors({ search, specialization });
  };
  
  const lastPostIndex = currentPage*postsPerPage
  const firstPostIndex = lastPostIndex-postsPerPage 
  const doctorsliced = doctors.slice(firstPostIndex,lastPostIndex)

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch()
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading doctors...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-16 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Find Your Doctor</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Connect with experienced healthcare professionals committed to your wellbeing
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-10">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by doctor name..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
            <div className="sm:w-64">
              <select
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">All Specializations</option>
                <option value="Cardiologist">Cardiologist</option>
                <option value="Dermatologist">Dermatologist</option>
                <option value="Psychiatrist">Psychiatrist</option>
                <option value="Neurologist">Neurologist</option>
                <option value="Dentist">Dentist</option>
                <option value="Pediatrician">Pediatrician</option>
                <option value="Orthopedic">Orthopedic</option>
              </select>
            </div>
            <button
              onClick={handleSearch}
              disabled={loading}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
            >
              Search
            </button>
          </div>
        </div>

        {doctors.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 text-6xl mb-4">👨‍⚕️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No doctors found</h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                Available Doctors ({doctors.length})
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {doctorsliced.map((doctor) => (
                <div
                  key={doctor.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200 overflow-hidden group"
                >
                  <div className="p-6">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="relative">
                        <img
                          src={doctor.profile_pic || "/placeholder.svg?height=64&width=64"}
                          alt={doctor.name}
                          className="w-16 h-16 rounded-xl object-cover border-2 border-gray-100"
                          onError={(e) => {
                            e.target.onerror = null
                            e.target.src = "/placeholder.svg?height=64&width=64"
                          }}
                        />
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                          {doctor.name}
                        </h3>
                        <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-full">
                          {doctor.specialization}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-6 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-4 h-4 ${i < Math.floor(doctor.rating || 4.0) ? "text-yellow-400" : "text-gray-300"}`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                          <span className="text-sm font-semibold text-gray-700 ml-2">{doctor.rating || 4.0}</span>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 font-medium">
                        {doctor.experience}+ years exp
                      </div>
                    </div>

                    <Link
                      to={`/doctor/${doctor.id}`}
                      className="block w-full text-center py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
                    >
                      Book Appointment
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        
        <div class="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
        <div class="flex flex-1 justify-between sm:hidden">
          <a href="#" class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Previous</a>
          <a href="#" class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Next</a>
        </div>
        
    <Pagination
            totalPosts={doctors.length}
            PostsPerPage={postsPerPage}
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}
          />      
          </div>

      
      </div>
    </div>
  )
}
