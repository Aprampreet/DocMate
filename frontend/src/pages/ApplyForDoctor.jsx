"use client";

import { useState } from "react";
import { applyForDoctor } from "../services/api";
import { toast } from "react-toastify";

export default function ApplyForDoctor() {
  const [formData, setFormData] = useState({
    official_name: "",
    specialization: "",
    specialization1: "",
    specialization2: "",
    specialization3: "",
    specialization4: "",
    experience: "",
    education: "",
    phone_number: "",
    address: "",
    about_you: "",
  });

  const [profilePic, setProfilePic] = useState(null);
  const [licenseDoc, setLicenseDoc] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fields = [
    { name: "official_name", label: "Official Name", type: "text" },
    { name: "specialization", label: "Primary Specialization", type: "text" },
    { name: "specialization1", label: "Specialization 1", type: "text" },
    { name: "specialization2", label: "Specialization 2", type: "text" },
    { name: "specialization3", label: "Specialization 3", type: "text" },
    { name: "specialization4", label: "Specialization 4", type: "text" },
    { name: "experience", label: "Years of Experience", type: "number" },
    { name: "education", label: "Education", type: "text" },
    { name: "phone_number", label: "Phone Number", type: "tel" },
    { name: "address", label: "Clinic Address", type: "text" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await applyForDoctor(formData, profilePic, licenseDoc);
      toast.success("✅ Application submitted successfully!");

      setFormData({
        official_name: "",
        specialization: "",
        specialization1: "",
        specialization2: "",
        specialization3: "",
        specialization4: "",
        experience: "",
        education: "",
        phone_number: "",
        address: "",
        about_you: "",
      });
      setProfilePic(null);
      setLicenseDoc(null);
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.detail ||
        err.message ||
        "❌ Failed to submit application"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Apply as a Doctor</h1>
          <p className="text-slate-600">Join our platform and start helping patients</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Fields */}
            <div className="grid md:grid-cols-2 gap-6">
              {fields.map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
              ))}
            </div>

            {/* About You */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">About You</label>
              <textarea
                name="about_you"
                value={formData.about_you}
                onChange={handleChange}
                rows={4}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                placeholder="Tell us about your medical expertise and experience..."
              />
            </div>

            {/* File Uploads */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Profile Picture</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setProfilePic(e.target.files[0])}
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Medical License</label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => setLicenseDoc(e.target.files[0])}
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Submitting Application..." : "Submit Application"}
              </button>
            </div>
          </form>
        </div>

        <div className="text-center mt-6">
          <p className="text-sm text-slate-500">
            Your application will be reviewed within 2–3 business days. We'll contact you via email.
          </p>
        </div>
      </div>
    </div>
  );
}
