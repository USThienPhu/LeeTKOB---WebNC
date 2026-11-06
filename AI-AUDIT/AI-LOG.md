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
