chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "STORE_STACK_RESULTS" && sender.tab?.id) {
    chrome.storage.local.set({
      [`stackResults_${sender.tab.id}`]: message.data,
    });
  }

  if (message.type === "GET_TAB_ID") {
    sendResponse({ tabId: sender.tab?.id });
  }
});

chrome.webRequest.onHeadersReceived.addListener(
  (details) => {
    const tabId = details.tabId;

    if (tabId < 0) return;

    const headers = details.responseHeaders || [];
    const headerMap = {};

    headers.forEach((h) => {
      if (h.name && h.value) {
        headerMap[h.name.toLowerCase()] = h.value.toLowerCase();
      }
    });

    const cdnInfo = detectCDNFromHeaders(headerMap);

    if (!cdnInfo) return;

    chrome.storage.local.get(`cdnHeaders_${tabId}`, (data) => {
      const existing = data[`cdnHeaders_${tabId}`];

      if (!existing || cdnInfo.confidence > existing.confidence) {
        chrome.storage.local.set({
          [`cdnHeaders_${tabId}`]: cdnInfo,
        });
      }
    });
  },
  { urls: ["<all_urls>"] },
  ["responseHeaders"],
);

function detectCDNFromHeaders(headers) {
  // Cloudflare
  if (headers["cf-ray"] || headers["server"]?.includes("cloudflare")) {
    return {
      edge: "Cloudflare",
      source: "headers",
      confidence: 95,
    };
  }

  // CloudFront
  if (headers["x-amz-cf-id"] || headers["via"]?.includes("cloudfront") || headers["x-cache"]?.includes("cloudfront")) {
    return {
      edge: "CloudFront",
      source: "headers",
      confidence: 95,
    };
  }

  // Fastly
  if (headers["x-served-by"]?.includes("fastly") || headers["via"]?.includes("fastly")) {
    return {
      edge: "Fastly",
      source: "headers",
      confidence: 95,
    };
  }

  // Akamai
  if (headers["server"]?.includes("akamai") || headers["x-akamai-transformed"]) {
    return {
      edge: "Akamai",
      source: "headers",
      confidence: 95,
    };
  }

  // Imperva / Incapsula
  if (headers["x-iinfo"] || headers["server"]?.includes("incapsula")) {
    return {
      edge: "Imperva",
      source: "headers",
      confidence: 90,
    };
  }

  return null;
}
