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

function Settings() {
    const navigate =
        useNavigate();

    const {
        user,
        updateTwoFactorStatus,
    } = useAuth();

    const [
        qrCode,
        setQrCode,
    ] = useState("");

    const [
        secret,
        setSecret,
    ] = useState("");

    const [
        enableCode,
        setEnableCode,
    ] = useState("");

    const [
        disableCode,
        setDisableCode,
    ] = useState("");

    const [
        loading,
        setLoading,
    ] = useState(false);

    const [
        error,
        setError,
    ] = useState("");

    const [
        message,
        setMessage,
    ] = useState("");

    const clearMessages = () => {
        setError("");

        setMessage("");
    };

    const handleSetup2FA =
        async () => {

            clearMessages();

            setLoading(true);

            try {
                const response =
                    await api.post(
                        "/auth/setup-2fa"
                    );

                setQrCode(
                    response
                        .data
                        .data
                        .qrCodeImageUrl
                );

                setSecret(
                    response
                        .data
                        .data
                        .secret
                );

            } catch (error) {

                setError(
                    error
                        .response
                        ?.data
                        ?.message ||
                    "Could not setup 2FA"
                );

            } finally {

                setLoading(false);

            }
        };

    const handleEnable2FA =
        async (event) => {

            event.preventDefault();

            clearMessages();

            setLoading(true);

            try {

                const response =
                    await api.post(
                        "/auth/verify-2fa",
                        {
                            code:
                                enableCode,
                        }
                    );

                updateTwoFactorStatus(
                    true
                );

                setMessage(
                    response
                        .data
                        .message
                );

                setQrCode("");

                setSecret("");

                setEnableCode("");

            } catch (error) {

                setError(
                    error
                        .response
                        ?.data
                        ?.message ||
                    "Invalid code"
                );

            } finally {

                setLoading(false);

            }
        };

    const handleDisable2FA =
        async (event) => {

            event.preventDefault();

            clearMessages();

            setLoading(true);

            try {

                const response =
                    await api.post(
                        "/auth/disable-2fa",
                        {
                            code:
                                disableCode,
                        }
                    );

                updateTwoFactorStatus(
                    false
                );

                setDisableCode("");

                setMessage(
                    response
                        .data
                        .message
                );

            } catch (error) {

                setError(
                    error
                        .response
                        ?.data
                        ?.message ||
                    "Could not disable 2FA"
                );

            } finally {

                setLoading(false);

            }
        };

    return (
        <main
            className="
            min-h-[calc(100vh-76px)]
            bg-slate-100
            px-4
            py-12
        "
        >

            <div
                className="
                mx-auto
                max-w-xl
                rounded-2xl
                bg-white
                p-8
                shadow-lg
            "
            >
                <h1
                    className="
                        mt-6
                        text-3xl
                        font-bold
                    "
                >
                    Security Settings
                </h1>

                <p
                    className="
                        mt-2
                        text-slate-500
                    "
                >
                    Manage two-factor
                    authentication.
                </p>

                {error && (

                    <p
                        className="
                            mt-5
                            rounded-lg
                            bg-red-50
                            p-3
                            text-red-600
                        "
                    >
                        {error}
                    </p>

                )}

                {message && (

                    <p
                        className="
                            mt-5
                            rounded-lg
                            bg-green-50
                            p-3
                            text-green-700
                        "
                    >
                        {message}
                    </p>

                )}

                {!user
                    ?.isTwoFactorEnabled && (

                        <div
                            className="
                            mt-8
                        "
                        >

                            {!qrCode && (

                                <button
                                    onClick={
                                        handleSetup2FA
                                    }
                                    disabled={
                                        loading
                                    }
                                    className="
                                    rounded-lg
                                    bg-blue-600
                                    px-5
                                    py-3
                                    text-white
                                "
                                >
                                    Setup 2FA
                                </button>

                            )}

                            {qrCode && (

                                <div
                                    className="
                                    text-center
                                "
                                >

                                    <img
                                        src={
                                            qrCode
                                        }
                                        alt="
                                        2FA QR Code
                                    "
                                        className="
                                        mx-auto
                                        w-56
                                    "
                                    />

                                    <p
                                        className="
                                        mt-4
                                        text-sm
                                    "
                                    >
                                        Secret:

                                        {" "}

                                        {secret}
                                    </p>

                                    <form
                                        onSubmit={
                                            handleEnable2FA
                                        }
                                        className="
                                        mt-6
                                    "
                                    >

                                        <input
                                            value={
                                                enableCode
                                            }
                                            onChange={
                                                (
                                                    event
                                                ) => {

                                                    setEnableCode(
                                                        event
                                                            .target
                                                            .value
                                                    );

                                                }}
                                            placeholder="
                                            Authenticator code
                                        "
                                            className="
                                            w-full
                                            rounded-lg
                                            border
                                            p-3
                                        "
                                        />

                                        <button
                                            className="
                                            mt-4
                                            w-full
                                            rounded-lg
                                            bg-green-600
                                            p-3
                                            text-white
                                        "
                                        >
                                            Verify and Enable
                                        </button>

                                    </form>

                                </div>

                            )}

                        </div>

                    )}

                {user
                    ?.isTwoFactorEnabled && (

                        <form
                            onSubmit={
                                handleDisable2FA
                            }
                            className="
                            mt-8
                        "
                        >

                            <p
                                className="
                                font-semibold
                                text-green-600
                            "
                            >
                                2FA is enabled
                            </p>

                            <input
                                value={
                                    disableCode
                                }
                                onChange={(
                                    event
                                ) => {

                                    setDisableCode(
                                        event
                                            .target
                                            .value
                                    );

                                }}
                                placeholder="
                                Authenticator code
                            "
                                className="
                                mt-5
                                w-full
                                rounded-lg
                                border
                                p-3
                            "
                            />

                            <button
                                className="
                                mt-4
                                w-full
                                rounded-lg
                                bg-red-600
                                p-3
                                text-white
                            "
                            >
                                Disable 2FA
                            </button>

                        </form>

                    )}

            </div>

        </main>
    );
}

export default Settings;