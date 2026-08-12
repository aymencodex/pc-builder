"use strict";
const FX={DZD:1,USD:.0075,EUR:.0069,GBP:.0058,SAR:.028,AED:.0276,MAD:.074,TND:.0023,EGP:.36,CAD:.0102,AUD:.0114,TRY:.27};
const SYMBOL={DZD:"DA",USD:"$",EUR:"€",GBP:"£",SAR:"ر.س",AED:"د.إ",MAD:"د.م",TND:"د.ت",EGP:"ج.م",CAD:"C$",AUD:"A$",TRY:"₺"};
const PRESETS=[
  [10000,"Ultra Budget","10K"],[25000,"اقتصادية","25K"],[50000,"اقتصادية","50K"],
  [75000,"Entry","75K"],[100000,"مناسبة","100K"],[150000,"متوازنة","150K"],
  [200000,"قوية","200K"],[300000,"أداء","300K"],[500000,"احترافية","500K"],[750000,"High End","750K"],[1000000,"Extreme","1M"]
];
const GAMES=[
  ["Fortnite",165],["Valorant",250],["CS2",180],["GTA V",150],["Minecraft",170],["Forza Horizon 5",115],
  ["Call of Duty",105],["Red Dead Redemption 2",92],["Cyberpunk 2077",82],["FC",170],["Warzone",95],["Apex Legends",140]
];
const state={budget:180000,currency:"DZD",res:1080,goal:"gaming",game:"Fortnite"};
const deviceData={monitor:[{name:"24-inch 1080p 144Hz",type:"Gaming",refresh:"144Hz",resolution:"1920×1080",score:82,price:24000},{name:"27-inch 1440p 165Hz",type:"Gaming",refresh:"165Hz",resolution:"2560×1440",score:91,price:52000},{name:"32-inch 4K 144Hz",type:"Gaming",refresh:"144Hz",resolution:"3840×2160",score:96,price:98000},{name:"27-inch 1440p 180Hz IPS",type:"Creator / Gaming",refresh:"180Hz",resolution:"2560×1440",score:94,price:69000}],phone:[{name:"OLED 120Hz",type:"Phone",refresh:"120Hz",resolution:"1.5K",score:86,price:65000},{name:"Flagship OLED 120Hz",type:"Phone",refresh:"120Hz",resolution:"QHD+",score:95,price:145000},{name:"Compact OLED 120Hz",type:"Phone",refresh:"120Hz",resolution:"FHD+",score:89,price:90000},{name:"Budget 120Hz",type:"Phone",refresh:"120Hz",resolution:"FHD+",score:72,price:32000}]};
function renderDevices(kind){const grid=$("deviceGrid");if(!grid)return;grid.replaceChildren();(deviceData[kind]||deviceData.monitor).forEach(x=>{const card=document.createElement("article");card.className="deviceCard";const type=document.createElement("span");type.className="deviceType";type.textContent=x.type;const title=document.createElement("b");title.textContent=x.name;const meta=document.createElement("div");meta.className="deviceMeta";[x.resolution,x.refresh].forEach(v=>{const z=document.createElement("span");z.textContent=v;meta.appendChild(z)});const bottom=document.createElement("div");bottom.className="deviceBottom";const sc=document.createElement("strong");sc.textContent=x.score+"/100";const pr=document.createElement("span");pr.textContent=money(x.price);bottom.append(sc,pr);card.append(type,title,meta,bottom);grid.appendChild(card)});document.querySelectorAll(".deviceTab").forEach(b=>b.classList.toggle("active",b.dataset.device===kind))}


