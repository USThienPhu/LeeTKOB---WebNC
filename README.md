# LeeTKOB — Khung kiểm thử và Chốt kiểm soát chất lượng (Harness & Quality Gate)

> **Môn học:** CSC13114 — Phát triển ứng dụng Web nâng cao  
> **Cột mốc:** PA#2 — Harness & Quality Gate  
> **Sản phẩm:** Hệ thống thẩm định và rà soát bài tập lập trình C++ (LeeTKOB)

---

## 1. Giới thiệu sản phẩm (LeeTKOB Overview)

**LeeTKOB** là hệ thống hỗ trợ Trợ giảng (TA) trong quy trình chấm bài và rà soát các ràng buộc bài tập lập trình C++ (ví dụ: bắt buộc cài đặt Merge Sort, không sử dụng `std::sort`, cấm dùng thư viện ngoài) trước khi công bố điểm chính thức (`Publish`).

Để hạn chế tối đa chi phí của việc suy luận sai lệch (wrongful deduction) và đảm bảo tính công bằng, LeeTKOB vận hành dựa trên **cơ chế rà soát 3 lớp (3-tier Review Architecture)**:

```
[Mã nguồn C++ của sinh viên]
             │
             ▼
┌──────────────────────────────┐
│  Lớp 1: Hard Rules (Cú pháp) │ ──(Vi phạm rõ ràng / Không thỏa)──> [Ghi nhận vi phạm, bỏ qua LLM]
└──────────────────────────────┘
             │ (Thỏa mãn cú pháp / Cần thẩm định ngữ nghĩa)
             ▼
┌──────────────────────────────┐
│  Lớp 2: LLM Semantic Review  │ ──(Chỉ trả về: pass / violation / unsure + code citation)
└──────────────────────────────┘
             │ (Schema chuẩn hóa, không tự trừ điểm)
             ▼
┌──────────────────────────────┐
│  Lớp 3: Human Gate (Trợ giảng)│ ──(Duyệt Review Queue: toàn bộ violation, unsure & 10% pass)
└──────────────────────────────┘
             │
             ▼
       [PUBLISH ĐIỂM]
```

1. **Lớp 1 — Hard Rules (Cú pháp & Bộ phân tích AST chạy trước):**
   - Các bộ kiểm tra có nhận thức cú pháp (syntax-aware checks) phát hiện trực tiếp những vi phạm rõ ràng (như gọi `std::sort`, vòng lặp cấm).
   - Khi Hard Rule đã đưa ra kết luận, mô hình LLM **sẽ không được gọi** nhằm tối ưu chi phí và tăng tốc độ xử lý.
2. **Lớp 2 — LLM Semantic Review (Rà soát ràng buộc ngữ nghĩa):**
   - Đánh giá các ràng buộc chuyên sâu (thuật toán có thực sự là Merge Sort, hàm có đệ quy hay không, mảng phụ có bị ẩn giấu).
   - Mô hình chỉ phân định một trong 3 trạng thái: `pass`, `violation`, hoặc `unsure`, kèm dòng code làm bằng chứng (citation trích dẫn chính xác tuyệt đối).
   - **Mô hình không bao giờ tự ý quyết định điểm trừ** (mức trừ điểm do TA cấu hình).
3. **Lớp 3 — Human Gate (Chốt kiểm duyệt của con người):**
   - Toàn bộ kết quả `violation`, `unsure` cùng 10% kết quả `pass` ngẫu nhiên được đưa vào hàng đợi kiểm duyệt (Review Queue) của TA.
   - **Điểm số chỉ được phát hành khi TA hoàn tất rà soát và nhấn nút `Publish`.**

---

## 2. Chính sách trần chi tiêu mô hình & Bảo mật (Spending Cap & Secrets Policy)

Nhằm đảm bảo an toàn tài chính, phòng ngừa rủi ro lặp vô tận và tuân thủ tiêu chí đánh giá của cột mốc PA#2:

- **Thiết lập mức trần chi tiêu cứng (Hard Spending Cap):**
  - Đã thiết lập giới hạn chi tiêu tối đa: **200.000 VNĐ / tháng (~$8.00 USD / tháng)** trực tiếp trên bảng điều khiển nhà cung cấp mô hình (Google AI Studio / OpenAI Platform Billing Settings).
  - Đã kích hoạt cơ chế cảnh báo ngân sách tự động (Budget Alerts) tại các ngưỡng 50%, 80% và 100%.
- **Cam kết không gọi API thật trong kiểm thử:**
  - Toàn bộ các bài kiểm tra tự động (Unit tests, Integration tests, Contract tests) và quy trình CI **hoàn toàn sử dụng dữ liệu giả lập (mocks/stubs/fixtures)**. Tuyệt đối không gọi API thật của LLM trong quá trình build hoặc test.
