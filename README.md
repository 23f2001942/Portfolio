# Shamanthak Reddy Mallu - Personal Portfolio

This repository contains the source code for my personal portfolio website. It is designed to showcase my skills, projects, and professional experience in a clean, modern, and fully responsive interface. The website is built using a cutting-edge tech stack to ensure high performance and a great user experience.

## ✨ Features

- **Responsive Design:** Optimized for a seamless experience on all devices, from desktops to mobile phones.
- **Dynamic Content:** Portfolio data is managed centrally in `src/lib/portfolio-data.ts`, making it easy to update and maintain.
- **Component-Based Architecture:** Built with reusable React components for maintainability and scalability.
- **Project Showcase:** Sections for both software and hardware projects, with links to repositories and live demos.
- **Interactive Experience:** Smooth animations and transitions to enhance user engagement.
- **Comprehensive Sections:** Includes sections for Home, Education, Experience, Projects, Skills, and Awards.

## 🛠️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **UI Library:** [React](https://reactjs.org/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [ShadCN UI](https://ui.shadcn.com/)
- **AI Integration:** [Genkit (by Google)](https://firebase.google.com/docs/genkit)
- **Analytics:** Vercel Analytics & Speed Insights

## 🚀 Getting Started

Follow these instructions to get a local copy of the project up and running.

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v20.x or later)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/your-repo-name.git
    ```
2.  **Navigate to the project directory:**
    ```sh
    cd your-repo-name
    ```
3.  **Install dependencies:**
    ```sh
    npm install
    ```

### Running the Development Server

To start the local development server, run the following command:

```sh
npm run dev
```

Open [http://localhost:9002](http://localhost:9002) in your browser to see the result. You can start editing the page by modifying `src/app/page.tsx`. The page auto-updates as you edit the file.

## 📂 Project Structure

- `src/app/`: Contains all the pages of the application, following the Next.js App Router structure.
- `src/components/`: Contains all reusable UI components (e.g., Header, Section, Cards).
- `src/components/ui/`: Contains the base UI components from ShadCN UI.
- `src/lib/`: Contains utility functions, portfolio data (`portfolio-data.ts`), and placeholder image configurations.
- `src/ai/`: Contains Genkit flows and AI-related logic.
- `public/`: Contains static assets like images and logos.
- `src/app/globals.css`: Contains global styles and Tailwind CSS theme configuration.
- `tailwind.config.ts`: The configuration file for Tailwind CSS.
