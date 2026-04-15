export function detectEmber(pageData) {
  const evidence = [];

  const html = pageData.dom.html;
  const hasEmberGlobal = typeof window.Ember !== "undefined" && typeof window.Ember === "object";
  const hasEmberDOM = html.includes("ember-view") || html.includes("data-ember-action");
  const hasEmberRuntime = pageData.scripts.content?.some((content) => content.includes("Ember.Application") || content.includes("Ember.Component") || content.includes("Ember.Route"));
  const hasEmberScript = pageData.scripts.srcList.some((src) => /ember(\.min)?\.js/i.test(src));

  if (hasEmberGlobal && hasEmberDOM) {
    evidence.push({
      type: "strong",
      decisive: true,
      message: "Found Ember global with DOM markers",
    });
  }

  if (hasEmberDOM && hasEmberRuntime) {
    evidence.push({
      type: "strong",
      message: "Found Ember DOM with runtime usage",
    });
  }

  if (hasEmberScript && hasEmberRuntime) {
    evidence.push({
      type: "medium",
      message: "Found Ember script with runtime usage",
    });
  }

  return {
    name: "Ember.js",
    type: "framework",
    evidence,
  };
}
