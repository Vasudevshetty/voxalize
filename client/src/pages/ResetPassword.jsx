import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/Auth";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { resetPassword, loading, errors } = useAuth();
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    const result = await resetPassword({
      token,
      password: formData.password,
    });

    if (result.success) {
      navigate("/auth/login");
    }
  };

  return (
    <div className="bg-black min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 bg-[#131313] p-8 rounded-xl border border-gray-800">
        <div className="text-center">
          <h2 className="text-3xl font-bold">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-cyan-400">
              Reset Password
            </span>
          </h2>
          <p className="mt-2 text-gray-400">Enter your new password</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {(error || errors?.resetPassword) && (
            <div className="text-red-500 text-sm text-center bg-red-500/10 py-2 rounded">
              {error || errors.resetPassword}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="password" className="text-gray-300 text-sm">
                New Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full bg-[#1a1a1a] border border-gray-800 rounded-lg px-4 py-2 mt-1 focus:outline-none focus:border-cyan-400 text-white"
              />
            </div>

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
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full bg-[#1a1a1a] border border-gray-800 rounded-lg px-4 py-2 mt-1 focus:outline-none focus:border-cyan-400 text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading.resetPassword}
            className="w-full bg-gradient-to-r cursor-pointer from-green-400 to-cyan-400 text-white rounded-lg px-4 py-2 hover:opacity-90 transition-opacity flex items-center justify-center"
          >
            {loading.resetPassword ? (
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
                Resetting...
              </>
            ) : (
              "Reset Password"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
