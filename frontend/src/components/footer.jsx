"use client"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const links = {
    Services: ["Find Doctors", "Book Appointment", "Health Records"],
    Company: ["About Us", "Contact", "Careers"],
    Support: ["Help Center", "Privacy Policy", "Terms of Service"],
  }

  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div>
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm8 0a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V8zm0 4a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1v-2z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="text-2xl font-bold">DocMate</span>
            </div>
            <p className="text-slate-400 leading-relaxed mb-6">
              Your trusted healthcare companion for connecting with qualified doctors.
            </p>
            <div className="flex space-x-3">
              {["Facebook", "Twitter", "LinkedIn"].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="w-9 h-9 bg-slate-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors duration-200"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <h3 className="font-semibold text-white mb-4">{title}</h3>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item}>
                    <a href="#" className="text-slate-400 hover:text-white transition-colors duration-200 text-sm">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-800 pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <p className="text-sm text-slate-400">&copy; {currentYear} DocMate. All rights reserved.</p>
            <div className="flex items-center space-x-2 text-sm text-slate-400">
              <span>Made with</span>
              <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                  clipRule="evenodd"
                />
              </svg>
              <span>for healthcare</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
