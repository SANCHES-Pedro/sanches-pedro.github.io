import rough from "roughjs";

const colors = {
  clay: ["#e7ccb0","#f1d9be","#50332b","#8b6656","#af462d","#f9ebd8"],
  violet: ["#d9d0ee","#ece4fa","#332747","#74608f","#6245a7","#f6edff"],
  sage: ["#cdd6b3","#e0e7cb","#304331","#6a7c58","#427350","#edf2dd"],
  blue: ["#bfd6df","#d8e7eb","#233e4d","#567b8e","#2c6883","#edf3f1"],
  gold: ["#e8d8a3","#f1e6bd","#4a3b26","#967b4f","#88662a","#faf1d3"],
  rose: ["#e8c9c3","#f1d8d2","#552e3e","#9d6875","#a64161","#f9e5dd"]
};
const rotate = Math.PI / 180;
const foot = "M -16 93 C -41 92 -44 73 -34 48 C -27 28 -34 16 -45 -7 C -57 -30 -46 -48 -37 -63 C -33 -70 -28 -72 -26 -66 C -23 -76 -18 -81 -13 -74 C -9 -84 -4 -87 1 -81 C 6 -91 14 -87 18 -81 C 25 -96 41 -92 44 -81 C 47 -72 43 -58 47 -45 C 54 -23 36 -10 28 9 C 18 28 18 54 19 70 C 20 88 8 95 -16 93 Z";
const insole = "M -16 93 C -41 92 -44 73 -34 48 C -27 28 -36 13 -47 -9 C -57 -31 -46 -57 -32 -75 C -18 -94 18 -99 37 -85 C 59 -68 54 -39 42 -19 C 33 -5 21 14 20 39 C 19 51 20 65 19 75 C 18 91 5 95 -16 93 Z";
const lung = "M -7 -55 C -22 -60 -38 -39 -45 -20 C -52 -1 -60 38 -46 47 C -35 54 -22 46 -13 42 C -3 36 -3 24 -4 9 Z";
const brain = "M 0 -68 C -28 -72 -64 -57 -73 -34 C -84 -12 -78 17 -63 36 C -52 56 -26 66 -2 59 C 22 66 49 54 64 38 C 80 18 84 -11 71 -34 C 55 -61 25 -71 0 -68 Z";
const box = (x: number, y: number, w: number, h: number) => "M"+x+" "+y+"h"+w+"v"+h+"h"+(-w)+"Z";
function rng(seed: number) {
  return () => {
    seed = (Math.imul(seed,1664525)+1013904223) >>> 0;
    return seed / 4294967296;
  };
}
function lerp(a: number, b: number, t: number) { return a+(b-a)*t; }
function ramp(p: number, start: number, end: number) { return Math.max(0,Math.min(1,(p-start)/(end-start))); }
type Theme = keyof typeof colors;

