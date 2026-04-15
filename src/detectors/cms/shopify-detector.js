export function detectShopify(pageData) {
  const evidence = [];

  const html = pageData.dom.html;
  const hasShopifyCDN = html.includes("cdn.shopify.com") || html.includes("/cdn/shop/");
  const hasShopifyGlobal = typeof window.Shopify !== "undefined" && typeof window.Shopify === "object";
  const hasShopifyRuntime = typeof window.Shopify?.theme !== "undefined" || typeof window.Shopify?.shop !== "undefined";
  const hasShopifyScript = pageData.scripts.srcList.some((src) => /cdn\.shopify\.com/i.test(src));

  if (hasShopifyGlobal && hasShopifyRuntime) {
    evidence.push({
      type: "strong",
      decisive: true,
      message: "Found Shopify global with runtime properties",
    });
  }

  if (hasShopifyCDN && hasShopifyScript) {
    evidence.push({
      type: "strong",
      message: "Found Shopify CDN with script",
    });
  }

  if (hasShopifyGlobal && hasShopifyCDN) {
    evidence.push({
      type: "strong",
      message: "Found Shopify global with CDN",
    });
  }

  return {
    name: "Shopify",
    type: "cms",
    evidence,
  };
}
