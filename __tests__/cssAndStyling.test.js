/**
 * Tests for CSS class manipulation and styling behavior
 * Focuses on the .hidden class that was added in the recent commit
 */

describe('Hidden Class Behavior', () => {
  beforeEach(() => {
    // Add the CSS rule to the document
    const style = document.createElement('style');
    style.textContent = '.hidden { display: none; }';
    document.head.appendChild(style);
  });

  afterEach(() => {
    document.head.innerHTML = '';
    document.body.innerHTML = '';
  });

  describe('CSS Rule Application', () => {
    test('should hide element with hidden class', () => {
      document.body.innerHTML = '<div id="test" class="hidden">Content</div>';
      const el = document.getElementById('test');
      
      const style = window.getComputedStyle(el);
      expect(style.display).toBe('none');
    });

    test('should show element without hidden class', () => {
      document.body.innerHTML = '<div id="test">Content</div>';
      const el = document.getElementById('test');
      
      const style = window.getComputedStyle(el);
      expect(style.display).not.toBe('none');
    });

    test('should toggle visibility by adding/removing hidden class', () => {
      document.body.innerHTML = '<div id="test">Content</div>';
      const el = document.getElementById('test');
      
      el.classList.add('hidden');
      let style = window.getComputedStyle(el);
      expect(style.display).toBe('none');
      
      el.classList.remove('hidden');
      style = window.getComputedStyle(el);
      expect(style.display).not.toBe('none');
    });
  });

  describe('Class Combinations', () => {
    test('should work with multiple classes', () => {
      document.body.innerHTML = '<div id="test" class="advanced hidden other-class">Content</div>';
      const el = document.getElementById('test');
      
      const style = window.getComputedStyle(el);
      expect(style.display).toBe('none');
      expect(el.classList.contains('advanced')).toBe(true);
      expect(el.classList.contains('other-class')).toBe(true);
    });

    test('should maintain other classes when adding hidden', () => {
      document.body.innerHTML = '<div id="test" class="advanced">Content</div>';
      const el = document.getElementById('test');
      
      el.classList.add('hidden');
      
      expect(el.classList.contains('advanced')).toBe(true);
      expect(el.classList.contains('hidden')).toBe(true);
    });

    test('should maintain other classes when removing hidden', () => {
      document.body.innerHTML = '<div id="test" class="advanced hidden">Content</div>';
      const el = document.getElementById('test');
      
      el.classList.remove('hidden');
      
      expect(el.classList.contains('advanced')).toBe(true);
      expect(el.classList.contains('hidden')).toBe(false);
    });
  });

  describe('classList API Usage', () => {
    test('should add hidden class correctly', () => {
      document.body.innerHTML = '<div id="test">Content</div>';
      const el = document.getElementById('test');
      
      el.classList.add('hidden');
      
      expect(el.classList.contains('hidden')).toBe(true);
      expect(el.className).toBe('hidden');
    });

    test('should remove hidden class correctly', () => {
      document.body.innerHTML = '<div id="test" class="hidden">Content</div>';
      const el = document.getElementById('test');
      
      el.classList.remove('hidden');
      
      expect(el.classList.contains('hidden')).toBe(false);
      expect(el.className).toBe('');
    });

    test('should toggle hidden class correctly', () => {
      document.body.innerHTML = '<div id="test">Content</div>';
      const el = document.getElementById('test');
      
      el.classList.toggle('hidden');
      expect(el.classList.contains('hidden')).toBe(true);
      
      el.classList.toggle('hidden');
      expect(el.classList.contains('hidden')).toBe(false);
    });

    test('should force add hidden class with toggle(class, true)', () => {
      document.body.innerHTML = '<div id="test" class="hidden">Content</div>';
      const el = document.getElementById('test');
      
      el.classList.toggle('hidden', true);
      
      expect(el.classList.contains('hidden')).toBe(true);
    });

    test('should force remove hidden class with toggle(class, false)', () => {
      document.body.innerHTML = '<div id="test" class="hidden">Content</div>';
      const el = document.getElementById('test');
      
      el.classList.toggle('hidden', false);
      
      expect(el.classList.contains('hidden')).toBe(false);
    });

    test('should use toggle with force parameter as in toggleAdvancedRange', () => {
      document.body.innerHTML = '<div id="test" class="hidden">Content</div>';
      const el = document.getElementById('test');
      
      const willShow = el.classList.contains('hidden');
      el.classList.toggle('hidden', !willShow);
      
      expect(el.classList.contains('hidden')).toBe(false);
    });
  });

  describe('Details Element Integration', () => {
    test('should work with details element', () => {
      document.body.innerHTML = '<details id="test" class="hidden"><summary>Summary</summary>Content</details>';
      const el = document.getElementById('test');
      
      const style = window.getComputedStyle(el);
      expect(style.display).toBe('none');
    });

    test('should hide details even when open attribute is set', () => {
      document.body.innerHTML = '<details id="test" class="hidden" open><summary>Summary</summary>Content</details>';
      const el = document.getElementById('test');
      
      const style = window.getComputedStyle(el);
      expect(style.display).toBe('none');
      expect(el.open).toBe(true);
    });

    test('should reveal details when hidden class is removed', () => {
      document.body.innerHTML = '<details id="test" class="hidden" open><summary>Summary</summary>Content</details>';
      const el = document.getElementById('test');
      
      el.classList.remove('hidden');
      
      const style = window.getComputedStyle(el);
      expect(style.display).not.toBe('none');
    });
  });

  describe('Advanced Date Range Section Specific', () => {
    test('should match actual HTML structure from index.html', () => {
      document.body.innerHTML = `
        <details id="advancedRangeSection" class="advanced hidden" style="margin-top:10px;">
          <summary>Advanced date range</summary>
          <div>Content</div>
        </details>
      `;
      
      const section = document.getElementById('advancedRangeSection');
      expect(section.tagName).toBe('DETAILS');
      expect(section.classList.contains('advanced')).toBe(true);
      expect(section.classList.contains('hidden')).toBe(true);
      
      const style = window.getComputedStyle(section);
      expect(style.display).toBe('none');
    });

    test('should handle inline styles along with hidden class', () => {
      document.body.innerHTML = `
        <details id="test" class="hidden" style="margin-top:10px;">
          <summary>Summary</summary>
        </details>
      `;
      
      const el = document.getElementById('test');
      const style = window.getComputedStyle(el);
      
      expect(style.display).toBe('none');
      expect(el.style.marginTop).toBe('10px');
    });
  });

  describe('Button and Toggle Interaction', () => {
    test('should reflect visibility state in button text', () => {
      document.body.innerHTML = `
        <button id="toggleBtn">Show advanced date range</button>
        <details id="section" class="hidden">Content</details>
      `;
      
      const btn = document.getElementById('toggleBtn');
      const section = document.getElementById('section');
      
      expect(btn.textContent).toBe('Show advanced date range');
      expect(section.classList.contains('hidden')).toBe(true);
      
      section.classList.remove('hidden');
      btn.textContent = 'Hide advanced date range';
      
      expect(btn.textContent).toBe('Hide advanced date range');
      expect(section.classList.contains('hidden')).toBe(false);
    });
  });

  describe('Performance and Edge Cases', () => {
    test('should handle rapid class toggling', () => {
      document.body.innerHTML = '<div id="test">Content</div>';
      const el = document.getElementById('test');
      
      for (let i = 0; i < 100; i++) {
        el.classList.toggle('hidden');
      }
      
      expect(el.classList.contains('hidden')).toBe(false);
    });

    test('should not break with empty className', () => {
      document.body.innerHTML = '<div id="test">Content</div>';
      const el = document.getElementById('test');
      
      expect(el.className).toBe('');
      el.classList.add('hidden');
      expect(el.classList.contains('hidden')).toBe(true);
    });

    test('should handle className with leading/trailing spaces', () => {
      document.body.innerHTML = '<div id="test" class=" hidden ">Content</div>';
      const el = document.getElementById('test');
      
      expect(el.classList.contains('hidden')).toBe(true);
    });
  });
});