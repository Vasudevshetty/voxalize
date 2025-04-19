import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/Auth"; // Adjust the path based on your project structure

function Signup() {
  const navigate = useNavigate();
  const { signup, loading, errors } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    mobileNumber: "",
  });
  const [error, setError] = useState("");
  const [formErrors, setFormErrors] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    mobileNumber: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); // Clear general error on input change
    setFormErrors({ ...formErrors, [e.target.name]: "" }); // Clear specific input error
  };

  const validateForm = () => {
    let isValid = true;
    const errors = { ...formErrors };

    // Username validation (can be extended with regex or length check)
    if (!formData.username) {
      errors.username = "Username is required.";
      isValid = false;
    }

    // Email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!formData.email) {
      errors.email = "Email is required.";
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      errors.email = "Please enter a valid email address.";
      isValid = false;
    }

    // Password validation
    if (!formData.password) {
      errors.password = "Password is required.";
      isValid = false;
    } else if (formData.password.length < 6) {
      errors.password = "Password should be at least 6 characters.";
      isValid = false;
    }

    // Confirm Password validation
    if (!formData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password.";
      isValid = false;
    } else if (formData.confirmPassword !== formData.password) {
      errors.confirmPassword = "Passwords do not match.";
      isValid = false;
    }

    // Mobile Number validation (simple length check or regex can be used)
    if (!formData.mobileNumber) {
      errors.mobileNumber = "Mobile number is required.";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Perform form validation
    if (!validateForm()) {
      return; // Prevent submission if form is invalid
    }

    await signup({
      username: formData.username,
      email: formData.email,
      password: formData.password,
      mobileNumber: formData.mobileNumber,
    });

    // The errors will be handled through the errors object from useAuth
    if (!errors?.signup) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="bg-black min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 bg-[#131313] p-8 rounded-xl border border-gray-800">
        <div className="text-center">
          <h2 className="text-3xl font-bold">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-cyan-400">
              Create Account
            </span>
          </h2>
          <p className="mt-2 text-gray-400">
            Join us to start visualizing data
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {(error || errors?.signup) && (
            <div className="text-red-500 text-sm text-center bg-red-500/10 py-2 rounded">
              {error || errors.signup}
            </div>
          )}

          <div className="space-y-4">
            {/* Username */}
            <div>
              <label htmlFor="username" className="text-gray-300 text-sm">
                Username
              </label>
              <input
                type="text"
                name="username"
                id="username"
                required
                value={formData.username}
                onChange={handleChange}
                className={`w-full bg-[#1a1a1a] border ${
                  formErrors.username ? "border-red-500" : "border-gray-800"
                } rounded-lg px-4 py-2 mt-1 focus:outline-none focus:border-cyan-400 text-white`}
              />
              {formErrors.username && (
                <p className="text-red-500 text-sm">{formErrors.username}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="text-gray-300 text-sm">
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                required
                value={formData.email}
                onChange={handleChange}
                className={`w-full bg-[#1a1a1a] border ${
                  formErrors.email ? "border-red-500" : "border-gray-800"
                } rounded-lg px-4 py-2 mt-1 focus:outline-none focus:border-cyan-400 text-white`}
              />
              {formErrors.email && (
                <p className="text-red-500 text-sm">{formErrors.email}</p>
              )}
            </div>

            {/* Mobile Number */}
            <div>
              <label htmlFor="mobileNumber" className="text-gray-300 text-sm">
                Mobile Number
              </label>
              <input
                type="tel"
                name="mobileNumber"
                id="mobileNumber"
                required
                value={formData.mobileNumber}
                onChange={handleChange}
                className={`w-full bg-[#1a1a1a] border ${
                  formErrors.mobileNumber ? "border-red-500" : "border-gray-800"
                } rounded-lg px-4 py-2 mt-1 focus:outline-none focus:border-cyan-400 text-white`}
              />
              {formErrors.mobileNumber && (
                <p className="text-red-500 text-sm">
                  {formErrors.mobileNumber}
                </p>
              )}
            </div>
            {/* Password */}
            <div>
              <label htmlFor="password" className="text-gray-300 text-sm">
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                required
                value={formData.password}
                onChange={handleChange}
                className={`w-full bg-[#1a1a1a] border ${
                  formErrors.password ? "border-red-500" : "border-gray-800"
                } rounded-lg px-4 py-2 mt-1 focus:outline-none focus:border-cyan-400 text-white`}
              />
              {formErrors.password && (
                <p className="text-red-500 text-sm">{formErrors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="text-gray-300 text-sm"
              >
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full bg-[#1a1a1a] border ${
                  formErrors.confirmPassword
                    ? "border-red-500"
                    : "border-gray-800"
                } rounded-lg px-4 py-2 mt-1 focus:outline-none focus:border-cyan-400 text-white`}
              />
              {formErrors.confirmPassword && (
                <p className="text-red-500 text-sm">
                  {formErrors.confirmPassword}
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading.signup}
            className="w-full bg-gradient-to-r cursor-pointer from-green-400 to-cyan-400 text-white rounded-lg px-4 py-2 hover:opacity-90 transition-opacity flex items-center justify-center"
          >
            {loading.signup ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Signing up...
              </>
            ) : (
              "Sign Up"
            )}
          </button>

          <div className="text-center text-gray-400">
            <p>
              Already have an account?{" "}
              <Link
                to="/auth/login"
                className="text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                Log in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
