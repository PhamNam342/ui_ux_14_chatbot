import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Baby, Brain, Building2, CalendarDays, ChevronDown, Clock, HeartPulse, Lock, MapPin, Menu, MessageCircle, MessageCircleHeart, Microscope, Phone, Shield, Star, Stethoscope, Syringe, X } from 'lucide-react'
import { Logo } from '../components/ui.jsx'
import heroImage from '../assets/medical-ai-hero.png'
import doctorMinh from '../assets/doctor_minh.png'
import doctorHoa from '../assets/doctor_hoa.png'
import doctorAnh from '../assets/doctor_anh.png'
import doctorLan from '../assets/doctor_lan.png'

const services = [
  { title: 'Tim mạch', desc: 'Tư vấn huyết áp, nhịp tim, dấu hiệu hồi hộp và theo dõi nguy cơ.', price: '350.000đ', icon: HeartPulse, tone: 'bg-rose-200', iconBg: 'bg-rose-50 text-rose-600', ring: 'hover:border-rose-200' },
  { title: 'Nhi khoa', desc: 'Theo dõi sức khỏe trẻ em, lịch tiêm chủng và tư vấn ban đầu.', price: '220.000đ', icon: Baby, tone: 'bg-sky-200', iconBg: 'bg-sky-50 text-sky-700', ring: 'hover:border-sky-200' },
  { title: 'Thần kinh', desc: 'Đau đầu, chóng mặt, rối loạn giấc ngủ và căng thẳng kéo dài.', price: '300.000đ', icon: Brain, tone: 'bg-violet-200', iconBg: 'bg-violet-50 text-violet-700', ring: 'hover:border-violet-200' },
  { title: 'Xét nghiệm', desc: 'Đọc kết quả máu, nước tiểu, sinh hóa tổng quát và chuyên sâu.', price: 'từ 150.000đ', icon: Microscope, tone: 'bg-emerald-200', iconBg: 'bg-emerald-50 text-emerald-700', ring: 'hover:border-emerald-200' },
  { title: 'Tiêm chủng', desc: 'Vaccine theo lịch khuyến nghị cho từng độ tuổi và nhóm nguy cơ.', price: 'theo vaccine', icon: Syringe, tone: 'bg-amber-200', iconBg: 'bg-amber-50 text-amber-700', ring: 'hover:border-amber-200' },
  { title: 'Tổng quát', desc: 'Khám sức khỏe định kỳ, tư vấn triệu chứng và định hướng chuyên khoa.', price: '200.000đ', icon: Stethoscope, tone: 'bg-teal-200', iconBg: 'bg-teal-50 text-teal-800', ring: 'hover:border-teal-200' },
]

const steps = [
  ['01', 'Khảo sát triệu chứng', 'Bệnh nhân trả lời nhanh các câu hỏi ban đầu để hệ thống hiểu bối cảnh.'],
  ['02', 'Gợi ý chuyên khoa', 'AI hỗ trợ phân nhóm triệu chứng và đề xuất hướng đặt lịch phù hợp.'],
  ['03', 'Bác sĩ tiếp nhận', 'Thông tin được chuyển vào đúng không gian làm việc để bác sĩ tư vấn hiệu quả hơn.'],
]

const stats = [
  ['4', 'Không gian làm việc', 'bg-teal-200', 'bg-teal-50 text-teal-800'],
  ['24/7', 'Trợ lý AI hỗ trợ', 'bg-sky-200', 'bg-sky-50 text-sky-800'],
  ['6+', 'Nhóm dịch vụ y tế', 'bg-emerald-200', 'bg-emerald-50 text-emerald-800'],
  ['1', 'Hồ sơ sức khỏe thống nhất', 'bg-violet-200', 'bg-violet-50 text-violet-800'],
]

const navItems = [
  ['Trang chủ', 'home'],
  ['Bác sĩ', 'doctors'],
  ['Chuyên khoa', 'specialties'],
  ['Cơ sở y tế', 'clinics'],
  ['Đánh giá', 'reviews'],
  ['Hỏi đáp', 'faq'],
  ['Liên hệ', 'contact'],
]

