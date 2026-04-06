/**
 * Artifact type classifications supported by the Cerebro catalog format.
 *
 * MVP-supported types: 'skill', 'instruction'
 * All other types are valid in the catalog but the installer treats them as
 * unsupported until a future release adds handling for them.
 */
export type ArtifactType =
  | 'skill'         // agentskills.io folder unit (SKILL.md + optional supporting files)
  | 'instruction'   // .instructions.md file
  | 'prompt'        // reusable slash-command / prompt file (future)
  | 'agent'         // custom agent definition (future — spec still in flux)
  | 'hook'          // lifecycle hook (future)
  | 'mcp-server'    // Model Context Protocol server config (future)
  | 'snippet'       // code/text snippet (future)
  | 'workflow'      // multi-step workflow definition (future)
  | 'other';        // catch-all for unclassified artifacts

/**
 * AI tools / standards that Cerebro can install artifacts into.
 *
 * MVP-supported targets: 'agents', 'claude-code', 'copilot'
 * Remaining targets are recognised in the catalog but the installer will
 * skip them until a future release adds support.
 *
 * Note: 'copilot' covers GitHub Copilot across all host IDEs
 * (VS Code, Visual Studio, IntelliJ) — install paths are Copilot-specific,
 * not IDE-specific.
 */
export type ToolId =
  | 'agents'          // .agents standard (tool-agnostic, AGENTS-1 spec)
  | 'claude-code'     // Anthropic Claude Code CLI
  | 'copilot'         // GitHub Copilot (VS Code, Visual Studio, IntelliJ)
  | 'cursor'          // Cursor (future)
  | 'windsurf'        // Windsurf (future)
  | 'opencode';       // OpenCode (future)

/**
 * Installation scope.
 * - 'workspace': installs relative to the current project root
 * - 'user': installs relative to the user's home/config directory
 *
 * Scope is chosen by the user at install time; it is not declared in the
 * catalog. Install paths for each scope are defined in Cerebro's config.
 */
export type Scope = 'workspace' | 'user';

/**
 * A single installable artifact in a Cerebro catalog.
 */
export interface Artifact {
  /**
   * Unique lowercase slug identifier within this catalog.
   * Pattern: a-z, 0-9, hyphens; cannot start or end with a hyphen.
   * Example: 'git-commit-assistant'
   */
  id: string;

  /** Human-readable display name. Example: 'Git Commit Assistant' */
  name: string;

  /** Short description shown in the item list. */
  description?: string;

  /** Artifact type classification. */
  type: ArtifactType;

  /**
   * Path to the artifact's root folder or file within the source repository.
   * For skills: path to the folder containing SKILL.md.
   * For instructions: path to the .instructions.md file.
   * Must be a relative path; must not contain '..' or begin with '/'.
   * Example: 'skills/git-commit-assistant/' or 'instructions/python.instructions.md'
   */
  source: string;

  /**
   * Tools this artifact is compatible with.
   * If omitted, the artifact is assumed compatible with all supported targets.
   * Cerebro will only install to targets present in both this list and the
   * user's selected target.
   */
  supports?: ToolId[];

  /** Optional metadata tags for filtering and discovery. */
  tags?: string[];
}

/**
 * A named collection of artifacts that can be installed together in one operation.
 */
export interface ArtifactSet {
  /** Unique lowercase slug identifier. */
  id: string;

  /** Human-readable display name. */
  name: string;

  /** Optional description of what this set includes and why. */
  description?: string;

  /** List of artifact IDs from this catalog's 'artifacts' array. */
  artifacts: string[];
}

/**
 * The top-level structure of a cerebro-catalog.yaml file.
 */
export interface CerebroCatalog {
  /** Schema version. Must be '1'. */
  cerebro: '1';

  /** Optional display name for this catalog or repository. */
  name?: string;

  /** Optional description of this catalog. */
  description?: string;

  /** List of installable artifacts in this catalog. */
  artifacts: Artifact[];

  /** Optional named collections of artifacts. */
  sets?: ArtifactSet[];
}
