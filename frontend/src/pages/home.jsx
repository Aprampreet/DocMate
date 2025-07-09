"use client"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-white py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">Your Health, Our Priority</h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Connect with qualified doctors, book appointments, and manage your healthcare journey with DocMate - your trusted medical companion.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg rounded-md">
              Book Appointment
            </button>
            <button className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 text-lg rounded-md">
              Find Doctors
            </button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
            <p className="text-gray-600 text-lg">Comprehensive healthcare solutions for you and your family</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Service Card */}
            {[{
              title: "Expert Doctors",
              desc: "Connect with certified and experienced medical professionals",
              icon: (
                <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              )
            }, {
              title: "Easy Booking",
              desc: "Schedule appointments online with just a few clicks",
              icon: (
                <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              )
            }, {
              title: "Quality Care",
              desc: "Receive personalized treatment and comprehensive care",
              icon: (
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              )
            }].map(({ title, desc, icon }, i) => (
              <div key={i} className="text-center p-6 border rounded-lg hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    {icon}
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
                <p className="text-gray-600 mt-2">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-blue-100 text-lg mb-8">Join thousands of patients who trust DocMate for their healthcare needs</p>
          <button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg font-medium rounded-md">
            Get Started Today
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm8 0a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V8zm0 4a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1v-2z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-xl font-bold">DocMate</span>
              </div>
              <p className="text-gray-400">Your trusted healthcare companion</p>
            </div>

            {[
              {
                title: "Services",
                items: ["General Medicine", "Specialist Care", "Emergency Care"],
              },
              {
                title: "Company",
                items: ["About Us", "Contact", "Careers"],
              },
              {
                title: "Contact",
                items: ["support@docmate.com", "+1 (555) 123-4567", "24/7 Support"],
              },
            ].map(({ title, items }, i) => (
              <div key={i}>
                <h3 className="font-semibold mb-4">{title}</h3>
                <ul className="space-y-2 text-gray-400">
                  {items.map((item, idx) => (
                    <li key={idx}>
                      {title !== "Contact" ? (
                        <a href="#" className="hover:text-white">{item}</a>
                      ) : (
                        item
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 DocMate. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
