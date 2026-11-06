# AI-LOG — LeeTKOB (PA02 - Harness & Quality Gate)

Audit log ghi lại quá trình làm việc giữa sinh viên và các trợ lý AI trong toàn bộ cột mốc PA02. Mọi AI Agent tương tác với dự án đều phải tự động cập nhật nhật ký vào tệp này theo hướng dẫn tại `PA02/AGENTS.md`.

---

## 2026-11-06 — Khởi tạo tệp chỉ dẫn hệ thống AGENTS.md cho thư mục PA02
Tool: Antigravity
Asked for: Tạo file AGENTS.md đặt trong thư mục PA02 làm system instruction hướng dẫn AI agents tự động ghi audit log vào PA02/AI-LOG.md theo format chuẩn sau mỗi lần tương tác/nhận nhiệm vụ.
Kept: Cấu trúc quy định tự động log vào AI-LOG.md, mẫu format chuẩn theo Template môn học, cùng 4 thành phần bắt buộc theo rubric PA#2 (Stack, Commands, Conventions, Never).
Changed: Mở rộng mục Permissions thành 3 cấp độ (Allowed, Ask first, Never) và tích hợp các điều cấm kỵ đặc thù của dự án LeeTKOB (không leak secrets, không gọi API LLM thật trong test tự động, không sửa bài test để pass giả mạo, không bypass human gate).
Rejected: Các chỉ dẫn chung chung kiểu generic coding assistant; loại bỏ việc sinh code tùy tiện ngoài phạm vi PA02.
By hand: Định nghĩa yêu cầu cốt lõi về việc bắt buộc ghi log và thiết lập cấu trúc thư mục PA02.


## 2026-11-06 — Cấu hình chi tiết cơ chế trích xuất và append audit log trong AGENTS.md
Tool: Antigravity
Asked for: Đọc template chuẩn từ Template/AI-LOG-template.md và cấu hình chi tiết vào AGENTS.md cách thức AI agent tự động trích xuất thông tin, điền vào template và ghi nối tiếp (append) vào PA02/AI-LOG.md trong mỗi phiên làm việc.
Kept: Chuẩn cấu trúc 7 trường thông tin từ Template/AI-LOG-template.md và 5 nguyên tắc liêm chính học thuật của khóa học.
Changed: Bổ sung bảng chỉ dẫn chi tiết cách Agent trích xuất dữ liệu thực tế cho từng trường thông tin (Header, Tool, Asked for, Kept, Changed, Rejected, By hand); bổ sung quy chuẩn kỹ thuật append chống mất dữ liệu cũ và cảnh báo phòng tránh "Weak Log".
Rejected: Loại bỏ phương án ghi đè (overwrite) file log; từ chối các định dạng nhật ký tự do không bám sát mẫu template rubric của môn học.
By hand: Chỉ định đường dẫn tệp template nguồn d:/Study/Y/Web/Barrier/Template/AI-LOG-template.md và quy định cơ chế cập nhật nối tiếp cho từng phiên làm việc.


## 2026-11-06 — Chuẩn hóa vị trí file AI-LOG.md và dọn dẹp thư mục AI-AUDIT
Tool: Antigravity
Asked for: Cập nhật AGENTS.md về thay đổi vị trí của file AI-LOG.md lại cùng cấp với file AGENTS.md, xoá luôn folder AI-AUDIT vì không cần nữa.
Kept: Toàn bộ nội dung nhật ký kiểm toán hiện có và cấu trúc 7 trường thông tin của các mục ghi.
Changed: Di chuyển file AI-LOG.md ra nằm trực tiếp trong thư mục PA02 (cùng cấp với AGENTS.md), cập nhật lại toàn bộ các đường dẫn tham chiếu trong AGENTS.md từ PA02/AI-AUDIT/AI-LOG.md thành PA02/AI-LOG.md.
Rejected: Xóa bỏ hoàn toàn thư mục AI-AUDIT để tinh gọn cấu trúc thư mục dự án theo chỉ thị của người dùng.
By hand: Quyết định loại bỏ folder trung gian AI-AUDIT và chỉ định đặt trực tiếp AI-LOG.md cùng cấp với AGENTS.md trong PA02.


