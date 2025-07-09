import { useState } from "react";
import { uploadReportScan } from "../services/api";
import { Loader2, Upload, Stethoscope, UserSearch } from "lucide-react";
import DoctorsList from "../pages/DoctorsListReport";

export default function UploadReportPage() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDoctors, setShowDoctors] = useState(false);

  const specialization = result?.recommended_specializations?.[0];

  const handleUpload = async () => {
    if (!image) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await uploadReportScan(image, token);
      setResult(response);
      setShowDoctors(false); // reset view
    } catch (err) {
      alert(err.message);
    }
    setLoading(false);
  };

  const getEmergencyStyle = (level) => {
    switch (level?.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-10 px-4 flex items-center justify-center">
      <div className="w-full max-w-3xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-3 text-blue-600">
            <Stethoscope className="h-8 w-8" />
            <h1 className="text-3xl font-bold">Medical Report Scanner</h1>
          </div>
          <p className="text-gray-600 text-sm">Upload your report to analyze and get doctor recommendations.</p>
        </div>

        {/* Upload Box */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 space-y-4">
          <label className="block text-sm font-medium text-gray-700">Upload Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />

          <button
            onClick={handleUpload}
            disabled={!image || loading}
            className={`w-full flex items-center justify-center gap-2 px-4 py-2 font-semibold rounded-md text-white transition ${
              loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Scanning Report...
              </>
            ) : (
              <>
                <Upload className="h-5 w-5" />
                Upload & Scan
              </>
            )}
          </button>
        </div>

        {/* Results */}
        {result && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 space-y-6">
            <h2 className="text-2xl font-semibold text-green-700 text-center">Scan Results</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">Test Name</p>
                <p className="text-lg font-medium">{result.report_test_name}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Emergency Level</p>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getEmergencyStyle(result.emergency)}`}
                >
                  {result.emergency}
                </span>
              </div>

              <div className="sm:col-span-2">
                <p className="text-sm text-gray-500 mb-1">Symptoms</p>
                <p className="text-gray-800">{result.symptoms}</p>
              </div>

              <div className="sm:col-span-2">
                <p className="text-sm text-gray-500 mb-1">Precautions</p>
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-blue-800">
                  {result.precautions}
                </div>
              </div>

              <div className="sm:col-span-2">
                <p className="text-sm text-gray-500 mb-1">Recommended Doctor</p>
                <p className="text-blue-700 font-semibold">{result.recommended_specializations}</p>
              </div>
            </div>

            {/* CTA Button */}
            <div className="text-center pt-4">
              <button
                onClick={() => setShowDoctors(true)}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                View Available Doctors
              </button>
            </div>
          </div>
        )}

        {/* Doctors List */}
        {showDoctors && specialization && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 space-y-4 mt-6">
            <h2 className="text-xl font-bold text-blue-800 flex items-center gap-2">
              <UserSearch className="w-5 h-5" />
              Doctors specialized in: {specialization}
            </h2>
            <DoctorsList specialization={specialization} />
          </div>
        )}
      </div>
    </div>
  );
}
