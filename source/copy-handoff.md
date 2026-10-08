# Portfolio copy: consolidated handoff

7 October 2026. Uses the latest wording and decisions from this conversation. Earlier alternatives and rejected rewrites are superseded. This file contains copy plus destination/preservation instructions; instructions are not website text.

## Hero

Identity: **Érica Menin**
Role label: **Design systems designer**
Location: **Based in Germany · Working remotely**

**Design systems, and what comes next.**

After years of building and maintaining design systems, I’m exploring what changes when AI starts using them too. Here’s some of the work behind those questions, and what I’m looking into now.

Links: **See previous work** · **What I’m exploring now**

## Navigation and common labels

Navigation: **Work · Experiments · Writing · About · Contact**

Separate page: **AI + Design Systems**, linked from the homepage experiments section. Preserve the current section’s exact copy and its paragraph/rules presentation. Suggested page path: `/ai-design-systems`. Heading: **A design system built only for people is easy for AI to get wrong.** Preserve the emphasis on “get wrong”. Do not apply the earlier proposed rewrite to this section. Add standard site navigation and a “Back to home” link. This is a page-content decision only; implementation follows later.

Terminal launcher: **Open terminal**

Inspect control: **Inspect this section**

Inspect close control: **Close inspection**

Home link accessible label: **Érica Menin, home**

Optional existing identity aside: **It stands for Érica Menin, not the Eminem you thought ;)**

## Homepage: selected work

### Selected work

