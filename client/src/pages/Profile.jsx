import { useState } from "react";
import { useAuth } from "../context/Auth";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";

function Profile() {
  const { user, loading, error } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [updateError, setUpdateError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setUpdateError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      setUpdateError("New passwords do not match");
      return;
    }

    // const { success, message } = await updatePassword({
    //     oldPassword: formData.oldPassword,
    //     newPassword: formData.newPassword,
    // });

    // if (success) {
    //     setEditMode(false);
    //     setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    // } else {
    //     setUpdateError(message);
    // }
  };

  return (
    <div className="bg-black min-h-screen flex items-center justify-center px-4">
      <div className="max-w-2xl w-full space-y-8 bg-[#131313] p-8 rounded-xl border border-gray-800">
        <div className="text-center">
          <h2 className="text-3xl font-bold">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-cyan-400">
              Profile Settings
            </span>
          </h2>
          <p className="mt-2 text-gray-400">Manage your account information</p>
        </div>

        <div className="space-y-6">
          {/* User Info Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-4 bg-[#1a1a1a] rounded-lg">
              <FaUser className="text-green-400 text-xl" />
              <div>
                <p className="text-gray-400 text-sm">Username</p>
                <p className="text-white">{user?.username}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-[#1a1a1a] rounded-lg">
              <FaEnvelope className="text-cyan-400 text-xl" />
              <div>
                <p className="text-gray-400 text-sm">Email</p>
                <p className="text-white">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Password Change Section */}
          <div className="pt-6 border-t border-gray-800">
            <button
              onClick={() => setEditMode(!editMode)}
              className="text-cyan-400 hover:text-cyan-300 flex items-center space-x-2"
            >
              <FaLock />
              <span>Change Password</span>
            </button>

            {editMode && (
              <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                {(updateError || error) && (
                  <div className="text-red-500 text-sm text-center bg-red-500/10 py-2 rounded">
                    {updateError || error}
                  </div>
                )}

                <div className="space-y-4">
                  <input
                    type="password"
                    name="oldPassword"
                    placeholder="Current Password"
                    value={formData.oldPassword}
                    onChange={handleChange}
                    className="w-full bg-[#1a1a1a] border border-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:border-cyan-400 text-white"
                  />

                  <input
                    type="password"
                    name="newPassword"
                    placeholder="New Password"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className="w-full bg-[#1a1a1a] border border-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:border-cyan-400 text-white"
                  />

                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm New Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full bg-[#1a1a1a] border border-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:border-cyan-400 text-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading.updatePassword}
                  className="w-full bg-gradient-to-r from-green-400 to-cyan-400 text-white rounded-lg px-4 py-2 hover:opacity-90 transition-opacity flex items-center justify-center"
                >
                  {loading.updatePassword ? (
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
                      Updating...
                    </>
                  ) : (
                    "Update Password"
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
