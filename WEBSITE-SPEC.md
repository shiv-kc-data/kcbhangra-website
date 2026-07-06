# KC Bhangra Website — Project Spec

Load this file at session start before touching any code.
After feedback session, add new rules to relevant section.

---

## What This Project Is

Full website redesign for **Kansas City Bhangra**, folk Bhangra dance academy in Lenexa, Kansas.
Goals: enroll new students, attract non-Punjabi adults/families, establish credibility in Kansas City.

**Live files:** All HTML files in this folder. No build system. No framework. Static HTML + CSS + GSAP.

---

## Brand Identity

### Logo
- Icon: Punjabi folk instruments (harmonium, tumbi, dhol, sarangi, chimta) bursting from amber dhol-cup
- Wordmark: "KANSAS CITY BHANGRA" in wide-spaced clean caps
- File (dark bg, white outline): `assets/images/logo-transparent.png` — use on dark sections
- File (color, transparent): `assets/images/logo-color-transparent.png` — use on merch/light
- Both PNGs are RGBA (true transparent background) — no background rectangle will show

### Colors (exact hex values — do not drift)
```
--black:      #0f0e0c   (hero/dark section backgrounds)
--black-warm: #1a1816   (secondary dark backgrounds)
--amber:      #f5a623   (primary accent, CTAs, logo cup)
--amber-dim:  rgba(245,166,35,0.10)  (subtle amber fills)
--cream:      #faf6f0   (light section backgrounds)
--white:      #ffffff   (text on dark)
--muted:      rgba(250,246,240,0.45) (secondary text on dark)
--border:     rgba(250,246,240,0.10) (borders on dark sections)
--border-light: rgba(15,14,12,0.12) (borders on light sections)
```
Maximum 6 hex values. No purple. No gradients. No color drift.

### Typography
- **Display:** `Syne` weight 800 — all major headlines
- **Body:** `Plus Jakarta Sans` weight 300/400/500/600
- **NEVER use:** Inter, Roboto, Arial, Playfair Display, system fonts as primary
- Google Fonts import: `Syne:wght@400;600;700;800` + `Plus Jakarta Sans:ital,wght@0,300;0,400;0,500;0,600;1,400`

### Design References
- **Energy/feel:** VCASS (vcass.vic.edu.au) — dark backgrounds, bold performance photography, arts-academy authority
- **Structure/clarity:** Ampersand Business Continuity — clean hierarchy, easy to navigate

---

## Content Rules — Copy

### Absolute bans (zero exceptions)
- **No em dashes** (`—` or `&mdash;`) — ever, anywhere, including titles and meta tags. Use period, comma, or colon instead.
- No "vibrant", "rich tapestry", "delve", "navigate", "leverage", "empower", "journey", "seamlessly", "elevate", "transformative", "innovative", "cutting-edge", "game-changing", "scalable", "ecosystem", "foster"
- No emojis anywhere on site — not in section headers, cards, or copy
- No green checkmark emoji lists
- No numbered sections (01 / 02 / 03) unless content is genuine sequence
- No bullet points for "Not Bollywood" or positioning sections — use prose
- No formulaic hooks (statement + 3 bullets + engagement question)
- No "Shiv" anywhere on site — use "our coaches" or "our head coach" instead
- No "open to all ages" — minimum age is 5. Say "Ages 5 and up" or "ages 5 to their 60s"
- Never say "No Punjabi" — reads as exclusionary. Say "No language barrier" instead.

### Copy tone
- Short sentences. Remove adjectives. Dry, specific.
- Wrong: "An amazing high-energy experience for the whole family"
- Right: "High-energy. One hour. Real folk tradition."

---

## Design Anti-Patterns (Never Do These)

- Purple gradients on white
- Double-column hero layout (headline left, image right)
- Italic serif headline with colored pull-out words
- Big decorative eyebrow line above headline
- Stock photos that don't match copy
- Basic scroll-reveal as only animation (use GSAP with intent)
- Nav logo + wordmark stacked in two lines (too tall, looks cluttered)
- Logo in nav with visible background rectangle (always use transparent PNG)
- Hero eyebrow text directly below nav logo (visual collision in same corner)
- Watermark logo too prominent (fights headline — remove or keep opacity < 0.06)

---

## Design Patterns (Always Do These)

- Custom amber cursor dot with lagging ring (desktop only, hidden on touch/mobile)
- Announcement bar pinned above nav for session enrollment urgency
- Venue credibility marquee (auto-scrolling, pauses on hover)
- GSAP entrance animation on hero headlines (lines slide up from clip)
- GSAP scroll-triggered reveals on all major sections (`.js-reveal`)
- Nav transparent over dark hero, turns solid `--black` on scroll
- Section tags: small amber line + uppercase label before every major section
- Buttons: 2px border-radius, uppercase, letter-spacing 0.1em

