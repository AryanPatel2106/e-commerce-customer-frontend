import {
    useState
} from "react";

import {
    useNavigate,
    useParams
} from "react-router-dom";

import api
    from "../services/api";

function ResetPassword() {
    const navigate =
        useNavigate();

    const {
        resetToken
    } = useParams();

    const [
        newPassword,
        setNewPassword,
    ] = useState("");

    const [
        confirmPassword,
        setConfirmPassword,
    ] = useState("");

    const [
        error,
        setError,
    ] = useState("");

    const [
        message,
        setMessage,
    ] = useState("");

    const [
        loading,
        setLoading,
    ] = useState(false);

    const handleResetPassword =
        async (
            event
        ) => {

        event.preventDefault();

        setError("");

        setMessage("");

        if (
            newPassword !==
            confirmPassword
        ) {
            setError(
                "Passwords do not match"
            );

            return;
        }

        setLoading(true);

        try {
            const response =
                await api.post(
                    `/auth/reset-password/${resetToken}`,
                    {
                        newPassword,
                    }
                );

            setMessage(
                response.data.message
            );

            setTimeout(() => {
                navigate(
                    "/",
                    {
                        replace: true,
                    }
                );
            }, 2000);

        } catch (error) {
            setError(
                error.response
                    ?.data
                    ?.message ||
                "Could not reset password"
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <main
            className="
                flex
                min-h-screen
                items-center
                justify-center
                bg-slate-100
                px-4
            "
        >

            <div
                className="
                    w-full
                    max-w-md
                    rounded-2xl
                    bg-white
                    p-8
                    shadow-lg
                "
            >

                <form
                    onSubmit={
                        handleResetPassword
                    }
                    className="
                        space-y-5
                    "
                >

                    <div>

                        <h1
                            className="
                                text-3xl
                                font-bold
                                text-slate-900
                            "
                        >
                            Reset Password
                        </h1>

                        <p
                            className="
                                mt-2
                                text-sm
                                text-slate-500
                            "
                        >
                            Enter your new
                            password below.
                        </p>

                    </div>

                    <div>

                        <label
                            htmlFor="
                                new-password
                            "
                            className="
                                mb-2
                                block
                                font-medium
                            "
                        >
                            New Password
                        </label>

                        <input
                            id="new-password"
                            type="password"
                            value={
                                newPassword
                            }
                            onChange={(
                                event
                            ) => {
                                setNewPassword(
                                    event
                                        .target
                                        .value
                                );
                            }}
                            placeholder="
                                Enter new password
                            "
                            autoComplete="
                                new-password
                            "
                            minLength="8"
                            disabled={
                                loading
                            }
                            required
                            className="
                                w-full
                                rounded-lg
                                border
                                p-3
                            "
                        />

                    </div>

                    <div>

                        <label
                            htmlFor="
                                confirm-password
                            "
                            className="
                                mb-2
                                block
                                font-medium
                            "
                        >
                            Confirm Password
                        </label>

                        <input
                            id="
                                confirm-password
                            "
                            type="password"
                            value={
                                confirmPassword
                            }
                            onChange={(
                                event
                            ) => {
                                setConfirmPassword(
                                    event
                                        .target
                                        .value
                                );
                            }}
                            placeholder="
                                Confirm new password
                            "
                            autoComplete="
                                new-password
                            "
                            minLength="8"
                            disabled={
                                loading
                            }
                            required
                            className="
                                w-full
                                rounded-lg
                                border
                                p-3
                            "
                        />

                    </div>

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

                    {
                        message && (

                            <p
                                className="
                                    rounded-lg
                                    bg-green-50
                                    p-3
                                    text-green-700
                                "
                            >
                                {message}
                            </p>

                        )
                    }

                    <button
                        type="submit"
                        disabled={
                            loading
                        }
                        className="
                            w-full
                            rounded-lg
                            bg-blue-600
                            p-3
                            font-semibold
                            text-white
                            disabled:bg-blue-400
                        "
                    >

                        {
                            loading
                                ? "Resetting password..."
                                : "Reset Password"
                        }

                    </button>

                </form>

            </div>

        </main>
    );
}

export default ResetPassword;