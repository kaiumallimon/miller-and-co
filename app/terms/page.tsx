import CustomHeader from "@/components/custom/shared/header";
import { headlineFont, bodyFont } from "@/lib/typographies";
import { AnimateIn, StaggerContainer, StaggerItem } from "@/components/AnimateIn";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const sections = [
  {
    number: "01",
    title: "Engagement of Miller & Co",
    content: [
      {
        type: "p",
        text: "Miller & Co Lawyers & Migration Agent Pty Ltd (trading as Miller & Co Lawyers & Migration Agents) services does not guarantee any outcome in relation to any application you may lodge in the future.",
      },
      {
        type: "heading",
        text: "Online Services / Skype, Phone or Office Consultation",
      },
      {
        type: "p",
        text: "You will be deemed to have engaged our services upon payment of the service fee.",
      },
      {
        type: "heading",
        text: "Services",
      },
      {
        type: "p",
        text: "You will be deemed to have engaged the services of Miller & Co Lawyers & Migration Agent Pty Ltd upon payment of the Service fee. Once payment is received, a Registered Migration Lawyer will contact you to gather all information needed to prepare and submit your application to the Department of Immigration on your behalf. Miller & Co will agree to act on your behalf only if it forms the view that the application has a favourable chance of success, based on the initial assessment.",
      },
      {
        type: "heading",
        text: "General Information",
      },
      {
        type: "p",
        text: "Immigration legislation and policy is subject to frequent change — some of these are retrospective but most are not. All advice and work done by Miller & Co is based on the legal and policy requirements which are applicable and publicly available at the time you engage our services.",
      },
      {
        type: "p",
        text: "There are three scheduled times of the year during which the Department of Immigration legislation, policy and processing fees undergo significant amendment — 1 March, 1 July and 1 November. Miller & Co cannot be held responsible for any inaccuracy arising from changes to such legislation and policy which are not publicly available at the time the service is provided.",
      },
      {
        type: "note",
        text: "Although we will use our best endeavours to ensure the success of your application, we cannot guarantee that it will be approved.",
      },
    ],
  },
  {
    number: "02",
    title: "Electronic Communications",
    content: [
      {
        type: "p",
        text: "When clients visit Miller & Co Lawyers & Migration Agent Pty Ltd website or send e-mails to us, you consent to communicating with us electronically and agree that all such communications (including agreements, notices, disclosure, etc.) satisfy all legal requirements to be in writing.",
      },
      {
        type: "heading",
        text: "Additional Expenses",
      },
      {
        type: "p",
        text: "Please be aware, there are additional costs related to the application process, such as translation and certification of documents, medical examinations, police clearance, and English language tests (if required). These charges will vary according to the location they are completed and are to be paid directly to the body that provides the service.",
      },
      {
        type: "heading",
        text: "Disbursements",
      },
      {
        type: "p",
        text: "Miller & Co may incur additional out-of-pocket expenses on your behalf, including translation services, document certification, photocopying, telephone calls, courier, fax and postage costs. The cost of services provided by a third party will be charged to you at cost. Our photocopying charges are AU$1.00 per page and fax charges are AU$1.00 per page.",
      },
      {
        type: "heading",
        text: "Goods and Services Tax",
      },
      {
        type: "p",
        text: "All amounts paid by you within Australia are subject to a 10% Goods and Services Tax (GST). This amount is included in all fees displayed on the website or quoted by staff. Fees paid from outside of Australia do not attract GST. There is no GST applicable to the Department of Immigration lodgement fees.",
      },
    ],
  },
  {
    number: "03",
    title: "Responsibilities of the Client",
    content: [
      {
        type: "p",
        text: "On entering this agreement you agree to:",
      },
      {
        type: "list",
        items: [
          "Provide accurate, authentic and complete information to Miller & Co throughout the period of engagement.",
          "Inform Miller & Co if any of the information provided becomes inaccurate or incorrect.",
          "Pay the fees and disbursements set out in Part 2 above.",
        ],
      },
      {
        type: "p",
        text: "Failure to meet any of these terms may result in a weakened and ultimately unsuccessful application. Miller & Co will not be obliged to refund fees if this occurs.",
      },
      {
        type: "heading",
        text: "Information Provided by the Client",
      },
      {
        type: "p",
        text: "Miller & Co will use and rely on information provided by the client in the provision of the service without having independently verified its accuracy. Accordingly, the information provided must be correct. Any advice provided to you should not be used by a third party as each case is subject to different documentation and form completion requirements according to individual circumstances.",
      },
    ],
  },
  {
    number: "04",
    title: "Variation",
    content: [
      {
        type: "p",
        text: "This agreement may be varied in writing by mutual agreement. All work performed for you by Miller & Co and its employees and consultants will be in accordance with the terms set out in this agreement, or any subsequent variation signed by both parties.",
      },
    ],
  },
  {
    number: "05",
    title: "Code of Conduct",
    content: [
      {
        type: "p",
        text: "Under Australian law, any migration lawyer who provides advice within Australia must be registered with the Law Society NSW.",
      },
      {
        type: "p",
        text: "Miller & Co Lawyers & Migration Agent Pty Ltd will:",
      },
      {
        type: "list",
        items: [
          "Confirm your instructions.",
          "Act in accordance with your instructions.",
          "Keep you fully and regularly informed in writing of the progress of your application.",
          "Provide you with a copy of the Code, upon request.",
          "Within a reasonable amount of time after your application is determined, inform you in writing of the outcome.",
        ],
      },
    ],
  },
  {
    number: "06",
    title: "Notification Obligations",
    content: [
      {
        type: "p",
        text: "As your representative before the Department of Immigration, it is imperative that you consult your migration agent before communicating with the Department of Immigration or taking any action which may affect your visa status or application. The types of events which could affect the application include:",
      },
      {
        type: "list",
        items: [
          "Insolvency or bankruptcy.",
          "Change of address or other contact details.",
          "Changes in your marital status, health, citizenship, or employment status.",
          "The incurring of civil or criminal liability by you or any accompanying family member.",
        ],
      },
      {
        type: "p",
        text: "It is essential that Miller & Co be advised of any changes of address or contact details in a timely manner. Migration legislation deems a person to have received the Department of Immigration correspondence if it was sent to the last known address given to the Department of Immigration regardless of whether or not they have in fact received it.",
      },
    ],
  },
  {
    number: "07",
    title: "Period of Engagement",
    content: [
      {
        type: "p",
        text: "It is difficult to predict the time taken to complete the service. This will be dependent on the service purchased and the speed with which information is received from the client, as well as the time taken by the relevant third party body and/or the Department of Immigration to process the respective applications.",
      },
      {
        type: "p",
        text: "The period of engagement is considered to commence from the date that Miller & Co receives payment for the requested service. The engagement ceases upon completion of the service, or if the agreement is terminated earlier.",
      },
    ],
  },
  {
    number: "08",
    title: "Termination",
    content: [
      {
        type: "p",
        text: "You may terminate this agreement at any time by giving Miller & Co Lawyers & Migration Agent Pty Ltd written notice. If you terminate the agreement, the date of termination is the date upon which written notice is received.",
      },
      {
        type: "p",
        text: "Miller & Co may terminate this agreement by written notice at any time in reasonable circumstances, including but not limited to:",
      },
      {
        type: "list",
        items: [
          "Lack of response from you or other relevant parties.",
          "Non provision of requested documents in a timely manner.",
          "Providing (or suspicion of providing) fraudulent or bogus documents.",
          "If your migration agent has determined that you are ineligible for the service.",
          "For any other breach of the terms of this agreement.",
        ],
      },
      {
        type: "note",
        text: "If the agreement is terminated, Miller & Co shall be entitled to fees incurred up until and including the date that the agreement ceases: 50% of service fee upon completion of Stage 1, and 100% upon completion of Stage 2.",
      },
    ],
  },
  {
    number: "09",
    title: "Disputes or Complaints",
    content: [
      {
        type: "p",
        text: "A number of avenues are available if a dispute or complaint arises between you and Miller & Co in relation to the provision of services under this agreement. If you have any queries or concerns about our costs or provision of services, please discuss these with your migration agent as soon as they arise.",
      },
      {
        type: "p",
        text: "If you are not satisfied with any action taken by Miller & Co to resolve your query or remedy your concern, you are entitled to refer the matter to the Alternative Dispute Resolution Centre in NSW.",
      },
    ],
  },
  {
    number: "10",
    title: "Severance",
    content: [
      {
        type: "p",
        text: "In the event that any of the terms of this contract are, or become invalid, illegal, or unenforceable, the remaining terms shall endure unaffected.",
      },
    ],
  },
  {
    number: "11",
    title: "Governing Law",
    content: [
      {
        type: "p",
        text: "Validity, interpretation and performance of the contract shall be governed by the laws of NSW and the parties submit to the exclusive jurisdiction of the courts of NSW and courts competent to hear appeals therefrom.",
      },
    ],
  },
  {
    number: "12",
    title: "Document Retention",
    content: [
      {
        type: "p",
        text: "When we have completed the service, it is our practice to return all of your original documents. Any other documentation on your file — such as copies of your application, submissions and our correspondence — will be kept by us for at least two (2) years after work has been completed on your matter.",
      },
      {
        type: "p",
        text: "If you request that a copy of your documents be sent to you before the document retention deadline, Miller & Co will send these subject to your advance payment of fees to cover photocopying and postage costs.",
      },
      {
        type: "note",
        text: "Documents can be retained for up to five (5) more years after the document retention deadline, but a storage fee of at least $500 will be charged, payable in advance.",
      },
    ],
  },
  {
    number: "13",
    title: "Acceptance",
    content: [
      {
        type: "p",
        text: "As you (or the company) are the main applicant, you will be the primary applicant and any accompanying individuals will be secondary applicants. You are deemed to have agreed to the terms and conditions on behalf of any secondary applicants — whether they be adults 18 years of age or older or minors under the age of 18.",
      },
    ],
  },
];

