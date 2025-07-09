
import { useEffect, useState } from "react"
import { List_doctor_appointment, updateAppointmentStatus } from "../services/api"
import { toast } from "react-toastify"
import { format } from "date-fns"

export default function DoctorAppointments() {
  const [appointments, setAppointments] = useState([])

  useEffect(() => {
    loadAppointments()
  }, [])

  const loadAppointments = async () => {
    try {
      const data = await List_doctor_appointment()
      setAppointments(data)
    } catch (err) {
      toast.error("Failed to fetch appointments")
    }
  }

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateAppointmentStatus(id, newStatus)
      toast.success(`Marked as ${newStatus}`)
      loadAppointments()
    } catch (err) {
      toast.error(err.message || "Error updating status")
    }
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4  min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Doctor's Appointments</h1>
        <p className="text-gray-600">Manage your patient appointments and consultations</p>
      </div>

      {appointments.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No appointments scheduled</h3>
          <p className="text-gray-500">Your appointment list is empty. New appointments will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((app) => (
            <div
              key={app.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 hover:border-gray-300"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="flex-1 space-y-4">
                  {/* Patient Info */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-lg text-gray-900">{app.patient_email}</p>
                      <p className="text-gray-600 font-medium">{app.patient_phone}</p>
                    </div>
                  </div>

                  {/* Date & Time */}
                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span className="font-medium text-gray-700">{format(new Date(app.date), "dd MMM yyyy")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="font-medium text-gray-700">
                        {format(new Date(`2000-01-01T${app.time}`), "hh:mm a")}
                      </span>
                    </div>
                  </div>

                  {/* Symptoms */}
                  <div className="bg-gray-50 rounded-lg p-3 border-l-4 border-blue-500">
                    <p className="text-sm text-gray-600 mb-1">
                      <span className="font-semibold text-gray-800">Symptoms:</span>
                    </p>
                    <p className="text-gray-800">{app.symptoms}</p>
                  </div>

                  {/* Status & Fee */}
                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Status:</span>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                          app.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : app.status === "confirmed"
                              ? "bg-green-100 text-green-800"
                              : app.status === "cancelled"
                                ? "bg-red-100 text-red-800"
                                : app.status === "completed"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {app.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Fee:</span>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                          app.fee_paid ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                        }`}
                      >
                        {app.fee_paid ? "PAID" : "PENDING"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 flex-wrap lg:flex-col lg:w-auto">
                  {app.status === "pending" && (
                    <>
                      <button
                        onClick={() => handleStatusChange(app.id, "confirmed")}
                        className="bg-green-600 hover:bg-green-700 text-white text-sm px-6 py-2.5 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Confirm
                      </button>
                      <button
                        onClick={() => handleStatusChange(app.id, "cancelled")}
                        className="bg-red-600 hover:bg-red-700 text-white text-sm px-6 py-2.5 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Cancel
                      </button>
                    </>
                  )}
                  {app.status === "confirmed" && !app.completed && (
                    <button
                      onClick={() => handleStatusChange(app.id, "completed")}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-6 py-2.5 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Complete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
