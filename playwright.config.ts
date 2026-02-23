import { defineConfig, devices } from "@playwright/test";

const kioskApiKey = "qa-test-key-123456789012345678901234";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  retries: 0,
  timeout: 240_000,
  expect: {
    timeout: 30_000,
  },
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: "http://localhost:3000",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    headless: true,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: [
    {
      command: "python manage.py runserver localhost:8000 --noreload",
      cwd: "../backend-cloud",
      timeout: 180_000,
      reuseExistingServer: true,
      url: "http://localhost:8000/api/health",
      env: {
        ...process.env,
        ALLOWED_HOSTS: "localhost,127.0.0.1",
        CORS_ALLOWED_ORIGINS: "http://localhost:3000,http://127.0.0.1:3000",
        BACKEND_API_KEY: "",
        MODEL_STACK: "final_v1",
        OPENAI_API_KEY: "sk-test-dummy",
        OPENAI_BASE_URL: "http://127.0.0.1:9/v1",
        STORAGE_BACKEND: "local",
      },
    },
    {
      command: "npm run dev -- --hostname localhost --port 3000",
      cwd: ".",
      timeout: 180_000,
      reuseExistingServer: true,
      url: "http://localhost:3000",
      env: {
        ...process.env,
        NEXT_PUBLIC_API_URL: "http://localhost:8000/api",
        NEXT_PUBLIC_SCANNER_URL: "http://127.0.0.1:5000",
        NEXT_PUBLIC_KIOSK_API_KEY: kioskApiKey,
      },
    },
  ],
});
