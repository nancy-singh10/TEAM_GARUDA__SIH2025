# Project Garuda: Holistic Renewable Management System

---

# Part 1: Product Evaluation & Analysis (Completed 2025-12-08)

## Rating: 83 / 100

### Executive Summary
Project Garuda demonstrates an exceptional understanding of the problem statement, offering a visually stunning and conceptually complete solution. You have successfully designed a "comprehensive, vendor-neutral software framework" as requested. The user interface (UI) is a standout feature, perfectly targeting "non-specialist technicians" with intuitive visualizations like the `PowerFlow` diagram.

### Module Breakdown
1.  **Unified Orchestration Dashboard**: Solves fragmented data via a "Single Pane of Glass" (`visualFlow`, `stateAdmin/dashboard`).
2.  **Intelligent Forecasting**: Addresses battery under-utilization with predictive windows, though currently simulated (`ml/main.py`).
3.  **Gamified Token Layer**: A unique differentiator (`campusAdmin/tokens`) that gamifies carbon savings for motivation and reporting.
4.  **Vendor-Neutral Integration**: Abstracted API design (`/api/iot`) allows easy adaptation to varying hardware.

---

# Part 2: The Pitch

**Title**: Project Garuda: Turning Campuses into Virtual Power Plants
**Target Audience**: Ministry of Renewable Energy, Hackathon Judges, Campus Directors

### [Hook: The Invisible Waste]
"Ladies and Gentlemen,
Across Rajasthan, we have a silent crisis. Government campuses are installing millions of rupees worth of solar panels and wind turbines. Yet, if you walk into their control rooms today, you’ll see facilities managers staring at three different screens: one for the solar inverter, one for the legacy grid meter, and one for the backup generator.

Because these systems don't talk to each other, we burn grid electricity when the sun is shining, and we waste battery cycles when we should be storing power. The hardware is there. The *intelligence* is missing."

### [The Solution: Project Garuda]
"Enter **Project Garuda**.
Garuda is not just another dashboard; it is a **Vendor-Agnostic Orchestration Layer** that treats every asset—solar, wind, battery, and grid—as a single, coordinated Virtual Power Plant.

We solved the three biggest barriers to adoption:
1.  **Complexity**: We replaced complex electrical schematics with our intuitive **'PulseFlow' Interface**. If you can read a subway map, you can manage this power plant.
2.  **Reliability**: Instead of static rules, our **AI Core** predicts weather patterns 7 days in advance, telling the battery exactly when to charge to survive a cloudy afternoon.
3.  **Incentive**: We introduced the **'Green Token Economy'**. Campuses don't just save money; they earn digital credits for every kilowatt of carbon-free energy they use or export, creating a transparent, gamified ledger for the State Government to audit."

### [The Tech Stack]
"Under the hood, we are running a modern, scalable architecture:
*   **Next.js & React** for a responsive, app-like frontend experience.
*   **Supabase** for real-time data syncing across hundreds of campuses.
*   **Python AI Microservice** for handling stochastic weather modeling and demand forecasting.
*   **IoT Adapter Layer** that allows us to plug into *any* existing inverter brand—SMA, Fronius, or Delta—without buying new hardware."

### [Closing]
"With Project Garuda, we stop treating renewable energy as a science experiment and start treating it as a strategic asset. We maximize ROI, guarantee uptime for critical labs, and give the State Administration a real-time command center for the entire region's energy security."

---

# Part 3: Software Requirements Specification (SRS)

**Project Name**: Smart Campus Energy Orchestration System (Team Garuda)
**Version**: 1.0.0
**Date**: 2025-12-08

## 1. Introduction

### 1.1 Purpose
The purpose of this document is to define the functional and non-functional requirements for the Smart Campus Energy Orchestration System. This software aims to integrate fragmented renewable energy sources (Solar, Wind) and storage systems (Batteries) into a unified management platform for public-sector campuses.

### 1.2 Scope
The system will:
*   Ingest real-time telemetry from disparate hardware sources via a standardized API.
*   Provide a centralized dashboard for Campus Administrators to monitor and control energy flow.
*   Provide a master view for State Administrators to compare performance across multiple campuses.
*   Utilize Machine Learning to forecast generation and recommend operational actions (load shifting, battery scheduling).
*   Implement a blockchain-inspired Token Wallet system to track and reward carbon avoidance.

### 1.3 Definitions & Acronyms
*   **VPP**: Virtual Power Plant.
*   **RES**: Renewable Energy Source (Solar/Wind).
*   **SoC**: State of Charge (Battery level).
*   **Campus Admin**: Local facility manager responsible for one site.
*   **State Admin**: High-level overseer responsible for multiple campuses.

## 2. Overall Description

### 2.1 User Characteristics
*   **Facility Managers (Campus Admin)**: Non-technical users. Require simple visual indicators (Green/Red), clear calls to action, and automated insights.
*   **State Bureaucrats (State Admin)**: Data-focused users. Require aggregated reporting, leaderboards, and compliance metrics (Carbon Saved, ROI).
*   **Technicians**: maintainers who may script raw hardware adapters to push JSON to the system.

### 2.2 System Architecture
The system follows a Microservices-based architecture:
*   **Frontend**: Next.js (React) application serving two distinct portals (Campus/State).
*   **Backend**: Serverless functions (Next.js API Routes) + Supabase (PostgreSQL).
*   **Data/ML Layer**: Python FastAPI service for complex calculations and simulation.
*   **IoT Layer**: REST API endpoints enabling push-based telemetry from on-site hardware wrappers.

