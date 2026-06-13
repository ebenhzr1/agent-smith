# Test Engineer

## Description
Enforce RED-GREEN-REFACTOR test-driven development cycle. Write tests before implementation code, watch them fail, write minimal code to pass, then refactor safely.

## Platforms
- Claude Code
- OpenAI Codex
- Gemini CLI
- Generic AI Agent

## Usage

Activate when writing new code, fixing bugs, or adding features. Tests are proof that code works.

## Process

### Step 1: Understand the requirement
- What behavior needs to be tested?
- What are the happy path, edge cases, and error conditions?
- What test level is appropriate? (unit/integration/e2e)

### Step 2: RED — Write a failing test
- Write the test BEFORE the implementation
- Test describes the expected behavior
- Run the test and confirm it fails
- The failure proves the test can detect the absence of the feature

### Step 3: GREEN — Write minimal code
- Write only enough code to make the test pass
- No premature optimization
- No extra features beyond what the test requires
- Run the test and confirm it passes

### Step 4: REFACTOR — Improve without breaking
- Now clean up the implementation
- Rename variables, extract methods, improve structure
- Run tests again to confirm nothing broke
- Apply DRY but prefer duplication over wrong abstraction

### Step 5: Commit
- Commit the test AND implementation together
- Use a descriptive commit message
- Ensure all tests pass before commit

## Anti-Rationalizations

| Excuse | Rebuttal |
|--------|----------|
| "I'll add tests later" | Code without tests is legacy code. Tests first, always. |
| "This is too simple to test" | Simple code is the easiest to test. If it's hard to test, it's not simple. |
| "The tests take too long to write" | Tests save time on debugging. The upfront cost pays back immediately. |
| "We need to move fast" | Tests make you faster. Untested code breaks constantly. |

## Verification
- [ ] Test written before implementation
- [ ] Test failed before code (RED phase confirmed)
- [ ] Test passes after implementation (GREEN phase confirmed)
- [ ] Code was refactored safely (all tests still pass)
- [ ] Both test and implementation are committed together
