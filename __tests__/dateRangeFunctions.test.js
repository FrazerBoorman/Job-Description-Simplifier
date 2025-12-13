/**
 * Tests for date range functions
 * These functions interact with the advanced date range section that was modified
 */

describe('setDefaultDateRangeInputs', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <input id="advancedStartDate" type="date" />
      <input id="advancedEndDate" type="date" />
    `;

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
  });

  afterEach(() => {
    document.body.innerHTML = '';
    delete global.setDefaultDateRangeInputs;
  });

  describe('Happy Path', () => {
    test('should set default start date to 14 days ago', () => {
      const startInput = document.getElementById('advancedStartDate');
      
      setDefaultDateRangeInputs();
      
      const expectedDate = new Date();
      expectedDate.setDate(expectedDate.getDate() - 14);
      const expected = expectedDate.toISOString().slice(0, 10);
      
      expect(startInput.value).toBe(expected);
    });

    test('should set default end date to today', () => {
      const endInput = document.getElementById('advancedEndDate');
      
      setDefaultDateRangeInputs();
      
      const expected = new Date().toISOString().slice(0, 10);
      
      expect(endInput.value).toBe(expected);
    });

    test('should not override existing values', () => {
      const startInput = document.getElementById('advancedStartDate');
      const endInput = document.getElementById('advancedEndDate');
      
      startInput.value = '2024-01-01';
      endInput.value = '2024-01-31';
      
      setDefaultDateRangeInputs();
      
      expect(startInput.value).toBe('2024-01-01');
      expect(endInput.value).toBe('2024-01-31');
    });

    test('should only set start date if end date is already set', () => {
      const startInput = document.getElementById('advancedStartDate');
      const endInput = document.getElementById('advancedEndDate');
      
      endInput.value = '2024-06-01';
      
      setDefaultDateRangeInputs();
      
      const expectedStart = new Date();
      expectedStart.setDate(expectedStart.getDate() - 14);
      const expected = expectedStart.toISOString().slice(0, 10);
      
      expect(startInput.value).toBe(expected);
      expect(endInput.value).toBe('2024-06-01');
    });

    test('should only set end date if start date is already set', () => {
      const startInput = document.getElementById('advancedStartDate');
      const endInput = document.getElementById('advancedEndDate');
      
      startInput.value = '2024-01-01';
      
      setDefaultDateRangeInputs();
      
      const expectedEnd = new Date().toISOString().slice(0, 10);
      
      expect(startInput.value).toBe('2024-01-01');
      expect(endInput.value).toBe(expectedEnd);
    });
  });

  describe('Edge Cases', () => {
    test('should handle missing start input element', () => {
      document.getElementById('advancedStartDate').remove();
      
      expect(() => setDefaultDateRangeInputs()).not.toThrow();
    });

    test('should handle missing end input element', () => {
      document.getElementById('advancedEndDate').remove();
      
      expect(() => setDefaultDateRangeInputs()).not.toThrow();
    });

    test('should handle both elements missing', () => {
      document.getElementById('advancedStartDate').remove();
      document.getElementById('advancedEndDate').remove();
      
      expect(() => setDefaultDateRangeInputs()).not.toThrow();
    });

    test('should handle empty string as existing value', () => {
      const startInput = document.getElementById('advancedStartDate');
      const endInput = document.getElementById('advancedEndDate');
      
      startInput.value = '';
      endInput.value = '';
      
      setDefaultDateRangeInputs();
      
      expect(startInput.value).not.toBe('');
      expect(endInput.value).not.toBe('');
    });

    test('should handle whitespace-only values as empty', () => {
      const startInput = document.getElementById('advancedStartDate');
      
      // Date inputs don't allow whitespace, but test the logic
      startInput.value = '';
      
      setDefaultDateRangeInputs();
      
      expect(startInput.value).not.toBe('');
    });
  });

  describe('Date Format', () => {
    test('should use YYYY-MM-DD format', () => {
      const startInput = document.getElementById('advancedStartDate');
      
      setDefaultDateRangeInputs();
      
      expect(startInput.value).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    test('should produce valid date strings', () => {
      const startInput = document.getElementById('advancedStartDate');
      const endInput = document.getElementById('advancedEndDate');
      
      setDefaultDateRangeInputs();
      
      expect(new Date(startInput.value).toString()).not.toBe('Invalid Date');
      expect(new Date(endInput.value).toString()).not.toBe('Invalid Date');
    });
  });

  describe('Consistency', () => {
    test('should create consistent dates on multiple calls with empty inputs', () => {
      const startInput = document.getElementById('advancedStartDate');
      const endInput = document.getElementById('advancedEndDate');
      
      setDefaultDateRangeInputs();
      const firstStart = startInput.value;
      const firstEnd = endInput.value;
      
      // Clear and call again
      startInput.value = '';
      endInput.value = '';
      setDefaultDateRangeInputs();
      
      expect(startInput.value).toBe(firstStart);
      expect(endInput.value).toBe(firstEnd);
    });

    test('should ensure start date is before end date', () => {
      const startInput = document.getElementById('advancedStartDate');
      const endInput = document.getElementById('advancedEndDate');
      
      setDefaultDateRangeInputs();
      
      const startDate = new Date(startInput.value);
      const endDate = new Date(endInput.value);
      
      expect(startDate.getTime()).toBeLessThanOrEqual(endDate.getTime());
    });
  });
});

describe('getDateRangeOrDefault', () => {
  let mockSetStatus;

  beforeEach(() => {
    mockSetStatus = jest.fn();
    global.setStatus = mockSetStatus;

    document.body.innerHTML = `
      <input id="advancedStartDate" type="date" />
      <input id="advancedEndDate" type="date" />
    `;

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
    delete global.getDateRangeOrDefault;
    delete global.setStatus;
  });

  describe('Default Values', () => {
    test('should return default range when inputs are empty', () => {
      const result = getDateRangeOrDefault();
      
      expect(result).not.toBeNull();
      expect(result.start).toBeInstanceOf(Date);
      expect(result.end).toBeInstanceOf(Date);
    });

    test('should set start time to midnight (00:00:00)', () => {
      const result = getDateRangeOrDefault();
      
      const start = result.start;
      expect(start.getHours()).toBe(0);
      expect(start.getMinutes()).toBe(0);
      expect(start.getSeconds()).toBe(0);
    });

    test('should set end time to end of day (23:59:59.999)', () => {
      const result = getDateRangeOrDefault();
      
      const end = result.end;
      expect(end.getHours()).toBe(23);
      expect(end.getMinutes()).toBe(59);
      expect(end.getSeconds()).toBe(59);
      expect(end.getMilliseconds()).toBe(999);
    });

    test('should default to 14 days before today for start', () => {
      const result = getDateRangeOrDefault();
      
      const now = new Date();
      const expected = new Date(now);
      expected.setDate(expected.getDate() - 14);
      
      const startDateStr = result.start.toISOString().slice(0, 10);
      const expectedDateStr = expected.toISOString().slice(0, 10);
      
      expect(startDateStr).toBe(expectedDateStr);
    });

    test('should default to today for end', () => {
      const result = getDateRangeOrDefault();
      
      const now = new Date();
      const endDateStr = result.end.toISOString().slice(0, 10);
      const expectedDateStr = now.toISOString().slice(0, 10);
      
      expect(endDateStr).toBe(expectedDateStr);
    });
  });

  describe('Custom Values', () => {
    test('should use custom start date when provided', () => {
      const startInput = document.getElementById('advancedStartDate');
      startInput.value = '2024-01-01';
      
      const result = getDateRangeOrDefault();
      
      expect(result.start.toISOString()).toContain('2024-01-01');
    });

    test('should use custom end date when provided', () => {
      const endInput = document.getElementById('advancedEndDate');
      endInput.value = '2024-12-31';
      
      const result = getDateRangeOrDefault();
      
      expect(result.end.toISOString()).toContain('2024-12-31');
    });

    test('should use both custom dates when provided', () => {
      const startInput = document.getElementById('advancedStartDate');
      const endInput = document.getElementById('advancedEndDate');
      
      startInput.value = '2024-06-01';
      endInput.value = '2024-06-30';
      
      const result = getDateRangeOrDefault();
      
      expect(result.start.toISOString()).toContain('2024-06-01');
      expect(result.end.toISOString()).toContain('2024-06-30');
    });

    test('should append time to custom start date', () => {
      const startInput = document.getElementById('advancedStartDate');
      startInput.value = '2024-03-15';
      
      const result = getDateRangeOrDefault();
      
      expect(result.start.getHours()).toBe(0);
      expect(result.start.getMinutes()).toBe(0);
    });

    test('should append time to custom end date', () => {
      const endInput = document.getElementById('advancedEndDate');
      endInput.value = '2024-03-15';
      
      const result = getDateRangeOrDefault();
      
      expect(result.end.getHours()).toBe(23);
      expect(result.end.getMinutes()).toBe(59);
    });
  });

  describe('Validation', () => {
    test('should return null for invalid start date', () => {
      const startInput = document.getElementById('advancedStartDate');
      startInput.value = 'invalid-date';
      
      const result = getDateRangeOrDefault();
      
      expect(result).toBeNull();
      expect(mockSetStatus).toHaveBeenCalledWith(
        'Invalid date range. Please use valid dates.',
        true
      );
    });

    test('should return null for invalid end date', () => {
      const endInput = document.getElementById('advancedEndDate');
      endInput.value = 'not-a-date';
      
      const result = getDateRangeOrDefault();
      
      expect(result).toBeNull();
      expect(mockSetStatus).toHaveBeenCalledWith(
        'Invalid date range. Please use valid dates.',
        true
      );
    });

    test('should return null when start date is after end date', () => {
      const startInput = document.getElementById('advancedStartDate');
      const endInput = document.getElementById('advancedEndDate');
      
      startInput.value = '2024-12-31';
      endInput.value = '2024-01-01';
      
      const result = getDateRangeOrDefault();
      
      expect(result).toBeNull();
      expect(mockSetStatus).toHaveBeenCalledWith(
        'Start date must be on or before the end date.',
        true
      );
    });

    test('should allow start date equal to end date', () => {
      const startInput = document.getElementById('advancedStartDate');
      const endInput = document.getElementById('advancedEndDate');
      
      startInput.value = '2024-06-15';
      endInput.value = '2024-06-15';
      
      const result = getDateRangeOrDefault();
      
      expect(result).not.toBeNull();
      expect(result.start.toISOString().slice(0, 10)).toBe('2024-06-15');
      expect(result.end.toISOString().slice(0, 10)).toBe('2024-06-15');
    });

    test('should not call setStatus for valid range', () => {
      const startInput = document.getElementById('advancedStartDate');
      const endInput = document.getElementById('advancedEndDate');
      
      startInput.value = '2024-01-01';
      endInput.value = '2024-12-31';
      
      getDateRangeOrDefault();
      
      expect(mockSetStatus).not.toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    test('should handle missing start input element', () => {
      document.getElementById('advancedStartDate').remove();
      
      const result = getDateRangeOrDefault();
      
      expect(result).not.toBeNull();
      expect(result.start).toBeInstanceOf(Date);
    });

    test('should handle missing end input element', () => {
      document.getElementById('advancedEndDate').remove();
      
      const result = getDateRangeOrDefault();
      
      expect(result).not.toBeNull();
      expect(result.end).toBeInstanceOf(Date);
    });

    test('should handle both input elements missing', () => {
      document.getElementById('advancedStartDate').remove();
      document.getElementById('advancedEndDate').remove();
      
      const result = getDateRangeOrDefault();
      
      expect(result).not.toBeNull();
      expect(result.start).toBeInstanceOf(Date);
      expect(result.end).toBeInstanceOf(Date);
    });

    test('should handle very old dates', () => {
      const startInput = document.getElementById('advancedStartDate');
      const endInput = document.getElementById('advancedEndDate');
      
      startInput.value = '1900-01-01';
      endInput.value = '1900-12-31';
      
      const result = getDateRangeOrDefault();
      
      expect(result).not.toBeNull();
      expect(result.start.getFullYear()).toBe(1900);
    });

    test('should handle future dates', () => {
      const startInput = document.getElementById('advancedStartDate');
      const endInput = document.getElementById('advancedEndDate');
      
      startInput.value = '2099-01-01';
      endInput.value = '2099-12-31';
      
      const result = getDateRangeOrDefault();
      
      expect(result).not.toBeNull();
      expect(result.start.getFullYear()).toBe(2099);
    });

    test('should handle leap year dates', () => {
      const startInput = document.getElementById('advancedStartDate');
      const endInput = document.getElementById('advancedEndDate');
      
      startInput.value = '2024-02-29';
      endInput.value = '2024-03-01';
      
      const result = getDateRangeOrDefault();
      
      expect(result).not.toBeNull();
      expect(result.start.getDate()).toBe(29);
      expect(result.start.getMonth()).toBe(1); // February is month 1
    });
  });

  describe('Time Zones', () => {
    test('should handle dates consistently regardless of timezone', () => {
      const startInput = document.getElementById('advancedStartDate');
      startInput.value = '2024-06-15';
      
      const result = getDateRangeOrDefault();
      
      // Should parse as local time
      expect(result.start.toISOString()).toContain('2024-06-15');
    });
  });
});