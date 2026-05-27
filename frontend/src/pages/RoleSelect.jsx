import { Link } from 'react-router-dom'
import { Button, Logo } from '../components/ui.jsx'

const roles = [
  { to: '/login/admin', title: 'Admin', desc: 'Quản trị phòng khám, bác sĩ, lịch khám và báo cáo.', accent: 'from-teal-500 to-emerald-400', glyph: 'A' },
  { to: '/login/doctor', title: 'Doctor', desc: 'Theo dõi ca bệnh, tư vấn trực tuyến và đơn thuốc.', accent: 'from-cyan-500 to-teal-500', glyph: 'D' },
  { to: '/login/advisor', title: 'Advisor', desc: 'Quản lý dữ liệu y khoa và kiểm thử chatbot chẩn đoán.', accent: 'from-emerald-500 to-lime-400', glyph: 'V' },
  { to: '/login/patient', title: 'Patient', desc: 'Đặt lịch khám, tư vấn trực tuyến và theo dõi toàn bộ lịch sử điều trị cá nhân.', accent: 'from-violet-500 to-fuchsia-400', glyph: 'P' },
]

export function RoleSelect() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#d9f8ef_0,#f8fafc_34%,#ffffff_100%)] px-5 py-8 text-slate-900">
      <div className="mx-auto flex min-h-[calc(100vh-64px)] max-w-7xl flex-col">
        <Logo />
        <section className="flex-1 flex flex-col justify-center py-12">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-teal-600">Không gian MedConsult</p>
            <h1 className="mt-4 text-4xl font-black tracking-normal sm:text-6xl">Chọn vai trò làm việc</h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-500">
              Kiến tạo giá trị khác biệt cùng Medical Chatbox, đồng bộ giữa quản trị, bác sĩ, cố vấn và bệnh nhân.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {roles.map((role) => (
              <Link key={role.title} to={role.to} className="group card overflow-hidden p-0 transition duration-300 hover:-translate-y-1 hover:shadow-xl">
                <div className={`h-2 bg-gradient-to-r ${role.accent}`} />
                <div className="p-7">
                  <div className={`grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br ${role.accent} text-2xl font-black text-white shadow-lg`}>
                    {role.glyph}
                  </div>
                  <h2 className="mt-6 text-2xl font-black">{role.title}</h2>
                  <p className="mt-3 min-h-[72px] text-sm leading-6 text-slate-500">{role.desc}</p>
                  <Button className="mt-6 w-full justify-center">Đăng nhập</Button>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}

