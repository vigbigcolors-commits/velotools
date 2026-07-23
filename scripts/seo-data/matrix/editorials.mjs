/**
 * Unique editorial copy per matrix id.
 * Anti-doorway rule: every /tools/ page must have distinct lead + whyPreset.
 * No shared long FAQ essay cloned from /focus/.
 */
/** @typedef {{ eyebrow: string, h2: string, lead: string, whyPreset: string, workflowTip: string, faqs: { question: string, answer: string }[] }} Editorial */

/** @type {Record<string, Editorial>} */
export const EDITORIALS = {
  'backend-developer-focus-room': {
    eyebrow: 'Backend deep work',
    h2: 'Deep blocks for systems that fight interrupts',
    lead:
      'This page locks a 50/10 deep-work rhythm for API design, migrations, and long debugging sessions. Midnight theme and lofi keep language centers quiet while you hold complex system state in working memory.',
    whyPreset:
      'Backend work rarely fits classic 25-minute Pomodoros: context rebuild after an interrupt often costs more than the break. A 50-minute focus block with a 10-minute short break matches how schema changes and service traces actually unfold.',
    workflowTip:
      'Use the first block for the hardest design decision, the second for implementation, and park Slack until the short break. Keep notes only in the local journal — nothing leaves the browser.',
    faqs: [
      {
        question: 'Why 50 minutes instead of 25 for backend work?',
        answer:
          'Service boundaries and failure modes need a longer uninterrupted ramp. Fifty minutes covers design plus a first implementation pass; ten minutes is enough to stand up without losing the mental model.',
      },
      {
        question: 'Does this page upload my code or notes?',
        answer:
          'No. Focus Room runs entirely in your browser. Tasks, streaks, and journal entries stay in localStorage on your device and are never sent to VeloTools servers.',
      },
    ],
  },
  'frontend-developer-focus-room': {
    eyebrow: 'Frontend craft mode',
    h2: 'UI implementation without tab chaos',
    lead:
      'Classic 25/5 Pomodoro with teal theme and cafe ambient for UI implementation, component polish, and design-system work where short feedback loops beat marathon blocks.',
    whyPreset:
      'Frontend tasks often complete in small visual slices. Twenty-five minutes is enough to ship a component state or interaction without drifting into endless pixel chasing.',
    workflowTip:
      'One active task per session: one component, one bug, or one a11y pass. Switch to cafe sound when brainstorming layout alternatives; mute during careful CSS.',
    faqs: [
      {
        question: 'When should frontend use longer blocks?',
        answer:
          'Use the CSS polish variant (30/5) when you are mid-refactor across tokens. For everyday UI tickets, 25/5 keeps reviewable diffs and clearer stopping points.',
      },
      {
        question: 'Is cafe noise distracting for coding?',
        answer:
          'Moderate cafe ambience helps divergent layout thinking. For syntax-heavy TypeScript, switch the preset sound off or to lofi after the first session.',
      },
    ],
  },
  'devops-engineer-focus-room': {
    eyebrow: 'Infra calm focus',
    h2: 'Calm pacing for infra changes',
    lead:
      'A 45/10 jade + rain preset for runbooks, Terraform reviews, and pipeline work where calm pacing beats adrenaline-driven clicking.',
    whyPreset:
      'Infra changes need careful verification windows. Forty-five minutes supports plan, apply-check, and note-taking; ten minutes recovers attention before the next risky step.',
    workflowTip:
      'Never start a production-touching change in the last five minutes of a block. End each session by writing what was applied and what still needs confirmation.',
    faqs: [
      {
        question: 'Is this for on-call incidents?',
        answer:
          'Default DevOps preset is for planned work. For interrupt-heavy on-call, use the shorter on-call variant (20/5) so alerts can land between blocks.',
      },
      {
        question: 'Why rain ambient for DevOps?',
        answer:
          'Steady rain masks office noise without lyrical interference, which helps when reading logs and diffs that already demand verbal working memory.',
      },
    ],
  },
  'ux-designer-focus-room': {
    eyebrow: 'UX synthesis',
    h2: 'Synthesis time that protects insight quality',
    lead:
      'Thirty/five amber + forest for research synthesis, journey maps, and problem framing where thinking quality matters more than raw output speed.',
    whyPreset:
      'UX insight work needs reflective pace. Thirty minutes is long enough to cluster findings; five-minute breaks prevent forcing weak conclusions.',
    workflowTip:
      'Keep one research question as the active task. Capture quotes in the session note, then expand in the journal after the block — still local-only.',
    faqs: [
      {
        question: 'How is this different from UI design focus?',
        answer:
          'UX pages bias toward synthesis and research. UI presets emphasize shorter critique and visual polish blocks with different sound and theme defaults.',
      },
      {
        question: 'Can I use this during stakeholder workshops?',
        answer:
          'Yes for prep and debrief. During live workshops, pause the timer and restart for synthesis afterward so facilitation is not cut mid-conversation.',
      },
    ],
  },
  'ui-designer-focus-room': {
    eyebrow: 'UI polish sprints',
    h2: 'Short loops for visual decisions',
    lead:
      'Twenty-five/five midnight + lofi for visual systems, spacing passes, and component states where rhythm keeps critiques honest.',
    whyPreset:
      'UI polish benefits from short loops: try, compare, decide. Classic Pomodoro prevents endless tweaking without a ship checkpoint.',
    workflowTip:
      'Limit each session to one surface (buttons, forms, or nav). Export decisions to your design file after the break, not during focus.',
    faqs: [
      {
        question: 'Why midnight theme for UI work?',
        answer:
          'Dark chrome reduces glare around colorful mockups and keeps attention on the canvas rather than the browser chrome.',
      },
      {
        question: 'Does Focus Room replace Figma timers?',
        answer:
          'No. It is a privacy-first session shell beside your design tool. Presets change timer and ambience only; design files stay in your own apps.',
      },
    ],
  },
  'copywriter-focus-room': {
    eyebrow: 'Copy sprints',
    h2: 'Sprint writing with a clean edit pass',
    lead:
      'Twenty-five/five teal + cafe for headlines, landing sections, and offer copy that benefits from the coffee-shop effect without leaving your desk.',
    whyPreset:
      'Copy thrives on constrained sprints. Twenty-five minutes pushes a draft out; five minutes resets judgment before the edit pass.',
    workflowTip:
      'Write ugly first drafts in the focus block. Use the break to stand, then start the next block as editor-only — no new ideas until the draft exists.',
    faqs: [
      {
        question: 'What if I need faster headline batches?',
        answer:
          'Use the 15/3 sprint variant for hook batches. Return to 25/5 when drafting full sections that need narrative continuity.',
      },
      {
        question: 'Will my drafts sync to the cloud?',
        answer:
          'No. Anything typed in Focus Room notes stays in browser storage. Keep final copy in your own docs tool if you need multi-device access.',
      },
    ],
  },
  'content-writer-focus-room': {
    eyebrow: 'Longform drafting',
    h2: 'Longform flow without analytics rabbit holes',
    lead:
      'Forty/eight amber + rain for articles and guides where you need a longer on-ramp to hold outline, sources, and voice in mind together.',
    whyPreset:
      'Longform loses momentum in tiny slices. Forty minutes covers outline-to-paragraph flow; eight minutes is a real pause without killing the thread.',
    workflowTip:
      'Start each block with the next H2 only. Do not open analytics mid-session. Save link checks for the short break list.',
    faqs: [
      {
        question: 'How does this differ from the blog variant?',
        answer:
          'The default content preset favors deeper drafting. The blog variant uses 25/5 cafe mode for shorter posts and lighter research load.',
      },
      {
        question: 'Is rain better than cafe for writing?',
        answer:
          'Rain supports sustained attention for long articles. Cafe helps ideation. Pick based on whether you are drafting or outlining.',
      },
    ],
  },
  'product-manager-focus-room': {
    eyebrow: 'PM spec focus',
    h2: 'Decision-grade focus for specs',
    lead:
      'Thirty-five/seven midnight + ocean for PRDs, decision logs, and prioritization where interruptions destroy decision quality.',
    whyPreset:
      'Spec writing needs a middle length: long enough for tradeoffs, short enough to ship a reviewable section before standup.',
    workflowTip:
      'One decision per session in the active task. If scope expands, park it in the note and finish the original decision first.',
    faqs: [
      {
        question: 'Can engineering join the same timer?',
        answer:
          'Yes as a shared ritual, but each person runs Focus Room locally. There is no account sync by design — privacy over shared cloud rooms.',
      },
      {
        question: 'What about roadmap-heavy days?',
        answer:
          'Switch to the roadmap variant (50/10) when sequencing quarters. Keep 35/7 for daily spec and stakeholder-ready writeups.',
      },
    ],
  },
  'data-analyst-focus-room': {
    eyebrow: 'Analysis blocks',
    h2: 'Keep the analytical thread intact',
    lead:
      'Fifty/ten jade + rain for query building, notebook cleaning, and chart narratives that collapse if context is broken mid-thought.',
    whyPreset:
      'Analysis has high reload cost: rerunning mental models of joins and filters. Longer blocks reduce thrash; longer breaks prevent tunnel vision on one metric.',
    workflowTip:
      'Write the question you are answering at session start. If the query changes the question, stop and restate before coding further.',
    faqs: [
      {
        question: 'Is there a SQL-specific preset?',
        answer:
          'Yes — the SQL variant uses 40/8 with cafe ambience for iterative query writing. Use this default for broader analysis and storytelling.',
      },
      {
        question: 'Does VeloTools see my datasets?',
        answer:
          'No. The timer never touches your warehouse, CSVs, or notebooks. It only runs in the browser tab you opened.',
      },
    ],
  },
  'qa-engineer-focus-room': {
    eyebrow: 'Test-pass rhythm',
    h2: 'Charter-sized test passes',
    lead:
      'Twenty-five/five teal + forest for exploratory passes and checklist execution where steady cadence beats burnout from endless suites.',
    whyPreset:
      'Short blocks map cleanly onto test charters. Twenty-five minutes is a honest pass length; five minutes resets eyes and notes.',
    workflowTip:
      'Name the charter in the active task. Log only defects and surprises in the session note — full reports stay in your tracker.',
    faqs: [
      {
        question: 'What about long regression days?',
        answer:
          'Use the regression variant (45/10) for suite marathons. Keep 25/5 for exploratory and smoke work that needs fresh attention.',
      },
      {
        question: 'Can I run this beside automation jobs?',
        answer:
          'Yes. Start a block while jobs run, then use the break to triage failures. The timer does not integrate with CI — that separation is intentional.',
      },
    ],
  },
  'student-focus-room': {
    eyebrow: 'Study Pomodoro',
    h2: 'Simple study loop, zero accounts',
    lead:
      'Classic 25/5 amber + lofi for reading, problem sets, and revision without accounts, paywalls, or study-data tracking.',
    whyPreset:
      'Students need a simple trustworthy loop. Twenty-five minutes is teachable, measurable, and long enough for one textbook section or problem cluster.',
    workflowTip:
      'Phone in another room. One subject per session. Use the journal after study to write three recall bullets from memory.',
    faqs: [
      {
        question: 'Is there an exam-prep mode?',
        answer:
          'Yes — the exam variant uses 50/10 with forest ambient for longer recall drills. Use 25/5 for daily homework.',
      },
      {
        question: 'Will my school see this activity?',
        answer:
          'No. There is no login and no school integration. Progress lives only in your browser unless you clear site data.',
      },
    ],
  },
  'freelancer-focus-room': {
    eyebrow: 'Billable deep work',
    h2: 'Billable bricks between messages',
    lead:
      'Forty-five/ten midnight + cafe for client deliverables where billable focus must survive Slack, email, and context switching.',
    whyPreset:
      'Freelance days fragment easily. Forty-five minutes creates a billable brick; ten minutes is enough to answer messages without living in the inbox.',
    workflowTip:
      'Put the client + deliverable in the active task. During focus, messages wait. Use breaks as the only communication window.',
    faqs: [
      {
        question: 'How do I handle deadline panic?',
        answer:
          'Switch to the 20/5 deadline variant for high-pressure finish work. Return to 45/10 when quality and fewer defects matter more than raw speed.',
      },
      {
        question: 'Can I prove time to a client?',
        answer:
          'Focus Room is not a timesheet product. Use it to protect focus; export hours from your invoicing tool separately if clients require proof.',
      },
    ],
  },
  'seo-specialist-focus-room': {
    eyebrow: 'SEO audit focus',
    h2: 'One artifact per sealed block',
    lead:
      'Thirty/five jade + rain for audits, SERP reviews, and brief writing where tab chaos usually destroys depth.',
    whyPreset:
      'SEO work sprawls across tools. Thirty-minute sealed blocks force one artifact (one audit section or one brief) instead of twenty half-open tabs.',
    workflowTip:
      'Close analytics after collecting the one metric you need. Write the insight in the session note before opening another dashboard.',
    faqs: [
      {
        question: 'Is this page itself a doorway risk?',
        answer:
          'It is stateful: timer, theme, and sound are locked for SEO work, and the copy here is unique to this profession. Scaled pages that only swap a keyword are what Google rejects.',
      },
      {
        question: 'What is the briefs variant for?',
        answer:
          'Content-brief days use 35/7 ocean mode for longer outlining. Keep 30/5 for technical audits and crawl reviews.',
      },
    ],
  },
  'mobile-developer-focus-room': {
    eyebrow: 'Mobile build sprints',
    h2: 'Absorb build waits inside focus',
    lead:
      'Forty/eight teal + lofi for Xcode/Android Studio sessions where emulator lag already taxes patience and interrupts are expensive.',
    whyPreset:
      'Mobile builds and simulator cycles eat minutes. Forty-minute blocks absorb compile waits inside focused work instead of restarting attention after every ping.',
    workflowTip:
      'Start the emulator before the timer. One ticket per block. Do not open design chat until the short break.',
    faqs: [
      {
        question: 'When should I use the debug preset?',
        answer:
          'Use 50/10 debug mode for crash investigations and profiling. Keep 40/8 for feature implementation with clearer stopping points.',
      },
      {
        question: 'Does Focus Room hook into the IDE?',
        answer:
          'No. It stays a separate browser timer so your project files and device logs never touch VeloTools.',
      },
    ],
  },
  'sysadmin-focus-room': {
    eyebrow: 'Ops maintenance focus',
    h2: 'Checklist pace for safe changes',
    lead:
      'Fifty/ten midnight + fire for maintenance windows and careful production changes where calm beats heroics.',
    whyPreset:
      'Ops work rewards slow verification. Fifty minutes supports checklist execution; twenty-five-minute breaks after four sessions reduce mistake risk.',
    workflowTip:
      'Paste the change ticket ID into the active task. After each block, note rollback status locally before the next step.',
    faqs: [
      {
        question: 'Is fire ambient safe for night shifts?',
        answer:
          'It is a low-arousal sound meant for late work. If it feels too drowsy, switch to rain while keeping the same 50/10 timing.',
      },
      {
        question: 'What about documentation days?',
        answer:
          'Use the docs variant (30/5 forest) for runbook writing. Keep this preset for hands-on maintenance and checks.',
      },
    ],
  },
  'backend-developer-focus-room-ultradian': {
    eyebrow: 'Ultradian backend blocks',
    h2: 'Full ultradian peak for architecture',
    lead:
      'Ultradian 90/20 jade + ocean for architecture days when a short Pomodoro would chop a system design in half.',
    whyPreset:
      'Ninety minutes matches a full ultradian peak for complex modeling. Twenty-minute breaks are mandatory recovery, not optional Slack time.',
    workflowTip:
      'Protect the full 90. If a meeting lands inside, reschedule the block — splitting ultradian work returns almost no design progress.',
    faqs: [
      {
        question: 'Who should not use 90-minute blocks?',
        answer:
          'If your day is interrupt-driven support, stay on 50/10 or shorter. Ultradian mode is for scheduled architecture, not ticket ping-pong.',
      },
      {
        question: 'Why ocean instead of lofi?',
        answer:
          'Ocean is lower lyrical load for abstract modeling. Lofi remains available on the standard backend preset for implementation days.',
      },
    ],
  },
  'copywriter-focus-room-sprint': {
    eyebrow: 'Headline sprints',
    h2: 'High-volume hooks, then select',
    lead:
      'Fifteen/three amber + rain for rapid hook and subject-line batches where volume and selection matter more than long narrative flow.',
    whyPreset:
      'Short sprints create many options fast. Three-minute breaks keep energy up without inviting a full inbox dive.',
    workflowTip:
      'Aim for ten raw lines per block. Circle three survivors only after three sprints — not after each line.',
    faqs: [
      {
        question: 'Will short sprints hurt long-form quality?',
        answer:
          'They are for ideation. Move winning lines into the standard 25/5 copywriter page when you draft the full section.',
      },
      {
        question: 'Why rain for sprints?',
        answer:
          'Rain reduces novelty seeking during fast ideation, which helps you stay on the offer instead of opening research tabs.',
      },
    ],
  },
  'student-focus-room-exam': {
    eyebrow: 'Exam prep',
    h2: 'Longer sealed recall practice',
    lead:
      'Fifty/ten midnight + forest for recall drills, past papers, and spaced repetition days that need longer sealed study.',
    whyPreset:
      'Exam prep rewards longer retrieval practice. Fifty minutes supports a full paper section; ten minutes is for stretch and water, not social feeds.',
    workflowTip:
      'Close notes for the second half of each block and recall from memory. Use the break to check answers, not to start a new topic.',
    faqs: [
      {
        question: 'How is this different from daily study mode?',
        answer:
          'Daily study stays 25/5. Exam mode lengthens focus and darkens the theme to reduce evening glare during intensive revision.',
      },
      {
        question: 'Can I track subjects across devices?',
        answer:
          'Not automatically. Local privacy means no cloud sync. Keep a simple subject list in your own notes if you switch machines.',
      },
    ],
  },
  'ux-designer-focus-room-research': {
    eyebrow: 'Research synthesis',
    h2: 'Cluster interviews without losing the thread',
    lead:
      'Forty-five/ten teal + cafe for affinity mapping and insight writing after interviews when patterns need uninterrupted comparison.',
    whyPreset:
      'Synthesis collapses when interrupted mid-cluster. Forty-five minutes holds multiple quotes in mind; ten minutes resets before the next theme.',
    workflowTip:
      'Work one research question per block. Tag evidence in your own tool; use Focus Room notes only for the emerging insight sentence.',
    faqs: [
      {
        question: 'Why cafe for research days?',
        answer:
          'Cafe ambience supports associative thinking while clustering. Switch to forest on the default UX page when you need quieter reflection.',
      },
      {
        question: 'Does this store interview recordings?',
        answer:
          'No. Focus Room cannot access your recordings. Keep research repositories in your existing research stack.',
      },
    ],
  },
  'devops-engineer-focus-room-oncall': {
    eyebrow: 'On-call calm',
    h2: 'Progress between pages, not fake deep work',
    lead:
      'Twenty/five amber + fire for on-call shifts where focus must start quickly and yield to alerts without guilt.',
    whyPreset:
      'On-call attention is interruptible by nature. Twenty-minute bricks create progress between pages without pretending you can seal ninety minutes.',
    workflowTip:
      'If an alert fires, skip the timer and handle it. Restart a fresh 20 after severity is clear — do not stitch broken minutes together.',
    faqs: [
      {
        question: 'Should I use this for planned deploys?',
        answer:
          'No. Planned work belongs on the default DevOps 45/10 page. On-call mode is optimized for interruptible progress only.',
      },
      {
        question: 'Why fire sound on call?',
        answer:
          'Low, warm noise reduces jumpiness during quiet monitoring without masking pager audio if your alert uses a distinct tone.',
      },
    ],
  },
  'frontend-developer-focus-room-css': {
    eyebrow: 'CSS polish',
    h2: 'Finish a coherent visual slice',
    lead:
      'Thirty/five jade + lofi for token refactors, spacing systems, and responsive passes that need slightly longer than a tiny ticket.',
    whyPreset:
      'CSS systems need mid-length focus: long enough to keep variables consistent, short enough to re-check visually before fatigue hides bugs.',
    workflowTip:
      'Change one axis per session (spacing, type, or color). Screenshot before/after only on the break.',
    faqs: [
      {
        question: 'Why not stay on 25/5?',
        answer:
          'Twenty-five minutes often ends mid-token rename. Thirty minutes usually completes a coherent visual slice you can review cleanly.',
      },
      {
        question: 'Does the page change my editor?',
        answer:
          'No. Only Focus Room timing and ambience change. Your repo and design tokens remain local to your toolchain.',
      },
    ],
  },
  'data-analyst-focus-room-sql': {
    eyebrow: 'SQL focus',
    h2: 'Write, run, adjust without chat noise',
    lead:
      'Forty/eight midnight + cafe for iterative SQL where each run teaches the next filter and you need a stable thinking loop.',
    whyPreset:
      'Query writing is cyclic: write, run, adjust. Forty minutes fits several cycles; eight minutes prevents staring at the same wrong join.',
    workflowTip:
      'Keep the business question pinned as the active task. If the SQL answers a different question, stop and rewrite the question first.',
    faqs: [
      {
        question: 'How is this different from the analyst default?',
        answer:
          'Default analyst mode is broader analysis at 50/10. SQL mode is shorter and cafe-oriented for rapid query iteration.',
      },
      {
        question: 'Can Focus Room run queries?',
        answer:
          'No. It never connects to databases. Use it beside your SQL client as a privacy-first timer only.',
      },
    ],
  },
  'product-manager-focus-room-roadmap': {
    eyebrow: 'Roadmap writing',
    h2: 'Outcomes before timelines',
    lead:
      'Fifty/ten teal + forest for sequencing bets, dependencies, and narrative that must survive executive review.',
    whyPreset:
      'Roadmaps need longer contiguous thought than daily specs. Fifty minutes supports a full theme; ten minutes is for pressure-testing with a walk, not Slack.',
    workflowTip:
      'Write outcomes before timelines. If you jump to dates first, restart the block with outcomes-only until the story is clear.',
    faqs: [
      {
        question: 'Should I share this timer with leadership live?',
        answer:
          'Better as prep. Use the finished narrative in the meeting. The timer is for private deep work, not performance theater.',
      },
      {
        question: 'Why forest ambient here?',
        answer:
          'Lower stimulation helps long-range planning. Ocean remains on the standard PM page for day-to-day specs.',
      },
    ],
  },
  'qa-engineer-focus-room-regression': {
    eyebrow: 'Regression endurance',
    h2: 'Endurance without false passes',
    lead:
      'Forty-five/ten midnight + rain for long suite days where attention drift creates false passes and missed defects.',
    whyPreset:
      'Regression is endurance work. Forty-five minutes is a sustainable charter length; ten minutes rests eyes before the next environment.',
    workflowTip:
      'Rotate environments or browsers across blocks, not mid-block. Note flaky suspects immediately; deep isolation waits for the next session.',
    faqs: [
      {
        question: 'What if the suite finishes early?',
        answer:
          'End the timer and write a short risk summary in the local note. Do not invent extra clicking just to fill the block.',
      },
      {
        question: 'Is midnight theme required?',
        answer:
          'It reduces glare during long screen days. You can change theme manually after load; the preset only sets the default.',
      },
    ],
  },
  'content-writer-focus-room-blog': {
    eyebrow: 'Blog drafting',
    h2: 'Section-by-section publishing cadence',
    lead:
      'Twenty-five/five jade + cafe for blog posts and lighter explainers that ship faster than long technical guides.',
    whyPreset:
      'Blogs benefit from brisk cadence. Twenty-five minutes drafts a section; five minutes is enough to refill water and resist the feed.',
    workflowTip:
      'Outline offline first. Each focus block writes one H2 to completion before moving on.',
    faqs: [
      {
        question: 'When do I use the longer content preset?',
        answer:
          'Use 40/8 rain mode for pillar pages and research-heavy articles. Blog mode stays short for frequent publishing.',
      },
      {
        question: 'Does cafe sound hurt grammar focus?',
        answer:
          'Some writers prefer silence for line edits. Draft with cafe, then mute on the editing block.',
      },
    ],
  },
  'freelancer-focus-room-deadline': {
    eyebrow: 'Deadline sprints',
    h2: 'Finish mode, then return to quality',
    lead:
      'Twenty/five amber + lofi for final delivery pushes when you need momentum without pretending deep-work conditions exist.',
    whyPreset:
      'Deadlines are interruptible and emotional. Twenty-minute sprints create forward motion; five-minute breaks prevent panic spirals.',
    workflowTip:
      'Define done for this sprint in one sentence. If scope creeps, cut scope — do not silently extend the block.',
    faqs: [
      {
        question: 'Is this healthy long term?',
        answer:
          'No. It is a finish tool. Return to 45/10 billable deep work after the deadline so quality and rates stay sustainable.',
      },
      {
        question: 'Why lofi for deadlines?',
        answer:
          'Predictable beats reduce decision fatigue while you execute known tasks. Switch off music if lyrics creep in and steal language focus.',
      },
    ],
  },
  'seo-specialist-focus-room-briefs': {
    eyebrow: 'Brief building',
    h2: 'Complete briefs, not tab collections',
    lead:
      'Thirty-five/seven teal + ocean for briefs that need search intent, outline, and examples in one coherent artifact.',
    whyPreset:
      'Briefs fail when stitched from twelve distracted tabs. Thirty-five minutes forces a complete draft; seven minutes reviews gaps.',
    workflowTip:
      'Collect SERP notes in minute one, then close SERP. Write the brief from memory-plus-notes so intent stays human.',
    faqs: [
      {
        question: 'How unique is this page versus the SEO audit page?',
        answer:
          'Different timing, sound, and copy aimed at brief production, not technical crawl work. That state change is the non-doorway requirement.',
      },
      {
        question: 'Can writers open the same preset?',
        answer:
          'Yes. Anyone can use the URL. Their notes still stay on their own browser — there is no shared brief database here.',
      },
    ],
  },
  'mobile-developer-focus-room-debug': {
    eyebrow: 'Mobile debug',
    h2: 'Reproduce before you rewrite',
    lead:
      'Fifty/ten amber + rain for crash traces, perf graphs, and heisenbugs that punish every notification.',
    whyPreset:
      'Debugging needs long sealed attention. Fifty minutes covers reproduce, isolate, and hypothesize; ten minutes prevents rage-clicking.',
    workflowTip:
      'Write the reproduction steps before touching code. If you cannot reproduce in the first fifteen minutes, change environment, not random code.',
    faqs: [
      {
        question: 'Why amber theme for debugging?',
        answer:
          'Warm contrast helps during long night sessions and visually separates debug mode from the teal build-sprint preset.',
      },
      {
        question: 'Does this capture device logs?',
        answer:
          'No. Keep Logcat/Xcode logs in your local tools. Focus Room never requests device permissions.',
      },
    ],
  },
  'sysadmin-focus-room-docs': {
    eyebrow: 'Runbook writing',
    h2: 'Write rollback while memory is fresh',
    lead:
      'Thirty/five jade + forest for documenting procedures while the steps are still fresh — without uploading internal details anywhere.',
    whyPreset:
      'Docs need moderate blocks: long enough to finish a procedure, short enough to re-test steps before you forget them.',
    workflowTip:
      'Write the rollback section in the same block as the forward steps. If you skip rollback, the runbook is incomplete.',
    faqs: [
      {
        question: 'Is it safe for internal runbooks?',
        answer:
          'Safer than cloud doc timers with accounts: Focus Room stores notes locally. Still avoid pasting secrets; redact as you write.',
      },
      {
        question: 'How is this different from maintenance mode?',
        answer:
          'Maintenance uses 50/10 fire for hands-on changes. Docs mode is shorter and quieter for writing after the change.',
      },
    ],
  },
  'ui-designer-focus-room-critique': {
    eyebrow: 'Critique prep',
    h2: 'Prep the story stakeholders need',
    lead:
      'Twenty/five teal + ocean for preparing critique narratives, alternatives, and open questions before a review meeting.',
    whyPreset:
      'Critique prep is bursty. Twenty minutes frames the story; five minutes resets before polishing slides or frames.',
    workflowTip:
      'List decisions you want, not decorations you made. End each block with three questions for stakeholders.',
    faqs: [
      {
        question: 'Should I present with the timer visible?',
        answer:
          'No. Use it for prep only. Meetings need human pacing; the timer returns after feedback for revision blocks.',
      },
      {
        question: 'Why ocean for critique prep?',
        answer:
          'Lower arousal helps you evaluate work calmly before a social review. Lofi stays on the default UI page for production polish.',
      },
    ],
  },
};