## 3. System Features & Functional Requirements

### 3.1 Unifying Dashboard & Visualization (The "PulseFlow")
**Description**: A real-time visual representation of energy flow between Grid, Solar, Wind, Battery, and Load.
*   **FR-1.1**: System MUST display real-time power values (kW) for all 5 nodes.
*   **FR-1.2**: System MUST animate the direction of power flow (e.g., Solar -> Load, Grid -> Battery).
*   **FR-1.3**: System MUST provide detailed tooltips/modals for each node (e.g., Battery Health, Solar Panel Efficiency) upon user interaction.
*   **FR-1.4**: Dashboard MUST allow users to toggle between Real-time, Daily, and Weekly views.

### 3.2 Predictive Analytics & Forecasting
**Description**: An ML-driven module that predicts future generation to optimize battery usage.
*   **FR-2.1**: System MUST ingest weather forecast data (Temperature, Cloud Cover, Wind Speed).
*   **FR-2.2**: System MUST predict Solar and Wind generation for t+24 hours and t+7 days.
*   **FR-2.3**: System MUST identify "Low Generation" windows and issue alerts (e.g., "Grid dependence likely on Thursday afternoon").
*   **FR-2.4**: System MUST calculate an "Optimal Battery Plan" recommending charge/discharge times to minimize grid import cost.

### 3.3 Green Token Economy (Gamification)
**Description**: An internal ledger system that rewards positive energy behavior.
*   **FR-3.1**: System MUST calculate "Net Zero" contributions (Total Renewable Generation - Consumption).
*   **FR-3.2**: System MUST automatically "mint" Tokens into the Campus Wallet based on a configurable conversion rate (e.g., 10 kWh surplus = 1 Token).
*   **FR-3.3**: Campus Admins MUST be able to "Redeem" tokens for grid-power credits or virtual rewards.
*   **FR-3.4**: All transactions MUST be immutable and viewable in a transaction history log for auditing.

### 3.4 State Administration & Ranking
**Description**: High-level oversight for the state nodal agency.
*   **FR-4.1**: System MUST render an interactive map showing all registered campus locations.
*   **FR-4.2**: System MUST compute a "Sustainability Score" for each campus based on Renewable % and Uptime.
*   **FR-4.3**: System MUST display a leaderboard ranking campuses to encourage competition.
*   **FR-4.4**: State Admin MUST be able to drill down into any specific campus to view their dashboard.

### 3.5 Device Agnostic IoT Interface
**Description**: A standard JSON schema for hardware integration.
*   **FR-5.1**: System MUST expose a secured REST endpoint (`POST /api/iot/readings`).
*   **FR-5.2**: System MUST accept a JSON payload containing `{ timestamp, solar_kw, wind_kw, battery_soc, grid_kw, load_kw }`.
*   **FR-5.3**: System MUST validate data types and reject malformed packets.
*   **FR-5.4**: System MUST store raw telemetry in a time-series efficient manner (Supabase/PostgreSQL).

## 4. User Interface Guidelines
*   **Aesthetics**: Glassmorphism design language with dark/light mode support (Tailwind CSS).
*   **Accessibility**: High-contrast text, clear iconography (Lucide React), and responsive layout for tablet/mobile use by field technicians.
*   **Feedback**: Loading skeletons for async data fetching; Toasts/Snackbars for successful actions (e.g., "Settings Saved").

## 5. Non-Functional Requirements (NFR)

### 5.1 Performance
*   **NFR-1**: Dashboard load time must be under 2.0 seconds on 4G networks.
*   **NFR-2**: Real-time graph updates must occur with <100ms UI latency.

### 5.2 Security
*   **NFR-3**: All API endpoints must be protected via Authentication Tokens (Supabase Auth).
*   **NFR-4**: Database Row Level Security (RLS) policies must ensure Campus A can NEVER read Campus B's detailed logs.

### 5.3 Reliability
*   **NFR-5**: The system must degrade gracefully; if the ML Service is offline, the dashboard must still show live readings without specific forecasts.
*   **NFR-6**: Data ingestion must handle intermittent network connectivity from campuses (retry logic on IoT adapters).

## 6. Data Model (Schema Overview)

### 6.1 `campus_admin` Table
*   `id` (UUID): Primary Key
*   `campus_name` (Text)
*   `location` (Lat/Long)
*   `solar_capacity_kw` (Float)
*   `battery_capacity_kwh` (Float)

### 6.2 `energy_readings` Table
*   `id` (BigInt): Time-series ordered
*   `campus_id` (FK)
*   `timestamp` (ISO8601)
*   `solar_output` (Float)
*   `wind_output` (Float)
*   `grid_import` (Float)
*   `battery_level` (Float)

### 6.3 `token_wallet` Table
*   `wallet_id` (UUID)
*   `campus_id` (FK)
*   `balance` (Decimal)
*   `total_carbon_saved` (Decimal)

---

# Part 4: Conclusion for Hackathon Submission
Project Garuda meets all critical requirements of the problem statement "Smart Energy Management for Government Campuses." By focusing on software orchestration rather than hardware procurement, it offers a scalable, high-impact solution immediately applicable to existing infrastructure. The addition of the Token Economy ensures long-term user engagement, solving the human behavioral aspect of energy efficiency often ignored in purely technical solutions.



## pitch
our end of day goal is to be able to make all the sources work together (orchestration) in such a way that can we can maximize the profits and save carbon footprints.
so to do this we created 