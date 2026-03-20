# 🏎️ Async Race

<img width="1902" height="916" alt="image" src="https://github.com/user-attachments/assets/24680ff4-1017-4004-9198-3b26479602f8" />

🎮 [Play the application](https://fiercesloth.github.io/async-race)

**Async Race** is a Single Page Application (SPA) developed as a task for **[RS School](https://rs.school/)**.
It is an interactive garage management and drag-racing simulator where players can create, customize, and race a collection of radio-controlled cars. The application dynamically communicates with a custom mock server to handle engine states, velocities, and race statistics.

This project is built entirely from scratch using **Vanilla TypeScript, SCSS Modules, and Vite**, strictly adhering to a component-based architecture without the use of any heavy JavaScript frameworks (like React or Angular).

> 📋 **Task Description & Rules:** \> You can find the detailed technical requirements here: [RS School Async Race Task](https://github.com/rolling-scopes-school/tasks/tree/master/stage2/tasks/async-race)

-----

## ⚠️ IMPORTANT: How to Play

To fully experience the application, **you must run the local mock server**. The frontend depends on this API to manage the database of cars and calculate race physics (velocity, distance, and engine breakdowns).

**Steps to start the server:**

1.  Ensure you have Node.js (v14.x or higher) installed.
2.  Clone the server repository:
    ```bash
    git clone https://github.com/FierceSloth/async-race-api.git
    ```
3.  Navigate to the folder and install dependencies:
    ```bash
    cd async-race-api
    npm install
    ```
4.  Start the server:
    ```bash
    npm start
    ```
5.  Once the server is running at `http://127.0.0.1:3000`, open the **[Deploy Link](https://fiercesloth.github.io/async-race)** in your browser to start racing\!

-----

## 🏗️ Technical Architecture

The project is structured to ensure maximum scalability and clean code separation:

  * **Component-Based UI:** All UI elements (e.g., `Car`, `CarTrack`, `GarageControls`, `Pagination`) extend a base `Component` class, allowing for programmatic and modular DOM generation.
  * **Event-Driven Communication:** Implemented custom event emitters (`appEmitter` for global routing, `gameEmitter` for isolated garage/track logic) to avoid prop-drilling and tight coupling.
  * **MVC-like Pattern:** Clear separation of concerns between API communication (`api.ts`), UI rendering (`GaragePage`), and business/animation logic (`GarageController`).
  * **Custom Routing:** Built-in SPA router (`Router`) handling navigation between the Garage and Winners views without page reloads.
  * **Smooth Animations:** Car movements are calculated dynamically based on server responses (distance/velocity) and animated using native `requestAnimationFrame` for maximum performance, smoothly handling dynamic screen widths.

-----

## 🎮 Features

### 🏁 Garage Management (Fully Implemented)

  * **CRUD Operations:** Create, update, and delete cars.
  * **Dynamic Customization:** Pick any RGB color via the color input. The custom color is dynamically injected into the SVG code of the car using CSS variables (`--c-cat` and `--c-edge`).
  * **Mass Generation:** Instantly generate 100 random cars with unique names and colors to populate the garage.
  * **Pagination:** Seamlessly navigate through the garage pages (7 cars per page).

### 🏎️ Race Mechanics

  * **Engine Controls:** Start or stop the engine of specific cars.
  * **Race All:** A single button to start the engine and race all cars on the current page simultaneously.
  * **Physics & Breakdowns:** The app gracefully handles HTTP 500 errors ("Car has been broken down") from the server. If a car breaks down, its animation stops precisely where the failure occurred, and a "broken tools" icon is displayed.
  * **Winner Modal:** Upon race completion, a modal announces the winner's name and their exact track time.

### 🏆 Winners Page

  * *Currently in development (UI layout and routing prepared, awaiting final data integration and sorting logic).*

-----

## 💻 Tech Stack

  * **Core:** TypeScript, HTML5
  * **Styling:** SCSS (CSS Modules)
  * **Build Tool:** Vite
  * **Linting & Code Quality:** ESLint (with strict `unicorn` plugin rules), Prettier
  * **Git Hooks:** Husky, `lint-staged`, and custom branch name validation (`validate-branch-name`).

-----
