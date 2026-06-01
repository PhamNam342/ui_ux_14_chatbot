import { Navigate, Route, Routes } from 'react-router-dom'
import { RoleSelect } from './pages/RoleSelect.jsx'
import { Login } from './pages/Login.jsx'
import { PatientRegister } from './pages/PatientRegister.jsx'
import { AdminClinics } from './pages/admin/AdminClinics.jsx'
import { AdminDashboard } from './pages/admin/AdminDashboard.jsx'
import { AdminRevenue } from './pages/admin/AdminRevenue.jsx'
import { AdminSchedule } from './pages/admin/AdminSchedule.jsx'
import { AdminQuality } from './pages/admin/AdminQuality.jsx'
import { AdminServicePricing } from './pages/admin/AdminServicePricing.jsx'
import { AdminDoctorDetail } from './pages/admin/AdminDoctorDetail.jsx'
import { AdminDoctorSchedule } from './pages/admin/AdminDoctorSchedule.jsx'
import { DoctorDashboard } from './pages/doctor/DoctorDashboard.jsx'
import { DoctorConsult } from './pages/doctor/DoctorConsult.jsx'
import { DoctorConsultChat } from './pages/doctor/DoctorConsultChat.jsx'
import { DoctorDetail } from './pages/doctor/DoctorDetail.jsx'
import { DoctorMedicine } from './pages/doctor/DoctorMedicine.jsx'
import { DoctorSchedule } from './pages/doctor/DoctorSchedule.jsx'
import { DoctorHistory } from './pages/doctor/DoctorHistory.jsx'
import { AdvisorDataList } from './pages/advisor/AdvisorDataList.jsx'
import { AdvisorForm } from './pages/advisor/AdvisorForm.jsx'
import { AdvisorChatbot } from './pages/advisor/AdvisorChatbot.jsx'
import { AdvisorConversation } from './pages/advisor/AdvisorConversation.jsx'
import { AdvisorImport } from './pages/advisor/AdvisorImport.jsx'
import { PatientDashboard } from './pages/patient/PatientDashboard.jsx'
import { PatientBooking } from './pages/patient/PatientBooking.jsx'
import { PatientChatbot } from './pages/patient/PatientChatbot.jsx'
import { PatientConsult } from './pages/patient/PatientConsult.jsx'
import { PatientConsultChat } from './pages/patient/PatientConsultChat.jsx'
import { PatientRecords } from './pages/patient/PatientRecords.jsx'
import { PatientHistory } from './pages/patient/PatientHistory.jsx'
import { PatientSettings } from './pages/patient/PatientSettings.jsx'
import { PatientAppointments } from './pages/patient/PatientAppointments.jsx'
import { PatientBilling } from './pages/patient/PatientBilling.jsx'
import { PatientServices } from './pages/patient/PatientServices.jsx'
import { DoctorSettings } from './pages/doctor/DoctorSettings.jsx'
import { AdvisorSettings } from './pages/advisor/AdvisorSettings.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<RoleSelect />} />
      <Route path="/login/:role" element={<Login />} />
      <Route path="/register/patient" element={<PatientRegister />} />

      <Route path="/admin" element={<AdminClinics />} />
      <Route path="/admin/doctors" element={<AdminDashboard />} />
      <Route path="/admin/doctors/:id" element={<AdminDoctorDetail />} />
      <Route path="/admin/doctors/:id/schedule" element={<AdminDoctorSchedule />} />
      <Route path="/admin/schedule" element={<AdminSchedule />} />
      <Route path="/admin/schedule/new" element={<AdminSchedule showModal />} />
      <Route path="/admin/revenue" element={<AdminRevenue />} />
      <Route path="/admin/quality" element={<AdminQuality />} />
      <Route path="/admin/service-pricing" element={<AdminServicePricing />} />

      <Route path="/doctor" element={<DoctorDashboard />} />
      <Route path="/doctor/cases" element={<DoctorDashboard />} />
      <Route path="/doctor/cases/:id" element={<DoctorDetail />} />
      <Route path="/doctor/patients" element={<DoctorDetail />} />
      <Route path="/doctor/patients/:id" element={<DoctorDetail />} />
      <Route path="/doctor/consult" element={<DoctorConsult />} />
      <Route path="/doctor/consult/chat/:id" element={<DoctorConsultChat />} />
      <Route path="/doctor/medicine" element={<DoctorMedicine />} />
      <Route path="/doctor/schedule" element={<DoctorSchedule />} />
      <Route path="/doctor/history" element={<DoctorHistory />} />
      <Route path="/doctor/settings" element={<DoctorSettings />} />

      <Route path="/advisor" element={<AdvisorDataList />} />
      <Route path="/advisor/data" element={<AdvisorDataList />} />
      <Route path="/advisor/input" element={<AdvisorForm />} />
      <Route path="/advisor/import" element={<AdvisorImport />} />
      <Route path="/advisor/chatbot" element={<AdvisorChatbot />} />
      <Route path="/advisor/conversation" element={<AdvisorConversation />} />
      <Route path="/advisor/settings" element={<AdvisorSettings />} />

      <Route path="/patient" element={<PatientDashboard />} />
      <Route path="/patient/booking" element={<PatientBooking />} />
      <Route path="/patient/appointments" element={<PatientAppointments />} />
      <Route path="/patient/billing" element={<PatientBilling />} />
      <Route path="/patient/services" element={<PatientServices />} />
      <Route path="/patient/chat" element={<PatientChatbot />} />
      <Route path="/patient/consult" element={<PatientConsult />} />
      <Route path="/patient/consult/chat/:id" element={<PatientConsultChat />} />
      <Route path="/patient/records" element={<PatientRecords />} />
      <Route path="/patient/history" element={<PatientHistory />} />
      <Route path="/patient/settings" element={<PatientSettings />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
