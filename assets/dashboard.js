
const B=['3 eggs, 60 g wholemeal bread, tomatoes','60 g oats, 200 ml semi-skimmed milk, 100 g berries','250 g plain Greek yoghurt, 40 g oats, 100 g berries','3 eggs, 60 g wholemeal bread, mushrooms','60 g oats, 200 ml milk, 100 g apple','3 eggs, 2 lean bacon medallions, 1 slice wholemeal toast','250 g Greek yoghurt, 40 g oats, 1 small banana'];
const S=['200 g Greek yoghurt, 100 g berries, 15 g almonds','200 g cottage cheese, 1 apple','2 boiled eggs, 1 orange','200 g Skyr, 1 apple','200 g Greek yoghurt, 20 g almonds','200 g Skyr, 100 g berries','200 g cottage cheese, 1 pear'];
const meals=[['200 g chicken breast, 150 g brown rice, 200 g broccoli','200 g turkey breast, 250 g potatoes, mixed salad','150 g tuna, 2 wholemeal wraps, salad, light mayonnaise','200 g pork tenderloin, 250 g potatoes, vegetables','200 g chicken breast, 150 g rice, mixed vegetables','200 g chicken breast, 2 wholemeal wraps, salad','200 g roast chicken breast, 250 g potatoes, vegetables'],['200 g turkey breast, 150 g rice, vegetables','200 g chicken breast, 2 wholemeal wraps, salad','150 g tuna, 180 g wholewheat pasta, salad','200 g pork tenderloin, 250 g potatoes, green beans','200 g chicken breast, 150 g rice, vegetables','200 g turkey breast, 250 g potatoes, salad','200 g lean roast beef, 250 g potatoes, vegetables'],['200 g chicken breast, 150 g rice, vegetables','200 g lean beef mince, 150 g rice, peppers','150 g tuna, 2 wholemeal wraps, salad','200 g turkey breast, 250 g potatoes, vegetables','200 g chicken breast, 180 g wholewheat pasta, vegetables','200 g chicken breast, 2 wholemeal wraps, salad','200 g roast turkey, 250 g potatoes, vegetables'],['200 g chicken breast, 250 g sweet potato, broccoli','200 g turkey breast, 150 g rice, vegetables','150 g tuna, 2 wholemeal wraps, salad','200 g pork tenderloin, 250 g potatoes, salad','200 g chicken breast, 150 g rice, vegetables','200 g turkey breast, 2 wholemeal wraps, salad','200 g roast chicken, 250 g potatoes, vegetables']];
const dinners=[['200 g salmon, 250 g potatoes, 200 g green beans','200 g lean beef mince, 180 g wholewheat pasta, tomato sauce, vegetables','250 g chicken breast, 180 g rice, 250 g stir-fry vegetables','250 g cod, 300 g potatoes, 150 g peas, olive oil','200 g lean beef steak, 250 g potato wedges, salad','200 g salmon, 180 g rice, 200 g vegetables','200 g lean turkey mince, 180 g wholewheat pasta, tomato sauce'],['200 g lean beef mince, 300 g potatoes, vegetables','200 g salmon, 250 g sweet potato, broccoli','250 g chicken breast, 180 g rice, peppers and onions','250 g cod, 300 g potatoes, peas, olive oil','200 g lean beef burger, wholemeal bun, 200 g potato wedges, salad','250 g chicken curry, 180 g rice, vegetables, light sauce','200 g chicken breast, 180 g wholewheat pasta, tomato sauce'],['200 g salmon, 250 g potatoes, broccoli','250 g chicken breast, 300 g potatoes, green beans','200 g pork tenderloin, 180 g rice, vegetables','250 g haddock, 300 g potatoes, peas, olive oil','200 g lean beef steak, 250 g potato wedges, salad','200 g salmon, 180 g rice, asparagus','200 g lean beef mince, 180 g wholewheat spaghetti, tomato sauce'],['200 g lean beef mince, 180 g wholewheat pasta, tomato sauce','200 g salmon, 250 g potatoes, green beans','250 g chicken breast, 180 g rice, stir-fry vegetables','250 g cod, 300 g potatoes, peas, olive oil','200 g lean beef burger, wholemeal bun, 200 g potato wedges, salad','250 g chicken breast fajitas, 2 wholemeal wraps, peppers and onions','200 g lean turkey mince, 180 g wholewheat pasta, tomato sauce']];
const $=id=>document.getElementById(id);let state={start:new Date().toLocaleDateString('en-CA'),checks:{},weights:{},shop:{}};state.start=new Date().toISOString().slice(0,10);try{Object.assign(state,JSON.parse(localStorage.getItem('weight16-v1')||'{}'))}catch{};let w=1,d=0;const save=()=>{try{localStorage.setItem('weight16-v1',JSON.stringify(state))}catch{}};const menu=(r,i)=>[B[i],meals[r][i],S[i],dinners[r][i]];const names=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];function dateAt(n){let a=new Date(state.start+'T12:00:00');a.setDate(a.getDate()+n);return a}function today(){let now=new Date();let delta=Math.floor((Date.UTC(now.getFullYear(),now.getMonth(),now.getDate())-Date.parse(state.start))/86400000);delta=Math.max(0,Math.min(111,delta));w=Math.floor(delta/7)+1;d=delta%7;render()}function render(){ $('start').value=state.start;$('week').value=w;let r=(w-1)%4,key=w+'-'+d;$('date').textContent=dateAt((w-1)*7+d).toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long'});$('days').innerHTML=names.map((n,i)=>`<button class="${i===d?'active':''}" onclick="d=${i};render()">Day ${i+1}</button>`).join('');$('meals').innerHTML=menu(r,d).map((m,i)=>`<label class="meal ${state.checks[key+'-'+i]?'done':''}"><input type="checkbox" ${state.checks[key+'-'+i]?'checked':''} onchange="state.checks['${key}-${i}']=this.checked;save();render()"><span><strong>${['Breakfast · 08:00','Lunch · 12:30','Snack · 15:30','Dinner · 18:30'][i]}</strong><br>${m}</span></label>`).join('');$('count').textContent=[0,1,2,3].filter(i=>state.checks[key+'-'+i]).length+'/4 meals';let items=[...new Set(Array.from({length:7},(_,i)=>menu(r,i)).flat(2).flatMap(s=>s.split(', ')).map(s=>s.replace(/^\d+\s*(g|ml)?\s*/,'').replace(/^small /,'').trim()))].sort();$('shop').innerHTML='<small>Ingredient checklist for this week; quantities are in the daily menus.</small>'+items.map((s,i)=>`<label class="meal"><input type="checkbox" ${state.shop[w+'-'+i]?'checked':''} onchange="state.shop['${w}-${i}']=this.checked;save()"><span>${s}</span></label>`).join('');metrics()}
function metrics(){let points=Object.entries(state.weights).filter(([k,v])=>Number(v)>0).sort((a,b)=>a[0]-b[0]);let last=points.length?Number(points.at(-1)[1]):102;$('latest').textContent=last.toFixed(1)+' kg';$('lost').textContent=(102-last).toFixed(1)+' kg';$('progress').value=Math.max(0,102-last);let lo=Math.min(88,...points.map(p=>+p[1]-1)),hi=Math.max(104,...points.map(p=>+p[1]+1)),x=n=>35+n*18,y=v=>15+(hi-v)/(hi-lo)*130;$('chart').innerHTML=`<svg viewBox="0 0 340 170" role="img" aria-label="Weight progress chart">${[90,96,102].map(v=>`<text x="0" y="${y(v)+4}" fill="#aab9ca" font-size="10">${v}</text><path d="M35 ${y(v)} H323" stroke="#344151"/>`).join('')}<path d="M35 ${y(102)} L323 ${y(90)}" stroke="#aab9ca" stroke-dasharray="5 5" fill="none"/><polyline points="${[[0,102],...points].map(p=>x(+p[0])+','+y(+p[1])).join(' ')}" stroke="#52d6a0" stroke-width="3" fill="none"/>${points.map(p=>`<circle cx="${x(+p[0])}" cy="${y(+p[1])}" r="3" fill="#52d6a0"/>`).join('')}<text x="35" y="165" fill="#aab9ca" font-size="10">Start</text><text x="285" y="165" fill="#aab9ca" font-size="10">Week 16</text></svg>`} $('week').innerHTML=Array.from({length:16},(_,i)=>`<option value="${i+1}">Week ${i+1}</option>`).join('');function table(){ $('weights').innerHTML=Array.from({length:16},(_,i)=>`<tr><td>${i+1}</td><td>${(102-(i+1)*.75).toFixed(2)}</td><td><input aria-label="Week ${i+1} weight" type="number" min="30" max="300" step="0.1" value="${Number(state.weights[i+1])||''}" onchange="if(this.value && !this.checkValidity()){this.reportValidity();return}state.weights[${i+1}]=this.value;save();metrics()"></td></tr>`).join('')};$('week').onchange=e=>{w=+e.target.value;render()};$('start').onchange=e=>{if(e.target.value){state.start=e.target.value;save();today()}};$('today').onclick=today;$('export').onclick=()=>{let a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(state)],{type:'application/json'}));a.download='weight-progress.json';a.click();URL.revokeObjectURL(a.href)};$('import').onclick=()=>$('file').click();$('file').onchange=async e=>{try{let v=JSON.parse(await e.target.files[0].text());if(!/^\d{4}-\d{2}-\d{2}$/.test(v.start)||!v.checks||!v.weights||!v.shop)throw Error();state=v;save();table();today()}catch{alert('Invalid backup file')}};table();today();