const featuredDoctors = [
  ['NM', 'BS. Nguyễn Văn Minh', 'Nội tổng quát', '8 năm kinh nghiệm', 'bg-teal-100 text-teal-800', '4.9', '1.240 lượt tư vấn', 'Đang trực tuyến', doctorMinh],
  ['TH', 'BS. Trần Thị Hoa', 'Tim mạch', '10 năm kinh nghiệm', 'bg-rose-100 text-rose-700', '4.8', '980 lượt tư vấn', 'Có lịch hôm nay', doctorHoa],
  ['LA', 'BS. Lê Quốc Anh', 'Tai Mũi Họng', '6 năm kinh nghiệm', 'bg-sky-100 text-sky-700', '4.7', '760 lượt tư vấn', 'Đang trực tuyến', doctorAnh],
  ['NL', 'BS. Phạm Ngọc Lan', 'Da liễu', '7 năm kinh nghiệm', 'bg-violet-100 text-violet-700', '4.9', '1.100 lượt tư vấn', 'Có lịch hôm nay', doctorLan],
]

const clinics = [
  ['Phòng khám Đa khoa Tâm An', '12 Võ Văn Tần, Quận 3', '1.2 km', '4.8'],
  ['Phòng khám Tim mạch An Bình', '81 Điện Biên Phủ, Bình Thạnh', '2.4 km', '4.9'],
  ['MedCare Family Clinic', '44 Nguyễn Thị Minh Khai, Quận 1', '3.1 km', '4.7'],
]

const reviews = [
  ['MA', 'Nguyễn Minh Anh', 'Đặt lịch rất nhanh, bác sĩ tư vấn kỹ và hồ sơ sau khám dễ theo dõi.', 'Khám Tim mạch'],
  ['HL', 'Hoàng Lan', 'Giao diện rõ ràng, nhân viên hỗ trợ nhẹ nhàng và lịch hẹn đúng giờ.', 'Khám Nhi khoa'],
  ['QT', 'Quang Tuấn', 'Phần tư vấn ban đầu giúp tôi chọn đúng chuyên khoa trước khi đến khám.', 'Tư vấn trực tuyến'],
]

const faqs = [
  ['Tôi có thể đặt lịch khám như thế nào?', 'Bạn đăng nhập tài khoản bệnh nhân, chọn cơ sở y tế, chuyên khoa, bác sĩ và khung giờ còn trống. Hệ thống sẽ xác nhận ngay sau khi hoàn tất.'],
  ['Thông tin sức khỏe có được bảo mật không?', 'MedConsult mã hóa dữ liệu sức khỏe và chỉ chia sẻ thông tin cần thiết cho bác sĩ tiếp nhận lịch hẹn của bạn.'],
  ['Tôi có thể đổi lịch sau khi đã đặt không?', 'Bạn có thể quản lý lịch hẹn trong tài khoản và chọn đổi lịch nếu ca khám chưa bắt đầu.'],
]

