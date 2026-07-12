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

function Verify2FA({
    userId,
}) {
    const [
        code,
        setCode,
    ] = useState("");

    const navigate =
        useNavigate();

    const {
        setUser,
    } = useAuth();

    const handleVerify =
        async (
            event
        ) => {

        event.preventDefault();

        const response =
            await api.post(

                "/auth/verify-2fa-login",

                {
                    userId,

                    code,
                }

            );

        setUser(

            response
                .data
                .data
                .user

        );

        navigate(

            "/dashboard"

        );
    };

    return (
        <form
            onSubmit={
                handleVerify
            }
        >

            <h2>
                Verify 2FA
            </h2>

            <input

                value={
                    code
                }

                onChange={(
                    event
                ) => {

                    setCode(

                        event
                            .target
                            .value

                    );

                }}

                className="
                    mt-5
                    w-full
                    border
                    p-3
                "

            />

            <button
                className="
                    mt-4
                    w-full
                    bg-blue-600
                    p-3
                    text-white
                "
            >
                Verify
            </button>

        </form>
    );
}

export default Verify2FA;