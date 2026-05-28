import React from "react";
import type { ResumeData } from "#/types/resume/resume.types";
import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

interface TwoColumnTemplateProps {
  data: ResumeData;
}

Font.register({
  family: "Roboto",
  fonts: [
    { src: "/fonts/Roboto/Roboto-Regular.ttf", fontWeight: 400 },
    {
      src: "/fonts/Roboto/Roboto-Italic.ttf",
      fontWeight: 400,
      fontStyle: "italic",
    },

    { src: "/fonts/Roboto/Roboto-Medium.ttf", fontWeight: 500 },
    {
      src: "/fonts/Roboto/Roboto-MediumItalic.ttf",
      fontWeight: 500,
      fontStyle: "italic",
    },

    { src: "/fonts/Roboto/Roboto-SemiBold.ttf", fontWeight: 600 },
    {
      src: "/fonts/Roboto/Roboto-SemiBoldItalic.ttf",
      fontWeight: 600,
      fontStyle: "italic",
    },

    { src: "/fonts/Roboto/Roboto-Bold.ttf", fontWeight: 700 },
    {
      src: "/fonts/Roboto/Roboto-BoldItalic.ttf",
      fontWeight: 700,
      fontStyle: "italic",
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    padding: 32,
    backgroundColor: "#ffffff",
    fontFamily: "Roboto",
    fontSize: 10,
    color: "#111111",
  },
  layout: {
    flexDirection: "row",
    gap: 20,
  },
  sidebar: {
    width: "30%",
    paddingRight: 14,
    borderRight: "1px solid #E5E7EB",
  },
  main: {
    width: "70%",
    paddingLeft: 6,
  },
  header: {
    marginBottom: 16,
  },
  name: {
    fontSize: 22,
    fontWeight: 700,
    color: "#111827",
    marginBottom: 4,
  },
  title: {
    fontSize: 11,
    fontWeight: 500,
    color: "#374151",
    marginBottom: 8,
  },
  contactText: {
    fontSize: 9,
    color: "#4B5563",
    marginBottom: 4,
  },
  section: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: 1,
    color: "#111827",
    marginBottom: 8,
  },
  item: {
    marginBottom: 10,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
    marginBottom: 2,
  },
  itemTitle: {
    fontSize: 10,
    fontWeight: 700,
    color: "#111111",
  },
  itemSubtitle: {
    fontSize: 9,
    color: "#4B5563",
    marginBottom: 2,
  },
  date: {
    fontSize: 8,
    color: "#6B7280",
  },
  description: {
    fontSize: 9,
    lineHeight: 1.45,
    color: "#374151",
    marginTop: 3,
  },
  bulletRow: {
    flexDirection: "row",
    marginBottom: 3,
  },
  bullet: {
    width: 10,
    fontSize: 9,
    color: "#4B5563",
  },
  bulletText: {
    flex: 1,
    fontSize: 9,
    lineHeight: 1.45,
    color: "#374151",
  },
  tagList: {
    marginTop: 4,
  },
  tagItem: {
    fontSize: 9,
    color: "#374151",
    marginBottom: 4,
  },
  divider: {
    borderBottom: "1px solid #F0F0F0",
    marginTop: 6,
  },
});

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

const renderDescription = (
  description: string | string[] | null | undefined,
) => {
  if (!description) return null;

  if (Array.isArray(description)) {
    return description.map((bullet, idx) => (
      <View key={idx} style={styles.bulletRow}>
        <Text style={styles.bullet}>•</Text>
        <Text style={styles.bulletText}>{bullet}</Text>
      </View>
    ));
  }

  return <Text style={styles.description}>{description}</Text>;
};