type ContentBlock =
  | { type: "p"; text: string }
  | { type: "heading"; text: string }
  | { type: "note"; text: string }
  | { type: "list"; items: string[] };

function renderBlock(block: ContentBlock, i: number) {
  switch (block.type) {
    case "heading":
      return (
        <p
          key={i}
          className={`${bodyFont.className} text-[#1a1a1a] text-sm font-semibold mt-5 mb-1 tracking-wide`}
        >
          {block.text}
        </p>
      );
    case "note":
      return (
        <div
          key={i}
          className="mt-4 border-l-2 border-[#c8a96e] pl-4 py-1"
        >
          <p
            className={`${bodyFont.className} text-[#7a6035] text-base leading-relaxed italic`}
          >
            {block.text}
          </p>
        </div>
      );
    case "list":
      return (
        <ul key={i} className="mt-3 space-y-2">
          {block.items.map((item, j) => (
            <li key={j} className="flex items-start gap-3">
              <span className="mt-2 w-1 h-1 rounded-full bg-[#c8a96e] shrink-0" />
              <p
                className={`${bodyFont.className} text-[#4a4a4a] text-base leading-relaxed`}
              >
                {item}
              </p>
            </li>
          ))}
        </ul>
      );
    default:
      return (
        <p
          key={i}
          className={`${bodyFont.className} text-[#4a4a4a] text-base leading-relaxed mt-3`}
        >
          {block.text}
        </p>
      );
  }
}

