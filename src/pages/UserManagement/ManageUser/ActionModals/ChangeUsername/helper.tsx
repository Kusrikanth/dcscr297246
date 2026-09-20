// TODO: remove the sample data once the change-username APIs are available.
// Keeps the Rename / Merge / Split flows reviewable without a backend.
export const USE_SAMPLE_USERNAME_MANAGEMENT = true;

export interface ILinkedAccount {
  id: string;
  name: string;
  admissionNumber: string;
  className: string;
  relation: string;
  newUsername?: string;
}

export const usernamePattern = /^[A-Za-z0-9][A-Za-z0-9._-]{3,44}$/;

/** Usernames already taken in the system, used for the uniqueness validation. */
export const sampleExistingUsernames: Array<string> = [
  "NHAD0488",
  "NHAD0466",
  "NHTR0278",
  "NHTR0192",
  "NHTR0385",
  "NHTR0617",
  "NHTR0656",
  "NHTR0855",
  "NHTR1079",
  "NHTR1165",
  "NHPR1001",
  "NHPR1002",
  "NHPR1003",
  "NHST2201",
  "NHST2202",
  "NHST2203",
];

/**
 * Accounts (siblings / merged students) sharing a single username.
 * Usernames that are not listed here fall back to a generated pair so that the
 * split flow can still be walked through for any row in the list.
 */
export const sampleSharedUsernameAccounts: { [username: string]: Array<ILinkedAccount> } = {
  NHPR1001: [
    {
      id: "NHPR1001-1",
      name: "Aarav Sharma",
      admissionNumber: "ADM202301",
      className: "VI - A",
      relation: "Sibling 1",
    },
    {
      id: "NHPR1001-2",
      name: "Anaya Sharma",
      admissionNumber: "ADM202355",
      className: "III - B",
      relation: "Sibling 2",
    },
    {
      id: "NHPR1001-3",
      name: "Aditya Sharma",
      admissionNumber: "ADM202412",
      className: "I - C",
      relation: "Sibling 3",
    },
  ],
  NHPR1002: [
    {
      id: "NHPR1002-1",
      name: "Ishaan Verma",
      admissionNumber: "ADM202108",
      className: "IX - A",
      relation: "Sibling 1",
    },
    {
      id: "NHPR1002-2",
      name: "Ira Verma",
      admissionNumber: "ADM202233",
      className: "V - D",
      relation: "Sibling 2",
    },
  ],
  // Single account usernames - nothing to split.
  NHAD0488: [
    {
      id: "NHAD0488-1",
      name: "Attala Hemanth Reddy",
      admissionNumber: "-",
      className: "-",
      relation: "Primary Account",
    },
  ],
  NHTR0278: [
    {
      id: "NHTR0278-1",
      name: "Idambi Venugopal",
      admissionNumber: "-",
      className: "-",
      relation: "Primary Account",
    },
  ],
};

/** Record counts shown before a merge is confirmed. */
export const sampleUsernameRecords: { [username: string]: any } = {
  default: {
    feeRecords: 12,
    attendanceRecords: 186,
    documents: 4,
    communications: 23,
  },
};

export function getUsernameRecordSummary(username: string) {
  return sampleUsernameRecords[username] || sampleUsernameRecords.default;
}

export function getDisplayName(userDetails: any) {
  if (!userDetails) {
    return "";
  }
  const { firstName, lastName, name } = userDetails;
  return `${firstName || ""} ${lastName || ""}`.trim() || name || "";
}

/** Sample usernames merged with the ones currently listed in the table. */
export function getExistingUsernames(usersList?: Array<any>) {
  const listedUsernames = (Array.isArray(usersList) ? usersList : [])
    .map((item: any) => item?.username)
    .filter((username: any) => typeof username === "string" && username.trim());
  const allUsernames = USE_SAMPLE_USERNAME_MANAGEMENT
    ? [...sampleExistingUsernames, ...listedUsernames]
    : listedUsernames;
  return Array.from(new Set(allUsernames));
}

export function isUsernameTaken(username: string, existingUsernames: Array<string>) {
  const trimmedUsername = (username || "").trim().toLowerCase();
  return existingUsernames.some(
    (item: string) => (item || "").trim().toLowerCase() === trimmedUsername
  );
}

