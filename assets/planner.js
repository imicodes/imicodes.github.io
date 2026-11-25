
/* Additional planner tools; all personal records remain in localStorage. */
const originalMenu=menu;
const planNames={original:'High-protein balanced',budget:'Budget-friendly',vegetarian:'Vegetarian',mediterranean:'Mediterranean-inspired'};
planNames.glucose='Blood sugar friendly (type 2 diabetes)';
const planMenus={glucose:[["2 eggs, 60 g wholemeal bread, 100 g tomatoes","160 g chicken breast, 120 g brown rice, 200 g broccoli, 10 g olive oil","200 g Greek yoghurt, 100 g berries, 15 g almonds","180 g salmon, 200 g potatoes, 200 g green beans"],["40 g oats, 200 ml milk, 150 g Greek yoghurt, 100 g berries","150 g tuna, 150 g chickpeas, 200 g salad, 10 g olive oil","200 g cottage cheese, 1 apple","180 g turkey mince, 120 g wholewheat pasta, 150 g tomato sauce, 150 g vegetables"],["3 eggs, 60 g wholemeal bread, 100 g mushrooms","180 g chicken breast, 200 g potatoes, 200 g salad","200 g Greek yoghurt, 20 g almonds","180 g cod, 120 g brown rice, 200 g broccoli, 10 g olive oil"],["250 g Greek yoghurt, 40 g oats, 100 g berries","150 g turkey breast, 1 wholemeal wrap, 200 g salad","2 eggs, 1 pear","180 g lean beef mince, 150 g kidney beans, 150 g peppers, 100 g tomato sauce"],["2 eggs, 60 g wholemeal bread, 100 g tomatoes","150 g salmon, 120 g brown rice, 200 g vegetables","200 g cottage cheese, 100 g berries","180 g chicken breast, 200 g potatoes, 200 g green beans, 10 g olive oil"],["40 g oats, 200 ml milk, 150 g Greek yoghurt, 15 g almonds","150 g tuna, 1 wholemeal wrap, 200 g salad","200 g Greek yoghurt, 1 apple","180 g pork tenderloin, 120 g brown rice, 200 g broccoli"],["3 eggs, 60 g wholemeal bread, 100 g mushrooms","180 g chicken breast, 150 g chickpeas, 200 g salad, 10 g olive oil","200 g cottage cheese, 1 orange","180 g salmon, 200 g potatoes, 200 g vegetables"]],
 budget:[
 ['60 g oats, 200 ml milk, 1 banana','150 g chicken breast, 250 g potatoes, 150 g carrots','200 g Greek yoghurt, 1 apple','150 g lean beef mince, 180 g pasta, 150 g tomato sauce'],
 ['2 eggs, 80 g wholemeal bread, 1 apple','120 g tuna, 180 g rice, 150 g peas','200 g cottage cheese, 1 pear','180 g chicken breast, 250 g potatoes, 200 g vegetables'],
 ['60 g oats, 200 ml milk, 100 g berries','2 eggs, 2 wholemeal wraps, 150 g salad','200 g Greek yoghurt, 1 banana','180 g turkey mince, 180 g rice, 200 g vegetables']],
 vegetarian:[
 ['60 g oats, 200 ml milk, 150 g Greek yoghurt, 100 g berries','150 g tofu, 180 g rice, 200 g broccoli, 10 g olive oil','200 g cottage cheese, 1 apple','200 g chickpeas, 250 g potatoes, 150 g vegetables, 10 g olive oil'],
 ['3 eggs, 80 g wholemeal bread, 100 g tomatoes','200 g kidney beans, 2 wholemeal wraps, 150 g salad','200 g Greek yoghurt, 20 g almonds','180 g tofu, 180 g pasta, 150 g tomato sauce'],
 ['250 g Greek yoghurt, 60 g oats, 1 banana','200 g chickpeas, 180 g rice, 150 g vegetables','2 eggs, 1 orange','200 g tofu, 250 g potatoes, 200 g broccoli, 10 g olive oil']],
 mediterranean:[
 ['250 g Greek yoghurt, 50 g oats, 100 g berries, 20 g almonds','150 g chicken breast, 180 g rice, 200 g salad, 10 g olive oil','1 apple, 200 g cottage cheese','180 g salmon, 250 g potatoes, 200 g broccoli, 10 g olive oil'],
 ['2 eggs, 80 g wholemeal bread, 100 g tomatoes','150 g tuna, 200 g chickpeas, 150 g salad, 10 g olive oil','200 g Greek yoghurt, 1 pear','180 g chicken breast, 180 g pasta, 150 g tomato sauce'],
 ['60 g oats, 200 ml milk, 1 banana','180 g chicken breast, 2 wholemeal wraps, 150 g salad','200 g Greek yoghurt, 20 g almonds','180 g cod, 250 g potatoes, 200 g vegetables, 10 g olive oil']]
};
planMenus.budget.push(...[["2 eggs, 80 g wholemeal bread, 100 g tomatoes","150 g turkey mince, 180 g rice, 150 g carrots","200 g cottage cheese, 1 apple","150 g tuna, 250 g potatoes, 150 g peas"],["60 g oats, 200 ml milk, 1 apple","150 g chicken breast, 180 g pasta, 150 g tomato sauce","200 g Greek yoghurt, 1 banana","2 eggs, 250 g potatoes, 200 g vegetables"],["2 eggs, 80 g wholemeal bread, 1 banana","150 g chickpeas, 180 g rice, 150 g carrots","200 g cottage cheese, 1 pear","180 g chicken breast, 250 g potatoes, 150 g peas"],["60 g oats, 200 ml milk, 100 g berries","120 g tuna, 2 wholemeal wraps, 150 g salad","200 g Greek yoghurt, 1 apple","150 g lean beef mince, 250 g potatoes, 150 g carrots"]]);
planMenus.vegetarian.push(...[["2 eggs, 80 g wholemeal bread, 100 g tomatoes","200 g kidney beans, 180 g rice, 150 g peppers","200 g Greek yoghurt, 1 pear","180 g tofu, 250 g potatoes, 200 g broccoli, 10 g olive oil"],["60 g oats, 200 ml milk, 1 banana","200 g chickpeas, 2 wholemeal wraps, 150 g salad","200 g cottage cheese, 20 g almonds","3 eggs, 250 g potatoes, 200 g vegetables, 10 g olive oil"],["250 g Greek yoghurt, 60 g oats, 100 g berries","180 g tofu, 180 g rice, 200 g vegetables","2 eggs, 1 apple","200 g kidney beans, 180 g pasta, 150 g tomato sauce"],["3 eggs, 80 g wholemeal bread, 100 g mushrooms","200 g chickpeas, 250 g potatoes, 150 g salad, 10 g olive oil","200 g Greek yoghurt, 1 banana","200 g tofu, 180 g rice, 200 g broccoli"]]);
planMenus.mediterranean.push(...[["2 eggs, 80 g wholemeal bread, 100 g tomatoes","150 g chickpeas, 150 g tuna, 150 g salad, 10 g olive oil","200 g Greek yoghurt, 1 apple","180 g salmon, 180 g rice, 200 g broccoli"],["250 g Greek yoghurt, 50 g oats, 1 pear","150 g chicken breast, 250 g potatoes, 150 g salad, 10 g olive oil","1 orange, 20 g almonds","180 g cod, 180 g pasta, 150 g tomato sauce"],["60 g oats, 200 ml milk, 100 g berries","200 g chickpeas, 2 wholemeal wraps, 150 g salad","200 g cottage cheese, 1 apple","180 g chicken breast, 250 g potatoes, 200 g vegetables, 10 g olive oil"],["3 eggs, 80 g wholemeal bread, 100 g tomatoes","150 g tuna, 180 g pasta, 150 g salad, 10 g olive oil","200 g Greek yoghurt, 20 g almonds","180 g salmon, 250 g potatoes, 200 g green beans"]]);
function planFor(week,day){return state.planDays?.[week+'-'+day]||state.profile?.mealPlan||'original'}
function baseMenu(r,i,week=w){const p=planMenus[planFor(week,i)];return p?p[(r*7+i)%p.length].slice():originalMenu(r,i)}

