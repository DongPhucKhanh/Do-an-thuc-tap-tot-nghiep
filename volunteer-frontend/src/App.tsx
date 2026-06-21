import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import ManageUsers from './pages/admin/ManageUsers';
// Khung Admin và các trang con
import AdminLayout from './layouts/AdminLayout';
import ManageRegistrations from './pages/admin/ManageRegistrations';
import CreateCampaign from './pages/admin/CreateCampaign';
import ManageCampaigns from './pages/admin/ManageCampaigns';
import AssignTasks from './pages/admin/AssignTasks';
import VolunteerHistory from './pages/admin/VolunteerHistory';
import ManageBanners from './pages/admin/ManageBanners';
import ManageCategories from './pages/admin/ManageCategories';
import ManageFaculties from './pages/admin/ManageFaculties';
import StudentActivities from './pages/admin/StudentActivities';
import AdminDashboard from './pages/admin/AdminDashboard';
import EvaluateVolunteers from './pages/admin/EvaluateVolunteers';
import ManagePosts from './pages/admin/ManagePosts';
import QRDonationManager from './pages/admin/QRDonationManager';
import ManageMoments from './pages/admin/ManageMoments';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* 👇 1. Đặt TRỰC TIẾP trang Login làm trang chủ mặc định */}
          <Route path="/" element={<Login />} />
          
          <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<ManageRegistrations />} /> {/* Mặc định vào /admin sẽ thấy Duyệt đơn */}
              <Route path="create" element={<CreateCampaign />} /> 
              <Route path="users" element={<ManageUsers />} />
              <Route path="campaigns" element={<ManageCampaigns />} />
              <Route path="assignments" element={<AssignTasks />} />
              <Route path="history" element={<VolunteerHistory />} />
              <Route path="banners" element={<ManageBanners />} />
              <Route path="categories" element={<ManageCategories />} />
              <Route path="faculties" element={<ManageFaculties />} />
              <Route path="evaluations" element={<EvaluateVolunteers />} />
              <Route path="/admin/student-activities" element={<StudentActivities />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="moments" element={<ManageMoments />} />
              <Route path="posts" element={<ManagePosts />} />
              <Route path="donations" element={<QRDonationManager />} />
          </Route>

          {/* 👇 3. Gõ đường dẫn sai -> Tự động quay về trang Login (gốc) */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;