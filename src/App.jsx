import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ConfigDataProvider } from "./context/configDataContext";

import Home from "./pages/Home/Home";
import PaymentForm from "./pages/Payments/PaymentForm";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Container from "react-bootstrap/Container";
import AppHeader from "./components/NavigationBar/AppHeader";
import BoarderPayments from "./pages/Payments/Payments";
import RequestForm from "./pages/Requests/RequestForm";
import ServiceRequests from "./pages/Requests/Requests";

function App() {
  return (
    <ConfigDataProvider>
      <BrowserRouter>
        <AppHeader />
        <Container fluid className="mb-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/pay" element={<PaymentForm />} />
            <Route path="/payments" element={<BoarderPayments />} />
            <Route path="/request" element={<RequestForm />} />
            <Route path="/requests" element={<ServiceRequests />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Container>
      </BrowserRouter>
    </ConfigDataProvider>
  );
}

export default App;