function prepareSketch(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  theme: Theme,
  progress: number,
  mini: boolean,
) {
  const [bg, paper, ink, faint, accent, light] = colors[theme];
  const random=rng(417);
  const roughCanvas = !mini && progress===1 ? rough.canvas(canvas) : null;
  const sizeX=640, sizeY=360;
  ctx.setTransform(canvas.width/sizeX,0,0,canvas.height/sizeY,0,0);
  ctx.fillStyle=bg;
  ctx.fillRect(0,0,sizeX,sizeY);

  function shape(d: string, stroke: string | null = ink, fill: string | null = null, width=2, roughen=false) {
    const path=new Path2D(d);
    if (fill) { ctx.fillStyle=fill; ctx.fill(path); }
    if (!stroke) return;
    if (roughen && roughCanvas) {
      roughCanvas.path(d,{stroke,seed:137,strokeWidth:width*.78,roughness:.57,disableMultiStroke:true});
      return;
    }
    ctx.lineJoin="round";
    ctx.lineCap="round";
    ctx.strokeStyle=stroke;
    ctx.lineWidth=width;
    ctx.stroke(path);
  }
  function line(x1: number, y1: number, x2: number, y2: number, color=faint, width=1.3) {
    shape("M"+x1+" "+y1+" L"+x2+" "+y2,color,null,width);
  }
  function ellipse(x: number, y: number, rx: number, ry: number, stroke: string | null = ink, fill: string | null = null, w=2) {
    ctx.beginPath();
    ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);
    if (fill) { ctx.fillStyle=fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle=stroke; ctx.lineWidth=w; ctx.stroke(); }
  }
  function label(text: string, x: number, y: number, color=ink, align: CanvasTextAlign="center") {
    if (mini) return;
    ctx.fillStyle=color;
    ctx.font="500 14px 'IBM Plex Mono',monospace";
    ctx.textAlign=align;
    ctx.fillText(text,x,y);
  }
  function arrow(x1: number, y1: number, x2: number, y2: number, color=accent,w=2) {
    const a=Math.atan2(y2-y1,x2-x1);
    line(x1,y1,x2,y2,color,w);
    line(x2,y2,x2-Math.cos(a-.53)*8,y2-Math.sin(a-.53)*8,color,w);
    line(x2,y2,x2-Math.cos(a+.53)*8,y2-Math.sin(a+.53)*8,color,w);
  }
  function local(x: number, y: number, scale: number, fn: () => void, deg=0) {
    ctx.save();
    ctx.translate(x,y);
    ctx.rotate(deg*rotate);
    ctx.scale(scale,scale);
    fn();
    ctx.restore();
  }
  function clip(path: string, fn: () => void) {
    ctx.save();
    ctx.clip(new Path2D(path));
    fn();
    ctx.restore();
  }
  function grid(x: number, y: number, w: number, h: number, space=14, color=faint) {
    for (let dx=0; dx<=w; dx+=space) line(x+dx,y,x+dx,y+h,color,.8);
    for (let dy=0; dy<=h; dy+=space) line(x,y+dy,x+w,y+dy,color,.8);
  }
  function frame(x: number, y: number, w: number, h: number) {
    shape(box(x,y,w,h),ink,paper,1.8,true);
    line(x,y+13,x+w,y+13,faint,.8);
    for(let i=0;i<3;i++) ellipse(x+8+i*6,y+6,1.2,1.2,null,faint);
  }
  function field(x: number, y: number, w: number, h: number, density: number, amount=1) {
    for(let i=0;i<density;i++) {
      const px=x+random()*w, py=y+random()*h, weight=random();
      if(weight>amount) continue;
      ellipse(px,py,.45+weight*2,.45+weight*2,null,i%5===0?accent:faint);
    }
  }
  function chest(x: number, y: number, s: number, highlight=false, spread=0) {
    local(x,y,s,()=>{
      shape("M-64 -73 Q-52 -88 -20 -85 L20 -85 Q52 -88 64 -73 L68 68 Q50 81 0 80 Q-50 81 -68 68Z",faint,paper,1.3);
      shape(lung,ink,light,2.3,true);
      ctx.save(); ctx.scale(-1,1); shape(lung,ink,light,2.3,true); ctx.restore();
      line(0,-69,0,61,ink,3);
      for (let i=0;i<9;i++) {
        const y=-62+i*13;
        shape("M-60 "+(y+7)+" Q-32 "+(y-10)+" -5 "+y+" M5 "+y+" Q32 "+(y-10)+" 60 "+(y+7),faint,null,1.1);
      }
      shape("M-24 -59 Q-18 -68 -7 -72 M7 -72 Q18 -68 24 -59",ink,null,1.4);
      if(highlight) {
        const r=13+spread*8;
        ellipse(29,13,r,r*.82,accent,null,2);
        line(29-r-8,13,29-r+6,13,accent,1.3);
        line(29,13-r-7,29,13-r+5,accent,1.3);
        ellipse(29,13,r*.33,r*.25,null,accent);
      }
    });
  }
  function brainScan(x: number, y: number, s: number, lesion=false, p=1) {
    local(x,y,s,()=>{
      shape(brain,ink,paper,2.7,true);
      shape("M0 -60 Q-8 -33 0 -13 Q9 5 0 50",faint,null,1.3);
      for(let i=0;i<5;i++) {
        const y=-41+i*17;
        const ri=(i%2)*7;
        shape("M"+(-63+ri)+" "+y+" Q-46 "+(y-15)+" -37 "+(y-2)+" Q-29 "+(y+10)+" -15 "+(y-4),faint,null,1.45);
        shape("M"+(63-ri)+" "+y+" Q46 "+(y-15)+" 37 "+(y-2)+" Q29 "+(y+10)+" 15 "+(y-4),faint,null,1.45);
      }
      if(lesion && p>.1) {
        const mark="M28 -26 Q51 -28 54 -8 Q55 5 32 4 Q17 -1 20 -12Z";
        shape(mark,accent,accent,1.8,true);
        ellipse(35,-10,25,22,accent,null,1.2);
      }
    });
  }
  const points=[[-64,5],[-13,-57],[-9,55],[48,-17],[91,48]];
  function network(x: number, y: number, s: number, p: number, branch=0) {
    local(x,y,s,()=>{
      const locations=points.map(([x1,y1],i)=>[lerp(x1+38*Math.sin(i*2.61),x1,p),lerp(y1+52*Math.cos(i*2.03),y1,p)]);
      [[0,1],[0,2],[1,3],[2,3],[2,4],[3,4]].forEach(([a,b],i)=>{
        if(i===4 && branch) return;
        const [ax,ay]=locations[a], [bx,by]=locations[b];
        const angle=Math.atan2(by-ay,bx-ax);
        const dx=Math.cos(angle)*12, dy=Math.sin(angle)*12;
        const q=ramp(p,i*.044,.65+i*.045);
        if(q>0) arrow(ax+dx,ay+dy,lerp(ax+dx,bx-dx,q),lerp(ay+dy,by-dy,q),i<2?accent:faint,2.4);
      });
      locations.forEach(([x1,y1],i)=>{
        ellipse(x1,y1,i===0?13:11,i===0?13:11,i===0?accent:ink,i===0?accent:paper,2.3);
        if(i>0) ellipse(x1,y1,2.1,2.1,null,ink);
      });
    });
  }
  function pages(x: number, y: number, w: number, h: number) {
    shape(box(x+13,y-13,w,h),faint,paper,1.2);
    shape(box(x+6,y-6,w,h),faint,paper,1.2);
    shape(box(x,y,w,h),ink,light,2,true);
    for(let i=0;i<4;i++) line(x+17,y+24+i*12,x+w-17-(i%3)*15,y+24+i*12,faint,1.3);
  }
  function flow(x1: number, x2: number, y: number, p: number, start=.22) {
    const end=lerp(x1+1,x2,ramp(p,start,start+.38));
    if(end>x1+7) arrow(x1,y,end,y);
  }
  function vessels(x: number, y: number, s: number, p: number) {
    local(x,y,s,()=>{
      const trunk="M0 77 Q8 40 -1 15 Q-6 -6 2 -35 Q6 -49 4 -68";
      shape(trunk,accent,null,5,true);
      for(let i=0;i<7;i++){
        const q=ramp(p,.02+i*.05,.38+i*.063);
        if(q<.02) continue;
        const sign=i%2?1:-1, y=49-i*16, span=(65-i*3)*sign*q;
        shape("M0 "+y+" Q"+(span*.22)+" "+(y-26*q)+" "+(span*.55)+" "+(y-20*q)+" Q"+(span*.8)+" "+(y-14*q)+" "+span+" "+(y-31*q),accent,null,2.6,true);
        line(span*.57,y-20*q,span*.74,y-42*q,accent,1.3);
        line(span*.34,y-22*q,span*.52,y-31*q,accent,1);
      }
    });
  }
  function profileSolid(p: number, shift=0) {
    const a=lerp(26,83,ramp(p,.08,.83)), b=lerp(-12,-51,ramp(p,.08,.83));
    const front="M-118 49 L-92 -35 L-48 -58 Q12 -92 110 -38 L115 8 Q68 35 10 27 L-43 77Z";
    ctx.save();
    ctx.translate(284+shift,185);
    shape("M-118 49 L"+(-118+a)+" "+(49+b)+" L"+(-92+a)+" "+(-35+b)+" L-92 -35Z",faint,bg,2);
    local(a,b,1,()=>shape(front,ink,paper,2.4,true));
    shape("M-92 -35 L"+(-92+a)+" "+(-35+b)+" L"+(-48+a)+" "+(-58+b)+" L-48 -58Z",ink,bg,1.8);
    shape("M-48 -58 L"+(-48+a)+" "+(-58+b)+" Q"+(12+a)+" "+(-92+b)+" "+(110+a)+" "+(-38+b)+" L110 -38 Q12 -92 -48 -58Z",ink,paper,2,true);
    shape("M110 -38 L"+(110+a)+" "+(-38+b)+" L"+(115+a)+" "+(8+b)+" L115 8Z",ink,bg,2);
    shape(front,ink,paper,2.6,true);
    shape("M-77 30 L-62 -19 L-24 -43 Q32 -68 83 -26 L85 -10 Q32 10 -4 4 L-54 49Z",accent,light,2.9,true);
    for(let i=0;i<7;i++){
      const x=-43+i*23;
      const y=-60-13*Math.sin(i/6*Math.PI);
      line(x,y,x+a,y+b,faint,1.2);
      ellipse(x,y,3,3,accent,light,1.4);
    }
    ctx.restore();
  }
  const sheet = {shape,line,ellipse,label,arrow,local,clip,grid,frame,field,chest,brainScan,network,pages,flow,vessels,profileSolid,ctx,bg,paper,ink,faint,accent,light,random,p:progress};

  ctx.globalAlpha=.23;
  grid(20,20,600,320,20);
  ctx.globalAlpha=.13;
  field(14,14,612,332,mini?290:1350,.99);
  ctx.globalAlpha=1;
  for (const [x,y,dx,dy] of [[20,20,1,1],[620,20,-1,1],[20,340,1,-1],[620,340,-1,-1]]) {
    line(x,y,x+dx*16,y,ink,1.4); line(x,y,x,y+dy*16,ink,1.4);
  }
  return sheet;
}

