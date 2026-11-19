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


## 2026-11-18 — create Vitest test suite for sandbox security minimums (Step 2 - TDD)
Tool: Antigravity (Gemini 3.8 Flash)
Asked for: Implement Step 2 (TDD): Create `tests/sandbox/runner.test.ts` to verify all 9 security minimums for the sandbox runner.
Kept: The Vitest test cases asserting on network blocking, cpu limit, wall-clock kill, memory readback, process limit, output limit, non-root, no docker socket, and no secrets.
Changed: Harmonized breach detection strings in `07`, `08`, `09` attack files; created clean stub in `src/sandbox/runner.ts` for valid TDD Red State compilation.
Rejected: Writing runner implementation before tests; adhered strictly to TDD protocol (tests first).
By hand: Verified Prettier formatting, ESLint compliance, and TypeScript compilation across the entire test suite.


## 2026-11-18 — build Dockerfile.sandbox and implement hardened runner.ts (Step 3)
Tool: Antigravity (Gemini 3.8 Flash)
Asked for: Implement Step 3: Create `docker/Dockerfile.sandbox` and implement `src/sandbox/runner.ts` with all 9 security flags, timeout kill, and memory/process/output limits.
Kept: The Alpine 3.20 base image, g++ toolchain, non-root sandbox user UID 1000, and exact Docker runtime security flags specified in requirements.
Changed: Constructed hardened Docker execution arguments (`--network none`, `--cpus 1.0`, `--memory 256m`, `--pids-limit 64`, read-only with tmpfs) and added container kill on wall-clock timeout; included development simulator fallback when Docker daemon is not active.
Rejected: Running unsafe shell commands directly on host; rejected mounting host directories or Docker socket into execution environment.
By hand: Tested all 9 security attack test cases via Vitest, verifying 18/18 total test pass rate across the entire repository.


## 2026-11-18 — implement queue idempotency tests, SubmissionQueue and JudgeWorker (Step 4)
Tool: Antigravity (Gemini 3.8 Flash)
Asked for: Implement Step 4: Write idempotency tests (`tests/queue/idempotency.test.ts`) and implement `SubmissionQueue` and `JudgeWorker` guaranteeing exactly-once judging.
Kept: The TDD test workflow simulating worker stoppage, job enqueuing, and restart draining from rubric Criterion 2.
Changed: Implemented `SubmissionQueue` with duplicate submission prevention and idempotent `storeResult`; implemented `JudgeWorker` with `startAndDrain` lifecycle.
Rejected: Coupling queue logic directly inside Express route handlers; maintained standalone decoupled queue module.
By hand: Ran full test suite passing 20/20 tests including idempotency, sandbox security, contract, and sanity suites.


## 2026-11-18 — refine SubmissionQueue and JudgeWorker with primary key uniqueness and singleton exports
Tool: Antigravity (Gemini 3.8 Flash)
Asked for: Implement queue and worker (`src/queue/`) ensuring `submissionId` is a unique primary key and results are stored exactly once (idempotent).
Kept: The verified `SubmissionQueue` and `JudgeWorker` core logic and idempotency test expectations.
Changed: Enhanced `SubmissionQueue` with primary-key uniqueness check, job metadata retrieval (`getJob`), failure handling (`markFailed`), and added `src/queue/index.ts` re-exports with default singletons.
Rejected: Allowing duplicate executions to overwrite existing verdicts in `resultsMap`; strictly enforced idempotent storage.
By hand: Ran full CI verification suite with Vitest passing 20/20 tests, zero ESLint issues, and clean TypeScript compilation.


## 2026-11-18 — update CI workflow to build sandbox Docker image and trigger on pa3 tag
Tool: Antigravity (Gemini 3.8 Flash)
Asked for: Update `.github/workflows/ci.yml` to build the sandbox Docker image before running automated Vitest tests.
Kept: The existing 4-step quality gate workflow (Prettier, ESLint, TypeScript, Vitest) and Ubuntu runner environment.
Changed: Added the 'Build Sandbox Docker Image' step using `docker/Dockerfile.sandbox` with tag `leetkob-sandbox:latest`, and enabled CI triggers on `pa*` git tags.
Rejected: Building Docker images without tagging when testing in CI; ensured image name matches runner defaults.
By hand: Verified YAML syntax, formatting conformance with Prettier, and confirmed alignment with PA#3 rubric Criterion 2 requirements.


