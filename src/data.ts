/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ScheduleItem, StudentSeat, CongratsMessage } from './types';

export const SCHEDULE_DATA: ScheduleItem[] = [
  {
    time: '07:30 – 08:00',
    activity: 'Đón tiếp & Ổn định vị trí',
    details: 'Đón tiếp Đại biểu, Quý phụ huynh và các Tân cử nhân. Nhận lễ phục tốt nghiệp, chụp ảnh check-in tại khu vực photobooth và di chuyển vào hội trường.',
    category: 'formal',
  },
  {
    time: '08:00 – 08:30',
    activity: 'Văn nghệ chào mừng',
    details: 'Chương trình nghệ thuật đặc sắc chào mừng do Đội Văn nghệ Xung kích Đoàn Thanh niên - Hội Sinh viên Trường Đại học Công nghệ biểu diễn.',
    category: 'celebration',
  },
  {
    time: '08:30 – 09:00',
    activity: 'Nghi lễ chào cờ & Khai mạc',
    details: 'Nghi lễ Chào cờ trang nghiêm. Tuyên bố lý do, giới thiệu Đại biểu tham dự. Phát biểu khai mạc và chúc mừng của Hiệu trưởng Trường Đại học Công nghệ.',
    category: 'formal',
  },
  {
    time: '09:00 – 09:30',
    activity: 'Vinh danh & Khen thưởng',
    details: 'Công bố quyết định công nhận tốt nghiệp. Vinh danh Thủ khoa ngành, khen thưởng các Tân cử nhân có thành tích học tập và rèn luyện xuất sắc.',
    category: 'academic',
  },
  {
    time: '09:30 – 11:30',
    activity: 'Nghi lễ Trao bằng tốt nghiệp',
    details: 'Nghi thức trao bằng trang trọng cho từng Tân cử nhân của các khoa: Công nghệ Thông tin, Điện tử Viễn thông, Vật lý Kỹ thuật & Công nghệ Nano, Cơ học Kỹ thuật & Tự động hóa, Công nghệ Nông nghiệp.',
    category: 'academic',
  },
  {
    time: '11:30 – 11:45',
    activity: 'Tri ân & Nghi thức tung mũ',
    details: 'Phát biểu cảm tưởng của đại diện Tân cử nhân, tặng hoa tri ân Ban Giám hiệu và các Thầy Cô. Toàn thể Hội trường thực hiện nghi thức tung mũ tốt nghiệp bế mạc buổi lễ.',
    category: 'celebration',
  },
];

export const MOCK_SEATS: StudentSeat[] = [
  { studentId: '22020101', name: 'Nguyễn Minh Anh', major: 'Khoa học Máy tính', block: 'Khu vực A (Cận sân khấu)', row: 'Hàng C', seatNumber: '12' },
  { studentId: '22020102', name: 'Trần Hoàng Bách', major: 'Kỹ thuật Máy tính', block: 'Khu vực A (Cận sân khấu)', row: 'Hàng C', seatNumber: '13' },
  { studentId: '22020103', name: 'Phạm Thùy Chi', major: 'Công nghệ Thông tin', block: 'Khu vực B (Trung tâm)', row: 'Hàng F', seatNumber: '05' },
  { studentId: '22020104', name: 'Lê Huy Hoàng', major: 'Hệ thống Thông tin', block: 'Khu vực B (Trung tâm)', row: 'Hàng G', seatNumber: '08' },
  { studentId: '22020105', name: 'Vũ Thị Mai', major: 'Mạng máy tính & Truyền thông', block: 'Khu vực C (Cánh trái)', row: 'Hàng D', seatNumber: '21' },
  { studentId: '22020224', name: 'Nguyễn Mạnh Hùng', major: 'Công nghệ Thông tin', block: 'Khu vực A (Cận sân khấu)', row: 'Hàng A', seatNumber: '01' },
  { studentId: '22020106', name: 'Phan Bảo Nam', major: 'Kỹ thuật Robot', block: 'Khu vực D (Cánh phải)', row: 'Hàng D', seatNumber: '22' },
  { studentId: '22020107', name: 'Đặng Phương Nam', major: 'Công nghệ Hàng không Vũ trụ', block: 'Khu vực B (Trung tâm)', row: 'Hàng E', seatNumber: '14' },
  { studentId: '22020108', name: 'Hoàng Quốc Khánh', major: 'Vật lý Kỹ thuật', block: 'Khu vực E (Khán đài tầng 2)', row: 'Hàng B', seatNumber: '03' },
  { studentId: '22020109', name: 'Bùi Phương Thảo', major: 'Công nghệ Nông nghiệp', block: 'Khu vực E (Khán đài tầng 2)', row: 'Hàng C', seatNumber: '11' },
  { studentId: '22020110', name: 'Nguyễn Khắc Việt', major: 'Trí tuệ Nhân tạo', block: 'Khu vực A (Cận sân khấu)', row: 'Hàng B', seatNumber: '05' },
];

export const PRESET_MESSAGES: CongratsMessage[] = [
  {
    id: 'p1',
    name: 'GS. TS. Chử Đức Trình',
    relation: 'teacher',
    message: 'Chúc mừng tất cả các em tân cử nhân khóa QH-2022. Nhà trường tự hào về sự kiên trì, nỗ lực và những thành tựu của các em. Chúc các em vững bước, sáng tạo và thành công trên chặng đường sắp tới, mang tri thức phục vụ đất nước.',
    sticker: 'scroll',
    timestamp: '2026-06-28T09:00:00Z',
    likes: 124,
  },
  {
    id: 'p2',
    name: 'Nguyễn Văn Hùng',
    relation: 'parent',
    message: 'Cảm ơn Ban Giám hiệu cùng toàn thể quý Thầy Cô trường ĐH Công nghệ đã tận tình dìu dắt các con. Nhìn thấy con khôn lớn, trưởng thành và cầm trên tay tấm bằng danh giá này, gia đình thực sự vô cùng xúc động.',
    sticker: 'flowers',
    timestamp: '2026-06-28T14:30:00Z',
    likes: 56,
  },
  {
    id: 'p3',
    name: 'Nguyễn Minh Anh (Tân khoa xuất sắc)',
    relation: 'student',
    message: 'Bốn năm thanh xuân tại UET trôi qua thật nhanh. Biết ơn những bài giảng tâm huyết của thầy cô, những buổi tối thức đêm làm đồ án cùng đồng đội. Chúc cho toàn thể K67 chúng ta sẽ luôn giữ mãi ngọn lửa nhiệt huyết UET!',
    sticker: 'cap',
    timestamp: '2026-06-29T02:15:00Z',
    likes: 89,
  },
];