type Sheet = ReturnType<typeof prepareSketch>;

function orthotic(a: Sheet) {
  const {shape,line,ellipse,label,local,clip,flow,ctx,paper,ink,accent,faint,bg,light,p}=a;
  shape("M83 62 Q83 51 95 51H187Q199 51 199 64V267Q199 279 187 279H95Q83 279 83 267Z",ink,paper,2.7,true);
  shape(box(93,72,96,174),faint,light,1.5);
  line(124,62,157,62,ink,2);
  ellipse(141,262,5,5,faint,null,1.3);
  local(142,154,.68,()=>{
    shape(foot,faint,null,1.8);
    clip(foot,()=>{
      for(let y=-82;y<95;y+=14) line(-54,y,54,y,faint,.9);
      for(let x=-43;x<54;x+=14) line(x,-95,x,95,faint,.9);
      if(p<1) line(-60,lerp(-90,92,p),60,lerp(-90,92,p),accent,4);
    });
  });
  flow(214,254,168,p,.12);
  local(319,160,.99,()=>{
    shape(foot,ink,paper,2.1,true);
    clip(foot,()=>{
      for(let i=-180;i<185;i+=12){
        line(-60,i,68,i+57,faint,1.2);
        line(-60,i,68,i-52,faint,1.15);
      }
      const cloud=ramp(p,.22,.8);
      for(let i=1;i<5;i++) ellipse(-10,-33,9+i*6*cloud,5+i*7*cloud,accent,null,1.7);
      for(let i=0;i<4;i++) ellipse(-9,66,8+i*5,5+i*4,accent,null,1.45);
    });
  },-11);
  flow(381,420,168,p,.38);
  local(492,158,1.03,()=>{
    ctx.save();ctx.translate(1,lerp(0,13,ramp(p,.34,.9)));shape(insole,ink,accent,2.8,true);ctx.restore();
    shape(insole,ink,paper,2.4,true);
    clip(insole,()=>{
      for(let i=0;i<16;i++){
        const y=-92+i*12;
        shape("M-57 "+y+" Q-13 "+(y+44)+" 52 "+(y+7),faint,null,1.2);
      }
      for(let i=0;i<5;i++) ellipse(-7,-22,8+i*7,9+i*7,accent,null,1.4);
    });
  },22);
  label("PHONE SCAN",141,310);label("3D MODEL",319,310);label("CUSTOM INSOLE",495,310);
  line(75,324,558,324,faint,.8);
  for(let x=81;x<=560;x+=16) line(x,321,x,327,faint,.9);
}
function synthesis(a: Sheet) {
  const {shape,line,label,field,chest,frame,flow,bg,paper,faint,p}=a;
  frame(64,79,144,197);
  field(77,103,115,149,410,.98);
  flow(220,260,173,p,.16);
  frame(273,79,112,197);
  chest(329,181,.72);
  const opacity=a.ctx.globalAlpha;
  a.ctx.globalAlpha=.57*(1-ramp(p,.27,.83));
  field(284,112,90,127,190,.98);
  a.ctx.globalAlpha=opacity;
  flow(396,429,173,p,.4);
  shape(box(456,79,126,190),faint,bg,1.2);
  shape(box(449,85,126,190),faint,paper,1.2);
  frame(440,92,126,190);
  chest(503,191,.75);
  label("NOISE",135,304);label("DENOISE",329,304);label("SYNTHETIC IMAGE",506,304);
}
function causalGraph(a: Sheet, kind="discovery") {
  const {shape,label,field,network,frame,flow,ellipse,p,accent,ink,faint,paper}=a;
  if(kind==="intervention") {
    network(170,167,1.12,1,1);
    flow(293,349,167,p,.14);
    network(446,167,1.22,p);
    ellipse(369,173,21,21,accent,null,1.5);
    label("INTERVENE",168,289);
    label("TRACE THE EFFECT",454,289);
    return;
  }
  frame(55,74,209,202);
  field(76,103,167,149,300,.86);
  for(let i=0;i<4;i++) ellipse(103+i*33,144+32*Math.sin(i*2),18,18,i===0?accent:faint,null,1.5);
  flow(277,341,172,p,.19);
  shape(box(357,74,225,202),faint,paper,1.2);
  network(458,169,1.13,p);
  label("OBSERVATIONS",159,304);label("CAUSAL ORDER",470,304);
}
function edit(a: Sheet, mode="chest") {
  const {label,frame,flow,chest,brainScan,shape,line,accent,faint,paper,p}=a;
  frame(65,67,211,219);frame(361,67,211,219);
  if(mode==="brain") {
    brainScan(170,184,1.08,true);
    brainScan(467,184,1.08,p<.5);
    label("OBSERVED",172,312);label("HEALTHY COUNTERFACTUAL",468,312);
  } else {
    chest(171,183,1.08);
    chest(467,183,1.08,true,ramp(p,.26,.9));
    const x=lerp(374,556,ramp(p,.15,.85));
    if(p<1) line(x,93,x,268,accent,2);
    label("INPUT",170,312);label("LOCALIZED EDIT",468,312);
  }
  flow(288,349,177,p,.25);
}
function ledger(a: Sheet) {
  const {chest,frame,shape,label,arrow,ellipse,line,accent,ink,faint,paper,light,p}=a;
  frame(62,68,185,227);
  chest(155,185,1.06);
  ["FIDELITY","PRIVACY","UTILITY"].forEach((name,i)=>{
    const y=68+i*78;
    arrow(253,180,333,y+29,faint,1.3);
    shape(box(348,y,221,60),ink,paper,1.5,true);
    if(i===0){ ellipse(377,y+30,15,15,accent,light,1.5);ellipse(384,y+30,11,11,faint,paper,1.6); }
    if(i===1){ shape("M367 "+(y+31)+"h22v15h-22Z M371 "+(y+31)+"v-8a7 7 0 0 1 14 0v8",accent,null,2); }
    if(i===2){ shape("M366 "+(y+31)+"l7 8l15 -17",accent,null,2.4); }
    const q=ramp(p,.08+i*.12,.48+i*.13);
    line(411,y+42,411+128*q,y+42,accent,2);
    label(name,413,y+29,ink,"left");
  });
}
function counterfactual(a: Sheet) {
  const {network,brainScan,shape,label,frame,flow,ellipse,accent,p}=a;
  frame(54,82,229,192);network(151,181,1.04,ramp(p,0,.77),1);
  flow(294,355,177,p,.29);
  frame(368,82,211,192);brainScan(475,181,1.12,true,p);
  const r=ramp(p,.35,.92);
  if(r>0) ellipse(515,171,23*r,21*r,accent,null,2);
  label("CHANGE ONE CAUSE",168,304);label("SYNTHESIZE THE EFFECT",474,304);
}
function branches(a: Sheet, clinical=false) {
  const {shape,line,label,frame,flow,brainScan,vessels,accent,ink,faint,paper,p}=a;
  for(let i=3;i>=0;i--){
    const x=81+i*17,y=95-i*12;
    shape("M"+x+" "+y+"l143 26v137l-143 -26Z",ink,paper,1.7,true);
    if(i===0) brainScan(x+70,y+80,.66,false);
  }
  flow(269,331,166,p,.18);
  frame(345,65,230,226);
  if(clinical) {
    brainScan(459,186,1.23,true);
    a.ctx.globalAlpha=.75;
    vessels(459,179,.74,p);
    a.ctx.globalAlpha=1;
  } else {
    brainScan(459,185,1.24,false);
    vessels(459,185,.97,p);
  }
  label("SOURCE SLICES",160,312);label(clinical?"SEGMENTED REGION":"VESSEL NETWORK",459,312);
}
function modalStack(a: Sheet, mode="models") {
  const {chest,brainScan,shape,line,frame,flow,label,local,accent,ink,faint,paper,p}=a;
  if(mode==="grounding") {
    frame(66,78,203,197);
    for(let i=0;i<8;i++) line(89,117+i*16,237-(i%4)*13,117+i*16,i===4?accent:faint,i===4?6:2);
    flow(275,353,176,p,.17);
    frame(363,78,208,197);chest(467,180,1.04,true,p);
    label("REPORT PHRASE",166,304);label("IMAGE REGION",467,304);
    return;
  }
  if(mode==="benchmark") {
    frame(65,98,159,168);brainScan(145,185,.87,true);
    for(let i=0;i<3;i++){
      const x=344+i*98,y=i%2?72:123;
      if(p>i*.11) {
        frame(x-42,y,91,122);
        brainScan(x+3,y+67,.5,i===2);
        a.arrow(228,179,x-47,y+62,i===2?accent:faint,1.3);
      }
    }
    label("SOURCE IMAGE",146,303);label("COUNTERFACTUALS",441,303);
    return;
  }
  chest(124,171,.7);brainScan(246,173,.82,false);
  flow(329,389,173,p,.16);
  for(let i=3;i>=0;i--){
    const x=430+i*10,y=127-i*18;
    shape("M"+x+" "+y+"l111 24l-30 64l-111 -24Z",ink,paper,1.7,true);
    line(x+12,y+15,x+88,y+31,faint,1.2);
    line(x+6,y+26,x+78,y+42,i===0?accent:faint,1.3);
  }
  label("IMAGING MODALITIES",185,293);label("MODEL TOOLBOX",486,293);
}
function chronograph(a: Sheet, mode="temporal") {
  const {shape,line,ellipse,label,arrow,frame,flow,field,accent,ink,faint,paper,p}=a;
  if(mode==="samsung"){
    for(let i=1;i>=0;i--){
      const x=61+i*55,y=92-i*23;
      frame(x,y,167,160);
      shape("M"+(x+14)+" "+(y+122)+" l48 -51 l31 32 l25 -22 l37 41Z",faint,paper,1.3);
      ellipse(x+109,y+39,12,12,accent,null,1.5);
    }
    flow(295,376,163,p);
    frame(389,78,190,181);
    for(let row=0;row<7;row++)for(let col=0;col<8;col++){
      const on=(row*7+col*3)%13<3;
      shape(box(405+20*col,105+19*row,15,14),faint,on?accent:paper,1);
    }
    label("VIDEO FRAMES",176,303);label("COMPRESSED LATENTS",483,303);
    return;
  }
  frame(66,62,507,233);
  for(let j=0;j<3;j++){
    const base=113+j*70;
    line(98,base,545,base,faint,.9);
    let d="M99 "+base;
    for(let i=1;i<95;i++){
      const x=99+i*4.65;
      const y=base+(12*Math.sin(i/6+j*.7)+8*Math.sin(i/2.4+j))*ramp(p,.025*j,.65+j*.09);
      d+="L"+x+" "+y;
    }
    shape(d,j===0?ink:accent,null,2,true);
  }
  arrow(209,116,260,180,ink,1.8);arrow(315,185,367,252,ink,1.8);
  label("SIGNALS OVER TIME",319,321);
}
function registration(a: Sheet) {
  const {shape,line,ellipse,label,chest,flow,accent,faint,p}=a;
  chest(147,171,1.2);chest(477,171,1.2);
  a.ctx.globalAlpha=.7;
  a.local(477+lerp(-28,0,p),171+lerp(24,0,p),1.2,()=>{
    shape(lung,accent,null,2.7);
    a.ctx.save();a.ctx.scale(-1,1);shape(lung,accent,null,2.7);a.ctx.restore();
  });
  a.ctx.globalAlpha=1;
  flow(243,376,170,p,.12);line(472,89,472,260,faint,.8);
  label("BREATHING PHASE",147,304);label("ALIGNED CT",477,304);
}
function education(a: Sheet, mode="phd") {
  const {shape,line,ellipse,label,arrow,frame,flow,network,brainScan,pages,local,accent,ink,faint,paper,light,p}=a;
  if(mode==="pose") {
    const joints=[[0,-75],[-2,-41],[-48,0],[-73,30],[46,-4],[69,36],[-2,20],[-32,66],[-38,98],[31,66],[39,98]];
    frame(64,71,229,211);frame(350,71,229,211);
    local(178,164,.78,()=>{
      for (let i=0;i<6;i++) line(-143,-104+i*39,143,87-i*34,faint,1.25);
      ellipse(0,5,75,67,accent,null,1.5);
    });
    local(465,165,.86,()=>{
      [[0,1],[1,2],[2,3],[1,4],[4,5],[1,6],[6,7],[7,8],[6,9],[9,10]].forEach(([i,j])=>{
        const [x,y]=joints[i], [u,v]=joints[j];
        line(x,y,lerp(x,u,p),lerp(y,v,p),accent,3);
      });
      joints.forEach(([x,y])=>ellipse(x,y,5,5,ink,light,1.6));
    });
    flow(302,342,181,p,.17);label("OBSERVATIONS",175,310);label("ESTIMATED POSE",468,310);
    return;
  }
  if(mode==="degrees") {
    frame(66,75,224,211);frame(351,75,224,211);
    for(let row=0;row<8;row++)for(let col=0;col<9;col++) ellipse(95+21*col,108+20*row,1.7,1.7,null,faint);
    shape("M95 230H126V132H204V225H261 M143 132V194H177V154H229V219",accent,null,2.3,true);
    [[126,132],[204,225],[177,154],[229,219]].forEach(([x,y])=>ellipse(x,y,5,5,ink,paper,1.8));
    shape("M374 186H418l12 -15l14 36l15 -84l12 63h22l14 14l13 -14h31",accent,null,2.6,true);
    flow(300,340,176,p,.13);
    label("ELECTRICAL ENGINEERING",176,310);label("BIOMEDICAL ENGINEERING",460,310);
    return;
  }
  pages(108,82,169,207);
  network(183,213,.72,p);
  flow(298,359,176,p,.12);
  frame(373,80,163,205);
  brainScan(453,187,.86,true);
  label("CAUSAL MODEL",191,312);label("IMAGE",453,312);
}
function teaching(a: Sheet, kind="layers") {
  const {shape,line,ellipse,label,local,flow,frame,field,brainScan,network,pages,accent,ink,faint,paper,light,p}=a;
  if(kind==="award"){
    pages(185,71,231,219);network(286,205,.88,p);
    ellipse(413,141,35,35,accent,paper,3);
    shape("M392 168l-14 49l31 -13l21 24l7 -53",accent,paper,2.4,true);
    shape("M402 141l9 9l16 -20",accent,null,3);
    label("ICLR PAPER",303,315);
    return;
  }
  if(kind==="layers"){
    const offset=lerp(0,109,p);
    local(309-offset,157,1,()=>brainScan(0,0,1.2,false));
    local(309+offset,184,1,()=>{
      shape("M-83 -74l174 16v150L-83 76Z",ink,paper,2.4,true);
      ellipse(25,7,27,35,accent,null,2.2);
      for(let i=0;i<6;i++) line(-68,-45+i*19,72,-31+i*19,faint,1);
    },-7);
    label("ANATOMY",201,307);label("VARIATION",421,307);
    return;
  }
  frame(61,85,518,185);
  field(87,123,115,111,205,.93);
  flow(214,268,174,p,.12);
  field(280,129,89,92,113,.62);
  flow(375,427,174,p,.38);
  brainScan(496,179,.69,false);
  label("NOISE",145,301);label("DENOISING",320,301);label("IMAGE",491,301);
}
function cad(a: Sheet, adjustable=false) {
  a.profileSolid(a.p,adjustable?13:0);
  a.line(95,277,542,277,a.faint,1);
  a.line(95,267,95,285,a.faint,1);
  a.line(542,267,542,285,a.faint,1);
  a.label(adjustable?"CONTROL POINTS → SURFACE":"SKETCH → SOLID",318,310,a.ink);
}

