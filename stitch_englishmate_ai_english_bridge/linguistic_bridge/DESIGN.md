---
name: Linguistic Bridge
colors:
  surface: '#fcf8ff'
  surface-dim: '#dcd8e5'
  surface-bright: '#fcf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f2ff'
  surface-container: '#f0ecf9'
  surface-container-high: '#eae6f4'
  surface-container-highest: '#e4e1ee'
  on-surface: '#1b1b24'
  on-surface-variant: '#464555'
  inverse-surface: '#302f39'
  inverse-on-surface: '#f3effc'
  outline: '#777587'
  outline-variant: '#c7c4d8'
  surface-tint: '#4d44e3'
  primary: '#3525cd'
  on-primary: '#ffffff'
  primary-container: '#4f46e5'
  on-primary-container: '#dad7ff'
  inverse-primary: '#c3c0ff'
  secondary: '#006c49'
  on-secondary: '#ffffff'
  secondary-container: '#6cf8bb'
  on-secondary-container: '#00714d'
  tertiary: '#684000'
  on-tertiary: '#ffffff'
  tertiary-container: '#885500'
  on-tertiary-container: '#ffd4a4'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#0f0069'
  on-primary-fixed-variant: '#3323cc'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#fcf8ff'
  on-background: '#1b1b24'
  surface-variant: '#e4e1ee'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Be Vietnam Pro
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Be Vietnam Pro
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-caps:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1.0'
    letterSpacing: 0.05em
  tamil-subtext:
    fontFamily: Be Vietnam Pro
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.4'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 40px
  xl: 64px
  gutter: 16px
  margin-mobile: 20px
  max-width: 1200px
---

## Brand & Style

The design system is built to bridge the gap between Tamil-medium foundations and English-language proficiency through a lens of modern education and gamification. The brand personality is encouraging and student-centric, prioritizing accessibility for learners who may feel intimidated by traditional academic interfaces.

The design style merges **Modern Corporate** reliability with **Soft Minimalism**. It utilizes heavy whitespace to reduce cognitive load while employing "squishy" high-radius components and subtle gradients to provide a tactile, game-like feel. The visual language focuses on momentum, using progress indicators and XP trackers to reward micro-learning achievements. Every interface element is designed to feel welcoming and low-stakes, transforming a rigorous academic subject into an inviting daily habit.

## Colors

This design system uses a primary Indigo palette to establish trust and academic authority. The functional secondary colors are utilized for gamified feedback loops: **Success Green** for correct translations, **Warning Orange** for focus areas or streaks, and **Info Blue** for grammar tips and hints.

Backgrounds remain soft and neutral to ensure that bilingual text (Tamil and English) remains highly legible. Use pure white for card surfaces and `#F8FAFC` for the base canvas to create a subtle layered effect without high-contrast strain.

## Typography

The typography system relies on **Plus Jakarta Sans** for headlines to provide a soft, optimistic, and modern feel. For body content and bilingual instructions, **Be Vietnam Pro** is used due to its exceptional clarity and warm, approachable letterforms that pair well with Tamil script rendering.

Hierarchy is critical in this system: English phrases should typically use `body-lg` or `headline-md`, while the Tamil translations or instructions should follow immediately below in a slightly smaller, muted `tamil-subtext` style. This clear visual distinction helps students mentally separate the language they know from the one they are acquiring.

## Layout & Spacing

This design system employs a **fluid grid** model focused on mobile-first interaction, as many students access the platform via smartphones. On mobile, use a 4-column grid with 20px side margins; on desktop, transition to a 12-column grid with a maximum content width of 1200px.

Spacing is generous to maintain an "airy" and non-intimidating feel. Interactive elements like lesson cards and multiple-choice buttons should have significant vertical breathing room (`md` or 24px) to prevent accidental taps and to keep the focus on one learning objective at a time.

## Elevation & Depth

Visual hierarchy is established using **Tonal Layers** combined with **Ambient Shadows**. The design system avoids harsh black shadows, instead opting for soft, diffused shadows tinted with the primary color (e.g., `rgba(79, 70, 229, 0.08)`).

1.  **Level 0 (Base):** Neutral background (`#F8FAFC`).
2.  **Level 1 (Cards):** Pure white surface with a soft, 12px blur shadow.
3.  **Level 2 (Interaction):** Active elements or "hover" states use a slightly deeper shadow and a subtle inner-glow gradient to suggest pressability.

Progress rings and XP bars use an inner-shadow effect (inset) to create a "hollowed-out" track that feels tactile and physically present within the UI.

## Shapes

The shape language is defined by **Rounded** geometry. The base radius of 0.5rem (8px) is used for input fields and small buttons, while `rounded-xl` (1.5rem / 24px) is reserved for the primary lesson cards and container modules to reinforce the friendly, approachable brand character.

Buttons should use a semi-pill shape to look "bouncy" and interactive. Progress bars and indicators must use fully rounded end-caps to avoid any sharp, aggressive corners that could feel overly formal or institutional.

## Components

-   **Lesson Cards:** Large white containers with `rounded-xl` corners. They feature an icon or image at the top, a `headline-md` title, and a `tamil-subtext` description.
-   **Primary Buttons:** Large, high-contrast Indigo buttons with a subtle bottom-heavy shadow to create a 3D "clicky" effect.
-   **Progress Rings:** Circular SVG indicators using the Success Green for completion. The track should be a faint version of the same hue.
-   **XP Indicators:** Small, floating chips with a `tertiary-orange` background and white text, often accompanied by a "sparkle" icon.
-   **Language Toggles:** Segmented controls with a clear visual slide animation, clearly labeling "English" and "தமிழ்" (Tamil).
-   **Input Fields:** Soft-bordered fields that glow with an Indigo ring when focused, providing a clear "active" signal to the student.
-   **Feedback Toasts:** Floating bars at the bottom of the screen; Green for "Excellent!" and Orange for "Keep trying!" to provide instant emotional reinforcement.