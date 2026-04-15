export function detectJoomla(pageData) {
  const evidence = [];

  const html = pageData.dom.html;
  const hasJoomlaPaths = html.includes("option=com_") || html.includes("/media/system/js/");
  const hasJoomlaMeta = (pageData.meta.generator || "").toLowerCase().includes("joomla");

  if (hasJoomlaPaths) {
    evidence.push({
      type: "strong",
      message: "Found Joomla paths",
    });
  }

  if (hasJoomlaMeta) {
    evidence.push({
      type: "strong",
      decisive: true,
      message: "Found Joomla generator meta",
    });
  }

  return {
    name: "Joomla",
    type: "cms",
    evidence,
  };
}
