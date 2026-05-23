import type { Format3Data } from "#/types/resume/resumeTypes";

// Helper to extract final value from AI field or primitive
const extractFinalValue = (field: any): any => {
  // If it's an AI field with old_value/new_value structure
  if (
    field &&
    typeof field === "object" &&
    "old_value" in field &&
    "new_value" in field
  ) {
    // If final_value exists, use it (user accepted/rejected/edited)
    if ("final_value" in field && field.final_value !== undefined) {
      return field.final_value;
    }
    // Otherwise use new_value (AI suggestion)
    return field.new_value;
  }
  // Return primitive value as-is
  return field;
};

// Convert profile section from format_2 to format_3
export const convertProfileToFormat3 = (
  profileFormat2: any,
): Format3Data["profile"] => {
  return {
    profile_picture: profileFormat2.profile_picture || "",
    first_name: profileFormat2.first_name || "",
    last_name: profileFormat2.last_name || "",
    professional_title: extractFinalValue(profileFormat2.professional_title),
    email: profileFormat2.email || "",
    phone: profileFormat2.phone || "",
    location: profileFormat2.location || "",
    links: profileFormat2.links || [],
    summary: extractFinalValue(profileFormat2.summary),
  };
};

// Convert array entries (education, experience, etc.)
const convertEntriesToFormat3 = (
  entries: any[],
  fieldsToExtract: string[],
): any[] => {
  if (!entries) return [];

  return entries.map((entry: any) => {
    const converted: any = {};

    // Copy all primitive fields
    Object.keys(entry).forEach((key) => {
      if (fieldsToExtract.includes(key)) {
        converted[key] = extractFinalValue(entry[key]);
      } else if (
        !entry[key] ||
        typeof entry[key] !== "object" ||
        Array.isArray(entry[key])
      ) {
        converted[key] = entry[key];
      } else if (
        entry[key] &&
        typeof entry[key] === "object" &&
        !("old_value" in entry[key])
      ) {
        converted[key] = entry[key];
      }
    });

    return converted;
  });
};

// Main converter: format_2 (AI diff structure) → format_3 (clean data)
export const convertToFormat3 = (format2Data: any): Format3Data => {
  return {
    profile: convertProfileToFormat3(format2Data.profile),
    education: convertEntriesToFormat3(format2Data.education?.entries || [], [
      "degree",
      "description",
    ]),
    experience: convertEntriesToFormat3(format2Data.experience?.entries || [], [
      "position",
      "description",
    ]),
    projects: convertEntriesToFormat3(format2Data.projects?.entries || [], [
      "subtitle",
      "description",
    ]),
    certificates: convertEntriesToFormat3(
      format2Data.certificates?.entries || [],
      ["name", "description"],
    ),
    skills: convertEntriesToFormat3(format2Data.skills?.entries || [], [
      "name",
    ]),
    languages: convertEntriesToFormat3(
      format2Data.languages?.entries || [],
      [],
    ),
    interests: convertEntriesToFormat3(
      format2Data.interests?.entries || [],
      [],
    ),
    awards: convertEntriesToFormat3(format2Data.awards?.entries || [], [
      "title",
      "description",
    ]),
    publications: convertEntriesToFormat3(
      format2Data.publications?.entries || [],
      ["title", "description"],
    ),
    references: convertEntriesToFormat3(
      format2Data.references?.entries || [],
      [],
    ),
  };
};
