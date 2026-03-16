import re

file_path = "/home/kaiumallimon/Desktop/miller-and-co/components/custom/services/ServicesPageClient.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    text = f.read()

# Remove employer recruitment service block
employer_recruitment_pattern = r'\s*\{\s*label:\s*"Employer Recruitment Services",\s*sub:\s*"For Subclass 186 & 482",\s*detail:\s*"End-to-end recruitment support for employers: sourcing overseas talent, assessing occupational eligibility, and preparing sponsorship and nomination documentation.",\s*\},'
text = re.sub(employer_recruitment_pattern, '', text, flags=re.DOTALL)

# Remove creative mortgage solutions category block
# It ends with    ],
#  },
# ];  (which closes SERVICE_CATEGORIES array)
# Since it's the last element, we can replace from { \s* id: "creative-mortgage-solutions" to the end of the array.
mortgage_pattern = r'\s*\{\s*id:\s*"creative-mortgage-solutions".*?\](?:,\s*)?\s*\}'
# Actually lets just find it and string replace
start_idx = text.find('id: "creative-mortgage-solutions"')
if start_idx != -1:
    obj_start = text.rfind('{', 0, start_idx)
    # find the matching closing brace } for this object
    brace_count = 0
    obj_end = -1
    for i in range(obj_start, len(text)):
        if text[i] == '{':
            brace_count += 1
        elif text[i] == '}':
            brace_count -= 1
            if brace_count == 0:
                obj_end = i
                break
    if obj_end != -1:
        # Also remove any trailing comma and spaces up to the array end `];`
        # let's just slice it out
        text = text[:obj_start] + text[obj_end+1:]
        # Now clean up trailing comma before array close
        text = re.sub(r',\s*\];', '\n];', text)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(text)