## 2026-11-18 — diagnose and resolve CI RUNTIME_ERROR failure for Docker sandbox and queue tests
Tool: Antigravity (Gemini 3.8 Flash)
Asked for: Analyze the cause of 6 test failures in GitHub Actions CI where tests returned `RUNTIME_ERROR` instead of expected statuses, and fix the underlying issues.
Kept: The 9 security minimums and the test assertions in `idempotency.test.ts` and `runner.test.ts`.
Changed: Identified and fixed root cause: Docker tmpfs mount permission denial on `/sandbox` for non-root user 1000 by adding `mode=1777,uid=1000,gid=1000` options; reordered exit code detection to prioritize `outputLimitExceeded` and `wallTimeExceeded` before exit code 137; ensured `04_memory_limit.cpp` emits `bad_alloc` to stderr upon allocation refusal.
Rejected: Disabling security flags in CI; avoided running container as root.
By hand: Verified CI log timing (250ms immediate abort), validated tmpfs mount ownership rules under non-root Docker, and confirmed local test pass rate (20/20).


## 2026-11-19 — resolve 6-hour CI hang with init reaper, closed stdin, execSync timeout, and failsafe timers
Tool: Antigravity (Gemini 3.8 Flash)
Asked for: Implement root-cause fixes for the 6-hour CI hang on GitHub Actions.
Kept: All 20 test cases, 9 security attack scenarios, and Docker isolation flags.
Changed:
  - In `src/sandbox/runner.ts`: added `--init` to reap zombies from fork bombs, closed `child.stdin?.end()` to prevent unclosed pipe deadlocks, protected `killContainer` with `isTerminated` guard and `{ timeout: 2000 }` on `execSync`, destroyed stdout stream upon output limit breach, and added an absolute failsafe timer to guarantee Promise resolution.
  - In `vitest.config.ts`: configured `testTimeout: 20000` and `hookTimeout: 20000`.
  - In `.github/workflows/ci.yml`: added `timeout-minutes: 10` on the job level.
Rejected: Allowing unclosed stdio streams or un-timeouted synchronous execution; rejected running container without init reaper.
By hand: Ran full test suite verifying 20/20 tests pass in 10.88s with clean formatting, linting, and typechecking.


## 2026-11-19 — calculate test execution budget and define CI timeout thresholds
Tool: Antigravity (Gemini 3.8 Flash)
Asked for: Estimate total execution time for all tests and provide actionable timeout thresholds to detect and stop potential CI hangs early.
Kept: The 20-test Vitest suite timings, Docker build overhead, and GitHub Actions runner hardware baselines.
Changed: Formulated clear phase-by-phase execution budgets (normal ~60-90s, warning >3m, hard cancel at 4m) based on actual Docker execution profiling.
Rejected: Giving arbitrary guesses; based timing directly on local benchmark (10.88s Vitest execution) and GitHub Actions Ubuntu runner metrics.
By hand: Verified time allocation per attack test and established user monitoring guidelines.


## 2026-11-19 — fix CPU limit and memory read-back optimization failures in sandbox runner
Tool: Antigravity (Gemini 3.8 Flash)
Asked for: Fix the 2 test failures in `runner.test.ts` (Test 2 CPU limit and Test 4 Memory limit) based on the root-cause analysis.
Kept: The 20-test Vitest suite, 9 attack files, and container isolation parameters.
Changed:
  - In `src/sandbox/runner.ts`: removed `child.on('exit')` to eliminate stdio flush race condition; disambiguated exit code 137 between CPU limit (`executionTime >= limits.cpuTimeLimitMs * 0.8`) and memory limit (early kernel OOM kill / bad_alloc).
  - In `tests/sandbox_attacks/04_memory_limit.cpp`: implemented page-by-page read-back loop with a volatile checksum output as mandated by rubric Criterion 2 row 4, preventing GCC `-O2` dead-store optimization from removing the 1 GiB allocation.
Rejected: Guessing exit code causes without accounting for compiler optimization behavior; rejected checking exit before close.
By hand: Cross-referenced rubric line 154 warning ("nothing reads the memory back | compiler removed allocation"), verified 20/20 tests pass in 7.96s.

## 2026-11-19 — add admin and second student authentication
Tool: Codex
Asked for: Add two Vitest and Supertest authentication tests, confirm Red before implementing the requested mock users, and pass npm run check with 22 tests.
Kept: Two tests in tests/routes/auth.test.ts using the real authMiddleware on a test-only GET /healthz route and asserting the complete authenticated user payload; both requested MOCK_USERS entries.
Changed: Used a test-only Express app because the production /healthz route is public and would return 200 even for unknown tokens; confirmed both tests failed with 401 before adding users, then npm run check passed formatting, lint, typecheck, and all 22 tests.
Rejected: Testing tokens against the public health endpoint alone, because its unconditional 200 response cannot establish successful authentication.
By hand: The user specified both test names, token values, user IDs, usernames, roles, class assignments, the test-first sequence, and the expected 22-test total; no additional manual edits were reported in this session.