export default function TermsPage() {
  return (
    <div className="bg-[#faf8f5] min-h-screen">
      <CustomHeader />

      {/* ── Hero Banner ─────────────────────────────────────────────────── */}
      <section className="relative w-full bg-[#1a1a1a] overflow-hidden pt-36 pb-20 lg:pt-44 lg:pb-28">
        {/* Radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,#c8a96e08_0%,transparent_65%)] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
          <StaggerContainer className="flex flex-col gap-5" stagger={0.12} delayChildren={0.1}>
            <StaggerItem>
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-[#c8a96e]" />
                <span
                  className={`${bodyFont.className} text-[#c8a96e] text-[10px] font-semibold tracking-[0.3em] uppercase`}
                >
                  Legal Documentation
                </span>
              </div>
            </StaggerItem>
            <StaggerItem>
              <h1
                className={`${headlineFont.className} text-white text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight max-w-2xl`}
              >
                Terms &{" "}
                <span className="italic text-[#c8a96e]">Conditions</span>
              </h1>
            </StaggerItem>
            <StaggerItem>
              <p
                className={`${bodyFont.className} text-white/40 text-base leading-relaxed max-w-xl mt-1`}
              >
                Please read these terms carefully before engaging our services.
                By proceeding, you agree to be bound by the conditions set out below.
              </p>
            </StaggerItem>
            <StaggerItem>
              <div className={`${bodyFont.className} flex items-center gap-2 text-white/25 text-xs`}>
                <Link href="/" className="hover:text-[#c8a96e] transition-colors duration-200">
                  Home
                </Link>
                <span>/</span>
                <span className="text-[#c8a96e]">Terms & Conditions</span>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* ── Intro / Definitions ─────────────────────────────────────────── */}
      <section className="w-full max-w-7xl mx-auto px-6 lg:px-10 py-16 lg:py-20">
        <AnimateIn direction="up" duration={0.65}>
          <div className="bg-white border border-[#e8e0d4] p-8 lg:p-12">
            <div className="flex items-center gap-3 mb-6">
              <span className="h-px w-8 bg-[#c8a96e]" />
              <span
                className={`${bodyFont.className} text-[#c8a96e] text-[10px] font-semibold tracking-[0.3em] uppercase`}
              >
                Preamble
              </span>
            </div>
            <p
              className={`${bodyFont.className} text-[#4a4a4a] text-base leading-relaxed mb-8`}
            >
              Miller &amp; Co Lawyers &amp; Migration Agent Pty Ltd (trading as Miller &amp; Co
              Lawyers &amp; Migration Agents) provides Australian Visa/Immigration services
              subject to the following terms and conditions.
            </p>

            <h3
              className={`${headlineFont.className} text-[#1a1a1a] text-2xl font-semibold mb-5`}
            >
              Definitions
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                {
                  term: '"We", "Our", "Us", "Miller & Co"',
                  def: 'Edward Miller, principal place of business at Level 26, 44 Market Street, Sydney 2000, including all directors, employees, agents and sub-contractors.',
                },
                {
                  term: '"Client", "You", "Your"',
                  def: 'The individual visiting visa-australia.legal or engaging our services, whether they have purchased a service or not.',
                },
                {
                  term: '"Service"',
                  def: 'One of the services provided by Miller & Co Lawyers & Migration Agent Pty Ltd.',
                },
                {
                  term: '"Application"',
                  def: 'The provision of advice, preparation and submission of any documents or statements in respect of any immigration benefit — including visas, EOIs, reviews, tribunal cases, sponsorship approvals and citizenship.',
                },
                {
                  term: '"Fees"',
                  def: 'Any sums due to us for services rendered plus any applicable taxation, government fee, levy or penalty, including GST.',
                },
                {
                  term: '"Working Day"',
                  def: 'A day on which banks are open for business in Sydney, Australia.',
                },
              ].map(({ term, def }, i) => (
                <div key={i} className="border border-[#e8e0d4] p-4">
                  <p
                    className={`${bodyFont.className} text-[#1a1a1a] text-xs font-semibold tracking-wide mb-1.5`}
                  >
                    {term}
                  </p>
                  <p
                    className={`${bodyFont.className} text-[#6a6a6a] text-xs leading-relaxed`}
                  >
                    {def}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </AnimateIn>
      </section>

      {/* ── Numbered Sections ───────────────────────────────────────────── */}
      <section className="w-full max-w-7xl mx-auto px-6 lg:px-10 pb-20 lg:pb-28">
        <div className="flex flex-col gap-4">
          {sections.map((section, idx) => (
            <AnimateIn key={idx} direction="up" delay={0.05} duration={0.6}>
              <div className="bg-white border border-[#e8e0d4] overflow-hidden">
                {/* Section header */}
                <div className="flex items-center gap-5 px-8 py-5 border-b border-[#e8e0d4] bg-[#faf8f5]">
                  <span
                    className={`${bodyFont.className} text-[#c8a96e] text-3xl font-semibold leading-none select-none`}
                  >
                    {section.number}
                  </span>
                  <div className="w-px h-6 bg-[#e8e0d4] shrink-0" />
                  <h2
                    className={`${headlineFont.className} text-[#1a1a1a] text-xl lg:text-2xl font-semibold`}
                  >
                    {section.title}
                  </h2>
                </div>
                {/* Section body */}
                <div className="px-8 py-6 lg:py-8">
                  {section.content.map((block, i) =>
                    renderBlock(block as ContentBlock, i)
                  )}
                </div>
              </div>
            </AnimateIn>
          ))}
        </div>
      </section>

      {/* ── CTA Strip ───────────────────────────────────────────────────── */}
      <section className="relative w-full bg-[#1a1a1a] px-6 lg:px-10 py-16">
        <AnimateIn direction="up" duration={0.65}>
          <div className="max-w-7xl px-6 lg:px-10 mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <p
                className={`${bodyFont.className} text-[#c8a96e] text-[10px] font-semibold tracking-[0.3em] uppercase mb-2`}
              >
                Have Questions?
              </p>
              <h3
                className={`${headlineFont.className} text-white text-2xl lg:text-3xl font-semibold`}
              >
                Speak with a{" "}
                <span className="italic text-[#c8a96e]">Migration Lawyer</span>
              </h3>
            </div>
            <Link
              href="/contact"
              className={`${bodyFont.className} inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase bg-[#c8a96e] text-[#1a1a1a] px-6 py-3.5 hover:bg-transparent hover:text-[#c8a96e] border border-[#c8a96e] transition-all duration-300 shrink-0`}
            >
              Contact Us
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </AnimateIn>
      </section>
    </div>
  );
}
