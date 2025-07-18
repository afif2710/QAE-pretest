# GoRest API Automation

This project demonstrates API automation for the [GoRest.co.in](https://gorest.co.in/) API using JavaScript, Mocha, Chai, and Axios. It includes positive and negative test cases for user creation, retrieval, update, and deletion.

## Technologies Used

* **JavaScript**: The primary programming language.
* **Node.js**: Runtime environment.
* **Axios**: Promise-based HTTP client for the browser and Node.js.
* **Mocha**: A feature-rich JavaScript test framework.
* **Chai**: An assertion library compatible with Mocha.
* **Mochawesome**: A custom reporter for Mocha that generates beautiful HTML reports.
* **Dotenv**: Loads environment variables from a `.env` file.
* **Chance**: A random data generator.

## Getting Started

### Prerequisites

* Node.js (LTS version recommended)
* npm (Node Package Manager, comes with Node.js)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd gorest-api-automation
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

### Configuration

1.  **Obtain your GoRest API Token:**
    * Go to [https://gorest.co.in/](https://gorest.co.in/) and log in or register.
    * Once logged in, your API token will be displayed on the dashboard. This token is required for authenticated API requests.

2.  **Create a `.env` file:**
    At the root of the project, create a file named `.env` and add your GoRest API token:
    ```
    GOREST_API_TOKEN="YOUR_API_TOKEN_HERE"
    ```
    **Replace `"YOUR_API_TOKEN_HERE"` with the actual token you obtained.**

### Running the Tests

To execute the API tests and generate a report, run the following command in your terminal:

```bash
npm test