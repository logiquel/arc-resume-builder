import type { Format3Data, ProfileLink } from "#/types/resume/resumeTypes";
import type {
  DiffField,
  MaybeDiffField,
  TailoringSession,
} from "#/types/resume/tailorSessionTypes";

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

  return (value.resolved_value ?? value.old_value ?? fallback) as T;
};

const toString = (value: string | string[] | null | undefined): string => {
  if (Array.isArray(value)) return value.filter(Boolean).join(", ");
  return value ?? "";
};

const toMultilineString = (
  value: string | string[] | null | undefined,
): string => {
  if (Array.isArray(value)) return value.filter(Boolean).join("\n");
  return value ?? "";
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
      summary: toMultilineString(resolveDiffValue(changes.profile.summary, "")),
    },

    education: (changes.education.entries ?? []).map((item) => ({
      institution: item.institution ?? "",
      location: item.location ?? "",
      start_date: item.start_date ?? "",
      end_date: item.end_date ?? "",
      link: item.link ?? "",
      degree: toString(resolveDiffValue(item.degree, "")),
      score: item.score ?? "",
      description:
        typeof item.description === "string"
          ? item.description
          : toMultilineString(resolveDiffValue(item.description, "")),
    })),

    experience: (changes.experience.entries ?? []).map((item) => ({
      company: item.company ?? "",
      location: item.location ?? "",
      start_date: item.start_date ?? "",
      end_date: item.end_date ?? "",
      position: toString(resolveDiffValue(item.position, "")),
      description:
        typeof item.description === "string"
          ? item.description
          : toMultilineString(resolveDiffValue(item.description, "")),
    })),

    projects: (changes.projects.entries ?? []).map((item) => ({
      title: item.title ?? "",
      link: item.link ?? "",
      start_date: item.start_date ?? "",
      end_date: item.end_date ?? "",
      subtitle: toString(resolveDiffValue(item.subtitle, "")),
      description:
        typeof item.description === "string"
          ? item.description
          : toMultilineString(resolveDiffValue(item.description, "")),
    })),

    certificates: (changes.certificates.entries ?? []).map((item) => ({
      name: toString(resolveDiffValue(item.name, "")),
      issuer: item.issuer ?? "",
      issue_date: item.issue_date ?? "",
      expiry_date: item.expiry_date ?? "",
      link: item.link ?? "",
      description: toMultilineString(resolveDiffValue(item.description, "")),
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
      description: toMultilineString(resolveDiffValue(item.description, "")),
    })),

    publications: (changes.publications.entries ?? []).map((item) => ({
      title: toString(resolveDiffValue(item.title, "")),
      publisher: item.publisher ?? "",
      date: item.date ?? "",
      link: item.link ?? "",
      description: toMultilineString(resolveDiffValue(item.description, "")),
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
