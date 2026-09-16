# RemoteCut — Remote Video Editor Jobs & Automation System

Hệ thống tự động tìm kiếm, chuẩn hóa và hiển thị các vị trí việc làm **Remote Video Editor** từ khắp nơi trên thế giới, hỗ trợ AI soạn thảo email ứng tuyển cá nhân hóa và đồng bộ phản hồi 2 chiều với Gmail.

Giao diện được thiết kế theo chuẩn **Monochrome Cinema (OddPig V2)** tại `https://oddpig.io.vn/remote`.

---

## 1. Tính năng cốt lõi

1. **Khám phá & Tổng hợp Job tự động**:
   - Tích hợp 3 nguồn tuyển dụng: Remotive API, Remote OK API và Arbeitnow RSS.
   - Chuẩn hóa HTML/Text, lọc chính xác các từ khóa video editor (Premiere, DaVinci, After Effects, CapCut, Short-form, YouTube...) và chống trùng lặp theo fingerprint.
   - Endpoint tự động hóa bảo mật: `POST /remote/api/cron/jobs` (yêu cầu Cron Bearer Secret).
2. **Hệ thống Đăng nhập Single-User (Google OAuth)**:
   - Tích hợp **Auth.js v5 (NextAuth)** với Google OAuth 2.0.
   - Nút **SIGN IN / SIGN OUT** phong cách Monochrome Cinema trực tiếp trên Header.
   - Cơ chế fail-closed: chỉ cho phép duy nhất email chủ sở hữu (`AUTH_OWNER_EMAIL`) đăng nhập.
3. **Đồng bộ 2 chiều với Gmail API**:
   - Xin cấp quyền `gmail.modify` và `gmail.send`.
   - Lưu trữ và mã hóa an toàn OAuth Refresh Token trong cơ sở dữ liệu bằng thuật toán **AES-256-GCM**.
   - Tự động quét email phản hồi, gắn kết Thread ID với hồ sơ ứng tuyển và gợi ý trạng thái.
4. **AI Email Assistant**:
   - Tự động tạo email từ Job Description và Portfolio cá nhân với 4 mẫu chuẩn (Application, Follow-up, Recruiter Reply, Thank You).
   - Bảo đảm an toàn: Email chỉ được gửi khi người dùng bấm xác nhận (`confirmed: true`).
5. **Cơ sở dữ liệu PostgreSQL + Prisma ORM**:
   - Quản lý User, Account, JobSource, Company, Job, Application, ApplicationEvent, EmailThread, EmailMessage, SyncRun.

---

## 2. Hướng dẫn Chạy Local

### Yêu cầu:
- Node.js 20+ và npm.
- Docker Desktop (để chạy PostgreSQL local).

### Các bước:
```bash
# 1. Sao chép file cấu hình
cp .env.example .env

# 2. Tạo các chuỗi secret bảo mật
# AUTH_SECRET, TOKEN_ENCRYPTION_KEY, CRON_SECRET (32 byte base64)
openssl rand -base64 32

# 3. Khởi động PostgreSQL qua Docker
docker compose up -d

# 4. Cài đặt dependencies và khởi tạo database
npm install
npm run db:generate
npm run db:push
npm run db:seed

# 5. Chạy môi trường phát triển
npm run dev
```

Mở trình duyệt tại: `http://localhost:3000/remote` (hoặc port dev tương ứng).

---

## 3. Hướng dẫn Triển khai (Deploy) lên `oddpig.io.vn/remote`

Do trang chính `oddpig.io.vn` hiện chạy trên **GitHub Pages** (chỉ chứa file tĩnh), kiến trúc tối ưu nhất để kết hợp Next.js full-stack (có Google Auth + Database + Cron) là **Vercel + Cloudflare Proxy** (hoặc Subdomain):

### Bước 3.1: Deploy ứng dụng Next.js lên Vercel
1. Đẩy mã nguồn dự án `jobs` lên GitHub (ví dụ repo `cngphm07/remote-jobs`).
2. Truy cập [vercel.com](https://vercel.com) và bấm **Add New Project** → Chọn repo vừa tạo.
3. Trong phần **Environment Variables** trên Vercel, điền đầy đủ các biến:
   - `DATABASE_URL`: Kết nối PostgreSQL từ dịch vụ đám mây miễn phí như **Supabase**, **Neon.tech**, hoặc **Railway**.
   - `AUTH_SECRET`: Tạo bằng `openssl rand -base64 32`.
   - `AUTH_TRUST_HOST`: `true`
   - `AUTH_URL`: `https://oddpig.io.vn/remote`
   - `NEXTAUTH_URL`: `https://oddpig.io.vn/remote`
   - `AUTH_OWNER_EMAIL`: `cuongphamworks@gmail.com`
   - `GOOGLE_CLIENT_ID`: Lấy từ Google Cloud Console.
   - `GOOGLE_CLIENT_SECRET`: Lấy từ Google Cloud Console.
   - `TOKEN_ENCRYPTION_KEY`: Chuỗi base64 32-byte.
   - `CRON_SECRET`: Chuỗi secret cho Cron job.
4. Bấm **Deploy**. Vercel sẽ tự động build và cấp một domain dạng `https://remote-cut.vercel.app`.

### Bước 3.2: Cấu hình Google Cloud Console OAuth 2.0
1. Truy cập [Google Cloud Console](https://console.cloud.google.com/) → **APIs & Services** → **Credentials**.
2. Bật **Gmail API** trong Library.
3. Tại OAuth 2.0 Client ID:
   - **Authorized JavaScript origins**:
     - `https://oddpig.io.vn`
     - `https://remote-cut.vercel.app` (domain Vercel)
     - `http://localhost:3000` (dùng khi test local)
   - **Authorized redirect URIs**:
     - `https://oddpig.io.vn/remote/api/auth/callback/google`
     - `https://remote-cut.vercel.app/remote/api/auth/callback/google`
     - `http://localhost:3000/remote/api/auth/callback/google`
4. Cấu hình **OAuth consent screen**: Thêm email của bạn vào danh sách **Test users**.

### Bước 3.3: Định tuyến đường dẫn `/remote` trên domain `oddpig.io.vn`

#### Cách 1: Sử dụng Cloudflare Proxy (Giữ nguyên URL `oddpig.io.vn/remote`)
Nếu bạn quản lý DNS domain `oddpig.io.vn` qua Cloudflare:
1. Bật proxy đám mây cam (Proxied) cho DNS của `oddpig.io.vn`.
2. Tạo một **Cloudflare Worker** hoặc **Origin Rule** chuyển tiếp:
   - Path `/remote*` → Chuyển tiếp tới `https://remote-cut.vercel.app/remote*`.
   - Các path còn lại (`/`, `/new/*`...) → Tiếp tục phục vụ từ GitHub Pages.

#### Cách 2: Sử dụng Subdomain riêng (Đơn giản nhất: `remote.oddpig.io.vn`)
1. Thêm bản ghi DNS CNAME: `remote` trỏ về `cname.vercel-dns.com`.
2. Gán domain `remote.oddpig.io.vn` vào Project trên Vercel.
3. Cập nhật `AUTH_URL="https://remote.oddpig.io.vn/remote"` và redirect URI tương ứng.

---

## 4. Kiểm thử Kỹ thuật

```bash
# Kiểm tra TypeScript
npm run typecheck

# Kiểm tra ESLint
npm run lint

# Chạy Unit Tests
npm test

# Kiểm tra Production Build
npm run build
```