- **Quản trị biến môi trường & Thông tin bí mật:**
  - Không có bất kỳ khóa API (secrets/keys) nào được commit vào lịch sử Git.
  - Tệp `.env` đã được cấu hình trong `.gitignore`.
  - Tệp [`.env.example`](file:///.env.example) liệt kê đầy đủ tất cả các biến môi trường cần thiết kèm giá trị mẫu an toàn.

---

## 3. Cấu trúc tài liệu cột mốc (Milestone Docs)

Tất cả các tài liệu bàn giao bắt buộc của Cột mốc PA#2 được tổ chức và liên kết bên dưới:

| Tài liệu | Mô tả | Liên kết |
| :--- | :--- | :--- |
| **Hợp đồng API** | Đặc tả OpenAPI/RFC 9457 cho endpoint của LeeTKOB | [docs/contract/](file:///docs/contract/) |
| **Báo cáo PA#2** | Bằng chứng chốt chặn CI (Red check, Green check, Contract break) | [PA2.md](file:///PA2.md) |
| **AI Audit Log** | Nhật ký minh bạch quá trình sử dụng AI theo định dạng môn học | [AI-LOG.md](file:///PA02/AI-LOG.md) |
| **Chỉ dẫn Agent** | Hướng dẫn hệ thống (System Instructions) và phân quyền cho AI | [AGENTS.md](file:///PA02/AGENTS.md) |
| **Tự đánh giá** | Bảng tự chấm điểm theo từng tiêu chuẩn của Rubric PA#2 | [SELF_ASSESSMENT_REPORT.md](file:///SELF_ASSESSMENT_REPORT.md) |

---

## 4. Công nghệ dự kiến (Tech Stack)

> *Ghi chú: Nhóm đang trong giai đoạn chuẩn bị khung kiểm thử. Các công nghệ cụ thể dưới đây sẽ được chốt chính thức ở Bước 2 khi khởi tạo repository.*

- [ ] **Ngôn ngữ & Nền tảng:** `TypeScript` / `Node.js` (hoặc `Python`)
- [ ] **Web Framework:** Express / Fastify / Hono
- [ ] **Linter:** ESLint / Biome / Ruff
- [ ] **Formatter:** Prettier / Black
- [ ] **Type Checker:** TypeScript Compiler (`tsc --noEmit`) / mypy
- [ ] **Test Framework:** Vitest / Jest / Pytest
- [ ] **Contract Testing:** Supertest / Pact / OpenAPI Schema Validator
- [ ] **CI/CD:** GitHub Actions

---

## 5. Hướng dẫn cài đặt & Bộ lệnh kiểm tra chất lượng (Verification Commands)

### 5.1. Khởi tạo môi trường

```bash
# [CẬP NHẬT KHI KHỞI TẠO DỰ ÁN]
# Sao chép tệp cấu hình môi trường mẫu
cp .env.example .env

# Cài đặt các gói phụ thuộc
npm install   # hoặc pnpm install / poetry install
```

### 5.2. Chốt kiểm soát chất lượng (Quality Gate)

Mỗi thao tác kiểm tra phải chạy được bằng **một lệnh duy nhất**, đồng nhất giữa máy tính cá nhân (local) và luồng tự động hóa CI:

| Thao tác kiểm tra | Mục đích kiểm soát | Lệnh thực thi (Local & CI) | Trạng thái |
| :--- | :--- | :--- | :--- |
| **All-in-One Gate** | Chạy toàn bộ các bước kiểm tra chất lượng | `npm run check` | `[CẬP NHẬT KHI KHỞI TẠO DỰ ÁN]` |
| **Lint** | Quét lỗi cú pháp, quy chuẩn code | `npm run lint` | `[CẬP NHẬT KHI KHỞI TẠO DỰ ÁN]` |
| **Format Check** | Kiểm tra định dạng mã nguồn nhất quán | `npm run format:check` | `[CẬP NHẬT KHI KHỞI TẠO DỰ ÁN]` |
| **Type Check** | Kiểm tra an toàn kiểu tĩnh | `npm run typecheck` | `[CẬP NHẬT KHI KHỞI TẠO DỰ ÁN]` |
| **Unit & Contract Test** | Chạy toàn bộ kiểm thử đơn vị & kiểm thử hợp đồng | `npm run test` | `[CẬP NHẬT KHI KHỞI TẠO DỰ ÁN]` |

Agent và các thành viên nhóm cam kết chỉ merge mã nguồn vào nhánh `main` khi tất cả các kiểm tra trên đều hiển thị trạng thái **xanh (pass)**.
