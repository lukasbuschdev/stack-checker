export function scanGlobals() {
  const w = window;

  return {
    hasReactDevtoolsHook: !!w.__REACT_DEVTOOLS_GLOBAL_HOOK__,
    hasVue: !!w.__VUE__,
    hasNg: !!w.ng,
    hasNext: !!w.__NEXT_DATA__,
    hasNuxt: !!w.__NUXT__,
    hasJQuery: !!w.jQuery || !!w.$,
  };
}
