---
agent: 'agent'
model: 'Claude Sonnet 4.5'
tools:
  ['vscode', 'execute', 'read', 'agent', 'edit', 'search', 'web', 'cognitionai/deepwiki/*', 'upstash/context7/*', 'shadcn-ui-server/*', 'updateUserPreferences', 'memory', 'askQuestions', 'todo']
description: 'Implement UI implementation using shadcn ui components'
---

1. Invoke the below shadcn-ui-server/list-blocks tool to get the list of available blocks.
2. Invoke the below shadcn-ui-server/list-components tool to get the list of available components.
3. Invoke the below shadcn-ui-server/get-block-docs tool to get the list of available block docs.
4. Invoke the below shadcn-ui-server/get-component-docs tool to get the list of available component docs.
5. Implement this ${input:code:Implementation_Plan.md}
6. Strictly follow the plan as mentioned in the Implementation_Plan.md as per the `.github/instructions/shad-cn.instructions.md` file.

**Not the code.**
