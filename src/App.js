import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CampaignsPage from "./pages/CampaignsPage";
import PrivateRoute from "./components/PrivateRoute";
import TemplateBuilder from "./pages/TemplateBuilder";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Admin-only page */}
      <Route
        path="/campaigns"
        element={
          <PrivateRoute adminOnly={true}>
            <CampaignsPage />
          </PrivateRoute>
        }
      />

         {/* New Template Builder route */}
      <Route
        path="/templates/create"
        element={
          <PrivateRoute adminOnly={true}>
            <TemplateBuilder />
          </PrivateRoute>
        }
      />

      <Route path="/" element={<h1>Home Page</h1>} />
    </Routes>
  );
}

export default App;
