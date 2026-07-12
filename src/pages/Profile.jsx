import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import { useCustomer } from "../context/CustomerContext";


function Profile() {
    const navigate = useNavigate();

    const { user } = useAuth();

    const { address, customerLoading } = useCustomer();

    return (
        <div className="min-h-screen bg-slate-100 p-8">

            <div className="mx-auto max-w-3xl rounded-xl bg-white p-8 shadow-md">

                <div className="flex items-center gap-6">

                    <div
                        className="
                            flex
                            h-24
                            w-24
                            items-center
                            justify-center
                            rounded-full
                            bg-blue-600
                            text-4xl
                            font-bold
                            text-white
                        "
                    >
                        {user?.fullName?.charAt(0).toUpperCase()}
                    </div>

                    <div>

                        <h1 className="text-3xl font-bold">
                            {user?.fullName}
                        </h1>

                        <p className="mt-1 text-slate-600">
                            {user?.email}
                        </p>

                    </div>

                </div>

                <hr className="my-8" />

                <div className="grid gap-6 md:grid-cols-2">

                    <div>
                        <p className="text-sm text-slate-500">
                            Full Name
                        </p>

                        <p className="mt-1 text-lg font-medium">
                            {user?.fullName}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-slate-500">
                            Email
                        </p>

                        <p className="mt-1 text-lg font-medium">
                            {user?.email}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-slate-500">
                            Role
                        </p>

                        <p className="mt-1 text-lg font-medium capitalize">
                            {user?.role}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-slate-500">
                            Account Status
                        </p>

                        <p className="mt-1 text-lg font-medium text-green-600">
                            Active
                        </p>
                    </div>

                </div>

                <hr className="my-8" />

                <div>

                    <h2 className="mb-5 text-2xl font-bold">
                        Saved Addresses
                    </h2>

                    {
                        customerLoading ? (

                            <p className="text-slate-500">
                                Loading addresses...
                            </p>

                        ) : address?.length > 0 ? (

                            <div className="space-y-4">

                                {
                                    address.map((item) => (

                                        <div
                                            key={item._id}
                                            className="
                                                rounded-lg
                                                border
                                                border-slate-200
                                                bg-slate-50
                                                p-5
                                            "
                                        >

                                            <p className="font-semibold text-lg">
                                                {item.houseNumber}, {item.street}
                                            </p>

                                            {
                                                item.landmark && (

                                                    <p className="mt-1 text-slate-600">
                                                        {item.landmark}
                                                    </p>

                                                )
                                            }

                                            <p className="mt-1 text-slate-700">
                                                {item.city}, {item.state}
                                            </p>

                                            <p className="text-slate-700">
                                                {item.pinCode}
                                            </p>

                                            <p className="text-slate-700">
                                                {item.country}
                                            </p>

                                        </div>

                                    ))
                                }

                            </div>

                        ) : (

                            <div
                                className="
                                    rounded-lg
                                    border
                                    border-dashed
                                    border-slate-300
                                    p-6
                                    text-center
                                "
                            >
                                <p className="text-slate-500">
                                    No saved addresses found.
                                </p>
                            </div>

                        )
                    }

                </div>

                <div className="mt-10 flex gap-4">

                    <button
                        onClick={() => navigate("/settings")}
                        className="
                            rounded-lg
                            bg-blue-600
                            px-6
                            py-3
                            font-semibold
                            text-white
                            hover:bg-blue-700
                        "
                    >
                        Edit Profile
                    </button>

                    <button
                        onClick={() => navigate("/dashboard")}
                        className="
                            rounded-lg
                            border
                            border-slate-300
                            px-6
                            py-3
                            font-semibold
                            hover:bg-slate-100
                        "
                    >
                        Back to Dashboard
                    </button>

                </div>

            </div>

        </div>
    );
}

export default Profile;