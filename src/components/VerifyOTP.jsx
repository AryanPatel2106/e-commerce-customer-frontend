import {
    useState,
} from "react";

import api
    from "../services/api";

function VerifyOTP({
    email,
    setScreen,
}) {
    const [
        otp,
        setOtp,
    ] = useState("");

    const [
        error,
        setError,
    ] = useState("");

    const [
        message,
        setMessage,
    ] = useState("");

    const handleVerify =
        async (
            event
        ) => {

        event.preventDefault();

        setError("");

        try {

            await api.post(

                "/auth/verifyOtpAndFinalizeRegister",

                {
                    email,

                    otp,
                }

            );

            setScreen(
                "login"
            );

        } catch (
            error
        ) {

            setError(

                error
                    .response
                    ?.data
                    ?.message ||

                "Invalid OTP"

            );

        }
    };

    const resendOTP =
        async () => {

        try {

            const response =
                await api.post(

                    "/auth/resendOtp",

                    {
                        email,
                    }

                );

            setMessage(

                response
                    .data
                    .message

            );

        } catch (
            error
        ) {

            setError(

                error
                    .response
                    ?.data
                    ?.message

            );

        }
    };

    return (
        <form
            onSubmit={
                handleVerify
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
                Verify Email
            </h2>

            <p>

                OTP sent to

                {" "}

                {email}

            </p>

            <input

                value={
                    otp
                }

                onChange={(
                    event
                ) => {

                    setOtp(

                        event
                            .target
                            .value

                    );

                }}

                placeholder="
                    Enter OTP
                "

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
                            text-green-600
                        "
                    >
                        {message}
                    </p>

                )
            }

            <button
                className="
                    w-full
                    rounded-lg
                    bg-blue-600
                    p-3
                    text-white
                "
            >
                Verify
            </button>

            <button

                type="button"

                onClick={
                    resendOTP
                }

                className="
                    w-full
                    border
                    p-3
                "

            >
                Resend OTP
            </button>

        </form>
    );
}

export default VerifyOTP;