
/* Additional planner tools; all personal records remain in localStorage. */
const baseMenu=menu;
const dayKey=()=>w+'-'+d;
function selectedMenu(r,i,week=w){
 return baseMenu(r,i).map((m,j)=>state.swaps?.[week+'-'+i]?.[j]||m);
}
// Existing menu is a const. Keep the original renderer intact and use the
// selected meals in the preparation panel and editable nutrition overrides.
function instructions(meal){
 const s=meal.toLowerCase();
 if(/oats/.test(s))return /milk/.test(s)?'Simmer oats with milk until soft; add fruit before serving.':'Mix oats with yoghurt and fruit; chill if desired.';
 if(/eggs/.test(s))return 'Cook eggs until set; toast bread if included. Cook any bacon thoroughly and serve with washed vegetables or fruit.';
 if(/tuna/.test(s))return 'Drain tuna, wash salad, and assemble with the listed wraps or cooked pasta. Measure dressing.';
 if(/chicken|turkey|pork|beef|salmon|cod|haddock/.test(s))return 'Prepare the listed protein and vegetables separately. Cook meat or fish thoroughly (for poultry and mince, aim for 75°C at the centre); boil potatoes or prepare rice/pasta as needed. Measure oil and sauce. Season to taste.';
 return 'Weigh the listed ingredients, wash fruit and vegetables, and serve.';
}
function prep(){
 const root=$('prep');root.replaceChildren();
 const key=dayKey(), r=(w-1)%4;
 selectedMenu(r,d).forEach((m,i)=>{
  const row=document.createElement('div');row.className='meal';
  const inner=document.createElement('div');inner.style.width='100%';row.append(inner);
  const title=document.createElement('strong');title.textContent=['Breakfast','Lunch','Snack','Dinner'][i];inner.append(title);
  const p=document.createElement('p');p.textContent=m;inner.append(p);
  const tip=document.createElement('p');tip.textContent=instructions(m);inner.append(tip);
  const sel=document.createElement('select');sel.setAttribute('aria-label','Substitute '+title.textContent);
  const choices=[...new Set([baseMenu(r,d)[i],m,...Array.from({length:4},(_,rr)=>Array.from({length:7},(_,dd)=>baseMenu(rr,dd)[i])).flat()])];
  choices.forEach(v=>{const o=document.createElement('option');o.value=v;o.textContent=v;sel.append(o)});sel.value=m;
  sel.onchange=()=>{if(state.checks[key+'-'+i]&&!confirm('This meal is marked eaten. Change it and its nutrition estimate?')){sel.value=m;return}
   state.swaps??={};state.swaps[key]??={};state.swaps[key][i]=sel.value;
   state.nutrition??={};state.nutrition[key]??={};state.nutrition[key][i]=estimateMeal(sel.value);save();render()};
  inner.append(sel);root.append(row);
 });
 // Replace the visible meal descriptions without changing checkbox handlers.
 const labels=$('meals').querySelectorAll('label span');
 selectedMenu(r,d).forEach((m,i)=>{if(labels[i]){const strong=labels[i].querySelector('strong');labels[i].replaceChildren(strong,document.createElement('br'),document.createTextNode(m))}});
}
let shoppingFilter='all';
function quantities(){
 const map=new Map(),legacy=[...new Set(Array.from({length:7},(_,i)=>baseMenu((w-1)%4,i)).flat(2).flatMap(s=>s.split(', ')).map(s=>s.replace(/^\d+\s*(g|ml)?\s*/,'').replace(/^small /,'').trim()))].sort();
 const category=n=>/chicken|turkey|beef|pork|salmon|cod|haddock|tuna|bacon|prawn/.test(n)?'Meat & fish':/yoghurt|yogurt|milk|cheese|egg|cottage/.test(n)?'Dairy & eggs':/apple|banana|berries|berry|broccoli|tomato|salad|vegetable|potato|carrot|spinach|pepper|bean|orange|pear|cucumber|avocado|mushroom|courgette|fruit/.test(n)?'Fruit & vegetables':/bread|toast|wrap|rice|pasta|oat|cereal/.test(n)?'Bakery & grains':'Cupboard & other';
 for(let i=0;i<7;i++)for(const meal of selectedMenu((w-1)%4,i))for(const part of meal.split(', ')){
 const m=part.trim().match(/^(\d+(?:\.\d+)?)\s*(g|ml|slices?)?\s+(.+)$/i);
 const name=(m?m[3]:part).toLowerCase().replace(/^small /,'').trim(),unit=m?(m[2]||'items').replace(/^slice$/,'slices'):'servings';
 const key=name+'|'+unit,entry=map.get(key)||{name,unit,n:0,key};entry.n+=m?Number(m[1]):1;map.set(key,entry);
 }
 state.shoppingV2??={};const checks=state.shoppingV2[w]??={};
 const entries=[...map.values()].sort((a,b)=>a.name.localeCompare(b.name));
 for(const e of entries){if(!(e.key in checks)){const idx=legacy.findIndex(x=>x.toLowerCase()===e.name);if(idx>=0&&state.shop[w+'-'+idx])checks[e.key]=true}}
 const root=$('shop');root.replaceChildren();$('quantities').hidden=true;
 const heading=document.createElement('div');heading.className='shopping-summary';root.append(heading);
 const done=entries.filter(e=>checks[e.key]).length;
 const title=document.createElement('strong');title.textContent=done+' of '+entries.length+' items collected';heading.append(title);
 const progress=document.createElement('progress');progress.max=entries.length||1;progress.value=done;heading.append(progress);
 const tools=document.createElement('div');tools.className='shopping-tools';root.append(tools);
 function button(label,fn,active=false){const b=document.createElement('button');b.textContent=label;b.classList.toggle('active',active);b.onclick=fn;tools.append(b)}
 for(const [key,label] of [['all','All'],['remaining','To buy'],['done','Collected']])button(label,()=>{shoppingFilter=key;quantities()},shoppingFilter===key);
 button('Copy list',async()=>{try{await navigator.clipboard.writeText(entries.filter(e=>!checks[e.key]).map(e=>e.name+' — '+e.n+' '+e.unit).join('\n'));status.textContent='Remaining items copied.'}catch{status.textContent='Clipboard unavailable.'}});
 button('Reset',()=>{if(confirm('Clear shopping checks for this week?')){for(const e of entries)checks[e.key]=false;save();quantities()}});
 const status=document.createElement('small');status.setAttribute('role','status');root.append(status);
 const grid=document.createElement('div');grid.className='shopping-grid';root.append(grid);
 for(const group of ['Fruit & vegetables','Meat & fish','Dairy & eggs','Bakery & grains','Cupboard & other']){
 const items=entries.filter(e=>category(e.name)===group&&(shoppingFilter==='all'||(shoppingFilter==='done'?checks[e.key]:!checks[e.key])));if(!items.length)continue;
 const section=document.createElement('section');section.className='shopping-category';const h=document.createElement('h3');h.textContent=group;section.append(h);
 for(const e of items){const l=document.createElement('label');l.className='shopping-item'+(checks[e.key]?' collected':'');const c=document.createElement('input');c.type='checkbox';c.checked=!!checks[e.key];c.onchange=()=>{checks[e.key]=c.checked;save();quantities()};const name=document.createElement('span');name.textContent=e.name;const amount=document.createElement('strong');amount.textContent=e.n+' '+e.unit;l.append(c,name,amount);section.append(l)}grid.append(section)
 }
 if(!grid.children.length){const p=document.createElement('p');p.textContent='No items in this view.';grid.append(p)}
 const note=document.createElement('small');note.textContent='Quantities follow the selected meals, including substitutions. Servings indicate occasions where no amount is specified. Rice and pasta weights are cooked; similar ingredients may be listed separately.';root.append(note);
}
function activity(){
 const root=$('activity');root.replaceChildren();const key=dayKey();
 const values=state.activity?.[key]||{};
 const fields=[['weight','Morning weight (kg)',30,300,0.1],['steps','Steps',0,100000,1],['walk','Walking minutes',0,1440,1],['exercise','Other exercise minutes',0,1440,1]];
 const row=document.createElement('div');row.className='activity-grid';
 fields.forEach(([id,label,min,max,step])=>{const l=document.createElement('label');l.textContent=label;const input=document.createElement('input');input.type='number';input.min=min;input.max=max;input.step=step;input.value=values[id]??'';input.onchange=()=>{if(!input.checkValidity()){input.reportValidity();return}state.activity??={};state.activity[key]??={};if(input.value==='')delete state.activity[key][id];else state.activity[key][id]=Number(input.value);save();activity()};l.append(input);row.append(l)});root.append(row);
 const entries=Object.entries(state.activity||{}).filter(([k,v])=>k.startsWith(w+'-')&&Number.isFinite(v.weight));
 const avg=entries.length?entries.reduce((a,[k,v])=>a+v.weight,0)/entries.length:null;
 const p=document.createElement('p');p.textContent=avg===null?'No daily weights recorded this week.':'Weekly average: '+avg.toFixed(1)+' kg ('+entries.length+' days)';root.append(p);
 if(avg!==null){const b=document.createElement('button');b.textContent='Use average in weekly tracker';b.onclick=()=>{state.weights[w]=avg.toFixed(1);save();table();metrics()};root.append(b)}
}
$('reset-nutrition').onclick=()=>{if(!confirm('Reset nutrition values and extra food for this day?'))return;const key=dayKey();state.nutrition??={};delete state.nutrition[key];selectedMenu((w-1)%4,d).forEach((m,i)=>{if(m!==baseMenu((w-1)%4,d)[i]){state.nutrition[key]??={};state.nutrition[key][i]=estimateMeal(m)}});save();render()};
const previousRender=render;render=function(){previousRender();prep();quantities();activity()};today();
