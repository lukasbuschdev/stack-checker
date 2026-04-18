export function scanDOM() {
  const rawElements = Array.from(document.querySelectorAll("*")).slice(0, 1000);

  const elements = rawElements.map((el) => {
    const style = window.getComputedStyle(el);

    return {
      tagName: el.tagName,
      classList: Array.from(el.classList),
      attributes: Array.from(el.attributes).map((attr) => attr.name),

      computedStyle: {
        animationName: style.animationName,
        transitionDuration: style.transitionDuration,
        transitionProperty: style.transitionProperty,
        boxShadow: style.boxShadow,
        filter: style.filter,
        backdropFilter: style.backdropFilter || style.webkitBackdropFilter || "none",
        position: style.position,
        backgroundImage: style.backgroundImage,
      },
    };
  });

  const elementsWithNgVersion = rawElements.filter((el) => el.hasAttribute("ng-version"));
  const elementsWithNgServerContext = rawElements.filter((el) => el.hasAttribute("ng-server-context"));
  const allAttributeNames = rawElements.flatMap((el) => Array.from(el.attributes).map((attr) => attr.name));

  return {
    html: document.documentElement.outerHTML,
    bodyText: document.body?.innerText || "",
    hasNgVersion: elementsWithNgVersion.length > 0,
    hasNgServerContext: elementsWithNgServerContext.length > 0,
    ngVersionElements: elementsWithNgVersion.map((el) => el.tagName),
    tags: rawElements.map((el) => el.tagName),
    classList: rawElements.flatMap((el) => Array.from(el.classList)),
    dataAttributes: rawElements.flatMap((el) =>
      Array.from(el.attributes)
        .filter((attr) => attr.name.startsWith("data-"))
        .map((attr) => attr.name),
    ),
    ngReflectAttributes: allAttributeNames.filter((name) => name.startsWith("ng-reflect-")),
    angularScopedAttributes: allAttributeNames.filter((name) => name.startsWith("_ngcontent-") || name.startsWith("_nghost-")),
    elements,
  };
}
