(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=document.getElementById(`results`);chrome.tabs.query({active:!0,currentWindow:!0},e=>{let n=e[0];if(!n?.id){t({});return}chrome.storage.local.get(`stackResults_${n.id}`,e=>{t(e[`stackResults_${n.id}`]||{})})});function t(t){let{primary:i,secondary:a}=t||{},o=``,s=[];i&&s.push(i.type),a&&a.length>0&&a.forEach(e=>s.push(e.type));let c=r({hasFramework:s.includes(`framework`),hasCMS:s.includes(`cms`),hasLibrary:s.includes(`library`)});if(i){let e=(i.evidence||[]).map(e=>`<li>${e.message}</li>`).join(``),t=[...i.insights||[],...c].map(e=>`<li>${e}</li>`).join(``);o+=`<div class="result-section"><strong>Primary Technologies</strong></div>`,o+=`
      <div class="result-card primary">
        <div class="result-header">
          <strong>[${n(i.type)}] ${i.name}</strong>
          <span>${i.confidence}%</span>
        </div>

        <div class="result-main">
          ${e?`<ul>${e}</ul>`:`<p class="muted">No direct evidence found</p>`}

          ${t?`
              <div class="insights">
                <strong>Analysis</strong>
                <ul>${t}</ul>
              </div>
            `:``}
        </div>
      </div>
    `}a&&a.length>0&&(o+=`<div class="result-section"><strong>Secondary Technologies</strong></div>`,o+=a.map(e=>{let t=(e.evidence||[]).map(e=>`<li>${e.message}</li>`).join(``),r=(e.insights||[]).map(e=>`<li>${e}</li>`).join(``);return`
          <div class="result-card">
            <div class="result-header">
              <strong>[${n(e.type)}] ${e.name}</strong>
              <span>${e.confidence}%</span>
            </div>

            ${t?`<ul>${t}</ul>`:`<p class="muted">No direct evidence found</p>`}

            ${r?`
                <div class="insights">
                  <strong>Analysis</strong>
                  <ul>${r}</ul>
                </div>
              `:``}
          </div>
        `}).join(``)),o||=`
      <div class="result-card">
        <div class="result-header">
          <strong>Analysis</strong>
        </div>
        <p class="muted">
          No detectable technologies. This site likely uses server-side rendering,
          a custom framework, or heavily optimized production builds.
        </p>
      </div>
    `,e.innerHTML=o}function n(e){switch(e){case`framework`:return`Framework`;case`library`:return`Library`;case`cms`:return`CMS`;default:return`Other`}}function r({hasFramework:e,hasCMS:t,hasLibrary:n}){let r=[];return!e&&!t?r.push(`No framework or CMS detected`):(e||r.push(`No frontend framework detected`),t||r.push(`No CMS detected`)),!n&&!e&&!t&&r.push(`No major frontend libraries detected`),r}