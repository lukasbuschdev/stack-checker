export function scanDOM() {
  const elements = Array.from(document.querySelectorAll("*"));

  const elementsWithNgVersion = elements.filter((el) => el.hasAttribute("ng-version"));

  const elementsWithNgServerContext = elements.filter((el) => el.hasAttribute("ng-server-context"));

  const allAttributeNames = elements.flatMap((el) => Array.from(el.attributes).map((attr) => attr.name));

  return {
    html: document.documentElement.outerHTML,
    hasNgVersion: elementsWithNgVersion.length > 0,
    hasNgServerContext: elementsWithNgServerContext.length > 0,
    ngVersionElements: elementsWithNgVersion.map((el) => el.tagName),
    tags: elements.map((el) => el.tagName),
    classList: elements.flatMap((el) => Array.from(el.classList)),
    dataAttributes: elements.flatMap((el) =>
      Array.from(el.attributes)
        .filter((attr) => attr.name.startsWith("data-"))
        .map((attr) => attr.name),
    ),
    ngReflectAttributes: allAttributeNames.filter((name) => name.startsWith("ng-reflect-")),
    angularScopedAttributes: allAttributeNames.filter((name) => name.startsWith("_ngcontent-") || name.startsWith("_nghost-")),
  };
}
