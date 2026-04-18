(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();function e(e,t,n){return!t||!t.length?``:`
    <div class="insight-group ${n}">
      <strong>${e}</strong>
      <ul>
        ${t.map(e=>`<li>${e}</li>`).join(``)}
      </ul>
    </div>
  `}function t(e,t=40){return e?e.length>t?e.slice(0,t)+`...`:e:``}function n(e){return e==null?``:e>=85?`good`:e>=60?`warning`:`critical`}function r(e){return e>=85?`good`:e>=60?`warning`:`critical`}function i(e,t){let n=0,r=setInterval(()=>{chrome.storage.local.get(`stackResults_${e}`,n=>{t(n[`stackResults_${e}`]||{})}),n++,n>=5&&clearInterval(r)},1e3);chrome.storage.onChanged.addListener((n,r)=>{if(r!==`local`)return;let i=`stackResults_${e}`;n[i]&&t(n[i].newValue||{})})}function a(){return`
    <div class="result-section"><strong>Analysis</strong></div>
    <div class="result-card column gap-20">
      <div class="metric-block">
        <span class="block-title">Result</span>
        <span class="muted">
          No detectable technologies. This site likely uses server-side rendering,
          a custom framework, or heavily optimized production builds.
        </span>
      </div>
    </div>
  `}export{i as a,n as i,e as n,t as o,r,a as t};