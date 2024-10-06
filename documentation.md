
# Backend Documentation

## Overview

This is the backend of the project built with Node.js, Express, and Sequelize. It provides APIs for managing users, agencies, projects, and other functionalities. This documentation will guide you through the process of setting up and running the backend locally in development mode.

---

## Prerequisites

Ensure you have the following installed before setting up the project:

- [Node.js](https://nodejs.org/) (Version 14.x or higher recommended)
- [npm](https://www.npmjs.com/) (Node package manager, typically installed with Node.js)
- [Git](https://git-scm.com/) (for pulling the project)

---

## Getting Started

### Step 1: Clone the Project

First, you need to pull the backend project from the GitHub repository.

1. Open your terminal.
2. Navigate to the directory where you want to clone the project.
3. Run the following command to clone the repository:

   ```bash
   git clone https://github.com/Gentle-wave/Assessment-Task.git
   ```

   Replace `your-username` and `your-backend-repo` with the actual repository URL.

4. After cloning, navigate into the project directory:

   ```bash
   cd your-backend-repo
   ```

---

### Step 2: Install Dependencies

Once you have cloned the project, you need to install the necessary dependencies.

Run the following command in the project root to install all Node.js dependencies:

```bash
npm install
```

This will install all the dependencies listed in the `package.json` file.

---

### Step 3: Environment Variables

Create a `.env` file in the root directory of the project and add your environment-specific configurations. Here's an example of what your `.env` file might look like:

```bash

# Server Config
PORT=3000

# JWT Secret
JWT_SECRET=your-secret-key
```

Make sure you replace the placeholder values with your actual configuration details.

---

### Step 4: Database Setup

This project uses SQLlite

---

### Step 5: Running the Backend

You have two options to run the backend:

#### Option 1: Development Mode

In development mode, the backend will use `nodemon` to automatically restart when changes are made. Run the following command:

```bash
npm run dev
```

#### Option 2: Using Node.js

To run the backend using plain Node.js (without automatic restarts), use this command:

```bash
node index.js
```

This will start the server, and it will listen for incoming requests on the port defined in the `.env` file (typically port 3000).

---

## Project Structure

Here’s a quick overview of the folder structure:

```
|-- controllers/    # API route controllers
|-- models/         # Sequelize models
|-- routes/         # Route definitions
|-- utils/          # Utility functions
|-- index.js        # Entry point of the backend application
|-- package.json    # Project dependencies and scripts
|-- .env            # Environment variables (not included in version control)
```

---

## Contributing

Feel free to contribute to this project by:

- Forking the repository
- Creating a new branch
- Making changes
- Submitting a pull request

Ensure to write clear commit messages and follow best practices.

---

## Common Issues
   
1. **Missing Dependencies**: Run `npm install` to ensure all dependencies are installed.

---

## Contact

For any questions or issues, please contact [adebayooluwatobi2018@gmail.com](adebayooluwatobi2018@gmail.com).

---

This file should provide users and developers all the details they need to get your backend project up and running locally in development mode. Adjust any URLs, credentials, and specific information as needed for your project.