const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors()); 

app.get('/', (req, res) => {
    res.json({ message: "Chào Nam! Backend đã chạy thành công rồi nhé." });
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server đang nổ máy tại: http://localhost:${PORT}`);
});