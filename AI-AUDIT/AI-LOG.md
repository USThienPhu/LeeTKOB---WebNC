# AI-LOG — LeeTKOB (PA02 - Harness & Quality Gate)

Audit log ghi lại quá trình làm việc giữa sinh viên và các trợ lý AI trong toàn bộ cột mốc PA02. Mọi AI Agent tương tác với dự án đều phải tự động cập nhật nhật ký vào tệp này theo hướng dẫn tại `PA02/AGENTS.md`.

---

## 2026-11-06 — Khởi tạo tệp chỉ dẫn hệ thống AGENTS.md cho thư mục PA02
Tool: Antigravity
Asked for: Tạo file AGENTS.md đặt trong thư mục PA02 làm system instruction hướng dẫn AI agents tự động ghi audit log vào PA02/AI-AUDIT/AI-LOG.md theo format chuẩn sau mỗi lần tương tác/nhận nhiệm vụ.
Kept: Cấu trúc quy định tự động log vào AI-LOG.md, mẫu format chuẩn theo Template môn học, cùng 4 thành phần bắt buộc theo rubric PA#2 (Stack, Commands, Conventions, Never).
Changed: Mở rộng mục Permissions thành 3 cấp độ (Allowed, Ask first, Never) và tích hợp các điều cấm kỵ đặc thù của dự án LeeTKOB (không leak secrets, không gọi API LLM thật trong test tự động, không sửa bài test để pass giả mạo, không bypass human gate).
Rejected: Các chỉ dẫn chung chung kiểu generic coding assistant; loại bỏ việc sinh code tùy tiện ngoài phạm vi PA02.
By hand: Định nghĩa yêu cầu cốt lõi về việc bắt buộc ghi log và thiết lập cấu trúc thư mục PA02.


## 2026-11-06 — Cấu hình chi tiết cơ chế trích xuất và append audit log trong AGENTS.md
Tool: Antigravity
Asked for: Đọc template chuẩn từ Template/AI-LOG-template.md và cấu hình chi tiết vào AGENTS.md cách thức AI agent tự động trích xuất thông tin, điền vào template và ghi nối tiếp (append) vào PA02/AI-AUDIT/AI-LOG.md trong mỗi phiên làm việc.
Kept: Chuẩn cấu trúc 7 trường thông tin từ Template/AI-LOG-template.md và 5 nguyên tắc liêm chính học thuật của khóa học.
Changed: Bổ sung bảng chỉ dẫn chi tiết cách Agent trích xuất dữ liệu thực tế cho từng trường thông tin (Header, Tool, Asked for, Kept, Changed, Rejected, By hand); bổ sung quy chuẩn kỹ thuật append chống mất dữ liệu cũ và cảnh báo phòng tránh "Weak Log".
Rejected: Loại bỏ phương án ghi đè (overwrite) file log; từ chối các định dạng nhật ký tự do không bám sát mẫu template rubric của môn học.
By hand: Chỉ định đường dẫn tệp template nguồn d:/Study/Y/Web/Barrier/Template/AI-LOG-template.md và quy định cơ chế cập nhật nối tiếp cho từng phiên làm việc.
