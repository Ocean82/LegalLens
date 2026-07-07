# Contributing to LegalLens

Thank you for your interest in contributing! LegalLens exists to make legal research accessible to everyone, and we're grateful for any help.

## Getting Started

1. Fork the repo and clone your fork
2. Run `npm install` to install dependencies
3. Copy `.env.example` to `.env.local` and add your database URL
4. Run `npx drizzle-kit push` to set up your database
5. Run `npm run dev` to start the development server
6. Click "Try Demo Account" to seed test data

## Development Guidelines

### Code Style

- TypeScript strict mode
- Use the existing patterns in the codebase
- Run `npm run lint` and `npm run typecheck` before submitting

### Commit Messages

Use clear, descriptive commit messages:
- `feat: add citation graph visualization`
- `fix: resolve search pagination bug`
- `docs: update API documentation`
- `refactor: simplify auth middleware`

### Pull Requests

- Keep PRs focused on a single change
- Include a clear description of what and why
- Add screenshots for UI changes
- Make sure lint and typecheck pass

## Reporting Issues

- Check existing issues first to avoid duplicates
- Use issue templates when available
- Include steps to reproduce for bugs
- Be specific about expected vs actual behavior

## Code of Conduct

Be respectful, constructive, and inclusive. We're building something to help people — let's keep the community welcoming.

## Questions?

Open a discussion or reach out via issues. No question is too basic.
