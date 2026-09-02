import { PROFANITY_WORDS } from "../data/profanity";

export const MAX_DESC_LENGTH = 60;

// Strip ASCII control chars, zero-width chars, and bidi overrides (e.g. a
// direction-override character that makes text render differently than it
// reads) before anything else touches the value - belt-and-suspenders,
// since React already escapes output on its own.
const UNSAFE_CHARS = new RegExp(
  "[\\u0000-\\u001f\\u007f-\\u009f\\u200b-\\u200f\\u202a-\\u202e\\u2066-\\u2069\\ufeff]",
  "g"
);

const stripUnsafeChars = (input: string): string => input.replace(UNSAFE_CHARS, "");

export const sanitizeDesc = (input: string): string =>
  stripUnsafeChars(input).replace(/\s+/g, " ").trim();

const LEET_MAP: Record<string, string> = { "0": "o", "1": "i", "3": "e", "4": "a", "5": "s", "7": "t", "@": "a", "$": "s" };

// Collapse a run of 3+ identical letters (e.g. "fuuuuck") down to one, so
// stretched-out spelling still matches - real English words essentially
// never repeat a letter three times in a row.
const collapseStretched = (word: string): string => word.replace(/(.)\1{2,}/g, "$1");

// Keeps letters and spaces, dropping everything else (punctuation, digits
// left over from leetspeak, symbols). Spaces are kept - not stripped - so
// separate words stay separate tokens instead of merging into one string
// (merging is what causes false positives like "class assignment" matching
// the word "ass").
const tokenize = (input: string): string[] =>
  input
    .toLowerCase()
    .replace(/[013457@$]/g, (c) => LEET_MAP[c] ?? c)
    .replace(/[^a-z ]/g, "")
    .split(/\s+/)
    .filter(Boolean)
    .map(collapseStretched);

const BLOCKLIST = new Set(PROFANITY_WORDS);

export const containsProfanity = (input: string): boolean =>
  tokenize(input).some((word) => BLOCKLIST.has(word));
