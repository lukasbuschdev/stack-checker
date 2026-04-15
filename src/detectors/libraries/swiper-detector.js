export function detectSwiper(pageData) {
  const evidence = [];

  const classes = pageData.dom.classList;
  const hasCoreStructure = classes.includes("swiper") && classes.includes("swiper-wrapper") && classes.includes("swiper-slide");
  const hasSwiperRuntime = pageData.scripts.content?.some((content) => content.includes("new Swiper("));
  const hasSwiperScript = pageData.scripts.srcList.some((src) => /swiper(\.bundle)?(\.min)?\.js/i.test(src));

  if (hasCoreStructure && hasSwiperRuntime) {
    evidence.push({
      type: "strong",
      message: "Found Swiper structure with initialization",
    });
  }

  if (hasCoreStructure && hasSwiperScript) {
    evidence.push({
      type: "strong",
      message: "Found Swiper structure with script",
    });
  }

  if (hasSwiperRuntime && hasSwiperScript) {
    evidence.push({
      type: "medium",
      message: "Found Swiper runtime with script",
    });
  }

  return {
    name: "Swiper",
    type: "library",
    evidence,
  };
}
