import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import App from "../App.jsx";

// Smoke test: verifies the whole component tree renders without throwing
// and that the key content is present in the HTML.
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
