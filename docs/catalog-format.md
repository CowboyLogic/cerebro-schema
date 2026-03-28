# Cerebro Catalog Format

`cerebro-catalog.yaml` is the standard registry format for the Cerebro suite of tools. A catalog file placed at the root of a GitHub repository allows any Cerebro tool (CLI, VS Code extension, Visual Studio extension, IntelliJ plugin) to discover and install the artifacts it contains.

---

## File Name

```
cerebro-catalog.yaml
```

Cerebro tools also accept `cerebro-catalog.yml` as a fallback.

---

## Top-Level Structure

```yaml
cerebro: "1"                        # required — schema version
name: My AI Skills                  # optional — display name for this catalog
description: A collection of ...    # optional — shown in source listings

artifacts:                          # required — list of installable artifacts
  - ...

sets:                               # optional — named bundles of artifacts
  - ...
```

| Field | Required | Description |
|---|---|---|
| `cerebro` | Yes | Schema version. Must be `"1"`. |
| `name` | No | Display name for the catalog. Shown in the source list. |
| `description` | No | Short description of the catalog. Max 500 chars. |
| `artifacts` | Yes | Array of artifact definitions. |
| `sets` | No | Array of named artifact sets (bundles). |

---

## Artifacts

Each entry in `artifacts` describes one installable artifact.

```yaml
artifacts:
  - id: skill-creator
    name: Skill Creator
    description: A Claude Code skill for creating new skills from templates.
    type: skill
    tags: [skill-creation, meta, claude-code]
    compatibility:
      - tool: claude-code
        scope: [workspace, global]
        files:
          - source: docs/skills/skill-creator
            target: .claude/skills/skill-creator
```

| Field | Required | Description |
|---|---|---|
| `id` | Yes | Unique slug identifier. Lowercase, hyphens only. Example: `skill-creator`. |
| `name` | Yes | Display name. Max 100 chars. |
| `description` | No | Short description for search results. Max 500 chars. |
| `type` | Yes | Artifact type. See [Types](#artifact-types). |
| `tags` | No | Array of strings for filtering and discovery. |
| `compatibility` | Yes | One or more tool+scope+files entries. See [Compatibility](#compatibility). |

### Artifact Types

| Value | Description |
|---|---|
| `skill` | Claude Code skill (typically includes a `SKILL.md` marker) |
| `agent` | Multi-step agent definition |
| `prompt` | Reusable prompt template |
| `instruction` | IDE-specific instruction file (e.g. `CLAUDE.md`, `copilot-instructions.md`) |
| `snippet` | Code snippet collection |
| `workflow` | Automation step sequence |
| `mcp-server` | MCP server configuration or implementation |
| `hook` | Claude Code hook script |
| `other` | Anything that doesn't fit the above categories |

---

## Compatibility

Each `compatibility` entry maps a tool and set of scopes to the files that should be installed.

```yaml
compatibility:
  - tool: claude-code
    scope: [workspace, global]
    files:
      - source: docs/skills/skill-creator
        target: .claude/skills/skill-creator
  - tool: copilot
    scope: [workspace]
    files:
      - source: docs/copilot/skill-creator.md
        target: .github/copilot/skill-creator.md
```

| Field | Required | Description |
|---|---|---|
| `tool` | Yes | Target AI tool. See [Tools](#tools). |
| `scope` | Yes | Array of supported scopes: `workspace`, `global`, or both. |
| `files` | Yes | One or more source→target file mappings. |

### Tools

| Value | Tool |
|---|---|
| `copilot` | GitHub Copilot |
| `claude-code` | Claude Code |
| `opencode` | Opencode |
| `visual-studio` | Visual Studio |
| `intellij` | IntelliJ IDEA (and other JetBrains IDEs) |

### Scopes

| Value | Meaning |
|---|---|
| `workspace` | Installs relative to the current project/workspace root |
| `global` | Installs relative to the user's home directory |

### Files

Each file entry maps a source path in the repository to a target path on the user's machine.

```yaml
files:
  - source: docs/skills/skill-creator    # directory — full subtree is mirrored
    target: .claude/skills/skill-creator
  - source: docs/skills/utils.py         # single file
    target: .claude/skills/utils.py
```

| Field | Required | Description |
|---|---|---|
| `source` | Yes | Path to a file or directory within this repository. If a directory, the full subtree is mirrored to `target`. |
| `target` | Yes | Relative install path. For `workspace` scope: relative to workspace root. For `global` scope: relative to user home directory. Must not contain `..` or begin with `/`. |

**Directory mirroring:** If `source` points to a directory, all files and subdirectories are recursively copied to `target`, preserving structure.

---

## Sets

Sets are named bundles of artifacts that can be installed together in a single operation.

```yaml
sets:
  - id: dev-essentials
    name: Dev Essentials
    description: A curated starter pack for Claude Code development.
    artifacts:
      - skill-creator
      - code-reviewer
      - pr-drafter
```

| Field | Required | Description |
|---|---|---|
| `id` | Yes | Unique slug identifier. Lowercase, hyphens only. |
| `name` | Yes | Display name. Max 100 chars. |
| `description` | No | What this set includes and why. Max 500 chars. |
| `artifacts` | Yes | List of artifact `id` values from this catalog's `artifacts` array. |

> **Note:** Sets reference artifacts within the same catalog only. Cross-catalog sets are not supported in v1.

---

## Complete Example

```yaml
cerebro: "1"
name: CowboyLogic AI Skills
description: A curated collection of Claude Code skills for AI-assisted development.

artifacts:
  - id: skill-creator
    name: Skill Creator
    description: Create new Claude Code skills from templates with built-in validation.
    type: skill
    tags: [skill-creation, meta, productivity]
    compatibility:
      - tool: claude-code
        scope: [workspace, global]
        files:
          - source: docs/skills/skill-creator
            target: .claude/skills/skill-creator

  - id: pr-drafter
    name: PR Drafter
    description: Drafts pull request descriptions from git diff output.
    type: skill
    tags: [git, productivity]
    compatibility:
      - tool: claude-code
        scope: [workspace]
        files:
          - source: docs/skills/pr-drafter
            target: .claude/skills/pr-drafter
      - tool: copilot
        scope: [workspace]
        files:
          - source: docs/copilot/pr-drafter.md
            target: .github/copilot/pr-drafter.md

sets:
  - id: dev-essentials
    name: Dev Essentials
    description: The minimum set of skills for productive AI-assisted development.
    artifacts:
      - skill-creator
      - pr-drafter
```

---

## Validation

A JSON Schema for `cerebro-catalog.yaml` is available at:

```
schema/cerebro-catalog.schema.json
```

You can wire it up in VS Code by adding a YAML language server association, or validate programmatically using `ajv` or any JSON Schema v7 validator (js-yaml produces the same object structure as JSON parsing).
