(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=document.getElementById(`results`);chrome.tabs.query({active:!0,currentWindow:!0},e=>{let n=e[0];if(!n?.id){t({});return}chrome.storage.local.get(`stackResults_${n.id}`,e=>{t(e[`stackResults_${n.id}`]||{})})});function t(t){let{primary:a,secondary:o,rendering:s,cdn:c}=t||{},l=``,u=[];a&&u.push(a.type),o&&o.length>0&&o.forEach(e=>u.push(e.type));let d=r({hasFramework:u.includes(`framework`),hasCMS:u.includes(`cms`),hasLibrary:u.includes(`library`)});if(a){let e=(a.evidence||[]).map(e=>`<li>${e.message}</li>`).join(``),t=[...a.insights||[],...d].map(e=>`<li>${e}</li>`).join(``);l+=`<div class="result-section"><strong>Primary Technologies</strong></div>`,l+=`
      <div class="result-card primary column gap-20">
        <div class="result-header">
          <strong>[${n(a.type)}] ${a.name}</strong>
          <strong>${a.confidence}%</strong>
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
    `}if(o&&o.length>0&&(l+=`<div class="result-section"><strong>Secondary Technologies</strong></div>`,l+=o.map(e=>{let t=(e.evidence||[]).map(e=>`<li>${e.message}</li>`).join(``),r=(e.insights||[]).map(e=>`<li>${e}</li>`).join(``);return`
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
        `}).join(``)),l||=`
      <div class="result-card column gap-20">
        <div class="result-header">
          <strong>Analysis</strong>
        </div>
        <span class="muted">
          No detectable technologies. This site likely uses server-side rendering,
          a custom framework, or heavily optimized production builds.
        </span>
      </div>
    `,s){let e=(s.evidence||[]).map(e=>`<li>${e.message}</li>`).join(``);l+=`<div class="result-section"><strong>Rendering Strategy</strong></div>`,l+=`
    <div class="result-card column gap-20">
      <div class="result-header">
        <strong>${i(s.strategy)}</strong>
        <strong>${s.confidence}%</strong>
      </div>

      ${e?`<ul>${e}</ul>`:`<span class="muted">No clear rendering evidence found</span>`}
    </div>
  `}if(c){let e=(c.evidence||[]).map(e=>`<li>${e.message}</li>`).join(``),t=c.edge?`<span><strong>Edge:</strong> ${c.edge}</span>`:``,n=c.assets&&c.assets.length>0?`<span><strong>Assets:</strong> ${c.assets.join(`, `)}</span>`:``,r=c.source===`headers`?`<span><strong>Detected via:</strong> server headers</span>`:`<span><strong>Detected via:</strong> resource analysis</span>`,i=c.platform?`<span><strong>Platform:</strong> ${c.platform}</span>`:``;l+=`<div class="result-section"><strong>Delivery & Hosting</strong></div>`,l+=`
      <div class="result-card column gap-20">
        <div class="result-header">
          <strong>${c.edge||c.platform||(c.assets.length>0?`Asset CDN detected`:`No CDN detected`)}</strong>
          <strong>${c.confidence}%</strong>
        </div>

        <div class="column gap-20">
          ${r}
          ${t}
          ${i}
          ${n}
        </div>

        ${e?`<ul>${e}</ul>`:`<span class="muted">No clear CDN evidence found</span>`}
      </div>
    `}e.innerHTML=l}function n(e){switch(e){case`framework`:return`Framework`;case`library`:return`Library`;case`cms`:return`CMS`;default:return`Other`}}function r({hasFramework:e,hasCMS:t,hasLibrary:n}){let r=[];return!e&&!t?r.push(`No framework or CMS detected`):(e||r.push(`No frontend framework detected`),t||r.push(`No CMS detected`)),!n&&!e&&!t&&r.push(`No major frontend libraries detected`),r}function i(e){switch(e){case`SSR`:return`Server-side Rendering (SSR)`;case`SSG`:return`Static Site Generation (SSG)`;case`CSR`:return`Client-side Rendering (CSR)`;default:return`Unknown`}}