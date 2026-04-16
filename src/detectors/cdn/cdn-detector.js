const CDN_PATTERNS = {
  // Edge CDNs
  Cloudflare: ["cdnjs.cloudflare.com", "cloudflare"],
  CloudFront: ["cloudfront.net"],
  Fastly: ["fastly.net", "fastlylb.net"],
  Akamai: ["akamai.net", "akamaized.net", "akamaiedge.net"],
  BunnyCDN: ["bunnycdn.com"],
  KeyCDN: ["kxcdn.com"],
  StackPath: ["stackpathdns.com", "stackpathcdn.com"],
  Imperva: ["imperva.com", "incapsula.com"],

  // Asset CDNs
  jsDelivr: ["cdn.jsdelivr.net"],
  UNPKG: ["unpkg.com"],
  Skypack: ["cdn.skypack.dev"],
  "esm.sh": ["esm.sh"],
  JSPM: ["jspm.dev"],

  // Fonts
  "Google Fonts": ["fonts.googleapis.com", "fonts.gstatic.com"],
  AdobeFonts: ["use.typekit.net"],

  // Libraries / UI / media
  BootstrapCDN: ["stackpath.bootstrapcdn.com", "maxcdn.bootstrapcdn.com"],
  FontAwesome: ["use.fontawesome.com", "cdnjs.cloudflare.com/ajax/libs/font-awesome"],
  Cloudinary: ["res.cloudinary.com"],
  Imgix: ["imgix.net"],
  ImageKit: ["imagekit.io"],

  // Video / streaming / media CDNs
  VimeoCDN: ["vimeocdn.com"],
  YouTube: ["ytimg.com", "youtube.com/s/player"],

  // Common static delivery
  FirebaseHosting: ["firebaseapp.com", "web.app"],
  GitHubPages: ["github.io"],
  Netlify: ["netlify.app"],
  Vercel: ["vercel.app"],
};

const EDGE_CDNS = ["Cloudflare", "CloudFront", "Fastly", "Akamai", "BunnyCDN", "KeyCDN", "StackPath", "Imperva"];
const ASSET_CDNS = ["jsDelivr", "UNPKG", "Skypack", "esm.sh", "JSPM", "Google Fonts", "AdobeFonts", "BootstrapCDN", "FontAwesome", "Cloudinary", "Imgix", "ImageKit", "VimeoCDN", "YouTube"];
const PLATFORM_CDNS = ["FirebaseHosting", "GitHubPages", "Netlify", "Vercel"];

export function detectCDN(pageData) {
  const evidence = [];
  const hits = {};

  const html = pageData?.dom?.html || "";
  const scriptSrcs = pageData?.scripts?.srcList || [];

  const linkHrefs = Array.from(document.querySelectorAll("link"))
    .map((l) => l.href)
    .filter(Boolean);

  const imgSrcs = Array.from(document.querySelectorAll("img"))
    .map((i) => i.src)
    .filter(Boolean);

  const sources = [html, ...scriptSrcs, ...linkHrefs, ...imgSrcs];

  for (const [provider, patterns] of Object.entries(CDN_PATTERNS)) {
    let matchCount = 0;

    patterns.forEach((pattern) => {
      const found = sources.some((value) => value.includes(pattern));
      if (found) matchCount++;
    });

    if (matchCount > 0) {
      hits[provider] = matchCount;
    }
  }

  if (Object.keys(hits).length === 0) {
    return {
      name: "CDN Usage",
      type: "infrastructure",
      detected: false,
      confidence: 0,
      edge: null,
      assets: [],
      evidence: [],
    };
  }

  const sortedProviders = Object.entries(hits).sort((a, b) => b[1] - a[1]);

  let edge = null;
  const assets = [];

  let platform = null;

  sortedProviders.forEach(([name]) => {
    if (EDGE_CDNS.includes(name)) {
      if (!edge) edge = name;
    } else if (PLATFORM_CDNS.includes(name)) {
      if (!platform) platform = name;
    } else if (ASSET_CDNS.includes(name)) {
      assets.push(name);
    }
  });

  if (edge) {
    evidence.push({
      type: "strong",
      message: `${edge} detected as edge CDN`,
    });
  }

  if (assets.length > 0) {
    evidence.push({
      type: "medium",
      message: `Asset CDNs detected: ${assets.join(", ")}`,
    });
  }

  let confidence = 0;

  if (edge) {
    confidence += 70;
  } else if (platform) {
    confidence += 50;
  } else if (assets.length > 0) {
    confidence += 20;
  }

  confidence += assets.length * 10;
  confidence = Math.min(100, confidence);

  return {
    name: "CDN Usage",
    type: "infrastructure",
    detected: !!(edge || platform || assets.length),
    confidence,
    edge,
    platform,
    assets,
    evidence,
  };
}
