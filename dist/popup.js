import{a as e,i as t,t as n}from"./assets/technology-fallback-DXVk9RF2.js";function r(e){let{loadingPerformanceScore:n,interactionPerformanceScore:r,seoScore:a,overallScore:o,topIssues:s,primaryDetected:c}=e,l={critical:0,warning:0};return(s||[]).forEach(e=>{e.level===`critical`&&l.critical++,e.level===`warning`&&l.warning++}),`
    <div class="result-section"><strong>Quick Overview</strong></div>
    <div class="result-card column gap-20 summary">
      <div class="summary-score">
        <span class="block-title"><strong>Overall Score</strong></span>
        <span class="score ${t(o)}">
          ${o??`N/A`}
        </span>
      </div>

      <div class="summary-mini row gap-10">
        ${i(`Load`,n)}
        ${i(`UX`,r)}
        ${i(`SEO`,a)}
      </div>

      <div class="insights column gap-10">
        <span class="block-title mt-15"><strong>Analysis</strong></span>
        <div class="summary-status column gap-5">
          ${l.critical>0?`<span class="critical">${l.critical} critical issue${l.critical>1?`s`:``}</span>`:`<span class="good">✓ No critical issues</span>`}
          ${l.warning>0?`<span class="warning">${l.warning} warning${l.warning>1?`s`:``}</span>`:`<span class="good">No warnings</span>`}
          ${c?`<span class="good">Primary technology detected</span>`:`<span class="warning">No primary technology detected</span>`}
        </div>
      </div>

      <div class="summary-cta" id="open-dashboard-btn">
        <span class="muted">View full analysis →</span>
      </div>
    </div>
  `}function i(e,n){return`
    <div class="mini-metric column gap-10">
      <span class="muted">${e}</span>
      <span class="score ${t(n)}">
        ${n??`N/A`}
      </span>
    </div>
  `}var a=document.getElementById(`results`);chrome.tabs.query({active:!0,currentWindow:!0},t=>{let n=t[0];if(!n?.id){o({});return}chrome.storage.local.get(`stackResults_${n.id}`,t=>{o(t[`stackResults_${n.id}`]||{}),e(n.id,o)})});function o(e){let{summary:t}=e||{},i={...t,primaryDetected:!!e.primary},o=``;t&&(o+=r(i)),o||=n(),a.innerHTML=o,s()}function s(){let e=document.getElementById(`open-dashboard-btn`);e&&e.addEventListener(`click`,()=>{chrome.tabs.query({active:!0,currentWindow:!0},e=>{let t=e[0];t?.id&&chrome.tabs.create({url:chrome.runtime.getURL(`src/dashboard/dashboard.html?tabId=${t.id}`)})})})}