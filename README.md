# 🚀 TalentFlow

**TalentFlow** is a mini hiring platform designed to help an HR team manage jobs, candidates, and job-specific assessments.  
This project is a sophisticated front-end application that simulates a full back-end API using **Mock Service Worker (MSW)** and ensures data persistence entirely through **IndexedDB** for a reliable **local-first experience**.

---

## ✨ Features

### 📋 Job Management (Jobs Board)
- **Pagination & Filtering:** Displays jobs in a paginated table and allows filtering by job title search, as well as status (active or archived).  
- **CRUD Operations:** Complete functionality to Create, Edit, and Archive job listings via a modal form.  
- **Drag-and-Drop Reordering:** Users can reorder jobs using drag-and-drop, featuring optimistic UI updates that automatically rollback if the simulated API request fails (per the assignment requirements).  
- **Deep Linking:** Dedicated route (`/jobs/:jobId`) to view individual job details.  

### 🧑‍💻 Candidate Management (Kanban Board)
- **Virtualized List:** Handles a large dataset (1000+ seeded candidates) efficiently.  
- **Kanban Flow:** Candidates are organized by stage (applied, screen, tech, offer, hired, rejected) and can be moved between stages using drag-and-drop.  
- **Search & Filter:** Client-side search for quick filtering by candidate name or email.  
- **Candidate Profiles:** Dedicated route (`/candidates/:id`) showing profile details and a timeline of stage changes.  

### 📝 Assessment Builder
- **Assessment Builder UI:** Allows non-technical users to build job-specific assessment forms per the assignment requirements.  
- **Live Preview Pane:** Renders the assessment form in real-time as questions are added or edited.  
- **Configurable Questions:** Supports defining question type, label, required status, and constraints (e.g., Min/Max for numeric questions).  
- **Supported Types:** Short Text, Long Text, Multi-Choice, Numeric with Range, and File Upload (stub).  

---

## 💻 Technical Stack

| **Category** | **Technology** | **Purpose** |
|---------------|----------------|--------------|
| **Frontend** | React, React Router | Core application framework and client-side navigation |
| **Styling** | Tailwind CSS | Utility-first CSS framework for responsive and fast styling |
| **Data Flow** | React Query | Server state management for caching, synchronization, and data fetching lifecycle |
| **Persistence** | Dexie.js (IndexedDB) | Local data persistence ensuring state restoration on refresh |
| **Mocking** | MSW (Mock Service Worker) | Simulates API responses and latency/errors |
| **UI/UX** | Dnd-kit | High-performance drag-and-drop functionality for job reordering and the Kanban board |
| **Forms** | React Hook Form | Efficient form handling, validation, and submission |

---

## ⚙️ Installation & Setup

To get a local copy of **TalentFlow** up and running, follow these simple steps:

### Prerequisites
- **Node.js** (v14 or higher)  
- **npm** or **yarn**

### Installation Steps
1. **Clone the repository:**
   ```bash
   git clone <repository_url>
   cd talentflow

2. **Install dependencies**
   ```bash
   npm install
    or
   yarn install

3. **Start the development server**
   ```bash
   npm run dev
    or
   yarn dev

5. **Open the application**
   ```bash
   The application will open automatically in your default browser at:
   http://localhost:5173
