import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Layout from "@/components/organisms/Layout";
import BrowsePage from "@/components/pages/BrowsePage";
import MapViewPage from "@/components/pages/MapViewPage";
import PropertyDetailPage from "@/components/pages/PropertyDetailPage";
import SavedPropertiesPage from "@/components/pages/SavedPropertiesPage";
import SavedSearchesPage from "@/components/pages/SavedSearchesPage";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<BrowsePage />} />
          <Route path="/map" element={<MapViewPage />} />
          <Route path="/property/:id" element={<PropertyDetailPage />} />
          <Route path="/saved-properties" element={<SavedPropertiesPage />} />
          <Route path="/saved-searches" element={<SavedSearchesPage />} />
        </Routes>
      </Layout>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        className="z-[9999]"
        toastClassName="shadow-card-hover"
      />
    </BrowserRouter>
  );
}

export default App;