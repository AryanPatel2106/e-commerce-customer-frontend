import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import api from "../services/api";

import { useCustomer } from "../context/CustomerContext";

function Profile() {
  const navigate = useNavigate();

  const { user, setUser } = useAuth();

  const [isEditing, setIsEditing] = useState(false);

  const [fullName, setFullName] = useState(user?.fullName || "");

  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || "");

  const updateProfile = async () => {
    try {
      const response = await api.put("/auth/update-profile", {
        fullName: fullName,
        phoneNumber: phoneNumber,
      });
      setUser(response.data.data);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="mx-auto max-w-3xl rounded-xl bg-white p-8 shadow-md">
        {isEditing ? (
          <>
            <h1 className="mb-6 text-2xl font-bold">Edit Profile</h1>

            <form
              onSubmit={(e) => {
                e.preventDefault();

                updateProfile();

                setIsEditing(false);
              }}
            >
              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Full Name
                </label>

                <input
                  type="text"
                  defaultValue={user?.fullName}
                  className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-blue-600 focus:ring focus:ring-blue-200"
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Phone Number
                </label>

                <input
                  type="text"
                  defaultValue={user?.phoneNumber}
                  className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-blue-600 focus:ring focus:ring-blue-200"
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
                >
                  Save Changes
                </button>

                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="rounded-lg border border-slate-300 px-6 py-3 font-semibold hover:bg-slate-100"
                >
                  Cancel
                </button>
              </div>
            </form>
          </>
        ) : (
          <>
            <div className="flex items-center gap-6">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-600 text-4xl font-bold text-white">
                {user?.fullName?.charAt(0).toUpperCase()}
              </div>

              <div>
                <h1 className="text-3xl font-bold">{user?.fullName}</h1>

                <p className="mt-1 text-slate-600">{user?.email}</p>
              </div>
            </div>

            <hr className="my-8" />

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <p className="text-sm text-slate-500">Full Name</p>

                <p className="mt-1 text-lg font-medium">{user?.fullName}</p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Email</p>

                <p className="mt-1 text-lg font-medium">{user?.email}</p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Phone Number</p>

                <p className="mt-1 text-lg font-medium">{user?.phoneNumber}</p>
              </div>
            </div>

            <hr className="my-8" />

            <div className="mt-10 flex gap-4">
              <button
                onClick={() => setIsEditing(true)}
                className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
              >
                Edit Profile
              </button>

              <button
                onClick={() => navigate("/dashboard")}
                className="rounded-lg border border-slate-300 px-6 py-3 font-semibold hover:bg-slate-100"
              >
                Back to Dashboard
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Profile;
