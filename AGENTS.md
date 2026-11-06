# SYSTEM INSTRUCTIONS FOR AI AGENTS (LeeTKOB Project - PA02)

> **Tài liệu hướng dẫn hệ thống (System Instructions) dành cho mọi AI Agent** (Antigravity, Claude Code, Cursor, GitHub Copilot, v.v.) khi làm việc trong thư mục `PA02` và dự án **LeeTKOB** (CSC13114).
> Bất kỳ AI Agent nào khi được khởi tạo hoặc bắt đầu tương tác với người dùng trong phạm vi thư mục này **bắt buộc phải đọc, tuân thủ và thi hành nghiêm ngặt** các chỉ dẫn dưới đây.

---

## 1. QUY TẮC BẮT BUỘC: TỰ ĐỘNG GHI AUDIT LOG (`AI-LOG.md`)

Mỗi khi người dùng trao đổi, yêu cầu hỗ trợ hoặc giao nhiệm vụ cho AI Agent:
1. **Agent bắt buộc phải tự động ghi nhận tiến trình / nội dung công việc** và cập nhật trực tiếp vào file:
   `PA02/AI-AUDIT/AI-LOG.md`
2. **Thời điểm cập nhật:** Ngay sau khi hoàn thành nhiệm vụ, hoặc trước khi trả lời phản hồi cuối cùng cho người dùng trong phiên làm việc/nhiệm vụ đó.
3. **Format bắt buộc:** Tuân thủ chuẩn mực đánh giá môn học (được quy định tại `Template/AI-LOG-template.md` và Rubric PA#2 Tiêu chí 7):

```markdown
## <YYYY-MM-DD> — <Mô tả ngắn gọn công việc đang thực hiện>
Tool: <Tên công cụ/AI đang dùng, ví dụ: Antigravity / Claude Code / Cursor / Copilot / none>
Asked for: <Nhiệm vụ người dùng giao cho Agent, tóm tắt chính xác trong 1 câu>
Kept: <Những gì Agent tạo ra mà người dùng/hệ thống giữ lại nguyên vẹn>
Changed: <Những gì đã được viết lại, tinh chỉnh hoặc sửa chữa, và lý do vì sao>
Rejected: <Những gì bị loại bỏ hoàn toàn, không chấp nhận, và lý do tại sao>
By hand: <Những phần người dùng tự viết hoặc can thiệp thủ công>
```

### Nguyên tắc ghi Log:
- **Trung thực và cụ thể:** Tuyệt đối không ghi chung chung (như *"Đã làm xong frontend"* hay *"Fix bug"*). Dòng `Rejected` và `By hand` là hai mục được thẩm định kỹ nhất trong các buổi vấn đáp/oral exam.
- **Tính lũy kế:** Ghi thêm mục mới (append) vào cuối hoặc đầu file log theo thứ tự thời gian rõ ràng, không làm mất các bản ghi nhật ký trước đó.

---

## 2. PHÂN QUYỀN TRỢ LÝ AI (PERMISSIONS & SECRETS)

Agent phải hoạt động theo 3 cấp độ phân quyền nghiêm ngặt sau:

### 🟢 Allowed (Được phép tự động thực hiện)
- Đọc mã nguồn, tài liệu dự án, hợp đồng API (`docs/contract/*.md`), và các file rubric trong workspace.
- Chạy các lệnh kiểm tra cục bộ: format, lint, typecheck, unit tests và contract tests trong môi trường sandbox cô lập.
- Tạo, chỉnh sửa mã nguồn tính năng và mã kiểm thử theo yêu cầu rõ ràng của người dùng.
- Tự động ghi chép và cập nhật tiến trình vào `PA02/AI-AUDIT/AI-LOG.md`.

### 🟡 Ask First (Phải hỏi ý kiến người dùng trước khi thực hiện)
- Sửa đổi cấu hình CI/CD (`.github/workflows/*`).
- Thay đổi schema hợp đồng API (API contracts) đã cam kết.
- Thêm mới, xóa bỏ hoặc nâng cấp các thư viện/dependencies bên ngoài (`package.json`, `requirements.txt`, v.v.).
- Xóa bỏ tập tin, thay đổi cấu trúc thư mục cốt lõi hoặc chỉnh sửa các branch được bảo vệ (protected branches).

### 🔴 Never (Tuyệt đối nghiêm cấm)
- **Không đưa thông tin bí mật (secrets/API keys) vào mã nguồn, lịch sử git, hoặc lời nhắc (prompts):** Mọi key phải cấu hình qua biến môi trường (`.env` đã được ignore và có `.env.example` mẫu không chứa key thật).
- **Không gọi API mô hình LLM thật trong các bài kiểm thử tự động (Unit/Integration/Contract Tests):** Tất cả các bài test trong CI và local gate phải sử dụng mocks/stubs/fixtures để tránh chi phí, bảo mật dữ liệu và ngăn chặn hiện tượng flaky test.
- **Không bao giờ chỉnh sửa bài test, dữ liệu đánh giá (eval data) hoặc nhãn kiểm thử (labels) để làm cho bài kiểm tra vượt qua (passing artificially):** Mã nguồn phải sửa để thỏa mãn test; không được làm ngược lại trừ khi hợp đồng (contract) được người dùng chính thức cập nhật.
- **Không bypass chốt kiểm soát của con người (Human gate):** Không bao giờ tự động chuyển trạng thái bài chấm sang công bố (`publish`) điểm số mà không có sự phê duyệt tường minh từ Trợ giảng (TA).
- **Không gửi thông tin định danh sinh viên (tên, MSSV, comment mã nguồn) đến mô hình ngôn ngữ lớn.**

---

## 3. TECH STACK & ARCHITECTURE (LeeTKOB)

Dự án **LeeTKOB** là hệ thống thẩm định và rà soát ràng buộc bài tập lập trình C++ cho Trợ giảng (TA) trước khi công bố điểm:
- **Ngôn ngữ & Runtime:** Node.js / TypeScript (hoặc Python tương thích theo dự án của nhóm).
- **Quality Gates:** 
  - Linter: ESLint / Ruff / Biome
  - Formatter: Prettier / Black
  - Type Checker: `tsc --noEmit` / `mypy`
  - Test Runner: Vitest / Jest / Pytest
- **Tiêu chuẩn API:** RESTful API tuân thủ đặc tả lỗi sự cố RFC 9457 (Problem Details).
- **Cơ chế:** Phân trang (Pagination) đối với danh sách và tính lũy thừa (Idempotency) đối với các hành động thay đổi trạng thái (Create, Submit, Publish, Appeal).

---

## 4. COMMANDS & QUALITY GATE

Mỗi thao tác kiểm tra phải chạy được bằng **một lệnh duy nhất**, bảo đảm giống hệt nhau ở cả môi trường cục bộ (local) và trên CI:

- **Chạy toàn bộ Quality Gate:**
  ```bash
  npm run check  # hoặc lệnh tương ứng: lint + format:check + typecheck + test
  ```
- **Lint:** `npm run lint`
- **Format check:** `npm run format:check`
- **Type check:** `npm run typecheck`
- **Unit & Contract tests:** `npm run test`

Agent không được coi một nhiệm vụ là "hoàn tất" nếu lệnh kiểm tra chất lượng còn báo lỗi đỏ (red check).

---

## 5. CONVENTIONS & BEST PRACTICES

1. **Commit Message:** Tuân thủ Conventional Commits:
   - `feat(...)`, `fix(...)`, `test(...)`, `chore(...)`, `docs(...)`
2. **Quy tắc bảo vệ Contract:**
   - Contract tại `docs/contract/<endpoint>.md` là chân lý duy nhất (Single Source of Truth).
   - Khi có sự sai lệch giữa mã nguồn và Contract, mã nguồn phải được sửa để tuân thủ Contract.
3. **Audit Trail:**
   - Mọi thay đổi logic quan trọng phải có bằng chứng đối soát trong `PA02/AI-AUDIT/AI-LOG.md`.
