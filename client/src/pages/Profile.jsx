import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/Auth";
import { useDispatch, useSelector } from "react-redux";
import {
  updatePassword,
  updateProfile,
  getProfile,
} from "../redux/slices/user";
import { FaUser, FaEnvelope, FaLock, FaCamera } from "react-icons/fa";

function Profile() {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { loading, error, profile } = useSelector((state) => state.user);
  const [editMode, setEditMode] = useState(false);
  const fileInputRef = useRef(null);
  const [updateError, setUpdateError] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);

  const [profileData, setProfileData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    mobileNumber: user?.mobileNumber || "",
  });

  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Fetch profile data on component mount
  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  // Update local state when profile changes
  useEffect(() => {
    if (profile) {
      setProfileData({
        username: profile.username || "",
        email: profile.email || "",
        mobileNumber: profile.mobileNumber || "",
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setUpdateError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateError("");

    if (formData.newPassword !== formData.confirmPassword) {
      setUpdateError("New passwords do not match");
      return;
    }

    const resultAction = await dispatch(
      updatePassword({
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
      })
    );

    if (updatePassword.fulfilled.match(resultAction)) {
      setEditMode(false);
      setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type and size
    const validTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!validTypes.includes(file.type)) {
      setUpdateError("Please upload an image file (JPG, PNG, or GIF)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUpdateError("File size should be less than 5MB");
      return;
    }

    const formData = new FormData();
    formData.append("profileImage", file);

    // Add existing profile data
    Object.keys(profileData).forEach((key) => {
      if (profileData[key]) {
        formData.append(key, profileData[key]);
      }
    });

    try {
      const resultAction = await dispatch(updateProfile(formData));

      if (updateProfile.fulfilled.match(resultAction)) {
        setUploadProgress(0);
        // Refresh profile data
        dispatch(getProfile());
      }
    } catch {
      setUpdateError("Failed to upload image. Please try again.");
    }
  };

  // Loading spinner component
  const LoadingSpinner = () => (
    <svg
      className="animate-spin h-5 w-5 text-white"
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
  );

  const profileImageSection = (
    <div className="relative w-32 h-32 mx-auto mb-6">
      <img
        src={
          profile?.profileImage || user?.profileImage || "/default-avatar.png"
        }
        alt="Profile"
        className="w-full h-full rounded-full object-cover border-4 border-gray-800"
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={loading.update}
        className="absolute bottom-0 right-0 bg-cyan-400 p-2 rounded-full hover:bg-cyan-500 transition-colors disabled:opacity-50"
      >
        {loading.update ? (
          <LoadingSpinner />
        ) : (
          <FaCamera className="text-white" />
        )}
      </button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        className="hidden"
      />
      {uploadProgress > 0 && uploadProgress < 100 && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
          <span className="text-white">{uploadProgress}%</span>
        </div>
      )}
    </div>
  );

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
          {profileImageSection}
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-4 bg-[#1a1a1a] rounded-lg">
              <FaUser className="text-green-400 text-xl" />
              <div>
                <p className="text-gray-400 text-sm">Username</p>
                <p className="text-white">
                  {profile?.username || user?.username}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-[#1a1a1a] rounded-lg">
              <FaEnvelope className="text-cyan-400 text-xl" />
              <div>
                <p className="text-gray-400 text-sm">Email</p>
                <p className="text-white">{profile?.email || user?.email}</p>
              </div>
            </div>
          </div>

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
                {(updateError || error?.password) && (
                  <div className="text-red-500 text-sm text-center bg-red-500/10 py-2 rounded">
                    {updateError || error.password}
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
                  disabled={loading.password}
                  className="w-full bg-gradient-to-r from-green-400 to-cyan-400 text-white rounded-lg px-4 py-2 hover:opacity-90 transition-opacity flex items-center justify-center"
                >
                  {loading.password ? (
                    <>
                      <LoadingSpinner />
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
