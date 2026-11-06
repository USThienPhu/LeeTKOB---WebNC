# LeeTKOB API Contract: GET /labs/{labId}/review-queue

- **Phiên bản hợp đồng:** `v1.0.0`
- **Ngày ban hành:** `2026-11-06`
- **Trạng thái:** `Stable (Chính thức)`
- **Tiêu chuẩn tuân thủ:**
  - HTTP Semantics: [RFC 9110](https://www.rfc-editor.org/rfc/rfc9110)
  - Problem Details for HTTP APIs: [RFC 9457](https://www.rfc-editor.org/rfc/rfc9457)
  - Date & Time Format: [RFC 3339 / ISO-8601](https://www.rfc-editor.org/rfc/rfc3339)
  - Identifier Format: [RFC 4122 (UUIDv4)](https://www.rfc-editor.org/rfc/rfc4122)

---

## 1. Tóm tắt nghiệp vụ (Business Context)

Endpoint `GET /labs/{labId}/review-queue` cung cấp danh sách các bài làm cần được Trợ giảng (TA) thẩm định thủ công trong quy trình chấm bài và rà soát ràng buộc C++ trước khi công bố điểm chính thức (`Publish`).

Theo thiết kế 3 lớp của LeeTKOB (Hard Rules $\rightarrow$ LLM Semantic Review $\rightarrow$ Human Gate), hàng đợi `Review Queue` tập hợp:
1. **100% các phán quyết vi phạm (`verdict: "violation"`):** Phát hiện bởi Hard Rules (AST) hoặc LLM Semantic Review.
2. **100% các phán quyết không chắc chắn (`verdict: "unsure"`):** Phát sinh khi LLM không thể kết luận, schema trả về không hợp lệ, lệch dòng trích dẫn bằng chứng (`line_mismatch`), quá thời gian xử lý (`timeout`), hoặc vượt ngưỡng ngân sách bảo vệ (`cost_cap_exceeded`).
3. **10% các phán quyết đạt (`verdict: "pass"`):** Được hệ thống bốc thăm ngẫu nhiên đồng đều (làm tròn lên: $\lceil N_{pass} \times 0.1 \rceil$) để TA kiểm toán chất lượng chéo (spot-check), bảo đảm không có trường hợp sinh viên qua mặt hệ thống rà soát.

> **Quy tắc vàng:** Điểm số của bài thực hành **chỉ có thể được công bố (Publish)** khi hàng đợi không còn bất kỳ mục nào ở trạng thái `pending`.

---

## 2. Xác thực, Phân quyền & Quy tắc sở hữu (Roles & Ownership Rule)

Bản hợp đồng áp dụng nguyên tắc kiểm soát truy cập tối thiểu (Least Privilege) với các quy định nghiêm ngặt:

### 2.1. Xác thực (Authentication)
Mọi yêu cầu gửi tới endpoint bắt buộc phải đính kèm JSON Web Token (JWT) hợp lệ thông qua HTTP Authorization header:
```http
Authorization: Bearer <jwt-token>
```

### 2.2. Phân quyền vai trò (Role-Based Access Control)
- **Được phép (`Allowed`):** Người dùng mang vai trò Trợ giảng (`role: "ta"`).
- **Từ chối (`Forbidden - 403`):** Người dùng mang vai trò Sinh viên (`role: "student"`). Sinh viên không có quyền xem trước hàng đợi rà soát bài tập của lớp trước khi công bố điểm.

### 2.3. Quy tắc sở hữu dữ liệu (Ownership Rule)
- Mỗi bài thực hành (`labId`) trực thuộc một lớp học cụ thể (`courseClassId`).
- Trợ giảng chỉ được cấp quyền quản lý và rà soát các bài thực hành thuộc các lớp học mà mình được phân công phụ trách (`ta.assignedClassIds.includes(lab.courseClassId)`).
- **Xử lý vi phạm:** Nếu một TA cố tình truy cập hàng đợi của một bài lab thuộc lớp khác mà mình không phụ trách, hệ thống **bắt buộc từ chối với mã HTTP `403 Forbidden`** (kèm mã lỗi nội bộ `FORBIDDEN_LAB_ACCESS`), tuyệt đối không để lộ dữ liệu sinh viên của lớp khác.

---

## 3. Định nghĩa yêu cầu (Request Definition)

- **HTTP Method:** `GET`
- **URI Path Template:** `/labs/{labId}/review-queue`

### 3.1. Tham số đường dẫn (Path Parameters)

| Tên tham số | Kiểu dữ liệu | Bắt buộc | Định dạng & Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- | :--- |
| `labId` | `string` | **Có** | UUIDv4 (`^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$`) | Mã định danh duy nhất của bài thực hành cần duyệt hàng đợi. |

### 3.2. Tham số truy vấn (Query Parameters)

Hệ thống cung cấp cơ chế phân trang (Pagination) và lọc (Filtering) chuẩn:

| Tên tham số | Kiểu dữ liệu | Mặc định | Ràng buộc giá trị | Mô tả |
| :--- | :--- | :--- | :--- | :--- |
| `page` | `integer` | `1` | Số nguyên $\ge 1$ | Số thứ tự trang muốn lấy dữ liệu. |
| `limit` | `integer` | `20` | Số nguyên trong khoảng $[1, 100]$ | Số lượng mục tối đa trả về trên một trang. |
| `status` | `string` | `pending` | Enum: `["pending", "reviewed", "all"]` | Lọc theo trạng thái xử lý của TA: <br>- `pending`: Mục đang chờ TA duyệt.<br>- `reviewed`: Mục TA đã duyệt xong.<br>- `all`: Cả hai trạng thái. |
| `verdict` | `string` | `all` | Enum: `["violation", "unsure", "pass", "all"]` | Lọc theo kết quả phán quyết của hệ thống rà soát: <br>- `violation`: Vi phạm ràng buộc.<br>- `unsure`: Không chắc chắn/lỗi xử lý.<br>- `pass`: Bài đạt (mẫu 10% kiểm toán).<br>- `all`: Tất cả phán quyết. |

### 3.3. Yêu cầu Headers

```http
Authorization: Bearer <valid-ta-jwt>
Accept: application/json, application/problem+json
```

---

## 4. Cấu trúc phản hồi thành công (Response 200 OK)

- **HTTP Status:** `200 OK`
- **Header:** `Content-Type: application/json; charset=utf-8`

### 4.1. Chi tiết Schema đối tượng phản hồi

Dữ liệu phản hồi gồm 2 trường cấp cao nhất: `items` (danh sách mục cần duyệt) và `pagination` (thông tin phân trang).

#### Cấu trúc `ReviewQueueItem` (Mỗi phần tử trong mảng `items`):

| Tên trường | Kiểu dữ liệu | Nullable | Mô tả & Ràng buộc |
| :--- | :--- | :--- | :--- |
| `id` | `string` | Không | UUIDv4 định danh bản ghi mục duyệt trong hàng đợi. |
| `submissionId` | `string` | Không | UUIDv4 định danh bài nộp của sinh viên. |
| `studentAnonymousId` | `string` | Không | Mã định danh ẩn danh của sinh viên (định dạng `anon-[a-z0-9]{8}`) nhằm bảo đảm tính công tâm khi TA chấm bài. |
| `constraintId` | `string` | Không | Mã định danh ràng buộc (ví dụ: `"C1"`, `"C2"`, `"NO_STD_SORT"`). |
| `constraintDescription`| `string` | Không | Nội dung chi tiết ràng buộc (ví dụ: *"Bắt buộc cài đặt Merge Sort; cấm gọi std::sort"*). |
| `verdict` | `string` | Không | Enum: `"violation"` \| `"unsure"` \| `"pass"`. |
| `suggestedDeduction` | `number` | Không | Mức điểm trừ cấu hình từ trước của TA cho ràng buộc này ($0.0 \le x \le 10.0$). Mô hình không tự ý đổi điểm trừ này. |
| `evidence` | `array` | Không | Danh sách dòng mã nguồn vi phạm làm bằng chứng. Rỗng `[]` nếu verdict là `pass` hoặc `unsure` do timeout/schema. |
| `evidence[].line` | `integer` | Không | Số thứ tự dòng mã nguồn vi phạm ($\ge 1$). |
| `evidence[].text` | `string` | Không | Nội dung trích dẫn chính xác tuyệt đối của dòng mã vi phạm. |
| `unsureReason` | `string` | **Có** | Bắt buộc `null` nếu verdict $\ne$ `"unsure"`. Nếu `"unsure"`, giá trị là enum: <br>- `"model_unsure"`: LLM không đủ cơ sở kết luận.<br>- `"schema_invalid"`: Kết quả LLM sai schema JSON.<br>- `"line_mismatch"`: Dòng trích dẫn không khớp mã nguồn nộp.<br>- `"timeout"`: Quá thời gian gọi LLM (thường > 15s).<br>- `"cost_cap_exceeded"`: Đã chạm trần chi tiêu bảo vệ. |
| `status` | `string` | Không | Enum: `"pending"` (chờ duyệt) \| `"reviewed"` (đã duyệt). |
| `reviewedBy` | `string` | **Có** | UUIDv4 của TA đã xử lý mục này, hoặc `null` nếu đang `pending`. |
| `reviewedAt` | `string` | **Có** | Thời điểm duyệt theo chuẩn ISO-8601 UTC (ví dụ: `"2026-11-06T15:30:00.000Z"`), hoặc `null` nếu đang `pending`. |

#### Cấu trúc `pagination` (Phân trang):

| Tên trường | Kiểu dữ liệu | Mô tả |
| :--- | :--- | :--- |
| `page` | `integer` | Số thứ tự trang hiện tại ($\ge 1$). |
| `limit` | `integer` | Kích thước trang hiện tại ($1 \le x \le 100$). |
| `totalItems` | `integer` | Tổng số lượng mục thỏa mãn tiêu chí lọc ($\ge 0$). |
| `totalPages` | `integer` | Tổng số trang ($\lceil totalItems / limit \rceil$, tối thiểu `0` nếu không có dữ liệu). |
| `hasNextPage` | `boolean` | `true` nếu `page < totalPages`, ngược lại `false`. |
| `hasPrevPage` | `boolean` | `true` nếu `page > 1` và `totalPages > 0`, ngược lại `false`. |

---

## 5. Mô hình xử lý lỗi (RFC 9457 Problem Details)

Mọi phản hồi lỗi HTTP ($4xx, 5xx$) **bắt buộc** phải tuân thủ chuẩn [RFC 9457](https://www.rfc-editor.org/rfc/rfc9457).

- **Header bắt buộc:** `Content-Type: application/problem+json; charset=utf-8`

### 5.1. Cấu trúc trường tiêu chuẩn của RFC 9457

```json
{
  "type": "https://leetkob.hcmus.edu.vn/probs/<error-code>",
  "title": "<Mô tả ngắn gọn, dễ hiểu về nhóm lỗi>",
  "status": <Mã trạng thái HTTP nguyên>,
  "detail": "<Mô tả chi tiết nguyên nhân sự cố của request cụ thể>",
  "instance": "/labs/<labId>/review-queue?<query>"
}
```

### 5.2. Danh mục mã lỗi và bảng đối soát

| Mã HTTP | Thuộc tính `type` | Thuộc tính `title` | Kịch bản xảy ra lỗi |
| :--- | :--- | :--- | :--- |
| `400 Bad Request` | `.../probs/invalid-query-parameter` | Invalid Query Parameter | Tham số query sai kiểu hoặc ngoài phạm vi (`page < 1`, `limit > 100`, `verdict="invalid"`). |
| `400 Bad Request` | `.../probs/invalid-path-parameter` | Invalid Path Parameter | Tham số `labId` không tuân thủ định dạng UUIDv4. |
| `401 Unauthorized` | `.../probs/missing-token` | Authentication Token Required | Request không gửi kèm header `Authorization: Bearer <token>`. |
| `401 Unauthorized` | `.../probs/invalid-token` | Invalid Or Expired Token | Token Bearer hết hạn, bị giả mạo hoặc chữ ký JWT không hợp lệ. |
| `403 Forbidden` | `.../probs/student-access-forbidden` | Forbidden Role | Người gọi mang vai trò Sinh viên (`student`) không được phép xem hàng đợi TA. |
| `403 Forbidden` | `.../probs/forbidden-lab-access` | Unauthorized Class Access | Người gọi là TA nhưng không phụ trách lớp học sở hữu bài lab này. |
| `404 Not Found` | `.../probs/lab-not-found` | Lab Not Found | Không tìm thấy bài lab với mã `labId` được chỉ định trong cơ sở dữ liệu. |
| `500 Internal Server Error` | `.../probs/internal-server-error` | Internal Server Error | Lỗi cơ sở dữ liệu hoặc sự cố máy chủ nội bộ ngoài ý muốn. |

---

## 6. Tính chất tài nguyên & Điều gì xảy ra khi thay đổi (Resource Concurrency & Mutation)

1. **Tính an toàn và lũy thừa (Safe & Idempotent):**
   - Lệnh `GET /labs/{labId}/review-queue` là thao tác an toàn (Safe) và lũy thừa (Idempotent). Việc gọi liên tiếp không làm thay đổi trạng thái của hệ thống.
2. **Biến động danh sách khi TA tiến hành duyệt (Concurrent Mutation):**
   - Khi một TA xác nhận duyệt một mục trong hàng đợi (qua endpoint `POST /labs/{labId}/review-queue/{itemId}/decision`), mục đó được chuyển trạng thái từ `pending` sang `reviewed`.
   - Các lệnh `GET` tiếp theo với bộ lọc mặc định `status=pending` sẽ tự động giảm `totalItems` đi 1 và loại mục đó khỏi danh sách chờ.
3. **Chốt chặn công bố điểm (Publish Gate):**
   - Khi TA thực hiện thao tác `POST /labs/{labId}/publish`:
     + Hệ thống sẽ kiểm tra: nếu `GET /labs/{labId}/review-queue?status=pending` có `totalItems > 0`, yêu cầu `publish` sẽ bị từ chối với lỗi `409 Conflict`.
     + Sau khi publish thành công, toàn bộ bài lab chuyển sang trạng thái `published`, hàng đợi hoàn tất nhiệm vụ rà soát.

---

## 7. Các ví dụ cụ thể (Concrete Examples)

### 7.1. Ví dụ cURL Request hợp lệ
```bash
curl -X GET "https://api.leetkob.local/labs/7c9e6679-7425-40de-944b-e07fc1f90ae7/review-queue?page=1&limit=20&status=pending&verdict=all" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0YTEiLCJyb2xlIjoidGEifQ..." \
  -H "Accept: application/json"
```

---

### 7.2. Ví dụ Response thành công (`200 OK`)

```json
{
  "items": [
    {
      "id": "e4f8d9b2-3c1a-4d5e-8f2a-1b3c5d7e9f01",
      "submissionId": "a1b2c3d4-e5f6-4a5b-8c7d-9e0f1a2b3c4d",
      "studentAnonymousId": "anon-k8f9a2b1",
      "constraintId": "C1",
      "constraintDescription": "Bắt buộc sử dụng thuật toán Merge Sort; cấm gọi trực tiếp std::sort",
      "verdict": "violation",
      "suggestedDeduction": 3.0,
      "evidence": [
        {
          "line": 42,
          "text": "std::sort(arr.begin(), arr.end());"
        }
      ],
      "unsureReason": null,
      "status": "pending",
      "reviewedBy": null,
      "reviewedAt": null
    },
    {
      "id": "f5a9e0c3-4d2b-5e6f-9a3b-2c4d6e8f0a12",
      "submissionId": "b2c3d4e5-f6a7-5b6c-9d8e-0f1a2b3c4d5e",
      "studentAnonymousId": "anon-m3x7p9q2",
      "constraintId": "C2",
      "constraintDescription": "Hàm sắp xếp bắt buộc phải sử dụng đệ quy để chia mảng",
      "verdict": "unsure",
      "suggestedDeduction": 2.0,
      "evidence": [],
      "unsureReason": "line_mismatch",
      "status": "pending",
      "reviewedBy": null,
      "reviewedAt": null
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "totalItems": 2,
    "totalPages": 1,
    "hasNextPage": false,
    "hasPrevPage": false
  }
}
```

---

### 7.3. Ví dụ Phản hồi lỗi `403 Forbidden` (TA truy cập trái lớp)

```http
HTTP/1.1 403 Forbidden
Content-Type: application/problem+json; charset=utf-8

{
  "type": "https://leetkob.hcmus.edu.vn/probs/forbidden-lab-access",
  "title": "Unauthorized Class Access",
  "status": 403,
  "detail": "Teaching Assistant 'ta_user_02' is not assigned to course class '2609-AWAD-23/3' which owns lab '7c9e6679-7425-40de-944b-e07fc1f90ae7'.",
  "instance": "/labs/7c9e6679-7425-40de-944b-e07fc1f90ae7/review-queue"
}
```

---

### 7.4. Ví dụ Phản hồi lỗi `400 Bad Request` (Tham số `page` không hợp lệ)

```http
HTTP/1.1 400 Bad Request
Content-Type: application/problem+json; charset=utf-8

{
  "type": "https://leetkob.hcmus.edu.vn/probs/invalid-query-parameter",
  "title": "Invalid Query Parameter",
  "status": 400,
  "detail": "Query parameter 'page' must be an integer greater than or equal to 1. Received: -1.",
  "instance": "/labs/7c9e6679-7425-40de-944b-e07fc1f90ae7/review-queue?page=-1"
}
```

---

### 7.5. Ví dụ Phản hồi lỗi `401 Unauthorized` (Thiếu Header xác thực)

```http
HTTP/1.1 401 Unauthorized
Content-Type: application/problem+json; charset=utf-8

{
  "type": "https://leetkob.hcmus.edu.vn/probs/missing-token",
  "title": "Authentication Token Required",
  "status": 401,
  "detail": "Authorization header is missing or empty. Provide a valid Bearer JWT.",
  "instance": "/labs/7c9e6679-7425-40de-944b-e07fc1f90ae7/review-queue"
}
```
