import re

file_path = "/home/kaiumallimon/Desktop/miller-and-co/components/custom/other-services/OtherServicesPageClient.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    text = f.read()

# Replace export default function name
text = text.replace("export default function ServicesPageClient", "export default function OtherServicesPageClient")

# Redefine SERVICE_CATEGORIES completely
new_categories = """const SERVICE_CATEGORIES = [
  {
    id: "employer-recruitment",
    icon: Users,
    label: "Employer Recruitment Services",
    tagline: "For Subclass 186 & 482",
    description:
      "End-to-end recruitment support for employers: sourcing overseas talent, assessing occupational eligibility, and preparing sponsorship and nomination documentation. We connect Australian businesses with top global talent to address critical skills shortages quickly and compliantly.",
    services: [
      {
        label: "Talent Sourcing & Assessment",
        sub: "Global Recruitment",
        detail:
          "Targeted sourcing and pre-screening of overseas professionals against the relevant occupational requirements and skills assessing authority standards.",
      },
      {
        label: "Sponsorship & Nomination Preparation",
        sub: "End-to-End Support",
        detail:
          "Comprehensive preparation to help businesses meet sponsorship obligations, handle labour market testing, and submit robust nomination applications.",
      },
    ],
    highlights: [
      "Targeted global talent sourcing",
      "Occupational eligibility assessment",
      "Streamlined nomination processing",
      "End-to-end migration compliance",
    ],
  },
  {
    id: "creative-mortgage-solutions",
    icon: Home,
    label: "Creative Mortgage Solutions",
    tagline: "Securing your first home as a new permanent resident",
    description:
      "Once you obtain Australian permanent residence, the next important step for many new residents is securing their first home. We work with a trusted mortgage broker who specialises in helping new permanent residents navigate Australian lending requirements and structure their first property loan. Through strategic advice and access to multiple lenders, our broker assists clients in finding practical and competitive mortgage solutions tailored to their financial situation.",
    services: [
      {
        label: "First Home Buyer Guidance",
        sub: "For New Permanent Residents",
        detail:
          "Targeted assistance to understand your borrowing power, deposit requirements, and government grants available to new Australian permanent residents.",
      },
      {
        label: "Loan Structuring & Negotiation",
        sub: null,
        detail:
          "Access to strategic advice and multiple lenders through our trusted broker to find a competitive mortgage solution tailored to your financial scenario.",
      },
    ],
    highlights: [
      "Specialised broker introductions",
      "Tailored for new permanent residents",
      "Access to competitive lenders",
      "Strategic loan structuring advice",
    ],
  },
];"""

text = re.sub(r'const SERVICE_CATEGORIES = \[.*?\];', new_categories, text, flags=re.DOTALL)

# Update Hero Texts
text = text.replace('Our{" "}\n                <span className="italic text-[#c8a96e]">Services</span>', 'Other{" "}\n                <span className="italic text-[#c8a96e]">Services</span>')
text = text.replace('Comprehensive migration law services for individuals,\n                families, and businesses — from initial assessment to visa\n                grant and beyond.', 'Specialised support extending beyond traditional migration services. We assist with employer recruitment strategies, and connect new permanent residents with tailored mortgage solutions.')
text = text.replace('<span className="text-white">Services</span>', '<span className="text-white">Other Services</span>')


with open(file_path, "w", encoding="utf-8") as f:
    f.write(text)
