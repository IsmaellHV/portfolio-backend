# Contributing to Portfolio Backend

Thank you for your interest in contributing to this project! We welcome contributions from the community and are grateful for your help in making this project better.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Coding Standards](#coding-standards)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)
- [Documentation](#documentation)
- [Getting Help](#getting-help)

## Code of Conduct

This project adheres to a code of conduct that ensures a welcoming and inclusive environment for everyone. By participating in this project, you are expected to uphold this code.

### Our Pledge

We are committed to making participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards

Examples of behavior that contributes to creating a positive environment include:

- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to see if the problem has already been reported. When creating a bug report, please include:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples to demonstrate the steps**
- **Describe the behavior you observed after following the steps**
- **Explain which behavior you expected to see instead and why**
- **Include details about your configuration and environment**

### Suggesting Enhancements

Enhancement suggestions are welcome! When creating an enhancement suggestion, please include:

- **Use a clear and descriptive title**
- **Provide a step-by-step description of the suggested enhancement**
- **Provide specific examples to demonstrate the steps**
- **Describe the current behavior and explain which behavior you expected to see instead**
- **Explain why this enhancement would be useful**

### Pull Requests

We actively welcome your pull requests:

1. Fork the repository
2. Create a new branch from `main`
3. Make your changes
4. Add tests for your changes
5. Ensure all tests pass
6. Make sure your code follows the project's coding standards
7. Submit a pull request

## Development Setup

### Prerequisites

- Node.js (version 18 or higher)
- npm or pnpm
- MongoDB (for local development)
- Git

### Installation

#### Fork and clone the repository

```bash
git clone https://github.com/[your-username]/portfolio-backend.git
cd portfolio-backend
```

#### Install dependencies

```bash
npm install
# or
pnpm install
```

#### Set up environment variables

```bash
cp .env.example .env
```

#### Configure your local environment variables in `.env`

#### Start the development server

```bash
npm run start
```

## Making Changes

### Branch Naming

Use descriptive branch names that indicate the type of change:

- `feature/add-user-authentication`
- `fix/cors-configuration`
- `docs/update-readme`
- `refactor/database-connection`

### Development Workflow

1. Create a new branch for your feature or fix
2. Make your changes
3. Write or update tests as needed
4. Run the test suite to ensure everything passes
5. Run the linter to check code style
6. Commit your changes with a clear message
7. Push to your fork and submit a pull request

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Follow the existing code style and patterns
- Use meaningful variable and function names
- Add proper type annotations
- Avoid using `any` type when possible

### Code Style

- Use 2 spaces for indentation
- Use single quotes for strings
- Add semicolons at the end of statements
- Use trailing commas in objects and arrays
- Keep lines under 100 characters when possible

### ESLint and Prettier

This project uses ESLint for linting and Prettier for code formatting:

```bash
npm run lint        # Check for linting errors
npm run lint:fix    # Fix linting errors automatically
npm run format      # Format code with Prettier
```

## Commit Messages

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```text
type(scope): description

[optional body]

[optional footer]
```

### Types

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools

### Examples

```text
feat(auth): add JWT authentication middleware
fix(cors): resolve cross-origin request issues
docs(readme): update installation instructions
test(user): add unit tests for user service
```

## Pull Request Process

1. **Update documentation**: Ensure any new features or changes are documented
2. **Add tests**: Include appropriate tests for your changes
3. **Update version**: If applicable, update version numbers
4. **Describe your changes**: Provide a clear description of what your PR does
5. **Link issues**: Reference any related issues in your PR description
6. **Request review**: Wait for at least one maintainer to review your PR

### Pull Request Template

When submitting a pull request, please use this template:

```markdown
## Description

Brief description of what this PR does

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing

- [ ] Tests pass locally
- [ ] Added tests for new functionality
- [ ] Manual testing completed

## Checklist

- [ ] Code follows the project's style guidelines
- [ ] Self-review of code completed
- [ ] Code is commented where necessary
- [ ] Documentation updated if needed
```

## Testing

### Running Tests

```bash
npm test              # Run all tests
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
```

### Writing Tests

- Write tests for all new functionality
- Use descriptive test names
- Follow the existing test patterns
- Aim for good test coverage
- Test both success and error scenarios

### Test Structure

```typescript
describe('Component/Function Name', () => {
  beforeEach(() => {
    // Setup code
  });

  describe('when condition', () => {
    it('should do something', () => {
      // Test implementation
    });
  });
});
```

## Documentation

### API Documentation

- Document all new API endpoints
- Include request/response examples
- Specify required parameters and types
- Document error responses

### Code Documentation

- Add JSDoc comments for public functions
- Document complex algorithms or business logic
- Keep comments up to date with code changes
- Use clear and concise language

## Getting Help

If you need help with your contribution:

1. Check the existing documentation
2. Look at similar implementations in the codebase
3. Create an issue for discussion
4. Reach out to the maintainers

### Contact

- **Email**: [ismaelhv@outlook.com](mailto:ismaelhv@outlook.com)
- **GitHub Issues**: Use the issue tracker for questions and discussions
- **LinkedIn**: [linkedin.com/in/ihurtadov](https://www.linkedin.com/in/ihurtadov/)

## Recognition

Contributors will be recognized in the project's README and release notes. We appreciate all contributions, whether they're bug fixes, new features, documentation improvements, or other enhancements.

---

Thank you for contributing to the Portfolio Backend project! Your efforts help make this project better for everyone.
