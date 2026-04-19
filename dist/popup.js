import{a as e,o as t,t as n}from"./assets/technology-fallback-DZ6uqGjN.js";function r(t){let{loadingPerformanceScore:n,interactionPerformanceScore:r,seoScore:a,accessibilityScore:o,overallScore:s,totalIssueCounts:c,primaryDetected:l}=t,u={critical:c?.critical??0,warning:c?.warning??0};return`
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
        ${i(`Loading`,n)}
        ${i(`UX`,r)}
        ${i(`SEO`,a)}
        ${i(`Accessibility`,o)}
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
  `}function i(t,n){return`
    <div class="mini-metric column gap-10">
      <span class="muted">${t}</span>
      <span class="score ${e(n)}">
        ${n??`N/A`}
      </span>
    </div>
  `}var a=document.getElementById(`results`);chrome.tabs.query({active:!0,currentWindow:!0},e=>{let n=e[0];if(!n?.id){o({});return}chrome.storage.local.get(`stackResults_${n.id}`,e=>{o(e[`stackResults_${n.id}`]||{}),t(n.id,o)})});function o(e){let{summary:t}=e||{},i={...t,primaryDetected:!!e.primary},o=``;t&&(o+=r(i)),o||=n(),a.innerHTML=o,s()}function s(){let e=document.getElementById(`open-dashboard-btn`);e&&e.addEventListener(`click`,()=>{chrome.tabs.query({active:!0,currentWindow:!0},e=>{let t=e[0];t?.id&&chrome.tabs.create({url:chrome.runtime.getURL(`src/dashboard/dashboard.html?tabId=${t.id}`)})})})}