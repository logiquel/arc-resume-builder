import {
  Document,
  Link,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import type { Format3Data } from "#/types/resume/resumeTypes";

type Props = {
  data: Format3Data;
};

const styles = StyleSheet.create({
  page: {
    paddingTop: 34,
    paddingBottom: 42,
    paddingHorizontal: 38,
    backgroundColor: "#FFFFFF",
    color: "#1F2937",
    fontSize: 10.2,
    fontFamily: "Times-Roman",
    lineHeight: 1.5,
  },

  header: {
    alignItems: "center",
    marginBottom: 16,
  },

  name: {
    fontSize: 22,
    fontFamily: "Times-Bold",
    color: "#111827",
    letterSpacing: 0.2,
    marginBottom: 4,
    textAlign: "center",
  },

  role: {
    fontSize: 11.2,
    color: "#4B5563",
    marginBottom: 8,
    textAlign: "center",
  },

  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 6,
  },

  contactText: {
    fontSize: 9.4,
    color: "#4B5563",
  },

  contactLink: {
    fontSize: 9.4,
    color: "#374151",
    textDecoration: "none",
  },

  divider: {
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#9CA3AF",
  },

  section: {
    marginBottom: 14,
  },

  sectionTitle: {
    fontSize: 11,
    fontFamily: "Times-Bold",
    color: "#111827",
    marginBottom: 7,
    textTransform: "uppercase",
    letterSpacing: 0.9,
  },

  sectionRule: {
    borderBottomWidth: 1,
    borderBottomColor: "#D1D5DB",
    marginBottom: 8,
  },

  summary: {
    fontSize: 10,
    color: "#374151",
    textAlign: "justify",
    lineHeight: 1.55,
  },

  item: {
    marginBottom: 10,
  },

  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 10,
  },

  itemMain: {
    flexGrow: 1,
    flexShrink: 1,
    paddingRight: 8,
  },

  itemTitle: {
    fontSize: 10.7,
    fontFamily: "Times-Bold",
    color: "#111827",
  },

  itemSubTitle: {
    fontSize: 9.8,
    color: "#4B5563",
    marginTop: 1,
    fontStyle: "italic",
  },

  itemMeta: {
    minWidth: 120,
    textAlign: "right",
    fontSize: 9.1,
    color: "#6B7280",
  },

  paragraph: {
    marginTop: 4,
    fontSize: 9.7,
    color: "#374151",
    lineHeight: 1.5,
    textAlign: "justify",
  },

  list: {
    marginTop: 5,
  },

  listItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 3,
  },

  listBullet: {
    width: 10,
    fontSize: 10,
    color: "#111827",
  },

  listText: {
    flex: 1,
    fontSize: 9.6,
    color: "#374151",
    lineHeight: 1.45,
  },

  skillsLine: {
    fontSize: 9.7,
    color: "#374151",
    lineHeight: 1.5,
  },

  labelText: {
    fontFamily: "Times-Bold",
    color: "#111827",
  },

  twoColumn: {
    flexDirection: "row",
    gap: 18,
  },

  leftCol: {
    flex: 1.2,
  },

  rightCol: {
    flex: 0.8,
  },

  footer: {
    position: "absolute",
    bottom: 16,
    left: 38,
    right: 38,
    textAlign: "center",
    fontSize: 8.5,
    color: "#9CA3AF",
  },
});

function safeText(value: unknown) {
  if (value === null || value === undefined) return "";
  return String(value).trim();
}

function asArray<T>(value: T[] | undefined | null): T[] {
  return Array.isArray(value) ? value : [];
}

