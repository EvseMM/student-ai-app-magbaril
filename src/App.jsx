import { BrowserRouter, Route, Routes } from "react-router";
import LandingPage from "./pages/LandingPage";
import StudentPage from "./pages/StudentPage";
import SubjectPage from "./pages/SubjectPage";
import GradePage from "./pages/GradePage";
import { Toaster } from "react-hot-toast";


export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/students" element={<StudentPage />} />
                <Route path="/subjects" element={<SubjectPage />} />
                <Route path="/grades" element={<GradePage />} />
            </Routes>
            <Toaster />
            </BrowserRouter>
    );
}