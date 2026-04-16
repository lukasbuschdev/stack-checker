export function detectSEO(pageData) {
  const evidence = [];

  const doc = document;
  const title = doc.querySelector("title")?.innerText || null;
  const description = doc.querySelector('meta[name="description"]')?.content || null;
  const canonical = doc.querySelector('link[rel="canonical"]')?.href || null;
  const lang = doc.documentElement.lang || null;
  const h1s = doc.querySelectorAll("h1");
  const h2s = doc.querySelectorAll("h2");
  const images = Array.from(doc.querySelectorAll("img"));
  const imagesWithoutAlt = images.filter((img) => !img.alt || img.alt.trim() === "");
  const viewport = doc.querySelector('meta[name="viewport"]');
  const robots = doc.querySelector('meta[name="robots"]')?.content || null;
  const ogTags = doc.querySelectorAll('meta[property^="og:"]');
  const twitterTags = doc.querySelectorAll('meta[name^="twitter:"]');
  const insights = [];

  // Title
  if (!title) {
    insights.push({ level: "critical", message: "Missing title tag" });
  } else if (title.length < 30) {
    insights.push({ level: "warning", message: "Title is quite short" });
  } else if (title.length > 60) {
    insights.push({ level: "warning", message: "Title may be too long" });
  } else {
    insights.push({ level: "good", message: "Title length looks good" });
  }

  // Description
  if (!description) {
    insights.push({ level: "critical", message: "Missing meta description" });
  } else if (description.length < 70) {
    insights.push({ level: "warning", message: "Meta description is quite short" });
  } else if (description.length > 160) {
    insights.push({ level: "warning", message: "Meta description may be too long" });
  } else {
    insights.push({ level: "good", message: "Meta description length looks good" });
  }

  // H1
  if (h1s.length === 0) {
    insights.push({ level: "critical", message: "No H1 tag found" });
  } else if (h1s.length > 1) {
    insights.push({ level: "warning", message: "Multiple H1 tags detected" });
  } else {
    insights.push({ level: "good", message: "Single H1 tag found" });
  }

  // Images
  if (imagesWithoutAlt.length > 0) {
    insights.push({
      level: "warning",
      message: `${imagesWithoutAlt.length} images missing alt text`,
    });
  } else if (images.length > 0) {
    insights.push({ level: "good", message: "All images contain alt text" });
  }

  // Canonical
  if (!canonical) {
    insights.push({ level: "warning", message: "Missing canonical tag" });
  }

  // Viewport
  if (!viewport) {
    insights.push({ level: "critical", message: "Missing viewport meta tag" });
  }

  // Open Graph
  if (ogTags.length === 0) {
    insights.push({ level: "warning", message: "No Open Graph tags detected" });
  }

  // Twitter
  if (twitterTags.length === 0) {
    insights.push({ level: "warning", message: "No Twitter card tags detected" });
  }

  // Lang
  if (!lang) {
    insights.push({ level: "warning", message: "Missing HTML lang attribute" });
  }

  return {
    name: "SEO",
    type: "seo",
    detected: true,

    data: {
      title,
      description,
      canonical,
      lang,
      headings: {
        h1: h1s.length,
        h2: h2s.length,
      },
      images: {
        total: images.length,
        missingAlt: imagesWithoutAlt.length,
      },
      meta: {
        viewport: !!viewport,
        robots,
        openGraph: ogTags.length,
        twitter: twitterTags.length,
      },
    },

    insights,
    evidence,
  };
}