function kitesurfing(a: Sheet) {
  const { shape, line, local, ellipse, accent, ink, faint, light, p } = a;
  for (let row = 0; row < 4; row++) {
    const y = 248 + row * 22;
    shape("M38 " + y + "q28 -15 55 0t55 0t55 0t55 0t55 0t55 0t55 0t55 0t55 0t55 0", faint, null, 1.6);
  }
  shape("M70 132q40 -18 100 -14M115 167q40 -11 77 -8M131 102q35 -12 66 -8", faint, null, 1.5);
  const kiteX = lerp(486, 457, p);
  const kiteY = lerp(115, 77, p);
  local(kiteX, kiteY, 1.24, () => {
    shape("M-55 16q32 -54 85 -29q20 9 29 35q-31 -16 -58 -15q-27 1 -56 9Z", ink, light, 2.6, true);
    shape("M-55 16q36 -54 85 -29Q6 -15 -6 8Q-27 9 -55 16Z", accent, accent, 1.9, true);
    shape("M-12 -19Q-5 -3 -6 8 M26 -14Q17 -2 18 8", ink, null, 1.5);
  }, -10);
  const riderX = lerp(244, 302, p);
  const handX = riderX + 28;
  line(handX, 178, kiteX - 62, kiteY + 31, faint, 1.4);
  line(handX + 8, 178, kiteX + 66, kiteY + 19, faint, 1.4);
  local(riderX, 228, 1, () => {
    ellipse(-12, -61, 9, 9, ink, light, 2.6);
    shape("M-9 -52L-19 -21L3 -7l24 10M-19 -21l-21 25M-10 -45l21 9l18 -14M-7 -48l21 6l24 -8 M-51 9Q-10 23 37 2", ink, null, 4, true);
    shape("M-57 21q-23 5 -44 -11m37 19q-20 7 -36 3", accent, null, 2, true);
  });
}

