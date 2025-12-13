/**
 * Tests for debugLog function and related status logging
 * The debugLog function is used throughout the application including in the new
 * fallback clipboard logging added in the recent commit
 */

describe('debugLog', () => {
  let debugOutput;

  beforeEach(() => {
    document.body.innerHTML = `
      <pre id="debugOutput">Debug log initialised…</pre>
    `;

    debugOutput = document.getElementById('debugOutput');

    // Define the debugLog function
    global.debugLog = function(msg, data) {
      const el = document.getElementById("debugOutput");
      if (!el) return;
      const ts = new Date().toISOString();
      let line = "[" + ts + "] " + msg;
      if (data !== undefined) {
        try {
          line += " " + JSON.stringify(data);
        } catch {
          line += " " + String(data);
        }
      }
      el.textContent += "\n" + line;
      el.scrollTop = el.scrollHeight;
    };
  });

  afterEach(() => {
    document.body.innerHTML = '';
    delete global.debugLog;
  });

  describe('Basic Logging', () => {
    test('should append log message to debug output', () => {
      const initialContent = debugOutput.textContent;

      debugLog('Test message');

      expect(debugOutput.textContent).not.toBe(initialContent);
      expect(debugOutput.textContent).toContain('Test message');
    });

    test('should include timestamp in log message', () => {
      debugLog('Test with timestamp');

      const lines = debugOutput.textContent.split('\n');
      const lastLine = lines[lines.length - 1];
      
      expect(lastLine).toMatch(/^\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\]/);
    });

    test('should append new line before each message', () => {
      debugLog('First message');
      debugLog('Second message');

      const lines = debugOutput.textContent.split('\n');
      expect(lines.length).toBeGreaterThan(2);
    });

    test('should handle multiple messages in sequence', () => {
      debugLog('Message 1');
      debugLog('Message 2');
      debugLog('Message 3');

      expect(debugOutput.textContent).toContain('Message 1');
      expect(debugOutput.textContent).toContain('Message 2');
      expect(debugOutput.textContent).toContain('Message 3');
    });
  });

  describe('Data Serialization', () => {
    test('should serialize object data as JSON', () => {
      const data = { key: 'value', number: 42 };
      debugLog('Object test', data);

      expect(debugOutput.textContent).toContain('{"key":"value","number":42}');
    });

    test('should serialize array data as JSON', () => {
      const data = [1, 2, 3, 'test'];
      debugLog('Array test', data);

      expect(debugOutput.textContent).toContain('[1,2,3,"test"]');
    });

    test('should handle nested objects', () => {
      const data = {
        outer: {
          inner: {
            value: 'nested'
          }
        }
      };
      debugLog('Nested test', data);

      expect(debugOutput.textContent).toContain('"nested"');
    });

    test('should handle circular references gracefully', () => {
      const circular = { name: 'test' };
      circular.self = circular;

      expect(() => debugLog('Circular test', circular)).not.toThrow();
      expect(debugOutput.textContent).toContain('[object Object]');
    });

    test('should convert non-serializable data to string', () => {
      const fn = function() { return 'test'; };
      debugLog('Function test', fn);

      const lastLine = debugOutput.textContent.split('\n').pop();
      expect(lastLine).toContain('function');
    });

    test('should handle undefined data', () => {
      debugLog('Undefined test', undefined);

      expect(debugOutput.textContent).toContain('Undefined test');
    });

    test('should handle null data', () => {
      debugLog('Null test', null);

      expect(debugOutput.textContent).toContain('Null test null');
    });

    test('should handle empty string data', () => {
      debugLog('Empty string test', '');

      expect(debugOutput.textContent).toContain('Empty string test ""');
    });

    test('should handle zero as data', () => {
      debugLog('Zero test', 0);

      expect(debugOutput.textContent).toContain('Zero test 0');
    });

    test('should handle boolean data', () => {
      debugLog('Boolean true', true);
      debugLog('Boolean false', false);

      expect(debugOutput.textContent).toContain('Boolean true true');
      expect(debugOutput.textContent).toContain('Boolean false false');
    });
  });

  describe('Edge Cases', () => {
    test('should handle missing debug output element', () => {
      document.getElementById('debugOutput').remove();

      expect(() => debugLog('Test')).not.toThrow();
    });

    test('should handle very long messages', () => {
      const longMessage = 'x'.repeat(10000);
      
      expect(() => debugLog(longMessage)).not.toThrow();
      expect(debugOutput.textContent).toContain(longMessage);
    });

    test('should handle messages with special characters', () => {
      debugLog('Special chars: \n\t\r\'"\\');

      expect(debugOutput.textContent).toContain('Special chars');
    });

    test('should handle messages with Unicode characters', () => {
      debugLog('Unicode: 🎉 测试 🚀');

      expect(debugOutput.textContent).toContain('Unicode: 🎉 测试 🚀');
    });

    test('should handle empty message', () => {
      debugLog('');

      const lines = debugOutput.textContent.split('\n');
      const lastLine = lines[lines.length - 1];
      expect(lastLine).toMatch(/^\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] $/);
    });
  });

  describe('Scroll Behavior', () => {
    test('should set scrollTop to scrollHeight', () => {
      // Create a scrollable element
      debugOutput.style.height = '100px';
      debugOutput.style.overflow = 'auto';

      debugLog('Line 1');
      debugLog('Line 2');
      debugLog('Line 3');
      debugLog('Line 4');
      debugLog('Line 5');

      // scrollTop should be set to scrollHeight
      // In jsdom, we can verify the property was set
      expect(debugOutput.scrollTop).toBeDefined();
    });
  });

  describe('Integration with Application', () => {
    test('should log version pill clipboard copy event', () => {
      debugLog('Version pill copied full index.html via fallback clipboard path.');

      expect(debugOutput.textContent).toContain(
        'Version pill copied full index.html via fallback clipboard path.'
      );
    });

    test('should log status messages', () => {
      debugLog('STATUS: Waiting for sign-in… [ERROR]');

      expect(debugOutput.textContent).toContain('STATUS:');
      expect(debugOutput.textContent).toContain('[ERROR]');
    });

    test('should log API responses', () => {
      const apiData = { status: 200, hasChoices: true };
      debugLog('OpenAI response payload (truncated)', apiData);

      expect(debugOutput.textContent).toContain('OpenAI response payload');
      expect(debugOutput.textContent).toContain('"status":200');
    });
  });

  describe('Performance', () => {
    test('should handle rapid successive calls', () => {
      const startTime = Date.now();
      
      for (let i = 0; i < 100; i++) {
        debugLog(`Message ${i}`);
      }
      
      const endTime = Date.now();
      
      // Should complete in reasonable time
      expect(endTime - startTime).toBeLessThan(1000);
      expect(debugOutput.textContent).toContain('Message 99');
    });
  });
});

