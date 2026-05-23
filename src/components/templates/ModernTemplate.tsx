import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
  Link,
} from "@react-pdf/renderer";
import type { Format3Data } from "#/types/resume/resumeTypes";

type Props = {
  data: Format3Data;
};

const styles = StyleSheet.create({
  page: {
    paddingTop: 30,
    paddingBottom: 28,
    paddingHorizontal: 32,
    backgroundColor: "#FFFFFF",
    color: "#111827",
    fontSize: 10.5,
    fontFamily: "Helvetica",
    lineHeight: 1.45,
  },

  header: {
    marginBottom: 18,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: "#0F172A",
  },

  name: {
    fontSize: 24,
    fontWeight: 700,
    color: "#0F172A",
    letterSpacing: 0.3,
    marginBottom: 6,
  },

  headline: {
    fontSize: 11.5,
    color: "#334155",
    marginBottom: 8,
  },

  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  contactItem: {
    fontSize: 9.5,
    color: "#475569",
  },

  contactLink: {
    fontSize: 9.5,
    color: "#0F766E",
    textDecoration: "none",
  },

  summaryBox: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 6,
    padding: 10,
    marginBottom: 14,
  },

  summaryText: {
    fontSize: 10.2,
    color: "#334155",
    lineHeight: 1.55,
  },

  section: {
    marginBottom: 14,
  },

  sectionTitle: {
    fontSize: 11,
    fontWeight: 700,
    color: "#0F172A",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#CBD5E1",
  },

  item: {
    marginBottom: 10,
  },

  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 2,
    gap: 12,
  },

  itemTitleWrap: {
    flexGrow: 1,
    flexShrink: 1,
    paddingRight: 8,
  },

  itemTitle: {
    fontSize: 10.8,
    fontWeight: 700,
    color: "#0F172A",
  },

  itemSubtitle: {
    fontSize: 9.8,
    color: "#475569",
    marginTop: 1,
  },

  itemMeta: {
    minWidth: 120,
    textAlign: "right",
    fontSize: 9.2,
    color: "#64748B",
  },

  paragraph: {
    fontSize: 9.8,
    color: "#334155",
    lineHeight: 1.5,
    marginTop: 4,
  },

  bulletList: {
    marginTop: 4,
    paddingLeft: 10,
  },

  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 3,
    paddingRight: 6,
  },

  bulletDot: {
    width: 8,
    fontSize: 10,
    color: "#0F766E",
  },

  bulletText: {
    flex: 1,
    fontSize: 9.6,
    color: "#334155",
    lineHeight: 1.45,
  },

  skillsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },

  skillPill: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 999,
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },

  skillText: {
    fontSize: 9.2,
    color: "#1E3A8A",
  },

  twoColRow: {
    flexDirection: "row",
    gap: 14,
  },

  col: {
    flex: 1,
  },

  projectTech: {
    marginTop: 4,
    fontSize: 9.2,
    color: "#475569",
  },

  dividerSpace: {
    height: 2,
  },

  footer: {
    position: "absolute",
    bottom: 12,
    left: 32,
    right: 32,
    textAlign: "center",
    fontSize: 8.5,
    color: "#94A3B8",
  },
});

function safeText(value: unknown) {
  if (value === null || value === undefined) return "";
  return String(value).trim();
}

function joinParts(parts: Array<string | undefined | null>, separator = " • ") {
  return parts.map(safeText).filter(Boolean).join(separator);
}

function asArray<T>(value: T[] | undefined | null): T[] {
  return Array.isArray(value) ? value : [];
}

function splitBullets(value: unknown): string[] {
  const text = safeText(value);
  if (!text) return [];
  return text
    .split(/\n|•|-/g)
    .map((item) => item.trim())
    .filter(Boolean);
}

function pickFirst(...values: unknown[]) {
  for (const value of values) {
    const normalized = safeText(value);
    if (normalized) return normalized;
  }
  return "";
}