const $=id=>document.getElementById(id);
const cleanNumber=n=>Number.isFinite(n)?n:0;
function money(dzd){
  const c=state.currency, value=cleanNumber(dzd)*FX[c];
  return new Intl.NumberFormat("en-US",{maximumFractionDigits:0}).format(Math.round(value))+" "+SYMBOL[c];
}
function tier(b){
  if(b<30000)return ["اقتصادية جدًا","Ultra Budget"];
  if(b<75000)return ["اقتصادية","Entry"];
  if(b<150000)return ["متوازنة","Balanced"];
  if(b<300000)return ["أداء","Performance"];
  if(b<500000)return ["احترافية","Enthusiast"];
  return ["Extreme","Extreme"];
}
function buildFor(b){
  if(b<30000)return {cpu:"Core i3-6100",gpu:"GT 1030",board:"H110",ram:"8GB DDR4",ssd:"240GB SSD",psu:"400W",cool:"Stock",score:58,power:180};
  if(b<60000)return {cpu:"Core i3-12100F",gpu:"GTX 1650",board:"H610",ram:"16GB DDR4",ssd:"500GB SSD",psu:"500W",cool:"Stock",score:68,power:260};
  if(b<100000)return {cpu:"Ryzen 5 5500",gpu:"RX 6600",board:"B550",ram:"16GB DDR4",ssd:"1TB NVMe",psu:"550W",cool:"Air",score:76,power:310};
  if(b<160000)return {cpu:"Ryzen 5 5600",gpu:"RTX 4060",board:"B550",ram:"32GB DDR4",ssd:"1TB NVMe",psu:"650W",cool:"Tower Air",score:84,power:360};
  if(b<240000)return {cpu:"Ryzen 7 7700",gpu:"RTX 4070",board:"B650",ram:"32GB DDR5",ssd:"2TB NVMe",psu:"750W",cool:"Premium Air",score:90,power:460};
  if(b<350000)return {cpu:"Ryzen 7 7800X3D",gpu:"RTX 5070",board:"B650",ram:"32GB DDR5",ssd:"2TB NVMe",psu:"850W",cool:"AIO",score:94,power:540};
  if(b<500000)return {cpu:"Ryzen 9 9950X3D",gpu:"RTX 5080",board:"X870",ram:"64GB DDR5",ssd:"4TB NVMe",psu:"1000W",cool:"360mm AIO",score:97,power:690};
  if(b<750000)return {cpu:"Ryzen 9 9950X3D",gpu:"RTX 5090",board:"X870E",ram:"64GB DDR5",ssd:"4TB NVMe",psu:"1200W",cool:"360mm AIO",score:99,power:780};
  return {cpu:"Ryzen 9 9950X3D",gpu:"RTX 5090",board:"X870E",ram:"128GB DDR5",ssd:"8TB NVMe",psu:"1600W",cool:"420mm AIO",score:100,power:920};
}
function fpsFactor(res){return res===1080?1:res===1440?.72:.49}
function fpsFor(game,b,res){
  const base=GAMES.find(g=>g[0]===game)?.[1]||120;
  const scale=Math.min(1.28,Math.max(.34,Math.log10(b/10000+1)));
  return Math.max(24,Math.round(base*scale*fpsFactor(res)));
}
function setBudget(v){
  state.budget=Math.min(1000000,Math.max(10000,Math.round(v/5000)*5000));
  $("budget").value=state.budget; update();
}
function renderPresets(){
  const box=$("presetGrid"); box.replaceChildren();
  PRESETS.forEach(([v,label,short])=>{
    const b=document.createElement("button"); b.className="preset"; b.type="button"; b.dataset.value=v;
    const strong=document.createElement("b"); strong.textContent=short;
    const span=document.createElement("span"); span.textContent=label;
    b.append(strong,span); b.addEventListener("click",()=>setBudget(v)); box.appendChild(b);
  });
}
function renderGames(filter=""){
  const sel=$("gameSelect"); const current=state.game;
  sel.replaceChildren();
  GAMES.filter(g=>g[0].toLowerCase().includes(filter.toLowerCase())).forEach(g=>{
    const o=document.createElement("option"); o.value=g[0]; o.textContent=g[0]; sel.appendChild(o);
  });
  if([...sel.options].some(o=>o.value===current)) sel.value=current; else if(sel.options[0]){sel.selectedIndex=0;state.game=sel.value}
}
function update(){
  const b=state.budget, build=buildFor(b), [label,t]=tier(b), total=b;
  const score=Math.min(100,build.score + (state.res===2160?-3:0));
  $("budgetText").textContent=money(total);
  $("budgetTier").textContent=t;
  $("budgetHint").textContent=label;
  $("scoreHero").innerHTML=score+' <small>/100</small>';
  $("scoreBar").style.width=score+"%";
  $("miniRes").textContent=state.res===2160?"4K":state.res+"p";
  $("miniGoal").textContent=state.goal==="gaming"?"Gaming":state.goal==="stream"?"Gaming + بث":state.goal==="work"?"برمجة وتصميم":state.goal==="editing"?"مونتاج":"AI";
  $("scoreText").textContent=score>=94?"توازن ممتاز جدًا":score>=85?"تجميعة متوازنة وقوية":"تجميعة اقتصادية مع تنازلات واضحة";
  $("summary").textContent=`الاختيار الحالي موجه لـ ${state.goal==="gaming"?"Gaming":state.goal} على ${state.res===2160?"4K":state.res+"p"} ضمن ميزانية ${money(total)}.`;
  $("bestPoint").textContent=state.res===2160?"البطاقه الرسومية":"التوازن بين CPU وGPU";
  $("bottleneck").textContent=state.res===2160?"GPU":"GPU";
  $("power").textContent=build.power+"W تقريبًا";
  $("value").textContent=score>=90?"مرتفع":"جيد";
  $("compatStatus").textContent=state.budget<30000?"يحتاج مراجعة":"متوافق";
  const chips=$("chips"); chips.replaceChildren();
  [build.cpu,build.gpu,build.ram,build.ssd].forEach(x=>{const c=document.createElement("span");c.className="chip";c.textContent=x;chips.appendChild(c)});
  const parts=$("parts"); parts.replaceChildren();
  const rows=[["المعالج",build.cpu,.22],["كرت الشاشة",build.gpu,.40],["اللوحة",build.board,.11],["الرام",build.ram,.08],["التخزين",build.ssd,.06],["مزود الطاقة",build.psu,.06],["التبريد",build.cool,.03],["الكيس","ATX / مناسب للفئة",.04]];
  rows.forEach(([name,val,ratio])=>{
    const row=document.createElement("div");row.className="part";
    const left=document.createElement("div");const bEl=document.createElement("b");bEl.textContent=name;const sm=document.createElement("small");sm.textContent=val;left.append(bEl,sm);
    const pr=document.createElement("div");pr.className="price";pr.textContent=money(total*ratio);
    row.append(left,pr);parts.appendChild(row);
  });
  const gg=$("gameGrid"); gg.replaceChildren();
  const subset=[state.game,"Valorant","GTA V","Minecraft"].filter((v,i,a)=>a.indexOf(v)===i).slice(0,4);
  subset.forEach(name=>{
    const card=document.createElement("div");card.className="game";
    const s=document.createElement("span");s.textContent=name;
    const bEl=document.createElement("b");bEl.textContent=fpsFor(name,b,state.res)+" FPS";
    const sm=document.createElement("small");sm.textContent=state.res===1080?"High / Ultra تقديري":"تقديري";
    card.append(s,bEl,sm);gg.appendChild(card);
  });
  document.querySelectorAll(".preset").forEach(el=>el.classList.toggle("active",Number(el.dataset.value)===b));
  document.querySelectorAll(".res-btn").forEach(el=>el.classList.toggle("active",Number(el.dataset.res)===state.res));
}
function randomBuild(){
  const vals=PRESETS.map(x=>x[0]); setBudget(vals[Math.floor(Math.random()*vals.length)]);
  state.res=[1080,1440,2160][Math.floor(Math.random()*3)];
  $("gameSelect").selectedIndex=0; state.game=$("gameSelect").value; update();
}
$("budget").addEventListener("input",e=>{state.budget=Number(e.target.value);update()});
$("currency").addEventListener("change",e=>{state.currency=e.target.value;update()});
$("goal").addEventListener("change",e=>{state.goal=e.target.value;update()});
$("gameSelect").addEventListener("change",e=>{state.game=e.target.value;update()});
$("gameSearch").addEventListener("input",e=>renderGames(e.target.value));
document.querySelectorAll(".res-btn").forEach(b=>b.addEventListener("click",()=>{state.res=Number(b.dataset.res);update()}));
document.querySelectorAll("[data-scroll]").forEach(b=>b.addEventListener("click",()=>document.querySelector(b.dataset.scroll)?.scrollIntoView({behavior:"smooth",block:"start"})));
document.querySelectorAll("[data-action='random']").forEach(b=>b.addEventListener("click",randomBuild));

renderPresets(); renderGames(); $("goal").value=state.goal; $("currency").value=state.currency; update();
// Security notes: no user-provided strings are inserted into HTML; all interactive values are constrained.
renderDevices("monitor");
