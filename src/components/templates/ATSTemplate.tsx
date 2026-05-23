import type { Format3Data } from "#/types/resume/resumeTypes";
import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

// Register default fonts (ATS-friendly)
Font.register({
  family: "Helvetica",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/opensans/v18/mem8YaGs126MiZpBA-UFVZ0b.ttf",
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff",
  },
  // Header
  header: {
    marginBottom: 20,
    borderBottom: "1px solid #cccccc",
    paddingBottom: 15,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 6,
    color: "#000000",
  },
  title: {
    fontSize: 14,
    color: "#333333",
    marginBottom: 10,
  },
  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
    gap: 15,
  },
  contactText: {
    fontSize: 9,
    color: "#555555",
  },
  // Sections
  section: {
    marginTop: 15,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#000000",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  // Items
  item: {
    marginBottom: 12,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  itemTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#000000",
  },
  itemSubtitle: {
    fontSize: 10,
    color: "#555555",
    marginBottom: 2,
  },
  date: {
    fontSize: 9,
    color: "#777777",
  },
  location: {
    fontSize: 9,
    color: "#777777",
    fontStyle: "italic",
  },
  description: {
    fontSize: 9,
    lineHeight: 1.4,
    color: "#333333",
    marginTop: 4,
  },
  // Skills
  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 5,
  },
  skillItem: {
    fontSize: 9,
    color: "#333333",
    paddingRight: 10,
  },
  skillDot: {
    fontSize: 9,
    color: "#555555",
    marginRight: 4,
  },
  // Two column layout for some sections
  twoColumn: {
    flexDirection: "row",
    gap: 20,
  },
  leftColumn: {
    width: "45%",
  },
  rightColumn: {
    width: "55%",
  },
  // Lists
  bulletPoint: {
    flexDirection: "row",
    marginBottom: 4,
  },
  bulletSymbol: {
    width: 10,
    fontSize: 9,
    color: "#555555",
  },
  bulletText: {
    flex: 1,
    fontSize: 9,
    lineHeight: 1.4,
    color: "#333333",
  },
  // Certifications & Awards
  certItem: {
    marginBottom: 8,
  },
  certName: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#000000",
  },
  certDetails: {
    fontSize: 8,
    color: "#777777",
    marginTop: 2,
  },
  // Horizontal rule
  hr: {
    borderBottom: "1px solid #eeeeee",
    marginVertical: 8,
  },
});

interface ATSTemplateProps {
  data: Format3Data;
}

