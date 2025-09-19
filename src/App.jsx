import { Routes, Route, useLocation } from 'react-router-dom';
import { Provider } from 'react-redux'
import store from './redux/store'
import LandingPage from './page/LandingPage';
import Login from './page/Login';
import Register from './page/Register';
import ProtectedRoute from './component/ProtectedRoute';
import Unauthorized from './page/Unauthorized';
import Contact from './page/Contact';
import NavComponent from './component/Nav';
import Features from './page/Features';
import AdminDashboardLayout from './component/admin/AdminDashboardLayout';
import TeacherDashboardLayout from './component/teacher/TeacherDashboardLayout';
import ParentDashboardLayout from './component/parent/ParentDashboardLayout';
import TeacherDashboard from './component/teacher/TeacherDashboard';
import ParentDashboard from './component/parent/ParentDashboard';
import ViewResults from './component/parent/ViewResults';
import Notifications from './component/parent/Notifications';
import MyClasses from './component/teacher/MyClasses';
import AddScores from './component/teacher/AddScores';
import GenerateResults from './component/teacher/GenerateResults';
import StatCard from './component/admin/statcard';
import MainArea from './component/admin/main-area';
import AddTeacher from './page/admin/add-teacher';
import ManageStudents from './component/admin/manage-students';
import ManageTeachers from './component/admin/manage-teachers';
import ManageParents from './component/admin/manage-parents';
import Reports from './page/admin/reports';
import ApprovePayment from './page/admin/approve-payment';
import BillingTable from './component/admin/BillingTable';
import Settings from './page/admin/settings';
import Profile from './page/Profile';
import AddPayment from './component/admin/modal/add-payment';
import Exams from './component/admin/exams';

import ParentNotifications from './component/parent/ParentNotifications';
import ParentPayments from './component/parent/ParentPayments';
import Messages from './component/parent/Messages';
import TeacherExams from './component/teacher/TeacherExams';
import Calendar from './components/Calendar/Calendar';


import './App.css';

function AppContent() {
  const location = useLocation();
  const isDashboardRoute = location.pathname.startsWith('/dashboard') || 
                          location.pathname.startsWith('/teacher-dashboard') || 
                          location.pathname.startsWith('/parent-dashboard');

  return (
    <>
      {/* Only show NavComponent for non-dashboard routes */}
      {!isDashboardRoute && <NavComponent />}
      
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/features" element={<Features />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
       

        {/* Admin Dashboard with nested routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<AdminDashboardLayout />}>
            <Route index element={<><StatCard /><AddPayment /><MainArea /></>} /> 
            <Route path="add-teachers" element={<AddTeacher />} />
            <Route path="students" element={<ManageStudents />} />
            <Route path="teachers" element={<ManageTeachers />} />
            <Route path="parents" element={<ManageParents />} />
            <Route path="billing" element={<BillingTable />} />
            <Route path="settings" element={<Settings />} />
            <Route path="exams" element={<Exams />} />
            <Route path="reports" element={<Reports />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path='profile' element={<Profile />} />
            <Route path="approve-payment" element={<ApprovePayment />} />
          </Route>
        </Route>

        {/* Teacher Dashboard with nested routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/teacher-dashboard" element={<TeacherDashboardLayout />}>
            <Route index element={<TeacherDashboard />} />
            <Route path="classes" element={<MyClasses />} />
            <Route path="exams" element={<TeacherExams />} />
            <Route path="add-scores" element={<AddScores />} />
            <Route path="add-ca" element={<AddScores />} />
            <Route path="generate-results" element={<GenerateResults />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path='profile' element={<Profile />} />
          </Route>
        </Route>

        {/* Parent Dashboard with nested routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/parent-dashboard" element={<ParentDashboardLayout />}>
            <Route index element={<ParentDashboard />} />
            <Route path="results" element={<ViewResults />} />
            <Route path="children/:childId/results" element={<ViewResults />} />
            <Route path="notifications" element={<ParentNotifications />} />
            <Route path="payments" element={<ParentPayments />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path='profile' element={<Profile />} />
            <Route path='messages' element={<Messages />} />
          </Route>
        </Route>
      </Routes>
    </>
  )
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  )
}

export default App
