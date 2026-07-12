import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import AuthPage
  from "./pages/AuthPage";

import Dashboard
  from "./pages/Dashboard";

import Settings
  from "./pages/Settings";

import ResetPassword
  from "./pages/ResetPassword";

import Profile
  from "./pages/Profile";

import Product
  from "./pages/Product";

import {
  ProtectedRoute,
} from "./components/ProtectedRoute.jsx";

import CustomerLayout
  from "./layouts/CustomerLayout.jsx";

import {
  useAuth,
} from "./context/AuthContext.jsx";


function HomeRoute() {
  const {
    user,
    authLoading,
  } = useAuth();

  if (authLoading) {
    return (
      <div
        className="
          flex
          min-h-screen
          items-center
          justify-center
          bg-slate-100
        "
      >

        <p
          className="
            text-lg
            font-medium
            text-slate-600
          "
        >
          Checking authentication...
        </p>

      </div>
    );
  }

  if (user) {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  return (
    <AuthPage />
  );
}


function App() {
  return (
    <Routes>

      <Route
        path="/"
        element={
          <HomeRoute />
        }
      />

      <Route
        element={
          <ProtectedRoute>
            <CustomerLayout />
          </ProtectedRoute>
        }
      >

        <Route
          path="/dashboard"
          element={
            <Dashboard />
          }
        />

        <Route
          path="/settings"
          element={
            <Settings />
          }
        />

        <Route
          path="/profile"
          element={
            <Profile />
          }
        />

        <Route
          path="/product/:productId"
          element={
            <Product />
          }
        />

      </Route>

      <Route
        path="/reset-password/:resetToken"
        element={
          <ResetPassword />
        }
      />

      <Route
        path="*"
        element={
          <Navigate
            to="/"
            replace
          />
        }
      />

    </Routes>
  );
}

export default App;