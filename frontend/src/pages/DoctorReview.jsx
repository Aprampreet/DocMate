import { useEffect, useState } from "react";
import { getDoctorReviews, submitDoctorReview } from "../services/api";
import { Star } from "lucide-react";

export default function DoctorReviews({ doctorId }) {
  const [reviews, setReviews] = useState([]);
  const [hasAppointment, setHasAppointment] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await getDoctorReviews(doctorId, token);
        setReviews(res.reviews);
        setHasAppointment(res.has_appointment);
      } catch (err) {
        console.error("Error loading reviews", err);
      }
    };
    fetchReviews();
  }, [doctorId]);

  const handleSubmit = async () => {
    if (rating < 1) return alert("Please select at least 1 star.");
    try {
      await submitDoctorReview({ doctor_id: doctorId, rating, comment }, token);
      alert("Review submitted!");
      setComment("");
      setRating(0);
      const res = await getDoctorReviews(doctorId, token);
      setReviews(res.reviews);
    } catch (err) {
      alert("Failed to submit review");
    }
  };

  return (
    <div className="p-6 bg-slate-50 rounded-xl shadow border border-slate-200">
      <h2 className="text-2xl font-bold mb-4 text-slate-900">Patient Reviews</h2>

      {/* Existing reviews */}
      {reviews.length === 0 ? (
        <p className="text-slate-500 mb-4">No reviews yet.</p>
      ) : (
        <div className="space-y-5 mb-6">
          {reviews.map((r, idx) => (
            <div
              key={idx}
              className=" p-4 rounded-xl bg-slate-50  hover:shadow transition duration-300"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-blue-500 text-white w-8 h-8 flex items-center justify-center rounded-full font-semibold text-sm">
                  {r.user_name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-slate-800 font-medium">{r.user_name}</p>
                  <p className="text-xs text-gray-400">{r.created_at}</p>
                </div>
              </div>
              <div className="flex items-center mb-2 gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < r.rating ? "text-yellow-400" : "text-gray-300"
                    }`}
                    fill={i < r.rating ? "#facc15" : "none"}
                  />
                ))}
              </div>
              <p className="text-gray-700 text-sm">{r.comment}</p>
            </div>
          ))}
        </div>
      )}

      {/* Submit form */}
      {hasAppointment && (
        <div className="mt-6 border-t pt-6">
          <h3 className="text-lg font-semibold text-slate-700 mb-2">Write a Review</h3>
          <div className="flex gap-2 mb-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                className={`w-6 h-6 cursor-pointer transition-colors ${
                  i <= rating ? "text-yellow-400" : "text-gray-300"
                }`}
                onClick={() => setRating(i)}
                fill={i <= rating ? "#facc15" : "none"}
              />
            ))}
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full border border-slate-300 rounded-md p-3 mb-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            placeholder="Write your experience..."
          />
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Submit Review
          </button>
        </div>
      )}
    </div>
  );
}