A few examples from my design system work: aligning Figma and code, modernising foundations, documenting decisions, and helping product teams move without breaking everything. For more details, feel free to [contact me](https://ericamenin.com/#contact).

#### Getting a design system back in sync

**Case study · 2025**

An audit of 62 components across Figma, React, and Flutter, followed by changes to the Figma libraries, variables, themes, and migration guidance.

Link: **Read the case study**

Destination: https://ericamenin.com/design-system-back-in-sync

#### soniq Design System

**Case study · 2020–2023**

A shared Figma library for web and mobile, with component documentation, pattern workshops, and regular reviews with developers.

Link: **Read the case study**

Destination: https://ericamenin.com/soniq-design-system

#### Maturing a design system beyond components: operationally, culturally, and strategically

**Reflection · Published on Substack**

A look back at a year of library changes, pattern documentation, support tracking, and day-to-day work with product designers.

Link: **Read the reflection**

Destination: https://designsystemsunfiltered.substack.com/p/my-last-year-as-a-design-system-designer

## Homepage: experiments

Navigation label: **Experiments**

### Questions I’m exploring

How can AI use an existing design system, and what needs to change to make that work? These are the questions I’m working through.

#### What makes a design system machine-readable?

Component properties, token meanings, usage examples, and exceptions all give a tool something concrete to work with. A color value alone won’t explain when it signals an error. I’m interested in how we structure that guidance, keep it current, and make the relevant part available when it’s needed.

#### Machine-readable, or ready to use?

A tool can read the documentation and still invent a component property or choose the wrong pattern. For me, “AI-ready” needs a task attached: can it build this form with the actual components, handle the error states, and pass the relevant checks? That gives us something to evaluate.

#### Could an agent help maintain the system?

Find a mismatch, propose a fix, run the checks, and update the documentation. That’s the kind of work I want to unpack when people say “agentic design system”. Which steps can we trust an agent with, and where should it stop for review? Passing its own checks wouldn’t settle every decision.

#### How much belongs in a DESIGN.md file?

A short file can explain the visual direction. An existing product also has component APIs, exceptions, and implementation rules. I’m interested in what belongs in that initial file, what a tool should look up when needed, and how we avoid maintaining another copy that goes stale.

Expansion control: **More questions**
Expanded control: **Fewer questions**

#### If AI can generate the interface, why do we need a design system?

Generating a screen doesn’t decide which behaviors are appropriate, what must stay consistent, or how the result will be maintained. I’m interested in what the system needs to provide when an interface is assembled for a particular task: available components, rules for combining them, and ways to check the result.

#### What should change first in an existing system?

Before rebuilding anything, I’d start with one task that keeps going wrong. Does the tool need a better example, an explicit rule, access to the actual component, or a fix to the component itself? I want to compare those changes and see which ones improve the result.

#### What happens when Figma, code, and documentation disagree?

This connects directly to my component audit work. I want to see whether a tool can identify conflicting information, show where it came from, and flag a decision for review. Quietly choosing one version could hide the problem.

#### Can an output follow the rules and still miss the point?

A screen can use available components and still give every action the same emphasis. I want to compare what automated checks catch with what needs a review of the whole task. Which judgments can be made explicit, and which need more context?

Related page link: **A design system built only for people is easy for AI to get wrong.** → `/ai-design-systems`

## Homepage: writing

### Writing

**Design Systems Unfiltered**

Writing ~~carefully~~ *honestly* about design systems and AI in [Design Systems Unfiltered](https://designsystemsunfiltered.substack.com/).

#### Don’t make your design system AI-ready yet

A starting point for improving how AI works with an existing system, without beginning with a complete rebuild.

Link: **Read on Substack**

Destination: https://designsystemsunfiltered.substack.com/p/dont-make-your-design-system-ai-ready

#### AI is shipping UI faster than your design system can protect it

Repeated primary buttons, competing colors, and the wrong default background. What those examples revealed about decisions missing from the documentation.

Link: **Read on Substack**

Destination: https://designsystemsunfiltered.substack.com/p/ai-is-shipping-ui-faster-than-your

#### I turned my biggest design system headache into my first Cursor command

The process of creating a first command and skill, and figuring out where AI could help with day-to-day design systems work.

Link: **Read on Substack**

Destination: https://designsystemsunfiltered.substack.com/p/how-a-project-that-haunted-me-led

Section link: **More on Substack**

Destination: https://designsystemsunfiltered.substack.com/

## Homepage: about and contact

### A little about me

Brazilian, based in Germany, with more than 15 years in design.

I like the questions that come up once a system is being used. Two teams need different things from the same component. A rule makes sense until an exception appears. Something changes, and suddenly the documentation tells a different story.

That’s the work I’m drawn to: figuring out what needs to change, with the people who build and use the system. Sometimes it’s a component. Sometimes it’s the guidance, or how a decision gets made.

AI has given me another set of questions to work through. I’m exploring those here and writing about them on Design Systems Unfiltered.

### Let’s compare notes

Have a design system that no longer quite agrees with itself? Or a question about what AI changes? I’d like to hear what you’re working through.

For roles and projects, you can reach me here too.

**Email Érica**: mailto:erica@menin.me

**Connect on LinkedIn**: https://www.linkedin.com/in/ericamenin/

Location: **Based in Germany · Working remotely**

Footer: **Érica Menin · Work, experiments, and writing**

## Case study: Getting a design system back in sync

**LOCKED: preserve the exact current published copy.**

Source: https://ericamenin.com/design-system-back-in-sync

The earlier rewritten version is withdrawn. Preserve headings, body copy, tables, metrics, captions, role details, and existing qualifications. Do not silently remove or reinterpret the 68% metric. The audit question about its denominator is informational only and does not authorize an edit.

Retrieve the published page when preparing the implementation content. Do not substitute the withdrawn draft if retrieval fails. Presentation can be addressed in the later design phase; wording remains unchanged.

## Case study: soniq Design System

**LOCKED: preserve the exact current published copy.**

Source: https://ericamenin.com/soniq-design-system

The earlier rewritten version is withdrawn. Preserve headings, body copy, outcomes, captions, and NDA disclosures, including wording flagged in the initial audit. The user’s explicit preservation instruction takes precedence over the vocabulary cleanup.

Retrieve the published page when preparing the implementation content. Do not substitute the withdrawn draft if retrieval fails.

## Terminal copy

Section heading: **A few answers, via terminal**

Introduction: **Type a command or choose one below.**

Prompt: `erica@portfolio:~$`

Input placeholder: **Type a command…**

Commands and descriptions:

| Command | Description |
| --- | --- |
| `whoami` | A little about me |
| `work` | Projects and contributions |
| `systems` | What the work involves |
| `experiments` | Questions I’m exploring |
| `unfiltered` | Writing on Substack |
| `hire` | Discuss a role or project |
| `contact` | Email and LinkedIn |
| `help` | Show available commands |

### whoami

Érica Menin. Brazilian, based in Germany, with more than 15 years in design.

My recent work covers component alignment, Figma libraries, tokens, documentation, and migration. I also write about design systems and explore how AI tools work with them.

Link: **More about me**

### work

Two projects to start with:

- Getting a design system back in sync: component comparisons across Figma, React, and Flutter, followed by library changes and migration guidance.
- soniq Design System: a Figma library for web and mobile, with documentation, pattern workshops, and component reviews.

Link: **Explore the work**

### systems

Components and tokens are part of it. So are the rules for using them, the differences between implementations, and the steps for moving to a new version.

In one project, that meant changing Disabled and Loading from values of a Figma State property to separate boolean properties, matching how the coded component worked.

Link: **See the example**

### experiments

What makes a system machine-readable? What does “AI-ready” mean for a particular task? Which changes should an agent be allowed to make?

These are questions I’m exploring, with more to test before drawing conclusions.

Link: **Explore the questions**

### unfiltered

Design Systems Unfiltered is my Substack about design systems and AI: projects, experiments, and the questions that follow.

Link: **Read on Substack**

### hire

Have a design systems role or project in mind? Email me with the context and what you need help with. I’m based in Germany and work remotely.

Link: **Email Érica**

### contact

Email: erica@menin.me

LinkedIn: https://www.linkedin.com/in/ericamenin/

### help

Choose a command or type its name: whoami, work, systems, experiments, unfiltered, hire, contact, help.

### Interface messages

- Unknown command: **Command not found. Type “help” or choose a command below.**
- Empty submission: **Type a command or choose one below.**
- Return control: **Back to commands**
- Close control: **Close terminal**
- Keyboard hint: **↑ ↓ choose · Enter run · Esc close**
- Open control accessible label: **Open portfolio terminal**

## Page titles and descriptions

| Page | Title | Description |
| --- | --- | --- |
| Home | Érica Menin \| Design systems, work and experiments | Design systems work across Figma and code, component libraries and migration, alongside independent AI experiments and writing by Érica Menin. |
| Alignment case study | Getting a design system back in sync \| Érica Menin | A 62-component audit across Figma, React and Flutter, changes to Figma variables and themes, and an incremental migration for product teams. |
| soniq case study | soniq Design System \| Érica Menin | Building a Figma library for web and mobile, with component documentation, pattern workshops and regular reviews with development teams. |

Use the same approved titles and descriptions for social previews. No new standalone experiment pages are needed for this content version. Article destinations remain on Substack.

