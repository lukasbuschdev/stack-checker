import { calculateSeoScore } from "../../scoring/calculations";

export function detectSEO() {
  const insights = [];

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
  const structuredData = doc.querySelectorAll('script[type="application/ld+json"]');
  const internalLinks = Array.from(doc.querySelectorAll("a")).filter((a) => a.href && a.href.startsWith(location.origin));
  const externalLinks = Array.from(doc.querySelectorAll("a")).filter((a) => a.href && !a.href.startsWith(location.origin));

  const source = "SEO";
  let isTitleAligned = true;

  if (!title) {
    insights.push({
      level: "critical",
      message: "Missing <title> tag. Search engines rely on it as the primary ranking and click signal. Add a concise, keyword-focused title (30-60 characters).",
      source,
    });
  } else if (title.length < 30) {
    insights.push({
      level: "warning",
      message: "Title is too short. It likely lacks context and keywords. Expand it to clearly describe the page topic and include relevant search terms.",
      source,
    });
  } else if (title.length > 60) {
    insights.push({
      level: "warning",
      message: "Title is too long and may be truncated in search results. Keep it under ~60 characters while preserving important keywords.",
      source,
    });
  } else {
    insights.push({ level: "good", message: "Title length is well optimized for search engines and readability.", source });
  }

  if (title && h1s.length === 1) {
    const h1Text = h1s[0].innerText.toLowerCase();
    const titleText = title.toLowerCase();

    const words = h1Text.split(" ").slice(0, 3).join(" ");

    if (!titleText.includes(words)) {
      isTitleAligned = false;

      insights.push({
        level: "warning",
        message: "Title and H1 are not aligned. This weakens topical relevance. Use similar keywords to clearly signal the page topic to search engines.",
        source,
      });
    }
  }

  if (!description) {
    insights.push({
      level: "critical",
      message: "Missing meta description. This reduces click-through rate in search results. Add a compelling summary (70–160 characters) with relevant keywords.",
      source,
    });
  } else if (description.length < 70) {
    insights.push({
      level: "warning",
      message: "Meta description is too short. It may not provide enough context to attract clicks. Expand it to better summarize the page.",
      source,
    });
  } else if (description.length > 160) {
    insights.push({
      level: "warning",
      message: "Meta description is too long and may be truncated. Keep it under ~160 characters while keeping it descriptive and engaging.",
      source,
    });
  } else {
    insights.push({ level: "good", message: "Meta description length is well optimized for search visibility and click-through rate.", source });
  }

  if (h1s.length === 0) {
    insights.push({
      level: "critical",
      message: "No H1 found. This is a key structural and SEO signal. Add a single main heading that clearly defines the page topic.",
      source,
    });
  } else if (h1s.length > 1) {
    insights.push({
      level: "warning",
      message: "Multiple H1 tags detected. This can confuse search engines. Use one primary H1 and structure the rest with H2-H6.",
      source,
    });
  } else {
    insights.push({ level: "good", message: "Single H1 detected. Page structure is clear and SEO-friendly.", source });
  }

  if (imagesWithoutAlt.length > 0) {
    insights.push({
      level: "warning",
      message: `${imagesWithoutAlt.length} images missing alt text. This reduces accessibility and image SEO. Add descriptive alt attributes explaining the image content.`,
      source,
    });
  } else if (images.length > 0) {
    insights.push({ level: "good", message: "All images have alt text. This improves accessibility and helps search engines understand visual content.", source });
  }

  if (!canonical) {
    insights.push({
      level: "warning",
      message: "Missing canonical URL. This can cause duplicate content issues. Define a canonical link to indicate the preferred version of the page.",
      source,
    });
  }

  if (!viewport) {
    insights.push({
      level: "critical",
      message: "Missing viewport meta tag. This breaks mobile rendering and hurts SEO. Add a responsive viewport configuration.",
      source,
    });
  }

  if (ogTags.length === 0) {
    insights.push({
      level: "warning",
      message: "No Open Graph tags detected. Pages may display poorly when shared. Add og:title, og:description, and og:image.",
      source,
    });
  }

  if (twitterTags.length === 0) {
    insights.push({
      level: "warning",
      message: "No Twitter card metadata detected. Add twitter tags to control how content appears when shared.",
      source,
    });
  }

  if (!lang) {
    insights.push({
      level: "warning",
      message: "Missing HTML lang attribute. This affects accessibility and international SEO. Define the document language.",
      source,
    });
  }

  if (robots && robots.includes("noindex")) {
    insights.push({
      level: "critical",
      message: "Page is set to 'noindex'. Search engines will ignore it. Remove this directive if the page should appear in search results.",
      source,
    });
  }

  if (structuredData.length === 0) {
    insights.push({
      level: "warning",
      message: "No structured data detected. Add schema.org markup to enable rich results and improve visibility in search.",
      source,
    });
  } else {
    insights.push({
      level: "good",
      message: "Structured data detected. This can enhance search result appearance (rich snippets).",
      source,
    });
  }

  if (internalLinks.length < 3) {
    insights.push({
      level: "warning",
      message: "Few internal links detected. This weakens site structure and crawlability. Add links to related pages.",
      source,
    });
  }

  if (externalLinks.length === 0) {
    insights.push({
      level: "warning",
      message: "No external links detected. Linking to authoritative sources can improve trust and SEO signals.",
      source,
    });
  }

  if (!title || !description || h1s.length === 0) {
    insights.push({
      level: "critical",
      message: "Core SEO elements missing (title, description, or H1). This significantly limits search visibility.",
      source,
    });
  }

  const score = calculateSeoScore({
    title,
    description,
    h1Count: h1s.length,
    missingAlt: imagesWithoutAlt.length,
    hasViewport: !!viewport,
    robots,
    structuredDataCount: structuredData.length,
    internalLinksCount: internalLinks.length,
    externalLinksCount: externalLinks.length,
    hasCanonical: !!canonical,
    hasOG: ogTags.length > 0,
    hasTwitter: twitterTags.length > 0,
    hasLang: !!lang,
    isTitleAligned,
  });

  return {
    name: "SEO",
    type: "seo",
    detected: true,
    score: score,

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
        structuredData: structuredData.length,
      },
      links: {
        internal: internalLinks.length,
        external: externalLinks.length,
      },
    },

    insights,
  };
}
