import React from "react";
import type { Format3Data } from "#/types/resume/resume.types";
import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  Font,
  Link,
} from "@react-pdf/renderer";

Font.register({
  family: "Outfit",
  fonts: [
    { src: "/fonts/Outfit/Outfit-Regular.ttf", fontWeight: 400 },
    { src: "/fonts/Outfit/Outfit-Medium.ttf", fontWeight: 500 },
    { src: "/fonts/Outfit/Outfit-SemiBold.ttf", fontWeight: 600 },
    { src: "/fonts/Outfit/Outfit-Bold.ttf", fontWeight: 700 },
  ],
});

// UNIFORM SPACING SYSTEM
const SPACING = {
  page: 40,
  headerBottom: 20,
  sectionTitleBottom: 4,
  itemBottom: 8,
  elementGap: 3,
  lineHeight: 1.45,
};

const styles = StyleSheet.create({
  page: {
    paddingTop: SPACING.page,
    paddingBottom: SPACING.page,
    paddingLeft: SPACING.page,
    paddingRight: SPACING.page,
    backgroundColor: "#ffffff",
    fontFamily: "Outfit",
    color: "#333333",
  },

  headerContainer: {
    backgroundColor: "#0A65CC",
    marginTop: -SPACING.page,
    marginLeft: -SPACING.page,
    marginRight: -SPACING.page,
    paddingTop: SPACING.page,
    paddingBottom: 20,
    paddingLeft: SPACING.page,
    paddingRight: SPACING.page,
    marginBottom: 20,
  },

  header: {
    width: "100%",
  },
  name: {
    fontSize: 28,
    color: "#ffffff",
    fontWeight: 600,
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 14,
    color: "#E0E7FF",
    fontWeight: 500,
    marginBottom: 12,
  },
  contactRow: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    rowGap: 6,
    columnGap: 16,
  },
  contactText: {
    fontSize: 9.5,
    color: "#E0E7FF",
  },
  contactLink: {
    fontSize: 9.5,
    color: "#ffffff",
    textDecoration: "none",
    fontWeight: 500,
  },

  contentContainer: {
    width: "100%",
  },

  section: {
    width: "100%",
    marginBottom: 0,
  },
  sectionTitle: {
    fontSize: 11,
    marginTop: 10,
    marginBottom: SPACING.sectionTitleBottom,
    color: "#0a65cc",
    letterSpacing: 1.5,
    fontWeight: 600,
  },

  summary: {
    fontSize: 9.8,
    color: "#374151",
    lineHeight: SPACING.lineHeight,
  },

  item: {
    width: "100%",
    marginBottom: SPACING.itemBottom,
  },
  itemHeader: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: SPACING.elementGap,
    gap: 10,
  },
  itemTitle: {
    fontSize: 10.5,
    color: "#111827",
    fontWeight: 600,
  },
  itemDate: {
    fontSize: 9,
    color: "#6b7280",
    textAlign: "right",
  },
  itemSubHeader: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: SPACING.elementGap,
    gap: 10,
  },
  itemSubtitle: {
    fontSize: 9.5,
    color: "#374151",
  },
  itemLocation: {
    fontSize: 9,
    color: "#6b7280",
    textAlign: "right",
  },

  description: {
    fontSize: 9.5,
    color: "#374151",
    lineHeight: SPACING.lineHeight,
    marginTop: SPACING.elementGap,
  },
  // Updated bullet text style with better spacing
  bulletText: {
    fontSize: 9.5,
    color: "#374151",
    lineHeight: SPACING.lineHeight,
    marginBottom: 2,
    flexDirection: "row",
  },
  bulletPoint: {
    width: 8,
    fontSize: 9.5,
    color: "#0a65cc", // Make bullet points stand out with brand color
    marginRight: 0,
  },
  bulletContent: {
    fontSize: 9.5,
    color: "#374151",
    lineHeight: SPACING.lineHeight,
    flex: 1,
  },

  skillWrap: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    columnGap: 10,
    rowGap: 4,
    marginTop: 2,
  },
  skillItem: {
    fontSize: 9.5,
    color: "#374151",
  },

  smallText: {
    fontSize: 9,
    color: "#6b7280",
    marginTop: SPACING.elementGap,
  },

  linkText: {
    fontSize: 9,
    color: "#0a65cc",
    textDecoration: "none",
    marginTop: SPACING.elementGap,
  },
});

interface ATSTemplateProps {
  data: Format3Data;
}

const safeArray = <T,>(value: T[] | null | undefined): T[] =>
  Array.isArray(value) ? value : [];

const hasText = (value?: string | null) =>
  typeof value === "string" && value.trim().length > 0;

