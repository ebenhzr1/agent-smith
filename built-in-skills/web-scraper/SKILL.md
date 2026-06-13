# Web Scraper

## Description
Extract data from websites with anti-blocking best practices, rate limiting, and robust error handling. Handles dynamic content, pagination, and data cleaning.

## Platforms
- Claude Code
- OpenAI Codex
- Generic AI Agent

## Usage

Activate when the user asks to extract data from a website, scrape content, or monitor a web page for changes.

## Process

### Step 1: Analyze the target
- What URL(s) need to be scraped?
- Is the content static HTML or JavaScript-rendered?
- Does the site have an API that could be used instead?
- Check robots.txt for scraping rules
- Check terms of service for legal compliance

### Step 2: Choose the approach
Based on analysis:
- **Static HTML**: Use HTTP requests + HTML parser
- **Dynamic content**: Use headless browser (Playwright/Puppeteer)
- **API**: Use direct API calls (prefer this when available)
- **RSS/feeds**: Use feed parser

### Step 3: Implement with guardrails
- Add rate limiting (minimum 1-2 second delay between requests)
- Set proper User-Agent headers
- Handle pagination if needed
- Implement retry logic with exponential backoff
- Add timeout handling

### Step 4: Extract and clean data
- Parse the relevant data from the response
- Clean and normalize the data
- Handle missing fields gracefully
- Structure output as JSON or CSV

### Step 5: Error handling
What to do when:
- **403/429**: Respect rate limits, add longer delays
- **Timeout**: Retry with exponential backoff (max 3 retries)
- **Content changed**: Log the change, adapt selector
- **CAPTCHA**: Stop and notify the user

## Anti-Rationalizations

| Excuse | Rebuttal |
|--------|----------|
| "I'll just send one request quickly" | Rate limiting protects both you and the target. Always respect it. |
| "The API is too complex, I'll just scrape" | If an API exists, prefer it. It's more stable and legal. |
| "I don't need to check robots.txt" | robots.txt is a legal and ethical boundary. Always check. |

## Verification
- [ ] robots.txt checked and respected
- [ ] Rate limiting implemented
- [ ] Error handling in place
- [ ] Data cleaned and structured
- [ ] Legal compliance confirmed
