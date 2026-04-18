import{a as e,i as t,n,o as r,r as i,s as a,t as o}from"./assets/technology-fallback-BD919TOv.js";function s(e){let n=(e.evidence||[]).map(e=>`<li>${e.message}</li>`).join(``),r=e.edge||e.platform||(e.assets&&e.assets.length>0?`Asset CDN detected`:`No CDN detected`),i=e.source===`headers`?`server headers`:`resource analysis`;return`
    <div class="result-section"><strong>Delivery & Hosting</strong></div>
    <div class="result-card column gap-30">
      <div class="result-header">
        <span><strong>${r}</strong></span>
        <span class="metric ${t(e.confidence)}">
          ${e.confidence}%
        </span>
      </div>

      <div class="metric-block">
        <span class="block-title">Details</span>

        ${c(`Detected via`,i)}
        ${e.edge?c(`Edge`,e.edge):``}
        ${e.platform?c(`Platform`,e.platform):``}
        ${e.assets&&e.assets.length>0?c(`Assets`,e.assets.join(`, `)):``}

      </div>

      <div class="metric-block">
        <span class="block-title">Evidence</span>
        ${n?`<ul>${n}</ul>`:`<span class="muted">No clear CDN evidence found</span>`}
      </div>
    </div>
  `}function c(e,t){return`
    <div class="metric-row">
      <span>${e}</span>
      <span class="white">${t}</span>
    </div>
  `}var l={animatedCount:{warning:15,critical:40},expensiveAnimationCount:{warning:3,critical:10},fixedCount:{warning:5,critical:10},hoverRules:{warning:10,critical:25},boxShadowCount:{warning:15,critical:40},filterCount:{warning:3,critical:10},backdropFilterCount:{warning:1,critical:5},gradientCount:{warning:20,critical:50},layoutAnimationCount:{warning:2,critical:5}};function u(e){let t=e.data,r=`
    ${d(`Animated elements`,t.animatedCount,l.animatedCount)}
    ${d(`Expensive animations`,t.expensiveAnimationCount,l.expensiveAnimationCount)}
    ${d(`Fixed elements`,t.fixedCount,l.fixedCount)}
    ${d(`Hover rules`,t.hoverRules,l.hoverRules)}
    ${d(`Reduced motion`,t.hasReducedMotionSupport?`supported`:`not supported`,null,!t.hasReducedMotionSupport)}
    ${d(`Box shadows`,t.boxShadowCount,l.boxShadowCount)}
    ${d(`Filters`,t.filterCount,l.filterCount)}
    ${d(`Backdrop filters`,t.backdropFilterCount,l.backdropFilterCount)}
    ${d(`Gradients`,t.gradientCount,l.gradientCount)}
    ${d(`GPU-friendly animations`,t.gpuFriendlyAnimationCount)}
    ${d(`Layout-triggering animations`,t.layoutAnimationCount,l.layoutAnimationCount)}
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
  `}function d(e,t,n=null,r=!1){let i=``;return i=r?`critical`:n&&t!=null?t>=n.critical?`critical`:t>=n.warning?`warning`:`good`:`white`,`
    <div class="metric-row">
      <span>${e}</span>
      <span class="metric ${i}">${t}</span>
    </div>
  `}function f(e){let{coreWebVitals:t,bundleAnalysis:r,renderBlocking:i}=e.data,o=r?.imageMetrics,s=t?.lcp?p(`LCP`,t.lcp.value,m(t.lcp.raw),`(${t.lcp.rating})`):p(`LCP`,`analyzing...`,``,``,!0),c=t?.cls?p(`CLS`,t.cls.value,h(t.cls.raw),`(${t.cls.rating})`):p(`CLS`,`analyzing...`,``,``,!0),l=r?.totalJSSize?p(`Total JS size`,r.totalJSSize.value,g(r.totalJSSize.raw)):p(`Total JS size`,`not available`,``,``,!0),u=r?.jsFileCount===void 0?p(`JS files`,`not available`,``,``,!0):p(`JS files`,r.jsFileCount,_(r.jsFileCount)),d=r?.largestScript?p(`Largest script`,`${a(w(r?.largestScript?.name))} (${r.largestScript.size})`):p(`Largest script`,`not available`,``,``,!0),f=i?p(`Blocking CSS`,i.blockingCSS,v(i.blockingCSS)):p(`Blocking CSS`,`not available`,``,``,!0),T=i?p(`Sync scripts in head`,i.syncScriptsInHead,y(i.syncScriptsInHead)):p(`Sync scripts`,`not available`,``,``,!0),E=o?.imageCount===void 0?p(`Images`,`not available`,``,``,!0):p(`Images`,o.imageCount,S(o.imageCount)),D=o?.totalImageSize?p(`Total image size`,C(o.totalImageSize),b(o.totalImageSize)):p(`Total image size`,`not available`,``,``,!0),O=o?.largestImage?p(`Largest image`,`${a(w(o.largestImage.name))} (${C(o.largestImage.size)})`,x(o.largestImage.size)):p(`Largest image`,`not available`,``,``,!0),k={critical:[],warning:[],good:[]};(e.insights||[]).forEach(e=>{k[e.level]&&k[e.level].push(e.message)});let A=`
    ${n(`Critical Issues`,k.critical,`critical`)}
    ${n(`Warnings`,k.warning,`warning`)}
    ${n(`Good Signals`,k.good,`good`)}
  `;return`
    <div class="result-section"><strong>Loading Performance</strong></div>
    <div class="result-card column gap-30">
      <div class="metric-block">
        <span class="block-title">Core Web Vitals</span>
        ${s}
        ${c}
      </div>

      <div class="metric-block">
        <span class="block-title">JavaScript Analysis</span>
        ${l}
        ${u}
        ${d}
      </div>

      <div class="metric-block">
        <span class="block-title">Render Blocking</span>
        ${f}
        ${T}
      </div>

      <div class="metric-block">
        <span class="block-title">Image Analysis</span>
        ${E}
        ${D}
        ${O}
      </div>

      ${A.trim()?`
          <div class="insights column gap-10">
            <span class="block-title mt-15"><strong>Analysis</strong></span>
            ${A}
          </div>
        `:``}
    </div>
  `}function p(e,t,n=``,r=``,i=!1){return`
    <div class="metric-row">
      <span class="${i?`muted`:``}">${e}</span>
      <span class="${i?`muted`:`metric ${n}`}">
        ${t} ${r||``}
      </span>
    </div>
  `}function m(e){if(e==null)return``;let t=e/1e3;return t<=1.8?`good`:t<=3?`warning`:`critical`}function h(e){return e==null?``:e<=.1?`good`:e<=.25?`warning`:`critical`}function g(e){if(e==null)return``;let t=e/1024;return t<150?`good`:t<400?`warning`:`critical`}function _(e){return e<10?`good`:e<25?`warning`:`critical`}function v(e){return e===0?`good`:e<=2?`warning`:`critical`}function y(e){return e===0?`good`:e<=2?`warning`:`critical`}function b(e){if(e==null)return``;let t=e/1024;return t<800?`good`:t<1500?`warning`:`critical`}function x(e){if(e==null)return``;let t=e/1024;return t<200?`good`:t<400?`warning`:`critical`}function S(e){return e<20?`good`:e<50?`warning`:`critical`}function C(e){if(!e||e===0)return`0 KB`;let t=e/1024;return t<1024?`${t.toFixed(1)} KB`:`${(t/1024).toFixed(2)} MB`}function w(e){try{return e.split(`/`).pop().split(`?`)[0]}catch{return e}}function T(e,n){let r=(e.evidence||[]).map(e=>`<li>${e.message}</li>`).join(``),a=[...e.insights||[],...n].map(e=>`<li>${e}</li>`).join(``);return`
    <div class="result-section"><strong>Primary Technology</strong></div>
    <div class="result-card column gap-30">
      <div class="result-header">
        <span>
          <strong>[${i(e.type)}]</strong>
          ${e.name}
        </span>
        <span class="metric ${t(e.confidence)}">
          ${e.confidence}%
        </span>
      </div>

      <div class="metric-block">
        <span class="block-title">Evidence</span>

        ${r?`<ul>${r}</ul>`:`<span class="muted">No direct evidence found</span>`}
      </div>

      ${a?`
          <div class="insights column gap-10">
            <span class="block-title mt-15"><strong>Analysis</strong></span>
            <ul>${a}</ul>
          </div>
        `:``}
    </div>
  `}function E(){return`
    <div class="result-section"><strong>Primary Technology</strong></div>
    <div class="result-card column gap-20">
      <span class="muted">
        No primary technology detected. No dominant technology detected.<br>
        This may indicate static HTML, server-rendered content, or a highly optimized setup.
      </span>
    </div>
  `}function D(e){let n=(e.evidence||[]).map(e=>`<li>${e.message}</li>`).join(``);return`
    <div class="result-section"><strong>Rendering Strategy</strong></div>
    <div class="result-card column gap-30">
      <div class="result-header">
        <span>
          <strong>${O(e.strategy)}</strong>
        </span>
        <span class="metric ${t(e.confidence)}">
          ${e.confidence}%
        </span>
      </div>

      <div class="metric-block">
        <span class="block-title">Evidence</span>
        ${n?`<ul>${n}</ul>`:`<span class="muted">No clear rendering evidence found</span>`}
      </div>
    </div>
  `}function O(e){switch(e){case`SSR`:return`Server-side Rendering (SSR)`;case`SSG`:return`Static Site Generation (SSG)`;case`CSR`:return`Client-side Rendering (CSR)`;default:return`Unknown`}}function k(e){let n=(e.evidence||[]).map(e=>`<li>${e.message}</li>`).join(``),r=(e.insights||[]).map(e=>`<li>${e}</li>`).join(``);return`
    <div class="result-card column gap-30">
      <div class="result-header">
        <span>
          <strong>[${i(e.type)}]</strong>
          ${e.name}
        </span>
        <span class="metric ${t(e.confidence)}">
          ${e.confidence}%
        </span>
      </div>

      <div class="metric-block">
        <span class="block-title">Evidence</span>
        ${n?`<ul>${n}</ul>`:`<span class="muted">No direct evidence found</span>`}
      </div>

      ${r?`
          <div class="insights column gap-10">
            <span class="block-title"><strong>Analysis</strong></span>
            <ul>${r}</ul>
          </div>
        `:``}
    </div>
  `}function A(){return`
    <div class="result-card column gap-20">
      <span class="muted">
        No additional technologies detected. This may indicate a minimal or highly optimized setup.
      </span>
    </div>
  `}function j(e){let{title:t,description:n,canonical:r,lang:i,headings:o,images:s,meta:c}=e.data,l={critical:[],warning:[],good:[]};(e.insights||[]).forEach(e=>{l[e.level]&&l[e.level].push(e.message)});let u=`
    ${N(`Critical Issues`,l.critical,`critical`)}
    ${N(`Warnings`,l.warning,`warning`)}
    ${N(`Good Signals`,l.good,`good`)}
  `,d=o?.h1??0;return`
    <div class="result-section"><strong>SEO</strong></div>
    <div class="result-card column gap-30">
      <div class="metric-block">
        <span class="block-title">Structure</span>
        ${M(`Title`,t?a(t,50):`missing`,t?`good`:`critical`)}
        ${M(`Description`,n?a(n,70):`missing`,n?`good`:`critical`)}
        ${M(`Lang`,i??`missing`,i?`good`:`warning`)}
        ${M(`Canonical`,r?`set`:`missing`,r?`good`:`warning`)}
      </div>

      <div class="metric-block">
        <span class="block-title">Headings & Content</span>
        ${M(`H1`,d,d===1?`good`:d===0?`critical`:`warning`)}
        ${M(`H2`,o?.h2??0,`good`)}
        ${M(`Images`,`${s?.total??0} (${s?.missingAlt??0} missing alt)`,(s?.missingAlt??0)>0?`warning`:`good`)}
      </div>

      <div class="metric-block">
        <span class="block-title">Meta & Social</span>
        ${M(`Viewport`,c?.viewport?`set`:`missing`,c?.viewport?`good`:`critical`)}
        ${M(`Open Graph`,c?.openGraph??0,(c?.openGraph??0)>0?`good`:`warning`)}
        ${M(`Twitter`,c?.twitter??0,(c?.twitter??0)>0?`good`:`warning`)}
        ${M(`Robots`,c?.robots||`index`,c?.robots?.includes(`noindex`)?`critical`:`good`)}
        ${M(`Structured Data`,c?.structuredData??0,(c?.structuredData??0)===0?`warning`:`good`)}
      </div>

      <div class="metric-block">
        <span class="block-title">Linking</span>
        ${M(`Internal Links`,e.data.links?.internal??0,(e.data.links?.internal??0)<3?`warning`:`good`)}
        ${M(`External Links`,e.data.links?.external??0,(e.data.links?.external??0)===0?`warning`:`good`)}
      </div>

      ${u.trim()?`
          <div class="insights column gap-10">
            <span class="block-title"><strong>SEO Analysis</strong></span>
            ${u}
          </div>
        `:``}
    </div>
  `}function M(e,t,n=`good`){return`
    <div class="metric-row">
      <span>${e}</span>
      <span class="metric ${n}">
        ${t}
      </span>
    </div>
  `}function N(e,t,n){return t.length?`
    <div class="insight-group ${n}">
      <span class="block-title mt-15"><strong>${e}</strong></span>
      <ul>
        ${t.map(e=>`<li>${e}</li>`).join(``)}
      </ul>
    </div>
  `:``}function P(t){let{loadingPerformanceScore:n,interactionPerformanceScore:r,seoScore:i,overallScore:a,topIssues:o}=t,s={critical:2,warning:1},c=(o||[]).sort((e,t)=>s[t.level]-s[e.level]).slice(0,3).map(e=>`
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
              Overall score based on weighted metrics.<br><br>
              Loading (50%), Interaction (30%), SEO (20%)<br><br>
              Prioritizes real user experience over technical completeness.
            </span>
          </span>
        </div>
        <div class="row gap-5">
          <span class="score ${e(a)}">${a??`N/A`}</span>
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
      </div>

      ${c?`
        <div class="insights column gap-10">
          <span class="block-title mt-15"><strong>Top Issues</strong></span>
          <ul>${c}</ul>
        </div>
      `:``}
    </div>
  `}function F(e,t){let n=[];return e&&n.push(e.type),t?.length&&t.forEach(e=>n.push(e.type)),{categoryInsights:I({hasFramework:n.includes(`framework`),hasCMS:n.includes(`cms`),hasLibrary:n.includes(`library`)})}}function I({hasFramework:e,hasCMS:t,hasLibrary:n}){let r=[];return!e&&!t?r.push(`No framework or CMS detected`):(e||r.push(`No frontend framework detected`),t||r.push(`No CMS detected`)),!n&&!e&&!t&&r.push(`No major frontend libraries detected`),r}var L=document.getElementById(`dashboard-results`),R=new URLSearchParams(window.location.search).get(`tabId`);R?chrome.storage.local.get(`stackResults_${R}`,e=>{z(e[`stackResults_${R}`]||{}),r(R,z)}):L.innerHTML=`<span>No data available</span>`;function z(e){let{primary:t,secondary:n,rendering:r,cdn:i,performance:a,seo:c,summary:l}=e||{},{categoryInsights:d}=F(t||null,n||[]),p=a?.loading||null,m=a?.interaction||null,h=``;l&&(h+=P(l)),p&&(h+=f(p)),m&&(h+=u(m)),c&&c.data&&(h+=j(c)),t?h+=T(t,d):h+=E(),n&&n.length?h+=`
          <div class="result-section"><strong>Secondary Technologies</strong></div>
          ${n.map(k).join(``)}
      `:n&&(h+=`
          <div class="result-section"><strong>Secondary Technologies</strong></div>
          ${A()}
      `),r&&(h+=D(r)),i&&(h+=s(i)),h||=o(),L.innerHTML=h}