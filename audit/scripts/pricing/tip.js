(function(){
  var tt=document.getElementById('tt'); if(!tt) return;
  function fill(el){
    var parts=(el.getAttribute('data-tip')||'').split(' | ');
    while(tt.firstChild) tt.removeChild(tt.firstChild);
    var v=document.createElement('strong'); v.textContent=parts[0]||''; tt.appendChild(v);
    if(parts.length>1){ var l=document.createElement('span'); l.textContent=parts.slice(1).join(' · '); tt.appendChild(l); }
  }
  function place(x,y){
    tt.hidden=false;
    var w=tt.offsetWidth, h=tt.offsetHeight, vw=document.documentElement.clientWidth, vh=window.innerHeight;
    var left=Math.min(Math.max(8,x+14), vw-w-8), top=y+16; if(top+h>vh-8) top=y-h-12;
    tt.style.left=left+'px'; tt.style.top=Math.max(8,top)+'px';
  }
  var cur=null;
  document.addEventListener('pointermove',function(e){
    var el=e.target.closest ? e.target.closest('[data-tip]') : null;
    if(!el){ if(cur){ tt.hidden=true; cur=null; } return; }
    if(el!==cur){ fill(el); cur=el; }
    place(e.clientX,e.clientY);
  },{passive:true});
  document.addEventListener('pointerleave',function(){ tt.hidden=true; cur=null; });
  document.addEventListener('scroll',function(){ if(cur && document.activeElement!==cur){ tt.hidden=true; cur=null; } },{passive:true});
  document.addEventListener('focusin',function(e){
    var el=e.target.closest ? e.target.closest('[data-tip]') : null;
    if(!el) return; fill(el); cur=el; var r=el.getBoundingClientRect(); place(r.left+Math.min(r.width/2,160), r.top+r.height/2);
  });
  document.addEventListener('focusout',function(){ tt.hidden=true; cur=null; });
  document.addEventListener('keydown',function(e){ if(e.key==='Escape'){ tt.hidden=true; } });
})();
