# Contributing

Thanks for helping improve No-Shell Agent Operating Pack.

## What to contribute

- Better no-shell examples for real business workflows.
- Clearer plain-language command cards.
- More tool-routing cases for Codex, ChatGPT, Claude, Gemini, Hermes, browser automation, document automation, spreadsheet automation, and MCP workflows.
- Stronger validation checks that catch fake completion.
- Recovery patterns that fix the upstream cause instead of adding another manual gate.

## Quality bar

A contribution should answer:

1. What real workflow does this improve?
2. What input does the user provide?
3. What output should the agent produce?
4. How do we know it is not an empty shell?
5. What should happen when the result fails?
6. Where is the human/account/payment/privacy boundary?

## Validation

Run:

```powershell
python validation/package_selfcheck.py
```

Do not add secrets, account tokens, private customer data, cookies, or private transcripts.

