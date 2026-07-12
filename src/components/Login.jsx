import {
    useState,
} from "react";

import {
    useNavigate,
} from "react-router-dom";

import api
    from "../services/api";

import {
    useAuth,
} from "../context/AuthContext";

function Login({
    setScreen,
    setVerificationEmail,
    setTwoFactorUserId,
}) {
    const navigate =
        useNavigate();

    const {
        setUser,
    } = useAuth();

    const [
        formData,
        setFormData,
    ] = useState({
        email: "",
        password: "",
    });

    const [
        loading,
        setLoading,
    ] = useState(false);

    const [
        error,
        setError,
    ] = useState("");

    const handleChange = (
        event
    ) => {
        const {
            name,
            value,
        } = event.target;

        setFormData(
            (
                previousData
            ) => ({
                ...previousData,

                [name]:
                    value,
            })
        );
    };

    const handleLogin =
        async (
            event
        ) => {

            event.preventDefault();

            setLoading(true);

            setError("");

            try {

                const response =
                    await api.post(
                        "/auth/login",

                        formData
                    );

                const data =
                    response
                        .data
                        .data;

                if (
                    data
                        .requiresVerification
                ) {

                    setVerificationEmail(
                        data.email
                    );

                    setScreen(
                        "verifyOTP"
                    );

                    return;
                }

                if (
                    data
                        .requires2FA
                ) {

                    setTwoFactorUserId(
                        data.userId
                    );

                    setScreen(
                        "verify2FA"
                    );

                    return;
                }

                setUser(
                    data.user
                );

                navigate(
                    "/dashboard",

                    {
                        replace:
                            true,
                    }
                );

            } catch (
            error
            ) {

                setError(

                    error
                        .response
                        ?.data
                        ?.message ||

                    error
                        .message ||

                    "Login failed"

                );

            } finally {

                setLoading(
                    false
                );

            }
        };

    return (
        <form
            onSubmit={
                handleLogin
            }
            className="
                space-y-5
            "
        >

            <h2
                className="
                    text-2xl
                    font-bold
                "
            >
                Welcome Back
            </h2>

            <input
                name="email"
                type="email"
                value={
                    formData
                        .email
                }
                onChange={
                    handleChange
                }
                placeholder="
                    Email
                "
                required
                className="
                    w-full
                    rounded-lg
                    border
                    p-3
                "
            />

            <input
                name="password"
                type="password"
                value={
                    formData
                        .password
                }
                onChange={
                    handleChange
                }
                placeholder="
                    Password
                "
                required
                className="
                    w-full
                    rounded-lg
                    border
                    p-3
                "
            />

            {
                error && (

                    <p
                        className="
                            rounded-lg
                            bg-red-50
                            p-3
                            text-red-600
                        "
                    >
                        {error}
                    </p>

                )
            }

            <button
                disabled={
                    loading
                }
                className="
                    w-full
                    rounded-lg
                    bg-blue-600
                    p-3
                    text-white
                "
            >

                {
                    loading

                        ? "Logging in..."

                        : "Login"
                }

            </button>

            <div className=" text-center ">
                <a onClick={(e) => setScreen("forgotPasswordRequest")} className=" text-sm text-blue-600 hover:underline ">
                    Forgot Password?
                </a>
            </div>


        </form>
    );
}

export default Login;