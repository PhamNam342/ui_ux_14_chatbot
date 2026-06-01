import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  BadgeCheck,
  CalendarPlus,
  CheckCircle2,
  Clock3,
  HeartPulse,
  Microscope,
  ReceiptText,
  Search,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Syringe,
  X,
} from 'lucide-react'
import { Badge, Button, Card, TopBar, AppShell } from '../../components/ui.jsx'

const categories = [
  { label: 'Tất cả', icon: <ReceiptText size={15} /> },
  { label: 'Tổng quát', icon: <Stethoscope size={15} /> },
  { label: 'Tim mạch', icon: <HeartPulse size={15} /> },
  { label: 'Xét nghiệm', icon: <Microscope size={15} /> },
  { label: 'Tiêm chủng', icon: <Syringe size={15} /> },
]

const services = [
  {
    id: 'SV-01',
    name: 'Khám sức khỏe tổng quát',
    category: 'Tổng quát',
    type: 'Khám trực tiếp',
    description: 'Đánh giá sức khỏe toàn diện, tư vấn nguy cơ và định hướng theo dõi phù hợp.',
    detail: 'Gói khám giúp kiểm tra tổng quan thể trạng, phát hiện sớm các vấn đề thường gặp và nhận tư vấn chăm sóc sức khỏe cá nhân hóa.',
    price: 590000,
    oldPrice: 750000,
    duration: '60 - 90 phút',
    insurance: true,
    popular: true,
    featured: true,
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=300&q=80',
    hospitals: ['Phòng khám Đa khoa Tâm An', 'MedCare Family Clinic'],
    items: ['Khám nội tổng quát', 'Đo huyết áp và chỉ số cơ thể', 'Tư vấn kết quả và kế hoạch theo dõi'],
  },
  {
    id: 'SV-02',
    name: 'Tầm soát tim mạch chuyên sâu',
    category: 'Tim mạch',
    type: 'Gói tầm soát',
    description: 'Kiểm tra các yếu tố nguy cơ tim mạch và tư vấn cùng bác sĩ chuyên khoa.',
    detail: 'Gói tầm soát phù hợp với người có tiền sử tăng huyết áp, mỡ máu hoặc cần đánh giá nguy cơ bệnh lý tim mạch.',
    price: 1290000,
    oldPrice: 1550000,
    duration: '90 - 120 phút',
    insurance: true,
    popular: true,
    featured: true,
    image: 'https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?auto=format&fit=crop&w=300&q=80',
    hospitals: ['Phòng khám Tim mạch An Bình'],
    items: ['Khám tim mạch', 'Điện tâm đồ', 'Siêu âm tim', 'Tư vấn chuyên sâu cùng bác sĩ'],
  },
  {
    id: 'SV-03',
    name: 'Xét nghiệm máu cơ bản',
    category: 'Xét nghiệm',
    type: 'Xét nghiệm',
    description: 'Bộ xét nghiệm thường quy hỗ trợ đánh giá chức năng cơ thể và chuyển hóa.',
    detail: 'Thực hiện lấy mẫu nhanh, trả kết quả điện tử và giải thích chỉ số khi có nhu cầu tư vấn.',
    price: 420000,
    duration: '30 phút',
    insurance: true,
    popular: true,
    image: 'https://images.unsplash.com/photo-1579154204601-01588f35116f?auto=format&fit=crop&w=300&q=80',
    hospitals: ['Phòng khám Đa khoa Tâm An', 'MedCare Family Clinic'],
    items: ['Công thức máu', 'Đường huyết', 'Chức năng gan', 'Chức năng thận'],
  },
  {
    id: 'SV-04',
    name: 'Khám và tư vấn dinh dưỡng',
    category: 'Tổng quát',
    type: 'Tư vấn',
    description: 'Phân tích thói quen ăn uống và xây dựng kế hoạch dinh dưỡng cá nhân.',
    detail: 'Bác sĩ đánh giá chỉ số cơ thể, mục tiêu sức khỏe và hướng dẫn chế độ dinh dưỡng dễ áp dụng.',
    price: 320000,
    duration: '45 phút',
    insurance: false,
    hospitals: ['MedCare Family Clinic'],
    items: ['Đánh giá thể trạng', 'Phân tích khẩu phần', 'Kế hoạch dinh dưỡng cá nhân'],
  },
  {
    id: 'SV-05',
    name: 'Tiêm vaccine cúm mùa',
    category: 'Tiêm chủng',
    type: 'Tiêm chủng',
    description: 'Tiêm phòng cúm mùa với quy trình theo dõi sau tiêm an toàn.',
    detail: 'Dịch vụ bao gồm tư vấn trước tiêm, thực hiện tiêm và theo dõi phản ứng sau tiêm tại cơ sở.',
    price: 360000,
    oldPrice: 420000,
    duration: '30 phút',
    insurance: false,
    featured: true,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=300&q=80',
    hospitals: ['Phòng khám Đa khoa Tâm An'],
    items: ['Tư vấn sàng lọc', 'Vaccine cúm mùa', 'Theo dõi sau tiêm'],
  },
  {
    id: 'SV-06',
    name: 'Khám tim mạch định kỳ',
    category: 'Tim mạch',
    type: 'Khám trực tiếp',
    description: 'Theo dõi huyết áp, nhịp tim và các chỉ số sức khỏe tim mạch cơ bản.',
    detail: 'Khám định kỳ giúp theo dõi các chỉ số quan trọng và cập nhật hướng điều trị khi cần thiết.',
    price: 450000,
    duration: '45 - 60 phút',
    insurance: true,
    popular: true,
    hospitals: ['Phòng khám Tim mạch An Bình'],
    items: ['Khám cùng bác sĩ chuyên khoa', 'Đo huyết áp', 'Điện tâm đồ cơ bản', 'Tư vấn theo dõi'],
  },
  {
    id: 'SV-07',
    name: 'Xét nghiệm chức năng gan',
    category: 'Xét nghiệm',
    type: 'Xét nghiệm',
    description: 'Đánh giá các chỉ số men gan và tư vấn kết quả theo tình trạng sức khỏe.',
    detail: 'Gói xét nghiệm hỗ trợ kiểm tra hoạt động gan và phát hiện các thay đổi chỉ số cần theo dõi.',
    price: 280000,
    duration: '20 - 30 phút',
    insurance: true,
    hospitals: ['Phòng khám Đa khoa Tâm An'],
    items: ['AST', 'ALT', 'GGT', 'Bilirubin toàn phần'],
  },
  {
    id: 'SV-08',
    name: 'Tư vấn sức khỏe trực tuyến',
    category: 'Tổng quát',
    type: 'Tư vấn trực tuyến',
    description: 'Trao đổi cùng bác sĩ từ xa về triệu chứng và hướng chăm sóc ban đầu.',
    detail: 'Phù hợp khi cần hỏi nhanh bác sĩ, đọc kết quả hoặc được hướng dẫn trước khi đến cơ sở khám.',
    price: 180000,
    duration: '20 - 30 phút',
    insurance: false,
    popular: true,
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=300&q=80',
    hospitals: ['MedConsult Online'],
    items: ['Tư vấn video với bác sĩ', 'Tóm tắt nội dung tư vấn', 'Hướng dẫn chăm sóc ban đầu'],
  },
]