/* Approximate generic nutrition per 100 g: kcal, protein, carbs, fat.
   These are editable estimates, not verified product-label values. */
const foods=[
[/^eggs?$|^boiled eggs$/,143,13,1,10,50],
[/wholemeal (bread|toast)/,245,10,41,4,40],
[/oats/,370,13,60,7,0],
[/milk/,47,3.5,4.8,1.7,0],
[/greek yoghurt|skyr/,63,10,4,0.5,0],
[/cottage cheese/,85,12,3,2.5,0],
[/berries/,50,1,10,0.5,0],
[/almonds/,580,21,9,50,0],
[/apple|pear|orange|banana/,65,0.5,15,0.2,120],
[/bacon medallions/,130,22,1,4,30],
[/chicken|turkey breast|roast turkey/,115,23,0,2,0],
[/turkey mince/,145,21,0,7,0],
[/beef/,150,21,0,7,0],
[/pork/,120,22,0,3,0],
[/salmon/,208,20,0,13,0],
[/cod|haddock/,82,18,0,1,0],
[/tuna/,110,25,0,1,0],
[/rice/,130,3,28,0.4,0],
[/pasta|spaghetti/,145,5,28,1,0],
[/wraps?/,300,9,48,8,60],
[/bun/,250,9,45,4,70],
[/potato/,80,2,17,0.1,0],
[/peas/,80,5,12,0.5,0],
[/olive oil/,884,0,0,100,0],
[/mayonnaise/,280,1,5,28,0],
[/sauce/,45,1,7,1,0],
[/vegetables|salad|broccoli|beans|mushrooms|tomatoes|peppers|asparagus/,35,2,5,0.4,0]
];
function estimateMeal(meal){
 const total=[0,0,0,0];
 for(const part of meal.split(', ')){
  const m=part.match(/^(\d+)\s*(g|ml|slice)?\s+(.+)$/);
  const name=(m?m[3]:part).replace(/^small /,'').toLowerCase();
  const f=foods.find(x=>x[0].test(name));
  if(!f)continue;
  const amount=m?(m[2]==='g'||m[2]==='ml'?+m[1]:+m[1]*(f[5]||100)):(/oil|mayonnaise/.test(name)?10:/sauce/.test(name)?100:/bun/.test(name)?70:150);
  for(let i=0;i<4;i++)total[i]+=f[i+1]*amount/100;
 }
 return total.map(Math.round);
}
function nutrition(){
 const key=w+'-'+d;
 const records=state.nutrition?.[key]||{};
 const planned=menu((w-1)%4,d).map(estimateMeal);
 const totals=[0,0,0,0], eaten=[0,0,0,0];
 const root=$('nutrition');root.replaceChildren();
 const labels=['Breakfast','Lunch','Snack','Dinner','Extra food / drinks / oil'];
 const summary=document.createElement('p');root.append(summary);
 labels.forEach((label,i)=>{
  const vals=records[i]||planned[i]||[0,0,0,0];
  vals.forEach((v,j)=>{totals[j]+=Number(v)||0;if(i===4||state.checks[key+'-'+i])eaten[j]+=Number(v)||0});
  const row=document.createElement('div');row.className='nutrition-row';
  const title=document.createElement('strong');title.textContent=label;row.append(title);
  ['kcal','Protein g','Carbs g','Fat g'].forEach((unit,j)=>{
   const l=document.createElement('label');l.textContent=unit;
   const input=document.createElement('input');input.type='number';input.min='0';input.max=j===0?'10000':'1000';input.step='1';input.value=vals[j];input.setAttribute('aria-label',label+' '+unit);
   input.onchange=()=>{if(!input.checkValidity()||input.value===''){input.reportValidity();return}state.nutrition??={};state.nutrition[key]??={};state.nutrition[key][i]=[...vals];state.nutrition[key][i][j]=Number(input.value);save();nutrition()};
   l.append(input);row.append(l);
  });root.append(row);
 });
 summary.textContent='Planned: '+totals[0]+' kcal · Logged: '+eaten[0]+' kcal · Remaining against 1,700: '+(1700-eaten[0])+' kcal. Logged macros: '+eaten[1]+' g protein / '+eaten[2]+' g carbs / '+eaten[3]+' g fat.';
}
const originalRender=render;render=function(){originalRender();nutrition()};today();
