const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public')); // 나중에 HTML 파일들을 둘 폴더

// 가상의 특강 데이터 (나중에 데이터베이스로 확장할 수 있습니다)
let lectures = [
    { id: 1, title: '초등 코딩 기초 특강', capacity: 10, applicants: [] },
    { id: 2, title: 'AI 이미지 만들기 클래스', capacity: 5, applicants: [] }
];

// 1. 특강 목록 및 잔여석 조회 API
app.get('/api/lectures', (req, res) => {
    const result = lectures.map(lec => ({
        id: lec.id,
        title: lec.title,
        capacity: lec.capacity,
        remaining: lec.capacity - lec.applicants.length,
        applicants: lec.applicants
    }));
    res.json(result);
});

// 2. 특강 신청 API
app.post('/api/apply', (req, res) => {
    const { lectureId, name } = req.body;
    const lecture = lectures.find(l => l.id === lectureId);

    if (!lecture) {
        return res.status(404).json({ success: false, message: '존재하지 않는 특강입니다.' });
    }

    // 이미 신청했는지 확인
    if (lecture.applicants.includes(name)) {
        return res.status(400).json({ success: false, message: '이미 신청한 이름(닉네임)입니다.' });
    }

    // 정원 초과 확인
    if (lecture.applicants.length >= lecture.capacity) {
        return res.status(400).json({ success: false, message: '정원이 마감되었습니다.' });
    }

    lecture.applicants.push(name);
    res.json({ success: true, message: '신청이 완료되었습니다!' });
});

// 3. 특강 취소 API
app.post('/api/cancel', (req, res) => {
    const { lectureId, name } = req.body;
    const lecture = lectures.find(l => l.id === lectureId);

    if (!lecture) {
        return res.status(404).json({ success: false, message: '존재하지 않는 특강입니다.' });
    }

    const index = lecture.applicants.indexOf(name);
    if (index === -1) {
        return res.status(400).json({ success: false, message: '신청 내역을 찾을 수 없습니다.' });
    }

    lecture.applicants.splice(index, 1);
    res.json({ success: true, message: '취소되었습니다.' });
});

app.listen(PORT, () => {
    console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});