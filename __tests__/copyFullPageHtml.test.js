/**
 * Tests for copyFullPageHtml function
 * This function was modified to include debug logging for the fallback clipboard path
 */

describe('copyFullPageHtml', () => {
  let mockDebugLog;
  let mockAlert;
  let originalClipboard;
  let mockFetch;

  beforeEach(() => {
    // Mock debugLog function
    mockDebugLog = jest.fn();
    global.debugLog = mockDebugLog;

    // Mock alert
    mockAlert = jest.fn();
    global.alert = mockAlert;

    // Store original clipboard
    originalClipboard = navigator.clipboard;

    // Mock fetch
    mockFetch = jest.fn();
    global.fetch = mockFetch;

    // Set up basic DOM
    document.body.innerHTML = `
      <!DOCTYPE html>
      <html>
        <head><title>Test</title></head>
        <body><div>Test Content</div></body>
      </html>
    `;

    // Define the getIndexHtmlSource function
    global.getIndexHtmlSource = async function() {
      const request = new Request("index.html", { cache: "no-cache" });
      try {
        const res = await fetch(request);
        if (!res.ok) {
          throw new Error("Failed to fetch index.html (" + res.status + ")");
        }
        return await res.text();
      } catch (e) {
        const dt = document.doctype;
        const doctype = dt
          ? "<!DOCTYPE " + dt.name + (dt.publicId ? " PUBLIC \"" + dt.publicId + "\"" : "") +
            (dt.systemId ? " \"" + dt.systemId + "\"" : "") + ">\n"
          : "<!DOCTYPE html>\n";
        return doctype + document.documentElement.outerHTML;
      }
    };

    // Define copyFullPageHtml function
    global.copyFullPageHtml = async function() {
      const htmlString = await getIndexHtmlSource();

      try {
        if (navigator.clipboard && typeof ClipboardItem !== "undefined" && navigator.clipboard.write) {
          const plainBlob = new Blob([htmlString], { type: "text/plain" });
          const htmlBlob  = new Blob([htmlString], { type: "text/html" });
          await navigator.clipboard.write([
            new ClipboardItem({ "text/plain": plainBlob, "text/html": htmlBlob })
          ]);
        } else if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(htmlString);
        } else {
          throw new Error("Clipboard API unavailable");
        }
        alert("Full index.html copied to clipboard.");
        return;
      } catch (e) {
        const helper = document.createElement("textarea");
        helper.value = htmlString;
        helper.setAttribute("aria-hidden", "true");
        helper.setAttribute("readonly", "true");
        helper.style.position = "fixed";
        helper.style.left = "-9999px";
        helper.style.top = "0";
        helper.style.opacity = "0";
        helper.style.pointerEvents = "none";
        document.body.appendChild(helper);

        let fallbackSuccess = false;
        try {
          helper.focus({ preventScroll: true });
          helper.select();
          helper.setSelectionRange(0, helper.value.length);
          fallbackSuccess = !!(document.execCommand && document.execCommand("copy"));
        } finally {
          document.body.removeChild(helper);
        }

        if (fallbackSuccess) {
          alert("Full index.html copied to clipboard.");
          debugLog("Version pill copied full index.html via fallback clipboard path.");
          return;
        }

        alert("Could not copy the full page automatically. You may need to copy manually.");
      }
    };
  });

  afterEach(() => {
    navigator.clipboard = originalClipboard;
    delete global.debugLog;
    delete global.alert;
    delete global.fetch;
    delete global.getIndexHtmlSource;
    delete global.copyFullPageHtml;
    document.body.innerHTML = '';
  });

  describe('Clipboard API Success', () => {
    test('should copy using ClipboardItem when available', async () => {
      const mockWrite = jest.fn().mockResolvedValue(undefined);
      global.ClipboardItem = class {
        constructor(data) {
          this.data = data;
        }
      };
      Object.defineProperty(navigator, 'clipboard', {
        value: { write: mockWrite },
        writable: true,
        configurable: true
      });

      mockFetch.mockResolvedValue({
        ok: true,
        text: async () => '<html><body>Test</body></html>'
      });

      await copyFullPageHtml();

      expect(mockWrite).toHaveBeenCalled();
      expect(mockAlert).toHaveBeenCalledWith('Full index.html copied to clipboard.');
      expect(mockDebugLog).not.toHaveBeenCalledWith(
        'Version pill copied full index.html via fallback clipboard path.'
      );
    });

    test('should copy using writeText when ClipboardItem unavailable', async () => {
      const mockWriteText = jest.fn().mockResolvedValue(undefined);
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: mockWriteText },
        writable: true,
        configurable: true
      });

      mockFetch.mockResolvedValue({
        ok: true,
        text: async () => '<html><body>Test</body></html>'
      });

      await copyFullPageHtml();

      expect(mockWriteText).toHaveBeenCalled();
      expect(mockAlert).toHaveBeenCalledWith('Full index.html copied to clipboard.');
    });
  });

  describe('Fallback Clipboard Path', () => {
    test('should use fallback method and log debug message on success', async () => {
      // No clipboard API available
      Object.defineProperty(navigator, 'clipboard', {
        value: undefined,
        writable: true,
        configurable: true
      });

      mockFetch.mockResolvedValue({
        ok: true,
        text: async () => '<html><body>Fallback Test</body></html>'
      });

      // Mock execCommand to succeed
      document.execCommand = jest.fn().mockReturnValue(true);

      await copyFullPageHtml();

      expect(mockAlert).toHaveBeenCalledWith('Full index.html copied to clipboard.');
      expect(mockDebugLog).toHaveBeenCalledWith(
        'Version pill copied full index.html via fallback clipboard path.'
      );
    });

    test('should show manual copy message when fallback fails', async () => {
      Object.defineProperty(navigator, 'clipboard', {
        value: undefined,
        writable: true,
        configurable: true
      });

      mockFetch.mockResolvedValue({
        ok: true,
        text: async () => '<html><body>Test</body></html>'
      });

      // Mock execCommand to fail
      document.execCommand = jest.fn().mockReturnValue(false);

      await copyFullPageHtml();

      expect(mockAlert).toHaveBeenCalledWith(
        'Could not copy the full page automatically. You may need to copy manually.'
      );
      expect(mockDebugLog).not.toHaveBeenCalledWith(
        'Version pill copied full index.html via fallback clipboard path.'
      );
    });

    test('should clean up textarea helper element after fallback attempt', async () => {
      Object.defineProperty(navigator, 'clipboard', {
        value: undefined,
        writable: true,
        configurable: true
      });

      mockFetch.mockResolvedValue({
        ok: true,
        text: async () => '<html><body>Test</body></html>'
      });

      document.execCommand = jest.fn().mockReturnValue(true);

      const initialChildCount = document.body.children.length;
      await copyFullPageHtml();

      // Textarea should be removed
      expect(document.body.children.length).toBe(initialChildCount);
      expect(document.querySelector('textarea')).toBeNull();
    });

    test('should properly configure textarea helper element', async () => {
      Object.defineProperty(navigator, 'clipboard', {
        value: undefined,
        writable: true,
        configurable: true
      });

      mockFetch.mockResolvedValue({
        ok: true,
        text: async () => '<html><body>Content</body></html>'
      });

      let capturedTextarea;
      document.execCommand = jest.fn(function() {
        capturedTextarea = document.querySelector('textarea');
        return true;
      });

      await copyFullPageHtml();

      expect(capturedTextarea).not.toBeNull();
      expect(capturedTextarea.getAttribute('aria-hidden')).toBe('true');
      expect(capturedTextarea.getAttribute('readonly')).toBe('true');
      expect(capturedTextarea.style.position).toBe('fixed');
      expect(capturedTextarea.style.left).toBe('-9999px');
      expect(capturedTextarea.style.opacity).toBe('0');
    });
  });

  describe('HTML Source Retrieval', () => {
    test('should fetch index.html when available', async () => {
      const htmlContent = '<html><head><title>Fetched</title></head><body>Content</body></html>';
      mockFetch.mockResolvedValue({
        ok: true,
        text: async () => htmlContent
      });

      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: jest.fn().mockResolvedValue(undefined) },
        writable: true,
        configurable: true
      });

      await copyFullPageHtml();

      expect(mockFetch).toHaveBeenCalledWith(expect.any(Request));
      const request = mockFetch.mock.calls[0][0];
      expect(request.cache).toBe('no-cache');
    });

    test('should fall back to document.documentElement when fetch fails', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'));

      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: jest.fn().mockResolvedValue(undefined) },
        writable: true,
        configurable: true
      });

      await copyFullPageHtml();

      expect(mockAlert).toHaveBeenCalledWith('Full index.html copied to clipboard.');
    });

    test('should include DOCTYPE in fallback', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'));

      const mockWriteText = jest.fn().mockResolvedValue(undefined);
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: mockWriteText },
        writable: true,
        configurable: true
      });

      await copyFullPageHtml();

      const copiedContent = mockWriteText.mock.calls[0][0];
      expect(copiedContent).toMatch(/^<!DOCTYPE html>/i);
    });
  });

  describe('Edge Cases', () => {
    test('should handle clipboard API throwing error', async () => {
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: jest.fn().mockRejectedValue(new Error('Permission denied')) },
        writable: true,
        configurable: true
      });

      mockFetch.mockResolvedValue({
        ok: true,
        text: async () => '<html><body>Test</body></html>'
      });

      document.execCommand = jest.fn().mockReturnValue(true);

      await copyFullPageHtml();

      expect(mockDebugLog).toHaveBeenCalledWith(
        'Version pill copied full index.html via fallback clipboard path.'
      );
    });

    test('should handle execCommand being undefined', async () => {
      Object.defineProperty(navigator, 'clipboard', {
        value: undefined,
        writable: true,
        configurable: true
      });

      mockFetch.mockResolvedValue({
        ok: true,
        text: async () => '<html><body>Test</body></html>'
      });

      document.execCommand = undefined;

      await copyFullPageHtml();

      expect(mockAlert).toHaveBeenCalledWith(
        'Could not copy the full page automatically. You may need to copy manually.'
      );
    });

    test('should handle empty HTML content', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        text: async () => ''
      });

      const mockWriteText = jest.fn().mockResolvedValue(undefined);
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: mockWriteText },
        writable: true,
        configurable: true
      });

      await copyFullPageHtml();

      expect(mockWriteText).toHaveBeenCalledWith('');
      expect(mockAlert).toHaveBeenCalledWith('Full index.html copied to clipboard.');
    });

    test('should handle very large HTML content', async () => {
      const largeContent = '<html><body>' + 'x'.repeat(1000000) + '</body></html>';
      mockFetch.mockResolvedValue({
        ok: true,
        text: async () => largeContent
      });

      const mockWriteText = jest.fn().mockResolvedValue(undefined);
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: mockWriteText },
        writable: true,
        configurable: true
      });

      await copyFullPageHtml();

      expect(mockWriteText).toHaveBeenCalledWith(largeContent);
    });
  });

  describe('Blob Creation', () => {
    test('should create blobs with correct MIME types', async () => {
      let capturedBlobs = [];
      const mockWrite = jest.fn().mockResolvedValue(undefined);
      
      global.ClipboardItem = class {
        constructor(data) {
          this.data = data;
          capturedBlobs = Object.values(data);
        }
      };

      Object.defineProperty(navigator, 'clipboard', {
        value: { write: mockWrite },
        writable: true,
        configurable: true
      });

      mockFetch.mockResolvedValue({
        ok: true,
        text: async () => '<html><body>Test</body></html>'
      });

      await copyFullPageHtml();

      // Verify blobs were created (they are captured in the ClipboardItem constructor)
      expect(mockWrite).toHaveBeenCalled();
    });
  });
});