
import { useState } from "react"
import { loginUser, registerUser } from "../services/api"
import { useNavigate } from "react-router-dom"


export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [error, setError] = useState("")

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

 const handleSubmit = async (e) => {
  e.preventDefault()
  setError("")

  const email = formData.email.trim()
  const password = formData.password.trim()

  if (!email || !password) {
    return setError("Please fill in all required fields.")
  }

  try {
    if (isLogin) {
      const data = await loginUser(email, password)
      localStorage.setItem("access_token", data.access)
      localStorage.setItem("refresh_token", data.refresh)
      window.location.href = "/profile"  
    } else {
      if (password !== formData.confirmPassword.trim()) {
        return setError("Passwords do not match")
      }

      await registerUser({
        email,
        full_name: formData.full_name.trim(),
        password,
        is_doctor: false,
      })

      const loginData = await loginUser(email, password)
      localStorage.setItem("access_token", loginData.access)
      localStorage.setItem("refresh_token", loginData.refresh)
      window.location.href = "/profile"
    }
  } catch (err) {
    setError(err.message || "Something went wrong. Please try again.")
  }
}



  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex min-h-[600px]">

          <div className="flex-1 p-8 lg:p-12 flex items-center justify-center">
            <div className="w-full max-w-sm space-y-6 transition-all duration-500 ease-in-out">
              <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold text-gray-900">
                  {isLogin ? "Welcome Back" : "Create Account"}
                </h1>
                <p className="text-gray-600">
                  {isLogin ? "Sign in to your account" : "Sign up for a new account"}
                </p>
              </div>

              <div key={isLogin ? "login" : "register"} className="animate-in fade-in duration-500">
                <form className="space-y-4" onSubmit={handleSubmit}>
                  {!isLogin && (
                    <div className="space-y-1">
                      <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
                        Full Name
                      </label>
                      <input
                        id="full_name"
                        type="text"
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  )}

                  <div className="space-y-1">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      onChange={handleChange}
                      placeholder="Enter your email"
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <input
                      id="password"
                      type="password"
                      onChange={handleChange}
                      placeholder="Enter your password"
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {!isLogin && (
                    <div className="space-y-1">
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                        Confirm Password
                      </label>
                      <input
                        id="confirmPassword"
                        type="password"
                        onChange={handleChange}
                        placeholder="Confirm your password"
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  )}

                  {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                  <button
                    type="submit"
                    className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition-all duration-200"
                  >
                    {isLogin ? "Sign In" : "Create Account"}
                  </button>
                </form>
              </div>

              {isLogin && (
                <div className="text-center">
                  <a href="#" className="text-sm text-blue-600 hover:text-blue-700">
                    Forgot your password?
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Text Side */}
          <div className="flex-1 bg-gradient-to-br from-blue-600 to-purple-700 p-8 lg:p-12 flex items-center justify-center text-white">
            <div className="text-center space-y-6">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold">{isLogin ? "Login Page" : "Register Page"}</h2>
                <p className="text-lg opacity-90">{isLogin ? "Want to register?" : "Want to login?"}</p>
              </div>

              <div className="space-y-4">
                <p className="text-sm opacity-80">
                  {isLogin
                    ? "Don't have an account? Create one now and join our community!"
                    : "Already have an account? Sign in to access your dashboard!"}
                </p>

                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="bg-transparent border border-white text-white px-8 py-3 rounded-md hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:scale-105 active:scale-95"
                >
                  {isLogin ? "Create Account" : "Sign In"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