const formatDate = (date?: string | null) => {
  if (!date || !date.trim()) return "Present";

  const [year, month] = date.split("-");
  if (month) {
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const monthIndex = Number(month) - 1;
    if (monthIndex >= 0 && monthIndex < 12) {
      return `${monthNames[monthIndex]} ${year}`;
    }
  }

  return year || date;
};

const normalizeHref = (value?: string | null) => {
  if (!value || !value.trim()) return null;
  const trimmed = value.trim();

  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("mailto:") ||
    trimmed.startsWith("tel:")
  ) {
    return trimmed;
  }

  if (trimmed.includes("@")) return `mailto:${trimmed}`;
  return `https://${trimmed}`;
};

// Updated renderDescription function with guaranteed bullet points using View and Text components
const renderDescription = (description?: string | string[] | null) => {
  if (!description) return null;

  if (Array.isArray(description)) {
    const items = description.filter((item) => hasText(item));
    if (!items.length) return null;

    return items.map((item, idx) => (
      <View key={idx} style={styles.bulletText}>
        <Text style={styles.bulletPoint}>•</Text>
        <Text style={styles.bulletContent}>{item}</Text>
      </View>
    ));
  }

  if (!hasText(description)) return null;

  // For single string, render with bullet point as well for consistency
  return (
    <View style={styles.bulletText}>
      <Text style={styles.bulletPoint}>•</Text>
      <Text style={styles.bulletContent}>{description}</Text>
    </View>
  );
};

