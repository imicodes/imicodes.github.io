import {initializeAppCheck,ReCaptchaEnterpriseProvider} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-app-check.js';
import {initializeApp} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js';
import {getAuth,GoogleAuthProvider,signInWithPopup,signOut,onAuthStateChanged,setPersistence,browserLocalPersistence} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js';
import {getFirestore,doc,getDoc,getDocFromServer,runTransaction,serverTimestamp,onSnapshot} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js';
const app=initializeApp({apiKey:"AIzaSyB_BeoObTIzp8jmPWZ0fIunGvDwu46Vjvc",authDomain:"imicodes-health-dashboard.firebaseapp.com",projectId:"imicodes-health-dashboard",storageBucket:"imicodes-health-dashboard.firebasestorage.app",messagingSenderId:"302089969749",appId:"1:302089969749:web:8f48d5135a075e6fd734dc"});
try {
 initializeAppCheck(app,{
  provider:new ReCaptchaEnterpriseProvider('6LeB-TEuAAAAAM33XCTzWZkTdKpEY5J1gj6-JcVC'),
  isTokenAutoRefreshEnabled:true
 });
} catch(error) {
 console.error('App Check initialization failed',error);
 document.getElementById('login-status').textContent='Security verification could not initialize. Refresh the page and check your connection.';
 throw error;
}
const auth=getAuth(app),db=getFirestore(app);
const el=id=>document.getElementById(id),status=s=>el('cloud-status').textContent=s;
let revision=null,activeUid=null,busy=false,baseline=null,timer=null,unsubscribe=null,enabled=false;
const ref=uid=>doc(db,'users',uid,'backups','dashboard');
function controls(){const signed=!!auth.currentUser;el('cloud-login').hidden=signed;el('cloud-login').disabled=busy;el('cloud-logout').hidden=!signed;el('cloud-logout').disabled=busy;el('cloud-save').disabled=!signed||busy;el('cloud-load').disabled=!signed||busy}
async function action(fn){if(busy)return;busy=true;controls();try{await fn()}catch(e){status('Cloud operation failed: '+(e.code||e.message))}finally{busy=false;controls()}}
try { await setPersistence(auth,browserLocalPersistence); } catch(e) { console.warn('Persistent login unavailable',e); }
const gate=el('login-gate'),dashboard=el('private-dashboard'),gateStatus=el('login-status');
let generation=0, loginError='';
function lock(message){dashboard.hidden=true;gate.hidden=false;gateStatus.textContent=message;el('gate-login').disabled=false}
el('gate-login').onclick=async()=>{loginError='';el('gate-login').disabled=true;gateStatus.textContent='Opening Google sign-in…';try{await signInWithPopup(auth,new GoogleAuthProvider())}catch(e){lock('Sign-in failed: '+(e.code||e.message))}};
el('gate-export').onclick=()=>el('export').click();
onAuthStateChanged(auth,async user=>{
 const token=++generation;stopAuto();revision=null;baseline=null;activeUid=null;controls();
 dashboard.hidden=true;gate.hidden=false;el('gate-export').hidden=true;
 if(!user){lock(loginError||'Sign in with your authorised Google account.');return}
 gateStatus.textContent='Verifying private database access…';el('gate-login').disabled=true;
 try{
  const snap=await getDocFromServer(ref(user.uid));if(token!==generation)return;
  const local=JSON.stringify(state);
  if(snap.exists()){
   const data=snap.data(),v=JSON.parse(data.payload);
   if(!v||!/^\d{4}-\d{2}-\d{2}$/.test(v.start)||!v.checks||!v.weights||!v.shop)throw Error('Invalid backup');
   if(local!==JSON.stringify(v)){
    const backup=localStorage.getItem('weight16-v1');
    if(backup&&backup!==JSON.stringify(v))localStorage.setItem('weight16-pre-login-backup',backup);
   }
   state=v;revision=data.revision;baseline=JSON.stringify(v);save();table();today();
  }else{revision=0;baseline=JSON.stringify(state)}
  activeUid=user.uid;dashboard.hidden=false;gate.hidden=true;controls();
  if(!snap.exists()){status('Authorised. Save your first cloud backup to start automatic sync.');return}
  el('cloud-auto').checked=true;el('cloud-auto').onchange();
 }catch(e){if(token!==generation)return;const denied=e.code==='permission-denied';console.error('Dashboard login verification failed',e);loginError=denied?'Access denied. Check the authorised Firebase UID and App Check settings.':'Login verification failed: '+(e.code||e.message);lock(loginError);await signOut(auth).catch(()=>{})}
});
el('cloud-login').onclick=()=>action(()=>signInWithPopup(auth,new GoogleAuthProvider()));
el('cloud-logout').onclick=()=>action(async()=>{if(enabled&&JSON.stringify(state)!==baseline&&!confirm('Unsynced changes remain on this device. Sign out anyway?'))return;stopAuto();await signOut(auth)});
el('cloud-load').onclick=()=>action(async()=>{
 const uid=auth.currentUser.uid,snap=await getDoc(ref(uid));
 if(activeUid!==uid)return;
 if(!snap.exists()){revision=0;status('No cloud backup yet. Save your local progress to create one.');return}
 const data=snap.data(),v=JSON.parse(data.payload);
 if(!v||!/^\d{4}-\d{2}-\d{2}$/.test(v.start)||!v.checks||!v.weights||!v.shop)throw Error('Invalid backup');
 if(!confirm('Replace this device’s progress with your cloud backup? Export a local backup first if needed.'))return;
 localStorage.setItem('weight16-v1',JSON.stringify(v));state=v;revision=data.revision;baseline=JSON.stringify(state);table();today();status('Cloud backup loaded.');
});
el('cloud-save').onclick=()=>action(async()=>{
 const uid=auth.currentUser.uid;
 if(!confirm('Save this device’s progress to your signed-in Google account?'))return;
 const payload=JSON.stringify(state);
 if(new TextEncoder().encode(payload).length>900000)throw Error('Backup exceeds safe document size');
 const next=await runTransaction(db,async tx=>{
  const target=ref(uid),snap=await tx.get(target),current=snap.exists()?snap.data().revision:0;
  if(current!==(revision??0))throw Error('Cloud backup changed or already exists. Export local progress and load the cloud backup before saving again.');
  tx.set(target,{payload,revision:current+1,updatedAt:serverTimestamp()});return current+1;
 });
 if(activeUid===uid){revision=next;baseline=payload;status('Cloud backup saved successfully.');if(!enabled){el('cloud-auto').checked=true;queueMicrotask(()=>{if(!busy)el('cloud-auto').onchange();else setTimeout(()=>el('cloud-auto').onchange(),0)})}}
});

