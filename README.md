# Resource Booking System 🗓️

A full-stack web application that allows users to book shared resources (e.g., meeting rooms, devices) while preventing booking conflicts using a 10-minute buffer window between bookings.

## 🔧 Tech Stack

- **Frontend**: Next.js (App Router), Tailwind CSS, TypeScript  
- **Backend**: Express.js + TypeScript 
- **Database**: SQLite + Prisma ORM

---

## 🚀 Features

- 🔒 **Conflict Detection** with a 10-minute buffer before and after bookings  
- 🕘 **Minimum Booking Duration**: At least 15 minutes  
- ✅ **Validation**: End time must be greater than start time, and duration must be at least 15 minutes  
- 📥 **Book a Resource** via an intuitive form  
- 📋 **Booking List Dashboard** grouped by resource  
- 📅 **Filters** by resource and date  
- 🔄 **Status Tags**: `Upcoming`, `Ongoing`, `Past`  
- ❌ **Delete/Cancel Bookings
- 📆 **Weekly Calendar View 
- 🔍 **Available Slot Check API

---

## 📦 Project Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Rasibul/booking-backend-system.git
cd booking-backend-system
npm install
npx prisma generate
npx prisma migrate dev --name init

npm run dev
# Runs on http://localhost:5000 
