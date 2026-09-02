import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import App from "../App";

// Smoke test: the whole tree renders without throwing and the key content
// is present. With no window, persistence falls back to the seed data.
describe("App (render)", () => {
  const html = renderToStaticMarkup(<App />);

  it("renders without errors and is not empty", () => {
    expect(html.length).toBeGreaterThan(500);
  });

  it("shows the main sections", () => {
    expect(html).toContain("Saldo totale");
    expect(html).toContain("Andamento del saldo");
    expect(html).toContain("Uscite per categoria");
    expect(html).toContain("Movimenti");
  });

  it("shows the sample data", () => {
    expect(html).toContain("Stipendio giugno");
    expect(html).toContain("Affitto");
  });
});
