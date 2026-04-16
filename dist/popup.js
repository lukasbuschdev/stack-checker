(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=document.getElementById(`results`);chrome.tabs.query({active:!0,currentWindow:!0},e=>{let n=e[0];if(!n?.id){t({});return}chrome.storage.local.get(`stackResults_${n.id}`,e=>{t(e[`stackResults_${n.id}`]||{}),l(n.id)})});function t(t){let{primary:l,secondary:u,rendering:d,cdn:f,performance:p,seo:m}=t||{},h=``,g=[];l&&g.push(l.type),u&&u.length>0&&u.forEach(e=>g.push(e.type));let _=r({hasFramework:g.includes(`framework`),hasCMS:g.includes(`cms`),hasLibrary:g.includes(`library`)});if(l){let e=(l.evidence||[]).map(e=>`<li>${e.message}</li>`).join(``),t=[...l.insights||[],..._].map(e=>`<li>${e}</li>`).join(``);h+=`<div class="result-section"><strong>Primary Technologies</strong></div>`,h+=`
      <div class="result-card primary column gap-20">
        <div class="result-header">
          <strong>[${n(l.type)}] ${l.name}</strong>
          <strong>${l.confidence}%</strong>
        </div>

        <div class="column gap-20">
          ${e?`<ul>${e}</ul>`:`<p class="muted">No direct evidence found</p>`}

          ${t?`
              <div class="insights column gap-20">
                <strong>Analysis</strong>
                <ul>${t}</ul>
              </div>
            `:``}
        </div>
      </div>
    `}if(u&&u.length>0&&(h+=`<div class="result-section"><strong>Secondary Technologies</strong></div>`,h+=u.map(e=>{let t=(e.evidence||[]).map(e=>`<li>${e.message}</li>`).join(``),r=(e.insights||[]).map(e=>`<li>${e}</li>`).join(``);return`
          <div class="result-card column gap-20">
            <div class="result-header">
              <strong>[${n(e.type)}] ${e.name}</strong>
              <strong>${e.confidence}%</strong>
            </div>

            ${t?`<ul>${t}</ul>`:`<p class="muted">No direct evidence found</p>`}

            ${r?`
                <div class="insights column gap-20">
                  <strong>Analysis</strong>
                  <ul>${r}</ul>
                </div>
              `:``}
          </div>
        `}).join(``)),h||=`
      <div class="result-card column gap-20">
        <div class="result-header">
          <strong>Analysis</strong>
        </div>
        <span class="muted">
          No detectable technologies. This site likely uses server-side rendering,
          a custom framework, or heavily optimized production builds.
        </span>
      </div>
    `,d){let e=(d.evidence||[]).map(e=>`<li>${e.message}</li>`).join(``);h+=`<div class="result-section"><strong>Rendering Strategy</strong></div>`,h+=`
    <div class="result-card column gap-20">
      <div class="result-header">
        <strong>${o(d.strategy)}</strong>
        <strong>${d.confidence}%</strong>
      </div>

      ${e?`<ul>${e}</ul>`:`<span class="muted">No clear rendering evidence found</span>`}
    </div>
  `}if(f){let e=(f.evidence||[]).map(e=>`<li>${e.message}</li>`).join(``),t=f.edge?`<span><strong>Edge:</strong> ${f.edge}</span>`:``,n=f.assets&&f.assets.length>0?`<span><strong>Assets:</strong> ${f.assets.join(`, `)}</span>`:``,r=f.source===`headers`?`<span><strong>Detected via:</strong> server headers</span>`:`<span><strong>Detected via:</strong> resource analysis</span>`,i=f.platform?`<span><strong>Platform:</strong> ${f.platform}</span>`:``;h+=`<div class="result-section"><strong>Delivery & Hosting</strong></div>`,h+=`
      <div class="result-card column gap-20">
        <div class="result-header">
          <strong>${f.edge||f.platform||(f.assets.length>0?`Asset CDN detected`:`No CDN detected`)}</strong>
          <strong>${f.confidence}%</strong>
        </div>

        <div class="column gap-20">
          ${r}
          ${t}
          ${i}
          ${n}
        </div>

        ${e?`<ul>${e}</ul>`:`<span class="muted">No clear CDN evidence found</span>`}
      </div>
    `}if(p&&p.data){let{coreWebVitals:e,bundleAnalysis:t,renderBlocking:n}=p.data,r=e?.lcp?`<span><strong>LCP:</strong> ${e.lcp.value} (${e.lcp.rating})</span>`:`<span class="muted"><strong>LCP:</strong> analyzing...</span>`,a=e?.cls?`<span><strong>CLS:</strong> ${e.cls.value} (${e.cls.rating})</span>`:`<span class="muted"><strong>CLS:</strong> analyzing...</span>`,o=t?.totalJSSize?`<span><strong>Total JS size:</strong> ${t.totalJSSize.value}</span>`:`<span class="muted">Total JS size: not available</span>`,l=t?.jsFileCount===void 0?`<span class="muted">JS files: not available</span>`:`<span><strong>JS files:</strong> ${t.jsFileCount}</span>`,u=t?.largestScript?`<span><strong>Largest script:</strong> ${c(s(t.largestScript.name))} (${t.largestScript.size})</span>`:`<span class="muted">Largest script: not available</span>`,d=n?`<span><strong>Blocking CSS:</strong> ${n.blockingCSS}</span>`:`<span class="muted">Blocking CSS: not available</span>`,f=n?`<span><strong>Sync scripts in head:</strong> ${n.syncScriptsInHead}</span>`:`<span class="muted">Sync scripts: not available</span>`,m={critical:[],warning:[],good:[]};(p.insights||[]).forEach(e=>{m[e.level]&&m[e.level].push(e.message)});let g=`
      ${i(`Critical Issues`,m.critical,`critical`)}
      ${i(`Warnings`,m.warning,`warning`)}
      ${i(`Good Signals`,m.good,`good`)}
    `;h+=`<div class="result-section"><strong>Performance</strong></div>`,h+=`
      <div class="result-card column gap-30">
        <div class="column gap-10">
          <span class="white"><strong>Core Web Vitals</strong></span>
          ${r}
          ${a}
        </div>

        <div class="column gap-10">
          <span class="white"><strong>Bundle Analysis</strong></span>
          ${o}
          ${l}
          ${u}
        </div>

        <div class="column gap-10">
          <span class="white"><strong>Render Blocking</strong></span>
          ${d}
          ${f}
        </div>

        ${g?`
              <div class="insights column gap-10">
                <strong>Analysis</strong>
                <ul>${g}</ul>
              </div>
            `:``}
      </div>
    `}if(m&&m.data){let{title:e,description:t,canonical:n,lang:r,headings:i,images:o,meta:s}=m.data,l={critical:[],warning:[],good:[]};(m.insights||[]).forEach(e=>{l[e.level]&&l[e.level].push(e.message)});let u=`
      ${a(`Critical Issues`,l.critical,`critical`)}
      ${a(`Warnings`,l.warning,`warning`)}
      ${a(`Good Signals`,l.good,`good`)}
    `,d=e?`<span><strong>Title:</strong> ${c(e,50)}</span>`:`<span class="muted">Title: missing</span>`,f=t?`<span><strong>Description:</strong> ${c(t,80)}</span>`:`<span class="muted">Description: missing</span>`,p=`<span><strong>H1:</strong> ${i?.h1??0}</span>`,g=`<span><strong>H2:</strong> ${i?.h2??0}</span>`,_=`<span><strong>Images:</strong> ${o?.total??0} (${o?.missingAlt??0} missing alt)</span>`,v=r?`<span><strong>Lang:</strong> ${r}</span>`:`<span class="muted">Lang: missing</span>`,y=n?`<span><strong>Canonical:</strong> set</span>`:`<span class="muted">Canonical: missing</span>`,b=s?.viewport?`<span><strong>Viewport:</strong> set</span>`:`<span class="muted">Viewport: missing</span>`,x=`<span><strong>Open Graph:</strong> ${s?.openGraph??0}</span>`,S=`<span><strong>Twitter:</strong> ${s?.twitter??0}</span>`;h+=`<div class="result-section"><strong>SEO</strong></div>`,h+=`
      <div class="result-card column gap-30">
        <div class="column gap-10">
          <span class="white"><strong>Structure</strong></span>
          ${d}
          ${f}
          ${v}
          ${y}
        </div>

        <div class="column gap-10">
          <span class="white"><strong>Headings & Content</strong></span>
          ${p}
          ${g}
          ${_}
        </div>

        <div class="column gap-10">
          <span class="white"><strong>Meta & Social</strong></span>
          ${b}
          ${x}
          ${S}
        </div>

        ${u?`
            <div class="insights column gap-10">
              <span class="white"><strong>Analysis</strong></span>
              <ul>${u}</ul>
            </div>
          `:``}
      </div>
    `}e.innerHTML=h}function n(e){switch(e){case`framework`:return`Framework`;case`library`:return`Library`;case`cms`:return`CMS`;default:return`Other`}}function r({hasFramework:e,hasCMS:t,hasLibrary:n}){let r=[];return!e&&!t?r.push(`No framework or CMS detected`):(e||r.push(`No frontend framework detected`),t||r.push(`No CMS detected`)),!n&&!e&&!t&&r.push(`No major frontend libraries detected`),r}function i(e,t,n){return t.length?`
    <div class="insight-group ${n}">
      <strong>${e}</strong>
      <ul>
        ${t.map(e=>`<li>${e}</li>`).join(``)}
      </ul>
    </div>
  `:``}function a(e,t,n){return t.length?`
    <div class="insight-group ${n}">
      <strong>${e} (${t.length})</strong>
      <ul>
        ${t.map(e=>`<li>${e}</li>`).join(``)}
      </ul>
    </div>
  `:``}function o(e){switch(e){case`SSR`:return`Server-side Rendering (SSR)`;case`SSG`:return`Static Site Generation (SSG)`;case`CSR`:return`Client-side Rendering (CSR)`;default:return`Unknown`}}function s(e){try{return e.split(`/`).pop().split(`?`)[0]}catch{return e}}function c(e,t=40){return e?e.length>t?e.slice(0,t)+`...`:e:``}function l(e){let n=0,r=setInterval(()=>{chrome.storage.local.get(`stackResults_${e}`,n=>{t(n[`stackResults_${e}`]||{})}),n++,n>=5&&clearInterval(r)},2e3)}