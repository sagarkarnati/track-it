---
applyTo: '**'
description: AI Task Automation Instructions
---

# AI Task Automation Instructions

## Core Directive

Break down requirements into atomic tasks, execute sequentially, commit after each task completion.
use `Tasks_tracking.md`

## Task Breakdown Protocol

### Atomicity Rules

- One task = one commit = one deliverable
- Maximum 2-hour execution per task
- Independent, testable units only
- Clear acceptance criteria required

### Task Template

```
TASK-[ID]: [Action] [Component]
TYPE: setup|feature|fix|refactor|test|docs|config
PRIORITY: P0|P1|P2|P3
ESTIMATE: 30m|1h|2h
DEPENDS_ON: [Task-IDs]
ACCEPTANCE_CRITERIA:
- [ ] Specific deliverable
- [ ] Ready for commit
FILES: [affected files]
COMMIT: [type(scope): description]
```

## Git Commit Protocol

### Conventional Format

```
<type>(<scope>): <description>

<body explaining WHY>

Closes: TASK-[ID]
```

### Commit Types

- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code restructure
- `test`: Test additions
- `docs`: Documentation
- `config`: Configuration
- `setup`: Project setup

### Examples

```bash
feat(auth): implement login validation
fix(api): resolve null pointer in user service
refactor(utils): extract validation logic
test(auth): add login flow tests
```

## Agent Execution Rules

### MANDATORY

- ✅ Execute tasks in predetermined sequence
- ✅ Complete ALL acceptance criteria per task
- ✅ Make git commit after EVERY task
- ✅ Use conventional commit format
- ✅ Reference task ID in commit footer

### FORBIDDEN

- ❌ Skip or combine tasks
- ❌ Commit without completing criteria
- ❌ Generic commit messages
- ❌ Change task sequence without approval
- ❌ Modify multiple tasks in one commit

## Workflow

### Phase 1: Requirements Analysis

1. Parse requirements into components
2. Identify dependencies
3. Generate atomic task list
4. Pre-write commit messages

### Phase 2: Sequential Execution

1. Execute Task-001 → Complete → Commit
2. Execute Task-002 → Complete → Commit
3. Continue until all tasks complete
4. Validate final deliverable

### Phase 3: Quality Gates

**Per Task:**

- [ ] Acceptance criteria met
- [ ] No breaking changes
- [ ] Proper commit message
- [ ] Task ID referenced

## Task Examples

### Feature Implementation

```
TASK-001: Create login form component
TYPE: feature
ACCEPTANCE_CRITERIA:
- [ ] Build form with email/password fields
- [ ] Add client-side validation
- [ ] Apply design system styling
COMMIT: feat(auth): create login form with validation

TASK-002: Implement authentication service
TYPE: feature
ACCEPTANCE_CRITERIA:
- [ ] Integrate login API
- [ ] Handle JWT tokens
- [ ] Add error handling
COMMIT: feat(auth): implement authentication service

TASK-003: Add logout functionality
TYPE: feature
ACCEPTANCE_CRITERIA:
- [ ] Clear auth state on logout
- [ ] Redirect to login page
- [ ] Remove stored tokens
COMMIT: feat(auth): implement logout with state cleanup
```

### Bug Fix

```
TASK-004: Fix API 500 error
TYPE: fix
ACCEPTANCE_CRITERIA:
- [ ] Add null checks for user data
- [ ] Handle edge cases gracefully
- [ ] Verify fix with test cases
COMMIT: fix(api): resolve null pointer in user profile endpoint
```

## Error Handling

### Task Blocked

1. Document specific blocker
2. Identify root cause
3. Request guidance
4. Do NOT skip to next task

### Commit Failed

1. Resolve git conflicts
2. Verify file staging
3. Check commit message format
4. Retry with corrections

## Configuration

```json
{
  "taskExecution": {
    "enforceSequentialExecution": true,
    "requireCommitPerTask": true,
    "maxTaskDuration": "2h",
    "commitMessageFormat": "conventional"
  },
  "validation": {
    "taskAtomicity": true,
    "acceptanceCriteriaValidation": true,
    "conventionalCommits": true
  }
}
```

## Git Commands

```bash
# Stage all changes for current task
git add .

# Commit with conventional format
git commit -m "feat(auth): implement login validation

Add email and password validation with error handling
- Validate email format using regex
- Check password strength requirements
- Display appropriate error messages

Closes: TASK-001"

# Check commit history
git log --oneline

# Verify clean working directory
git status
```

## Success Metrics

- Task completion velocity
- Commit message quality
- Zero skipped tasks
- Clean git history
- Requirements fully implemented

---

**Remember: One task, one commit, one deliverable. No exceptions.**
