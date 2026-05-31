# 🎓 eTuitionBD – Master Tuition Matching & Access Control Platform

eTuitionBD is a modern, premium, SaaS-style interactive web application crafted for seamless connection between students, tutors, and administrators. Built with a minimalist aesthetic inspired by global tech brands like Stripe and Vercel, the platform delivers high-converting UI flows, advanced server-side data analytics, and rock-solid JWT security.

---

## ✨ Core Features & Functionalities

### 👤 User Roles & Management
* **Dynamic Access Tiers:** Complete system split into three distinct dashboards: **Student**, **Tutor**, and **Admin**.
* **Identity Control Panel:** Admins can dynamically migrate user access tiers (Student ↔ Tutor ↔ Admin) and handle platform integrity via a bulletproof account restrict/ban mechanism.
* **Identity Verification Queue:** Special verification pipeline for Tutors to review, approve, or reject background checks before they can access matching opportunities.

### 🎯 Smart Matching Engine & Workflows
* **Advanced Multi-Filter Search:** High-performance filtering engine supporting global keyword search, medium/category selection, specific class levels, subject lookup, and precise location parameters.
* **Dynamic Pricing & Timing Sorting:** Challenge-ready search sorting allowing users to structure feeds based on budget streams (salary metrics) or real-time chronological updates.
* **One-Click Applications & Overlaps:** Tutors can apply to tuition postings with live proposals, while the platform enforces built-in safety blocks to prevent duplicate applications.
* **Personalized Bookmarks:** Save preferred tuition posts instantly to a dedicated bookmark collection for streamlined monitoring.

### 🔒 Security & Performance Architecture
* **JWT Authorization Interceptors:** Full security lock using JSON Web Tokens. Secure communication routing via customizable Axios interceptors (`useAxios`) ensures that unauthorized client threads are systematically rejected.
* **COOP Network Shielding:** Tailored Cross-Origin-Opener-Policy configurations embedded to bypass secure pop-up connection drops, providing 100% stable Google Firebase OAuth processes.
* **Responsive Layout Stability:** Zero-overflow UI engineering utilizing isolated mobile layout containers to guarantee zero horizontal scroll bugs across complex data tables and profile dashboards.

---

## 🛠️ Tech Stack & Architecture

### Frontend (Client Tier)
* **Core:** React.js (Vite Core Compiler)
* **Styling & Layout:** Tailwind CSS (Ultra-minimalist components, SaaS spacing)
* **Animation Model:** Framer Motion (State-aware visual interactions)
* **Form Engine:** React Hook Form (Asynchronous validation)
* **Data Fetching:** TanStack React Query v5 (Optimistic caching & cache invalidations)
* **State Management:** Firebase Authentication Context Engine

### Backend (Server Tier)
* **Runtime Environment:** Node.js
* **Application Framework:** Express.js
* **Database Management:** MongoDB (Native Drivers & Aggregations)
* **Security Protocol:** JWT (JSON Web Tokens Core) & Environment Encryption via dotenv
* **External Integrations:** Stripe Payment Gateway (Session Metadata Structures) & ImgBB API

---

## 🚀 Installation & Local Environment Setup

Follow these precise steps to provision a local node instances of eTuitionBD:

### 1. Clone the Repository
```bash
git clone [https://github.com/your-username/etuitionbd.git](https://github.com/your-username/etuitionbd.git)
cd etuitionbd
