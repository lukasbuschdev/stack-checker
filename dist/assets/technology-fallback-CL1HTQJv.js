(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();function e(e,t=40){return e?e.length>t?e.slice(0,t)+`...`:e:``}function t(e){return e==null?``:e>=85?`good`:e>=60?`warning`:`critical`}function n(e){return e>=80?`good`:e>=50?`warning`:`muted`}function r(e=0,t=[]){return t.some(e=>e.decisive)?`Proven`:e>=80?`Very likely`:e>=60?`Likely`:e>=40?`Plausible`:`Weak signal`}function i(e){switch(e){case`framework`:return`Framework`;case`library`:return`Library`;case`cms`:return`CMS`;default:return`Other`}}function a(e,t,n=`good`){return`
    <div class="metric-row">
      <span>${e}</span>
      <span class="metric ${n}">
        ${t}
      </span>
    </div>
  `}function o(e){return`
    <li class="insight-item">
      <div class="insight-message">
        ${e.message}
      </div>
      ${e.fix?`
            <div class="insight-fix">
              <span class="fix-label"><strong>Fix:</strong></span> ${e.fix}
            </div>
          `:``}
    </li>
  `}function s(){return`
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
  `}export{t as a,e as c,r as i,i as n,a as o,n as r,o as s,s as t};