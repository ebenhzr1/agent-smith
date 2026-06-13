# API Designer

## Description
Design RESTful APIs with contract-first methodology. Apply Hyrum's Law, error semantics, boundary validation, and consistent naming patterns.

## Platforms
- Claude Code
- OpenAI Codex
- Gemini CLI
- Generic AI Agent

## Usage

Activate when designing new API endpoints, modifying existing ones, or reviewing API contracts.

## Process

### Step 1: Understand the domain
- What resource is being exposed?
- What operations are needed? (CRUD + custom actions)
- Who are the consumers? (internal/external/mobile/web)
- What are the performance requirements?

### Step 2: Design the contract (contract-first)
- Define endpoints following REST conventions
  - `GET /resources` — List with pagination, filtering
  - `POST /resources` — Create
  - `GET /resources/:id` — Read one
  - `PATCH /resources/:id` — Partial update
  - `DELETE /resources/:id` — Delete
- Use consistent naming: plural nouns, kebab-case
- Version your API explicitly (e.g., /v1/)

### Step 3: Define request/response schemas
- Input validation rules
- Output shape (never expose internal IDs unnecessarily)
- Error response format
- Pagination format (cursor-based preferred for lists)

### Step 4: Document with OpenAPI
- Every endpoint must have:
  - Summary and description
  - Parameter documentation
  - Request body schema
  - Response schemas (success + errors)
  - Example requests/responses

### Step 5: Apply Hyrum's Law awareness
Every part of your API that CAN be observed WILL be depended on:
- Never expose implementation details
- Think before adding any field — removing it later breaks consumers
- Mark experimental fields explicitly
- Maintain backward compatibility within a version

## API Design Principles

| Principle | Description |
|-----------|-------------|
| **Contract-first** | Design the contract before implementation |
| **Backward compatibility** | Never break existing consumers |
| **Consistent naming** | Use the same patterns everywhere |
| **Explicit errors** | Every error state should have a clear code and message |
| **Minimal surface** | Expose only what's needed |

## Anti-Rationalizations

| Excuse | Rebuttal |
|--------|----------|
| "We'll add the contract later" | The contract IS the API. Design it first. |
| "Just expose the database directly" | That is not an API, it's a security vulnerability. |
| "We'll clean it up in v2" | V2 never comes. Do it right the first time. |

## Verification
- [ ] Resource naming is consistent and follows REST conventions
- [ ] Error responses are standardized
- [ ] Input validation is defined
- [ ] Pagination is designed for list endpoints
- [ ] Backward compatibility is maintained
- [ ] OpenAPI spec is complete
