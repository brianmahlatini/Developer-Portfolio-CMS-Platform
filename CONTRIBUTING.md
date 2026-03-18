# Contributing to Developer Portfolio CMS Platform

First off, thanks for considering contributing! It's people like you that make this platform such a great tool.

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the issue list as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps which reproduce the problem**
- **Provide specific examples to demonstrate the steps**
- **Describe the behavior you observed after following the steps**
- **Explain which behavior you expected to see instead and why**
- **Include screenshots and animated GIFs if possible**
- **Include your OS and version, Node version, and Docker version**

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

- **Use a clear and descriptive title**
- **Provide a step-by-step description of the suggested enhancement**
- **Provide specific examples to demonstrate the steps**
- **Describe the current behavior and expected behavior**
- **Explain why this enhancement would be useful**

### Pull Requests

- Fill in the required template
- Follow the TypeScript styleguides
- Add tests when feasible
- Keep commits atomic and well-described
- Reference issues when applicable

## Development Setup

1. Fork the repository
2. Clone your fork locally
3. Create a feature branch (`git checkout -b feature/amazing-feature`)
4. Set up development environment:

```bash
npm install
cp .env.example .env
npm run db:push
npm run db:seed
npm run dev
```

## Styleguides

### Git Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Add feature" not "Adds feature")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line
- Format: `<type>(<scope>): <subject>`

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`

Examples:
- `feat(auth): add JWT token refresh mechanism`
- `fix(posts): correct slug generation for special characters`
- `docs(readme): update deployment instructions`

### TypeScript Style Guide

- Use `const` by default, `let` when needed, avoid `var`
- Use meaningful variable names
- Add type annotations for function parameters and return types
- Use interfaces for object types
- Use enums for string/number constants
- Use async/await over promise chains
- Add JSDoc comments for complex functions

```typescript
/**
 * Parse and validate request body
 * @param request - The incoming HTTP request
 * @param schema - Zod validation schema
 * @returns Parsed and validated data
 */
export async function parseBody<T>(
  request: Request,
  schema: z.ZodSchema<T>
): Promise<T> {
  // Implementation
}
```

### API Route Structure

```typescript
import { NextRequest } from "next/server";
import { createResponse, createErrorResponse, ApiError } from "@/lib/errors";

export async function GET(request: NextRequest) {
  try {
    // Implementation
    return createResponse(data);
  } catch (error) {
    return createErrorResponse(error as Error);
  }
}
```

### Component Structure

```typescript
import React from "react";

interface MyComponentProps {
  title: string;
  onAction?: () => void;
}

/**
 * MyComponent - Brief description
 */
export function MyComponent({ title, onAction }: MyComponentProps) {
  return (
    <div>
      {/* Implementation */}
    </div>
  );
}
```

## Testing

- Write tests for new features
- Ensure all tests pass before submitting PR
- Maintain or improve code coverage

```bash
npm run type-check    # TypeScript checking
npm run lint          # ESLint
npm run build         # Build check
```

## Documentation

- Update README.md if adding new features
- Add JSDoc comments to functions
- Update API documentation if changing endpoints
- Keep DEPLOYMENT.md updated with new requirements

## Issue Labels

- **bug**: Something isn't working
- **enhancement**: New feature or request
- **documentation**: Improvements or additions to documentation
- **good first issue**: Good for newcomers
- **help wanted**: Extra attention is needed
- **question**: Further information is requested
- **wontfix**: This will not be worked on

## Additional Notes

### Issue and Pull Request Labels

Feel free to add additional labels to issues and pull requests as needed.

### Project Structure

Be familiar with the project structure before contributing:

```
src/
├── app/api/        # API routes
├── components/     # React components
├── lib/           # Utilities and helpers
└── middleware.ts  # Next.js middleware
prisma/           # Database schema
.github/workflows/ # CI/CD pipelines
```

### Database Migrations

When modifying the schema:

1. Update `prisma/schema.prisma`
2. Run `npm run db:migrate`
3. Test thoroughly
4. Commit both schema and migration files

## Questions?

- Check existing issues and discussions
- Open a new issue with the question label
- Review the code comments and documentation

Thank you for contributing! 🎉