function stopAuto(){enabled=false;clearInterval(timer);timer=null;if(unsubscribe)unsubscribe();unsubscribe=null;el('cloud-auto').checked=false}
function conflict(){stopAuto();status('Sync paused: cloud and local changes conflict. Export local backup, then load cloud progress before enabling sync again.')}
async function autoSave(){
 if(!enabled||busy||!activeUid||baseline===null||JSON.stringify(state)===baseline)return;
 const uid=activeUid,payload=JSON.stringify(state),expected=revision;
 busy=true;controls();
 try{
  if(new TextEncoder().encode(payload).length>900000)throw Error('Backup too large');
  const next=await runTransaction(db,async tx=>{
   const target=ref(uid),snap=await tx.get(target),current=snap.exists()?snap.data().revision:0;
   if(current!==expected)throw Error('revision-conflict');
   tx.set(target,{payload,revision:current+1,updatedAt:serverTimestamp()});return current+1;
  });
  if(activeUid===uid){revision=next;baseline=payload;status('Automatically saved at '+new Date().toLocaleTimeString())}
 }catch(e){if(e.message==='revision-conflict')conflict();else status('Sync waiting: '+(e.code||e.message)+'; local changes retained.')}
 finally{busy=false;controls()}
}
el('cloud-auto').onchange=()=>{
 if(!el('cloud-auto').checked){stopAuto();status('Automatic sync off.');return}
 if(!activeUid||busy||baseline===null){stopAuto();status('First load or save your cloud backup, then enable automatic sync.');return}
 enabled=true;const uid=activeUid;
 unsubscribe=onSnapshot(ref(uid),{includeMetadataChanges:true},snap=>{
  if(!enabled||activeUid!==uid||busy||snap.metadata.hasPendingWrites||snap.metadata.fromCache)return;
  if(!snap.exists()){conflict();return}
  const data=snap.data();if(data.revision===revision)return;
  if(JSON.stringify(state)!==baseline){conflict();return}
  try{const v=JSON.parse(data.payload);if(!v||!/^\d{4}-\d{2}-\d{2}$/.test(v.start)||!v.checks||!v.weights||!v.shop)throw Error('Invalid backup');
   localStorage.setItem('weight16-v1',JSON.stringify(v));state=v;revision=data.revision;baseline=JSON.stringify(v);table();render();status('Updated from cloud.');
  }catch(e){stopAuto();status('Sync paused: '+e.message)}
 },e=>{stopAuto();status('Sync paused: '+e.code)});
 timer=setInterval(autoSave,3000);status('Automatic sync enabled for this session.');
};
