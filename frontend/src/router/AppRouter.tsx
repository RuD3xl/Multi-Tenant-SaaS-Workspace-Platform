import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import DashboardLayout from "../pages/DashboardLayout.tsx";
import RegisterPage from "../pages/RegisterPage.tsx";
import ProjectsView from "../pages/ProjectsView.tsx";
import MembersView from "../pages/MembersView.tsx";

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate replace to="/login" />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/dashboard" element={<DashboardLayout />}>
                    <Route path=":slug/projects" element={<ProjectsView />} />
                    <Route path=":slug/members" element={<MembersView />} />
                </Route>
                <Route path="/register" element={<RegisterPage />}/>
            </Routes>
        </BrowserRouter>
    );
}