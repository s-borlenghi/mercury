import { describe, it, expect } from "vitest";
import { sanitizeDesc, containsProfanity, MAX_DESC_LENGTH } from "../lib/validate";

describe("sanitizeDesc", () => {
  it("trims and collapses whitespace", () => {
    expect(sanitizeDesc("  Weekly   groceries  ")).toBe("Weekly groceries");
  });

  it("strips zero-width and bidi control characters", () => {
    expect(sanitizeDesc("Rent​‮")).toBe("Rent");
  });
});

describe("containsProfanity", () => {
  it("flags a blocklisted word", () => {
    expect(containsProfanity("this is shit")).toBe(true);
  });

  it("flags a blocklisted word with simple leetspeak substitution", () => {
    expect(containsProfanity("sh1t happens")).toBe(true);
  });

  it("does not flag ordinary descriptions", () => {
    expect(containsProfanity("Weekly groceries")).toBe(false);
    expect(containsProfanity("Train Pass")).toBe(false);
  });

  it("does not flag a word that merely contains a blocked word as a substring (Scunthorpe problem)", () => {
    expect(containsProfanity("Class assignment")).toBe(false);
    expect(containsProfanity("Cockpit repair")).toBe(false);
    expect(containsProfanity("Assessment fee")).toBe(false);
  });

  it("flags a blocked word split by punctuation used to dodge the filter", () => {
    expect(containsProfanity("sh.i.t happens")).toBe(true);
  });

  it("flags a stretched-out spelling", () => {
    expect(containsProfanity("fuuuuck")).toBe(true);
  });

  it("flags identity-based slurs", () => {
    expect(containsProfanity("what a nigger")).toBe(true);
    expect(containsProfanity("dirty paki")).toBe(true);
  });
});

describe("MAX_DESC_LENGTH", () => {
  it("is a positive limit", () => {
    expect(MAX_DESC_LENGTH).toBeGreaterThan(0);
  });
});
