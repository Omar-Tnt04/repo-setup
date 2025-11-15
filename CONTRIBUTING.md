# 🤝 Contributing to Tunisian Top Freelancers

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

---

## 📋 Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Workflow](#development-workflow)
4. [Coding Standards](#coding-standards)
5. [Commit Guidelines](#commit-guidelines)
6. [Pull Request Process](#pull-request-process)
7. [Testing Requirements](#testing-requirements)
8. [Documentation](#documentation)

---

## 📜 Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inspiring community for all. Please be respectful and constructive in all interactions.

### Our Standards

**Positive behavior includes:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints
- Gracefully accepting constructive criticism
- Focusing on what is best for the community

**Unacceptable behavior includes:**
- Harassment of any kind
- Trolling or insulting comments
- Publishing others' private information
- Unprofessional conduct

---

## 🚀 Getting Started

### Prerequisites

- Node.js 16+
- MySQL 8+
- Git
- Code editor (VS Code recommended)

### Setup Development Environment

```powershell
# 1. Fork the repository on GitHub

# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/tunisian-top-freelancers.git
cd tunisian-top-freelancers

# 3. Add upstream remote
git remote add upstream https://github.com/ORIGINAL_OWNER/tunisian-top-freelancers.git

# 4. Install dependencies
.\setup.ps1

# 5. Configure environment
# Copy .env.example files and fill in your values

# 6. Setup database
npm run db:setup

# 7. Start development servers
npm run dev
```

---

## 🔄 Development Workflow

### 1. Create a Branch

```powershell
# Update your main branch
git checkout main
git pull upstream main

# Create a feature branch
git checkout -b feature/your-feature-name

# Or for bug fixes
git checkout -b fix/issue-description
```

### 2. Make Changes

- Write clean, readable code
- Follow existing code style
- Add comments for complex logic
- Update documentation if needed

### 3. Test Your Changes

```powershell
# Run tests
npm test

# Check linting
npm run lint

# Test manually
npm run dev
```

### 4. Commit Changes

```powershell
git add .
git commit -m "type: description"
```

See [Commit Guidelines](#commit-guidelines) for commit message format.

### 5. Push and Create PR

```powershell
# Push to your fork
git push origin feature/your-feature-name

# Create Pull Request on GitHub
# Compare: main ← your-branch
```

---

## 💻 Coding Standards

### Backend (Node.js)

**File Structure:**
```javascript
// controllers/exampleController.js
const asyncHandler = require('../middleware/asyncHandler');
const db = require('../config/db');

// @desc    Brief description
// @route   GET /api/example
// @access  Public/Private
exports.exampleFunction = asyncHandler(async (req, res) => {
  // Implementation
  res.json({ success: true, data: result });
});
```

**Best Practices:**
- Use `async/await` instead of callbacks
- Always use `asyncHandler` for async functions
- Validate input with `express-validator`
- Use parameterized queries (no string concatenation)
- Return consistent response format
- Handle errors with appropriate status codes

**Naming Conventions:**
- Files: `camelCase.js`
- Functions: `camelCase`
- Constants: `UPPER_SNAKE_CASE`
- Classes: `PascalCase`

### Frontend (React)

**Component Structure:**
```jsx
// components/ExampleComponent.jsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const ExampleComponent = ({ prop1, prop2 }) => {
  const { t } = useTranslation();
  const [state, setState] = useState(initialValue);

  // Event handlers
  const handleClick = () => {
    // Implementation
  };

  return (
    <div className="container">
      <h1>{t('example.title')}</h1>
      {/* JSX content */}
    </div>
  );
};

export default ExampleComponent;
```

**Best Practices:**
- Functional components with hooks
- Use `useTranslation` for all text
- Extract reusable components
- Keep components small and focused
- Use Tailwind utility classes
- Handle loading and error states
- Validate props with PropTypes or TypeScript

**Naming Conventions:**
- Components: `PascalCase.jsx`
- Hooks: `use` prefix (e.g., `useAuth`)
- Utilities: `camelCase.js`
- Constants: `UPPER_SNAKE_CASE`

### CSS/Tailwind

**Preferred:**
```jsx
<button className="btn-primary">
  Click Me
</button>
```

**Custom styles** (only when necessary):
```css
/* Define in index.css */
@layer components {
  .btn-custom {
    @apply px-4 py-2 bg-blue-500 text-white rounded;
  }
}
```

---

## 📝 Commit Guidelines

### Commit Message Format

```
type(scope): subject

body (optional)

footer (optional)
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring
- `test`: Add or update tests
- `chore`: Build process or auxiliary tool changes
- `perf`: Performance improvement

### Examples

```
feat(jobs): add pagination to job listing

- Implemented page query parameter
- Added pagination component
- Updated API to return total count

Closes #123
```

```
fix(auth): resolve token expiration issue

Fixed bug where expired tokens weren't being cleared from localStorage.
```

```
docs(readme): update installation instructions
```

---

## 🔍 Pull Request Process

### Before Submitting

- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] Tests added/updated
- [ ] All tests pass
- [ ] No linting errors
- [ ] Commits follow guidelines

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issue
Closes #(issue number)

## Testing
How to test these changes:
1. Step 1
2. Step 2
3. Expected result

## Screenshots (if applicable)
Add screenshots here

## Checklist
- [ ] Code follows project style
- [ ] Self-reviewed
- [ ] Commented complex code
- [ ] Updated documentation
- [ ] Tests pass
- [ ] No new warnings
```

### Review Process

1. **Automated checks** must pass
2. **At least one approval** required
3. **No unresolved conversations**
4. **Branch up to date** with main

### After Approval

- Maintainer will merge using "Squash and merge"
- Delete your branch after merge
- Update your local repository

---

## 🧪 Testing Requirements

### Backend Tests

```javascript
// tests/controllers/auth.test.js
const request = require('supertest');
const app = require('../../server');

describe('Auth Controller', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'Test@123',
          full_name: 'Test User',
          role: 'freelancer'
        });
      
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('token');
    });
  });
});
```

### Frontend Tests

```jsx
// components/__tests__/Button.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../Button';

describe('Button Component', () => {
  it('renders with correct text', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    fireEvent.click(screen.getByText('Click'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

---

## 📚 Documentation

### Code Comments

```javascript
/**
 * Calculate platform fee for a payment
 * @param {number} amount - Payment amount in cents
 * @returns {number} Platform fee (5% of amount)
 */
const calculatePlatformFee = (amount) => {
  return Math.round(amount * 0.05);
};
```

### API Documentation

Update `README.md` for new endpoints:

```markdown
### POST /api/example

Create a new example.

**Authentication:** Required

**Request Body:**
```json
{
  "field1": "value1",
  "field2": "value2"
}
```

**Success Response:** `201 Created`
```json
{
  "success": true,
  "data": { ... }
}
```

**Error Response:** `400 Bad Request`
```json
{
  "success": false,
  "message": "Validation error"
}
```
```

---

## 🏗️ Project-Specific Guidelines

### Database Changes

1. Update `backend/database/schema.sql`
2. Document changes in migration comments
3. Test on fresh database
4. Update seed data if needed

### Translation Updates

Add to all language files:

```json
// frontend/src/i18n/translations/en.json
{
  "newFeature": {
    "title": "English Title",
    "description": "English Description"
  }
}

// frontend/src/i18n/translations/fr.json
{
  "newFeature": {
    "title": "Titre Français",
    "description": "Description Française"
  }
}

// frontend/src/i18n/translations/ar.json
{
  "newFeature": {
    "title": "العنوان العربي",
    "description": "الوصف العربي"
  }
}
```

### Socket.io Events

Document new events in `QUICK_REFERENCE.md`:

```javascript
/**
 * Event: example:event
 * Description: What this event does
 * Payload: { field1, field2 }
 * Emitted to: Specific user/room
 */
```

---

## 🐛 Reporting Bugs

### Bug Report Template

```markdown
**Bug Description**
Clear description of the bug

**Steps to Reproduce**
1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior**
What should happen

**Actual Behavior**
What actually happens

**Screenshots**
If applicable

**Environment**
- OS: [e.g., Windows 10]
- Browser: [e.g., Chrome 98]
- Node.js version: [e.g., 16.14.0]

**Additional Context**
Any other relevant information
```

---

## 💡 Feature Requests

### Feature Request Template

```markdown
**Feature Description**
Clear description of the feature

**Problem It Solves**
What problem does this address?

**Proposed Solution**
How should it work?

**Alternatives Considered**
Other ways to solve this

**Additional Context**
Mockups, examples, etc.
```

---

## 📞 Questions?

- **General Questions**: Open a GitHub Discussion
- **Bug Reports**: Open a GitHub Issue
- **Security Issues**: Email security@tunisiantopfreelancers.com

---

## 🎉 Recognition

Contributors will be recognized in:
- README.md Contributors section
- Release notes
- Project website (when available)

---

**Thank you for contributing to Tunisian Top Freelancers! 🚀**