const priceRanges = [
  { label: 'Mọi mức giá', value: 'all' },
  { label: 'Dưới 500.000đ', value: 'under-500' },
  { label: '500.000đ - 1.000.000đ', value: '500-1000' },
  { label: 'Trên 1.000.000đ', value: 'over-1000' },
]

function formatPrice(value) {
  return `${value.toLocaleString('vi-VN')}đ`
}

function discount(service) {
  if (!service.oldPrice) return 0
  return Math.round((1 - service.price / service.oldPrice) * 100)
}

function ServiceCard({ service, onDetail, onBooking }) {
  return (
    <article className="medical-service-card">
      <div className="service-card-top">
        <span className="service-category-badge">{service.category}</span>
        {service.oldPrice && <Badge tone="yellow">Tiết kiệm {discount(service)}%</Badge>}
      </div>
      <h3>{service.name}</h3>
      <p>{service.description}</p>
      <div className="service-price-row">
        <strong>{formatPrice(service.price)}</strong>
        {service.oldPrice && <del>{formatPrice(service.oldPrice)}</del>}
      </div>
      <div className="service-card-meta">
        <span><Clock3 size={14} /> {service.duration}</span>
        <span className={service.insurance ? 'insured' : ''}><ShieldCheck size={14} /> {service.insurance ? 'Có hỗ trợ BHYT' : 'Không áp dụng BHYT'}</span>
      </div>
      <div className="service-card-actions">
        <Button variant="ghost" onClick={() => onDetail(service)}>Xem chi tiết</Button>
        <Button onClick={onBooking}><CalendarPlus size={15} /> Đặt lịch ngay</Button>
      </div>
    </article>
  )
}

