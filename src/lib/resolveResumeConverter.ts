import type { Format3Data, ProfileLink } from "#/types/resume/resume.types";
import type {
  DiffField,
  MaybeDiffField,
  TailoringSession,
} from "#/types/resume/tailorSession.types";

const isDiffField = <T extends string | string[]>(
  value: MaybeDiffField<T> | undefined,
): value is DiffField<T> => {
  return !!value && typeof value === "object" && "old_value" in value;
};

const resolveDiffValue = <T extends string | string[]>(
  value: MaybeDiffField<T> | undefined,
  fallback: T,
): T => {
  if (!value) return fallback;
  if (!isDiffField(value)) return value as T;

  // If resolved_value exists, use it
  if (value.resolved_value !== undefined) {
    return value.resolved_value as T;
  }

  // Otherwise use old_value or fallback based on status?
  // Default to new_value if accepted, old_value if rejected
  if (value.status === "accepted") {
    return value.new_value ?? fallback;
  }
  if (value.status === "rejected") {
    return value.old_value ?? fallback;
  }

  // For pending, use new_value as default
  return value.new_value ?? value.old_value ?? fallback;
};

const toString = (value: string | string[] | null | undefined): string => {
  if (Array.isArray(value)) return value.filter(Boolean).join(", ");
  return value ?? "";
};

// Keep arrays as arrays - don't convert to string
const resolveDescription = (
  value: string | string[] | DiffField<string | string[]> | null | undefined,
  fallback: string | string[] = "",
): string | string[] => {
  if (!value) return fallback;

  if (!isDiffField(value)) {
    // If it's already a string or array, return as-is
    return value;
  }

  // Handle DiffField
  const resolved = resolveDiffValue(value, fallback as string | string[]);
  return resolved;
};

const mapProfileLinks = (
  links: Array<{ type: string; url: string }> | undefined,
): ProfileLink[] => {
  return (links ?? []).map((link) => ({
    name: link.type,
    value: link.url,
    icon: link.type,
    type: link.type,
    url: link.url,
  })) as ProfileLink[];
};

export const resolveResumeToFormat3 = (
  tailoringSession: TailoringSession,
): Format3Data => {
  const { changes } = tailoringSession;

  return {
    profile: {
      profile_picture: "",
      first_name: changes.profile.first_name ?? "",
      last_name: changes.profile.last_name ?? "",
      professional_title: toString(
        resolveDiffValue(changes.profile.professional_title, ""),
      ),
      email: changes.profile.email ?? "",
      phone: changes.profile.phone ?? "",
      location: changes.profile.location ?? "",
      links: mapProfileLinks(changes.profile.links),
      summary: toString(resolveDiffValue(changes.profile.summary, "")),
    },

    education: (changes.education.entries ?? []).map((item) => ({
      institution: item.institution ?? "",
      location: item.location ?? "",
      start_date: item.start_date ?? "",
      end_date: item.end_date ?? "",
      link: item.link ?? "",
      degree: toString(resolveDiffValue(item.degree, "")),
      score: item.score ?? "",
      description: resolveDescription(item.description, ""),
    })),

    experience: (changes.experience.entries ?? []).map((item) => ({
      company: item.company ?? "",
      location: item.location ?? "",
      start_date: item.start_date ?? "",
      end_date: item.end_date ?? "",
      position: toString(resolveDiffValue(item.position, "")),
      description: resolveDescription(item.description, ""),
    })),

    projects: (changes.projects.entries ?? []).map((item) => ({
      title: item.title ?? "",
      link: item.link ?? "",
      start_date: item.start_date ?? "",
      end_date: item.end_date ?? "",
      subtitle: toString(resolveDiffValue(item.subtitle, "")),
      description: resolveDescription(item.description, ""),
    })),

    certificates: (changes.certificates.entries ?? []).map((item) => ({
      name: toString(resolveDiffValue(item.name, "")),
      issuer: item.issuer ?? "",
      issue_date: item.issue_date ?? "",
      expiry_date: item.expiry_date ?? "",
      link: item.link ?? "",
      description: toString(resolveDiffValue(item.description, "")),
    })),

    skills: (changes.skills.entries ?? []).map((item) => ({
      name: toString(resolveDiffValue(item.name, "")),
      level: item.level ?? "",
    })),

    languages: (changes.languages.entries ?? []).map((item) => ({
      name: item.name ?? "",
      level: item.level ?? "",
    })),

    interests: (changes.interests.entries ?? []).map((item) => ({
      name: item.name ?? "",
    })),

    awards: (changes.awards.entries ?? []).map((item) => ({
      title: toString(resolveDiffValue(item.title, "")),
      awarder: item.awarder ?? "",
      date: item.date ?? "",
      description: toString(resolveDiffValue(item.description, "")),
    })),

    publications: (changes.publications.entries ?? []).map((item) => ({
      title: toString(resolveDiffValue(item.title, "")),
      publisher: item.publisher ?? "",
      date: item.date ?? "",
      link: item.link ?? "",
      description: toString(resolveDiffValue(item.description, "")),
    })),

    references: (changes.references.entries ?? []).map((item) => ({
      name: item.name ?? "",
      position: item.position ?? "",
      organization: item.organization ?? "",
      email: item.email ?? "",
      phone: item.phone ?? "",
    })),
  };
};
