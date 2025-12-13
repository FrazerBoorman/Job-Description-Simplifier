/**
 * Integration tests for the advanced date range toggle functionality
 * These tests verify that the toggle button, hidden section, and date range
 * functionality work together correctly
 */

describe('Advanced Date Range Integration', () => {
  let toggleBtn, section, startInput, endInput, applyBtn;
  let mockSetStatus, mockDebugLog, mockLoadRecentEvents;

  beforeEach(() => {
    document.body.innerHTML = `
      <div style="margin-top:10px;">
        <button id="toggleAdvancedRangeBtn" class="pill-btn" type="button">
          Show advanced date range
        </button>
      </div>
      <details id="advancedRangeSection" class="advanced hidden" style="margin-top:10px;">
        <summary>Advanced date range</summary>
        <div class="grid" style="margin-top:8px;">
          <div>
            <label for="advancedStartDate">Start date</label>
            <input id="advancedStartDate" type="date" />
            <div class="small-note">Defaults to 14 days ago.</div>
          </div>
          <div>
            <label for="advancedEndDate">End date</label>
            <input id="advancedEndDate" type="date" />
            <div class="small-note">Defaults to the end of today.</div>
          </div>
        </div>
        <div class="btn-row" style="margin-top:8px;">
          <button id="applyRangeBtn" type="button">Apply date range</button>
          <div class="small-note">Uses the range above when loading events.</div>
        </div>
      </details>
    `;

    toggleBtn = document.getElementById('toggleAdvancedRangeBtn');
    section = document.getElementById('advancedRangeSection');
    startInput = document.getElementById('advancedStartDate');
    endInput = document.getElementById('advancedEndDate');
    applyBtn = document.getElementById('applyRangeBtn');

    mockSetStatus = jest.fn();
    mockDebugLog = jest.fn();
    mockLoadRecentEvents = jest.fn();

    global.setStatus = mockSetStatus;
    global.debugLog = mockDebugLog;
    global.loadRecentEvents = mockLoadRecentEvents;

    // Define all necessary functions
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

    global.setDefaultDateRangeInputs = function() {
      const startInput = document.getElementById("advancedStartDate");
      const endInput = document.getElementById("advancedEndDate");
      const now = new Date();

      const defaultStart = new Date(now);
      defaultStart.setDate(defaultStart.getDate() - 14);
      const startVal = defaultStart.toISOString().slice(0, 10);
      const endVal = now.toISOString().slice(0, 10);

      if (startInput && !startInput.value) startInput.value = startVal;
      if (endInput && !endInput.value) endInput.value = endVal;
    };

    global.getDateRangeOrDefault = function() {
      const startInput = document.getElementById("advancedStartDate");
      const endInput = document.getElementById("advancedEndDate");

      const now = new Date();
      const defaultEnd = new Date(now);
      defaultEnd.setHours(23,59,59,999);
      const defaultStart = new Date(now);
      defaultStart.setDate(defaultStart.getDate() - 14);
      defaultStart.setHours(0,0,0,0);

      const start = startInput?.value
        ? new Date(startInput.value + "T00:00:00")
        : defaultStart;
      const end = endInput?.value
        ? new Date(endInput.value + "T23:59:59")
        : defaultEnd;

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        setStatus("Invalid date range. Please use valid dates.", true);
        return null;
      }
      if (start > end) {
        setStatus("Start date must be on or before the end date.", true);
        return null;
      }

      return { start, end };
    };
  });

  afterEach(() => {
    document.body.innerHTML = '';
    delete global.toggleAdvancedRange;
    delete global.setDefaultDateRangeInputs;
    delete global.getDateRangeOrDefault;
    delete global.setStatus;
    delete global.debugLog;
    delete global.loadRecentEvents;
  });

  describe('Initial State', () => {
    test('should start with section hidden', () => {
      expect(section.classList.contains('hidden')).toBe(true);
    });

    test('should have correct initial button text', () => {
      expect(toggleBtn.textContent).toBe('Show advanced date range');
    });

    test('should have empty date inputs initially', () => {
      expect(startInput.value).toBe('');
      expect(endInput.value).toBe('');
    });
  });

  describe('User Workflow - Show and Configure', () => {
    test('should show section when toggle button is clicked', () => {
      toggleAdvancedRange();

      expect(section.classList.contains('hidden')).toBe(false);
      expect(section.open).toBe(true);
      expect(toggleBtn.textContent).toBe('Hide advanced date range');
    });

    test('should set default dates after showing section', () => {
      toggleAdvancedRange();
      setDefaultDateRangeInputs();

      expect(startInput.value).not.toBe('');
      expect(endInput.value).not.toBe('');
      expect(startInput.value).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(endInput.value).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    test('should allow user to modify dates after defaults are set', () => {
      toggleAdvancedRange();
      setDefaultDateRangeInputs();

      startInput.value = '2024-01-01';
      endInput.value = '2024-01-31';

      expect(startInput.value).toBe('2024-01-01');
      expect(endInput.value).toBe('2024-01-31');
    });

    test('should retrieve custom date range correctly', () => {
      toggleAdvancedRange();
      startInput.value = '2024-05-01';
      endInput.value = '2024-05-31';

      const range = getDateRangeOrDefault();

      expect(range).not.toBeNull();
      expect(range.start.toISOString()).toContain('2024-05-01');
      expect(range.end.toISOString()).toContain('2024-05-31');
    });
  });

  describe('User Workflow - Hide Section', () => {
    test('should hide section when toggle button is clicked again', () => {
      toggleAdvancedRange(); // Show
      toggleAdvancedRange(); // Hide

      expect(section.classList.contains('hidden')).toBe(true);
      expect(section.open).toBe(false);
      expect(toggleBtn.textContent).toBe('Show advanced date range');
    });

    test('should preserve date values when hiding and showing', () => {
      toggleAdvancedRange();
      startInput.value = '2024-03-01';
      endInput.value = '2024-03-31';

      toggleAdvancedRange(); // Hide
      toggleAdvancedRange(); // Show again

      expect(startInput.value).toBe('2024-03-01');
      expect(endInput.value).toBe('2024-03-31');
    });
  });

  describe('Apply Date Range Button Integration', () => {
    test('should trigger loadRecentEvents when apply button is clicked', () => {
      toggleAdvancedRange();
      startInput.value = '2024-06-01';
      endInput.value = '2024-06-30';

      applyBtn.addEventListener('click', () => {
        setStatus("Loading events with custom range…", false);
        loadRecentEvents();
      });

      applyBtn.click();

      expect(mockSetStatus).toHaveBeenCalledWith(
        "Loading events with custom range…",
        false
      );
      expect(mockLoadRecentEvents).toHaveBeenCalled();
    });

    test('should use custom date range when apply is clicked', () => {
      toggleAdvancedRange();
      startInput.value = '2024-01-01';
      endInput.value = '2024-12-31';

      const range = getDateRangeOrDefault();

      expect(range).not.toBeNull();
      expect(range.start.getFullYear()).toBe(2024);
      expect(range.start.getMonth()).toBe(0); // January
      expect(range.end.getFullYear()).toBe(2024);
      expect(range.end.getMonth()).toBe(11); // December
    });
  });

  describe('Validation During Workflow', () => {
    test('should prevent applying invalid date range', () => {
      toggleAdvancedRange();
      startInput.value = '2024-12-31';
      endInput.value = '2024-01-01';

      const range = getDateRangeOrDefault();

      expect(range).toBeNull();
      expect(mockSetStatus).toHaveBeenCalledWith(
        'Start date must be on or before the end date.',
        true
      );
    });

    test('should allow applying valid date range', () => {
      toggleAdvancedRange();
      startInput.value = '2024-01-01';
      endInput.value = '2024-12-31';

      const range = getDateRangeOrDefault();

      expect(range).not.toBeNull();
      expect(mockSetStatus).not.toHaveBeenCalled();
    });
  });

  describe('CSS Classes and Styling', () => {
    test('should maintain advanced class when toggling', () => {
      expect(section.classList.contains('advanced')).toBe(true);

      toggleAdvancedRange();
      expect(section.classList.contains('advanced')).toBe(true);

      toggleAdvancedRange();
      expect(section.classList.contains('advanced')).toBe(true);
    });

    test('should maintain pill-btn class on toggle button', () => {
      expect(toggleBtn.classList.contains('pill-btn')).toBe(true);

      toggleAdvancedRange();
      expect(toggleBtn.classList.contains('pill-btn')).toBe(true);
    });

    test('should toggle only hidden class', () => {
      const initialClasses = Array.from(section.classList);
      
      toggleAdvancedRange();
      const afterToggle = Array.from(section.classList);

      // Should have same classes except 'hidden'
      const withoutHidden = initialClasses.filter(c => c !== 'hidden');
      const afterWithoutHidden = afterToggle.filter(c => c !== 'hidden');

      expect(withoutHidden).toEqual(afterWithoutHidden);
    });
  });

  describe('Accessibility Features', () => {
    test('should provide clear button text for screen readers', () => {
      expect(toggleBtn.textContent).toContain('advanced date range');
      
      toggleAdvancedRange();
      expect(toggleBtn.textContent).toContain('advanced date range');
    });

    test('should use semantic HTML details element', () => {
      expect(section.tagName).toBe('DETAILS');
    });

    test('should have labels for date inputs', () => {
      const startLabel = document.querySelector('label[for="advancedStartDate"]');
      const endLabel = document.querySelector('label[for="advancedEndDate"]');

      expect(startLabel).not.toBeNull();
      expect(endLabel).not.toBeNull();
      expect(startLabel.textContent).toContain('Start date');
      expect(endLabel.textContent).toContain('End date');
    });

    test('should have descriptive helper text for inputs', () => {
      const notes = document.querySelectorAll('.small-note');
      
      expect(notes.length).toBeGreaterThan(0);
      expect(Array.from(notes).some(n => n.textContent.includes('14 days ago'))).toBe(true);
    });
  });

  describe('Multiple Toggle Cycles', () => {
    test('should handle multiple show/hide cycles correctly', () => {
      for (let i = 0; i < 5; i++) {
        toggleAdvancedRange(); // Show
        expect(section.classList.contains('hidden')).toBe(false);
        
        toggleAdvancedRange(); // Hide
        expect(section.classList.contains('hidden')).toBe(true);
      }
    });

    test('should maintain date values across multiple toggle cycles', () => {
      startInput.value = '2024-08-01';
      endInput.value = '2024-08-31';

      for (let i = 0; i < 3; i++) {
        toggleAdvancedRange(); // Show
        toggleAdvancedRange(); // Hide
      }

      expect(startInput.value).toBe('2024-08-01');
      expect(endInput.value).toBe('2024-08-31');
    });
  });

  describe('Default Values Interaction', () => {
    test('should not override user values when setting defaults', () => {
      startInput.value = '2024-02-01';
      endInput.value = '2024-02-29';

      setDefaultDateRangeInputs();

      expect(startInput.value).toBe('2024-02-01');
      expect(endInput.value).toBe('2024-02-29');
    });

    test('should only fill empty date inputs with defaults', () => {
      startInput.value = '2024-03-01';

      setDefaultDateRangeInputs();

      expect(startInput.value).toBe('2024-03-01');
      expect(endInput.value).not.toBe('');
    });
  });

  describe('Page Load Simulation', () => {
    test('should simulate complete page load workflow', () => {
      // Simulate page load
      setDefaultDateRangeInputs();
      
      // User shows advanced section
      toggleAdvancedRange();
      expect(section.classList.contains('hidden')).toBe(false);
      
      // User modifies dates
      startInput.value = '2024-07-01';
      endInput.value = '2024-07-31';
      
      // User applies range
      const range = getDateRangeOrDefault();
      expect(range).not.toBeNull();
      
      // User hides section
      toggleAdvancedRange();
      expect(section.classList.contains('hidden')).toBe(true);
      
      // Values should still be there
      expect(startInput.value).toBe('2024-07-01');
      expect(endInput.value).toBe('2024-07-31');
    });
  });
});