(() => {
  const canvas = document.querySelector('#snow');
  const ctx = canvas.getContext('2d', { alpha: true });
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const settings = { gentle: 95, storm: 230, reduced: 28 };
  let width = 0, height = 0, flakes = [], storm = false, last = 0, caught = 0;
  let currentScene = 'home';
  const rand = (a, b) => a + Math.random() * (b - a);
  function resize() {
    const dpr = Math.min(devicePixelRatio || 1, 1.6);
    width = innerWidth; height = innerHeight;
    canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
    canvas.style.width = width + 'px'; canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    resetFlakes();
  }
  function resetFlakes() {
    const count = reduced.matches ? settings.reduced : storm ? settings.storm : settings.gentle;
    flakes = Array.from({ length: count }, () => ({x:rand(0,width),y:rand(-height,height),r:rand(1,3.2),speed:rand(.42,1.4),phase:rand(0,Math.PI*2),sway:rand(.25,1.15),alpha:rand(.3,.9)}));
  }
  function frame(now) {
    if (now - last > 14) {
      last = now; ctx.clearRect(0,0,width,height);
      const wind = storm ? 1.8 : .45;
      for (const f of flakes) {
        if (!reduced.matches) { f.y += f.speed * (storm ? 1.65 : 1); f.x += Math.sin(now*.0007+f.phase)*f.sway + wind*.12; }
        if (f.y > height+5) { f.y=-5; f.x=rand(0,width); }
        if (f.x > width+5) f.x=-5; if (f.x < -5) f.x=width+5;
        ctx.beginPath(); ctx.arc(f.x,f.y,f.r,0,Math.PI*2);
        ctx.fillStyle='rgba(240,247,255,'+(storm ? Math.min(.95,f.alpha+.1) : f.alpha)+')'; ctx.fill();
      }
    }
    requestAnimationFrame(frame);
  }
  resize(); addEventListener('resize',resize); requestAnimationFrame(frame);
  reduced.addEventListener?.('change',resetFlakes);

  function showScene(name) {
    currentScene=name;
    document.querySelectorAll('.scene').forEach(s => { const on=s.id==='scene-'+name; s.hidden=!on; s.classList.toggle('active',on); });
    document.querySelectorAll('.nav-item').forEach(b=>b.classList.toggle('active',b.dataset.scene===name));
    canvas.style.pointerEvents='none';
  }
  document.querySelectorAll('[data-scene]').forEach(b=>b.addEventListener('click',()=>showScene(b.dataset.scene)));
  document.querySelectorAll('[data-go]').forEach(b=>b.addEventListener('click',()=>showScene(b.dataset.go)));
  document.querySelector('.brand').addEventListener('click',e=>{e.preventDefault();showScene('home')});

  const faces=['classic','happy','wink','surprised'], hats=['tophat','beanie','none'], scarves=['#b7728c','#83a5b8','#b78c62','#8186b7'], armTypes=['twig','none'];
  let fi=0,hi=0,si=0,ai=0;
  function flourish(){const el=document.querySelector('#sparkles');el.classList.remove('pop');void el.offsetWidth;el.classList.add('pop')}
  function setFace(){document.querySelector('#face').className='face '+faces[fi];flourish()}
  function setHat(){document.querySelector('#hat').className='hat '+hats[hi];flourish()}
  function setScarf(){document.querySelector('#scarf').style.background=scarfesafe();flourish()}
  function scarfesafe(){return scarves[si]}
  function setArms(){document.querySelector('#snowman').classList.toggle('arms-none',armTypes[ai]==='none');flourish()}
  document.querySelector('#face-choice').addEventListener('click',()=>{fi=(fi+1)%faces.length;setFace()});
  document.querySelector('#hat-choice').addEventListener('click',()=>{hi=(hi+1)%hats.length;setHat()});
  document.querySelector('#scarf-choice').addEventListener('click',()=>{si=(si+1)%scarves.length;setScarf()});
  document.querySelector('#arms-choice').addEventListener('click',()=>{ai=(ai+1)%armTypes.length;setArms()});
  document.querySelector('#head-part').addEventListener('click',()=>{fi=(fi+1)%faces.length;hi=(hi+1)%hats.length;setFace();setHat()});
  document.querySelector('#torso-part').addEventListener('click',()=>{si=(si+1)%scarves.length;setScarf()});

  const toggle=document.querySelector('#storm-toggle');
  toggle.addEventListener('click',()=>{storm=!storm;document.body.classList.toggle('storming',storm);toggle.setAttribute('aria-pressed',String(storm));toggle.textContent=storm?'Let it snow gently ❄️':'Make it snow harder ❄️';document.querySelector('#storm-state').textContent=storm?'A playful little flurry':'A soft hush of snow';resetFlakes()});

  const count=document.querySelector('#count');
  addEventListener('pointerdown',e=>{
    if(currentScene!=='catch')return;
    const rect=canvas.getBoundingClientRect(),x=e.clientX-rect.left,y=e.clientY-rect.top;
    const idx=flakes.findIndex(f=>Math.hypot(f.x-x,f.y-y)<Math.max(20,f.r+16));
    if(idx>=0){const f=flakes[idx];ctx.beginPath();ctx.arc(f.x,f.y,15,0,Math.PI*2);ctx.fillStyle='rgba(255,239,187,.85)';ctx.fill();f.y=height+20;caught++;count.textContent=caught;}
  });
  const dialog=document.querySelector('#note-dialog');
  document.querySelector('#note-open').addEventListener('click',()=>dialog.showModal());
  document.querySelector('#note-close').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});
})();
