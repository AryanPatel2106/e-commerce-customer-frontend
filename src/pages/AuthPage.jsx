import { useState } from "react";

import Login from "../components/Login";

import Register from "../components/Register";

import VerifyOTP from "../components/VerifyOTP";

import Verify2FA from "../components/Verify2FA";

import ForgotPasswordRequest from "../components/ForgotPasswordRequest";

function AuthPage() {
  const [screen, setScreen] = useState("login");

  const [verificationEmail, setVerificationEmail] = useState("");

  const [twoFactorUserId, setTwoFactorUserId] = useState("");

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="mx-auto w-full max-w-2xl">
        <div className="mb-7 text-center">
          <h1 className="text-3xl font-bold text-slate-900">Omnicart</h1>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-lg sm:p-8">
          {(screen === "login" || screen === "register") && (
            <div className="mb-8 grid grid-cols-2 rounded-xl bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => {
                  setScreen("login");
                }}
                className={`rounded-lg px-4 py-3 font-semibold ${
                  screen === "login"
                    ? "bg-blue-600 text-white"
                    : "text-slate-600"
                } `}
              >
                Login
              </button>

              <button
                type="button"
                onClick={() => {
                  setScreen("register");
                }}
                className={`rounded-lg px-4 py-3 font-semibold ${
                  screen === "register"
                    ? "bg-blue-600 text-white"
                    : "text-slate-600"
                } `}
              >
                Register
              </button>
            </div>
          )}

          {screen === "login" && (
            <Login
              setScreen={setScreen}
              setVerificationEmail={setVerificationEmail}
              setTwoFactorUserId={setTwoFactorUserId}
            />
          )}

          {screen === "register" && (
            <Register
              setScreen={setScreen}
              setVerificationEmail={setVerificationEmail}
            />
          )}

          {screen === "verifyOTP" && (
            <VerifyOTP email={verificationEmail} setScreen={setScreen} />
          )}

          {screen === "verify2FA" && (
            <Verify2FA userId={twoFactorUserId} setScreen={setScreen} />
          )}

          {screen === "forgotPasswordRequest" && (
            <ForgotPasswordRequest setScreen={setScreen} />
          )}
        </div>
      </div>
    </main>
  );
}

export default AuthPage;