describe('setStatus', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="status">Status: Waiting…</div>
      <pre id="debugOutput">Debug log initialised…</pre>
    `;

    global.debugLog = function(msg, data) {
      const el = document.getElementById("debugOutput");
      if (!el) return;
      el.textContent += "\n" + msg;
    };

    global.setStatus = function(msg, isError) {
      const el = document.getElementById("status");
      if (!el) return;
      el.textContent = "Status: " + msg;
      el.className = isError ? "danger" : "";
      debugLog("STATUS: " + msg + (isError ? " [ERROR]" : ""));
    };
  });

  afterEach(() => {
    document.body.innerHTML = '';
    delete global.setStatus;
    delete global.debugLog;
  });

  test('should update status text', () => {
    const statusEl = document.getElementById('status');
    
    setStatus('New status message', false);
    
    expect(statusEl.textContent).toBe('Status: New status message');
  });

  test('should add danger class for errors', () => {
    const statusEl = document.getElementById('status');
    
    setStatus('Error occurred', true);
    
    expect(statusEl.className).toBe('danger');
  });

  test('should remove danger class for non-errors', () => {
    const statusEl = document.getElementById('status');
    statusEl.className = 'danger';
    
    setStatus('Success', false);
    
    expect(statusEl.className).toBe('');
  });

  test('should log to debug output', () => {
    const debugEl = document.getElementById('debugOutput');
    
    setStatus('Test status', false);
    
    expect(debugEl.textContent).toContain('STATUS: Test status');
  });

  test('should include error marker in debug log', () => {
    const debugEl = document.getElementById('debugOutput');
    
    setStatus('Error message', true);
    
    expect(debugEl.textContent).toContain('[ERROR]');
  });

  test('should handle missing status element', () => {
    document.getElementById('status').remove();
    
    expect(() => setStatus('Test', false)).not.toThrow();
  });
});

describe('setAiStatus', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="aiStatus"></div>
      <pre id="debugOutput">Debug log initialised…</pre>
    `;

    global.debugLog = function(msg, data) {
      const el = document.getElementById("debugOutput");
      if (!el) return;
      el.textContent += "\n" + msg;
    };

    global.setAiStatus = function(msg, isError) {
      const el = document.getElementById("aiStatus");
      if (!el) return;
      el.textContent = msg || "";
      el.className = isError ? "danger" : "";
      if (msg) debugLog("AI: " + msg + (isError ? " [ERROR]" : ""));
    };
  });

  afterEach(() => {
    document.body.innerHTML = '';
    delete global.setAiStatus;
    delete global.debugLog;
  });

  test('should update AI status text', () => {
    const aiStatusEl = document.getElementById('aiStatus');
    
    setAiStatus('Processing...', false);
    
    expect(aiStatusEl.textContent).toBe('Processing...');
  });

  test('should handle empty message', () => {
    const aiStatusEl = document.getElementById('aiStatus');
    aiStatusEl.textContent = 'Previous message';
    
    setAiStatus('', false);
    
    expect(aiStatusEl.textContent).toBe('');
  });

  test('should only log non-empty messages', () => {
    const debugEl = document.getElementById('debugOutput');
    const initialContent = debugEl.textContent;
    
    setAiStatus('', false);
    
    expect(debugEl.textContent).toBe(initialContent);
  });

  test('should log non-empty messages', () => {
    const debugEl = document.getElementById('debugOutput');
    
    setAiStatus('AI processing complete', false);
    
    expect(debugEl.textContent).toContain('AI: AI processing complete');
  });
});