function joinParts(parts: Array<string | undefined | null>, separator = " • ") {
  return parts.map(safeText).filter(Boolean).join(separator);
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

function BulletList({ items }: { items: string[] }) {
  if (!items.length) return null;

  return (
    <View style={styles.list}>
      {items.map((item, index) => (
        <View key={index} style={styles.listItem}>
          <Text style={styles.listBullet}>•</Text>
          <Text style={styles.listText}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionRule} />
      {children}
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
  const website = pickFirst(personal.website, personal.portfolio);
  const linkedin = pickFirst(personal.linkedin, personal.linkedIn);
  const github = pickFirst(personal.github);

  return (
    <View style={styles.header}>
      <Text style={styles.name}>{fullName || "Your Name"}</Text>
      {!!role && <Text style={styles.role}>{role}</Text>}

      <View style={styles.contactRow}>
        {!!email && <Text style={styles.contactText}>{email}</Text>}
        {!!phone && <Text style={styles.contactText}>{phone}</Text>}
        {!!location && <Text style={styles.contactText}>{location}</Text>}
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

      <View style={styles.divider} />
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
    <Section title="Professional Summary">
      <Text style={styles.summary}>{summary}</Text>
    </Section>
  );
}

function ExperienceSection({ data }: Props) {
  const items = asArray(
    (data as any)?.experience ?? (data as any)?.workExperience,
  );

  if (!items.length) return null;

  return (
    <Section title="Professional Experience">
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
        const meta = joinParts(
          [location, joinParts([start, end], " - ")],
          " | ",
        );

        const description = pickFirst(item.description, item.summary);
        const bullets = [
          ...asArray(item.highlights).map((x) => safeText(x)),
          ...asArray(item.responsibilities).map((x) => safeText(x)),
          ...splitBullets(item.achievements),
        ].filter(Boolean);

        return (
          <View key={index} style={styles.item} wrap={false}>
            <View style={styles.itemHeader}>
              <View style={styles.itemMain}>
                <Text style={styles.itemTitle}>
                  {title || "Role"}
                  {!!company ? `, ${company}` : ""}
                </Text>
                {!!company && !!title && (
                  <Text style={styles.itemSubTitle}>{company}</Text>
                )}
              </View>

              {!!meta && <Text style={styles.itemMeta}>{meta}</Text>}
            </View>

            {!!description && (
              <Text style={styles.paragraph}>{description}</Text>
            )}
            <BulletList items={bullets} />
          </View>
        );
      })}
    </Section>
  );
}

function ProjectsSection({ data }: Props) {
  const items = asArray((data as any)?.projects);

  if (!items.length) return null;

  return (
    <Section title="Projects">
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
              <View style={styles.itemMain}>
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
            {!!tech && (
              <Text style={styles.paragraph}>
                <Text style={styles.labelText}>Technologies:</Text> {tech}
              </Text>
            )}
            <BulletList items={bullets} />
          </View>
        );
      })}
    </Section>
  );
}

function EducationSection({ data }: Props) {
  const items = asArray((data as any)?.education);

  if (!items.length) return null;

  return (
    <Section title="Education">
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
              <View style={styles.itemMain}>
                <Text style={styles.itemTitle}>
                  {degree || "Degree"}
                  {!!field ? ` in ${field}` : ""}
                </Text>
                {!!institution && (
                  <Text style={styles.itemSubTitle}>{institution}</Text>
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
    </Section>
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
    <Section title="Core Skills">
      <Text style={styles.skillsLine}>{skills.join(" • ")}</Text>
    </Section>
  );
}

function CertificationsSection({ data }: Props) {
  const items = asArray(
    (data as any)?.certifications ?? (data as any)?.licenses,
  );

  if (!items.length) return null;

  return (
    <Section title="Certifications">
      {items.map((item: any, index) => {
        const name = pickFirst(item.name, item.title, item.certification);
        const issuer = pickFirst(
          item.issuer,
          item.organization,
          item.authority,
        );
        const date = pickFirst(item.date, item.issueDate, item.year);

        return (
          <View key={index} style={styles.item} wrap={false}>
            <View style={styles.itemHeader}>
              <View style={styles.itemMain}>
                <Text style={styles.itemTitle}>{name}</Text>
                {!!issuer && <Text style={styles.itemSubTitle}>{issuer}</Text>}
              </View>

              {!!date && <Text style={styles.itemMeta}>{date}</Text>}
            </View>
          </View>
        );
      })}
    </Section>
  );
}

function AwardsSection({ data }: Props) {
  const items = asArray((data as any)?.awards ?? (data as any)?.achievements);

  if (!items.length) return null;

  return (
    <Section title="Achievements">
      {items.map((item: any, index) => {
        if (typeof item === "string") {
          return <BulletList key={index} items={[item]} />;
        }

        const title = pickFirst(item.title, item.name, item.award);
        const issuer = pickFirst(item.issuer, item.organization);
        const date = pickFirst(item.date, item.year);
        const description = pickFirst(item.description, item.summary);

        return (
          <View key={index} style={styles.item} wrap={false}>
            <View style={styles.itemHeader}>
              <View style={styles.itemMain}>
                <Text style={styles.itemTitle}>{title}</Text>
                {!!issuer && <Text style={styles.itemSubTitle}>{issuer}</Text>}
              </View>

              {!!date && <Text style={styles.itemMeta}>{date}</Text>}
            </View>

            {!!description && (
              <Text style={styles.paragraph}>{description}</Text>
            )}
          </View>
        );
      })}
    </Section>
  );
}

export function ClassicTemplate({ data }: Props) {
  const fullName = pickFirst(
    (data as any)?.personalInfo?.fullName,
    (data as any)?.name,
    "Resume",
  );

  return (
    <Document title={fullName} author={fullName} subject="Resume">
      <Page size="A4" style={styles.page}>
        <Header data={data} />
        <SummarySection data={data} />
        <ExperienceSection data={data} />
        <ProjectsSection data={data} />

        <View style={styles.twoColumn}>
          <View style={styles.leftCol}>
            <EducationSection data={data} />
          </View>

          <View style={styles.rightCol}>
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
