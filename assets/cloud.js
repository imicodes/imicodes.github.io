import {initializeApp} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js';
import {getAuth,GoogleAuthProvider,signInWithPopup,signOut,onAuthStateChanged,setPersistence,browserSessionPersistence} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js';
import {getFirestore,doc,getDoc,runTransaction,serverTimestamp} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js';
const app=initializeApp({apiKey:"AIzaSyB_BeoObTIzp8jmPWZ0fIunGvDwu46Vjvc",authDomain:"imicodes-health-dashboard.firebaseapp.com",projectId:"imicodes-health-dashboard",storageBucket:"imicodes-health-dashboard.firebasestorage.app",messagingSenderId:"302089969749",appId:"1:302089969749:web:8f48d5135a075e6fd734dc"});
const auth=getAuth(app),db=getFirestore(app);
const el=id=>document.getElementById(id),status=s=>el('cloud-status').textContent=s;
let revision=null,activeUid=null,busy=false;
const ref=uid=>doc(db,'users',uid,'backups','dashboard');
function controls(){const signed=!!auth.currentUser;el('cloud-login').hidden=signed;el('cloud-login').disabled=busy;el('cloud-logout').hidden=!signed;el('cloud-logout').disabled=busy;el('cloud-save').disabled=!signed||busy;el('cloud-load').disabled=!signed||busy}
async function action(fn){if(busy)return;busy=true;controls();try{await fn()}catch(e){status('Cloud operation failed: '+(e.code||e.message))}finally{busy=false;controls()}}
await setPersistence(auth,browserSessionPersistence);
onAuthStateChanged(auth,user=>{revision=null;activeUid=user?.uid||null;controls();status(user?'Signed in. Load an existing cloud backup or save this device’s progress.':'Signed out. Local records remain on this device.')});
el('cloud-login').onclick=()=>action(()=>signInWithPopup(auth,new GoogleAuthProvider()));
el('cloud-logout').onclick=()=>action(()=>signOut(auth));
el('cloud-load').onclick=()=>action(async()=>{
 const uid=auth.currentUser.uid,snap=await getDoc(ref(uid));
 if(activeUid!==uid)return;
 if(!snap.exists()){revision=0;status('No cloud backup yet. Save your local progress to create one.');return}
 const data=snap.data(),v=JSON.parse(data.payload);
 if(!v||!/^\d{4}-\d{2}-\d{2}$/.test(v.start)||!v.checks||!v.weights||!v.shop)throw Error('Invalid backup');
 if(!confirm('Replace this device’s progress with your cloud backup? Export a local backup first if needed.'))return;
 localStorage.setItem('weight16-v1',JSON.stringify(v));state=v;revision=data.revision;table();today();status('Cloud backup loaded.');
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
 if(activeUid===uid){revision=next;status('Cloud backup saved successfully.')}
});
