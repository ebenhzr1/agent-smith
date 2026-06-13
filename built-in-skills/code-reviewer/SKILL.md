# Code Reviewer

## Description
Perform a thorough five-axis code review with senior engineer standards. Catches correctness bugs, security vulnerabilities, performance issues, maintainability problems, and style violations.

## Platforms
- Claude Code
- OpenAI Codex
- Gemini CLI
- Generic AI Agent

## Usage

Invoke when requested to review code, or when a PR/merge request is submitted. Reviews should be thorough but respectful, and always provide actionable feedback.

## Process

### Step 1: Understand the change
- Read the diff or full file context
- Understand what the code is supposed to do
- Check if there are tests and what they cover
- Look at the files being changed

### Step 2: Five-axis review
Review every change against these axes:

1. **Correctness**: Does the code do what it's supposed to? Edge cases? Race conditions?
2. **Security**: Potential vulnerabilities? OWASP Top 10 concerns?
3. **Performance**: Inefficient algorithms? N+1 queries? Memory leaks?
4. **Maintainability**: Clear naming? Comments for why, not what? SOLID principles?
5. **Style**: Follows project conventions? Consistent formatting?

### Step 3: Classify findings
Label each finding by severity:
- 🔴 **Critical**: Must fix before merge (bugs, security issues)
- 🟡 **Warning**: Should fix (performance, maintainability concerns)
- 🔵 **Suggestion**: Nice to have (style, minor improvements)
- ⚪ **Question**: Something unclear needs clarification

### Step 4: Write review
Structure the review as:
1. **Summary**: 2-3 sentence overall assessment
2. **Findings**: Grouped by severity, each with: file:line reference, explanation, and concrete suggestion
3. **Positive feedback**: What was done well
4. **Final verdict**: Approve / Changes requested / Blocked

## Anti-Rationalizations

| Excuse | Rebuttal |
|--------|----------|
| "This is a small change, it doesn't need a full review" | Small changes can have big impacts. Always review properly. |
| "I trust the author, no need to check" | Review is about code quality, not trust. Everyone makes mistakes. |
| "We can fix it later" | "Later" never comes. Fix it now or create a tracked issue. |

## Verification
- [ ] Reviewed all changed files
- [ ] Checked for correctness bugs
- [ ] Checked for security vulnerabilities
- [ ] Assessed performance impact
- [ ] Provided actionable suggestions
- [ ] Left positive feedback
