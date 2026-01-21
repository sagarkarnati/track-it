---
agent: 'Plan'
model: 'Claude Sonnet 4.5'
tools:
  ['vscode', 'execute', 'read', 'agent', 'edit', 'search', 'web', 'cognitionai/deepwiki/*', 'upstash/context7/*', 'shadcn-ui-server/*', 'updateUserPreferences', 'memory', 'askQuestions', 'todo']
description: 'Plan UI implementation using shadcn ui components'
---

### Strict Instructions in the same order

1. Please look at the ${input:code:ux_structure_file} and make an ui-implementation using shadcn ui as to what components will be used in the ui structure and where.
2. You should only write the name of the appropriate components, blocks and dashboards to be used.
3. Please ensure that the components are organized in a logical manner, reflecting the structure of the UI as described in the ux_structure_file.
4. Comprehensive Implementation Plan document that organizes the shadcn UI component mapping into a structured implementation guide and save to a file named `ui_implementation_plan.md` in the docs directory of the project.

**Not the code.**
