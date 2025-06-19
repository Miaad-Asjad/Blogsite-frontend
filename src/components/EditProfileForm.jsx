import { useState } from "react";
import axiosInstance from "../utils/axiosInstance";

const EditProfileForm = ({ user, onProfileUpdated }) => {
  const [formData, setFormData] = useState({
    name: user.name || "",
    email: user.email || "",
    profilePicture: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profilePicture") {
      setFormData({ ...formData, profilePicture: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      if (formData.profilePicture) {
        data.append("profilePicture", formData.profilePicture);
      }

      const res = await axiosInstance.put("/api/auth/profile", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      onProfileUpdated(res.data); 
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 mt-6 text-left">
  {error && <p className="text-red-500">{error}</p>}

  <div>
    <label className="block text-sm font-medium text-gray-700 text-left">Name</label>
    <input
      type="text"
      name="name"
      value={formData.name}
      onChange={handleChange}
      className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
      required
    />
  </div>

  <div>
    <label className="block text-sm font-medium text-gray-700 text-left">Email</label>
    <input
      type="email"
      name="email"
      value={formData.email}
      onChange={handleChange}
      className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
      required
    />
  </div>

  <div>
    <label className="block text-sm font-medium text-gray-700 text-left mb-1">
      Profile Picture
    </label>

    <label
      htmlFor="profilePicture"
      className="inline-block bg-blue-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-700 transition"
    >
      Choose File
    </label>

    <input
      id="profilePicture"
      type="file"
      name="profilePicture"
      accept="image/*"
      onChange={handleChange}
      className="hidden"
    />

    {formData.profilePicture && (
      <p className="mt-2 text-sm text-gray-600">
        Selected: {formData.profilePicture.name}
      </p>
    )}
  </div>

  <button
    type="submit"
    disabled={loading}
    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
  >
    {loading ? "Updating..." : "Update Profile"}
  </button>
</form>

  );
};

export default EditProfileForm;
