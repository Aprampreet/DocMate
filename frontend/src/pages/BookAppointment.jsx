import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { bookAppointment, fetchDoctorDetail } from "../services/api";
import { toast } from "react-toastify"; 
export default function BookAppointment() {
  const { doctorId } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [form, setForm] = useState({
    date: "",
    symptoms: "",
    patient_email: "",
    patient_phone: "",
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate()
  useEffect(() => {
    async function loadDoctor() {
      try {
        const data = await fetchDoctorDetail(doctorId);
        setDoctor(data);
      } catch (err) {
        toast.error(" Failed to load doctor details");
      } finally {
        setLoading(false);
      }
    }
    loadDoctor();
  }, [doctorId]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await bookAppointment({ ...form, doctor_id: parseInt(doctorId) });
      toast.success("✅ Appointment booked successfully!");
      navigate('/doctors')
    } catch (err) {
      toast.error(`Booking failed: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="text-gray-500 animate-pulse text-lg">Loading doctor details...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white border border-gray-200 rounded-xl shadow-lg p-8 sm:p-12 transition-all duration-300 ease-in-out">
        <h2 className="text-3xl font-bold text-slate-800 mb-1">Book Appointment</h2>
        <p className="text-slate-500 mb-6">with <span className="font-medium text-blue-600">Dr. {doctor.official_name}</span></p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Date */}
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-slate-700 mb-1">Appointment Date</label>
            <input
              type="date"
              id="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
            />
          </div>

          {/* Time */}
          

          {/* Symptoms */}
          <div>
            <label htmlFor="symptoms" className="block text-sm font-medium text-slate-700 mb-1">Symptoms</label>
            <textarea
              id="symptoms"
              name="symptoms"
              rows="4"
              placeholder="Describe your symptoms in detail..."
              value={form.symptoms}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="patient_email" className="block text-sm font-medium text-slate-700 mb-1">Your Email</label>
            <input
              type="email"
              id="patient_email"
              name="patient_email"
              value={form.patient_email}
              onChange={handleChange}
              required
              placeholder="you@example.com"
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
            />
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="patient_phone" className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
            <input
              type="tel"
              id="patient_phone"
              name="patient_phone"
              value={form.patient_phone}
              onChange={handleChange}
              required
              placeholder="+91 98765 43210"
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
            />
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className={`w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm px-6 py-3 rounded-lg shadow-md transition duration-200 ${
                submitting ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              {submitting ? "Booking..." : "Book Appointment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
