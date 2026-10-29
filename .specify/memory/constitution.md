<!-- SYNC IMPACT REPORT
Version: 0.0.0 → 1.0.0 (MINOR: Initial constitution for new project)
New Principles: I. Simplicity, II. Correctness, III. Testability, IV. Incremental Enhancement
Added Sections: Development Standards
Ratified: 2026-10-29 | Last Amended: 2026-10-29
-->

# Raipur Constitution

A toy math calculator app governed by simplicity, accuracy, and incremental growth.

## Core Principles

### I. Simplicity

Start minimal, add features incrementally. Each component should have one clear purpose. Avoid over-engineering; complexity must be justified by concrete user requirements.

**Rationale**: Raipur begins with basic math operations. This principle ensures the codebase stays maintainable as new features are added later without accumulating unnecessary abstractions upfront.

### II. Correctness

Mathematical operations must produce accurate results. All calculations must be verified against expected outcomes; edge cases (division by zero, invalid inputs) must be handled explicitly.

**Rationale**: A calculator's primary function is correctness. Every operation is testable and verifiable, building user trust.

### III. Testability

Core calculation logic must be independently testable and decoupled from UI concerns. Test coverage must prioritize calculation accuracy over cosmetic features.

**Rationale**: Separating logic from UI enables confident refactoring and feature expansion without regression risk.

### IV. Incremental Enhancement

New features and UI refinements follow existing patterns established in the initial interface. Breaking changes to the calculation API require consensus and migration guidance.

**Rationale**: As "more things will be added," adhering to established conventions keeps the codebase predictable and reviewable.

## Development Standards

Code must pass linting and type checking before review. Tests must pass locally before submission to CI. UI changes must be smoke-tested in multiple screen sizes (mobile, tablet, desktop).

## Governance

Amendments to this constitution require written justification and must preserve the four core principles. The versioning scheme follows SemVer: MAJOR for principle removals/redefinitions, MINOR for new principles or feature categories, PATCH for clarifications.

**Version**: 1.0.0 | **Ratified**: 2026-10-29 | **Last Amended**: 2026-10-29
