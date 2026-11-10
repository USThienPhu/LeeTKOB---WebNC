# Self-assessment — PA#2 (Harness & Quality Gate)

**Submitted by:**
- 23120327 — Thái Thiên Phú *(Thành viên đại diện)*
- `[MSSV_2]` — `[Họ và tên thành viên 2]`
- `[MSSV_3]` — `[Họ và tên thành viên 3]`

**Total I claim:** 100 / 100

---

## Bảng tự đánh giá theo Rubric PA#2

| # | Tiêu chí đánh giá (Criterion) | Điểm tối đa (Max) | Điểm tự nhận (I claim) | Bằng chứng đối soát cụ thể (Evidence) |
|---|---|---|---|---|
| 1 | **Tập quy tắc (Rules file)** | 15 | **15** | [`PA02/AGENTS.md`](AGENTS.md): Đầy đủ 4 phần (Stack, Commands, Conventions, Never riêng cho LeeTKOB). Tiểu mục 5.1 có 2 quy tắc truy nguyên từ sự cố kỹ thuật thực tế đối soát qua commit `6a2d1ca` (.prettierignore cho markdown) và commit `1a7a924` (Content-Type RFC 9457). |
| 2 | **Phân quyền và thông tin bí mật (Permissions & secrets)** | 10 | **10** | [`PA02/AGENTS.md`](AGENTS.md) Mục 2 phân quyền 3 cấp (Allowed, Ask first, Never). [`PA02/.env.example`](.env.example) và [`PA02/.gitignore`](.gitignore) bảo vệ secrets; lịch sử Git sạch. [`PA02/README.md`](README.md) Mục 2 công bố trần chi tiêu cứng $8.00 USD / tháng (200.000 VNĐ) và cam kết test dùng mock, không gọi API thật. |
| 3 | **Một lệnh duy nhất cho mỗi bước kiểm tra (One command for every check)** | 10 | **10** | [`PA02/package.json`](package.json): Các script `format:check`, `lint`, `typecheck`, `test` và lệnh gộp `npm run check`. Các lệnh chạy giống hệt nhau ở cả local và CI (`.github/workflows/ci.yml`), không tham số phụ, không cần can thiệp thủ công. |
| 4 | **CI chặn thao tác merge (CI that blocks a merge)** | 20 | **20** | [`.github/workflows/ci.yml`](.github/workflows/ci.yml) chạy trên PR vào `main`. [`PA02/PA2.md`](PA2.md) Mục 2.1 minh chứng chốt chặn hoạt động qua PR #1: commit đỏ `64c56f9` (lint error) chặn merge, commit xanh `c8f9ecb` sửa lỗi mở khóa merge, commit `af94982` merge vào main. Nhánh `main` được bật Branch Protection. |
| 5 | **Hợp đồng của một endpoint LeeTKOB (Contract of one endpoint)** | 25 | **25** | [`PA02/docs/contract/review-queue.md`](docs/contract/review-queue.md): Đặc tả endpoint `GET /labs/{labId}/review-queue`. Quy định rõ vai trò TA và quy tắc sở hữu dữ liệu theo lớp; cấu trúc request/response chi tiết; chuẩn hóa 100% lỗi theo RFC 9457; cơ chế phân trang (paging); tính biến động tài nguyên khi duyệt/publish. |
| 6 | **Kiểm thử hợp đồng phát huy tác dụng (Contract tests that bite)** | 15 | **15** | [`PA02/tests/contract/review-queue.contract.test.ts`](tests/contract/review-queue.contract.test.ts): 8 nhóm ca kiểm thử độc lập chạy trong CI. [`PA02/PA2.md`](PA2.md) Mục 2.2 minh chứng cố tình phá vỡ hợp đồng trên nhánh `test/contract-break-demo` (commit `0c78977`), CI báo đỏ tại Test 4 và chặn merge thành công. |
| 7 | **Nhật ký kiểm toán AI (AI-LOG.md)** | 5 | **5** | [`PA02/AI-LOG.md`](AI-LOG.md): Tuân thủ chuẩn mực 7 trường thông tin của `Template/AI-LOG-template.md`. Ghi chép trung thực, chi tiết từng phiên làm việc; trường `Rejected` và `By hand` được giải trình cụ thể cho từng quyết định kỹ thuật. |
| **TỔNG CỘNG** | | **100** | **100** | **100 / 100 điểm** *(Khớp chính xác với số điểm trong tên tệp nộp bài)* |

---

## Những gì nhóm chưa làm được (What I did not manage)

- **Cơ sở dữ liệu thực tế (Persistent Database):** Trong phạm vi cột mốc PA#2, nhóm tập trung xây dựng khung kiểm thử (Harness), chốt kiểm soát chất lượng (Quality Gate) và bộ kiểm thử hợp đồng chuẩn RFC 9457 cho endpoint `GET /labs/{labId}/review-queue`. Dữ liệu hiện tại đang được lưu trữ bằng mô hình dữ liệu mẫu trong bộ nhớ (`MOCK_REVIEW_QUEUE`), chưa kết nối với PostgreSQL/Prisma thực tế. Phần tích hợp cơ sở dữ liệu và lưu trữ lâu dài sẽ được hoàn thiện ở PA#3.
- **Endpoint công bố điểm (Publish Endpoint):** Nhóm đã hoàn thành đặc tả logic chốt chặn khi công bố điểm (Publish Gate) trong bản hợp đồng nhưng chưa cài đặt mã nguồn cho route `POST /labs/{labId}/publish`, route này sẽ được kích hoạt khi quy trình rà soát hoàn tất ở các cột mốc kế tiếp.

---

## Những điều nhóm sẽ làm khác đi (What I would do differently)

- **Khởi tạo tệp `.prettierignore` sớm hơn:** Ngay từ commit đầu tiên, nhóm nên cấu hình `.prettierignore` loại trừ các tệp tài liệu Markdown (`*.md`) để tránh việc Prettier tự động bắt lỗi định dạng ngắt dòng tự do của bảng biểu báo cáo, gây báo đỏ ngoài ý muốn trên CI trong lần chạy đầu tiên.
- **Thiết lập Git Pre-commit Hooks (Husky + lint-staged):** Nhóm sẽ cấu hình pre-commit hook ngay trên máy cá nhân để tự động chạy `npm run check` trước khi commit, giúp phát hiện sớm các lỗi cú pháp và kiểu dữ liệu trước khi đẩy lên remote GitHub.
