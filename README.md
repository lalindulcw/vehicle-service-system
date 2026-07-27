# Vehicle Service Management System

A full-stack web application designed to manage daily operations at a vehicle service center. Built using Laravel 13, Inertia.js (React), and Tailwind CSS. The system handles customer details, vehicle records, service bookings, mechanic scheduling, parts inventory, and invoicing, with secure role-based access control.

---

## 🛠️ Technology Stack
* **Backend:** Laravel 13 (PHP 8.2+)
* **Frontend:** Inertia.js + React 18
* **Styling:** Tailwind CSS
* **Database:** MySQL
* **Access Control:** Spatie Laravel Permission
* **Testing:** PHPUnit

---

## 📦 Features Checklist

* **Authentication & Authorization:** Secure Login/Logout with role protection (Admin, Service Advisor, Mechanic).
* **Customer Management:** CRUD operations for managing customer contact information.
* **Vehicle Records:** CRUD operations linked to customers (Registration No, Make, Model, Year, VIN, Mileage).
* **Mechanic Database:** Management of mechanic staff, employee IDs, and their technical specializations.
* **Service Bookings & Job Cards:** Schedule service appointments with real-time double-booking validation for mechanics. Supports list/grid views and status updates (Pending, In Progress, Completed, Cancelled).
* **Inventory Tracking:** Spare parts stock levels with auto-deduction when a service job is marked as Completed. Warning alerts show when stock drops below thresholds.
* **Billing & Invoices:** Automatic invoice generation for completed bookings. Sums up labor + parts costs, generates sequential invoice numbers, and processes cash/card/bank payments. Features print-ready receipts.
* **Metrics Dashboard:** Displays active jobs, today's appointments, low stock alerts, and a daily revenue summary with a 7-day trend chart.
* **AI Service Advisor:** Translates natural language customer complaints (like "My tyre is flat" or "steering click when turning") into diagnosed faults, recommended services, estimated labor costs, and suggestions for stock parts.
* **Audit Trail / Activity Log:** Records all user actions (creations, edits, deletions, payments) for administrator review.

---

## 🚀 Setup & Installation Instructions

Follow these steps to run the application locally:

### 1. Install Dependencies
```bash
# Clone the repository
git clone <repository-url>
cd vehicle-service-system

# Install PHP packages
composer install

# Install NPM packages
npm install
```

### 2. Database Configuration
Create a `.env` file in the root directory by copying the example file:
```bash
cp .env.example .env
```
Open `.env` and set your MySQL database credentials:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=vehicle_service_db
DB_USERNAME=root
DB_PASSWORD=
```

### 3. Generate Keys & Run Migrations
Run the migrations and seeders to create the tables, user roles, and sample data (default parts list, test accounts):
```bash
# Generate application key
php artisan key:generate

# Run migrations and seed the database
php artisan migrate:fresh --seed
```

### 4. Seeded Test Credentials
Log in using these test profiles to review different dashboard views:
* **Administrator:**
  * **Email:** `admin@example.com`
  * **Password:** `password`
* **Service Advisor:**
  * **Email:** `advisor@example.com`
  * **Password:** `password`
* **Mechanic:**
  * **Email:** `mechanic@example.com`
  * **Password:** `password`
* **Mechanic 2 (Engine Specialist):**
  * **Email:** `sarah@example.com`
  * **Password:** `password`

### 5. Run the Application
Start the backend server and compile the assets:
```bash
# Start Laravel development server
php artisan serve

# Compile Vite assets for development
npm run dev

# Or build for production
npm run build
```
Open `http://127.0.0.1:8000` in your web browser.

---

## 🐳 Docker Deployment (Optional)
If you prefer Docker, you can start the application using Docker Compose:
```bash
# Start containers in the background
docker-compose up -d --build

# Run migrations and seed data inside the container
docker-compose exec app php artisan migrate:fresh --seed
```
Access the application at `http://localhost:8080`.

---

## 🧪 Testing
Run the test suite to verify Spatie permissions, validation checks, and transaction safety:
```bash
php artisan test
```
