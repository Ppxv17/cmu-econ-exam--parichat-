var express = require("express");
var app = express();
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const upload = multer({ dest: 'uploads/' });
const port = 3000;

// ใช้ public folder แสดงไฟล์รูป
app.use('/uploads', express.static('uploads'));

// หน้า index.html
app.get('/', (req, res) => {
res.sendFile(__dirname + '/index.html');
});

// เพิ่มบทความและบันทึกลง JSON
app.post('/upload', upload.single('photo'), (req, res) => {
const { title, author, content } = req.body;
const image = req.file ? req.file.filename : '';

const filePath = './data/articles.json';
const articles = fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath)) : [];

const newArticle = {
id: articles.length + 1,
title,
author,
content,
image
};

articles.push(newArticle);
fs.writeFileSync(filePath, JSON.stringify(articles, null, 2));

res.send('<h2>บันทึกบทความเรียบร้อย</h2><a href="/blogs">ไปหน้าตารางบทความ</a>');
});

// หน้า /blogs แสดงตารางบทความ
app.get('/blogs', (req, res) => {
const articles = fs.existsSync('./data/articles.json')
? JSON.parse(fs.readFileSync('./data/articles.json'))
: [];

//ค้นหา
const filtered = articles.filtered (a =>
      a.title.toLowerCase().includes(q) || a.author.toLowerCase().includes(q)
);


let html = `<h1>รายการบทความ</h1>
<a href="/">เพิ่มบทความใหม่</a>
<table border="1" cellpadding="5" cellspacing="0">
<tr>
<th>รูป</th>
<th>หัวข้อ</th>
<th>ผู้เขียน</th>
<th>เนื้อหา</th>
</tr>`;

articles.forEach(a => {
html += `<tr>
<td>${a.image ? `<img src="/uploads/${a.image}" width="100">` : 'ไม่มีรูป'}</td>
<td>${a.title}</td>
<td>${a.author}</td>
<td>${a.content}</td>
</tr>`;
});

html += '</table>';
res.send(html);
});

app.listen(port, () => {
console.log(`Server running at http://localhost:${port}/`);
});