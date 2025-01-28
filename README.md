# cvisionary

**Version**: 0.1.0  
**Description**: A web platform that allows users to create a personal resume website, register their details, and provide a custom URL for their resume page. This application features sign-up, login functionality, and the ability to store personal information along with work experience.

---

## Technologies Used

- **React**: ^18.2.0  
  Core library for building user interfaces and components.
  
- **React Router**: ^6.23.1  
  Routing library for dynamic navigation between pages.
  
- **Redux Toolkit & React-Redux**: ^2.2.1 & ^9.1.0  
  State management tools for handling application state.
  
- **Ant Design**: ^5.19.3  
  UI component library for modern web interfaces.
  
- **Bootstrap**: ^5.3.2  
  CSS framework for building responsive, flexible websites.
  
- **Drag-and-Drop**: @dnd-kit/core, @dnd-kit/modifiers, @dnd-kit/sortable  
  Libraries for creating interactive drag-and-drop interfaces.
  
- **Axios**: ^1.6.5  
  Promise-based HTTP client for making API requests.
  
- **Sass**: ^1.69.5  
  CSS preprocessor for maintainable and reusable styling.

- **Other Utilities**:
  - `dayjs`: Date management library.
  - `react-dropzone`: For file uploads.
  - `react-helmet`: For managing document head metadata.
  - `react-highlight-words`: For text highlighting.
  - `react-image-crop`: For cropping images.
  - `countries-list`: For country data.
  - `cross-env`: For setting environment variables.
  - `history`: For managing navigation history.
  - `web-vitals`: For performance monitoring.

---

## Features

- **Sign Up & Login**:  
  Users can create an account and log in to manage their resumes.

- **Resume Management**:  
  Users can enter personal information and work experience.

- **Custom URL**:  
  Each user can define a custom URL for their resume webpage.


---

## Getting Started

To get started with this project, follow the instructions below.

### Prerequisites

Ensure you have the following installed:
- Node.js
- npm or yarn

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/cvisionary.git
    ```

2. Install dependencies:
    ```bash
    cd cvisionary
    npm install
    ```

### Running the Application

To run the application in development mode:

```bash
npm start
