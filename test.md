Edit only the landing page features section component. Do not touch any other files.
Conventions: styled-components, import * as S, $-prefixed transient props, theme tokens (add any missing tokens to the theme), @mui/icons-material only.

DATA
Drive the section from a config array of 3 card objects in features.config.ts:
{ id, icon, tag, title, description, bullets: [{ bold, rest }], widget, cta: { label, href, variant: 'link' | 'button' }, featured?: boolean, badge?: string }
Use the content below as written. All numbers and claims are placeholders I will replace.

SECTION
- Background: theme bg with a faint 32px grid pattern (1px lines at ~4% opacity via repeating-linear-gradient) and a soft lavender/pink radial glow behind the left card (very low opacity, large blur)
- Grid: 3 equal columns, 40px gap, max-width 1680px centered; align-items: stretch so all cards are equal height
- Under 1024px: 1 column, featured card first

CARD (base)
- White surface, 1px border (very light lavender-gray), radius 28px, padding 44px, very soft large shadow (0 20px 60px rgba(79,70,229,.06))
- Flex column; footer pushed to bottom with margin-top: auto
- Top row: icon tile left, tag pill right (space-between)
    - Icon tile: 76px square, radius 18px, primarySoft background, primary icon at 36px
    - Tag pill: 15px text, muted text color, light gray pill background, padding 6px 14px, fully rounded
- Title: 32px, weight 700, letter-spacing -0.02em, text color, margin-top 40px
- Description: 19px, line-height 1.65, muted text, margin-top 16px
- Bullets: margin-top 32px, 16px gap; each bullet is its own row: light gray-lavender background, 1px subtle border, radius 12px, padding 14px 18px, success-green Check icon (20px) then text at 17px; the `bold` part is weight 700, `rest` is regular
- Widget area: margin-top 32px (see per-card widgets)
- Footer: 1px divider, 32px space above and below, then CTA

FEATURED CARD (middle)
- 2px solid primary border, slightly stronger primary-tinted shadow
- Badge: absolutely positioned, centered horizontally, overlapping the top border (translateY(-50%)); gradient from primary to violet (#4F46E5 → #7C3AED), white text, 15px, weight 700, uppercase, letter-spacing 0.04em, radius 999px, padding 8px 24px, max 2 lines
- Icon tile: solid primary background, white icon, primary-tinted shadow
- Tag pill: primarySoft background, primary text, 1px primary-tinted border
- CTA: full-width primary button, height 60px, radius 12px, 19px weight 600 white text with ArrowForward icon

CARD CONTENT
1. Learn — icon ArticleOutlined, tag "For Learners", title "Learn at your pace"
   description: "Structured modules, bite-sized lessons, and interactive sandboxes you can pick up anytime, on any device."
   bullets: [1,400+ | interactive on-demand courses], [Offline sync & multi-speed playback], [Personalized curriculum & goal reminders]
   widget: progress card — white bg, 1px primary-tinted border, radius 14px, padding 20px; row with "Next: Advanced UX Architecture" (weight 600) left and "78%" (primary, weight 600) right; below it an 8px rounded progress bar, light track, primary fill at 78%
   cta: link "Browse courses catalog" + ArrowForward, primary color, 20px weight 600
2. Teach (featured) — icon CastForEducation, tag "Monetize", badge "Most popular for creators", title "Teach what you know"
   description: "Create curriculum, host live cohort workshops, and scale your brand with automated payments and student analytics."
   bullets: [94% Revenue Share | with zero hidden fees], [Drag-and-drop syllabus & assignment studio], [Live Q&A sessions & community discord sync]
   widget: stat card — very light green-tinted background, 1px light green border, radius 14px, padding 20px; left: label "Avg. top mentor payout" (14px, uppercase, muted, letter-spacing 0.04em) above "$8,450" (24px weight 700) + "/ month" (16px muted); right: pill "+18.4% YoY" with light green background and dark green text, weight 600
   cta: button "Become an Instructor"
3. Certificates — icon MilitaryTechOutlined, tag "Accredited", title "Earn certificates"
   description: "Finish a course or track, get a globally verifiable credential, and showcase tangible skills to hiring managers."
   bullets: [1-Click LinkedIn | & resume credential export], [Accredited partner universities & tech giants], [Cryptographically verifiable QR validation IDs]
   widget: credential row — white bg, 1px border, radius 14px, padding 18px; left a 56px primary square (radius 12px) with white VerifiedUserOutlined icon; right "Verified Professional Certificate" (weight 700) above "ID: EDU-2026-98124 • Issued" (14px muted)
   cta: link "Explore credential directory" + ArrowForward

FONT
Load Plus Jakarta Sans (Google Fonts, weights 400/500/600/700) with a system fallback, and apply it to this section.

VERIFY
Typecheck and lint clean. Equal card heights with aligned footers at 1440px. Stacks correctly at 390px with the badge fully visible. Stop when done and list files changed.