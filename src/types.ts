/**
 * Artifact type classifications supported by the Cerebro catalog format.
 */
export type ArtifactType =
  | 'skill'
  | 'agent'
  | 'prompt'
  | 'instruction'
  | 'snippet'
  | 'workflow'
  | 'mcp-server'
  | 'hook'
  | 'other';

/**
 * AI tools that Cerebro can install artifacts into.
 */
export type ToolId =
  | 'copilot'
  | 'claude-code'
  | 'opencode'
  | 'visual-studio'
  | 'intellij';

/**
 * Installation scope.
 * - 'workspace': installs relative to the current project/workspace root
 * - 'global': installs relative to the user's home directory
 */
export type Scope = 'workspace' | 'global';

/**
 * A single source → target file mapping within a compatibility entry.
 */
export interface ArtifactFile {
  /** Path to the file or directory within the source repository. */
  source: string;
  /**
   * Relative install path on the user's machine.
   * For workspace scope: relative to workspace root.
   * For global scope: relative to user home directory.
   * Must not contain '..' or begin with '/'.
   */
  target: string;
}

/**
 * Describes how an artifact installs for a specific tool and set of scopes.
 */
export interface CompatibilityEntry {
  /** The AI tool this entry targets. */
  tool: ToolId;
  /** One or more supported installation scopes. */
  scope: Scope[];
  /** Files or directories to install for this tool+scope combination. */
  files: ArtifactFile[];
}

/**
 * A single installable artifact in a Cerebro catalog.
 */
export interface Artifact {
  /** Unique lowercase slug identifier within this catalog. Example: 'skill-creator'. */
  id: string;
  /** Human-readable display name. */
  name: string;
  /** Short description shown in search results. */
  description?: string;
  /** Artifact type classification. */
  type: ArtifactType;
  /** Optional metadata tags for filtering and discovery. */
  tags?: string[];
  /** One or more tool+scope+files entries describing where and how this artifact installs. */
  compatibility: CompatibilityEntry[];
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
