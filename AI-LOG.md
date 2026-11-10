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


## 2026-11-06 — Soạn thảo hợp đồng API chi tiết cho endpoint GET /labs/{labId}/review-queue
Tool: Antigravity
Asked for: Tạo tệp hợp đồng API chi tiết đặt tại PA02/docs/contract/review-queue.md cho endpoint GET /labs/{labId}/review-queue theo chuẩn RFC-style, đáp ứng khung 21–25 điểm của Tiêu chí 5 Rubric PA#2.
Kept: Đầy đủ 7 phần chuẩn mực: Định danh endpoint (v1.0 Stable), cơ chế phân quyền Role & Ownership Rule (chỉ TA phụ trách lớp sở hữu lab), tham số phân trang & lọc (page, limit, status, verdict), cấu trúc JSON Schema 200 OK (ReviewQueueItem[] và pagination), chuẩn lỗi sự cố RFC 9457 (400, 401, 403, 404), tính chất tài nguyên khi thay đổi và các ví dụ concrete cURL / JSON.
Changed: Chi tiết hóa toàn bộ các mã lỗi sự cố RFC 9457 (type URI, title, status, detail, instance) cho từng kịch bản cụ thể (TA lớp khác, thiếu token, tham số sai) và chuẩn hóa danh mục enum lý do unsure (`model_unsure`, `schema_invalid`, `line_mismatch`, `timeout`, `cost_cap_exceeded`).
Rejected: Không dùng định nghĩa quyền truy cập chung chung "đã xác thực"; từ chối cho phép role student hoặc TA không phụ trách lớp truy cập; loại bỏ các mẫu payload lỗi tự do không tuân thủ RFC 9457.
By hand: Người dùng định hướng lựa chọn endpoint rà soát hàng đợi của TA, xác lập tiêu chuẩn chất lượng cao nhất của Rubric (21–25 điểm) và chỉ đạo cấu trúc các trường dữ liệu nghiệp vụ.


## 2026-11-06 — Bổ sung các quy tắc bắt nguồn từ sự cố thực tế vào AGENTS.md đạt tối đa Tiêu chí 1 Rubric PA#2
Tool: Antigravity
Asked for: Cập nhật AGENTS.md tại thư mục PA02 bổ sung tiểu mục 5.1 gồm 2 quy tắc có thể truy nguyên từ sự cố kỹ thuật thực tế (Prettier .prettierignore cho markdown và RFC 9457 Content-Type) kèm mã commit đối soát để đạt 15/15 điểm Tiêu chí 1 Rubric PA#2.
Kept: Toàn bộ 4 thành phần cốt lõi theo Rubric (Stack, Commands, Conventions, Never đặc thù cho LeeTKOB), phân quyền 3 cấp độ (Allowed, Ask first, Never), cùng cơ chế tự động ghi nhật ký AI-LOG.md và sinh lệnh git commit.
Changed: Thêm tiểu mục 5.1 vào AGENTS.md định nghĩa chi tiết 2 quy tắc bắt nguồn từ sự cố thực tế (Quy tắc 1: Cách ly tệp Markdown khỏi Prettier qua .prettierignore đối soát commit 6a2d1ca; Quy tắc 2: Chuẩn hóa bắt buộc Content-Type application/problem+json theo RFC 9457 đối soát commit 1a7a924); sắp xếp lại các quy ước chung vào tiểu mục 5.2.
Rejected: Loại bỏ hoàn toàn các quy tắc chung chung mang tính khẩu hiệu ("viết code sạch", "cẩn thận khi code") nhằm thỏa mãn triệt để tiêu chuẩn 13–15 điểm của Tiêu chí 1 trong Rubric PA#2.
By hand: Người dùng trực tiếp cung cấp bối cảnh sự cố kỹ thuật thực tế, đúc kết giải pháp và ấn định mã commit đối soát làm bằng chứng thẩm định cho buổi vấn đáp.


## 2026-11-07 — Triển khai Types và bộ xử lý lỗi RFC 9457 cho Review Queue (Giai đoạn 4.1)
Tool: Antigravity
Asked for: Triển khai Giai đoạn 4.1 cho PA02: Định nghĩa Types và bộ xử lý lỗi RFC 9457 bám sát hợp đồng docs/contract/review-queue.md, gồm src/types/review-queue.types.ts và src/errors/problem-details.ts, sau đó chạy typecheck kiểm chứng.
Kept: Toàn bộ cấu trúc kiểu dữ liệu bám sát hợp đồng (Verdict, UnsureReason, CodeEvidence, ReviewQueueItem, PaginationMetadata, ReviewQueueResponse, ProblemDetails, AuthUser) và hàm sendProblemDetails cùng các helper badRequest, unauthorized, forbidden, notFound.
Changed: Chuẩn hóa định dạng code qua Prettier để vượt qua chốt kiểm tra format:check; cấu hình đường dẫn import ESM (.js) tương thích chuẩn NodeNext module resolution.
Rejected: Không dùng định dạng phản hồi lỗi tùy ý; kiên quyết áp dụng Content-Type application/problem+json và 5 trường chuẩn hóa theo Quy tắc 2 của AGENTS.md.
By hand: Người dùng cung cấp danh mục cấu trúc types chi tiết và yêu cầu thiết kế bộ tạo mã lỗi chuyên biệt cho cột mốc PA#2.


