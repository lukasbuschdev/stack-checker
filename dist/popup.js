(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=document.getElementById(`results`);chrome.tabs.query({active:!0,currentWindow:!0},e=>{let n=e[0];if(!n?.id){t([]);return}chrome.storage.local.get(`stackResults_${n.id}`,e=>{t(e[`stackResults_${n.id}`]||[])})});function t(t){let n=t.filter(e=>e.detected).sort((e,t)=>t.confidence-e.confidence);if(n.length===0){e.innerHTML=`<p>No technologies detected</p>`;return}e.innerHTML=n.map(e=>{let t=e.evidence.map(e=>`<li>${e.message}</li>`).join(``);return`
        <div class="result-card">
          <div class="result-header">
            <strong>${e.name}</strong>
            <strong>${e.confidence}%</strong>
          </div>
          <ul>
            ${t}
          </ul>
        </div>
      `}).join(``)}