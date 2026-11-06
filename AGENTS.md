# SYSTEM INSTRUCTIONS FOR AI AGENTS (LeeTKOB Project - PA02)

> **Tài liệu hướng dẫn hệ thống (System Instructions) dành cho mọi AI Agent** (Antigravity, Claude Code, Cursor, GitHub Copilot, v.v.) khi làm việc trong thư mục `PA02` và dự án **LeeTKOB** (CSC13114).
> Bất kỳ AI Agent nào khi được khởi tạo hoặc bắt đầu tương tác với người dùng trong phạm vi thư mục này **bắt buộc phải đọc, tuân thủ và thi hành nghiêm ngặt** các chỉ dẫn dưới đây.

---

## 1. QUY TẮC CỐT LÕI: TỰ ĐỘNG TRÍCH XUẤT VÀ GHI AUDIT LOG (`AI-LOG.md`)

Mỗi khi người dùng trao đổi, gửi phản hồi hoặc giao nhiệm vụ cho AI Agent, **Agent có trách nhiệm tự động thu thập thông tin phiên làm việc, chuẩn hóa theo template môn học và ghi nối tiếp (append) vào file**:
📁 `PA02/AI-AUDIT/AI-LOG.md`

### 1.1. Căn cứ cấu trúc chuẩn từ `Template/AI-LOG-template.md`
Quy trình ghi log dựa trên 5 nguyên tắc đạo đức học thuật của khóa học:
1. **AI được cho phép và khuyến khích:** Khai báo trung thực 80% đóng góp của AI và hiểu rõ mã nguồn sẽ đạt điểm cao hơn việc giấu giếm rồi lúng túng trong buổi vấn đáp (oral exam).
2. **Khai báo minh bạch tại file log này:** Đây là bằng chứng thẩm định (accountability), không phải là một đoạn transcript thô.
3. **Bạn sở hữu mã nguồn:** Lời biện hộ *"Do AI tự sinh ra"* sẽ không được chấp nhận.
4. **Vấn đáp trực tiếp:** Bất kỳ dòng code nào sinh viên/nhóm không giải thích được sẽ nhận 0 điểm.
5. **Tuyệt đối không đưa secrets vào prompt:** Không API key, không dữ liệu người dùng thật, không bài làm của bạn học.

---

### 1.2. Format mục ghi (Entry Format)
Mỗi mục log bắt buộc phải có đầy đủ 7 trường thông tin sau:

```markdown
## <YYYY-MM-DD> — <what you were working on>
Tool: <Claude Code / Copilot / Cursor / Antigravity / something else / none>
Asked for: <the task you gave it, in one sentence>
Kept: <what you took as it came>
Changed: <what you rewrote, and why>
Rejected: <what you threw away, and why>
By hand: <the parts you wrote yourself>
```

---

### 1.3. Hướng dẫn chi tiết Agent tự động trích xuất & điền thông tin

Khi phiên làm việc hoặc nhiệm vụ hoàn tất, Agent tự động phân tích ngữ cảnh hội thoại để trích xuất:

| Trường thông tin | Quy tắc trích xuất và cách điền của Agent |
| :--- | :--- |
| **`## <YYYY-MM-DD> — <task>`** | - Lấy ngày tháng hiện tại theo định dạng chuẩn ISO `YYYY-MM-DD`.<br>- Tóm tắt tên tính năng/đầu việc trong 3–8 từ (ví dụ: `setup contract tests for submission endpoint`, `configure quality gate CI`). |
| **`Tool:`** | Tên công cụ / agent đang tương tác (ví dụ: `Antigravity`, `Claude Code`, `Cursor`, `Copilot`, hoặc `none`). |
| **`Asked for:`** | Đọc yêu cầu của người dùng (`USER_REQUEST`), cô đọng lại thành **đúng 1 câu** nêu rõ mục tiêu chính xác mà người dùng mong muốn. |
| **`Kept:`** | Liệt kê các đoạn mã, cấu hình, logic hoặc tài liệu do Agent tạo ra mà hệ thống/người dùng chấp nhận giữ nguyên vẹn. |
| **`Changed:`** | Liệt kê những phần mã/ý tưởng ban đầu đã bị chỉnh sửa, tái cấu trúc hoặc tinh chỉnh lại. **Bắt buộc nêu rõ lý do** (ví dụ: *"Sửa lại assertion từ giá trị chung chung thành giá trị cụ thể theo RFC 9457 để test có thể fail"*). |
| **`Rejected:`** | Liệt kê những đề xuất, file hoặc đoạn mã mà Agent đưa ra nhưng bị loại bỏ hoàn toàn. **Bắt buộc nêu lý do** (ví dụ: *"Bỏ đề xuất mock hàm kiểm tra quyền vì rubric yêu cầu contract test phải kiểm tra quyền thực tế"*). *(Đây là một trong 2 dòng được người chấm thi soi kỹ nhất)*. |
| **`By hand:`** | Liệt kê những phần con người (người dùng) trực tiếp viết, hoặc các tham số/ràng buộc cốt lõi mà người dùng tự tay chỉ định tường minh. *(Dòng được thẩm định kỹ nhất tại buổi vấn đáp)*. |

> ⚠️ **Lưu ý chống "Weak Log":**
> Tuyệt đối không sinh log sơ sài như:
> ```markdown
> ## Week 3
> Used AI for the frontend. Fixed some things.
> ```
> Mọi mục log yếu, không có dữ kiện đối soát hoặc để trống `Rejected` / `By hand` mà không có lý do sẽ khiến nhóm bị trừ điểm tiêu chí `AI-LOG.md` theo rubric.

---

### 1.4. Quy trình ghi Append (Nối tiếp) vào `PA02/AI-AUDIT/AI-LOG.md`

1. **Thời điểm kích hoạt:** Tự động thực hiện ở cuối mỗi task/phiên trao đổi, trước khi đưa ra câu trả lời tổng kết cho người dùng.
2. **Kỹ thuật ghi nối tiếp:**
   - Đọc nội dung hiện có của file `PA02/AI-AUDIT/AI-LOG.md`.
   - Nếu file chưa có tiêu đề header của môn học, khởi tạo tiêu đề header.
   - Thêm 1 dòng trống hoặc phân cách `\n\n` và ghi nội dung entry mới vào cuối file (append).
   - **Tuyệt đối KHÔNG ghi đè (overwrite)** làm mất các mục log đã ghi trước đó.

---

## 2. PHÂN QUYỀN TRỢ LÝ AI (PERMISSIONS & SECRETS)

Agent phải hoạt động theo 3 cấp độ phân quyền nghiêm ngặt sau:

### 🟢 Allowed (Được phép tự động thực hiện)
- Đọc mã nguồn, tài liệu dự án, hợp đồng API (`docs/contract/*.md`), và các file rubric trong workspace.
- Chạy các lệnh kiểm tra cục bộ: format, lint, typecheck, unit tests và contract tests trong môi trường sandbox cô lập.
- Tạo, chỉnh sửa mã nguồn tính năng và mã kiểm thử theo yêu cầu rõ ràng của người dùng.
- Tự động trích xuất và ghi nối tiếp nhật ký vào `PA02/AI-AUDIT/AI-LOG.md`.

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
