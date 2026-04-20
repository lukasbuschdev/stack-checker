import{a as e,c as t,i as n,n as r,o as i,r as a,s as o,t as s}from"./assets/technology-fallback-CL1HTQJv.js";function c(e){let t=(e.evidence||[]).map(e=>`<li>${e.message}</li>`).join(``),n=e.edge||e.platform||(e.assets&&e.assets.length>0?`Asset CDN detected`:`No CDN detected`),r=e.source===`headers`?`server headers (high confidence)`:`resource analysis`;return`
    <div class="result-section"><strong>CDN & Hosting</strong></div>
    <div class="result-card column gap-30">
      <div class="result-header">
        <span><strong>${n}</strong></span>
          <span class="metric ${a(e.confidence)}">
            ${d(e)}
          </span>
      </div>

      <div class="metric-block">
        <span class="block-title">Details</span>
        ${l(`Detected via`,r)}
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
  `}function u(e){let{confidence:t=0,evidence:r=[],source:i}=e;return t<20?``:i===`headers`?`Proven (${t}%)`:`${n(t,r)} (${t}%)`}function d(e){let t=u(e);return t?`
    <span class="metric ${a(e.confidence)}">
      ${t}
    </span>
  `:``}function f(t){if(!t||!t.data)return`
      <div class="result-section"><strong>Interaction Performance</strong></div>
      <div class="result-card column gap-30">
        <span class="muted">No interaction performance data available</span>
      </div>
    `;let n=t.data,r=`
    ${p(`Passive animations`,n.passiveAnimationCount,`passiveAnimationCount`,n)}
    ${p(`Interaction animations`,n.interactionAnimationCount,`interactionAnimationCount`,n)}
    ${p(`Light interaction animations`,n.cheapInteractionCount,`cheapInteractionCount`,n)}
    ${p(`Heavy interaction animations`,n.heavyInteractionCount,`heavyInteractionCount`,n)}
    ${p(`Expensive passive animations`,n.expensivePassiveAnimationCount,`expensivePassiveAnimationCount`,n)}
    ${p(`Expensive interaction animations`,n.expensiveInteractionAnimationCount,`expensiveInteractionAnimationCount`,n)}
    ${p(`Fixed elements`,n.fixedCount,`fixedCount`,n)}
    ${p(`Hover rules`,n.hoverRules,`hoverRules`,n)}
    ${p(`Box shadows`,n.boxShadowCount,`boxShadowCount`,n)}
    ${p(`Filters`,n.filterCount,`filterCount`,n)}
    ${p(`Backdrop filters`,n.backdropFilterCount,`backdropFilterCount`,n)}
    ${p(`Gradients`,n.gradientCount,`gradientCount`,n)}
    ${p(`Layout-triggering animations`,n.layoutAnimationCount,`layoutAnimationCount`,n)}
    ${p(`GPU-friendly animations`,n.gpuFriendlyAnimationCount,null,null)}
    ${p(`Reduced motion`,n.hasReducedMotionSupport?`supported`:`not supported`,n.hasReducedMotionSupport?`good`:`warning`)}
    ${p(`JS-driven animations`,n.jsAnimationActivity?.detected?m(n.jsAnimationActivity):`none`,`jsAnimationActivity`,n)}
  `,i=g(t.insights||[]),a=i.critical.length+i.warning.length,o=`
    ${v(`Critical Issues`,i.critical,`critical`)}
    ${v(`Warnings`,i.warning,`warning`)}
    ${v(`Good Signals`,i.good,`good`)}
  `;return`
    <div class="result-section"><strong>Interaction Performance</strong></div>
    <div class="result-card column gap-30">
      <div class="metric-block">
        <span class="block-title">Overview</span>
        ${p(`Score`,t.score??`N/A`,e(t.score))}
        ${p(`Issues`,a,a>0?`warning`:`good`)}
      </div>

      <div class="metric-block">
        <span class="block-title">Motion & Complexity</span>
        ${r}
      </div>

      ${o.trim()?`
            <div class="insights column gap-10">
              <span class="block-title mt-15"><strong>Analysis</strong></span>
              ${o}
            </div>
          `:`
            <span class="muted">
              No major interaction or animation issues detected
            </span>
          `}
    </div>
  `}function p(e,t,n=null,r=null,i=!1){let a=`good`;return i?a=`critical`:n&&r?a=h(r)[n]||`white`:typeof n==`string`&&!r&&(a=n),`
    <div class="metric-row">
      <span>${e}</span>
      <span class="metric ${a}">${t}</span>
    </div>
  `}function m(e){let{level:t,svgMotionChanges:n=0,styleChanges:r=0}=e;return t===`low`?`low activity (minimal runtime updates)`:t===`medium`?n>r?`moderate activity (mostly visual animations)`:`moderate activity (includes layout/style updates)`:t===`high`?`high activity (frequent runtime updates)`:`unknown`}function h(e){let{passiveAnimationCount:t=0,interactionAnimationCount:n=0,expensivePassiveAnimationCount:r=0,expensiveInteractionAnimationCount:i=0,cheapInteractionCount:a=0,heavyInteractionCount:o=0,fixedCount:s=0,hoverRules:c=0,boxShadowCount:l=0,filterCount:u=0,backdropFilterCount:d=0,gradientCount:f=0,layoutAnimationCount:p=0,jsAnimationActivity:m=null}=e;return{passiveAnimationCount:t>=6?`critical`:t>=3?`warning`:`good`,interactionAnimationCount:n>=40?`warning`:`good`,heavyInteractionCount:o>=20?`critical`:o>=10?`warning`:`good`,cheapInteractionCount:o===0&&a>=10?`good`:`neutral`,expensivePassiveAnimationCount:r>=3?`critical`:r>=1?`warning`:`good`,expensiveInteractionAnimationCount:i>=10?`critical`:i>=4?`warning`:`good`,fixedCount:s>=10?`critical`:s>=5?`warning`:`good`,hoverRules:c>=25?`critical`:c>=10?`warning`:`good`,boxShadowCount:l>=40?`critical`:l>=15?`warning`:`good`,filterCount:u>=10?`critical`:u>=3?`warning`:`good`,backdropFilterCount:d>=5?`critical`:d>=1?`warning`:`good`,gradientCount:f>=50?`critical`:f>=20?`warning`:`good`,layoutAnimationCount:p>=10?`critical`:p>=2?`warning`:`good`,jsAnimationActivity:m?.level===`high`||m?.level===`medium`?`warning`:`good`}}function g(e){let t={critical:[],warning:[],good:[]};return e.forEach(e=>{t[e.level]&&t[e.level].push(e)}),t.critical.sort(_),t.warning.sort(_),t.good.sort(_),t}function _(e,t){let n=!!e.fix;return n===!!t.fix?0:n?-1:1}function v(e,t,n){return!t||t.length===0?``:`
    <div class="insight-group">
      <span class="insight-title ${n}"><strong>${e}</strong></span>
      <ul class="insight-list">
        ${t.map(o).join(``)}
      </ul>
    </div>
  `}function y(n){let{coreWebVitals:r,bundleAnalysis:i,renderBlocking:a}=n.data,o=i?.imageMetrics,s=r?.lcp?b(`LCP`,r.lcp.value,ee(r.lcp.raw),`(${r.lcp.rating})`):b(`LCP`,`analyzing...`,``,``,!0),c=r?.cls?b(`CLS`,r.cls.value,te(r.cls.raw),`(${r.cls.rating})`):b(`CLS`,`analyzing...`,``,``,!0),l=i?.totalJSSize?b(`Total JS size`,i.totalJSSize.value,ne(i.totalJSSize.raw)):b(`Total JS size`,`not available`,``,``,!0),u=i?.jsFileCount===void 0?b(`JS files`,`not available`,``,``,!0):b(`JS files`,i.jsFileCount,x(i.jsFileCount)),d=i?.largestScript?b(`Largest script`,`${t(E(i?.largestScript?.name))} (${i.largestScript.size})`):b(`Largest script`,`not available`,``,``,!0),f=a?b(`Blocking CSS`,a.blockingCSS,S(a.blockingCSS)):b(`Blocking CSS`,`not available`,``,``,!0),p=a?b(`Sync scripts in head`,a.syncScriptsInHead,C(a.syncScriptsInHead)):b(`Sync scripts`,`not available`,``,``,!0),m=o?.imageCount===void 0?b(`Images`,`not available`,``,``,!0):b(`Images`,o.imageCount,ie(o.imageCount)),h=o?.totalImageSize?b(`Total image size`,T(o.totalImageSize),w(o.totalImageSize)):b(`Total image size`,`not available`,``,``,!0),g=o?.largestImage?b(`Largest image`,`${t(E(o.largestImage.name))} (${T(o.largestImage.size)})`,re(o.largestImage.size)):b(`Largest image`,`not available`,``,``,!0),_={critical:[],warning:[],good:[]};(n.insights||[]).forEach(e=>{_[e.level]&&_[e.level].push(e)});let v=_.critical.length+_.warning.length,y=`
    ${D(`Critical Issues`,_.critical,`critical`)}
    ${D(`Warnings`,_.warning,`warning`)}
    ${D(`Good Signals`,_.good,`good`)}
  `;return`
    <div class="result-section"><strong>Loading Performance</strong></div>
    <div class="result-card column gap-30">
      <div class="metric-block">
        <span class="block-title">Overview</span>
        ${b(`Score`,n.score??`N/A`,e(n.score))}
        ${b(`Issues`,v,v>0?`warning`:`good`)}
      </div>

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
        ${p}
      </div>

      <div class="metric-block">
        <span class="block-title">Image Analysis</span>
        ${m}
        ${h}
        ${g}
      </div>

      ${y.trim()?`
          <div class="insights column gap-10">
            <span class="block-title mt-15"><strong>Analysis</strong></span>
            ${y}
          </div>
        `:``}
    </div>
  `}function b(e,t,n=``,r=``,i=!1){return`
    <div class="metric-row">
      <span class="${i?`muted`:``}">${e}</span>
      <span class="${i?`muted`:`metric ${n}`}">
        ${t} ${r||``}
      </span>
    </div>
  `}function ee(e){if(e==null)return``;let t=e/1e3;return t<=1.8?`good`:t<=3?`warning`:`critical`}function te(e){return e==null?``:e<=.1?`good`:e<=.25?`warning`:`critical`}function ne(e){if(e==null)return``;let t=e/1024;return t<150?`good`:t<400?`warning`:`critical`}function x(e){return e<10?`good`:e<25?`warning`:`critical`}function S(e){return e===0?`good`:e<=2?`warning`:`critical`}function C(e){return e===0?`good`:e<=2?`warning`:`critical`}function w(e){if(e==null)return``;let t=e/1024;return t<800?`good`:t<1500?`warning`:`critical`}function re(e){if(e==null)return``;let t=e/1024;return t<200?`good`:t<400?`warning`:`critical`}function ie(e){return e<20?`good`:e<50?`warning`:`critical`}function T(e){if(!e||e===0)return`0 KB`;let t=e/1024;return t<1024?`${t.toFixed(1)} KB`:`${(t/1024).toFixed(2)} MB`}function E(e){try{return e.split(`/`).pop().split(`?`)[0]}catch{return e}}function D(e,t,n){return!t||t.length===0?``:`
    <div class="insight-group">
      <span class="insight-title ${n}"><strong>${e}</strong></span>
      <ul class="insight-list">
        ${t.map(o).join(``)}
      </ul>
    </div>
  `}function O(e,t){let i=(e.evidence||[]).map(e=>`<li>${e.message}</li>`).join(``),o=[...e.insights||[],...t].map(e=>`<li>${e}</li>`).join(``);return`
    <div class="result-section"><strong>Primary Technology</strong></div>
    <div class="result-card column gap-30">
      <div class="result-header">
        <span>
          <strong>[${r(e.type)}]</strong>
          ${e.name}
        </span>
        <span class="metric ${a(e.confidence)}">
          ${n(e.confidence,e.evidence)} (${e.confidence}%)
        </span>
      </div>

      <div class="metric-block">
        <span class="block-title">Evidence</span>

        ${i?`<ul>${i}</ul>`:`<span class="muted">No direct evidence found</span>`}
      </div>

      ${o?`
          <div class="insights column gap-10">
            <span class="block-title mt-15"><strong>Analysis</strong></span>
            <ul>${o}</ul>
          </div>
        `:``}
    </div>
  `}function k(){return`
    <div class="result-section"><strong>Primary Technology</strong></div>
    <div class="result-card column gap-20">
      <span class="muted">
        No primary technology detected. No dominant technology detected.<br>
        This may indicate static HTML, server-rendered content, or a highly optimized setup.
      </span>
    </div>
  `}function A(e){let t=(e.evidence||[]).map(e=>`<li>${e.message}</li>`).join(``);return`
    <div class="result-section"><strong>Rendering Strategy</strong></div>
    <div class="result-card column gap-30">
      <div class="result-header align-start">
        <div class="column gap-10">
          <span><strong>${M(e.strategy)}</strong><br></span>
          <span class="rendering-hint">${N(e.strategy)}</span>
        </div>
        <span class="metric ${a(e.confidence)}">
          ${P(e)}
        </span>
      </div>

      <div class="metric-block">
        <span class="block-title">Evidence</span>
        ${t?`<ul>${t}</ul>`:`<span class="muted">No clear rendering evidence found</span>`}
      </div>
    </div>
  `}function j(){return`
    <div class="result-section"><strong>Rendering Strategy</strong></div>
    <div class="result-card column gap-20">
      <div class="metric-block">
        <span class="muted">
          No clear rendering pattern detected. This can occur with hybrid setups,
          static delivery, or optimized builds where rendering behavior is less visible.
        </span>
      </div>
    </div>
  `}function M(e){switch(e){case`SSR`:return`Server-side Rendering (SSR)`;case`SSG`:return`Static Site Generation (SSG)`;case`CSR`:return`Client-side Rendering (CSR)`;default:return`Unknown`}}function N(e){switch(e){case`SSR`:return`Content is rendered on the server before being sent to the client.`;case`SSG`:return`Content is pre-generated at build time and served statically.`;case`CSR`:return`Content is rendered in the browser using JavaScript.`;default:return``}}function P(e){let{confidence:t=0,evidence:r=[]}=e;return`${n(t,r)} (${t}%)`}function F(e){let t=(e.evidence||[]).map(e=>`<li>${e.message}</li>`).join(``),n=(e.insights||[]).map(e=>`<li>${e}</li>`).join(``);return`
    <div class="result-card column gap-30">
      <div class="result-header">
        <span>
          <strong>[${r(e.type)}]</strong>
          ${e.name}
        </span>
        <span class="metric ${a(e.confidence)}">
          ${L(e)}
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
  `}function I(){return`
    <div class="result-card column gap-20">
      <span class="muted">
        No additional technologies detected. This may indicate a minimal or highly optimized setup.
      </span>
    </div>
  `}function L(e){let{confidence:t=0,evidence:r=[]}=e;if(t<20)return`<span class="muted">Weak signal</span>`;let i=n(t,r);return`${i===`Proven`?`Detected`:i===`Very likely`?`Strong signal`:i===`Likely`?`Likely`:i===`Plausible`?`Possible`:`Weak signal`} (${t}%)`}function R(n){let{title:r,description:a,canonical:o,lang:s,headings:c,images:l,meta:u}=n.data,d=z(n.insights||[]),f=d.critical.length+d.warning.length,p=`
    ${V(`Critical Issues`,d.critical,`critical`)}
    ${V(`Warnings`,d.warning,`warning`)}
    ${V(`Good Signals`,d.good,`good`)}
  `,m=c?.h1??0;return`
    <div class="result-section"><strong>SEO</strong></div>
    <div class="result-card column gap-30">
      <div class="metric-block">
        <span class="block-title">Overview</span>
        ${i(`Score`,n.score??`N/A`,e(n.score))}
        ${i(`Issues`,f,f>0?`warning`:`good`)}
      </div>

      <div class="metric-block">
        <span class="block-title">Structure</span>
        ${i(`Title`,r?t(r,50):`missing`,r?`good`:`critical`)}
        ${i(`Description`,a?t(a,70):`missing`,a?`good`:`critical`)}
        ${i(`Lang`,s??`missing`,s?`good`:`warning`)}
        ${i(`Canonical`,o?`set`:`missing`,o?`good`:`warning`)}
      </div>

      <div class="metric-block">
        <span class="block-title">Headings & Content</span>
        ${i(`H1`,m,m===1?`good`:m===0?`critical`:`warning`)}
        ${i(`H2`,c?.h2??0,`good`)}
        ${i(`Images`,`${l?.total??0} (${l?.missingAlt??0} missing alt)`,(l?.missingAlt??0)>0?`warning`:`good`)}
      </div>

      <div class="metric-block">
        <span class="block-title">Meta & Social</span>
        ${i(`Viewport`,u?.viewport?`set`:`missing`,u?.viewport?`good`:`critical`)}
        ${i(`Open Graph`,u?.openGraph??0,(u?.openGraph??0)>0?`good`:`warning`)}
        ${i(`Twitter`,u?.twitter??0,(u?.twitter??0)>0?`good`:`warning`)}
        ${i(`Robots`,u?.robots||`index`,u?.robots?.includes(`noindex`)?`critical`:`good`)}
        ${i(`Structured Data`,u?.structuredData??0,(u?.structuredData??0)===0?`warning`:`good`)}
      </div>

      <div class="metric-block">
        <span class="block-title">Linking</span>
        ${i(`Internal Links`,n.data.links?.internal??0,(n.data.links?.internal??0)<3?`warning`:`good`)}
        ${i(`External Links`,n.data.links?.external??0,(n.data.links?.external??0)===0?`warning`:`good`)}
      </div>

      ${p.trim()?`
          <div class="insights column gap-10">
            <span class="block-title"><strong>SEO Analysis</strong></span>
            ${p}
          </div>
        `:``}
    </div>
  `}function z(e){let t={critical:[],warning:[],good:[]};return e.forEach(e=>{t[e.level]&&t[e.level].push(e)}),t.critical.sort(B),t.warning.sort(B),t.good.sort(B),t}function B(e,t){let n=!!e.fix;return n===!!t.fix?0:n?-1:1}function V(e,t,n){return!t||t.length===0?``:`
    <div class="insight-group">
      <span class="insight-title ${n}"><strong>${e}</strong></span>
      <ul class="insight-list">
        ${t.map(o).join(``)}
      </ul>
    </div>
  `}function H(t){let{loadingPerformanceScore:n,interactionPerformanceScore:r,seoScore:i,accessibilityScore:a,overallScore:o,topIssues:s,allInsights:c=[]}=t||{},l={critical:2,warning:1},u=(s||[]).sort((e,t)=>l[t.level]-l[e.level]).slice(0,3).map(e=>`
        <li>
          <span class="${e.level}"><strong>[${e.source}]</strong></span>
          ${e.message}
        </li>
      `).join(``);return`
    <div class="result-section"><strong>Summary</strong></div>

    <div class="result-card summary column gap-30">
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

      ${u?`
        <div class="insights column gap-10">
          <span class="block-title mt-15"><strong>Top Issues</strong></span>
          <ul>${u}</ul>
        </div>
      `:``}

      ${U(c)}
    </div>
  `}function U(e=[]){let{quick:t,advanced:n}=ae(e.filter(e=>e&&(e.level===`critical`||e.level===`warning`)));return!t.length&&!n.length?``:`
    <div class="insights">
      ${t.length?`
        <div class="column gap-10">
          <span class="block-title">Quick Wins</span>
          <ul class="insight-list">
            ${t.map(G).join(``)}
          </ul>
        </div>
      `:``}
    </div>

    <div class="insights">
      ${n.length?`
        <div class="column gap-10">
          <span class="block-title">Advanced Improvements</span>
          <ul class="insight-list">
            ${n.map(G).join(``)}
          </ul>
        </div>
      `:``}
    </div>
  `}function ae(e=[]){let t=[],n=[],r=e.filter(e=>e&&(e.level===`critical`||e.level===`warning`)),i=[`alt`,`button type`,`missing attribute`,`label`,`aria`,`meta`,`title`,`add`,`missing`,`not set`,`heading`,`h1`,`link text`,`form field`],a=[`layout`,`animation`,`render`,`performance`,`strategy`,`complex`,`reduce`,`optimize`,`largest contentful paint`,`lcp`,`cls`,`javascript-driven`,`layout recalculation`];return r.forEach(e=>{let r=e.message.toLowerCase(),o=a.some(e=>r.includes(e));i.some(e=>r.includes(e))&&!o?t.push(e):n.push(e)}),{quick:W(t).slice(0,3),advanced:q(W(n)).slice(0,3)}}function W(e=[]){let t=new Set;return e.filter(e=>{let n=`${e.level}|${e.source}|${e.message}|${e.fix??``}`;return t.has(n)?!1:(t.add(n),!0)})}function G(e){let t=K(e.level);return`
    <li class="insight-item">
      <div class="insight-message">
        ${t?`<span class="level-label ${e.level}"><strong>[${t}]</strong></span> `:``}${e.message}
      </div>
      ${e.fix?`
            <div class="insight-fix">
              <span class="fix-label"><strong>Fix:</strong></span> ${e.fix}
            </div>
          `:``}
    </li>
  `}function K(e){return e===`critical`?`CRITICAL`:e===`warning`?`WARNING`:null}function q(e=[]){let t={critical:2,warning:1};return e.sort((e,n)=>t[n.level]-t[e.level])}function J(e,t){let n=[];return e&&n.push(e.type),t?.length&&t.forEach(e=>n.push(e.type)),{categoryInsights:oe({hasFramework:n.includes(`framework`),hasCMS:n.includes(`cms`),hasLibrary:n.includes(`library`)})}}function oe({hasFramework:e,hasCMS:t,hasLibrary:n}){let r=[];return!e&&!t?r.push(`No framework or CMS detected`):(e||r.push(`No frontend framework detected`),t||r.push(`No CMS detected`)),!n&&!e&&!t&&r.push(`No major frontend libraries detected`),r}function se(t){let n=ce(t.insights||[]),r=n.critical.length+n.warning.length,a=`
    ${X(`Critical Issues`,n.critical,`critical`)}
    ${X(`Warnings`,n.warning,`warning`)}
    ${X(`Suggestions`,n.info,`info`)}
  `;return`
    <div class="result-section"><strong>Accessibility</strong></div>
    <div class="result-card column gap-30">
      <div class="metric-block">
        <span class="block-title">Overview</span>
        ${i(`Score`,t.score??`N/A`,e(t.score))}
        ${i(`Issues`,r,r>0?`warning`:`good`)}
      </div>

      ${r>0||t.showGoodSignals?`
            <div class="insights column gap-10">
              <span class="block-title"><strong>Accessibility Analysis</strong></span>
              ${a}
            </div>
          `:`
            <div class="insights column gap-10">
              <span class="block-title"><strong>Accessibility Analysis</strong></span>
              <span class="good">✓ No accessibility issues detected</span>
              <span class="muted">Basic accessibility checks passed. Consider manual testing for advanced scenarios like screen reader support and focus behavior.</span>
            </div>
          `}
    </div>
  `}function ce(e){let t={critical:[],warning:[],info:[],good:[]};return e.forEach(e=>{t[e.level]&&t[e.level].push(e)}),t.critical.sort(Y),t.warning.sort(Y),t.info.sort(Y),t.good.sort(Y),t}function Y(e,t){let n=!!e.fix;return n===!!t.fix?0:n?-1:1}function X(e,t,n){return!t||t.length===0?``:`
    <div class="insight-group">
      <span class="insight-title ${n}"><strong>${e}</strong></span>
      <ul class="insight-list">
        ${t.map(o).join(``)}
      </ul>
    </div>
  `}var Z=document.getElementById(`dashboard-results`),Q=new URLSearchParams(window.location.search).get(`tabId`),le=7e3,$=250;Q?ue():Z.innerHTML=`<span>No data available</span>`;async function ue(){fe(),pe(await de(Q)||{})}function de(e){return new Promise(t=>{let n=`stackResults_${e}`,r=Date.now(),i=null,a=setInterval(()=>{chrome.storage.local.get(n,e=>{let o=e[n];o&&(i=o);let s=o?.meta?.isFinal===!0,c=Date.now()-r>=le;(s||c)&&(clearInterval(a),t(i))})},$)})}function fe(){Z.innerHTML=`
    <div class="result-section loading-state">
      <div class="loading-title">Analyzing page...</div>
      <div class="loading-text">Waiting for stable results</div>
    </div>
  `}function pe(e){let{primary:t,secondary:n,rendering:r,cdn:i,performance:a,seo:o,accessibility:l,summary:u}=e||{},{categoryInsights:d}=J(t||null,n||[]),p=a?.loading||null,m=a?.interaction||null,h=``;u&&(h+=H(u)),p&&(h+=y(p)),m&&(h+=f(m)),o&&o.data&&(h+=R(o)),l&&(h+=se(l)),t?h+=O(t,d):h+=k(),n&&n.length?h+=`
      <div class="result-section"><strong>Secondary Technologies</strong></div>
      ${n.map(F).join(``)}
    `:n&&(h+=`
      <div class="result-section"><strong>Secondary Technologies</strong></div>
      ${I()}
    `),r?h+=A(r):h+=j(),i&&(h+=c(i)),h||=s(),Z.innerHTML=h}