export const ATSAesthetic: React.FC<ATSTemplateProps> = ({ data }) => {
  const {
    profile,
    education,
    experience,
    projects,
    skills,
    certificates,
    languages,
    awards,
    publications,
    references,
  } = data;

  const profileLinks = safeArray(profile?.links);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerContainer}>
          <View style={styles.header}>
            <Text style={styles.name}>
              {[profile?.first_name, profile?.last_name]
                .filter(Boolean)
                .join(" ")}
            </Text>

            {hasText(profile?.professional_title) && (
              <Text style={styles.title}>{profile.professional_title}</Text>
            )}

            <View style={styles.contactRow}>
              {hasText(profile?.email) && (
                <Link
                  src={`mailto:${profile.email}`}
                  style={styles.contactLink}
                >
                  {profile.email}
                </Link>
              )}

              {hasText(profile?.phone) && (
                <Text style={styles.contactText}>{profile.phone}</Text>
              )}

              {hasText(profile?.location) && (
                <Text style={styles.contactText}>{profile.location}</Text>
              )}

              {profileLinks.map((link, idx) => {
                if (!hasText(link?.value)) return null;
                const href = normalizeHref(link.value);
                if (!href) return null;

                return (
                  <Link key={idx} src={href} style={styles.contactLink}>
                    {link.value}
                  </Link>
                );
              })}
            </View>
          </View>
        </View>

        <View style={styles.contentContainer}>
          {hasText(profile?.summary) && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>PROFESSIONAL SUMMARY</Text>
              <View style={styles.item}>
                <Text style={styles.summary}>{profile.summary}</Text>
              </View>
            </View>
          )}

          {safeArray(experience).length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>WORK EXPERIENCE</Text>

              {safeArray(experience).map((exp, idx) => (
                <View key={idx} style={styles.item}>
                  <View style={styles.itemHeader}>
                    <Text style={styles.itemTitle}>{exp.position}</Text>
                    <Text style={styles.itemDate}>
                      {formatDate(exp.start_date)} - {formatDate(exp.end_date)}
                    </Text>
                  </View>

                  <View style={styles.itemSubHeader}>
                    <Text style={styles.itemSubtitle}>{exp.company}</Text>
                    {hasText(exp.location) && (
                      <Text style={styles.itemLocation}>{exp.location}</Text>
                    )}
                  </View>

                  {renderDescription(exp.description)}
                </View>
              ))}
            </View>
          )}

          {safeArray(projects).length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>PROJECTS</Text>

              {safeArray(projects).map((project, idx) => (
                <View key={idx} style={styles.item}>
                  <View style={styles.itemHeader}>
                    <Text style={styles.itemTitle}>{project.title}</Text>
                    <Text style={styles.itemDate}>
                      {formatDate(project.start_date)} -{" "}
                      {formatDate(project.end_date)}
                    </Text>
                  </View>

                  {hasText(project.subtitle) && (
                    <Text style={styles.itemSubtitle}>{project.subtitle}</Text>
                  )}

                  {renderDescription(project.description)}

                  {hasText(project.link) && normalizeHref(project.link) && (
                    <Link
                      src={normalizeHref(project.link)!}
                      style={styles.linkText}
                    >
                      {project.link}
                    </Link>
                  )}
                </View>
              ))}
            </View>
          )}

          {safeArray(education).length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>EDUCATION</Text>

              {safeArray(education).map((edu, idx) => (
                <View key={idx} style={styles.item}>
                  <View style={styles.itemHeader}>
                    <Text style={styles.itemTitle}>{edu.degree}</Text>
                    <Text style={styles.itemDate}>
                      {formatDate(edu.start_date)} - {formatDate(edu.end_date)}
                    </Text>
                  </View>

                  <View style={styles.itemSubHeader}>
                    <Text style={styles.itemSubtitle}>{edu.institution}</Text>
                    {hasText(edu.location) && (
                      <Text style={styles.itemLocation}>{edu.location}</Text>
                    )}
                  </View>

                  {hasText(edu.score) && (
                    <Text style={styles.smallText}>Score: {edu.score}</Text>
                  )}

                  {renderDescription(edu.description)}
                </View>
              ))}
            </View>
          )}

          {safeArray(skills).length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>SKILLS</Text>
              <View style={styles.skillWrap}>
                {safeArray(skills).map((skill, idx) => (
                  <Text key={idx} style={styles.skillItem}>
                    • {skill.name}
                    {hasText(skill.level) ? ` (${skill.level})` : ""}
                  </Text>
                ))}
              </View>
            </View>
          )}

          {safeArray(certificates).length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>CERTIFICATIONS</Text>

              {safeArray(certificates).map((cert, idx) => (
                <View key={idx} style={styles.item}>
                  <Text style={styles.itemTitle}>{cert.name}</Text>

                  {hasText(cert.issuer) && (
                    <Text style={styles.itemSubtitle}>{cert.issuer}</Text>
                  )}

                  {(hasText(cert.issue_date) || hasText(cert.expiry_date)) && (
                    <Text style={styles.smallText}>
                      {hasText(cert.issue_date)
                        ? `Issued: ${formatDate(cert.issue_date)}`
                        : ""}
                      {hasText(cert.issue_date) && hasText(cert.expiry_date)
                        ? " • "
                        : ""}
                      {hasText(cert.expiry_date)
                        ? `Expires: ${formatDate(cert.expiry_date)}`
                        : ""}
                    </Text>
                  )}

                  {renderDescription(cert.description)}
                </View>
              ))}
            </View>
          )}

          {safeArray(languages).length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>LANGUAGES</Text>
              <View style={styles.skillWrap}>
                {safeArray(languages).map((lang, idx) => (
                  <Text key={idx} style={styles.skillItem}>
                    • {lang.name}
                    {hasText(lang.level) ? ` (${lang.level})` : ""}
                  </Text>
                ))}
              </View>
            </View>
          )}

          {safeArray(awards).length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>AWARDS</Text>

              {safeArray(awards).map((award, idx) => (
                <View key={idx} style={styles.item}>
                  <View style={styles.itemHeader}>
                    <Text style={styles.itemTitle}>{award.title}</Text>
                    {hasText(award.date) && (
                      <Text style={styles.itemDate}>
                        {formatDate(award.date)}
                      </Text>
                    )}
                  </View>

                  {hasText(award.awarder) && (
                    <Text style={styles.itemSubtitle}>{award.awarder}</Text>
                  )}

                  {renderDescription(award.description)}
                </View>
              ))}
            </View>
          )}

          {safeArray(publications).length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>PUBLICATIONS</Text>

              {safeArray(publications).map((pub, idx) => (
                <View key={idx} style={styles.item}>
                  <View style={styles.itemHeader}>
                    <Text style={styles.itemTitle}>{pub.title}</Text>
                    {hasText(pub.date) && (
                      <Text style={styles.itemDate}>
                        {formatDate(pub.date)}
                      </Text>
                    )}
                  </View>

                  {hasText(pub.publisher) && (
                    <Text style={styles.itemSubtitle}>{pub.publisher}</Text>
                  )}

                  {renderDescription(pub.description)}

                  {hasText(pub.link) && normalizeHref(pub.link) && (
                    <Link
                      src={normalizeHref(pub.link)!}
                      style={styles.linkText}
                    >
                      {pub.link}
                    </Link>
                  )}
                </View>
              ))}
            </View>
          )}

          {safeArray(references).length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>REFERENCES</Text>

              {safeArray(references).map((ref, idx) => (
                <View key={idx} style={styles.item}>
                  <Text style={styles.itemTitle}>{ref.name}</Text>

                  <Text style={styles.itemSubtitle}>
                    {[ref.position, ref.organization]
                      .filter(Boolean)
                      .join(" • ")}
                  </Text>

                  {hasText(ref.email) && (
                    <Text style={styles.smallText}>{ref.email}</Text>
                  )}

                  {hasText(ref.phone) && (
                    <Text style={styles.smallText}>{ref.phone}</Text>
                  )}
                </View>
              ))}
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
};
