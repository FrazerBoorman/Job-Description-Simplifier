# Test Suite for Job Description Simplifier

This test suite provides comprehensive coverage for the Job Description Simplifier application, with a focus on the recent changes that added toggle functionality for the advanced date range section.

## Test Files

### 1. `toggleAdvancedRange.test.js`
Tests for the `toggleAdvancedRange()` function that was added to show/hide the advanced date range section.

**Coverage:**
- Happy path scenarios (showing/hiding the section)
- Edge cases (missing elements, multiple classes)
- State consistency (CSS classes, open attribute, button text)
- DOM integration with details element
- Accessibility considerations

### 2. `copyFullPageHtml.test.js`
Tests for the `copyFullPageHtml()` function, which was modified to include debug logging for the fallback clipboard path.

**Coverage:**
- Clipboard API success paths (ClipboardItem, writeText)
- Fallback clipboard path with execCommand
- HTML source retrieval (fetch and fallback)
- Edge cases (clipboard failures, empty content, large content)
- Blob creation and MIME types

### 3. `debugLog.test.js`
Tests for logging functions including `debugLog()`, `setStatus()`, and `setAiStatus()`.

**Coverage:**
- Basic logging functionality
- Data serialization (JSON, circular references, non-serializable objects)
- Edge cases (missing elements, special characters, Unicode)
- Scroll behavior
- Integration with application events

### 4. `dateRangeFunctions.test.js`
Tests for date range functions that interact with the advanced date range section.

**Coverage:**
- `setDefaultDateRangeInputs()`: Setting default dates (14 days ago to today)
- `getDateRangeOrDefault()`: Retrieving and validating date ranges
- Date format validation
- Edge cases (missing elements, invalid dates, future/past dates)
- Timezone handling

### 5. `integration.test.js`
Integration tests that verify the complete workflow of the advanced date range toggle functionality.

**Coverage:**
- Initial state verification
- User workflows (show, configure, hide, apply)
- Validation during workflow
- CSS class management
- Accessibility features
- Multiple toggle cycles
- Page load simulation

## Running the Tests

### Prerequisites
```bash
npm install
```

### Run all tests
```bash
npm test
```

### Run tests in watch mode
```bash
npm test:watch
```

### Run tests with coverage
```bash
npm test:coverage
```

### Run specific test file
```bash
npm test toggleAdvancedRange.test.js
```

## Test Framework

- **Jest**: Main testing framework
- **jsdom**: DOM implementation for Node.js
- **@testing-library/jest-dom**: Additional matchers for DOM testing

## Coverage Focus

The test suite focuses on the recent changes:
1. New `toggleAdvancedRange()` function
2. Hidden class functionality for show/hide behavior
3. Debug logging enhancement for fallback clipboard path
4. Integration of toggle button with existing date range functionality

## Best Practices

- **Isolation**: Each test is independent and doesn't rely on others
- **Cleanup**: `afterEach` hooks ensure DOM is cleaned up between tests
- **Edge Cases**: Comprehensive coverage of failure modes and boundary conditions
- **Readability**: Descriptive test names that explain what is being tested
- **Maintainability**: Tests organized by functionality and scenario type

## Test Structure

Each test file follows this structure:
```javascript
describe('Feature/Function Name', () => {
  beforeEach(() => {
    // Setup DOM and mocks
  });

  afterEach(() => {
    // Cleanup
  });

  describe('Category (e.g., Happy Path, Edge Cases)', () => {
    test('should do something specific', () => {
      // Arrange, Act, Assert
    });
  });
});
```

## Recent Changes Tested

The test suite covers all changes from the recent commit:
- Addition of `.hidden { display:none; }` CSS class
- Toggle button for advanced date range
- `toggleAdvancedRange()` function implementation
- Event listener setup for toggle button
- Debug logging for fallback clipboard path

## Future Enhancements

Potential areas for additional testing:
- Google Calendar API integration (with mocked responses)
- OpenAI API integration (with mocked responses)
- Event selection and population
- Form validation
- Error handling for network failures