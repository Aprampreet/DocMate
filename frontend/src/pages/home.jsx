
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false)
const navigate = useNavigate()
  useEffect(() => {
    setIsVisible(true)
  }, [])

  const services = [
    {
      title: "Expert Doctors",
      desc: "Connect with certified and experienced medical professionals",
      icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
    },
    {
      title: "Easy Booking",
      desc: "Schedule appointments online with just a few clicks",
      icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
    },
    {
      title: "Quality Care",
      desc: "Receive personalized treatment and comprehensive care",
      icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
    },
  ]

  return (
    <>
      <style >{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>

      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-blue-50 via-white to-slate-50 py-20 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width%3D%2260%22 height%3D%2260%22 viewBox%3D%220 0 60 60%22 xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg fill%3D%22none%22 fillRule%3D%22evenodd%22%3E%3Cg fill%3D%22%239C92AC%22 fillOpacity%3D%220.03%22%3E%3Ccircle cx%3D%2230%22 cy%3D%2230%22 r%3D%224%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-40"></div>

          <div className="max-w-6xl mx-auto text-center relative">
            <div
              className={`inline-flex items-center bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6 ${isVisible ? "fade-in-up" : ""}`}
              style={{ animationDelay: "0.1s" }}
            >
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Trusted by 10,000+ patients
            </div>

            <h1
              className={`text-4xl md:text-6xl lg:text-7xl font-bold text-slate-900 mb-6 leading-tight ${isVisible ? "fade-in-up" : ""}`}
              style={{ animationDelay: "0.2s" }}
            >
              Your Health,
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {" "}
                Our Priority
              </span>
            </h1>

            <p
              className={`text-lg md:text-xl text-slate-600 mb-10 max-w-3xl mx-auto leading-relaxed ${isVisible ? "fade-in-up" : ""}`}
              style={{ animationDelay: "0.3s" }}
            >
              Connect with qualified doctors, book appointments, and manage your healthcare journey with DocMate - your
              trusted medical companion.
            </p>

            <div
              className={`flex flex-col sm:flex-row gap-4 justify-center ${isVisible ? "fade-in-up" : ""}`}
              style={{ animationDelay: "0.4s" }}
            >
              <button onClick={() => navigate('/upload/report')} className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                A.I Report Scan
              </button>
              <button onClick={() => navigate('/doctors')} className="bg-white border-2 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50 px-8 py-4 text-lg font-semibold rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
                Find Doctors
              </button>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-20 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className={`text-center mb-16 ${isVisible ? "fade-in-up" : ""}`} style={{ animationDelay: "0.5s" }}>
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">Our Services</h2>
              <p className="text-slate-600 text-lg max-w-2xl mx-auto">
                Comprehensive healthcare solutions designed for you and your family's wellbeing
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {services.map(({ title, desc, icon }, i) => (
                <div
                  key={i}
                  className={`group bg-white p-8 text-center rounded-2xl border border-slate-200 hover:border-blue-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 ${isVisible ? "fade-in-up" : ""}`}
                  style={{ animationDelay: `${0.6 + i * 0.1}s` }}
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <svg
                      className="w-8 h-8 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 px-4 bg-slate-50">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { number: "10,000+", label: "Happy Patients" },
                { number: "500+", label: "Expert Doctors" },
                { number: "50+", label: "Specializations" },
                { number: "24/7", label: "Support" },
              ].map(({ number, label }, i) => (
                <div
                  key={i}
                  className={`group ${isVisible ? "fade-in-up" : ""}`}
                  style={{ animationDelay: `${0.9 + i * 0.1}s` }}
                >
                  <div className="text-3xl md:text-4xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {number}
                  </div>
                  <div className="text-slate-600 font-medium">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative bg-gradient-to-r from-slate-900 to-slate-800 py-20 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width%3D%2240%22 height%3D%2240%22 viewBox%3D%220 0 40 40%22 xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg fill%3D%22%23ffffff%22 fillOpacity%3D%220.05%22%3E%3Cpath d%3D%22M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-20"></div>

          <div className="max-w-4xl mx-auto text-center relative">
            <h2
              className={`text-3xl md:text-5xl font-bold text-white mb-6 ${isVisible ? "fade-in-up" : ""}`}
              style={{ animationDelay: "1.3s" }}
            >
              Ready to Get Started?
            </h2>
            <p
              className={`text-slate-300 text-lg mb-10 max-w-2xl mx-auto leading-relaxed ${isVisible ? "fade-in-up" : ""}`}
              style={{ animationDelay: "1.4s" }}
            >
              Join thousands of patients who trust DocMate for their healthcare needs and experience the future of
              medical care.
            </p>
            <button
              className={`bg-white text-slate-900 hover:bg-slate-100 px-10 py-4 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 ${isVisible ? "fade-in-up" : ""}`}
              style={{ animationDelay: "1.5s" }}
            >
              Get Started Today
            </button>
          </div>
        </section>
      </div>
    </>
  )
}
