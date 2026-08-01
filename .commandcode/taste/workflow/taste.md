# workflow
- For UX/UI related tasks, use the premium-eco-design-system agent at `.commandcode/agents/premium-eco-design-system.md`. Confidence: 0.75
- When medication dose progress reaches 100% (all doses taken), automatically set the medication status to "Discontinued". Confidence: 0.70
- Separate medication orders (doctor side) from administrations (nurse history) — the doctor creates orders with dose/frequency, the nurse provides individual administrations. Confidence: 0.70
- When a nurse provides a pending administration and the count is still below the target frequency, auto-create the next pending administration. Confidence: 0.70
- Never modify past administrations — for significant dose changes, stop the old medication order and create a new one instead. Confidence: 0.75
- Before deleting a source file, grep the codebase for all references to it to confirm it is truly dead code — only delete when zero imports or references remain. Confidence: 0.75
