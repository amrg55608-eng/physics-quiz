(function(){
"use strict";
const $=s=>document.querySelector(s);
const C=$("#content");
const shuffle=a=>{for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
const el=(tag,cls,txt)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(txt!=null)e.textContent=txt;return e;};
const line=(txt,cls)=>C.appendChild(el("p","line "+(cls||""),txt));
const KEYS=["A","B","C","D"];
let S;

function reset(){S={score:0,streak:0,best:0,correct:0,answered:0,idx:0,total:QUESTIONS.length,deck:[],wrong:[],locked:false,screen:"start",opts:[],right:"",why:""};}

// gutter: أرقام أسطر زي المحرر
$("#gutter").textContent=Array.from({length:40},(_,i)=>i+1).join("\n");

function status(){
  $("#st-left").textContent=`score = ${S.score}   streak = ${S.streak}   correct = ${S.correct}/${S.answered}`;
  const cur=S.screen==="quiz"?Math.min(S.idx+1,S.total):0;
  $("#st-right").textContent=`Ln ${cur}/${S.total}   UTF-8   JavaScript`;
  $("#pfill").style.width=(S.total?100*S.answered/S.total:0)+"%";
}

function btn(label,fn){const b=el("button","btn",label);b.type="button";b.addEventListener("click",fn);return b;}

// ---------- شاشة البداية ----------
function showStart(){
  reset();S.screen="start";C.replaceChildren();
  line("import physics_quiz","acc b");
  line("# Chapter 1: Units & Dimensions  |  Chapter 4: Charge & Materials","dim");
  C.appendChild(el("h1","h1","class PhysicsQuiz:"));
  line(`    questions = ${QUESTIONS.length}   # اختيار من متعدد`);
  line("    points_per_correct = 10   # + streak bonus");
  line("    keys = ['1','2','3','4'] or ['A','B','C','D']   # Enter = next","dim");
  line(">>> quiz = PhysicsQuiz()   # اختار عدد الأسئلة","acc b");
  const row=el("div","btns");
  row.append(btn("quiz.run(50)",()=>start(50)),btn(`quiz.run(${QUESTIONS.length})  # كل الأسئلة`,()=>start(QUESTIONS.length)));
  C.appendChild(row);
  status();
}

function start(n){
  reset();S.total=Math.min(n,QUESTIONS.length);
  S.deck=shuffle(QUESTIONS.slice()).slice(0,S.total);
  showQuestion();
}

// ---------- شاشة السؤال ----------
function showQuestion(){
  S.screen="quiz";S.locked=false;C.replaceChildren();
  const q=S.deck[S.idx];
  S.right=q.a;S.why=q.why;S.opts=shuffle([q.a,...q.w]);
  line(`# question ${String(S.idx+1).padStart(2,"0")} / ${S.total}`,"dim");
  line("def question():","acc b");
  const box=el("div","qbox",q.q);C.appendChild(box);
  line("options = [","acc b");
  const list=el("div","opts");
  S.opts.forEach((t,i)=>{
    const b=el("button","opt");b.type="button";
    b.append(el("span","k",`[${KEYS[i]}]`),el("span","t",t));
    b.addEventListener("click",()=>choose(i));
    list.appendChild(b);
  });
  C.appendChild(list);
  line("]","acc b");
  const fb=el("div","fb");fb.id="fb";C.appendChild(fb);
  status();
}

function choose(i){
  if(S.locked||S.screen!=="quiz")return;
  S.locked=true;S.answered++;
  const btns=[...document.querySelectorAll(".opt")];
  btns.forEach(b=>b.disabled=true);
  const chosen=S.opts[i],rightI=S.opts.indexOf(S.right),fb=$("#fb");
  if(chosen===S.right){
    S.correct++;S.streak++;S.best=Math.max(S.best,S.streak);
    const gained=10+Math.min(S.streak-1,5)*2;S.score+=gained;
    btns[i].classList.add("ok");
    fb.appendChild(el("p","line good b",`>>> True    # صح! +${gained} pts`));
  }else{
    S.streak=0;
    btns[i].classList.add("no");btns[rightI].classList.add("ok");
    fb.appendChild(el("p","line bad b",">>> False   # غلط، الإجابة الصح متعلمة بالأخضر"));
    S.wrong.push({q:S.deck[S.idx].q,right:S.right,chosen,why:S.why});
  }
  fb.appendChild(el("p","why","الشرح: "+S.why));
  const last=S.idx===S.total-1;
  const nb=btn(last?"finish() ■":"next() ▶",next);fb.appendChild(nb);nb.focus({preventScroll:true});
  nb.scrollIntoView({block:"nearest",behavior:"smooth"});
  status();
}

function next(){
  if(S.screen!=="quiz"||!S.locked)return;
  S.idx++;
  if(S.idx>=S.total)showResult();else{showQuestion();window.scrollTo(0,0);}
}

// ---------- النتيجة ----------
function showResult(){
  S.screen="result";C.replaceChildren();status();
  const pct=Math.round(100*S.correct/S.total);
  let rank,note;
  if(pct>=90){rank="Senior Engineer";note="ممتاز! مستواك عالي جداً";}
  else if(pct>=75){rank="Mid-level Engineer";note="جيد جداً، شوية مراجعة وتبقى مية مية";}
  else if(pct>=50){rank="Junior Developer";note="كويس، راجع الأسئلة الغلط";}
  else{rank="Intern";note="محتاج مراجعة، جرب تاني";}
  line("# ===== RESULT =====","dim");
  C.appendChild(el("h1","h1 acc",`score    = ${S.score}`));
  line(`correct  = ${S.correct} / ${S.total}   (${pct}%)`,"b");
  line(`best_streak = ${S.best}`,"b");
  line(`rank     = "${rank}"   # ${note}`,"acc b");
  const row=el("div","btns");row.style.marginTop="12px";
  row.appendChild(btn("restart() ↻",showStart));C.appendChild(row);
  if(S.wrong.length){
    line(`wrong_answers = [  # ${S.wrong.length} أسئلة للمراجعة`,"acc b");
    const rev=el("div","rev");
    S.wrong.forEach(w=>{
      const q=el("div","acc b",w.q),a=el("div","bad","إجابتك: "+w.chosen),
            r=el("div","good","الصح: "+w.right),y=el("div","dim",w.why);
      rev.append(q,a,r,y);
    });
    C.appendChild(rev);line("]","acc b");
  }else line("# مفيش ولا غلطة! 🔥","good b");
  window.scrollTo(0,0);
}

// ---------- الكيبورد ----------
document.addEventListener("keydown",e=>{
  if(e.ctrlKey||e.metaKey||e.altKey)return;
  const k=e.key.toLowerCase();
  if(S.screen==="start"){if(k==="enter"||k===" "){e.preventDefault();start(50);}return;}
  if(S.screen!=="quiz")return;
  const map={"1":0,"2":1,"3":2,"4":3,a:0,b:1,c:2,d:3};
  if(k in map&&!S.locked)choose(map[k]);
  else if(S.locked&&(k==="enter"||k===" "||k==="arrowright")){e.preventDefault();next();}
});

showStart();
})();