function renderBulletList(items: string[]) {
  if (!items.length) return null;

  return (
    <View style={styles.bulletList}>
      {items.map((item, index) => (
        <View key={index} style={styles.bulletRow}>
          <Text style={styles.bulletDot}>•</Text>
          <Text style={styles.bulletText}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

function Header({ data }: Props) {
  const personal = (data as any)?.personalInfo ?? (data as any)?.personal ?? {};
  const fullName = pickFirst(
    personal.fullName,
    joinParts([personal.firstName, personal.lastName], " "),
    (data as any)?.name,
  );
  const role = pickFirst(
    personal.title,
    personal.headline,
    personal.role,
    (data as any)?.jobTitle,
  );

  const email = pickFirst(personal.email, (data as any)?.email);
  const phone = pickFirst(
    personal.phone,
    personal.mobile,
    (data as any)?.phone,
  );
  const location = joinParts(
    [personal.city, personal.state, personal.country].filter(Boolean),
    ", ",
  );
  const website = pickFirst(
    personal.website,
    personal.portfolio,
    (data as any)?.website,
  );
  const linkedin = pickFirst(personal.linkedin, personal.linkedIn);
  const github = pickFirst(personal.github);

  return (
    <View style={styles.header}>
      <Text style={styles.name}>{fullName || "Your Name"}</Text>

      {!!role && <Text style={styles.headline}>{role}</Text>}

      <View style={styles.contactRow}>
        {!!email && <Text style={styles.contactItem}>{email}</Text>}
        {!!phone && <Text style={styles.contactItem}>{phone}</Text>}
        {!!location && <Text style={styles.contactItem}>{location}</Text>}
        {!!website && (
          <Link src={website} style={styles.contactLink}>
            {website}
          </Link>
        )}
        {!!linkedin && (
          <Link src={linkedin} style={styles.contactLink}>
            LinkedIn
          </Link>
        )}
        {!!github && (
          <Link src={github} style={styles.contactLink}>
            GitHub
          </Link>
        )}
      </View>
    </View>
  );
}

function SummarySection({ data }: Props) {
  const summary = pickFirst(
    (data as any)?.summary,
    (data as any)?.professionalSummary,
    (data as any)?.profileSummary,
    (data as any)?.about,
  );

  if (!summary) return null;

  return (
    <View style={styles.summaryBox}>
      <Text style={styles.summaryText}>{summary}</Text>
    </View>
  );
}

function ExperienceSection({ data }: Props) {
  const items = asArray(
    (data as any)?.experience ?? (data as any)?.workExperience,
  );

  if (!items.length) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Experience</Text>

      {items.map((item: any, index) => {
        const title = pickFirst(
          item.jobTitle,
          item.title,
          item.position,
          item.role,
        );
        const company = pickFirst(
          item.company,
          item.organization,
          item.employer,
        );
        const location = pickFirst(
          item.location,
          joinParts([item.city, item.state], ", "),
        );
        const start = pickFirst(item.startDate, item.from, item.start);
        const end = pickFirst(
          item.endDate,
          item.to,
          item.end,
          item.current ? "Present" : "",
        );
        const meta = joinParts([location, joinParts([start, end], " - ")]);

        const description = pickFirst(item.description, item.summary);
        const bullets = [
          ...asArray(item.highlights).map((x) => safeText(x)),
          ...asArray(item.responsibilities).map((x) => safeText(x)),
          ...splitBullets(item.achievements),
        ].filter(Boolean);

        return (
          <View key={index} style={styles.item} wrap={false}>
            <View style={styles.itemHeader}>
              <View style={styles.itemTitleWrap}>
                <Text style={styles.itemTitle}>
                  {title || "Role"}
                  {!!company ? `, ${company}` : ""}
                </Text>
                {!!company && !title && (
                  <Text style={styles.itemSubtitle}>{company}</Text>
                )}
                {!!title && !!company && (
                  <Text style={styles.itemSubtitle}>{company}</Text>
                )}
              </View>

              {!!meta && <Text style={styles.itemMeta}>{meta}</Text>}
            </View>

            {!!description && (
              <Text style={styles.paragraph}>{description}</Text>
            )}
            {renderBulletList(bullets)}
          </View>
        );
      })}
    </View>
  );
}

function ProjectsSection({ data }: Props) {
  const items = asArray((data as any)?.projects);

  if (!items.length) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Projects</Text>

      {items.map((item: any, index) => {
        const name = pickFirst(item.name, item.title, item.projectName);
        const link = pickFirst(item.link, item.url, item.github, item.liveUrl);
        const tech = asArray(item.technologies ?? item.techStack ?? item.skills)
          .map((x) => safeText(x))
          .filter(Boolean)
          .join(", ");

        const description = pickFirst(item.description, item.summary);
        const bullets = [
          ...asArray(item.highlights).map((x) => safeText(x)),
          ...splitBullets(item.features),
        ].filter(Boolean);

        return (
          <View key={index} style={styles.item} wrap={false}>
            <View style={styles.itemHeader}>
              <View style={styles.itemTitleWrap}>
                <Text style={styles.itemTitle}>{name || "Project"}</Text>
                {!!link && (
                  <Link src={link} style={styles.contactLink}>
                    {link}
                  </Link>
                )}
              </View>
            </View>

            {!!description && (
              <Text style={styles.paragraph}>{description}</Text>
            )}
            {!!tech && <Text style={styles.projectTech}>Tech: {tech}</Text>}
            {renderBulletList(bullets)}
          </View>
        );
      })}
    </View>
  );
}

function EducationSection({ data }: Props) {
  const items = asArray((data as any)?.education);

  if (!items.length) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Education</Text>

      {items.map((item: any, index) => {
        const degree = pickFirst(item.degree, item.course, item.qualification);
        const institution = pickFirst(
          item.institution,
          item.school,
          item.college,
          item.university,
        );
        const field = pickFirst(
          item.fieldOfStudy,
          item.field,
          item.specialization,
        );
        const start = pickFirst(item.startDate, item.from, item.startYear);
        const end = pickFirst(item.endDate, item.to, item.endYear);
        const grade = pickFirst(item.grade, item.cgpa, item.score);

        return (
          <View key={index} style={styles.item} wrap={false}>
            <View style={styles.itemHeader}>
              <View style={styles.itemTitleWrap}>
                <Text style={styles.itemTitle}>
                  {degree || "Degree"}
                  {!!field ? ` in ${field}` : ""}
                </Text>
                {!!institution && (
                  <Text style={styles.itemSubtitle}>{institution}</Text>
                )}
              </View>

              <Text style={styles.itemMeta}>
                {joinParts(
                  [
                    joinParts([start, end], " - "),
                    grade ? `Grade: ${grade}` : "",
                  ],
                  "\n",
                )}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

function SkillsSection({ data }: Props) {
  const source =
    (data as any)?.skills ??
    (data as any)?.technicalSkills ??
    (data as any)?.keySkills ??
    [];

  const skills = Array.isArray(source)
    ? source
        .flatMap((item: any) => {
          if (typeof item === "string") return [item];
          if (Array.isArray(item?.items)) return item.items;
          if (Array.isArray(item?.skills)) return item.skills;
          if (item?.name) return [item.name];
          return [];
        })
        .map((x) => safeText(x))
        .filter(Boolean)
    : splitBullets(source);

  if (!skills.length) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Skills</Text>

      <View style={styles.skillsWrap}>
        {skills.map((skill, index) => (
          <View key={`${skill}-${index}`} style={styles.skillPill}>
            <Text style={styles.skillText}>{skill}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function CertificationsSection({ data }: Props) {
  const items = asArray(
    (data as any)?.certifications ?? (data as any)?.licenses,
  );

  if (!items.length) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Certifications</Text>

      {items.map((item: any, index) => {
        const name = pickFirst(item.name, item.title, item.certification);
        const issuer = pickFirst(
          item.issuer,
          item.organization,
          item.authority,
        );
        const date = pickFirst(item.date, item.issueDate, item.year);
        const credential = pickFirst(item.credentialId, item.id);

        return (
          <View key={index} style={styles.item} wrap={false}>
            <View style={styles.itemHeader}>
              <View style={styles.itemTitleWrap}>
                <Text style={styles.itemTitle}>{name}</Text>
                {!!issuer && <Text style={styles.itemSubtitle}>{issuer}</Text>}
              </View>

              {!!date && <Text style={styles.itemMeta}>{date}</Text>}
            </View>

            {!!credential && (
              <Text style={styles.paragraph}>Credential ID: {credential}</Text>
            )}
          </View>
        );
      })}
    </View>
  );
}

function AwardsSection({ data }: Props) {
  const items = asArray((data as any)?.awards ?? (data as any)?.achievements);

  if (!items.length) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Achievements</Text>

      {items.map((item: any, index) => {
        if (typeof item === "string") {
          return (
            <View key={index} style={styles.item}>
              {renderBulletList([item])}
            </View>
          );
        }

        const title = pickFirst(item.title, item.name, item.award);
        const issuer = pickFirst(item.issuer, item.organization);
        const date = pickFirst(item.date, item.year);
        const description = pickFirst(item.description, item.summary);

        return (
          <View key={index} style={styles.item} wrap={false}>
            <View style={styles.itemHeader}>
              <View style={styles.itemTitleWrap}>
                <Text style={styles.itemTitle}>{title}</Text>
                {!!issuer && <Text style={styles.itemSubtitle}>{issuer}</Text>}
              </View>

              {!!date && <Text style={styles.itemMeta}>{date}</Text>}
            </View>

            {!!description && (
              <Text style={styles.paragraph}>{description}</Text>
            )}
          </View>
        );
      })}
    </View>
  );
}

export function ModernTemplate({ data }: Props) {
  return (
    <Document
      title={pickFirst(
        (data as any)?.personalInfo?.fullName,
        (data as any)?.name,
        "Resume",
      )}
      author={pickFirst(
        (data as any)?.personalInfo?.fullName,
        (data as any)?.name,
      )}
      subject="Resume"
    >
      <Page size="A4" style={styles.page}>
        <Header data={data} />
        <SummarySection data={data} />
        <ExperienceSection data={data} />
        <ProjectsSection data={data} />
        <View style={styles.twoColRow}>
          <View style={styles.col}>
            <EducationSection data={data} />
          </View>
          <View style={styles.col}>
            <SkillsSection data={data} />
            <CertificationsSection data={data} />
            <AwardsSection data={data} />
          </View>
        </View>

        <Text
          style={styles.footer}
          render={({ pageNumber, totalPages }) =>
            `${pageNumber} / ${totalPages}`
          }
          fixed
        />
      </Page>
    </Document>
  );
}
