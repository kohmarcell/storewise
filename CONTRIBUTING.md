# Contributing to StoreWise

Thank you for your interest in contributing to StoreWise! This document provides guidelines and information about contributing to this project.

## 🤝 How to Contribute

### Reporting Bugs

- Use the [issue tracker](https://github.com/yourusername/storewise/issues) to report bugs
- Search existing issues before creating a new one
- Include detailed information about the bug
- Provide steps to reproduce the issue
- Include screenshots if applicable

### Suggesting Features

- Use the [issue tracker](https://github.com/yourusername/storewise/issues) to suggest features
- Provide a clear description of the feature
- Explain why the feature would be useful
- Consider including mockups or examples

### Code Contributions

1. **Fork the repository**
   ```bash
   git clone https://github.com/yourusername/storewise.git
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow the existing code style
   - Add tests for new functionality
   - Update documentation if needed

4. **Test your changes**
   ```bash
   npm run test
   npm run lint
   npm run type-check
   ```

5. **Commit your changes**
   ```bash
   git commit -m "feat: add your feature description"
   ```

6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create a Pull Request**
   - Provide a clear description of your changes
   - Link to any related issues
   - Include screenshots if applicable

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+
- npm
- Git

### Installation

1. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/storewise.git
   cd storewise
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment:
   ```bash
   cp .env.example .env
   ```

4. Set up database:
   ```bash
   npm run db:setup
   ```

5. Start development servers:
   ```bash
   npm run dev
   ```

## 📝 Code Standards

### TypeScript
- All code must be written in TypeScript
- Use proper type annotations
- Avoid using `any` type

### Code Style
- Follow ESLint configuration
- Use Prettier for formatting
- Use meaningful variable and function names
- Keep functions small and focused

### Commit Messages
Use [conventional commits](https://www.conventionalcommits.org/) format:

```
type(scope): description

feat: add new feature
fix: fix bug
docs: update documentation
style: code style changes
refactor: code refactoring
test: add or update tests
chore: maintenance tasks
```

## 📁 Project Structure

- `apps/web/` - Frontend React application
- `apps/api/` - Backend Express application
- `docs/` - Documentation files
- `packages/` - Shared packages

## 🧪 Testing

### Running Tests
```bash
npm run test          # Run all tests
npm run test:web      # Run frontend tests
npm run test:api      # Run backend tests
npm run test:watch    # Run tests in watch mode
```

### Writing Tests
- Write unit tests for new functions
- Write integration tests for API endpoints
- Test edge cases and error scenarios
- Keep tests simple and focused

## 🚀 Deployment

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm run start
```

## 📖 Documentation

- Keep documentation up to date
- Document new features
- Update API documentation
- Include code examples

## 💡 Tips

- Start with small contributions
- Read the existing code to understand patterns
- Ask questions if you're unsure about something
- Be patient with the review process

## 📞 Getting Help

- Create an issue for questions
- Start a discussion in GitHub Discussions
- Check the documentation first

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to StoreWise! 🎉