function cycling(a: Sheet) {
  const { shape, line, ellipse, local, accent, ink, faint, light, p } = a;
  shape("M38 192l119 -103l53 36l72 -72l104 101l52 -42l164 77", faint, null, 1.5, true);
  shape("M38 219l109 -54l70 25l91 -43l91 49l62 -23l141 44", faint, null, 1.3, true);
  line(76, 293, 566, 293, faint, 1.9);
  const bikeX = lerp(282, 320, p);
  local(bikeX, 231, 1.15, () => {
    for (const x of [-95, 103]) {
      ellipse(x, 0, 49, 49, ink, light, 3.4);
      ellipse(x, 0, 43, 43, faint, null, 1.1);
      for (let i = 0; i < 9; i++) {
        const angle = (i / 9 + p) * Math.PI * 2;
        line(x, 0, x + 43 * Math.cos(angle), 43 * Math.sin(angle), faint, 1.05);
      }
      ellipse(x, 0, 4, 4, ink, light, 1.5);
    }
    shape("M-95 0L-42 -73L-10 0Z M-42 -73L72 -66L-10 0 M72 -66L103 0", accent, null, 5, true);
    shape("M-42 -73L-49 -91 M-63 -91h27 M72 -66l-11 -25h30q17 0 13 13", ink, null, 3.6, true);
    ellipse(-10,0,12,12,ink,light,2);
    const crank = p * Math.PI * 2;
    const pedalX = -10 + 19 * Math.cos(crank);
    const pedalY = 19 * Math.sin(crank);
    line(-10, 0, pedalX, pedalY, ink, 3);
    line(pedalX - 6, pedalY, pedalX + 6, pedalY, ink, 2);
  });
}