---

## Founder / Brand Story

**Name usage rule:** "Shiv" allowed in coaches/about section only — e.g. "our head coach Shiv". Not in hero copy, stats, positioning sections, or CTAs. Default to "our coaches" everywhere else.

- Founded ~2019 in Kansas City by head coach trained from age 5 in Jalandhar, Punjab
- Trained through school and college in Punjab under traditional gurus
- Moved to Kansas City, saw need for authentic folk Bhangra in community
- Started with 5 students, grew to 250+ unique students taught
- Age range: 4.5 years to 60s
- Differentiator: real traditional folk foundations (scaffolding approach) applicable to any Punjabi music

---

## Classes

### Structure
- 2 sessions per year: Fall + Spring
- Location: Lenexa, Kansas (Sundays in the afternoon)
- Time: varies by session — confirmed before session starts (do not hardcode a time)
- Each session: 8 classes + 1 free intro class
- Duration per class: 1 hour
- Classes run back-to-back on Sunday afternoons

### Four tiers (in order)
1. **Beginners** — Ages 5+, first-time students, zero experience needed
2. **Intermediate** — Ages 5+, students who know fundamentals, building toward advanced
3. **Advanced** — Ages 5+, mastery-level, performance-ready material
4. **Adults** — Ages 18+, all levels, open to anyone, high-energy

### Pricing
- $200 per student per session
- Family/sibling discount: families of 3 or more — contact us (do not publish a number, do not offer for 2)
- First class: always free, no commitment, no card required
- No auto-renewals. One payment per session per student.

### Current sessions
- Fall 2026 (active enrollment)
- Spring 2027 (waitlist)

---

## Additional Services

- **Wedding choreography:** 10+ wedding receptions completed. Inquiry form only, no pricing shown.
- **Private lessons:** 9-10 completed. Inquiry form only, no pricing shown.
- Both secondary services — mention in footer/services page, not featured on homepage.

---

## Past Performances / Venues

Displayed in homepage marquee and on performances.html:
- Kauffman Center for the Performing Arts
- KC Current
- University of Missouri, Kansas City
- Kansas State University

Logo/photo assets: placeholders for now. Real assets to be added.

---

## Enrollment Flow

1. Fill out interest form (name, email, phone, tier interest, session, referral source)
2. We confirm free class details
3. Show up Sunday in Lenexa, KS

### Form fields (classes.html)
- First name, last name
- Email address
- Phone number
- Who's enrolling (tier dropdown)
- Preferred session (Fall 2026 / Spring 2027 / Free trial only)
- How did you hear about us (referral source)
- Under-5 toggle: if checked, shows child birthdate field for Mailchimp age-based drip email

### Contact options (always show all three — not everyone has WhatsApp)
- WhatsApp: `https://wa.me/1XXXXXXXXXX` (replace with real number)
- Instagram DM: `https://instagram.com/kcbhangra`
- Facebook Message: `https://m.me/kcbhangra`

### Forms backend
- Use Formspree: `action="https://formspree.io/f/REPLACE_WITH_YOUR_ID"`
- Age-based drip: Mailchimp free tier. Custom field `child_birthdate`. Automation fires when child turns 5.

---

## Workshops

### Two distinct offerings on workshops.html

**Section A: Hire us for your organization (B2B)**
- Format: 90-minute workshop
- Part 1: What is folk Bhangra? (education)
- Part 2: Learn 2-3 song choreographies together
- Audiences: universities, corporate, community orgs, schools, festivals
- Inquiry form: org name, contact, date, group size, event type

**Section B: Community workshop scheduling poll**
- Tool: Rallly.co (free group scheduling poll)
- Shiv creates poll, pastes embed into page
- When no active poll: show "Follow @kcbhangra for announcements"
- Managed manually by Shiv session-by-session

---

## Merch (Phase 2)

- Products: T-shirts, hoodies, stickers
- Existing assets: `assets/images/logo-transparent.png` (t-shirt), `assets/images/logo-color-transparent.png` (sticker)
- Order flow: DM on Instagram or WhatsApp to order (no payment processing yet)

---

## Social / Contact

- Instagram: `https://instagram.com/kcbhangra`
- Facebook: `https://facebook.com/kcbhangra`
- WhatsApp: `https://wa.me/1XXXXXXXXXX` (replace with real number before launch)
- Domain to buy: `kcbhangra.com`

