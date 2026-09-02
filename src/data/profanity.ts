// Words blocked from transaction descriptions in the Add Transaction form.
// Curated from common English profanity plus identity-based slurs; trimmed
// down from broader public bad-word lists to drop clinical/medical terms,
// brand names, and words with everyday non-vulgar meanings (those cause
// false positives and don't belong in a courtesy filter like this one).

const PROFANITY = [
  "arse", "arsehole", "ass", "asshole", "assmunch", "bastard", "bitch", "bitches",
  "bloody", "bollocks", "bugger", "bullshit", "clusterfuck", "crap", "cunt",
  "damn", "dick", "dickhead", "douche", "douchebag", "dumbass", "fuck",
  "fucker", "fuckin", "fucking", "goddamn", "hell", "jackass", "motherfucker",
  "motherfucking", "piss", "pissed", "prick", "shit", "shithead", "shitty",
  "slut", "tosser", "twat", "wank", "wanker", "whore",
];

const VULGAR_SLANG = [
  "blowjob", "boner", "boob", "boobs", "cock", "cocks", "cum", "cumming",
  "dildo", "handjob", "horny", "jizz", "nipple", "nipples", "orgasm", "pussy",
  "tit", "tits", "titty", "titties", "vagina", "vibrator",
];

const SERIOUS = [
  "bestiality", "daterape", "incest", "jailbait", "paedophile", "pedophile",
  "rape", "raping", "rapist",
];

const SLURS = [
  "beaner", "beaners", "bulldyke", "carpetmuncher", "coon", "coons", "darkie",
  "fag", "faggot", "fudgepacker", "honkey", "jigaboo", "jiggaboo", "jiggerboo",
  "kike", "mong", "neonazi", "nigga", "nigger", "paki", "poof", "raghead",
  "retard", "slanteye", "spastic", "spic", "swastika", "towelhead", "tranny",
  "wetback",
];

export const PROFANITY_WORDS: readonly string[] = [
  ...PROFANITY, ...VULGAR_SLANG, ...SERIOUS, ...SLURS,
];
