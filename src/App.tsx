import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

// Feature imports
import GreenLane from "./features/green-lane";
import LocalHarvest from "./features/local-harvest";
import AirBuddy from "./features/air-buddy";
import Wasteless from "./features/wasteless";
import GreenCommunity from "./features/green-community";
import EcoFestivals from "./features/eco-festivals";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="green-horizon-theme">
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              
              {/* Protected routes */}
              <Route path="/" element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/green-lane" element={
                <ProtectedRoute>
                  <GreenLane />
                </ProtectedRoute>
              } />
              <Route path="/local-harvest" element={
                <ProtectedRoute>
                  <LocalHarvest />
                </ProtectedRoute>
              } />
              <Route path="/air-buddy" element={
                <ProtectedRoute>
                  <AirBuddy />
                </ProtectedRoute>
              } />
              <Route path="/wasteless" element={
                <ProtectedRoute>
                  <Wasteless />
                </ProtectedRoute>
              } />
              <Route path="/community" element={
                <ProtectedRoute>
                  <GreenCommunity />
                </ProtectedRoute>
              } />
              <Route path="/eco-festivals" element={
                <ProtectedRoute>
                  <EcoFestivals />
                </ProtectedRoute>
              } />
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
