(function(){
  var SYM={"+":"+","-":"−","*":"×","/":"÷"};
  var cur="0", prev=null, op=null, fresh=false, err=false;
  var curEl=document.getElementById("cur"), exprEl=document.getElementById("expr");

  function fmt(n){return String(parseFloat(Number(n).toPrecision(12)));}
  function calc(a,b,o){
    a=parseFloat(a); b=parseFloat(b);
    if(o==="+")return a+b;
    if(o==="-")return a-b;
    if(o==="*")return a*b;
    if(o==="/")return b===0?null:a/b;
  }
  function show(){
    curEl.textContent=cur;
    curEl.classList.toggle("small",err||cur.length>13);
    exprEl.textContent=(prev!==null&&op)?prev+" "+SYM[op]:"";
  }
  function setError(msg){cur=msg;err=true;prev=null;op=null;fresh=true;show();}
  function clearAll(){cur="0";prev=null;op=null;fresh=false;err=false;show();}

  function digit(d){
    if(err)clearAll();
    if(fresh){cur="0";fresh=false;}
    if(cur.replace(/[-.]/g,"").length>=15)return;
    cur=(cur==="0")?d:cur+d; show();
  }
  function dot(){
    if(err)clearAll();
    if(fresh){cur="0";fresh=false;}
    if(cur.indexOf(".")===-1)cur+="."; show();
  }
  function operator(o){
    if(err)return;
    if(op&&!fresh){
      var r=calc(prev,cur,op);
      if(r===null)return setError("Cannot divide by zero");
      cur=fmt(r);
    }
    prev=cur; op=o; fresh=true; show();
  }
  function equals(){
    if(err||!op)return;
    var r=calc(prev,cur,op), line=prev+" "+SYM[op]+" "+cur+" =";
    if(r===null)return setError("Cannot divide by zero");
    cur=fmt(r); prev=null; op=null; fresh=true; show();
    exprEl.textContent=line;
  }
  function percent(){
    if(err)return;
    cur=fmt(parseFloat(cur)/100); fresh=true; show();
  }
  function back(){
    if(err)return clearAll();
    if(fresh)return;
    cur=cur.length>1?cur.slice(0,-1):"0";
    if(cur==="-")cur="0"; show();
  }

  function press(k){
    if(/^[0-9]$/.test(k))digit(k);
    else if(k===".")dot();
    else if("+-*/".indexOf(k)>-1)operator(k);
    else if(k==="=")equals();
    else if(k==="C")clearAll();
    else if(k==="back")back();
    else if(k==="%")percent();
  }

  document.getElementById("keys").addEventListener("click",function(e){
    var b=e.target.closest("button"); if(b)press(b.dataset.k);
  });

  document.addEventListener("keydown",function(e){
    if(e.ctrlKey||e.metaKey||e.altKey)return;
    var k=e.key, map={Enter:"=","=":"=",Backspace:"back",Escape:"C",c:"C",C:"C",",":"."};
    if(map[k])k=map[k];
    var valid=/^[0-9.%+\-*\/=]$/.test(k)||k==="C"||k==="back";
    if(!valid)return;
    e.preventDefault();
    press(k);
    var btn=document.querySelector('button[data-k="'+(k==="back"?"back":k)+'"]');
    if(btn){btn.classList.add("press");setTimeout(function(){btn.classList.remove("press");},110);}
    if(document.activeElement&&document.activeElement.tagName==="BUTTON")document.activeElement.blur();
  });
  show();
})();
