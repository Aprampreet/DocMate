import React, { useState } from "react";
import { updateDoctorAvalibality } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function UpdateAvailability() {
  const defaultDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const navigate = useNavigate();
  const [availabilities, setavailabilities] = useState(
    defaultDays.map((day) => ({
      day,
      start_time: '',
      end_time: '',
      is_off: false,
    }))
  );

  const handleChange = (index, field, value) => {
    const updated = [...availabilities];
    updated[index][field] = value;
    setavailabilities(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const Data = availabilities.map((slot) => ({
        day: slot.day,
        start_time: slot.is_off ? null : slot.start_time || null,
        end_time: slot.is_off ? null : slot.end_time || null,
        is_off: slot.is_off,
      }));
      await updateDoctorAvalibality(Data);
      alert("Availability updated successfully");
      navigate('/doctor/doctor_profile')
    } catch (error) {
      console.error(error);
      alert("Error updating availability");
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-3xl bg-white rounded-3xl border border-gray-200 shadow-xl p-6 md:p-10">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
          Doctor Availability Schedule
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {availabilities.map((slot, i) => (
            <div
              key={i}
              className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-gray-50 border border-gray-200 rounded-xl transition hover:shadow-md"
            >
              <div className="w-full sm:w-1/4 text-center sm:text-left font-semibold capitalize text-gray-700">
                {slot.day}
              </div>

              <div className={`flex flex-1 items-center justify-center gap-2 ${slot.is_off ? 'opacity-50' : ''}`}>
                <input
                  type="time"
                  value={slot.start_time}
                  disabled={slot.is_off}
                  onChange={(e) => handleChange(i, "start_time", e.target.value)}
                  className="w-28 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 outline-none disabled:bg-gray-100"
                />
                <span className="text-gray-500">to</span>
                <input
                  type="time"
                  value={slot.end_time}
                  disabled={slot.is_off}
                  onChange={(e) => handleChange(i, "end_time", e.target.value)}
                  className="w-28 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 outline-none disabled:bg-gray-100"
                />
              </div>

              <div className="w-full sm:w-auto flex justify-center sm:justify-end">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    onChange={(e) => handleChange(i, "is_off", e.target.checked)}
                    checked={slot.is_off}
                    className="sr-only peer"
                  />
                  <div className="relative w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-400 rounded-full peer peer-checked:bg-slate-900 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                  <span className="text-sm font-medium text-gray-600">{slot.is_off ? "Off" : "On"}</span>
                </label>
              </div>
            </div>
          ))}

          <div className="text-center pt-4">
            <button
              type="submit"
              className="px-8 py-3 bg-slate-900 text-white text-lg font-semibold rounded-xl shadow-lg hover:bg-slate-800 transition duration-300"
            >
              Save Schedule
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
