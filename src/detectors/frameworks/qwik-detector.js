export function detectQwik(pageData) {
  const evidence = [];

  const html = pageData.dom.html;
  const hasQwikAttributes = html.includes("q:container") || html.includes("q:render") || html.includes("q:slot") || html.includes("q:base");
  const hasQwikVersion = html.includes("qv=");

  if (hasQwikAttributes) {
    evidence.push({
      type: "strong",
      message: "Found Qwik q:* attributes",
    });
  }

  if (hasQwikVersion) {
    evidence.push({
      type: "strong",
      decisive: true,
      message: "Found Qwik version marker",
    });
  } else {
    const hasQwikScripts = pageData.scripts.srcList.some((src) => src.includes("/q-") || src.toLowerCase().includes("qwik"));
    const hasQwikRuntime = pageData.scripts.content?.some((content) => content.includes("qrl(") || content.includes("QwikLoader") || content.includes("window.qwik"));

    if (hasQwikScripts) {
      evidence.push({
        type: "medium",
        message: "Found Qwik script bundle",
      });
    }

    if (hasQwikRuntime) {
      evidence.push({
        type: "medium",
        message: "Found Qwik runtime",
      });
    }
  }

  return {
    name: "Qwik",
    type: "framework",
    evidence,
  };
}
