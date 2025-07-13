export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-slate-900 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-light mb-4">
            About <span className="font-semibold">MediScan</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Revolutionizing healthcare through intelligent, accessible solutions
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 py-20 space-y-24">
        {/* Mission & Vision */}
        <section className="grid md:grid-cols-2 gap-16">
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-slate-900">Our Mission</h2>
            <p className="text-slate-700 text-lg leading-relaxed">
              We aim to reshape how patients experience healthcare by delivering AI-driven, secure, and
              transparent medical support — from report scanning to verified doctor discovery.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-slate-900">Our Vision</h2>
            <p className="text-slate-700 text-lg leading-relaxed">
              We envision a world where technology bridges the gap between patients and doctors, making
              informed health decisions a universal right.
            </p>
          </div>
        </section>

        {/* Core Values */}
        <section>
          <h2 className="text-3xl font-light text-center text-slate-900 mb-10">Our Core Values</h2>
          <div className="grid md:grid-cols-2 gap-10">
            {[
              {
                title: "Transparency",
                desc: "Every review, appointment, and report is handled with complete visibility and user consent.",
                color: "blue",
              },
              {
                title: "Trust",
                desc: "We list only certified professionals and verified real user reviews.",
                color: "green",
              },
              {
                title: "Innovation",
                desc: "Our A.I. simplifies complex health data into meaningful suggestions.",
                color: "purple",
              },
              {
                title: "User-First",
                desc: "We prioritize privacy, simplicity, and patient comfort at every level.",
                color: "orange",
              },
            ].map((value, idx) => (
              <div key={idx} className={`border-l-4 border-${value.color}-500 pl-4`}>
                <h3 className="text-xl font-semibold mb-2 text-slate-900">{value.title}</h3>
                <p className="text-slate-600 text-lg leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* What We Offer */}
        <section>
          <h2 className="text-3xl font-light text-center text-slate-900 mb-12">What We Offer</h2>
          <div className="space-y-8">
            {[
              {
                title: "AI-based Report Analysis & Medicine Suggestions",
                desc: "Upload your report and get real-time AI-powered interpretations with alternatives.",
              },
              {
                title: "Verified Doctor Listings",
                desc: "We offer a reliable directory of certified professionals with honest reviews.",
              },
              {
                title: "Flexible & Secure Appointment Booking",
                desc: "Book available slots easily — with transparent fees and confirmation.",
              },
              {
                title: "Encrypted Medical History (Coming Soon)",
                desc: "Your medical records will be securely stored and accessible only to you.",
              },
            ].map((feature, i) => (
              <div key={i} className="border-b pb-6 last:border-none">
                <h3 className="text-xl font-semibold text-slate-900 mb-1">{feature.title}</h3>
                <p className="text-slate-600 text-lg">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Our Story */}
        <section className="text-center">
          <h2 className="text-3xl font-light mb-6 text-slate-900">Our Story</h2>
          <div className="max-w-3xl mx-auto">
            <p className="text-slate-700 text-lg leading-relaxed mb-4">
              MediScan started from a simple question:{" "}
              <span className="italic text-slate-900 font-medium">
                "Why is healthcare so complicated for patients?"
              </span>
            </p>
            <p className="text-slate-700 text-lg leading-relaxed">
              What began as a weekend hackathon project is now a growing digital platform that simplifies patient care
              through powerful technology — helping real people live healthier lives.
            </p>
          </div>
        </section>

        {/* Contact */}
        <section className="text-center border-t pt-16">
          <h2 className="text-3xl font-light mb-4 text-slate-900">Get in Touch</h2>
          <p className="text-slate-600 mb-6 text-lg">Have suggestions or want to collaborate with us?</p>
          <a
            href="mailto:mediscan.support@gmail.com"
            className="inline-block bg-slate-900 text-white px-6 py-3 font-medium rounded-lg hover:bg-slate-800 transition"
          >
            Contact Us
          </a>
          <p className="text-slate-500 text-sm mt-4">mediscan.support@gmail.com</p>
        </section>
      </div>
    </div>
  );
}