function SkeletonCard() {
  return <div className="service-skeleton"><i /><b /><span /><span /><em /></div>
}

export function PatientServices() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('Tất cả')
  const [type, setType] = useState('Tất cả loại dịch vụ')
  const [priceRange, setPriceRange] = useState('all')
  const [insuranceOnly, setInsuranceOnly] = useState(false)
  const [selectedService, setSelectedService] = useState(null)

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 450)
    return () => window.clearTimeout(timer)
  }, [])

  const isFiltering = query.trim() !== '' || category !== 'Tất cả' || type !== 'Tất cả loại dịch vụ' || priceRange !== 'all' || insuranceOnly
  const filteredServices = useMemo(() => services.filter((service) => {
    const normalized = query.trim().toLowerCase()
    const matchesQuery = !normalized || `${service.name} ${service.description}`.toLowerCase().includes(normalized)
    const matchesCategory = category === 'Tất cả' || service.category === category
    const matchesType = type === 'Tất cả loại dịch vụ' || service.type === type
    const matchesInsurance = !insuranceOnly || service.insurance
    const matchesPrice = priceRange === 'all'
      || (priceRange === 'under-500' && service.price < 500000)
      || (priceRange === '500-1000' && service.price >= 500000 && service.price <= 1000000)
      || (priceRange === 'over-1000' && service.price > 1000000)
    return matchesQuery && matchesCategory && matchesType && matchesInsurance && matchesPrice
  }), [category, insuranceOnly, priceRange, query, type])

  const serviceTypes = ['Tất cả loại dịch vụ', ...new Set(services.map((service) => service.type))]

  return (
    <AppShell role="patient">
      <TopBar />
      <div className="content-wide service-page">
        <section className="service-hero app-page-hero">
          <div>
            <span><Sparkles size={15} /> Minh bạch chi phí, an tâm chăm sóc</span>
            <h1>Bảng giá dịch vụ</h1>
            <p>Tra cứu nhanh chi phí khám, xét nghiệm và gói chăm sóc sức khỏe phù hợp với nhu cầu của bạn.</p>
          </div>
          <ReceiptText size={86} />
        </section>

        <div className="service-stats">
          <Card><ReceiptText size={20} /><span><small>Tổng số dịch vụ</small><b>{services.length}</b></span></Card>
          <Card><Stethoscope size={20} /><span><small>Số chuyên khoa</small><b>{categories.length - 1}</b></span></Card>
          <Card><ShieldCheck size={20} /><span><small>Dịch vụ hỗ trợ BHYT</small><b>{services.filter((service) => service.insurance).length}</b></span></Card>
        </div>

        {!isFiltering && (
          <>
            <section className="service-section">
              <div className="service-section-head"><div><small>Dành cho bạn</small><h2>Gói dịch vụ nổi bật</h2></div><Sparkles size={20} /></div>
              <div className="featured-service-grid">
                {services.filter((service) => service.featured).map((service) => (
                  <button key={service.id} className="featured-service-card-with-image" onClick={() => setSelectedService(service)}>
                    {service.image && <img src={service.image} alt={service.name} className="featured-service-img" />}
                    <div style={{ padding: '14px' }}>
                      <span className="service-category-badge" style={{ display: 'inline-block', marginBottom: '8px' }}>{service.category}</span>
                      <h3 style={{ margin: '0 0 6px', fontSize: '15px', fontWeight: '800', color: '#1f2937' }}>{service.name}</h3>
                      <small style={{ color: '#e08c13', fontSize: '13px', fontWeight: '900' }}>Từ {formatPrice(service.price)}</small>
                    </div>
                  </button>
                ))}
              </div>
            </section>

            <section className="service-section">
              <div className="service-section-head"><div><small>Được nhiều bệnh nhân lựa chọn</small><h2>Dịch vụ được đặt nhiều nhất</h2></div><BadgeCheck size={20} /></div>
              <div className="popular-service-row">
                {services.filter((service) => service.popular).map((service) => (
                  <button key={service.id} onClick={() => setSelectedService(service)}>
                    <span>{service.category}</span>
                    <b>{service.name}</b>
                    <small>{formatPrice(service.price)}</small>
                  </button>
                ))}
              </div>
            </section>
          </>
        )}

        <section className="service-section">
          <div className="service-section-head"><div><small>Danh mục dịch vụ</small><h2>Tất cả dịch vụ y tế</h2></div><span className="service-result-count">{filteredServices.length} dịch vụ phù hợp</span></div>

          <Card className="service-filter-panel" style={{ marginBottom: '22px' }}>
            <label className="service-search">
              <Search size={20} />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm dịch vụ khám, xét nghiệm hoặc gói chăm sóc..." />
            </label>
            <div className="service-category-chips">
              {categories.map(({ label, icon }) => <button key={label} className={category === label ? 'active' : ''} onClick={() => setCategory(label)}>{icon} {label}</button>)}
            </div>
            <div className="service-filter-row">
              <select value={type} onChange={(event) => setType(event.target.value)}>{serviceTypes.map((item) => <option key={item}>{item}</option>)}</select>
              <select value={priceRange} onChange={(event) => setPriceRange(event.target.value)}>{priceRanges.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select>
              <label className="insurance-toggle"><input type="checkbox" checked={insuranceOnly} onChange={(event) => setInsuranceOnly(event.target.checked)} /><span /> Chỉ dịch vụ hỗ trợ BHYT</label>
            </div>
          </Card>

          {loading ? (
            <div className="medical-service-grid">{Array.from({ length: 6 }, (_, index) => <SkeletonCard key={index} />)}</div>
          ) : filteredServices.length ? (
            <div className="medical-service-grid">{filteredServices.map((service) => <ServiceCard key={service.id} service={service} onDetail={setSelectedService} onBooking={() => navigate('/patient/booking')} />)}</div>
          ) : (
            <div className="service-empty"><Search size={28} /><h3>Không tìm thấy dịch vụ phù hợp</h3><p>Hãy thử đổi từ khóa hoặc điều chỉnh bộ lọc để xem thêm lựa chọn.</p><Button variant="ghost" onClick={() => { setQuery(''); setCategory('Tất cả'); setType('Tất cả loại dịch vụ'); setPriceRange('all'); setInsuranceOnly(false) }}>Xóa bộ lọc</Button></div>
          )}
        </section>
      </div>

      {selectedService && (
        <div className="service-drawer-backdrop" onClick={() => setSelectedService(null)}>
          <aside className="service-drawer" onClick={(event) => event.stopPropagation()}>
            <button className="service-drawer-close" onClick={() => setSelectedService(null)}><X size={18} /></button>
            <span className="service-category-badge">{selectedService.category}</span>
            <h2>{selectedService.name}</h2>
            <p>{selectedService.detail}</p>
            <div className="service-drawer-price"><small>Chi phí dịch vụ</small><b>{formatPrice(selectedService.price)}</b>{selectedService.oldPrice && <del>{formatPrice(selectedService.oldPrice)}</del>}</div>
            <h3>Quy trình khám</h3>
            <ol><li>Đặt lịch và nhận xác nhận từ hệ thống.</li><li>Đến cơ sở trước lịch hẹn khoảng 10 phút.</li><li>Thực hiện dịch vụ và nhận tư vấn kết quả.</li></ol>
            <h3>Hạng mục bao gồm</h3>
            <ul>{selectedService.items.map((item) => <li key={item}><CheckCircle2 size={15} /> {item}</li>)}</ul>
            <h3>Bệnh viện áp dụng</h3>
            <ul>{selectedService.hospitals.map((item) => <li key={item}><Stethoscope size={15} /> {item}</li>)}</ul>
            <Button className="w-full justify-center" onClick={() => navigate('/patient/booking')}><CalendarPlus size={16} /> Đặt lịch khám</Button>
          </aside>
        </div>
      )}
    </AppShell>
  )
}
