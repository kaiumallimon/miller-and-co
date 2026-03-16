import re

file_path = "/home/kaiumallimon/Desktop/miller-and-co/components/custom/other-services/OtherServicesPageClient.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    text = f.read()

new_steps = """const PROCESS_STEPS = [
  {
    step: "01",
    icon: FileText,
    title: "Initial Enquiry",
    description:
      "We begin with a complimentary review of your enquiry — assessing your exact needs, whether for employer recruitment or mortgage guidance.",
  },
  {
    step: "02",
    icon: Scale,
    title: "Strategy Session",
    description:
      "We hold a structured consultation to outline targeted strategies, set clear timelines, and establish tailored pathways for your success.",
  },
  {
    step: "03",
    icon: Shield,
    title: "Action & Preparation",
    description:
      "Our team manages sourcing, documentation, and coordination with trusted partners to ensure complete readiness and compliance.",
  },
  {
    step: "04",
    icon: CheckCircle,
    title: "Execution & Support",
    description:
      "We execute the strategy from end-to-end and provide continuous support until your overarching goals are achieved.",
  },
];"""

text = re.sub(r'const PROCESS_STEPS = \[.*?\];', new_steps, text, flags=re.DOTALL)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(text)
