# AI-LOG.md (CSC13114)

## 2026-11-17 — AI Logging Rule Setup and Project Initialization (PA#3)
Tool: Antigravity (Gemini 3.8 Flash)
Asked for: Configure persistent project rules based on `AI-LOG-template.md` to continuously track and log all AI assistance step-by-step.
Kept: The required 6-part entry schema (`Tool`, `Asked for`, `Kept`, `Changed`, `Rejected`, `By hand`) and course guidelines from `AI-LOG-template.md`.
Changed: Configured the rule to execute incrementally after every prompt/command rather than generating retroactively at submission time.
Rejected: Dumping full conversational transcripts verbatim into the log; adopted concise, honest account summaries as mandated by the course rubric.
By hand: Initialized project guidelines, verified rule file placements (`GEMINI.md`, `AGENTS.md`), and linked requirements to PA#3 deliverables.


## 2026-11-17 — PA#3 Requirements Analysis and Implementation Guide Creation
Tool: Antigravity (Gemini 3.8 Flash)
Asked for: Read and analyze `PA#3 rubric — Prototype with the LLM feature running.md`, `request.md`, and `LeeTKOB — class project brief.md`, and generate a comprehensive step-by-step master guide in Vietnamese (`PA02-Guide.md`) to achieve 100% on PA#3.
Kept: The 8-criterion breakdown, the 9 sandbox security minimums, the syllabus rule, and the evaluation thresholds from the official brief and rubric.
Changed: Structured the guide into an actionable 9-step implementation roadmap with mermaid flowcharts, concrete verification tests for each criterion, and a dedicated "Never Do" checklist highlighting common LLM pitfalls.
Rejected: Superficial high-level summaries without technical specifics; ensured exact command shapes (`MODEL_OFF=1`, Docker CLI args, memory read-back) were explicitly documented.
By hand: Synthesized cross-document requirements into structured sections, defined the step-by-step execution path, and verified criteria alignment against the 100-point rubric.


## 2026-11-17 — verify AGENTS.md compliance and test AI-LOG tracking for PA03 transition
Tool: Antigravity (Gemini 3.8 Flash)
Asked for: Verify whether the agent reads `AGENTS.md` and correctly maintains `AI-LOG.md` when transitioning work from PA02 codebase to PA03.
Kept: The established `AI-LOG.md` history and the existing PA02 repository structure.
Changed: Located and verified the relocated `Pa02/` workspace, reading `Pa02/AGENTS.md` system instructions directly.
Rejected: Creating duplicate logs in external folders; targeted `Pa02/AI-LOG.md` in-place as mandated by Section 1 of `AGENTS.md`.
By hand: User initiated the compliance verification prompt to test autonomous agent adherence to repository rules and git conventions.


## 2026-11-17 — author comprehensive guide.md tailored to PA02 stack for PA03 completion
Tool: Antigravity (Gemini 3.8 Flash)
Asked for: Author a comprehensive, 100%-target `guide.md` tailored to the PA02 TypeScript/Express architecture for completing PA03 based on `request.md` and `PA#3 rubric — Prototype with the LLM feature running.md`.
Kept: The 8-criterion rubric grading rules, 9 sandbox security minimums, and existing PA02 TypeScript/Express/Vitest project structure.
Changed: Directly tailored the implementation guide to the existing PA02 codebase (Express routes, review-queue contract endpoint, Vitest tests, GitHub Actions) rather than generic boilerplate.
Rejected: Proposing an entirely new framework or rewriting the backend from scratch; designed incremental modules on top of PA02's verified contract endpoint.
By hand: Mapped team metadata (23120319, 23120327, 23120380), repo URL, and concrete TDD commit phases directly into the step-by-step roadmap.


## 2026-11-17 — establish TypeScript interface contracts for 3-member PA#3 parallel development
Tool: Antigravity (Gemini 3.8 Flash)
Asked for: Define TypeScript interface contracts and shared types in `src/types/` for three-member parallel development on PA#3 while maintaining 100% compatibility with PA#2.
Kept: All PA#02 existing contract types (`ReviewQueueItem`, `ProblemDetails`, `AuthUser`) and Vitest contract test suite passing 9/9 tests.
Changed: Unified `Verdict` and `UnsureReason` into `src/types/constraint.types.ts` and re-exported seamlessly through `src/types/review-queue.types.ts` and `src/types/index.ts`.
Rejected: Ad-hoc loosely-typed data structures between sandbox, hard-rules, LLM, and review queue modules; avoided breaking existing contract endpoints.
By hand: Ran full CI gate (`format:check`, `lint`, `typecheck`, `test`), verified zero compilation or lint errors, and confirmed 100% test pass rate.


## 2026-11-17 — author team task allocation and git workflow plan (divide-task.md)
Tool: Antigravity (Gemini 3.8 Flash)
Asked for: Create `divide-task.md` detailing cross-module data flow, 3-member task assignments, Git TDD strategy, and integration roadmap for PA#3.
Kept: The 8-criterion rubric allocation, 9 sandbox security constraints, and existing PA02 TypeScript architecture.
Changed: Structured cross-module data flow via Mermaid diagram based on `src/types/` contracts; added explicit anti-squash-merge rule to protect Criterion 7 scoring.
Rejected: Vague responsibility boundaries or overlapping responsibilities without clear file ownership; rejected squash-merging pull requests.
By hand: Mapped team member IDs (23120319, 23120327, 23120380), defined integration milestones (18/11 to 25/11), and specified git branch names.


## 2026-11-18 — create 9 C++ sandbox attack test cases (Test First)
Tool: Antigravity (Gemini 3.8 Flash)
Asked for: Create 9 C++ security attack test cases in `tests/sandbox_attacks/` following TDD strategy for Member 1 (Infrastructure & Security).
Kept: The exact attack specifications, socket checks, memory read-back loops, sleep duration, and environment variable names from user requirements.
Changed: Structured the attack test files with exact numbering prefix (01-09) to match Criterion 2 row-by-row in the rubric.
Rejected: Combining multiple security tests into a single file; maintained individual dedicated files for precise failure isolation.
By hand: User provided the test logic and attack vectors designed to challenge container boundaries without compromising host infrastructure.
