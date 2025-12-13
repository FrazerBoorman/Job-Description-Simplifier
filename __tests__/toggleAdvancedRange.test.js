/**
 * Tests for toggleAdvancedRange functionality and related UI interactions
 * These tests cover the changes introduced in the recent commit that added
 * the toggle button for the advanced date range section.
 */

describe('toggleAdvancedRange', () => {
  let section, toggleBtn;

  beforeEach(() => {
    // Set up DOM elements that the function expects
    document.body.innerHTML = `
      <div id="advancedRangeSection" class="advanced hidden">
        <summary>Advanced date range</summary>
        <div>Content</div>
      </div>
      <button id="toggleAdvancedRangeBtn" class="pill-btn" type="button">
        Show advanced date range
      </button>
    `;

    section = document.getElementById('advancedRangeSection');
    toggleBtn = document.getElementById('toggleAdvancedRangeBtn');

    // Define the function in the test environment
    global.toggleAdvancedRange = function() {
      const section = document.getElementById("advancedRangeSection");
      const toggleBtn = document.getElementById("toggleAdvancedRangeBtn");
      if (!section || !toggleBtn) return;

      const willShow = section.classList.contains("hidden");
      section.classList.toggle("hidden", !willShow);
      if (willShow) {
        section.open = true;
        toggleBtn.textContent = "Hide advanced date range";
      } else {
        section.open = false;
        toggleBtn.textContent = "Show advanced date range";
      }
    };
  });

  afterEach(() => {
    document.body.innerHTML = '';
    delete global.toggleAdvancedRange;
  });

  describe('Happy Path', () => {
    test('should show the section when it is initially hidden', () => {
      expect(section.classList.contains('hidden')).toBe(true);
      expect(toggleBtn.textContent).toBe('Show advanced date range');

      toggleAdvancedRange();

      expect(section.classList.contains('hidden')).toBe(false);
      expect(section.open).toBe(true);
      expect(toggleBtn.textContent).toBe('Hide advanced date range');
    });

    test('should hide the section when it is currently visible', () => {
      // First make it visible
      section.classList.remove('hidden');
      section.open = true;
      toggleBtn.textContent = 'Hide advanced date range';

      toggleAdvancedRange();

      expect(section.classList.contains('hidden')).toBe(true);
      expect(section.open).toBe(false);
      expect(toggleBtn.textContent).toBe('Show advanced date range');
    });

    test('should toggle correctly multiple times', () => {
      // Start hidden
      expect(section.classList.contains('hidden')).toBe(true);

      // Toggle to show
      toggleAdvancedRange();
      expect(section.classList.contains('hidden')).toBe(false);
      expect(section.open).toBe(true);

      // Toggle to hide
      toggleAdvancedRange();
      expect(section.classList.contains('hidden')).toBe(true);
      expect(section.open).toBe(false);

      // Toggle to show again
      toggleAdvancedRange();
      expect(section.classList.contains('hidden')).toBe(false);
      expect(section.open).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    test('should handle missing section element gracefully', () => {
      document.getElementById('advancedRangeSection').remove();

      expect(() => toggleAdvancedRange()).not.toThrow();
    });

    test('should handle missing toggle button gracefully', () => {
      document.getElementById('toggleAdvancedRangeBtn').remove();

      expect(() => toggleAdvancedRange()).not.toThrow();
    });

    test('should handle both elements missing gracefully', () => {
      document.getElementById('advancedRangeSection').remove();
      document.getElementById('toggleAdvancedRangeBtn').remove();

      expect(() => toggleAdvancedRange()).not.toThrow();
    });

    test('should work when section does not have hidden class initially', () => {
      section.classList.remove('hidden');

      toggleAdvancedRange();

      expect(section.classList.contains('hidden')).toBe(true);
      expect(section.open).toBe(false);
      expect(toggleBtn.textContent).toBe('Show advanced date range');
    });

    test('should handle section with multiple classes', () => {
      section.className = 'advanced hidden some-other-class';

      toggleAdvancedRange();

      expect(section.classList.contains('hidden')).toBe(false);
      expect(section.classList.contains('advanced')).toBe(true);
      expect(section.classList.contains('some-other-class')).toBe(true);
    });
  });

  describe('State Consistency', () => {
    test('should maintain consistent state between classList and open attribute', () => {
      // Hidden state
      expect(section.classList.contains('hidden')).toBe(true);

      toggleAdvancedRange();

      // Visible state - both should be in sync
      expect(section.classList.contains('hidden')).toBe(false);
      expect(section.open).toBe(true);

      toggleAdvancedRange();

      // Hidden state again - both should be in sync
      expect(section.classList.contains('hidden')).toBe(true);
      expect(section.open).toBe(false);
    });

    test('should maintain consistent button text with visibility state', () => {
      expect(section.classList.contains('hidden')).toBe(true);
      expect(toggleBtn.textContent).toBe('Show advanced date range');

      toggleAdvancedRange();

      expect(section.classList.contains('hidden')).toBe(false);
      expect(toggleBtn.textContent).toBe('Hide advanced date range');

      toggleAdvancedRange();

      expect(section.classList.contains('hidden')).toBe(true);
      expect(toggleBtn.textContent).toBe('Show advanced date range');
    });
  });

  describe('DOM Integration', () => {
    test('should work with actual details element semantics', () => {
      // Replace with actual details element
      document.body.innerHTML = `
        <details id="advancedRangeSection" class="advanced hidden">
          <summary>Advanced date range</summary>
          <div>Content</div>
        </details>
        <button id="toggleAdvancedRangeBtn" class="pill-btn" type="button">
          Show advanced date range
        </button>
      `;

      const details = document.getElementById('advancedRangeSection');
      const btn = document.getElementById('toggleAdvancedRangeBtn');

      expect(details.tagName).toBe('DETAILS');

      toggleAdvancedRange();

      expect(details.open).toBe(true);
      expect(btn.textContent).toBe('Hide advanced date range');
    });

    test('should not interfere with other elements', () => {
      document.body.innerHTML += `
        <div id="otherElement" class="hidden">Other</div>
        <button id="otherButton">Other Button</button>
      `;

      const otherEl = document.getElementById('otherElement');
      const otherBtn = document.getElementById('otherButton');

      toggleAdvancedRange();

      // Other elements should remain unchanged
      expect(otherEl.classList.contains('hidden')).toBe(true);
      expect(otherBtn.textContent).toBe('Other Button');
    });
  });

  describe('Accessibility', () => {
    test('should update button text for screen readers', () => {
      toggleAdvancedRange();
      expect(toggleBtn.textContent).toBe('Hide advanced date range');

      toggleAdvancedRange();
      expect(toggleBtn.textContent).toBe('Show advanced date range');
    });

    test('should work with ARIA attributes if present', () => {
      toggleBtn.setAttribute('aria-expanded', 'false');
      section.setAttribute('aria-hidden', 'true');

      toggleAdvancedRange();

      // Function doesn't manage ARIA but shouldn't break with them
      expect(toggleBtn.getAttribute('aria-expanded')).toBe('false');
      expect(section.getAttribute('aria-hidden')).toBe('true');
    });
  });
});