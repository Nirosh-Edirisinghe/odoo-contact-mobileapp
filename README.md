# 📱 Odoo Mobile App (React Native)

## 🚀 Project Overview

This mobile application is developed using **React Native (Expo)** and integrates with the **Odoo API (JSON-RPC)** to manage customer data efficiently.

The app allows users to perform full **CRUD operations (Create, Read, Update, Delete)** on customers through a user-friendly mobile interface.

---

## 🧩 Features

### 🔐 Authentication

* Connect to Odoo server
* User login with credentials
* Secure session handling

### 📊 Dashboard

* Display total number of customers
* Show recent customers in card format

### 👥 Customer Management

* View all customers
* Search customers
* Filter customer list
* View detailed customer information

### ➕ CRUD Operations

* Create new customer
* Update existing customer
* Delete customer

### 🧭 Navigation

* Drawer navigation (Dashboard & Customers)
* Smooth and responsive mobile UI/UX

### 🚪 Logout

* Secure logout functionality

---

## 🛠️ Tech Stack

* **React Native (Expo)**
* **Axios** (API calls)
* **Odoo JSON-RPC API**
* **React Navigation**

---

## ⚙️ Setup Instructions

### 1. Clone Repository

```bash
git clone https://github.com/Nirosh-Edirisinghe/odoo-contact-mobileapp.git
cd odoo-mobile-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Application

```bash
npx expo start
```

### 4. Configure Odoo Server

* Enter your Odoo server URL in the app
* Provide valid login credentials

---

## 🔌 Odoo API Integration

The app communicates with Odoo using **JSON-RPC** endpoints.

### Example API Call

```js
POST /web/dataset/call_kw/res.partner/search_read
```

### Operations Implemented

* `search_read` → Fetch customers
* `create` → Add customer
* `write` → Update customer
* `unlink` → Delete customer

---

## 📱 Application Screens

* Server Connection Screen
* Login Screen
* Dashboard
* Customer List
* Customer Detail View
* Add / Edit Customer Modal

---

## 📌 Module Used

* **Contacts Module (`res.partner`)**

---

## 👨‍💻 Author

Developed as part of an **Odoo API Integration Mobile App Task** using React Native.

---

## ✅ Project Status

* ✔ Completed CRUD functionality
* ✔ Fully functional mobile UI
* ✔ Odoo API successfully integrated
* ✔ Responsive and user-friendly design

---
