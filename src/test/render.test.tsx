import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import App from "../App";
describe("App (render)", () => {
  const html = renderToStaticMarkup(<App />);

  it("renders without errors and is not empty", () => {
    expect(html.length).toBeGreaterThan(500);
  });

  it("shows the main sections", () => {
    expect(html).toContain("Total Balance");
    expect(html).toContain("Balance Over Time");
    expect(html).toContain("Expenses by Category");
    expect(html).toContain("Transactions");
  });

  it("shows the sample data", () => {
    expect(html).toContain("June Salary");
    expect(html).toContain("Rent");
  });
});