const dayKey=()=>w+'-'+d;
function selectedMenu(r,i,week=w){
 return baseMenu(r,i,week).map((m,j)=>state.swaps?.[week+'-'+i]?.[j]||m);
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
  const choices=[...new Set([baseMenu(r,d)[i],m,...(state.customMeals||[]).filter(x=>x.slot===i).map(x=>x.ingredients),...Array.from({length:4},(_,rr)=>Array.from({length:7},(_,dd)=>baseMenu(rr,dd)[i])).flat()])];
  choices.forEach(v=>{const o=document.createElement('option');o.value=v;o.textContent=v;sel.append(o)});sel.value=m;
  sel.onchange=()=>{if(state.checks[key+'-'+i]&&!confirm('This meal is marked eaten. Change it and its nutrition estimate?')){sel.value=m;return}
   state.swaps??={};state.swaps[key]??={};state.swaps[key][i]=sel.value;
   state.nutrition??={};state.nutrition[key]??={};state.nutrition[key][i]=customEstimate(sel.value,i);save();render()};
  inner.append(sel);root.append(row);
 });
 customMealEditor(root);
 // Replace the visible meal descriptions without changing checkbox handlers.
 const labels=$('meals').querySelectorAll('label span');
 selectedMenu(r,d).forEach((m,i)=>{if(labels[i]){const strong=labels[i].querySelector('strong');labels[i].replaceChildren(strong,document.createElement('br'),document.createTextNode(m))}});
}
let shoppingFilter='all';
function quantities(){
 const map=new Map(),legacy=[...new Set(Array.from({length:7},(_,i)=>originalMenu((w-1)%4,i)).flat(2).flatMap(s=>s.split(', ')).map(s=>s.replace(/^\d+\s*(g|ml)?\s*/,'').replace(/^small /,'').trim()))].sort();
 const category=n=>/chicken|turkey|beef|pork|salmon|cod|haddock|tuna|bacon|prawn/.test(n)?'Meat & fish':/yoghurt|yogurt|milk|cheese|egg|cottage/.test(n)?'Dairy & eggs':/apple|banana|berries|berry|broccoli|tomato|salad|vegetable|potato|carrot|spinach|pepper|bean|orange|pear|cucumber|avocado|mushroom|courgette|fruit/.test(n)?'Fruit & vegetables':/bread|toast|wrap|rice|pasta|oat|cereal/.test(n)?'Bakery & grains':'Cupboard & other';
 for(let i=0;i<7;i++)for(const meal of selectedMenu((w-1)%4,i))for(const part of meal.split(/,\s*/)){
 const m=part.trim().match(/^(\d+(?:\.\d+)?)\s*(g|ml|slices?)?\s+(.+)$/i);
 const name=(m?m[3]:part).toLowerCase().replace(/^small /,'').trim().replace(/^semi-skimmed milk$/,'milk').replace(/^plain greek yoghurt$/,'greek yoghurt').replace(/^eggs?$/,'eggs'),unit=m?(m[2]||'items').replace(/^slice$/,'slices'):'servings';
 const key=name+'|'+unit,entry=map.get(key)||{name,unit,n:0,key};entry.n+=m?Number(m[1]):1;map.set(key,entry);
 }
 state.shoppingV2??={};const signature=JSON.stringify(Array.from({length:7},(_,i)=>selectedMenu((w-1)%4,i)));state.shoppingSignatures??={};if(state.shoppingSignatures[w]!==signature){state.shoppingV2[w]={};state.shoppingSignatures[w]=signature}const checks=state.shoppingV2[w]??={};
 const entries=[...map.values()].sort((a,b)=>a.name.localeCompare(b.name));
 
 const root=$('shop');root.replaceChildren();$('quantities').hidden=true;
 const heading=document.createElement('div');heading.className='shopping-summary';root.append(heading);
 const done=entries.filter(e=>checks[e.key]).length;
 const title=document.createElement('strong');title.textContent='Week '+w+' · '+done+' of '+entries.length+' items collected';heading.append(title);
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
$('reset-nutrition').onclick=()=>{if(!confirm('Reset nutrition values and extra food for this day?'))return;const key=dayKey();state.nutrition??={};delete state.nutrition[key];selectedMenu((w-1)%4,d).forEach((m,i)=>{if(m!==baseMenu((w-1)%4,d)[i]){state.nutrition[key]??={};state.nutrition[key][i]=customEstimate(m,i)}});save();render()};
const previousRender=render;render=function(){previousRender();prep();quantities();activity();planSettings();exerciseSchedule()};today();

function customEstimate(meal,slot){return (state.customMeals||[]).find(x=>x.slot===slot&&x.ingredients===meal)?.macros?.slice()||estimateMeal(meal)}
function customMealEditor(root){
 const panel=document.createElement('section');panel.className='card';root.append(panel);
 const h=document.createElement('h3');h.textContent='Custom meals';panel.append(h);
 const form=document.createElement('form');panel.append(form);
 function field(label,type='text'){const l=document.createElement('label');l.textContent=label;const e=document.createElement('input');e.type=type;l.append(e);form.append(l);return e}
 const name=field('Meal name');name.required=true;name.maxLength=80;
 const slot=document.createElement('select');['Breakfast','Lunch','Snack','Dinner'].forEach((v,i)=>{const o=document.createElement('option');o.value=i;o.textContent=v;slot.append(o)});form.append(slot);
 const l=document.createElement('label');l.textContent='Ingredients (comma separated, e.g. 150 g chicken, 100 g rice)';const ingredients=document.createElement('textarea');ingredients.required=true;ingredients.maxLength=800;l.append(ingredients);form.append(l);
 const macros=['Calories','Protein (g)','Carbs (g)','Fat (g)'].map((v,i)=>{const e=field(v+' (optional)','number');e.min=0;e.max=i===0?10000:1000;e.step=0.1;return e});
 const submit=document.createElement('button');submit.type='submit';submit.textContent='Save custom meal';form.append(submit);
 form.onsubmit=e=>{e.preventDefault();const n=name.value.trim(),m=ingredients.value.trim(),i=Number(slot.value);if(!n||!m)return;state.customMeals??=[];if(state.customMeals.some(x=>x.slot===i&&x.ingredients===m)){alert('This meal already exists for this meal type.');return}const estimated=estimateMeal(m);state.customMeals.push({id:crypto.randomUUID(),name:n,slot:i,ingredients:m,macros:macros.map((x,j)=>x.value===''?estimated[j]:Number(x.value))});save();render()};
 for(const meal of state.customMeals||[]){const row=document.createElement('div');row.className='meal';const label=document.createElement('span');label.textContent=meal.name+' — '+meal.ingredients;row.append(label);const use=document.createElement('button');use.textContent='Use today';use.onclick=()=>{const k=dayKey(),i=meal.slot;if(state.checks[k+'-'+i]&&!confirm('Replace this eaten meal?'))return;state.swaps??={};state.swaps[k]??={};state.swaps[k][i]=meal.ingredients;state.nutrition??={};state.nutrition[k]??={};state.nutrition[k][i]=meal.macros.slice();save();render()};row.append(use);const del=document.createElement('button');del.textContent='Delete';del.onclick=()=>{if(confirm('Remove from your meal library? Previously planned meals remain.')){state.customMeals=state.customMeals.filter(x=>x.id!==meal.id);save();render()}};row.append(del);panel.append(row)}
}

function planSettings(){
 let root=$('plan-settings');if(!root){root=document.createElement('section');root.id='plan-settings';root.className='card';root.dataset.tab='settings';root.hidden=true;$('personal').parentElement.after(root)}
 root.replaceChildren();const h=document.createElement('h2');h.textContent='Choose your plans';root.append(h);
 const note=document.createElement('p');note.textContent='Apply from the selected week onwards. Logged meals and custom substitutions stay unchanged. Portions are examples, not personalised calorie prescriptions.';root.append(note);
 const form=document.createElement('div');form.className='activity-grid';root.append(form);
 function choice(label,options,value){const l=document.createElement('label');l.textContent=label;const s=document.createElement('select');s.style.width='100%';for(const [k,v] of Object.entries(options)){const o=document.createElement('option');o.value=k;o.textContent=v;s.append(o)}s.value=value;l.append(s);form.append(l);return s}
 const food=choice('Meal plan',planNames,state.profile?.mealPlan||'original');
 const exercise=choice('Exercise plan',{none:'No scheduled exercise',walking:'Beginner walking',treadmill:'Treadmill walking',strength:'Walking and home strength',structured:'Daily cardio, strength and mobility'},state.profile?.exercisePlan||'none');
 const b=document.createElement('button');b.textContent='Apply plans';b.onclick=()=>{if(!confirm('Apply plans from '+dateAt((w-1)*7).toLocaleDateString('en-GB')+' onwards? Logged meals and substitutions are retained.'))return;state.profile??={};state.profile.mealPlan=food.value;state.profile.exercisePlan=exercise.value;state.planDays??={};state.exerciseDays??={};for(let n=(w-1)*7;n<112;n++){const wk=Math.floor(n/7)+1,day=n%7,k=wk+'-'+day;const logged=[0,1,2,3].some(i=>state.checks[k+'-'+i]||state.nutrition?.[k]?.[i]);if(!logged)state.planDays[k]=food.value;else state.planDays[k]??='original';if(!state.workoutDone?.[k])state.exerciseDays[k]=exercise.value}save();render()};root.append(b);
}
function exerciseSchedule(){
 let root=$('exercise-schedule');if(!root){root=document.createElement('section');root.id='exercise-schedule';root.className='card';root.dataset.tab='fitness';root.hidden=true;$('activity').parentElement.before(root)}
 root.replaceChildren();const h=document.createElement('h2');h.textContent='Weekly exercise plan';root.append(h);
 const schedules={structured:['Strength','Cardio','Mobility','Strength','Cardio','Mixed','Recovery'],walking:['Easy walk','Easy walk','Rest or gentle mobility','Easy walk','Easy walk','Optional easy walk','Rest'],treadmill:['Easy treadmill walk','Rest','Easy treadmill walk','Rest or mobility','Easy treadmill walk','Optional easy walk','Rest'],strength:['Easy walk','Home strength: chair sit-to-stand and wall push-ups','Easy walk','Rest','Home strength: chair sit-to-stand and wall push-ups','Easy walk','Rest']};
 for(let i=0;i<7;i++){const k=w+'-'+i,p=state.exerciseDays?.[k]||'none',task=schedules[p]?.[i]||'No workout scheduled',row=document.createElement('label');row.className='meal';const cb=document.createElement('input');cb.type='checkbox';cb.checked=!!state.workoutDone?.[k];cb.disabled=!schedules[p]||/Rest/.test(task);cb.onchange=()=>{state.workoutDone??={};state.workoutDone[k]=cb.checked;save()};const t=document.createElement('span');t.textContent='Day '+(i+1)+' · '+task+(/walk/i.test(task)&&!task.includes('strength')?' · '+Math.min(30,10+Math.floor((w-1)/2)*5)+' min':task.includes('strength')?' · 1–2 sets of 8 comfortable repetitions':'');row.append(cb,t);root.append(row)}
 const todayPlan=state.exerciseDays?.[w+'-'+d];if(todayPlan==='structured'){const heading=document.createElement('h3');heading.textContent='Selected day · timed activities';root.append(heading);const task=schedules.structured[d],duration=Math.min(25,10+Math.floor((w-1)/2)*5);const sessions=[['08:30','Gentle walk after breakfast · 10 min'],['13:00','Easy walk after lunch · 10 min'],['17:00',task==='Strength'?'Chair squats, wall push-ups, supported calf raises and standing marches · 1–2 sets of 8 each':task==='Cardio'?'Treadmill or stationary cycling · '+duration+' min':task==='Mixed'?'Easy cycling or treadmill · '+duration+' min, plus gentle stretching': 'Gentle mobility and stretching · 10 min'],['19:00','Optional easy walk after dinner · 10 min']];for(const [time,description] of sessions){const row=document.createElement('label');row.className='meal';const cb=document.createElement('input');cb.type='checkbox';const key=w+'-'+d+'-'+time;cb.checked=!!state.sessionDone?.[key];cb.onchange=()=>{state.sessionDone??={};state.sessionDone[key]=cb.checked;save()};const span=document.createElement('span');span.textContent=time+' · '+description;row.append(cb,span);root.append(row)}const advice=document.createElement('p');advice.textContent='Times are examples. Move walks to after your actual meals. If using insulin or medicines that can cause low blood sugar, discuss exercise precautions with your diabetes team.';root.append(advice)}
 const note=document.createElement('small');note.textContent='Start at a comfortable pace and adapt to your ability. Stop if you feel unwell. Completion checks do not automatically log activity minutes.';root.append(note)
}
