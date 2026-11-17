# Self-assessment — PA#2 (Harness & Quality Gate)

**Submitted by:**
- 23120319 — Trương Thành Phát
- 23120327 — Thái Thiên Phú 
- 23120380 — Huỳnh Lê Minh Triết

**Total I claim:** 90 / 100

---

## Bảng tự đánh giá theo Rubric PA#2

| # | Tiêu chí đánh giá (Criterion) | Điểm tối đa (Max) | Điểm tự nhận (I claim) | Bằng chứng đối soát cụ thể (Evidence) |
|---|---|:---:|:---:|---|
| 1 | **Tập quy tắc (Rules file)** | 15 | **15** | [`AGENTS.md`](AGENTS.md): Đầy đủ 4 phần (Stack, Commands, Conventions, Never riêng cho LeeTKOB). Tiểu mục 5.1 có 2 quy tắc truy nguyên từ sự cố kỹ thuật thực tế đối soát qua commit `6a2d1ca` (.prettierignore cho markdown) và commit `1a7a924` (Content-Type RFC 9457). |
| 2 | **Phân quyền và thông tin bí mật (Permissions & secrets)** | 10 | **10** | [`AGENTS.md`](AGENTS.md) Mục 2 phân quyền 3 cấp (Allowed, Ask first, Never). [`.env.example`](.env.example) và [`.gitignore`](.gitignore) bảo vệ secrets; lịch sử Git sạch 100%. [`README.md`](README.md) Mục 2 công bố trần chi tiêu cứng $8.00 USD / tháng (200.000 VNĐ) và cam kết test dùng mock, không gọi API thật. |
| 3 | **Một lệnh duy nhất cho mỗi bước kiểm tra (One command for every check)** | 10 | **10** | [`package.json`](package.json): Các script `format:check`, `lint`, `typecheck`, `test` và lệnh gộp `npm run check`. Các lệnh chạy giống hệt nhau ở cả local và CI (`.github/workflows/ci.yml`), không tham số phụ, không cần can thiệp thủ công. |
| 4 | **CI chặn thao tác merge (CI that blocks a merge)** | 20 | **16** | [`.github/workflows/ci.yml`](.github/workflows/ci.yml) chạy bắt buộc trên PR vào `main`. [`PA2.md`](PA2.md) Mục 2.1 minh chứng chốt chặn hoạt động qua PR #1: commit đỏ `64c56f9` (lint error) chặn merge, commit xanh `c8f9ecb` sửa lỗi mở khóa merge, commit `af94982` merge vào main. Nhánh `main` được bật Branch Protection. *Tự trừ 4 điểm vì workflow CI mới cấu hình chạy trên môi trường đơn lẻ ubuntu-latest, chưa thiết lập ma trận kiểm thử đa môi trường (matrix test trên nhiều phiên bản Node.js).* |
| 5 | **Hợp đồng của một endpoint LeeTKOB (Contract of one endpoint)** | 25 | **22** | [`docs/contract/review-queue.md`](docs/contract/review-queue.md): Đặc tả chi tiết endpoint `GET /labs/{labId}/review-queue`, vai trò TA và quy tắc sở hữu lớp học; chuẩn hóa 100% lỗi theo RFC 9457; cơ chế phân trang (paging). *Tự trừ 3 điểm vì hợp đồng chưa quy định cơ chế Rate-limiting và cơ chế Webhook thông báo khi có bài nộp mới vào hàng đợi.* |
| 6 | **Kiểm thử hợp đồng phát huy tác dụng (Contract tests that bite)** | 15 | **12** | [`tests/contract/review-queue.contract.test.ts`](tests/contract/review-queue.contract.test.ts): 8 nhóm ca kiểm thử độc lập chạy trong CI. [`PA2.md`](PA2.md) Mục 2.2 minh chứng cố tình phá vỡ hợp đồng trên nhánh `test/contract-break-demo` (commit `0c78977`), CI báo đỏ tại Test 4 và chặn merge thành công. *Tự trừ 3 điểm vì dữ liệu kiểm thử hiện tại mới ở mức mock in-memory, chưa kiểm thử chịu tải đồng thời (concurrent access).* |
| 7 | **Nhật ký kiểm toán AI (AI-LOG.md)** | 5 | **5** | [`AI-LOG.md`](AI-LOG.md): Tuân thủ chuẩn mực 7 trường thông tin của `Template/AI-LOG-template.md`. Ghi chép trung thực, chi tiết từng phiên làm việc; trường `Rejected` và `By hand` được giải trình cụ thể cho từng quyết định kỹ thuật. |
| **TỔNG CỘNG** | | **100** | **90** | **90 / 100 điểm** *(Khớp chính xác với số điểm trong tên tệp nộp bài)* |

---

## Những gì nhóm chưa làm được (What I did not manage)

- **Cơ sở dữ liệu thực tế & Chịu tải đồng thời:** Trong phạm vi cột mốc PA#2, nhóm tập trung xây dựng khung kiểm thử (Harness), chốt kiểm soát chất lượng (Quality Gate) và bộ kiểm thử hợp đồng chuẩn RFC 9457 cho endpoint `GET /labs/{labId}/review-queue`. Dữ liệu hiện tại đang được lưu trữ bằng mô hình dữ liệu mẫu trong bộ nhớ (`MOCK_REVIEW_QUEUE`), chưa kết nối với PostgreSQL/Prisma thực tế và chưa kiểm thử các trường hợp nhiều TA cùng truy cập và cập nhật trạng thái hàng đợi cùng lúc.
- **Cơ chế giới hạn tần suất (Rate Limiting) trong hợp đồng:** Bản hợp đồng mới bao quát xác thực, phân quyền lớp học, phân trang và chuẩn lỗi RFC 9457, nhưng chưa đưa vào đặc tả giới hạn số lượng request/phút của client.
- **Ma trận môi trường CI (Matrix Build):** Workflow GitHub Actions hiện tại mới chạy trên một môi trường duy nhất là `ubuntu-latest` với Node.js 20, chưa cấu hình ma trận chạy song song trên nhiều phiên bản Node.js (18, 20, 22) hoặc Windows/macOS runners.

---

## Những điều nhóm sẽ làm khác đi (What I would do differently)

- **Khởi tạo tệp `.prettierignore` sớm hơn:** Ngay từ commit đầu tiên, nhóm nên cấu hình `.prettierignore` loại trừ các tệp tài liệu Markdown (`*.md`) và workflow CI (`.github/`) để tránh việc Prettier tự động bắt lỗi định dạng ngắt dòng tự do của bảng biểu báo cáo, gây báo đỏ ngoài ý muốn trên CI trong lần chạy đầu tiên.
- **Thiết lập Git Pre-commit Hooks (Husky + lint-staged):** Nhóm sẽ cấu hình pre-commit hook ngay trên máy cá nhân để tự động chạy `npm run check` trước khi commit, giúp phát hiện sớm các lỗi cú pháp và kiểu dữ liệu trước khi đẩy lên remote GitHub.
