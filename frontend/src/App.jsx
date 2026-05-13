import { Navigate, Route, Routes } from 'react-router-dom'
import { RoleSelect } from './pages/RoleSelect.jsx'
import { AdminDashboard } from './pages/admin/AdminDashboard.jsx'
import { AdminRevenue } from './pages/admin/AdminRevenue.jsx'
import { AdminSchedule } from './pages/admin/AdminSchedule.jsx'
import { AdminQuality } from './pages/admin/AdminQuality.jsx'
import { AdminDoctorDetail } from './pages/admin/AdminDoctorDetail.jsx'
import { DoctorDashboard } from './pages/doctor/DoctorDashboard.jsx'
import { DoctorConsult } from './pages/doctor/DoctorConsult.jsx'
import { DoctorDetail } from './pages/doctor/DoctorDetail.jsx'
import { DoctorMedicine } from './pages/doctor/DoctorMedicine.jsx'
import { DoctorSchedule } from './pages/doctor/DoctorSchedule.jsx'
import { AdvisorDataList } from './pages/advisor/AdvisorDataList.jsx'
import { AdvisorForm } from './pages/advisor/AdvisorForm.jsx'
import { AdvisorChatbot } from './pages/advisor/AdvisorChatbot.jsx'
import { AdvisorConversation } from './pages/advisor/AdvisorConversation.jsx'
import { AdvisorImport } from './pages/advisor/AdvisorImport.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<RoleSelect />} />

      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/doctors" element={<AdminDashboard />} />
      <Route path="/admin/doctors/:id" element={<AdminDoctorDetail />} />
      <Route path="/admin/schedule" element={<AdminSchedule />} />
      <Route path="/admin/schedule/new" element={<AdminSchedule showModal />} />
      <Route path="/admin/revenue" element={<AdminRevenue />} />
      <Route path="/admin/quality" element={<AdminQuality />} />

      <Route path="/doctor" element={<DoctorDashboard />} />
      <Route path="/doctor/cases" element={<DoctorDashboard />} />
      <Route path="/doctor/cases/:id" element={<DoctorDetail />} />
      <Route path="/doctor/consult" element={<DoctorConsult />} />
      <Route path="/doctor/medicine" element={<DoctorMedicine />} />
      <Route path="/doctor/schedule" element={<DoctorSchedule />} />

      <Route path="/advisor" element={<AdvisorDataList />} />
      <Route path="/advisor/data" element={<AdvisorDataList />} />
      <Route path="/advisor/input" element={<AdvisorForm />} />
      <Route path="/advisor/import" element={<AdvisorImport />} />
      <Route path="/advisor/chatbot" element={<AdvisorChatbot />} />
      <Route path="/advisor/conversation" element={<AdvisorConversation />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
