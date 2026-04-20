import{a as e,t}from"./assets/technology-fallback-CL1HTQJv.js";function n(t){let{loadingPerformanceScore:n,interactionPerformanceScore:i,seoScore:a,accessibilityScore:o,overallScore:s,totalIssueCounts:c,primaryDetected:l}=t,u={critical:c?.critical??0,warning:c?.warning??0};return`
    <div class="result-section"><strong>Quick Overview</strong></div>
    <div class="result-card column gap-20 summary">
      <div class="summary-score">
        <div class="row gap-10 align-center">
          <span class="block-title"><strong>Overall Score</strong></span>
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
        <span class="score ${e(s)}">
          ${s??`N/A`}
        </span>
      </div>

      <div class="summary-mini row gap-10">
        ${r(`Loading`,n)}
        ${r(`UX`,i)}
        ${r(`SEO`,a)}
        ${r(`Accessibility`,o)}
      </div>

      <div class="insights column gap-10">
        <span class="block-title mt-15"><strong>Analysis</strong></span>
        <div class="summary-status column gap-5">
          ${u.critical>0?`<span class="critical">${u.critical} critical issue${u.critical>1?`s`:``}</span>`:`<span class="good">✓ No critical issues</span>`}
          ${u.warning>0?`<span class="warning">${u.warning} warning${u.warning>1?`s`:``}</span>`:`<span class="good">No warnings</span>`}
          ${l?`<span class="good">Primary technology detected</span>`:`<span class="warning">No primary technology detected</span>`}
        </div>
      </div>

      <div class="summary-cta" id="open-dashboard-btn">
        <span class="muted">View full analysis →</span>
      </div>
    </div>
  `}function r(t,n){return`
    <div class="mini-metric column gap-10">
      <span class="muted">${t}</span>
      <span class="score ${e(n)}">
        ${n??`N/A`}
      </span>
    </div>
  `}var i=document.getElementById(`results`),a=7e3,o=250;s();function s(){l(),chrome.tabs.query({active:!0,currentWindow:!0},async e=>{let t=e[0];if(!t?.id){u({});return}u(await c(t.id)||{})})}function c(e){return new Promise(t=>{let n=`stackResults_${e}`,r=Date.now(),i=null,s=setInterval(()=>{chrome.storage.local.get(n,e=>{let o=e[n];o&&(i=o);let c=o?.meta?.isFinal===!0,l=Date.now()-r>=a;(c||l)&&(clearInterval(s),t(i))})},o)})}function l(){i.innerHTML=`
    <div class="result-section loading-state">
      <div class="loading-title">Analyzing page...</div>
      <div class="loading-text">Waiting for stable results</div>
    </div>
  `}function u(e){let{summary:r}=e||{},a={...r,primaryDetected:!!e.primary},o=``;r&&(o+=n(a)),o||=t(),i.innerHTML=o,d()}function d(){let e=document.getElementById(`open-dashboard-btn`);e&&e.addEventListener(`click`,()=>{chrome.tabs.query({active:!0,currentWindow:!0},e=>{let t=e[0];t?.id&&chrome.tabs.create({url:chrome.runtime.getURL(`src/dashboard/dashboard.html?tabId=${t.id}`)})})})}