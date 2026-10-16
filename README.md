# 🏸 SmashMatch - Badminton Court Booking & Matchmaking System

## 1. Project Overview
SmashMatch is a comprehensive web platform for badminton enthusiasts and court owners. It solves two main problems:
1. **Automated Court Booking:** Real-time slot reservation with concurrency control to prevent double-booking.
2. **Matchmaking (Ghép kèo):** A community feature allowing solo players or incomplete groups to find matching players based on skill level.

## 2. Tech Stack & Environment
* **Backend:** Laravel 11.x (RESTful API architecture)
* **Frontend:** React 18 (Vite, React Router, TailwindCSS)
* **Database:** MySQL 8.x
* **Tools:** VS Code, Git, Postman/Thunder Client for API testing, HeidiSQL/phpMyAdmin for DB management.
* **Authentication:** Laravel Sanctum (Token-based)

## 3. Core Database Schema (ERD Summary)
The AI must generate Laravel Migrations & Models based on these exact entities and relationships:

* `users`: id, name, email, password, role (player, owner, admin), rating_score (decimal, default 5.0), matches_played (int).
* `courts`: id, owner_id (FK_users), name, address, description, is_active.
* `court_slots`: id, court_id (FK_courts), play_date (date), start_time (time), end_time (time), price (decimal), status (enum: available, pending, booked).
* `bookings`: id, user_id (FK_users), court_slot_id (FK_court_slots), total_price, payment_status (enum: unpaid, paid, refunded), checkin_code, created_at.
* `match_posts`: id, user_id (FK_users), booking_id (FK_bookings, nullable), level_required (string), slots_needed (int), estimated_cost_per_person (decimal), note (text), status (enum: open, closed, completed).
* `match_requests`: id, post_id (FK_match_posts), requester_id (FK_users), status (enum: pending, accepted, rejected).
* `reviews`: id, reviewer_id (FK_users), reviewee_id (FK_users, nullable), court_id (FK_courts, nullable), score (int 1-5), comment (text).

**Key Relationships to define in Laravel Models:**
* User `hasMany` Bookings, MatchPosts, MatchRequests.
* Court `hasMany` CourtSlots. Court `belongsTo` User (Owner).
* Booking `belongsTo` User, CourtSlot.
* MatchPost `belongsTo` User (Creator), Booking (Optional). `hasMany` MatchRequests.

## 4. Key API Endpoints to Implement (Prefix: `/api/v1`)

### Authentication
* `POST /auth/register`
* `POST /auth/login` (Returns Sanctum Token)

### Court & Booking Flow
* `GET /courts` (List active courts)
* `GET /courts/{court_id}/slots?date=YYYY-MM-DD` (Get schedule grid)
* `POST /bookings` (Requires Auth. Body: `court_slot_id`. Must implement DB Transaction & Row Locking to switch status from `available` to `pending`. Expires in 10 mins).
* `POST /webhooks/payment` (Mock webhook to change booking to `paid` and slot to `booked`).

### Matchmaking Flow
* `GET /matches` (List `open` matches)
* `POST /matches` (Create a post. E.g. Note: "Đang thiếu người, có sẵn vợt Kumpoo K520 Pro và VS Titan 7 cho mượn")
* `POST /matches/{post_id}/requests` (Join request)
* `PUT /matches/{post_id}/requests/{request_id}` (Owner accepts/rejects. If accepted and `slots_needed` == 0, auto-change post status to `closed`).

## 5. Coding Conventions & AI Instructions
When generating code for this project, the AI MUST adhere strictly to the following rules:
1. **Fat Models, Skinny Controllers:** Place complex business logic (like recalculating `rating_score` or locking `court_slots`) in Models, Services, or Action classes, NOT directly in Controllers.
2. **API Resources:** Always use Laravel Eloquent API Resources to format JSON responses. Never return raw Model objects.
3. **Form Requests:** Use Laravel FormRequests for all `POST/PUT` payload validation.
4. **Concurrency Handling:** For the `POST /bookings` endpoint, strictly use `DB::transaction()` and `->lockForUpdate()` when querying the `court_slots` table to prevent race conditions.
5. **Seeding mock data:** Create seeders with realistic local data (e.g., courts located in Thừa Thiên Huế, specific badminton equipment mentions in mock posts).
6. **Frontend State:** In React, use custom hooks to encapsulate API calls. Use Tailwind for UI components.

## 6. Phase 1 Task for AI
Read this document. Acknowledge understanding. Then, write the Laravel Database Migrations for all 7 tables in the correct order to handle Foreign Key constraints.
## 7. Frontend Architecture (React SPA)
The frontend must be built as a standalone Single Page Application using Vite + React. 

**Tech Stack Details:**
* State Management: Zustand or Redux Toolkit.
* Data Fetching: React Query (TanStack Query) combined with Axios for caching API responses (crucial for real-time court slot availability).
* Routing: React Router DOM v6.
* UI Library: Tailwind CSS paired with shadcn/ui or Ant Design for rapid component building.

**Folder Structure Convention:**
* `/src/api`: Axios instance with Interceptors to automatically inject Sanctum JWT tokens.
* `/src/components`: Reusable UI components (Buttons, Modals, CourtSlotCard).
* `/src/pages`: Main route pages (Home, CourtList, BookingDetail, MatchmakingBoard).
* `/src/hooks`: Custom hooks (e.g., `useAuth`, `useCourtSlots`).

**Core Views to Implement:**
1. **Matchmaking Board:** A Kanban-style or List view showing open matches, required levels, and an "Apply" button.
2. **Court Schedule Grid:** A calendar/grid view showing available, pending, and booked slots visually. Must handle auto-refreshing data.