export function RoleSelect() {
  const [activeSection, setActiveSection] = useState('home')
  const [scrolled, setScrolled] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [openFaq, setOpenFaq] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12)
    const observer = new IntersectionObserver((entries) => {
      const visibleSection = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]

      if (visibleSection) setActiveSection(visibleSection.target.id)
    }, { rootMargin: '-24% 0px -58%', threshold: [0.05, 0.2, 0.5] })

    handleScroll()
    window.addEventListener('scroll', handleScroll)
    navItems.forEach(([, id]) => {
      const section = document.getElementById(id)
      if (section) observer.observe(section)
    })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      observer.disconnect()
    }
  }, [])

  function scrollToSection(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setDrawerOpen(false)
  }

  return (
    <main className="min-h-screen bg-[#f8fafc] text-slate-900">
      <section id="home" className="landing-anchor relative min-h-[680px] overflow-hidden">
        <img src={heroImage} alt="Bác sĩ tư vấn cùng trợ lý AI y tế" className="absolute inset-0 h-full w-full object-cover object-center motion-safe:animate-[heroFloat_16s_ease-in-out_infinite]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(248,250,252,0.98)_0%,rgba(248,250,252,0.88)_35%,rgba(248,250,252,0.24)_72%,rgba(248,250,252,0)_100%)]" />

        <nav className={`landing-navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="landing-navbar-inner">
          <button className="landing-logo-button" type="button" onClick={() => scrollToSection('home')} aria-label="Về trang chủ">
            <Logo />
          </button>

          <div className="landing-nav-menu">
            {navItems.map(([label, id]) => id === 'doctors' ? (
              <div className="landing-nav-doctors" key={id}>
                <button className={`landing-nav-link ${activeSection === id ? 'active' : ''}`} type="button" onClick={() => scrollToSection(id)}>
                  {label} <ChevronDown size={15} />
                </button>
                <div className="landing-doctor-mega">
                  <div className="landing-mega-heading">
                    <div>
                      <span>Đội ngũ chuyên môn</span>
                      <h3>Chọn bác sĩ theo chuyên khoa</h3>
                    </div>
                    <button type="button" onClick={() => scrollToSection('doctors')}>Xem tất cả <ArrowRight size={15} /></button>
                  </div>
                  <div className="landing-mega-grid">
                    {featuredDoctors.map(([initials, name, specialty, experience, tone]) => (
                      <button key={name} type="button" onClick={() => scrollToSection('doctors')}>
                        <span className={tone}>{initials}</span>
                        <span><b>{specialty}</b><small>{name} · {experience}</small></span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <button key={id} className={`landing-nav-link ${activeSection === id ? 'active' : ''}`} type="button" onClick={() => scrollToSection(id)}>{label}</button>
            ))}
          </div>

          <div className="landing-nav-actions">
            <Link className="landing-login-button" to="/login/patient">Đăng nhập</Link>
            <Link className="landing-book-button" to="/login/patient"><CalendarDays size={17} /> Đặt lịch khám</Link>
            <button className="landing-menu-toggle" type="button" onClick={() => setDrawerOpen(true)} aria-label="Mở menu"><Menu size={22} /></button>
          </div>
        </div>
        </nav>

        {drawerOpen && (
          <div className="landing-mobile-overlay" role="presentation" onClick={() => setDrawerOpen(false)}>
            <aside className="landing-mobile-drawer" onClick={(event) => event.stopPropagation()}>
              <div className="landing-drawer-header">
                <Logo />
                <button type="button" onClick={() => setDrawerOpen(false)} aria-label="Đóng menu"><X size={21} /></button>
              </div>
              <div className="landing-drawer-links">
                {navItems.map(([label, id]) => (
                  <button key={id} className={activeSection === id ? 'active' : ''} type="button" onClick={() => scrollToSection(id)}>
                    {label} <ArrowRight size={16} />
                  </button>
                ))}
              </div>
              <div className="landing-drawer-actions">
                <Link to="/login/patient">Đăng nhập</Link>
                <Link to="/login/patient"><CalendarDays size={17} /> Đặt lịch khám</Link>
              </div>
            </aside>
          </div>
        )}

        <div className="relative mx-auto flex min-h-[680px] max-w-7xl flex-col px-5 pb-6 pt-28 sm:px-8">
          <div className="flex flex-1 items-center py-12">
            <div className="max-w-2xl motion-safe:animate-[fadeUp_.7s_ease-out_both]">
              <p className="text-sm font-extrabold uppercase tracking-[0.22em] text-teal-700">Trợ lý AI y tế</p>
              <h1 className="mt-4 text-4xl font-black leading-[1.05] tracking-normal text-slate-950 sm:text-6xl">
                Tư vấn sức khỏe nhanh, rõ và đúng vai trò
              </h1>
              <p className="mt-5 max-w-xl text-base leading-8 text-slate-700 sm:text-lg">
                MedConsult kết nối bệnh nhân, bác sĩ, cố vấn dữ liệu và quản trị phòng khám trong một nền tảng tư vấn trực tuyến thống nhất.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/login/patient" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-teal-800 px-6 text-sm font-extrabold text-white shadow-lg shadow-teal-900/20 transition duration-200 hover:-translate-y-0.5 hover:bg-teal-900 hover:shadow-xl hover:shadow-teal-900/25">
                  Đăng nhập <ArrowRight size={18} />
                </Link>
                <Link to="/login/doctor" className="inline-flex min-h-12 items-center justify-center rounded-lg border border-slate-300 bg-white/80 px-6 text-sm font-extrabold text-slate-800 shadow-sm backdrop-blur transition duration-200 hover:-translate-y-0.5 hover:border-teal-300 hover:bg-white hover:text-teal-800 hover:shadow-lg">
                  Không gian bác sĩ
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <section id="doctors" className="landing-anchor">
          <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-teal-700">Bác sĩ chuyên khoa</p>
              <h2 className="mt-2 text-3xl font-black text-slate-950">Đội ngũ bác sĩ chuyên môn</h2>
            </div>
            <p className="max-w-xl text-base leading-7 text-slate-600">Kết nối với các bác sĩ giàu kinh nghiệm trong nhiều chuyên khoa khác nhau.</p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {featuredDoctors.map(([initials, name, specialty, experience, tone, rating, consultations, status, img]) => (
              <article key={name} className="landing-doctor-card">
                <div className="landing-doctor-photo">
                  <img src={img} alt={name} />
                  <span className={status === 'Đang trực tuyến' ? 'online' : 'available'}>{status}</span>
                </div>
                <div className="landing-doctor-info">
                  <span className={`landing-card-avatar ${tone}`}>{initials}</span>
                  <h3>{name}</h3>
                  <p>{specialty}</p>
                  <small>{experience}</small>
                  <div className="landing-doctor-meta">
                    <span className="landing-rating"><Star size={14} fill="currentColor" /> {rating}</span>
                    <span>{consultations}</span>
                  </div>
                  <div className="landing-doctor-actions">
                    <Link to="/login/patient">Xem hồ sơ</Link>
                    <Link to="/login/patient"><CalendarDays size={15} /> Đặt lịch</Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-20 grid gap-4 md:grid-cols-4">
          {stats.map(([value, label, stripe, badge]) => (
            <div key={label} className="group overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition duration-300 motion-safe:animate-[fadeUp_.7s_ease-out_both] hover:-translate-y-1 hover:shadow-xl">
              <div className={`h-1.5 ${stripe}`} />
              <div className="p-6">
                <strong className={`inline-flex min-h-14 min-w-18 items-center justify-center rounded-lg px-3 text-4xl font-black ${badge}`}>{value}</strong>
                <span className="mt-4 block text-sm font-extrabold uppercase tracking-[0.12em] text-slate-600 transition group-hover:text-slate-900">{label}</span>
              </div>
            </div>
          ))}
        </section>

        <section id="specialties" className="landing-anchor">
          <div className="mb-6 mt-20 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-teal-700">Dịch vụ nổi bật</p>
              <h2 className="mt-2 text-3xl font-black text-slate-950">Chăm sóc sức khỏe theo nhu cầu</h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-slate-600">Các nhóm tư vấn phổ biến được đồng bộ với lịch khám, hồ sơ và dữ liệu chatbot.</p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {services.map((service) => (
              <Link key={service.title} to="/login/patient" className={`group overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition duration-300 motion-safe:animate-[fadeUp_.7s_ease-out_both] hover:-translate-y-1 ${service.ring} hover:shadow-xl`}>
                <div className={`h-1.5 ${service.tone}`} />
                <div className="p-7">
                <div className={`grid h-14 w-14 place-items-center rounded-lg transition duration-300 group-hover:-translate-y-0.5 ${service.iconBg}`}>
                  <service.icon size={25} strokeWidth={2.4} />
                </div>
                <h3 className="mt-7 text-2xl font-black text-slate-900">{service.title}</h3>
                <p className="mt-4 min-h-[56px] text-base leading-7 text-slate-500">{service.desc}</p>
                <div className="mt-7 flex items-center justify-between">
                  <strong className="text-xl font-black text-teal-800">{service.price}</strong>
                  <ArrowRight className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-teal-800" size={22} />
                </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section id="clinics" className="landing-anchor mt-20">
          <div className="mb-7 max-w-3xl">
            <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-teal-700">Cơ sở y tế</p>
            <h2 className="mt-2 text-3xl font-black text-slate-950">Phòng khám gần bạn, thông tin minh bạch</h2>
            <p className="mt-3 text-base leading-7 text-slate-600">So sánh khoảng cách, đánh giá và địa chỉ trước khi chọn nơi khám phù hợp.</p>
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            {clinics.map(([name, address, distance, rating]) => (
              <article key={name} className="landing-clinic-card">
                <div className="landing-clinic-icon"><Building2 size={23} /></div>
                <span className="landing-distance"><MapPin size={14} /> {distance}</span>
                <h3>{name}</h3>
                <p>{address}</p>
                <div>
                  <span className="landing-rating"><Star size={14} fill="currentColor" /> {rating}</span>
                  <Link to="/login/patient">Đặt lịch <ArrowRight size={15} /></Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-20">
          <div className="max-w-3xl">
            <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-teal-700">Quy trình tư vấn</p>
            <h2 className="mt-2 text-3xl font-black leading-tight text-slate-950 sm:text-4xl">Từ triệu chứng ban đầu đến lịch tư vấn trong vài bước</h2>
          </div>
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {steps.map(([number, title, desc]) => (
              <div key={number} className="rounded-lg border border-slate-200 bg-[linear-gradient(145deg,#ffffff_0%,#f0fdfa_100%)] p-7 shadow-sm transition duration-300 motion-safe:animate-[fadeUp_.7s_ease-out_both] hover:-translate-y-1 hover:border-teal-200 hover:shadow-xl">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-teal-700 text-sm font-black uppercase tracking-[0.04em] text-white">{number}</span>
                <h3 className="mt-5 text-2xl font-black text-slate-950">{title}</h3>
                <p className="mt-4 text-base leading-7 text-slate-600">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-20 grid items-center gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <span className="inline-flex rounded-full bg-slate-200 px-5 py-2 text-sm font-extrabold uppercase tracking-[0.14em] text-teal-800">Trợ lý AI sức khỏe</span>
            <h2 className="mt-7 text-4xl font-black leading-tight text-slate-950">Khảo sát triệu chứng thông minh, phản hồi nhanh chóng</h2>
            <p className="mt-5 max-w-xl text-base leading-8 text-slate-600">
              Bệnh nhân nhập triệu chứng ban đầu, hệ thống gợi ý hướng xử lý và chuyển thông tin cho đúng không gian bác sĩ hoặc cố vấn dữ liệu.
            </p>
          </div>

          <div className="overflow-hidden rounded-lg border border-teal-900/10 bg-teal-800 shadow-2xl shadow-teal-900/18 motion-safe:animate-[fadeUp_.7s_ease-out_both]">
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5 text-white">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-white/18">
                  <MessageCircleHeart size={24} />
                </div>
                <div>
                  <h3 className="font-black">Trợ lý MedConsult</h3>
                  <p className="text-sm text-teal-50/75">Hỗ trợ khảo sát ban đầu</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-2 text-sm font-bold text-teal-50/80">
                <Shield size={16} /> Bảo mật
              </span>
            </div>
            <div className="space-y-4 bg-white p-6">
              <div className="max-w-[82%] rounded-lg bg-slate-100 p-4 text-sm leading-6 text-slate-600">Bạn đang gặp triệu chứng nào và kéo dài bao lâu?</div>
              <div className="ml-auto max-w-[78%] rounded-lg bg-teal-50 p-4 text-sm leading-6 text-teal-900">Tôi bị đau đầu, khó ngủ và mệt mỏi trong 3 ngày gần đây.</div>
              <div className="rounded-lg border border-teal-100 bg-white p-4 shadow-sm">
                <p className="text-sm font-extrabold text-slate-900">Gợi ý tiếp theo</p>
                <p className="mt-2 text-sm leading-6 text-slate-500">Theo dõi huyết áp, chọn chuyên khoa phù hợp và đặt lịch tư vấn nếu triệu chứng tiếp tục.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="reviews" className="landing-anchor mt-20">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-teal-700">Đánh giá người dùng</p>
            <h2 className="mt-2 text-3xl font-black text-slate-950">Trải nghiệm chăm sóc được tin tưởng</h2>
          </div>
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {reviews.map(([initials, name, text, context]) => (
              <article key={name} className="landing-review-card">
                <div className="landing-stars">{Array.from({ length: 5 }, (_, index) => <Star key={index} size={16} fill="currentColor" />)}</div>
                <p>“{text}”</p>
                <div><span>{initials}</span><div><b>{name}</b><small>{context}</small></div></div>
              </article>
            ))}
          </div>
        </section>

        <section id="faq" className="landing-anchor mt-20 grid gap-8 lg:grid-cols-[0.76fr_1.24fr]">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-teal-700">Hỏi đáp</p>
            <h2 className="mt-2 text-3xl font-black text-slate-950">Những điều bạn cần biết trước khi đặt lịch</h2>
            <p className="mt-4 text-base leading-7 text-slate-600">MedConsult giúp việc tìm bác sĩ và quản lý lịch khám trở nên dễ hiểu ngay từ lần đầu sử dụng.</p>
          </div>
          <div className="landing-faq-list">
            {faqs.map(([question, answer], index) => (
              <article key={question} className={openFaq === index ? 'open' : ''}>
                <button type="button" onClick={() => setOpenFaq(openFaq === index ? -1 : index)}>
                  {question} <ChevronDown size={19} />
                </button>
                {openFaq === index && <p>{answer}</p>}
              </article>
            ))}
          </div>
        </section>

        <section className="relative mt-20 overflow-hidden rounded-2xl bg-teal-800 px-6 py-12 text-center text-white shadow-2xl shadow-teal-900/20 sm:px-10">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.14),rgba(255,255,255,0)_46%,rgba(20,184,166,0.16))]" />
          <div className="relative mx-auto max-w-3xl">
            <h2 className="text-3xl font-black leading-tight sm:text-5xl">Bắt đầu tư vấn sức khỏe cùng MedConsult</h2>
            <p className="mt-4 text-base leading-8 text-teal-50/80">Đăng nhập để khảo sát triệu chứng, đặt lịch khám và theo dõi toàn bộ hồ sơ tư vấn của bạn.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link to="/login/patient" className="inline-flex min-h-13 items-center justify-center gap-2 rounded-lg bg-white px-6 text-sm font-black text-teal-900 shadow-lg transition hover:-translate-y-0.5 hover:bg-teal-50">
                <MessageCircle size={18} /> Tư vấn miễn phí
              </Link>
              <Link to="/login/patient" className="inline-flex min-h-13 items-center justify-center gap-2 rounded-lg border border-white/35 px-6 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-white/10">
                <CalendarDays size={18} /> Đặt lịch khám
              </Link>
            </div>
          </div>
        </section>
      </div>

      <footer id="contact" className="landing-anchor bg-[#17332d] text-white">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.2fr_0.8fr_0.8fr_1.1fr]">
            <div>
              <h2 className="text-3xl font-black">MedConsult</h2>
              <p className="mt-5 max-w-sm text-base leading-8 text-white/72">Hệ thống tư vấn y tế trực tuyến kết hợp trợ lý AI và đội ngũ bác sĩ chuyên nghiệp.</p>
              <p className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-white/70">
                <Lock size={17} /> Dữ liệu sức khỏe được bảo mật và mã hóa
              </p>
            </div>

            <div>
              <h3 className="text-lg font-black">Dịch vụ</h3>
              <div className="mt-5 space-y-3 text-base font-semibold text-white/70">
                <p>Nội khoa tổng quát</p>
                <p>Tim mạch</p>
                <p>Nhi khoa</p>
                <p>Xét nghiệm</p>
                <p>Tiêm chủng</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-black">Thông tin</h3>
              <div className="mt-5 space-y-3 text-base font-semibold text-white/70">
                <p>Về MedConsult</p>
                <p>Đội ngũ bác sĩ</p>
                <p>Cơ sở phòng khám</p>
                <p>Bảng giá</p>
                <p>Câu hỏi thường gặp</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-black">Liên hệ</h3>
              <div className="mt-5 space-y-4 text-base font-semibold text-white/75">
                <p className="flex items-center gap-3"><Phone size={18} /> 1800 6789 miễn phí</p>
                <p className="flex items-center gap-3"><Clock size={18} /> 07:00 - 21:00 hằng ngày</p>
                <p className="flex items-center gap-3"><MapPin size={18} /> 4 cơ sở tại TP.HCM</p>
              </div>
              <div className="mt-7 border-t border-white/12 pt-6">
                <h4 className="font-black">Chính sách</h4>
                <p className="mt-3 text-sm font-semibold text-white/65">Chính sách bảo mật dữ liệu</p>
                <p className="mt-2 text-sm font-semibold text-white/65">Điều khoản sử dụng</p>
                <p className="mt-2 text-sm font-semibold text-white/65">Chatbot không thay thế bác sĩ</p>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col gap-4 border-t border-white/12 pt-7 text-sm font-semibold text-white/70 sm:flex-row sm:items-center sm:justify-between">
            <p>© 2026 MedConsult. Bảo lưu mọi quyền.</p>
            <p className="text-amber-300">Chatbot không thay thế bác sĩ. Cấp cứu: gọi 115</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