function snowboarding(a: Sheet) {
  const { shape, line, ellipse, local, accent, ink, faint, light, p } = a;
  shape("M35 171L135 61L207 141L280 46L397 170L476 82L609 180", faint, light, 1.6, true);
  shape("M104 96L135 61L160 91L143 85L129 98Z M250 82L280 46L316 85L284 75L271 91Z", faint, null, 1.3);
  shape("M34 211Q201 142 608 314", ink, null, 1.5, true);
  shape("M54 246Q243 179 594 337", faint, null, 1.1);

  const riderX = lerp(249, 370, p);
  const riderY = lerp(174, 222, p);
  local(riderX, riderY, 1.12, () => {
    ellipse(-5, -64, 12, 12, ink, light, 2.7);
    shape("M-17 -66Q-8 -83 8 -73L7 -64Z", ink, accent, 2, true);
    line(-10, -61, 7, -61, accent, 3);
    shape("M-8 -51L-28 -13L-3 0L13 -33Z", ink, light, 2.8, true);
    shape("M-15 -40L-42 -26L-65 -35 M3 -39L28 -23L47 -25", ink, null, 3.8, true);
    shape("M-21 -9L-33 14L-12 37 M-3 0L19 17L30 35", ink, null, 5, true);
    shape("M-50 36Q0 52 58 30Q65 34 54 43Q1 61 -50 48Q-63 43 -50 36Z", ink, accent, 2.8, true);
    line(-19, 40, -5, 40, ink, 3);
    line(24, 39, 37, 36, ink, 3);
    shape("M-56 39Q-82 39 -100 22 M-62 51Q-90 51 -108 40", accent, null, 2, true);
  }, -8);

  shape("M90 278Q153 245 " + (riderX - 55) + " " + (riderY + 53), accent, null, 1.8, true);
  shape("M100 290Q168 263 " + (riderX - 64) + " " + (riderY + 65), faint, null, 1.1);
}

