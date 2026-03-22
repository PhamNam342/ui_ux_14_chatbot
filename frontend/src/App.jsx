import { useEffect, useState } from 'react'
import axios from 'axios'

function App() {
  const [message, setMessage] = useState('Đang tải...')

  useEffect(() => {
    // Gọi đến địa chỉ Backend của bạn
    axios.get('http://localhost:5000')
      .then(res => {
        setMessage(res.data.message)
      })
      .catch(err => {
        console.error("Lỗi rồi:", err)
        setMessage("Không kết nối được với server")
      })
  }, [])

  return (
    <div>
      <h1>Kết nối Fullstack</h1>
      <p>Tin nhắn từ Backend: <strong>{message}</strong></p>
    </div>
  )
}

export default App