import{a as e,c as t,i as n,n as r,o as i,r as a,s as o,t as s}from"./assets/technology-fallback-DZ6uqGjN.js";function c(e){let t=(e.evidence||[]).map(e=>`<li>${e.message}</li>`).join(``),r=e.edge||e.platform||(e.assets&&e.assets.length>0?`Asset CDN detected`:`No CDN detected`),i=e.source===`headers`?`server headers`:`resource analysis`;return`
    <div class="result-section"><strong>Delivery & Hosting</strong></div>
    <div class="result-card column gap-30">
      <div class="result-header">
        <span><strong>${r}</strong></span>
        <span class="metric ${n(e.confidence)}">
          ${e.confidence}%
        </span>
      </div>

      <div class="metric-block">
        <span class="block-title">Details</span>

        ${l(`Detected via`,i)}
        ${e.edge?l(`Edge`,e.edge):``}
        ${e.platform?l(`Platform`,e.platform):``}
        ${e.assets&&e.assets.length>0?l(`Assets`,e.assets.join(`, `)):``}

      </div>

      <div class="metric-block">
        <span class="block-title">Evidence</span>
        ${t?`<ul>${t}</ul>`:`<span class="muted">No clear CDN evidence found</span>`}
      </div>
    </div>
  `}function l(e,t){return`
    <div class="metric-row">
      <span>${e}</span>
      <span class="white">${t}</span>
    </div>
  `}var u={animatedCount:{warning:15,critical:40},expensiveAnimationCount:{warning:3,critical:10},fixedCount:{warning:5,critical:10},hoverRules:{warning:10,critical:25},boxShadowCount:{warning:15,critical:40},filterCount:{warning:3,critical:10},backdropFilterCount:{warning:1,critical:5},gradientCount:{warning:20,critical:50},layoutAnimationCount:{warning:2,critical:5}};function d(t){let n=t.data,i=`
    ${f(`Animated elements`,n.animatedCount,u.animatedCount)}
    ${f(`Expensive animations`,n.expensiveAnimationCount,u.expensiveAnimationCount)}
    ${f(`Fixed elements`,n.fixedCount,u.fixedCount)}
    ${f(`Hover rules`,n.hoverRules,u.hoverRules)}
    ${f(`Reduced motion`,n.hasReducedMotionSupport?`supported`:`not supported`,null,!n.hasReducedMotionSupport)}
    ${f(`Box shadows`,n.boxShadowCount,u.boxShadowCount)}
    ${f(`Filters`,n.filterCount,u.filterCount)}
    ${f(`Backdrop filters`,n.backdropFilterCount,u.backdropFilterCount)}
    ${f(`Gradients`,n.gradientCount,u.gradientCount)}
    ${f(`GPU-friendly animations`,n.gpuFriendlyAnimationCount)}
    ${f(`Layout-triggering animations`,n.layoutAnimationCount,u.layoutAnimationCount)}
  `,a={critical:[],warning:[],good:[]};(t.insights||[]).forEach(e=>{a[e.level]&&a[e.level].push(e.message)});let o=a.critical.length+a.warning.length,s=`
    ${r(`Critical Issues`,a.critical,`critical`)}
    ${r(`Warnings`,a.warning,`warning`)}
    ${r(`Good Signals`,a.good,`good`)}
  `;return`
    <div class="result-section"><strong>Interaction Performance</strong></div>
    <div class="result-card column gap-30">
      <div class="metric-block">
        <span class="block-title">Overview</span>
        ${f(`Score`,t.score??`N/A`,e(t.score))}
        ${f(`Issues`,o,o>0?`warning`:`good`)}
      </div>

      <div class="metric-block">
        <span class="block-title">Motion & Complexity</span>
        ${i}
      </div>

      ${s.trim()?`
          <div class="insights column gap-10">
            <span class="block-title mt-15"><strong>Analysis</strong></span>
            ${s}
          </div>
        `:`
          <span class="muted">
            No major interaction or animation issues detected
          </span>
        `}
    </div>
  `}function f(e,t,n=null,r=!1){let i=``;return i=r?`critical`:n&&t!=null?t>=n.critical?`critical`:t>=n.warning?`warning`:`good`:`white`,`
    <div class="metric-row">
      <span>${e}</span>
      <span class="metric ${i}">${t}</span>
    </div>
  `}function p(n){let{coreWebVitals:i,bundleAnalysis:a,renderBlocking:o}=n.data,s=a?.imageMetrics,c=i?.lcp?m(`LCP`,i.lcp.value,h(i.lcp.raw),`(${i.lcp.rating})`):m(`LCP`,`analyzing...`,``,``,!0),l=i?.cls?m(`CLS`,i.cls.value,g(i.cls.raw),`(${i.cls.rating})`):m(`CLS`,`analyzing...`,``,``,!0),u=a?.totalJSSize?m(`Total JS size`,a.totalJSSize.value,_(a.totalJSSize.raw)):m(`Total JS size`,`not available`,``,``,!0),d=a?.jsFileCount===void 0?m(`JS files`,`not available`,``,``,!0):m(`JS files`,a.jsFileCount,v(a.jsFileCount)),f=a?.largestScript?m(`Largest script`,`${t(T(a?.largestScript?.name))} (${a.largestScript.size})`):m(`Largest script`,`not available`,``,``,!0),p=o?m(`Blocking CSS`,o.blockingCSS,y(o.blockingCSS)):m(`Blocking CSS`,`not available`,``,``,!0),E=o?m(`Sync scripts in head`,o.syncScriptsInHead,b(o.syncScriptsInHead)):m(`Sync scripts`,`not available`,``,``,!0),D=s?.imageCount===void 0?m(`Images`,`not available`,``,``,!0):m(`Images`,s.imageCount,C(s.imageCount)),O=s?.totalImageSize?m(`Total image size`,w(s.totalImageSize),x(s.totalImageSize)):m(`Total image size`,`not available`,``,``,!0),k=s?.largestImage?m(`Largest image`,`${t(T(s.largestImage.name))} (${w(s.largestImage.size)})`,S(s.largestImage.size)):m(`Largest image`,`not available`,``,``,!0),A={critical:[],warning:[],good:[]};(n.insights||[]).forEach(e=>{A[e.level]&&A[e.level].push(e.message)});let j=A.critical.length+A.warning.length,M=`
    ${r(`Critical Issues`,A.critical,`critical`)}
    ${r(`Warnings`,A.warning,`warning`)}
    ${r(`Good Signals`,A.good,`good`)}
  `;return`
    <div class="result-section"><strong>Loading Performance</strong></div>
    <div class="result-card column gap-30">
      <div class="metric-block">
        <span class="block-title">Overview</span>
        ${m(`Score`,n.score??`N/A`,e(n.score))}
        ${m(`Issues`,j,j>0?`warning`:`good`)}
      </div>

      <div class="metric-block">
        <span class="block-title">Core Web Vitals</span>
        ${c}
        ${l}
      </div>

      <div class="metric-block">
        <span class="block-title">JavaScript Analysis</span>
        ${u}
        ${d}
        ${f}
      </div>

      <div class="metric-block">
        <span class="block-title">Render Blocking</span>
        ${p}
        ${E}
      </div>

      <div class="metric-block">
        <span class="block-title">Image Analysis</span>
        ${D}
        ${O}
        ${k}
      </div>

      ${M.trim()?`
          <div class="insights column gap-10">
            <span class="block-title mt-15"><strong>Analysis</strong></span>
            ${M}
          </div>
        `:``}
    </div>
  `}function m(e,t,n=``,r=``,i=!1){return`
    <div class="metric-row">
      <span class="${i?`muted`:``}">${e}</span>
      <span class="${i?`muted`:`metric ${n}`}">
        ${t} ${r||``}
      </span>
    </div>
  `}function h(e){if(e==null)return``;let t=e/1e3;return t<=1.8?`good`:t<=3?`warning`:`critical`}function g(e){return e==null?``:e<=.1?`good`:e<=.25?`warning`:`critical`}function _(e){if(e==null)return``;let t=e/1024;return t<150?`good`:t<400?`warning`:`critical`}function v(e){return e<10?`good`:e<25?`warning`:`critical`}function y(e){return e===0?`good`:e<=2?`warning`:`critical`}function b(e){return e===0?`good`:e<=2?`warning`:`critical`}function x(e){if(e==null)return``;let t=e/1024;return t<800?`good`:t<1500?`warning`:`critical`}function S(e){if(e==null)return``;let t=e/1024;return t<200?`good`:t<400?`warning`:`critical`}function C(e){return e<20?`good`:e<50?`warning`:`critical`}function w(e){if(!e||e===0)return`0 KB`;let t=e/1024;return t<1024?`${t.toFixed(1)} KB`:`${(t/1024).toFixed(2)} MB`}function T(e){try{return e.split(`/`).pop().split(`?`)[0]}catch{return e}}function E(e,t){let r=(e.evidence||[]).map(e=>`<li>${e.message}</li>`).join(``),i=[...e.insights||[],...t].map(e=>`<li>${e}</li>`).join(``);return`
    <div class="result-section"><strong>Primary Technology</strong></div>
    <div class="result-card column gap-30">
      <div class="result-header">
        <span>
          <strong>[${a(e.type)}]</strong>
          ${e.name}
        </span>
        <span class="metric ${n(e.confidence)}">
          ${e.confidence}%
        </span>
      </div>

      <div class="metric-block">
        <span class="block-title">Evidence</span>

        ${r?`<ul>${r}</ul>`:`<span class="muted">No direct evidence found</span>`}
      </div>

      ${i?`
          <div class="insights column gap-10">
            <span class="block-title mt-15"><strong>Analysis</strong></span>
            <ul>${i}</ul>
          </div>
        `:``}
    </div>
  `}function D(){return`
    <div class="result-section"><strong>Primary Technology</strong></div>
    <div class="result-card column gap-20">
      <span class="muted">
        No primary technology detected. No dominant technology detected.<br>
        This may indicate static HTML, server-rendered content, or a highly optimized setup.
      </span>
    </div>
  `}function O(e){let t=(e.evidence||[]).map(e=>`<li>${e.message}</li>`).join(``);return`
    <div class="result-section"><strong>Rendering Strategy</strong></div>
    <div class="result-card column gap-30">
      <div class="result-header">
        <span>
          <strong>${k(e.strategy)}</strong>
        </span>
        <span class="metric ${n(e.confidence)}">
          ${e.confidence}%
        </span>
      </div>

      <div class="metric-block">
        <span class="block-title">Evidence</span>
        ${t?`<ul>${t}</ul>`:`<span class="muted">No clear rendering evidence found</span>`}
      </div>
    </div>
  `}function k(e){switch(e){case`SSR`:return`Server-side Rendering (SSR)`;case`SSG`:return`Static Site Generation (SSG)`;case`CSR`:return`Client-side Rendering (CSR)`;default:return`Unknown`}}function A(e){let t=(e.evidence||[]).map(e=>`<li>${e.message}</li>`).join(``),r=(e.insights||[]).map(e=>`<li>${e}</li>`).join(``);return`
    <div class="result-card column gap-30">
      <div class="result-header">
        <span>
          <strong>[${a(e.type)}]</strong>
          ${e.name}
        </span>
        <span class="metric ${n(e.confidence)}">
          ${e.confidence}%
        </span>
      </div>

      <div class="metric-block">
        <span class="block-title">Evidence</span>
        ${t?`<ul>${t}</ul>`:`<span class="muted">No direct evidence found</span>`}
      </div>

      ${r?`
          <div class="insights column gap-10">
            <span class="block-title"><strong>Analysis</strong></span>
            <ul>${r}</ul>
          </div>
        `:``}
    </div>
  `}function j(){return`
    <div class="result-card column gap-20">
      <span class="muted">
        No additional technologies detected. This may indicate a minimal or highly optimized setup.
      </span>
    </div>
  `}function M(n){let{title:r,description:i,canonical:a,lang:s,headings:c,images:l,meta:u}=n.data,d={critical:[],warning:[],good:[]};(n.insights||[]).forEach(e=>{d[e.level]&&d[e.level].push(e.message)});let f=d.critical.length+d.warning.length,p=`
    ${N(`Critical Issues`,d.critical,`critical`)}
    ${N(`Warnings`,d.warning,`warning`)}
    ${N(`Good Signals`,d.good,`good`)}
  `,m=c?.h1??0;return`
    <div class="result-section"><strong>SEO</strong></div>
    <div class="result-card column gap-30">
      <div class="metric-block">
        <span class="block-title">Overview</span>
        ${o(`Score`,n.score??`N/A`,e(n.score))}
        ${o(`Issues`,f,f>0?`warning`:`good`)}
      </div>

      <div class="metric-block">
        <span class="block-title">Structure</span>
        ${o(`Title`,r?t(r,50):`missing`,r?`good`:`critical`)}
        ${o(`Description`,i?t(i,70):`missing`,i?`good`:`critical`)}
        ${o(`Lang`,s??`missing`,s?`good`:`warning`)}
        ${o(`Canonical`,a?`set`:`missing`,a?`good`:`warning`)}
      </div>

      <div class="metric-block">
        <span class="block-title">Headings & Content</span>
        ${o(`H1`,m,m===1?`good`:m===0?`critical`:`warning`)}
        ${o(`H2`,c?.h2??0,`good`)}
        ${o(`Images`,`${l?.total??0} (${l?.missingAlt??0} missing alt)`,(l?.missingAlt??0)>0?`warning`:`good`)}
      </div>

      <div class="metric-block">
        <span class="block-title">Meta & Social</span>
        ${o(`Viewport`,u?.viewport?`set`:`missing`,u?.viewport?`good`:`critical`)}
        ${o(`Open Graph`,u?.openGraph??0,(u?.openGraph??0)>0?`good`:`warning`)}
        ${o(`Twitter`,u?.twitter??0,(u?.twitter??0)>0?`good`:`warning`)}
        ${o(`Robots`,u?.robots||`index`,u?.robots?.includes(`noindex`)?`critical`:`good`)}
        ${o(`Structured Data`,u?.structuredData??0,(u?.structuredData??0)===0?`warning`:`good`)}
      </div>

      <div class="metric-block">
        <span class="block-title">Linking</span>
        ${o(`Internal Links`,n.data.links?.internal??0,(n.data.links?.internal??0)<3?`warning`:`good`)}
        ${o(`External Links`,n.data.links?.external??0,(n.data.links?.external??0)===0?`warning`:`good`)}
      </div>

      ${p.trim()?`
          <div class="insights column gap-10">
            <span class="block-title"><strong>SEO Analysis</strong></span>
            ${p}
          </div>
        `:``}
    </div>
  `}function N(e,t,n){return t.length?`
    <div class="insight-group ${n}">
      <span class="block-title mt-15"><strong>${e}</strong></span>
      <ul>
        ${t.map(e=>`<li>${e}</li>`).join(``)}
      </ul>
    </div>
  `:``}function P(t){let{loadingPerformanceScore:n,interactionPerformanceScore:r,seoScore:i,accessibilityScore:a,overallScore:o,topIssues:s}=t,c={critical:2,warning:1},l=(s||[]).sort((e,t)=>c[t.level]-c[e.level]).slice(0,3).map(e=>`
        <li>
          <span class="${e.level}">[${e.source}]</span>
          ${e.message}
        </li>
      `).join(``);return`
    <div class="result-section"><strong>Summary</strong></div>

    <div class="result-card summary column gap-20">
      <div class="summary-score">
        <div class="row gap-10 align-center">
          <strong>Overall Score</strong>
          <span class="info-tooltip">
            ⓘ
            <span class="tooltip-content">
              Overall score based on weighted metrics.
              <br><br>
              <ul>
                <li>Loading (50%)</li>
                <li>Interaction (25%)</li>
                <li>SEO (15%)</li>
                <li>Accessibility (10%)</li>
              </ul>
              <br><br>
              Prioritizes real user experience over technical completeness.
            </span>
          </span>
        </div>
        <div class="row gap-5">
          <span class="score ${e(o)}">${o??`N/A`}</span>
          <span class="white">/ 100</span>
        </div>
      </div>

      <div class="summary-breakdown">
        <div class="row">
          <span class="muted">Loading Performance</span>
          <div class="row gap-5">
            <span class="score ${e(n)}">
              ${n??`N/A`}
            </span>
            <span>/ 100</span>
          </div>
        </div>

        <div class="row">
          <span class="muted">Interaction Performance</span>
          <div class="row gap-5">
            <span class="score ${e(r)}">
              ${r??`N/A`}
            </span>
            <span>/ 100</span>
          </div>
        </div>

        <div class="row">
          <span class="muted">SEO</span>
          <div class="row gap-5">
            <span class="score ${e(i)}">
              ${i??`N/A`}
            </span>
            <span>/ 100</span>
          </div>
        </div>

        <div class="row">
          <span class="muted">Accessibility</span>
          <div class="row gap-5">
            <span class="score ${e(a)}">
              ${a??`N/A`}
            </span>
            <span>/ 100</span>
          </div>
        </div>
      </div>

      ${l?`
        <div class="insights column gap-10">
          <span class="block-title mt-15"><strong>Top Issues</strong></span>
          <ul>${l}</ul>
        </div>
      `:``}
    </div>
  `}function F(e,t){let n=[];return e&&n.push(e.type),t?.length&&t.forEach(e=>n.push(e.type)),{categoryInsights:I({hasFramework:n.includes(`framework`),hasCMS:n.includes(`cms`),hasLibrary:n.includes(`library`)})}}function I({hasFramework:e,hasCMS:t,hasLibrary:n}){let r=[];return!e&&!t?r.push(`No framework or CMS detected`):(e||r.push(`No frontend framework detected`),t||r.push(`No CMS detected`)),!n&&!e&&!t&&r.push(`No major frontend libraries detected`),r}function L(t){let n=t.insights||[],r={critical:[],warning:[],info:[]};n.forEach(e=>{r[e.level]&&r[e.level].push(e.message)});let i=r.critical.length+r.warning.length,a=`
    ${R(`Critical Issues`,r.critical,`critical`)}
    ${R(`Warnings`,r.warning,`warning`)}
    ${R(`Info`,r.info,`info`)}
  `;return`
    <div class="result-section"><strong>Accessibility</strong></div>
    <div class="result-card column gap-30">
      <div class="metric-block">
        <span class="block-title">Overview</span>
        ${o(`Score`,t.score??`N/A`,e(t.score))}
        ${o(`Issues`,i,i>0?`warning`:`good`)}
      </div>

      ${a.trim()?`
          <div class="insights column gap-10">
            <span class="block-title"><strong>Accessibility Analysis</strong></span>
            ${a}
          </div>
        `:``}
    </div>
  `}function R(e,t,n){return t.length?`
    <div class="insight-group ${n}">
      <span class="block-title mt-15"><strong>${e}</strong></span>
      <ul>
        ${t.map(e=>`<li>${e}</li>`).join(``)}
      </ul>
    </div>
  `:``}var z=document.getElementById(`dashboard-results`),B=new URLSearchParams(window.location.search).get(`tabId`);B?chrome.storage.local.get(`stackResults_${B}`,e=>{V(e[`stackResults_${B}`]||{}),i(B,V)}):z.innerHTML=`<span>No data available</span>`;function V(e){let{primary:t,secondary:n,rendering:r,cdn:i,performance:a,seo:o,accessibility:l,summary:u}=e||{},{categoryInsights:f}=F(t||null,n||[]),m=a?.loading||null,h=a?.interaction||null,g=``;u&&(g+=P(u)),m&&(g+=p(m)),h&&(g+=d(h)),o&&o.data&&(g+=M(o)),l&&(g+=L(l)),t?g+=E(t,f):g+=D(),n&&n.length?g+=`
          <div class="result-section"><strong>Secondary Technologies</strong></div>
          ${n.map(A).join(``)}
      `:n&&(g+=`
          <div class="result-section"><strong>Secondary Technologies</strong></div>
          ${j()}
      `),r&&(g+=O(r)),i&&(g+=c(i)),g||=s(),z.innerHTML=g}