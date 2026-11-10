# PA#2 — Báo cáo Minh chứng Chốt kiểm soát chất lượng & Khung kiểm thử (Harness & Quality Gate)

> **Môn học:** CSC13114 — Phát triển ứng dụng Web nâng cao  
> **Cột mốc:** PA#2 — Khung kiểm thử và Chốt kiểm soát chất lượng (Harness & Quality Gate)  
> **Sản phẩm:** LeeTKOB  
> **Kho lưu trữ (Repository):** [https://github.com/USThienPhu/LeeTKOB---WebNC](https://github.com/USThienPhu/LeeTKOB---WebNC) *(Chế độ công khai - Public)*  
> **Tag nộp bài:** `pa2`

---

## 1. Thông tin Kho lưu trữ & Bảo vệ nhánh (Branch Protection)

### 1.1. Kho lưu trữ
- **URL Repository:** [https://github.com/USThienPhu/LeeTKOB---WebNC](https://github.com/USThienPhu/LeeTKOB---WebNC)
- **Nhánh mặc định (Default Branch):** `main`
- **Chế độ:** `Public` (cho phép Red-team ở PA#4 và Giảng viên/Trợ giảng truy cập kiểm tra).

### 1.2. Thiết lập bảo vệ nhánh `main` (Branch Protection Rules)
Nhánh `main` được áp dụng chính sách bảo vệ nghiêm ngặt để đảm bảo không có mã nguồn lỗi nào có thể merge trực tiếp:
- **Require a pull request before merging:** Bắt buộc mọi thay đổi phải thông qua Pull Request.
- **Require status checks to pass before merging:** Bắt buộc workflow `CI Quality Gate` phải đạt trạng thái **xanh (pass 100%)**:
  - `Quality Gate (Format, Lint, Typecheck, Test)`
- **Do not allow bypassing the above settings:** Áp dụng cho cả Administrators.
- **Minh chứng cài đặt:**
  - *Hình ảnh cài đặt Branch Protection:* `[ĐÍNH KÈM ẢNH HOẶC LINK ẢNH: docs/images/branch-protection.png]`
  - *(Xem ảnh chụp màn hình cài đặt trong thư mục `docs/images/` của kho lưu trữ).*

---

## 2. Minh chứng Chốt kiểm soát chất lượng hoạt động (Show that the Gate Bites)

Hệ thống CI tự động hóa (`.github/workflows/ci.yml`) thực thi tuần tự 4 bước kiểm tra bằng một lệnh duy nhất:
1. `npm run format:check` (Prettier)
2. `npm run lint` (ESLint v9)
3. `npm run typecheck` (TypeScript Compiler)
4. `npm run test` (Vitest: Sanity test & Toàn bộ Contract tests)

Dưới đây là các minh chứng thực tế chứng minh chốt kiểm soát chất lượng phát huy tác dụng ("The gate bites"):

---

### 2.1. Trường hợp 1: Chốt chặn Lint / Code Style (Pull Request #1)

- **Mục tiêu:** Chứng minh CI phát hiện lỗi vi phạm quy chuẩn mã nguồn (unused variable) và chặn thao tác merge vào `main`.
- **Pull Request:** [PR #1: test/gate-bites-demo](https://github.com/USThienPhu/LeeTKOB---WebNC/pull/1)

#### 🔴 Lần kiểm tra báo đỏ (Red Check) — CI chặn merge:
- **Commit cố tình gây lỗi:** [`64c56f9`](https://github.com/USThienPhu/LeeTKOB---WebNC/commit/64c56f9)
  - *Thông điệp commit:* `chore: intentionally add unused variable to trigger lint error`
  - *Chi tiết lỗi:* Khai báo biến `const unusedVariable = 'gate-bites';` nhưng không sử dụng.
  - *Hành vi của CI:* Bước `2. Lint check (ESLint)` báo lỗi vi phạm `@typescript-eslint/no-unused-vars` với exit code 1. Toàn bộ workflow bị dừng lại, GitHub đánh dấu kiểm tra báo đỏ ❌ và **nút "Merge pull request" bị khóa hoàn toàn**.
  - **Liên kết lần chạy CI báo đỏ:** [CI Run #3](https://github.com/USThienPhu/LeeTKOB---WebNC/actions/runs/`[RUN_ID_RED_LINT]`)

#### 🟢 Lần kiểm tra chuyển sang xanh (Green Check) — Mở khóa merge:
- **Commit sửa lỗi:** [`c8f9ecb`](https://github.com/USThienPhu/LeeTKOB---WebNC/commit/c8f9ecb)
  - *Thông điệp commit:* `fix: remove unused variable to restore clean lint check`
  - *Chi tiết sửa lỗi:* Loại bỏ hoàn toàn biến thừa `unusedVariable`.
  - *Hành vi của CI:* Cả 4 bước (`format:check`, `lint`, `typecheck`, `test`) đều báo xanh ✔️ với exit code 0. GitHub mở khóa cho phép merge vào `main`.
  - **Commit merge vào main:** [`af94982`](https://github.com/USThienPhu/LeeTKOB---WebNC/commit/af94982) (`Merge pull request #1 from USThienPhu/test/gate-bites-demo`).
  - **Liên kết lần chạy CI báo xanh:** [CI Run #5](https://github.com/USThienPhu/LeeTKOB---WebNC/actions/runs/`[RUN_ID_GREEN_LINT]`)

---

### 2.2. Trường hợp 2: Cố tình phá vỡ hợp đồng API (Contract Tests Bite)

- **Mục tiêu:** Chứng minh bộ kiểm thử hợp đồng (`review-queue.contract.test.ts`) trong CI phát hiện được sự vi phạm quy tắc sở hữu dữ liệu (Ownership Rule) đã cam kết tại `docs/contract/review-queue.md`.
- **Nhánh kiểm thử:** `test/contract-break-demo`
- **Pull Request (hoặc Commit vi phạm):** [PR / Commit `0c78977`](https://github.com/USThienPhu/LeeTKOB---WebNC/commit/0c7897781a68ffb799bc083ea2f77e4779e77f9b)

#### 🔴 Hành vi phá vỡ hợp đồng và phản ứng của CI:
- **Commit cố tình vi phạm:** [`0c78977`](https://github.com/USThienPhu/LeeTKOB---WebNC/commit/0c7897781a68ffb799bc083ea2f77e4779e77f9b)
  - *Thông điệp commit:* `test: intentionally break contract ownership rule by returning 200 instead of 403`
  - *Bản chất phá vỡ hợp đồng:* Trong `src/routes/review-queue.ts`, cố tình chỉnh sửa logic kiểm tra phân quyền để cho phép Trợ giảng thuộc lớp khác (`ta-class-2`) truy cập trái phép bài lab của `class-1` và nhận về HTTP `200 OK` thay vì bị từ chối với HTTP `403 Forbidden` RFC 9457 (`FORBIDDEN_LAB_ACCESS`).
  - *Hành vi của CI:* Bước `4. Automated tests (Vitest)` kích hoạt bộ kiểm thử hợp đồng. Bài test:
    > `Test 4: should reject with 403 Forbidden RFC 9457 when TA belongs to another class`  
    ngay lập tức bị thất bại (Expected: `403`, Received: `200`).
  - *Kết quả chốt chặn:* Lệnh test thất bại với exit code 1, workflow CI báo đỏ ❌ và ngăn chặn tuyệt đối mã nguồn vi phạm hợp đồng được tích hợp vào hệ thống.
  - **Liên kết lần chạy CI phát hiện vỡ hợp đồng:** [CI Run #7](https://github.com/USThienPhu/LeeTKOB---WebNC/actions/runs/`[RUN_ID_CONTRACT_BREAK]`)
  - **Liên kết PR vi phạm hợp đồng (nếu có mở PR):** [[COMMITTED ON BRANCH test/contract-break-demo]](https://github.com/USThienPhu/LeeTKOB---WebNC/tree/test/contract-break-demo)

---

## 3. Lần chạy CI ứng với Tag bài nộp `pa2` (Tag `pa2` CI Run)

- **Tên Tag nộp bài:** `pa2`
- **Commit được gắn Tag:** [`129f55a`](https://github.com/USThienPhu/LeeTKOB---WebNC/commit/129f55a5c03709f557c760b96a53f830ff112f47)
- **Liên kết lần chạy CI tương ứng:** [CI Run #42785627554 (Tag pa2)](https://github.com/USThienPhu/LeeTKOB---WebNC/actions/runs/42785627554)
- **Kết quả xác nhận:**
  - `npm run format:check`: PASS 
  - `npm run lint`: PASS 
  - `npm run typecheck`: PASS 
  - `npm run test`: PASS 100% (9/9 tests pass) 

---

## 4. Danh mục tài liệu đối soát đính kèm

| Tài liệu | Đường dẫn trong Repository | Mục đích thẩm định |
| :--- | :--- | :--- |
| **Quy tắc AI Agent** | [`PA02/AGENTS.md`](AGENTS.md) | Chỉ dẫn hệ thống, phân quyền 3 cấp (Allowed, Ask first, Never), 2 quy tắc bắt nguồn từ sự cố thực tế. |
| **Nhật ký kiểm toán AI** | [`PA02/AI-LOG.md`](AI-LOG.md) | Ghi nhận chi tiết, trung thực quá trình trao đổi và sử dụng công cụ AI theo format CSC13114. |
| **Hợp đồng API RFC 9457** | [`PA02/docs/contract/review-queue.md`](docs/contract/review-queue.md) | Đặc tả kỹ thuật chi tiết của endpoint `GET /labs/{labId}/review-queue` (Role, Ownership, Problem Details, Pagination). |
| **Kiểm thử hợp đồng** | [`PA02/tests/contract/review-queue.contract.test.ts`](tests/contract/review-queue.contract.test.ts) | 8 nhóm kiểm thử hợp đồng tự động chạy trong CI để chốt chặn mã nguồn tuân thủ hợp đồng. |
| **Tự đánh giá nhóm** | [`SELF_ASSESSMENT_REPORT.md`](SELF_ASSESSMENT_REPORT.md) | Bảng tự chấm điểm chi tiết 100/100 kèm bằng chứng đối soát theo Rubric PA#2. |
