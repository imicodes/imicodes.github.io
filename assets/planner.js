
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
function quantities(){
 const map=new Map();
 for(let i=0;i<7;i++)for(const meal of selectedMenu((w-1)%4,i))for(const part of meal.split(', ')){
  const match=part.match(/^(\d+)\s*(g|ml|slice)?\s+(.+)$/);
  const name=(match?match[3]:part).toLowerCase().replace(/^small /,'');
  const unit=match?(match[2]||'count'):'unspecified';
  const key=name+'|'+unit;const entry=map.get(key)||{name,unit,n:0};entry.n+=match?Number(match[1]):1;map.set(key,entry);
 }
 const root=$('quantities');root.replaceChildren();
 const note=document.createElement('p');note.textContent='Totals use listed portions and substitutions. Unspecified quantities are shown as occasions; similar ingredients may appear separately.';root.append(note);
 const list=document.createElement('ul');[...map.values()].sort((a,b)=>a.name.localeCompare(b.name)).forEach(e=>{const li=document.createElement('li');li.textContent=e.name+' — '+e.n+' '+(e.unit==='unspecified'?'meal occasions':e.unit==='count'?'items':e.unit);list.append(li)});root.append(list);
 const copy=document.createElement('button');copy.textContent='Copy quantities';copy.onclick=async()=>{try{await navigator.clipboard.writeText(list.innerText);copy.textContent='Copied'}catch{alert('Clipboard unavailable; select the list to copy.')}};root.append(copy);
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