const scenes={
  hike:["clay",orthotic], sinkove:["violet",synthesis], diffan:["sage",causalGraph], form:["blue",cad],
  radedit:["rose",edit], chex:["blue",ledger], diffscm:["gold",counterfactual],
  healthy:["violet",a=>edit(a,"brain")], benchmark:["sage",a=>modalStack(a,"benchmark")], monai:["gold",modalStack],
  grounding:["rose",a=>modalStack(a,"grounding")], uception:["blue",branches], temporal:["gold",chronograph],
  phd:["sage",education], microsoft:["rose",edit], canon:["gold",a=>branches(a,true)],
  samsung:["violet",a=>chronograph(a,"samsung")], ge:["blue",registration], icube:["rose",branches],
  strasbourg:["rose",a=>education(a,"pose")], dual:["gold",a=>education(a,"degrees")],
  causal:["sage",a=>causalGraph(a,"intervention")], generative:["violet",synthesis],
  imaging:["blue",a=>branches(a,true)], geometry:["clay",a=>cad(a,true)],
  dream:["violet",teaching], tutorial:["blue",a=>teaching(a,"diffusion")],
  award:["gold",a=>teaching(a,"award")], patent1:["sage",a=>education(a)], patent2:["rose",a=>branches(a,true)],
  kite:["blue",kitesurfing], cycling:["sage",cycling], snowboarding:["violet",snowboarding]
} satisfies Record<string, [Theme, (sheet: Sheet) => void]>;

export type SketchId = keyof typeof scenes;

export function renderSketch(
  canvas: HTMLCanvasElement,
  id: SketchId,
  progress = 1,
  thumbnail = false,
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const [theme, scene] = scenes[id];
  scene(prepareSketch(canvas, ctx, theme, progress, thumbnail));
}
