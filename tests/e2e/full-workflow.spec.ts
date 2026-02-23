import { expect, test, type Page } from "@playwright/test";

const sampleFingerprintDataUrl =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx7/2wBDAQUFBQcGBw4ICA4eFBEUHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCABAAEADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwClRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQB//Z";

const fingerOrder = [
  "left_thumb",
  "left_index",
  "left_middle",
  "left_ring",
  "left_pinky",
  "right_thumb",
  "right_index",
  "right_middle",
  "right_ring",
  "right_pinky",
] as const;

async function typeWithNumericKeypad(page: Page, fieldId: string, keys: string) {
  await page.locator(`#${fieldId}`).click();
  for (const key of keys) {
    await page.getByRole("button", { name: key, exact: true }).click();
  }
  await page.getByRole("button", { name: "OK", exact: true }).click();
}

test("frontend to backend full workflow", async ({ page }) => {
  test.setTimeout(240_000);

  await page.goto("/");

  await page.getByRole("button", { name: /click to start/i }).click({ force: true });
  await expect(page.getByText("Your Privacy Comes First")).toBeVisible();

  await page.getByRole("switch", { name: "Toggle research consent" }).click();
  await page.getByRole("button", { name: "Continue", exact: true }).click();

  await expect(page).toHaveURL(/\/demographics$/);
  await expect(page.getByText("Your Health Context")).toBeVisible();

  await typeWithNumericKeypad(page, "age", "30");
  await typeWithNumericKeypad(page, "weight", "70");

  await page.getByRole("button", { name: "cm", exact: true }).click();
  await typeWithNumericKeypad(page, "height", "170");

  await page.locator("#gender").click();
  await page.getByText("Female", { exact: true }).last().click();

  await page.evaluate(
    ({ fingers, image }) => {
      const payload: Record<string, string> = {};
      for (const finger of fingers) payload[finger] = image;
      sessionStorage.setItem("scanned_fingerprints", JSON.stringify(payload));
    },
    { fingers: fingerOrder, image: sampleFingerprintDataUrl }
  );

  await page
    .getByRole("button", { name: /continue to fingerprint scan/i })
    .click();

  await expect(page).toHaveURL(/\/scan$/, { timeout: 40_000 });
  await expect(page.getByText("10/10 Scanned")).toBeVisible();

  await page.getByRole("button", { name: /finish & analyze/i }).click();
  await page.getByRole("button", { name: "Yes, Finish!", exact: true }).click();

  await expect(page).toHaveURL(/\/results$/, { timeout: 180_000 });
  await expect(page.getByText("Analysis Results")).toBeVisible();
  await expect(page.getByText("Diabetes Risk Assessment")).toBeVisible();
  await expect(page.getByText("Predicted Blood Type")).toBeVisible();
});
