chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "STORE_STACK_RESULTS" && sender.tab?.id) {
    chrome.storage.local.set({
      [`stackResults_${sender.tab.id}`]: message.data,
    });
  }
});
