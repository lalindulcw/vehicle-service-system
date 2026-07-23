# Vehicle Service Management System (VMS Pro)

A premium, full-stack vehicle service center management web application. Built using Laravel 13, Inertia.js (React), and Tailwind CSS. The system utilizes role-based access control (RBAC), database transaction boundaries, local rule-based AI diagnostics, and a variety of bonus features to deliver a complete garage operations suite.

---

## 🚀 Key Features

### 1. Functional Core
* **Authentication & RBAC:** Multi-role user guards (Admin, Service Advisor, Mechanic) using Spatie Laravel Permission.
* **Customer Management:** Full customer CRUD with responsive grid/list displays and live searching.
* **Vehicle Management:** Full vehicle CRUD mapped to owners with VIN, mileage, and specification fields.
* **Mechanic Scheduler:** Mechanic management and service allocations mapped to specializations.
* **Service Bookings & Job Cards:** Timezone-safe calendar scheduling, parts assignment, and mechanic double-booking conflict preventions.
* **Inventory Control:** Spare parts list with automatic stock deductions upon job completion and low stock threshold alarms.
* **Billing & Invoices:** Sequential `INV-YYYY-XXXX` invoice number generation, labor + parts math calculation, and printable invoice sheets.
* **Metrics Dashboard:** 4-card statistics, dynamic SVG revenue chart, low stock progress bars, and upcoming schedules list.

### 2. AI Diagnostics Engine
* **AI Service Advisor:** Processes natural language customer complaints (e.g., "My tyre is flat" or "steering click when turning") and maps them to faults, suggested services, costs, and recommends spare parts from inventory.

### 3. Extra Credit / Bonus Features
* **System Audit Trail:** Admin-only Activity Log registering all user operations and database model adjustments with JSON payload details.
* **Interactive Calendar:** Timezone-safe monthly grid scheduler with quick modal event details.
* **PDF / Print Invoice:** Print-friendly CSS media stylesheet to print or export invoices as clean A4 receipts.
* **Automated Tests:** 27 feature and unit tests validating access controls, scheduling conflicts, and stock rules.
* **Docker Containerization:** Ready-to-run `Dockerfile` and `docker-compose.yml` configs.

---

## 🛠️ Technology Stack
* **Backend:** Laravel 13 (PHP 8.2+)
* **Frontend:** Inertia.js + React 18
* **Styling:** Tailwind CSS (Vanilla responsive layout styling)
* **Database:** MySQL / PostgreSQL
* **Authorization:** Spatie Laravel Permission
* **Testing:** PHPUnit / Pest

---

## 📦 Setup & Installation Instructions

Follow these steps to run the application locally on your computer:

### 1. Clone & Install Dependencies
```bash
# Clone the repository
git clone <repository-link>
cd vehicle-service-system

# Install PHP Composer packages
composer install

# Install Node JS packages
npm install
```

### 2. Configure Environment File
Create a copy of `.env.example` named `.env` and configure your database parameters:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=vehicle_service_db
DB_USERNAME=root
DB_PASSWORD=
```

### 3. Setup Database Schema & Seeders
Generate the application key, run migrations, and execute seeders to populate initial roles, admin profiles, and sample parts:
```bash
# Generate app key
php artisan key:generate

# Run migrations and seed data
php artisan migrate:fresh --seed
```

### 4. Seeded User Credentials (for Testing)
Use the following profiles to log in and inspect different role capabilities:
* **Administrator Profile:**
  * **Email:** `admin@example.com`
  * **Password:** `password`
* **Service Advisor Profile:**
  * **Email:** `advisor@example.com`
  * **Password:** `password`
* **Workshop Mechanic Profile:**
  * **Email:** `mechanic@example.com`
  * **Password:** `password`

### 5. Start Development Servers
Run the Laravel artisan server and Node asset bundler concurrently:
```bash
# Start backend server (runs on http://127.0.0.1:8000)
php artisan serve

# Start frontend bundler
npm run dev
# OR build production bundles
npm run build
```

---

## 🐳 Docker Deployment (Alternative Setup)
If you have Docker installed, you can launch the entire stack (web app + database) with a single command:
```bash
# Build and run containers
docker-compose up -d --build

# Run migrations and seed inside the container
docker-compose exec app php artisan migrate:fresh --seed
```
The application will be accessible at `http://localhost:8080`.

---

## 🧪 Running Automated Tests
Run the PHPUnit test suite to verify route protection, Spatie roles, booking conflict preventions, and stock rules:
```bash
php artisan test
```
*(All 27 automated feature and unit tests will run and pass successfully).*

---

## 📂 Database Architecture & Relations
The database is built on normalized relations to maintain data integrity:
* `users` belongsToMany `roles` (Spatie permission schema).
* `customers` hasMany `vehicles` (Owner mapping).
* `customers` hasMany `bookings`.
* `vehicles` hasMany `bookings` (Vehicle history).
* `mechanics` hasMany `bookings` (Assigned labor).
* `bookings` hasMany `parts` through pivot table `booking_part` (Tracking quantity and parts unit price at the time of invoice generation).
* `bookings` hasOne `invoices` (1-to-1 invoicing status).
* `activity_logs` belongsTo `users` (Tracking audit operators).