## 2026-11-07 — Xây dựng Middleware phân quyền và Route cho endpoint GET /labs/:labId/review-queue (Giai đoạn 4.2)
Tool: Antigravity
Asked for: Triển khai Giai đoạn 4.2 cho PA02: Xây dựng Middleware phân quyền auth.middleware.ts và Route review-queue.ts cho endpoint GET /labs/:labId/review-queue bám sát docs/contract/review-queue.md, tích hợp vào app.ts và chạy kiểm tra lint, typecheck.
Kept: Cơ chế xác thực Bearer token với các test tokens (ta-class-1, ta-class-2, student-token), quy tắc xác thực quyền sở hữu bài lab (labId thuộc class-1), chặn truy cập trái phép từ sinh viên và TA lớp khác (403), thẩm định tham số truy vấn (page, limit, status, verdict trả về 400), danh sách mock 5 mục và logic phân trang chuẩn { items, pagination }.
Changed: Mở rộng interface Express Request để chứa thông tin người dùng đã xác thực; tắt cảnh báo eslint cục bộ cho namespace declaration merging; tự động định dạng mã nguồn với Prettier để vượt qua chốt kiểm tra format.
Rejected: Không dùng phản hồi lỗi JSON đơn giản mà tuân thủ tuyệt đối Problem Details RFC 9457; từ chối xử lý khi thiếu Bearer token hoặc query parameters ngoài phạm vi cho phép.
By hand: Người dùng cung cấp quy trình xử lý 3 bước chi tiết (Check Lab & Ownership, Validate Query, Mock Data & Slicing Pagination) và kịch bản phân quyền giữa các lớp học.


