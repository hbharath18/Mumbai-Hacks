import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import UploadStatement from "./pages/UploadStatement";
import Rewards from "./pages/Rewards";
import SignIn from "./pages/SignIn";
import Navbar from "./components/Navbar";
import { getCurrentUser } from "./lib/auth";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route
              path="/dashboard"
              element={
                getCurrentUser() ? (
                  <>
                    <Navbar />
                    <Dashboard />
                  </>
                ) : (
                  <Navigate to="/signin" replace />
                )
              }
            />
            <Route
              path="/upload"
              element={
                getCurrentUser() ? (
                  <>
                    <Navbar />
                    <UploadStatement />
                  </>
                ) : (
                  <Navigate to="/signin" replace />
                )
              }
            />
            <Route
              path="/rewards"
              element={
                getCurrentUser() ? (
                  <>
                    <Navbar />
                    <Rewards />
                  </>
                ) : (
                  <Navigate to="/signin" replace />
                )
              }
            />
            <Route path="/features" element={<div>Features Page (TODO)</div>} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="*" element={<Navigate to="/signin" replace />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
  
  export default App;