---

## Page Structure

| File | Status | Purpose |
|------|--------|---------|
| `index.html` | Built | Home: hero, venue marquee, stats, folk tradition, "what sets us apart", classes preview, testimonials, coaches, merch teaser, footer |
| `classes.html` | Built | Classes: free trial funnel, 4 tiers, session info, pricing table, testimonials, enrollment form + 3 contact options, FAQ |
| `about.html` | Not built | Coaches story, folk tradition deep-dive, gallery |
| `workshops.html` | Not built | B2B hire-us + community scheduling poll |
| `performances.html` | Not built | Venue portfolio, embedded YouTube videos |
| `services.html` | Not built | Wedding choreography, private lessons |
| `merch.html` | Not built | T-shirts, stickers, order via DM |
| `contact.html` | Not built | Form + all 3 contact options |

---

## Technical Stack

- HTML5, CSS custom properties, vanilla JS
- GSAP 3.12.2 + ScrollTrigger (via CDN)
- No Tailwind, no frameworks, no build step
- Fonts via Google Fonts CDN
- Forms via Formspree (free tier)
- Hosting target: Hostinger Premium (~$43/yr)
- Domain: kcbhangra.com (not yet purchased)

---

## Assets Checklist

| Asset | Status |
|-------|--------|
| Logo transparent PNG (dark/white) | `assets/images/logo-transparent.png` |
| Logo transparent PNG (color) | `assets/images/logo-color-transparent.png` |
| Logo JPEG (dark bg) | `assets/images/logo-dark.jpg` |
| Logo JPEG (color bg) | `assets/images/logo-color.jpg` |
| Coach photo | MISSING — add as `assets/images/coach.jpg` |
| Hero performance video/photo | MISSING — add to `assets/images/` |
| Venue logos (Kauffman, KC Current, UMKC, KSU) | MISSING — add to `assets/images/venues/` |
| Performance photos | MISSING — add to `assets/images/performances/` |
| YouTube video links | MISSING — to be provided by Shiv (4 slots on performances.html) |
| Rallly poll URL | MISSING — create at rallly.co, send URL, embed in workshops.html community tab |
| Google Form URL (reviews) | MISSING — create at forms.google.com, replace placeholder in index.html + about.html |
| Real testimonial quotes | MISSING — to be provided by Shiv |
| WhatsApp number | MISSING — replace `1XXXXXXXXXX` in all files |
| Formspree form ID | MISSING — replace `REPLACE_WITH_YOUR_ID` in classes.html |

---

## Feedback Log

*Add every correction here so future sessions don't repeat mistakes.*

| Date | What was wrong | What was fixed |
|------|---------------|----------------|
| 2026-07-05 | Nav overcrowded: logo icon + two-line wordmark + hero eyebrow colliding in top-left corner | Simplified nav to logo icon + single-line "KC Bhangra" text; removed hero eyebrow entirely |
| 2026-07-05 | Logo JPEGs had colored backgrounds, looked like black rectangles in nav | Switched to RGBA transparent PNGs (`logo-transparent.png`) |
| 2026-07-05 | Hero watermark (logo at low opacity) was distracting, amber cup too visible | Removed watermark entirely from hero |
| 2026-07-05 | "Open to all ages" — incorrect, minimum age is 5 | Changed to "Ages 5 and up" |
| 2026-07-05 | Name "Shiv" used throughout copy | Replaced all instances with "our coaches" / "our head coach" |
| 2026-07-05 | Em dashes (`—`) used in copy and titles | Zero tolerance rule added; replaced with periods and colons throughout |
| 2026-07-05 | Sessions labeled Fall 2025 / Spring 2026 | Corrected to Fall 2026 / Spring 2027 |
| 2026-07-05 | UMKC Chakra used as venue name | Corrected to "University of Missouri, Kansas City" |
| 2026-07-05 | WhatsApp-only contact excluded people without WhatsApp | Added Instagram DM + Facebook Message alongside WhatsApp everywhere |
| 2026-07-05 | Wedding choreography not visible on home page; 7 weddings stat not weighted enough | Added dedicated wedding choreo row on home page: giant "7" stat + description + dual CTA |
| 2026-07-05 | Logo icon in nav removed by preference | Nav wordmark is now text-only: "Kansas City Bhangra" in Syne 800, no image |

---

## Skills to Load Before Building UI

Per `CLAUDE.md` rules — load before writing any HTML or CSS:
1. `frontend-design` skill (Anthropic official)
2. UI/UX Pro Max skill (community — install via NPM if not present)
3. GSAP skill (for animations)