interface IValidateUsernameOptions {
  currentUsername?: string;
  existingUsernames?: Array<string>;
  /** Usernames already entered in the same form (split screen), to block duplicates. */
  takenUsernames?: Array<string>;
  fieldLabel?: string;
}

/** Returns the validation message for a username, or an empty string when it is valid. */
export function validateUsername(username: string, options: IValidateUsernameOptions = {}) {
  const {
    currentUsername = "",
    existingUsernames = [],
    takenUsernames = [],
    fieldLabel = "Username",
  } = options;
  const trimmedUsername = (username || "").trim();
  if (!trimmedUsername) {
    return `${fieldLabel} is required.`;
  }
  if (trimmedUsername.length < 4) {
    return `${fieldLabel} should be at least 4 characters.`;
  }
  if (trimmedUsername.length > 45) {
    return `${fieldLabel} should not exceed 45 characters.`;
  }
  if (!usernamePattern.test(trimmedUsername)) {
    return `${fieldLabel} can contain only letters, numbers, dot, hyphen and underscore, and should start with a letter or number.`;
  }
  if (
    currentUsername &&
    trimmedUsername.toLowerCase() === currentUsername.trim().toLowerCase()
  ) {
    return `${fieldLabel} is same as the current username. Enter a different username.`;
  }
  if (isUsernameTaken(trimmedUsername, existingUsernames)) {
    return `Username "${trimmedUsername}" already exists. Enter a unique username.`;
  }
  if (isUsernameTaken(trimmedUsername, takenUsernames)) {
    return `Username "${trimmedUsername}" is already used for another account in this split.`;
  }
  return "";
}

/** Accounts currently mapped to a username. */
export function getLinkedAccounts(username: string, userDetails?: any): Array<ILinkedAccount> {
  const trimmedUsername = (username || "").trim();
  if (!trimmedUsername) {
    return [];
  }
  const mappedAccounts = sampleSharedUsernameAccounts[trimmedUsername];
  if (Array.isArray(mappedAccounts)) {
    return mappedAccounts;
  }
  if (!USE_SAMPLE_USERNAME_MANAGEMENT) {
    return [];
  }
  // Fallback demo data so any username picked from the list can be walked through.
  const displayName = getDisplayName(userDetails) || trimmedUsername;
  return [
    {
      id: `${trimmedUsername}-1`,
      name: `${displayName} (Sibling 1)`,
      admissionNumber: `ADM${trimmedUsername.slice(-4)}1`,
      className: "VII - A",
      relation: "Sibling 1",
    },
    {
      id: `${trimmedUsername}-2`,
      name: `${displayName} (Sibling 2)`,
      admissionNumber: `ADM${trimmedUsername.slice(-4)}2`,
      className: "IV - B",
      relation: "Sibling 2",
    },
  ];
}

/** Usernames that can be searched in the split screen, with their account count. */
export function getSharedUsernameOptions(usersList?: Array<any>) {
  return getExistingUsernames(usersList).map((username: string) => {
    const linkedAccounts = getLinkedAccounts(username);
    return {
      id: username,
      username,
      accountsCount: linkedAccounts.length,
      accountsLabel: `${username} (${linkedAccounts.length} ${
        linkedAccounts.length === 1 ? "account" : "accounts"
      })`,
    };
  });
}

/** Builds a unique suggested username for each account of a split. */
export function buildSplitUsernameSuggestion(
  baseUsername: string,
  index: number,
  existingUsernames: Array<string>,
  takenUsernames: Array<string>
) {
  const base = (baseUsername || "USER").trim();
  let suggestion = `${base}${index + 1}`;
  let suffix = index + 1;
  while (
    isUsernameTaken(suggestion, existingUsernames) ||
    isUsernameTaken(suggestion, takenUsernames)
  ) {
    suffix += 1;
    suggestion = `${base}${suffix}`;
  }
  return suggestion;
}

export function renderUsernameOption(item: any) {
  return `${item?.accountsLabel}`;
}

export function renderUsernameValue(selectedItem: any) {
  return `${selectedItem?.username}`;
}
