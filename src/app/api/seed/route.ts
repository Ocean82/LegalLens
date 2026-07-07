import { NextResponse } from "next/server";
import { db } from "@/db";
import { users, searches, legalResults, savedResults, researchNotes } from "@/db/schema";
import { hashPassword } from "@/lib/auth";
import { eq } from "drizzle-orm";

export async function POST() {
  try {
    // Check if demo user exists
    const existing = await db.select().from(users).where(eq(users.email, "demo@legallens.com")).limit(1);
    if (existing.length > 0) {
      return NextResponse.json({ message: "Already seeded" });
    }

    const passwordHash = await hashPassword("demo1234");
    const [demoUser] = await db.insert(users).values({
      email: "demo@legallens.com",
      passwordHash,
      name: "Alex Thompson",
    }).returning();

    // Create demo searches and results
    interface SeedResult {
      title: string;
      summary: string;
      sourceUrl: string;
      sourceName: string;
      court?: string;
      caseNumber?: string;
      dateFiled?: string;
    }
    interface SeedSearch {
      query: string;
      jurisdiction: "federal" | "california" | "texas" | "new_york";
      category: "constitutional" | "employment" | "real_estate" | "immigration";
      results: SeedResult[];
    }
    const searchData: SeedSearch[] = [
      {
        query: "First Amendment free speech cases",
        jurisdiction: "federal",
        category: "constitutional",
        results: [
          {
            title: "Brandenburg v. Ohio, 395 U.S. 444 (1969)",
            summary: "The Supreme Court held that the government cannot punish inflammatory speech unless it is directed to inciting and likely to incite imminent lawless action. The Court reversed the conviction of a Ku Klux Klan leader for speech that advocated illegal activity, establishing the imminent lawless action test.",
            sourceUrl: "https://scholar.google.com/scholar_case?case=15538842772335942956",
            sourceName: "Google Scholar",
            court: "Supreme Court of the United States",
            caseNumber: "395 U.S. 444",
            dateFiled: "June 9, 1969",
          },
          {
            title: "Tinker v. Des Moines Independent Community School District, 393 U.S. 503 (1969)",
            summary: "Students do not shed their constitutional rights at the schoolhouse gate. The Court ruled that wearing black armbands in protest of the Vietnam War was protected symbolic speech under the First Amendment.",
            sourceUrl: "https://scholar.google.com/scholar_case?case=14730025272867801248",
            sourceName: "Google Scholar",
            court: "Supreme Court of the United States",
            caseNumber: "393 U.S. 503",
            dateFiled: "February 24, 1969",
          },
          {
            title: "New York Times Co. v. Sullivan, 376 U.S. 254 (1964)",
            summary: "The Court held that the First Amendment requires a public official suing for defamation to prove actual malice — knowing falsehood or reckless disregard for truth. This landmark decision reshaped U.S. libel law.",
            sourceUrl: "https://www.courtlistener.com/opinion/106761/new-york-times-co-v-sullivan/",
            sourceName: "CourtListener",
            court: "Supreme Court of the United States",
            caseNumber: "376 U.S. 254",
            dateFiled: "March 9, 1964",
          },
        ],
      },
      {
        query: "California employment discrimination laws",
        jurisdiction: "california" as const,
        category: "employment" as const,
        results: [
          {
            title: "California Fair Employment and Housing Act (FEHA) — Gov. Code §12940",
            summary: "FEHA prohibits employment discrimination based on race, religion, color, national origin, ancestry, physical disability, mental disability, medical condition, genetic information, marital status, sex, gender identity, sexual orientation, age, and military/veteran status.",
            sourceUrl: "https://www.law.cornell.edu/wex/california_fair_employment_and_housing_act",
            sourceName: "Cornell Law Institute",
            court: "California Legislature",
            dateFiled: "1959 (amended 2023)",
          },
          {
            title: "Harris v. City of Santa Monica, 56 Cal. 4th 203 (2013)",
            summary: "The California Supreme Court held that in mixed-motive discrimination cases under FEHA, an employer can avoid paying damages by proving it would have made the same decision without the discriminatory motive, but the plaintiff can still obtain declaratory relief and attorney fees.",
            sourceUrl: "https://scholar.google.com/scholar_case?case=17649671578070696444",
            sourceName: "Google Scholar",
            court: "Supreme Court of California",
            caseNumber: "56 Cal. 4th 203",
            dateFiled: "February 4, 2013",
          },
          {
            title: "California WARN Act (Cal. Lab. Code §1400-1408)",
            summary: "Requires employers with 75+ employees to provide 60 days' notice before mass layoffs, plant closings, or major relocations. Covers establishments with 75 or more employees within the preceding 12 months.",
            sourceUrl: "https://law.justia.com/codes/california/labor-code/division-2/part-4/chapter-4/",
            sourceName: "Justia",
            court: "California Legislature",
          },
        ],
      },
      {
        query: "Texas property law adverse possession",
        jurisdiction: "texas" as const,
        category: "real_estate" as const,
        results: [
          {
            title: "Texas Adverse Possession Statutes — Tex. Civ. Prac. & Rem. Code §§16.021-16.030",
            summary: "Texas recognizes adverse possession with varying statute of limitations periods: 3 years (with registered deed), 5 years (with deed/taxes paid), 10 years (standard cultivation/use), and 25 years (permissive use). The possessor must demonstrate continuous, hostile, open, and notorious possession.",
            sourceUrl: "https://law.justia.com/codes/texas/civil-practice-and-remedies-code/title-2/chapter-16/",
            sourceName: "Justia",
            court: "Texas Legislature",
          },
          {
            title: "Rhodes v. Cahill, 802 S.W.2d 643 (Tex. 1990)",
            summary: "The Texas Supreme Court clarified the requirements for adverse possession, emphasizing that the claimant must prove actual and visible possession, hostile intent, open and notorious use, exclusive dominion, and continuous occupation for the statutory period.",
            sourceUrl: "https://scholar.google.com/scholar_case?case=1234567890",
            sourceName: "Google Scholar",
            court: "Supreme Court of Texas",
            caseNumber: "802 S.W.2d 643",
            dateFiled: "1990",
          },
        ],
      },
      {
        query: "Federal immigration visa processing times",
        jurisdiction: "federal" as const,
        category: "immigration" as const,
        results: [
          {
            title: "USCIS Processing Times — Immigration and Nationality Act",
            summary: "Current USCIS processing times vary by form type and service center. Form I-130 (Petition for Alien Relative) averages 12-24 months. Form I-485 (Adjustment of Status) averages 8-14 months. Premium processing available for certain employment-based petitions.",
            sourceUrl: "https://egov.uscis.gov/processing-times/",
            sourceName: "USCIS",
            court: "Department of Homeland Security",
          },
          {
            title: "Biden v. Texas, 597 U.S. 785 (2022)",
            summary: "The Supreme Court held that the federal government has discretion to terminate the Migrant Protection Protocols (MPP/'Remain in Mexico' policy) and that the Immigration and Nationality Act does not require detention or return to Mexico of all aliens lacking a legal basis to remain in the U.S.",
            sourceUrl: "https://www.courtlistener.com/opinion/4751496/biden-v-texas/",
            sourceName: "CourtListener",
            court: "Supreme Court of the United States",
            caseNumber: "597 U.S. 785",
            dateFiled: "June 30, 2022",
          },
        ],
      },
      {
        query: "New York landlord tenant rights eviction",
        jurisdiction: "new_york" as const,
        category: "real_estate" as const,
        results: [
          {
            title: "New York Housing Stability and Tenant Protection Act of 2019",
            summary: "Comprehensive tenant protection law that limits security deposits to one month's rent, regulates rent increases on rent-stabilized apartments, prohibits landlords from charging more than $20 for application fees, and strengthens eviction protections for tenants statewide.",
            sourceUrl: "https://law.justia.com/codes/new-york/real-property/",
            sourceName: "Justia",
            court: "New York State Legislature",
            dateFiled: "June 14, 2019",
          },
          {
            title: "NY Real Property Law §232-a — Monthly Tenancy Notice Requirements",
            summary: "Requires a landlord to give at least 30 days' notice to terminate a month-to-month tenancy outside New York City. In NYC, additional local laws provide further protections including right to cure and good cause eviction requirements.",
            sourceUrl: "https://www.law.cornell.edu/wex/new_york_landlord_tenant_law",
            sourceName: "Cornell Law Institute",
            court: "New York State Legislature",
          },
        ],
      },
    ];

    for (const s of searchData) {
      const [search] = await db.insert(searches).values({
        userId: demoUser.id,
        query: s.query,
        jurisdiction: s.jurisdiction,
        category: s.category,
        resultsCount: s.results.length,
      }).returning();

      for (let i = 0; i < s.results.length; i++) {
        const r = s.results[i];
        const [result] = await db.insert(legalResults).values({
          searchId: search.id,
          userId: demoUser.id,
          title: r.title,
          summary: r.summary,
          sourceUrl: r.sourceUrl,
          sourceName: r.sourceName,
          jurisdiction: s.jurisdiction,
          category: s.category,
          court: r.court || null,
          caseNumber: r.caseNumber || null,
          dateFiled: r.dateFiled || null,
        }).returning();

        // Save first result from each search
        if (i === 0) {
          await db.insert(savedResults).values({
            userId: demoUser.id,
            resultId: result.id,
            notes: `Important reference for ${s.query}`,
            folder: s.category === "constitutional" ? "Constitutional Cases" :
              s.category === "employment" ? "Employment Research" :
                s.category === "real_estate" ? "Property Law" :
                  s.category === "immigration" ? "Immigration" : "General",
          });
        }
      }
    }

    // Create demo research notes
    await db.insert(researchNotes).values([
      {
        userId: demoUser.id,
        title: "First Amendment Analysis Framework",
        content: "Key framework for analyzing First Amendment cases:\n\n1. Is the speech protected?\n  - Political speech receives highest protection\n  - Commercial speech receives intermediate protection\n  - Obscenity, true threats, and incitement are unprotected\n\n2. What level of scrutiny applies?\n  - Content-based restrictions: strict scrutiny\n  - Content-neutral restrictions: intermediate scrutiny\n  - Time/place/manner restrictions: must be narrowly tailored\n\n3. Does the government have a compelling interest?\n  - National security\n  - Public safety\n  - Prevention of imminent harm\n\nKey cases to reference:\n- Brandenburg v. Ohio (incitement test)\n- Tinker v. Des Moines (student speech)\n- NYT v. Sullivan (libel/public figures)\n- Citizens United v. FEC (corporate political speech)",
        jurisdiction: "federal",
        category: "constitutional",
        pinned: true,
      },
      {
        userId: demoUser.id,
        title: "California Employment Law Checklist",
        content: "Pre-litigation checklist for CA employment discrimination claims:\n\n□ Determine if FEHA or Title VII applies\n□ Identify protected class/category\n□ Document adverse employment action\n□ Establish timeline of events\n□ File DFEH complaint (mandatory pre-suit for FEHA)\n□ Obtain right-to-sue letter\n□ Check statute of limitations:\n  - FEHA: 3 years from discriminatory act + 1 year after right-to-sue\n  - Title VII: 300 days from discriminatory act\n□ Identify potential witnesses\n□ Gather relevant documents (emails, performance reviews, policies)\n□ Consider mixed-motive vs. single-motive theory\n□ Assess damages (back pay, front pay, emotional distress, punitive)",
        jurisdiction: "california",
        category: "employment",
        pinned: true,
      },
      {
        userId: demoUser.id,
        title: "Immigration Visa Categories Overview",
        content: "Family-Based Immigration:\n- IR1/IR2: Immediate relative (spouse, child under 21)\n- F1: Unmarried adult children of US citizens\n- F2A/F2B: Spouse/children/unmarried adult children of permanent residents\n- F3: Married adult children of US citizens\n- F4: Siblings of adult US citizens\n\nEmployment-Based Immigration:\n- EB-1: Priority workers (extraordinary ability, outstanding professors, multinational managers)\n- EB-2: Advanced degree professionals / exceptional ability\n- EB-3: Skilled workers, professionals, other workers\n- EB-4: Special immigrants\n- EB-5: Immigrant investors ($1.05M or $800K in TEA)\n\nNon-Immigrant Work Visas:\n- H-1B: Specialty occupation (cap 65,000 + 20,000 master's)\n- L-1: Intracompany transferee\n- O-1: Extraordinary ability\n- TN: USMCA professionals (Canada/Mexico)",
        jurisdiction: "federal",
        category: "immigration",
        pinned: false,
      },
      {
        userId: demoUser.id,
        title: "Tenant Rights Research - NY",
        content: "Key protections under NY Housing Stability Act:\n\n1. Security Deposit: Max 1 month rent\n2. Application Fee: Max $20\n3. Rent Stabilization: Stronger protections against deregulation\n4. Eviction: Good cause required in many jurisdictions\n5. Lease Renewal: 30/60/90 day notice based on tenancy length\n\nNYC-specific additional protections:\n- Right to counsel in eviction proceedings\n- Heat requirements (Oct 1 - May 31)\n- Rent increase limits on stabilized units\n- Succession rights for family members",
        jurisdiction: "new_york",
        category: "real_estate",
        pinned: false,
      },
    ]);

    return NextResponse.json({ message: "Seeded successfully", userId: demoUser.id });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json({ error: "Seed failed" }, { status: 500 });
  }
}