const TwoColumnTemplate: React.FC<TwoColumnTemplateProps> = ({ data }) => {
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

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.name}>
            {profile.first_name} {profile.last_name}
          </Text>
          {profile.professional_title && (
            <Text style={styles.title}>{profile.professional_title}</Text>
          )}

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
              {link.url}
            </Text>
          ))}
        </View>

        <View style={styles.layout}>
          <View style={styles.sidebar}>
            {skills.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Skills</Text>
                <View style={styles.tagList}>
                  {skills.map((skill, idx) => (
                    <Text key={idx} style={styles.tagItem}>
                      • {skill.name}
                      {skill.level ? ` (${skill.level})` : ""}
                    </Text>
                  ))}
                </View>
              </View>
            )}

            {languages.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Languages</Text>
                <View style={styles.tagList}>
                  {languages.map((lang, idx) => (
                    <Text key={idx} style={styles.tagItem}>
                      • {lang.name}
                      {lang.level ? ` (${lang.level})` : ""}
                    </Text>
                  ))}
                </View>
              </View>
            )}

            {certificates.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Certifications</Text>
                {certificates.map((cert, idx) => (
                  <View key={idx} style={styles.item}>
                    <Text style={styles.itemTitle}>{cert.name}</Text>
                    <Text style={styles.itemSubtitle}>{cert.issuer}</Text>
                    {(cert.issue_date || cert.expiry_date) && (
                      <Text style={styles.date}>
                        {cert.issue_date
                          ? `Issued: ${formatDate(cert.issue_date)}`
                          : ""}
                        {cert.issue_date && cert.expiry_date ? " • " : ""}
                        {cert.expiry_date
                          ? `Expires: ${formatDate(cert.expiry_date)}`
                          : ""}
                      </Text>
                    )}
                  </View>
                ))}
              </View>
            )}
          </View>

          <View style={styles.main}>
            {profile.summary && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Professional Summary</Text>
                <Text style={styles.description}>{profile.summary}</Text>
              </View>
            )}

            {experience.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Work Experience</Text>
                {experience.map((exp, idx) => (
                  <View key={idx} style={styles.item}>
                    <View style={styles.itemHeader}>
                      <Text style={styles.itemTitle}>{exp.position}</Text>
                      <Text style={styles.date}>
                        {formatDate(exp.start_date)} -{" "}
                        {formatDate(exp.end_date)}
                      </Text>
                    </View>
                    <Text style={styles.itemSubtitle}>
                      {exp.company}
                      {exp.location ? ` • ${exp.location}` : ""}
                    </Text>
                    {renderDescription(exp.description)}
                  </View>
                ))}
              </View>
            )}

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
                      <Text style={styles.itemSubtitle}>
                        {project.subtitle}
                      </Text>
                    )}
                    {renderDescription(project.description)}
                    {project.link && (
                      <Text style={styles.description}>{project.link}</Text>
                    )}
                  </View>
                ))}
              </View>
            )}

            {education.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Education</Text>
                {education.map((edu, idx) => (
                  <View key={idx} style={styles.item}>
                    <View style={styles.itemHeader}>
                      <Text style={styles.itemTitle}>{edu.degree}</Text>
                      <Text style={styles.date}>
                        {formatDate(edu.start_date)} -{" "}
                        {formatDate(edu.end_date)}
                      </Text>
                    </View>
                    <Text style={styles.itemSubtitle}>
                      {edu.institution}
                      {edu.location ? ` • ${edu.location}` : ""}
                    </Text>
                    {edu.score && (
                      <Text style={styles.description}>Score: {edu.score}</Text>
                    )}
                    {renderDescription(edu.description)}
                  </View>
                ))}
              </View>
            )}

            {awards.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Awards</Text>
                {awards.map((award, idx) => (
                  <View key={idx} style={styles.item}>
                    <View style={styles.itemHeader}>
                      <Text style={styles.itemTitle}>{award.title}</Text>
                      {award.date && (
                        <Text style={styles.date}>
                          {formatDate(award.date)}
                        </Text>
                      )}
                    </View>
                    <Text style={styles.itemSubtitle}>{award.awarder}</Text>
                    {award.description && (
                      <Text style={styles.description}>
                        {award.description}
                      </Text>
                    )}
                  </View>
                ))}
              </View>
            )}

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
                  </View>
                ))}
              </View>
            )}

            {references.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>References</Text>
                {references.map((ref, idx) => (
                  <View key={idx} style={styles.item}>
                    <Text style={styles.itemTitle}>{ref.name}</Text>
                    <Text style={styles.itemSubtitle}>
                      {ref.position} • {ref.organization}
                    </Text>
                    {ref.email && (
                      <Text style={styles.contactText}>{ref.email}</Text>
                    )}
                    {ref.phone && (
                      <Text style={styles.contactText}>{ref.phone}</Text>
                    )}
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default TwoColumnTemplate;
