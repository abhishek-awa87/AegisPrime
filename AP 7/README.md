# Aegis Prime

Aegis Prime is a foundational, Apple-inspired React application that integrates with the Gemini API. It features a clean, responsive interface with theme switching, a robust prompt/response workflow, multimodal input capabilities, and a polished export system. This application is designed for easy deployment on Google AI Studio and Google Cloud Run.

## Features

-   **Clean, Responsive UI**: A minimalist, Apple-inspired design that works beautifully across all devices, with both light and dark modes.
-   **Gemini API Integration**: Leverages the `@google/genai` SDK to provide powerful, AI-driven responses.
-   **Multimodal Inputs**: Supports text prompts, file uploads (Image, Audio, Video, PDF), and URL analysis for rich, contextual interactions.
-   **Advanced File Analysis (Simulated)**: For media files like audio, video, and PDFs, the application displays a simulated analysis, including transcriptions, scene detection, and key point extraction. This showcases how deeper integrations could work.
-   **URL Content Fetching (Simulated)**: Analyze content from a URL. The current implementation uses a mock for a Wikipedia article to demonstrate functionality.
-   **Prompt Engineering Framework (PAFT)**: Guide the AI's response by defining a Persona, Audience, Format, and Tone, with smart suggestions based on uploaded content.
-   **Session Management**:
    -   **Editable Session Name**: Name your sessions for better organization.
    -   **Session Persistence**: The current session state (including PAFT settings and conversation history) is saved to `sessionStorage`.
-   **Polished Export System**: Export your session in multiple formats:
    -   **JSON**: A complete snapshot of your session state.
    -   **Markdown**: A clean `.md` file with the prompt and response.
    -   **PDF**: A professionally formatted document of your interaction.
-   **Deployment Ready**: Comes with a `Dockerfile` for easy containerization and deployment to services like Google Cloud Run.

## Getting Started

### Prerequisites

-   A modern web browser that supports ES Modules (Chrome, Firefox, Safari, Edge).
-   A Google Gemini API Key.

### Running Locally

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd aegis-prime
    ```

2.  **Set up your API Key:**
    The application is configured to read the Gemini API key from the environment. You must configure this in the execution environment where the app is served. In Google AI Studio, this is handled automatically.

3.  **Serve the application:**
    Since this is a client-side application with no build step, you can serve the files using any simple static file server.
    
    If you have Python:
    ```bash
    python -m http.server
    ```
    
    If you have Node.js and `serve`:
    ```bash
    npx serve .
    ```

4.  Open your browser and navigate to the local server's address (e.g., `http://localhost:8000`).

### Important Notice: Simulated Features

To provide a comprehensive demonstration without requiring complex backend infrastructure, the following features are **simulated** on the client-side:

-   **URL Content Fetching**: The app does not actually scrape web pages. It uses a mock data object for a predefined Wikipedia URL.
-   **Media Analysis**: The analysis of audio, video, and PDF files (e.g., transcription, scene detection) is simulated with placeholder data to showcase the UI and potential capabilities.

A real-world implementation of these features would require a backend service or serverless functions to handle CORS policies and perform the intensive analysis tasks.

## Deployment to Google Cloud Run

This application is ready to be deployed as a container to Google Cloud Run.

### Prerequisites

-   Google Cloud SDK (`gcloud`) installed and configured.
-   Docker installed.
-   A Google Cloud Project with the Artifact Registry and Cloud Run APIs enabled.

### Steps

1.  **Build the Docker image:**
    From the project root directory, run:
    ```bash
    gcloud builds submit --tag gcr.io/[PROJECT_ID]/aegis-prime
    ```
    Replace `[PROJECT_ID]` with your Google Cloud Project ID. This command will build the image using Cloud Build and push it to your project's Container Registry.

2.  **Deploy to Cloud Run:**
    Run the following command to deploy the container image:
    ```bash
    gcloud run deploy aegis-prime \
        --image gcr.io/[PROJECT_ID]/aegis-prime \
        --platform managed \
        --region [REGION] \
        --allow-unauthenticated
    ```
    -   Replace `[PROJECT_ID]` with your Project ID.
    -   Replace `[REGION]` with your preferred GCP region (e.g., `us-central1`).
    -   The `--allow-unauthenticated` flag makes the service publicly accessible. Remove it if you want to manage access via IAM.

3.  **Set the API Key:**
    You must provide the Gemini API key as an environment variable to your Cloud Run service.
    
    Go to your service in the Google Cloud Console, click "Edit & Deploy New Revision", and under the "Variables & Secrets" tab, add an environment variable named `API_KEY` with your key as the value.

Once deployed, Google Cloud will provide you with a URL to access your live application.