## 2026-11-07 — Xây dựng bộ kiểm thử hợp đồng toàn diện review-queue.contract.test.ts (Giai đoạn 4.3)
Tool: Antigravity
Asked for: Triển khai Giai đoạn 4.3 cho PA02: Viết bộ kiểm thử hợp đồng toàn diện tại tests/contract/review-queue.contract.test.ts với 8 nhóm ca kiểm thử độc lập (Happy path, Pagination, Filter, Ownership 403, Role violation 403, Missing token 401, Validation error 400, Not found 404), sau đó chạy npm run check đảm bảo xanh 100%.
Kept: Toàn bộ 8 nhóm kiểm thử hợp đồng sử dụng Vitest + Supertest bám sát đặc tả docs/contract/review-queue.md, assert chặt chẽ cấu trúc schema 200 OK, phân trang không trùng lặp, và định dạng phản hồi lỗi RFC 9457 (Content-Type application/problem+json).
Changed: Nâng cấp hàm forbidden và notFound trong problem-details.ts cùng route review-queue.ts để gắn URI type chuẩn xác (#FORBIDDEN_LAB_ACCESS, #FORBIDDEN_ROLE, #lab-not-found); chạy chốt kiểm tra tổng thể npm run check đạt trạng thái xanh 100% (cả format, lint, typecheck và 9/9 tests pass).
Rejected: Tuyệt đối không nới lỏng assertion hoặc sửa test giả mạo kết quả theo quy tắc Never của LeeTKOB; loại bỏ các bài test chỉ kiểm tra mã HTTP status mà bỏ qua body RFC 9457.
By hand: Người dùng định nghĩa danh sách 8 ca kiểm thử hợp đồng độc lập bám sát khung 13–15 điểm của Tiêu chí 6 trong Rubric PA#2.


## 2026-11-07 — Thiết lập quy trình CI GitHub Actions chặn merge khi lỗi kiểm soát chất lượng
Tool: Antigravity
Asked for: Tạo thư mục .github/workflows và tệp cấu hình CI GitHub Actions tại .github/workflows/ci.yml cho dự án LeeTKOB theo chuẩn Rubric PA#2: kích hoạt khi push/PR vào main, có concurrency, chạy trên ubuntu-latest, Node.js 20, npm ci, và thực thi 4 bước kiểm tra chất lượng.
Kept: Cấu hình kích hoạt trên nhánh main (push và pull_request), cơ chế concurrency tự hủy build cũ (cancel-in-progress: true), môi trường ubuntu-latest với Node.js 20 và cache npm, lệnh cài đặt sạch npm ci, cùng 4 bước kiểm tra chất lượng độc lập tuần tự (format:check, lint, typecheck, test).
Changed: Thiết lập cấu hình defaults.run.working-directory: PA02 và cache-dependency-path: PA02/package-lock.json để luồng CI thực thi chính xác trong thư mục mã nguồn PA02 của repository.
Rejected: Không dùng lệnh cài đặt npm install tùy tiện trong môi trường CI mà bắt buộc dùng npm ci để đảm bảo tính tái lập (reproducibility); không gom gộp 4 bước kiểm tra thành 1 lệnh duy nhất trong CI để dễ dàng xác định chính xác bước kiểm tra bị đỏ khi xảy ra lỗi.
By hand: Người dùng chỉ định yêu cầu cụ thể về cấu hình workflow, tên workflow, điều kiện trigger và thứ tự 4 bước kiểm tra chất lượng bắt buộc của Rubric.


## 2026-11-10 — Khởi tạo tệp báo cáo PA2.md và thiết lập khung liên kết minh chứng kiểm soát chất lượng
Tool: Antigravity
Asked for: Dựa vào đề bài yêu cầu, viết tệp PA2.md ở thư mục gốc và chỉ ra các link PR, minh chứng còn thiếu cần người dùng cung cấp để hoàn thiện.
Kept: Cấu trúc báo cáo chuẩn mực gồm 4 phần: Thông tin repo & branch protection, minh chứng chốt chặn hoạt động (PR #1 lint red/green check, commit 0c78977 contract break red check), lần chạy CI ứng với tag pa2, và bảng đối soát các tài liệu nộp bài.
Changed: Điền sẵn các liên kết commit và PR đã truy nguyên được từ lịch sử Git thực tế (PR #1, commit 64c56f9, c8f9ecb, af94982, và commit 0c78977 trên nhánh test/contract-break-demo); đặt các placeholder có định dạng rõ ràng cho các link GitHub Actions run và ảnh chụp màn hình branch protection.
Rejected: Không điền các URL giả định/bịa đặt không có thực; giữ nguyên liên kết tới các commit SHA thực tế trên repository https://github.com/USThienPhu/LeeTKOB---WebNC.
By hand: Người dùng yêu cầu tạo file PA2.md và phối hợp cung cấp các link minh chứng từ GitHub Actions.


## 2026-11-10 — Khởi tạo tệp báo cáo tự đánh giá SELF_ASSESSMENT_REPORT.md theo mẫu chuẩn môn học
Tool: Antigravity
Asked for: Dựa vào Template/SELF_ASSESSMENT_REPORT template.md, viết bản SELF_ASSESSMENT_REPORT.md theo 7 tiêu chí của Rubric PA#2 và lưu vào thư mục PA02.
Kept: Cấu trúc bảng điểm tự đánh giá đối soát 7 tiêu chí theo Rubric PA#2, mức điểm tự nhận 100/100, cùng các bằng chứng tham chiếu cụ thể tới commit hash, file tài liệu, hợp đồng API và bộ kiểm thử.
Changed: Bổ sung chi tiết 2 mục bắt buộc về tính trung thực học thuật (What I did not manage: chưa có database thật và route publish; What I would do differently: thêm .prettierignore sớm và cấu hình husky pre-commit hook).
Rejected: Không để trống mục What I did not manage theo cảnh báo trừ điểm trong template; không đưa ra các bằng chứng chung chung thiếu căn cứ đối soát.
By hand: Người dùng yêu cầu áp dụng template chuẩn của môn học và định hướng điểm tự đánh giá 100/100.


## 2026-11-10 — Cập nhật liên kết commit và CI run ứng với tag pa2 vào PA2.md
Tool: Antigravity
Asked for: Cập nhật liên kết commit và CI run ứng với tag pa2 (commit 129f55a5c03709f557c760b96a53f830ff112f47 và run 42785627554) vào tệp PA2.md.
Kept: Cấu trúc toàn bộ báo cáo minh chứng PA2.md và thông tin đối soát của các mục kiểm tra khác.
Changed: Thay thế placeholder tại Mục 3 của PA2.md bằng commit SHA 129f55a và liên kết GitHub Actions run 42785627554 tương ứng với tag nộp bài pa2.
Rejected: Không dùng link run giả lập; áp dụng chính xác các liên kết thực tế trên GitHub do người dùng cung cấp.
By hand: Người dùng trực tiếp gắn tag pa2 trên GitHub remote và cung cấp liên kết commit SHA cùng mã chạy run ID của GitHub Actions.
