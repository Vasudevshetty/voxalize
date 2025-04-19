import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/Auth";
import { useDispatch, useSelector } from "react-redux";
import {
  updatePassword,
  updateProfile,
  getProfile,
} from "../redux/slices/user";
import { FaUser, FaEnvelope, FaLock, FaCamera, FaPhone } from "react-icons/fa";
import { HiOutlineLogout } from "react-icons/hi";

function Profile() {
  const dispatch = useDispatch();
  const { user, logout } = useAuth();
  const { loading, error, profile } = useSelector((state) => state.user);
  const fileInputRef = useRef(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [editProfileMode, setEditProfileMode] = useState(false);
  const [editPasswordMode, setEditPasswordMode] = useState(false);

  const [updateError, setUpdateError] = useState("");
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [profileData, setProfileData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    mobileNumber: user?.mobileNumber || "",
  });

  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setProfileData({
        username: profile.username || "",
        email: profile.email || "",
        mobileNumber: profile.mobileNumber || "",
      });
    }
  }, [profile]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
    setUpdateError("");
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setUpdateError("");
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
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
      setEditPasswordMode(false);
      setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    }
  };

  const handleProfileSubmit = async () => {
    try {
      const resultAction = await dispatch(updateProfile(profileData));
      if (updateProfile.fulfilled.match(resultAction)) {
        setEditProfileMode(false);
        dispatch(getProfile());
      }
    } catch {
      setUpdateError("Failed to update profile. Please try again.");
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

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

    try {
      const resultAction = await dispatch(updateProfile(formData));
      if (updateProfile.fulfilled.match(resultAction)) {
        setUploadProgress(0);
        dispatch(getProfile());
      }
    } catch {
      setUpdateError("Failed to upload image. Please try again.");
    }
  };

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
    <div className="relative w-32 h-32 mx-auto mb-6 ">
      <img
        src={
          import.meta.env.VITE_APP_BACKEND_URL + profile?.profileImage ||
          user?.profileImage
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
    <div className="h-screen max-w-screen overflow-hidden bg-gradient-to-b from-black to-gray-900 flex flex-col">
      {/* Header - Fixed height */}
      <div className="p-3 bg-[#0a1a1a] border-b border-gray-800">
        <div className="w-full mx-auto  flex justify-between  items-center">
          <h2 className="text-xl ml-20 md:text-3xl font-bold">
            <span className="bg-clip-text  text-transparent bg-gradient-to-r from-green-400 to-cyan-400">
              Profile Settings
            </span>
          </h2>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-cyan-400 
              transition-colors duration-300 rounded-lg"
          >
            <HiOutlineLogout size={20} />
            <span className="text-sm hidden md:block">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto p-2  md:p-8">
          <div
            className="space-y-8 bg-[#0a1a1a]/50 rounded-xl p-2 md:p-8 backdrop-blur-sm
          border border-gray-800/50 shadow-xl"
          >
            {/* Profile Image Section */}
            {profileImageSection}

            <div className="space-y-4">
              {["username", "email", "mobileNumber"].map((field, idx) => {
                const icons = [<FaUser />, <FaEnvelope />, <FaPhone />];
                const labels = ["Username", "Email", "Mobile Number"];
                return (
                  <div
                    key={field}
                    className="flex items-center space-x-4 px-2 md:p-4 bg-[#1a1a1a] rounded-lg
                      border border-gray-800/50 hover:border-cyan-500/30 transition-colors overflow-x-auto"
                  >
                    <div className="text-cyan-400 text-xl hidden md:block">
                      {icons[idx]}
                    </div>

                    <div className="flex-1">
                      <p className="text-gray-400 text-sm">{labels[idx]}</p>
                      {editProfileMode ? (
                        <input
                          type="text"
                          name={field}
                          value={profileData[field]}
                          onChange={handleProfileChange}
                          className="w-full bg-transparent border-b border-gray-700 
                          text-white focus:outline-none focus:border-cyan-400 py-1"
                        />
                      ) : (
                        <p className="text-white py-1">{profileData[field]}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            {/* Action Buttons */}
            <div className="space-y-4 pt-4">
              <button
                onClick={() => {
                  if (editProfileMode) handleProfileSubmit();
                  else setEditProfileMode(true);
                }}
                className="w-full bg-gradient-to-r from-green-400 to-cyan-400 
                text-white rounded-lg px-4 py-2.5 hover:opacity-90 transition-opacity
                font-medium"
              >
                {editProfileMode ? "Save Changes" : "Edit Profile"}
              </button>

              {/* Password Section */}
              <div className="border-t border-gray-800 pt-6">
                <button
                  onClick={() => setEditPasswordMode(!editPasswordMode)}
                  className="text-cyan-400 hover:text-cyan-300 flex items-center 
                  space-x-2 mb-4"
                >
                  <FaLock />
                  <span>Change Password</span>
                </button>

                {editPasswordMode && (
                  <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    {(updateError || error?.password) && (
                      <div
                        className="text-red-500 text-sm text-center bg-red-500/10 
                      py-2 px-4 rounded-lg border border-red-500/20"
                      >
                        {updateError || error.password}
                      </div>
                    )}

                    {["oldPassword", "newPassword", "confirmPassword"].map(
                      (field, idx) => (
                        <input
                          key={field}
                          type="password"
                          name={field}
                          placeholder={
                            ["Current", "New", "Confirm New"][idx] + " Password"
                          }
                          value={formData[field]}
                          onChange={handlePasswordChange}
                          className="w-full bg-[#1a1a1a] border border-gray-800 
                          rounded-lg px-4 py-2.5 focus:outline-none focus:border-cyan-400 
                          text-white transition-colors"
                        />
                      )
                    )}

                    <button
                      type="submit"
                      disabled={loading.password}
                      className="w-full bg-gradient-to-r from-green-400 to-cyan-400 
                      text-white rounded-lg px-4 py-2.5 hover:opacity-90 
                      transition-opacity flex items-center justify-center font-medium"
                    >
                      {loading.password ? (
                        <>
                          <LoadingSpinner />
                          <span className="ml-2">Updating...</span>
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
      </div>
    </div>
  );
}

export default Profile;
