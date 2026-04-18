import{a as e,i as t,n,o as r,r as i,t as a}from"./assets/technology-fallback-DXVk9RF2.js";function o(e){let t=(e.evidence||[]).map(e=>`<li>${e.message}</li>`).join(``),n=e.edge||e.platform||(e.assets&&e.assets.length>0?`Asset CDN detected`:`No CDN detected`),r=e.source===`headers`?`server headers`:`resource analysis`;return`
    <div class="result-section"><strong>Delivery & Hosting</strong></div>
    <div class="result-card column gap-30">
      <div class="result-header">
        <span><strong>${n}</strong></span>
        <span class="metric ${i(e.confidence)}">
          ${e.confidence}%
        </span>
      </div>

      <div class="metric-block">
        <span class="block-title">Details</span>

        ${s(`Detected via`,r)}
        ${e.edge?s(`Edge`,e.edge):``}
        ${e.platform?s(`Platform`,e.platform):``}
        ${e.assets&&e.assets.length>0?s(`Assets`,e.assets.join(`, `)):``}

      </div>

      <div class="metric-block">
        <span class="block-title">Evidence</span>
        ${t?`<ul>${t}</ul>`:`<span class="muted">No clear CDN evidence found</span>`}
      </div>
    </div>
  `}function s(e,t){return`
    <div class="metric-row">
      <span>${e}</span>
      <span class="white">${t}</span>
    </div>
  `}var c={animatedCount:{warning:15,critical:40},expensiveAnimationCount:{warning:3,critical:10},fixedCount:{warning:5,critical:10},hoverRules:{warning:10,critical:25},boxShadowCount:{warning:15,critical:40},filterCount:{warning:3,critical:10},backdropFilterCount:{warning:1,critical:5},gradientCount:{warning:20,critical:50},layoutAnimationCount:{warning:2,critical:5}};function l(e){let t=e.data,r=`
    ${u(`Animated elements`,t.animatedCount,c.animatedCount)}
    ${u(`Expensive animations`,t.expensiveAnimationCount,c.expensiveAnimationCount)}
    ${u(`Fixed elements`,t.fixedCount,c.fixedCount)}
    ${u(`Hover rules`,t.hoverRules,c.hoverRules)}
    ${u(`Reduced motion`,t.hasReducedMotionSupport?`supported`:`not supported`,null,!t.hasReducedMotionSupport)}
    ${u(`Box shadows`,t.boxShadowCount,c.boxShadowCount)}
    ${u(`Filters`,t.filterCount,c.filterCount)}
    ${u(`Backdrop filters`,t.backdropFilterCount,c.backdropFilterCount)}
    ${u(`Gradients`,t.gradientCount,c.gradientCount)}
    ${u(`GPU-friendly animations`,t.gpuFriendlyAnimationCount)}
    ${u(`Layout-triggering animations`,t.layoutAnimationCount,c.layoutAnimationCount)}
  `,i={critical:[],warning:[],good:[]};(e.insights||[]).forEach(e=>{i[e.level]&&i[e.level].push(e.message)});let a=`
    ${n(`Critical Issues`,i.critical,`critical`)}
    ${n(`Warnings`,i.warning,`warning`)}
    ${n(`Good Signals`,i.good,`good`)}
  `;return`
    <div class="result-section"><strong>Interaction Performance</strong></div>
    <div class="result-card column gap-30">
      <div class="metric-block">
        <span class="block-title">Motion & Complexity</span>
        ${r}
      </div>

      ${a.trim()?`
          <div class="insights column gap-10">
            <span class="block-title mt-15"><strong>Analysis</strong></span>
            ${a}
          </div>
        `:`
          <span class="muted">
            No major interaction or animation issues detected
          </span>
        `}
    </div>
  `}function u(e,t,n=null,r=!1){let i=``;return i=r?`critical`:n&&t!=null?t>=n.critical?`critical`:t>=n.warning?`warning`:`good`:`white`,`
    <div class="metric-row">
      <span>${e}</span>
      <span class="metric ${i}">${t}</span>
    </div>
  `}function d(e){let{coreWebVitals:t,bundleAnalysis:i,renderBlocking:a}=e.data,o=t?.lcp?f(`LCP`,t.lcp.value,p(t.lcp.raw),`(${t.lcp.rating})`):f(`LCP`,`analyzing...`,``,``,!0),s=t?.cls?f(`CLS`,t.cls.value,m(t.cls.raw),`(${t.cls.rating})`):f(`CLS`,`analyzing...`,``,``,!0),c=i?.totalJSSize?f(`Total JS size`,i.totalJSSize.value,h(i.totalJSSize.raw)):f(`Total JS size`,`not available`,``,``,!0),l=i?.jsFileCount===void 0?f(`JS files`,`not available`,``,``,!0):f(`JS files`,i.jsFileCount,g(i.jsFileCount)),u=i?.largestScript?f(`Largest script`,`${r(y(i.largestScript.name))} (${i.largestScript.size})`):f(`Largest script`,`not available`,``,``,!0),d=a?f(`Blocking CSS`,a.blockingCSS,_(a.blockingCSS)):f(`Blocking CSS`,`not available`,``,``,!0),b=a?f(`Sync scripts in head`,a.syncScriptsInHead,v(a.syncScriptsInHead)):f(`Sync scripts`,`not available`,``,``,!0),x={critical:[],warning:[],good:[]};(e.insights||[]).forEach(e=>{x[e.level]&&x[e.level].push(e.message)});let S=`
    ${n(`Critical Issues`,x.critical,`critical`)}
    ${n(`Warnings`,x.warning,`warning`)}
    ${n(`Good Signals`,x.good,`good`)}
  `;return`
    <div class="result-section"><strong>Loading Performance</strong></div>
    <div class="result-card column gap-30">
      <div class="metric-block">
        <span class="block-title">Core Web Vitals</span>
        ${o}
        ${s}
      </div>

      <div class="metric-block">
        <span class="block-title">Bundle Analysis</span>
        ${c}
        ${l}
        ${u}
      </div>

      <div class="metric-block">
        <span class="block-title">Render Blocking</span>
        ${d}
        ${b}
      </div>

      ${S.trim()?`
          <div class="insights column gap-10">
            <span class="block-title mt-15"><strong>Analysis</strong></span>
            ${S}
          </div>
        `:``}
    </div>
  `}function f(e,t,n=``,r=``,i=!1){return`
    <div class="metric-row">
      <span class="${i?`muted`:``}">${e}</span>
      <span class="${i?`muted`:`metric ${n}`}">
        ${t} ${r||``}
      </span>
    </div>
  `}function p(e){if(e==null)return``;let t=e/1e3;return t<=1.8?`good`:t<=3?`warning`:`critical`}function m(e){return e==null?``:e<=.1?`good`:e<=.25?`warning`:`critical`}function h(e){if(e==null)return``;let t=e/1024;return t<150?`good`:t<400?`warning`:`critical`}function g(e){return e<10?`good`:e<25?`warning`:`critical`}function _(e){return e===0?`good`:e<=2?`warning`:`critical`}function v(e){return e===0?`good`:e<=2?`warning`:`critical`}function y(e){try{return e.split(`/`).pop().split(`?`)[0]}catch{return e}}function b(e,t){let n=(e.evidence||[]).map(e=>`<li>${e.message}</li>`).join(``),r=[...e.insights||[],...t].map(e=>`<li>${e}</li>`).join(``);return`
    <div class="result-section"><strong>Primary Technology</strong></div>
    <div class="result-card column gap-30">
      <div class="result-header">
        <span>
          <strong>[${x(e.type)}]</strong>
          ${e.name}
        </span>
        <span class="metric ${i(e.confidence)}">
          ${e.confidence}%
        </span>
      </div>

      <div class="metric-block">
        <span class="block-title">Evidence</span>

        ${n?`<ul>${n}</ul>`:`<span class="muted">No direct evidence found</span>`}
      </div>

      ${r?`
          <div class="insights column gap-10">
            <span class="block-title mt-15"><strong>Analysis</strong></span>
            <ul>${r}</ul>
          </div>
        `:``}
    </div>
  `}function x(e){switch(e){case`framework`:return`Framework`;case`library`:return`Library`;case`cms`:return`CMS`;default:return`Other`}}function S(e){let t=(e.evidence||[]).map(e=>`<li>${e.message}</li>`).join(``);return`
    <div class="result-section"><strong>Rendering Strategy</strong></div>
    <div class="result-card column gap-30">
      <div class="result-header">
        <span>
          <strong>${C(e.strategy)}</strong>
        </span>
        <span class="metric ${i(e.confidence)}">
          ${e.confidence}%
        </span>
      </div>

      <div class="metric-block">
        <span class="block-title">Evidence</span>
        ${t?`<ul>${t}</ul>`:`<span class="muted">No clear rendering evidence found</span>`}
      </div>
    </div>
  `}function C(e){switch(e){case`SSR`:return`Server-side Rendering (SSR)`;case`SSG`:return`Static Site Generation (SSG)`;case`CSR`:return`Client-side Rendering (CSR)`;default:return`Unknown`}}function w(e){let t=(e.evidence||[]).map(e=>`<li>${e.message}</li>`).join(``),n=(e.insights||[]).map(e=>`<li>${e}</li>`).join(``);return`
    <div class="result-card column gap-30">
      <div class="result-header">
        <span>
          <strong>[${E(e.type)}]</strong>
          ${e.name}
        </span>
        <span class="metric ${i(e.confidence)}">
          ${e.confidence}%
        </span>
      </div>

      <div class="metric-block">
        <span class="block-title">Evidence</span>
        ${t?`<ul>${t}</ul>`:`<span class="muted">No direct evidence found</span>`}
      </div>

      ${n?`
          <div class="insights column gap-10">
            <span class="block-title"><strong>Analysis</strong></span>
            <ul>${n}</ul>
          </div>
        `:``}
    </div>
  `}function T(){return`
    <div class="result-card column gap-20">
      <span class="muted">
        No additional technologies detected. This may indicate a minimal or highly optimized setup.
      </span>
    </div>
  `}function E(e){switch(e){case`framework`:return`Framework`;case`library`:return`Library`;case`cms`:return`CMS`;default:return`Other`}}function D(e){let{title:t,description:n,canonical:i,lang:a,headings:o,images:s,meta:c}=e.data,l={critical:[],warning:[],good:[]};(e.insights||[]).forEach(e=>{l[e.level]&&l[e.level].push(e.message)});let u=`
    ${k(`Critical Issues`,l.critical,`critical`)}
    ${k(`Warnings`,l.warning,`warning`)}
    ${k(`Good Signals`,l.good,`good`)}
  `;return`
    <div class="result-section"><strong>SEO</strong></div>
    <div class="result-card column gap-30">
      <div class="metric-block">
        <span class="block-title">Structure</span>

        ${O(`Title`,t?r(t,50):`missing`,!t)}
        ${O(`Description`,n?r(n,70):`missing`,!n)}
        ${O(`Lang`,a??`missing`,!a)}
        ${O(`Canonical`,i?`set`:`missing`,!i)}
      </div>

      <div class="metric-block">
        <span class="block-title">Headings & Content</span>

        ${O(`H1`,o?.h1??0)}
        ${O(`H2`,o?.h2??0)}
        ${O(`Images`,`${s?.total??0} (${s?.missingAlt??0} missing alt)`)}
      </div>

      <div class="metric-block">
        <span class="block-title">Meta & Social</span>

        ${O(`Viewport`,c?.viewport?`set`:`missing`,!c?.viewport)}
        ${O(`Open Graph`,c?.openGraph??0)}
        ${O(`Twitter`,c?.twitter??0)}
      </div>

      ${u.trim()?`
          <div class="insights column gap-10">
            <span class="block-title"><strong>Analysis</strong></span>
            ${u}
          </div>
        `:``}
    </div>
  `}function O(e,t,n=!1){return`
    <div class="metric-row">
      <span class="${n?`muted`:``}">${e}</span>
      <span class="${n?`muted`:`white`}">${t}</span>
    </div>
  `}function k(e,t,n){return t.length?`
    <div class="insight-group ${n}">
      <span class="block-title mt-15"><strong>${e}</strong></span>
      <ul>
        ${t.map(e=>`<li>${e}</li>`).join(``)}
      </ul>
    </div>
  `:``}function A(e){let{loadingPerformanceScore:n,interactionPerformanceScore:r,seoScore:i,overallScore:a,topIssues:o}=e,s={critical:2,warning:1},c=(o||[]).sort((e,t)=>s[t.level]-s[e.level]).slice(0,3).map(e=>`
        <li>
          <span class="${e.level}">[${e.source}]</span>
          ${e.message}
        </li>
      `).join(``);return`
    <div class="result-section"><strong>Summary</strong></div>

    <div class="result-card summary column gap-20">
      <div class="summary-score">
        <strong>Overall Score</strong>
        <div class="row gap-5">
          <span class="score ${t(a)}">${a??`N/A`}</span>
          <span class="white">/ 100</span>
        </div>
      </div>

      <div class="summary-breakdown">
        <div class="row">
          <span class="muted">Loading Performance</span>
          <div class="row gap-5">
            <span class="score ${t(n)}">
              ${n??`N/A`}
            </span>
            <span>/ 100</span>
          </div>
        </div>

        <div class="row">
          <span class="muted">Interaction Performance</span>
          <div class="row gap-5">
            <span class="score ${t(r)}">
              ${r??`N/A`}
            </span>
            <span>/ 100</span>
          </div>
        </div>

        <div class="row">
          <span class="muted">SEO</span>
          <div class="row gap-5">
            <span class="score ${t(i)}">
              ${i??`N/A`}
            </span>
            <span>/ 100</span>
          </div>
        </div>
      </div>

      ${c?`
        <div class="insights column gap-10">
          <span class="block-title mt-15"><strong>Top Issues</strong></span>
          <ul>${c}</ul>
        </div>
      `:``}
    </div>
  `}function j(e,t){let n=[];return e&&n.push(e.type),t?.length&&t.forEach(e=>n.push(e.type)),{categoryInsights:M({hasFramework:n.includes(`framework`),hasCMS:n.includes(`cms`),hasLibrary:n.includes(`library`)})}}function M({hasFramework:e,hasCMS:t,hasLibrary:n}){let r=[];return!e&&!t?r.push(`No framework or CMS detected`):(e||r.push(`No frontend framework detected`),t||r.push(`No CMS detected`)),!n&&!e&&!t&&r.push(`No major frontend libraries detected`),r}var N=document.getElementById(`dashboard-results`),P=new URLSearchParams(window.location.search).get(`tabId`);P?chrome.storage.local.get(`stackResults_${P}`,t=>{F(t[`stackResults_${P}`]||{}),e(P,F)}):N.innerHTML=`<span>No data available</span>`;function F(e){let{primary:t,secondary:n,rendering:r,cdn:i,performance:s,seo:c,summary:u}=e||{},f=s?.loading||null,p=s?.interaction||null,{categoryInsights:m}=j(t||null,n||[]),h=``;u&&(h+=A(u)),f&&(h+=d(f)),p&&(h+=l(p)),c&&c.data&&(h+=D(c)),t&&(h+=b(t,m)),n&&n.length?h+=`
          <div class="result-section"><strong>Secondary Technologies</strong></div>
          ${n.map(w).join(``)}
      `:n&&(h+=`
          <div class="result-section"><strong>Secondary Technologies</strong></div>
          ${T()}
      `),r&&(h+=S(r)),i&&(h+=o(i)),h||=a(),N.innerHTML=h}