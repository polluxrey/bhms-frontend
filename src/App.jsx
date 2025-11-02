import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ConfigDataProvider } from "./context/configDataContext";
import useAuthRefresh from "./hooks/useAuthRefresh";

import Home from "./pages/Home/Home";
import PaymentForm from "./pages/Payments/PaymentForm";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import AppHeader from "./components/NavigationBar/AppHeader";

import BoarderPayments from "./pages/Payments/Payments";
import RequestForm from "./pages/Requests/RequestForm";
import ServiceRequests from "./pages/Requests/Requests";
import { AuthUserProvider } from "./context/authUserContext";
import AdminLayout from "./pages/Admin/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import BoardersList from "./pages/Admin/Boarders/BoardersList";
import BoarderDetails from "./pages/Admin/Boarders/BoarderDetails";
import BoardersPaymentsList from "./pages/Admin/Payments/BoardersPaymentsList";
import BoarderPaymentsList from "./pages/Admin/Payments/BoarderPaymentsList";
import PaymentDetails from "./pages/Admin/Payments/PaymentDetails";
import PublicRoute from "./components/ProtectedRoute/PublicRoute";

function App() {
  useAuthRefresh();

  return (
    <ConfigDataProvider>
      <AuthUserProvider>
        <BrowserRouter>
          <AppHeader />
          <>
            <Routes>
              <Route
                path="/"
                element={
                  <PublicRoute>
                    <Home />
                  </PublicRoute>
                }
              />
              <Route
                path="/pay"
                element={
                  <PublicRoute>
                    <PaymentForm />
                  </PublicRoute>
                }
              />
              <Route
                path="/payments"
                element={
                  <PublicRoute>
                    <BoarderPayments />
                  </PublicRoute>
                }
              />
              <Route
                path="/request"
                element={
                  <PublicRoute>
                    <RequestForm />
                  </PublicRoute>
                }
              />
              <Route
                path="/requests"
                element={
                  <PublicRoute>
                    <ServiceRequests />
                  </PublicRoute>
                }
              />

              {/* Protected admin routes */}
              <Route
                element={<ProtectedRoute allowedRoles={["admin", "owner"]} />}
              >
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<Navigate to="boarders" replace />} />
                  <Route path="boarders" element={<BoardersList />} />
                  <Route path="boarders/view" element={<BoarderDetails />} />
                  <Route path="payments" element={<BoardersPaymentsList />} />
                  <Route
                    path="payments/boarder/view-all"
                    element={<BoarderPaymentsList />}
                  />
                  <Route
                    path="payments/boarder/view"
                    element={<PaymentDetails />}
                  />
                  <Route path="requests" element={<AdminDashboard />} />
                </Route>
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </>
        </BrowserRouter>
      </AuthUserProvider>
    </ConfigDataProvider>
  );
}

export default App;