## 2026-11-06 — Khởi tạo bản khung sườn README.md cho dự án LeeTKOB cột mốc PA02
Tool: Antigravity
Asked for: Tạo một bản khung sườn ban đầu (Initial Draft/Scaffold) cho tệp README.md của dự án LeeTKOB (PA#2) đặt tại thư mục PA02, phân chia rõ phần cố định và phần khung giữ chỗ.
Kept: Cơ chế rà soát 3 lớp của LeeTKOB (Hard rules -> LLM review -> Human gate), chính sách trần chi tiêu 200.000 VNĐ (~$8.00 USD), và bảng liên kết tài liệu nộp bài PA#2.
Changed: Xây dựng phần Tech Stack dưới dạng checklist và bảng lệnh kiểm tra chất lượng (Verification Commands) kèm nhãn giữ chỗ [CẬP NHẬT KHI KHỞI TẠO DỰ ÁN] để nhóm dễ dàng hoàn thiện linh hoạt khi thiết lập repo.
Rejected: Không áp đặt cứng các dependency hay framework cụ thể khi nhóm chưa khởi tạo dự án; tránh đưa các hướng dẫn triển khai phức tạp ngoài phạm vi cột mốc PA#2.
By hand: Người dùng định nghĩa yêu cầu phân tách phần cố định (kiến trúc 3 lớp, spending cap, liên kết nộp bài) và phần động (placeholder lệnh kiểm tra).


## 2026-11-06 — Thêm quy tắc tự động sinh lệnh Git commit vào AGENTS.md
Tool: Antigravity
Asked for: Thêm một rule vào AGENTS.md về việc tại cuối mỗi phần trả lời của AI, sinh ra đoạn git commit để người dùng dễ dàng copy khi cần commit.
Kept: Toàn bộ cấu trúc hệ thống, quy tắc audit log và 3 cấp độ phân quyền trong AGENTS.md.
Changed: Bổ sung mục 1.5 và mục 5.4 vào AGENTS.md quy định bắt buộc AI Agent phải tạo khối lệnh `git add` & `git commit` theo chuẩn Conventional Commits ở cuối mỗi phản hồi tổng kết tác vụ.
Rejected: Không dùng commit message tùy tiện thiếu quy chuẩn; không bắt buộc người dùng phải tự soạn lệnh git thủ công.
By hand: Người dùng trực tiếp đưa ra yêu cầu bổ sung rule sinh đoạn lệnh git commit nhằm tối ưu trải nghiệm tương tác và quản lý phiên bản.


## 2026-11-06 — Khởi tạo cấu trúc mã nguồn Node.js (TypeScript) + Express và cấu hình Quality Gate
Tool: Antigravity
Asked for: Khởi tạo toàn bộ cấu trúc mã nguồn và cấu hình công cụ kiểm soát chất lượng cho thư mục PA02 theo stack Node.js (TypeScript) + Express gồm package.json, tsconfig.json, .prettierrc, eslint.config.js, vitest.config.ts, src/app.ts, src/server.ts và tests/sanity.test.ts.
Kept: Thiết lập package.json với chuẩn ESM ("type": "module"), bộ scripts kiểm soát chất lượng 4 bước (check, lint, format:check, typecheck, test), tsconfig.json chuẩn NodeNext, cấu hình ESLint v9 Flat Config, .prettierrc, vitest.config.ts, cùng khung mã nguồn Express (GET /healthz) và kiểm thử sanity.test.ts.
Changed: Dừng tiến trình tải gói phụ thuộc npm install tự động theo thao tác hủy của người dùng để người dùng trực tiếp quản lý việc cài đặt các gói trên môi trường phát triển máy chủ.
Rejected: Không bổ sung các thư viện trung gian ngoài danh mục chỉ định; không tiếp tục chạy lại lệnh npm install sau khi đã nhận chỉ thị hủy từ người dùng.
By hand: Người dùng cung cấp đầy đủ danh mục dependencies, định nghĩa bộ scripts kiểm soát chất lượng chuẩn, và trực tiếp thao tác hủy lệnh cài đặt npm.


## 2026-11-06 — Cập nhật trạng thái Tech Stack và Verification Commands trong README.md
Tool: Antigravity
Asked for: Cập nhật README.md tại thư mục PA02 để chuyển Tech Stack từ dạng dự kiến thành chính thức ([x]) và cập nhật trạng thái bảng Quality Gate thành Active (Đã kích hoạt).
Kept: Toàn bộ cấu trúc tổng quan sản phẩm, kiến trúc rà soát 3 lớp (Hard rules -> LLM -> Human gate), chính sách trần chi tiêu mô hình và bảng liên kết tài liệu nộp bài PA#2.
Changed: Chuyển toàn bộ các mục trong Tech Stack sang trạng thái đã chốt [x] (TypeScript, Express, ESLint v9, Prettier, tsc, Vitest, Supertest, GitHub Actions); cập nhật hướng dẫn cài đặt sang `npm install` (hoặc `npm ci`); chuyển toàn bộ trạng thái trong bảng Quality Gate thành `Active (Đã kích hoạt)`.
Rejected: Không sửa đổi hoặc gỡ bỏ các cam kết an toàn về trần chi tiêu API và việc sử dụng mocks trong kiểm thử tự động.
By hand: Người dùng phê duyệt việc hoàn tất khởi tạo dự án và trực tiếp chỉ đạo chuyển trạng thái tài liệu từ bản dự thảo sang chính thức.