export const ATSTemplate: React.FC<ATSTemplateProps> = ({ data }) => {
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

  // Helper to format date
  const formatDate = (date: string | null) => {
    if (!date) return "Present";
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
      return `${monthNames[parseInt(month) - 1]} ${year}`;
    }
    return year;
  };

  // Parse description (could be string or array)
  const renderDescription = (description: string | string[]) => {
    if (Array.isArray(description)) {
      return description.map((bullet, idx) => (
        <View key={idx} style={styles.bulletPoint}>
          <Text style={styles.bulletSymbol}>•</Text>
          <Text style={styles.bulletText}>{bullet}</Text>
        </View>
      ));
    }
    return <Text style={styles.description}>{description}</Text>;
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.name}>
            {profile.first_name} {profile.last_name}
          </Text>
          <Text style={styles.title}>{profile.professional_title}</Text>
          <View style={styles.contactRow}>
            {profile.email && (
              <Text style={styles.contactText}>{profile.email}</Text>
            )}
            {profile.phone && (
              <Text style={styles.contactText}>{profile.phone}</Text>
            )}
            {profile.location && (
              <Text style={styles.contactText}>{profile.location}</Text>
            )}
            {profile.links?.map((link, idx) => (
              <Text key={idx} style={styles.contactText}>
                {link.value}
              </Text>
            ))}
          </View>
        </View>

        {/* SUMMARY / PROFILE */}
        {profile.summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Summary</Text>
            <Text style={styles.description}>{profile.summary}</Text>
          </View>
        )}

        {/* WORK EXPERIENCE */}
        {experience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Work Experience</Text>
            {experience.map((exp, idx) => (
              <View key={idx} style={styles.item}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>{exp.position}</Text>
                  <Text style={styles.date}>
                    {formatDate(exp.start_date)} - {formatDate(exp.end_date)}
                  </Text>
                </View>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemSubtitle}>{exp.company}</Text>
                  {exp.location && (
                    <Text style={styles.location}>{exp.location}</Text>
                  )}
                </View>
                {renderDescription(exp.description)}
              </View>
            ))}
          </View>
        )}

        {/* EDUCATION */}
        {education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {education.map((edu, idx) => (
              <View key={idx} style={styles.item}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>{edu.degree}</Text>
                  <Text style={styles.date}>
                    {formatDate(edu.start_date)} - {formatDate(edu.end_date)}
                  </Text>
                </View>
                <Text style={styles.itemSubtitle}>{edu.institution}</Text>
                {edu.location && (
                  <Text style={styles.location}>{edu.location}</Text>
                )}
                {edu.score && (
                  <Text style={styles.description}>GPA/Score: {edu.score}</Text>
                )}
                {renderDescription(edu.description)}
              </View>
            ))}
          </View>
        )}

        {/* PROJECTS */}
        {projects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Projects</Text>
            {projects.map((project, idx) => (
              <View key={idx} style={styles.item}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>{project.title}</Text>
                  <Text style={styles.date}>
                    {formatDate(project.start_date)} -{" "}
                    {formatDate(project.end_date)}
                  </Text>
                </View>
                {project.subtitle && (
                  <Text style={styles.itemSubtitle}>{project.subtitle}</Text>
                )}
                {renderDescription(project.description)}
                {project.link && (
                  <Text style={styles.certDetails}>Link: {project.link}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* SKILLS */}
        {skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            <View style={styles.skillsContainer}>
              {skills.map((skill, idx) => (
                <View key={idx} style={{ flexDirection: "row" }}>
                  <Text style={styles.skillDot}>•</Text>
                  <Text style={styles.skillItem}>
                    {skill.name}
                    {skill.level ? ` (${skill.level})` : ""}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* CERTIFICATIONS */}
        {certificates.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Certifications</Text>
            {certificates.map((cert, idx) => (
              <View key={idx} style={styles.certItem}>
                <Text style={styles.certName}>{cert.name}</Text>
                <Text style={styles.certDetails}>
                  {cert.issuer}
                  {cert.issue_date &&
                    ` • Issued: ${formatDate(cert.issue_date)}`}
                  {cert.expiry_date &&
                    ` • Expires: ${formatDate(cert.expiry_date)}`}
                </Text>
                {cert.description && (
                  <Text style={styles.description}>{cert.description}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* LANGUAGES */}
        {languages.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Languages</Text>
            <View style={styles.skillsContainer}>
              {languages.map((lang, idx) => (
                <View key={idx} style={{ flexDirection: "row" }}>
                  <Text style={styles.skillDot}>•</Text>
                  <Text style={styles.skillItem}>
                    {lang.name} {lang.level ? `(${lang.level})` : ""}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* AWARDS */}
        {awards.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Awards & Recognition</Text>
            {awards.map((award, idx) => (
              <View key={idx} style={styles.item}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>{award.title}</Text>
                  {award.date && (
                    <Text style={styles.date}>{formatDate(award.date)}</Text>
                  )}
                </View>
                <Text style={styles.itemSubtitle}>{award.awarder}</Text>
                {award.description && (
                  <Text style={styles.description}>{award.description}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* PUBLICATIONS */}
        {publications.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Publications</Text>
            {publications.map((pub, idx) => (
              <View key={idx} style={styles.item}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>{pub.title}</Text>
                  {pub.date && (
                    <Text style={styles.date}>{formatDate(pub.date)}</Text>
                  )}
                </View>
                <Text style={styles.itemSubtitle}>{pub.publisher}</Text>
                {pub.description && (
                  <Text style={styles.description}>{pub.description}</Text>
                )}
                {pub.link && (
                  <Text style={styles.certDetails}>Link: {pub.link}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* REFERENCES */}
        {references.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>References</Text>
            <View style={styles.twoColumn}>
              <View style={styles.leftColumn}>
                {references
                  .filter((_, i) => i % 2 === 0)
                  .map((ref, idx) => (
                    <View key={idx} style={styles.item}>
                      <Text style={styles.itemTitle}>{ref.name}</Text>
                      <Text style={styles.itemSubtitle}>{ref.position}</Text>
                      <Text style={styles.itemSubtitle}>
                        {ref.organization}
                      </Text>
                      <Text style={styles.contactText}>{ref.email}</Text>
                      <Text style={styles.contactText}>{ref.phone}</Text>
                    </View>
                  ))}
              </View>
              <View style={styles.rightColumn}>
                {references
                  .filter((_, i) => i % 2 === 1)
                  .map((ref, idx) => (
                    <View key={idx} style={styles.item}>
                      <Text style={styles.itemTitle}>{ref.name}</Text>
                      <Text style={styles.itemSubtitle}>{ref.position}</Text>
                      <Text style={styles.itemSubtitle}>
                        {ref.organization}
                      </Text>
                      <Text style={styles.contactText}>{ref.email}</Text>
                      <Text style={styles.contactText}>{ref.phone}</Text>
                    </View>
                  ))}
              </View>
            </View>
          </View>
        )}
      </Page>
    </Document>
  );
};
