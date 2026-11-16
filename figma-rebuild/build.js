const page=await figma.getNodeByIdAsync('231:31');await figma.setCurrentPageAsync(page);
const board=await figma.getNodeByIdAsync('234:2');
const created=[],frames=[],textEvidence=[];
const fonts=[...new Map(SPEC.flatMap(s=>s.texts.map(t=>[t.font+'|'+t.style,{family:t.font,style:t.style}]))).values()];
await Promise.all(fonts.map(f=>figma.loadFontAsync(f)));
const keys=['portrait-trey','portrait-alfonzo','portrait-franklin','texture-blue','texture-paper','texture-orange','texture-wallpaper','texture-leather','texture-cream','texture-desk','qr-who','qr-what','qr-garage','qr-read','qr-end'];
const masters={};for(let i=0;i<keys.length;i++)masters[keys[i]]=await figma.getNodeByIdAsync('234:'+(i+4));
const hashes={};for(const k of keys)hashes[k]=masters[k].fills.find(f=>f.type==='IMAGE').imageHash;
const hallway='28e633694dcbe1cc028b57f793172149a6c5b9d0';
function rgb(hex){return {r:parseInt(hex.slice(1,3),16)/255,g:parseInt(hex.slice(3,5),16)/255,b:parseInt(hex.slice(5,7),16)/255};}
function solid(hex,opacity=1){return {type:'SOLID',color:rgb(hex),opacity};}
function rect(p,name,x,y,w,h,fill){const n=figma.createRectangle();p.appendChild(n);n.name=name;n.x=x;n.y=y;n.resize(w,h);n.fills=typeof fill==='string'?[solid(fill)]:fill;n.strokes=[];created.push(n.id);return n;}
function ellipse(p,name,x,y,w,h,fill){const n=figma.createEllipse();p.appendChild(n);n.name=name;n.x=x;n.y=y;n.resize(w,h);n.fills=typeof fill==='string'?[solid(fill)]:fill;n.strokes=[];created.push(n.id);return n;}
function photo(p,name,x,y,w,h,gray=false){const hash=name==='hallway'?hallway:hashes[name];return rect(p,name,x,y,w,h,[{type:'IMAGE',imageHash:hash,scaleMode:'FILL',...(gray?{filters:{saturation:-1}}:{})}]);}
function svg(p,name,source,x=0,y=0){const n=figma.createNodeFromSvg(source);p.appendChild(n);n.name=name;n.x=x;n.y=y;created.push(n.id);return n;}
function texture(p,key,w,h,opacity=1){const n=photo(p,key,0,0,w,h);n.opacity=opacity;n.locked=true;return n;}
function vignette(p,w,h,strength=.3){const n=rect(p,'Vignette • chỉnh độ tối viền',0,0,w,h,[{type:'GRADIENT_RADIAL',gradientTransform:[[1,0,0],[0,1,0]],gradientStops:[{position:0,color:{r:0,g:0,b:0,a:0}},{position:.72,color:{r:0,g:0,b:0,a:0}},{position:1,color:{r:0,g:0,b:0,a:strength}}]}]);n.locked=true;return n;}
function ragged(p,name,x,y,w,h,fill,stroke='#b7a18b'){
 let seed=61;function rnd(){seed=(seed*16807)%2147483647;return seed/2147483647;}
 let d='M 0 8';for(let px=20;px<w;px+=18)d+=' L '+px+' '+(rnd()*16);d+=' L '+w+' 8';for(let py=24;py<h;py+=25)d+=' L '+(w-rnd()*12)+' '+py;d+=' L '+w+' '+(h-8);for(let px=w-20;px>0;px-=18)d+=' L '+px+' '+(h-rnd()*16);d+=' L 0 '+(h-8);for(let py=h-25;py>10;py-=25)d+=' L '+(rnd()*11)+' '+py;d+=' Z';
 const n=svg(p,name,'<svg width="'+w+'" height="'+h+'" viewBox="0 0 '+w+' '+h+'" xmlns="http://www.w3.org/2000/svg"><path d="'+d+'" fill="'+fill+'" stroke="'+stroke+'" stroke-width="2"/></svg>',x,y);return n;
}
function distress(p,w,h,color='#26232b'){
 let v=45;const random=()=>{v=(v*16807)%2147483647;return v/2147483647;};let paths='';
 for(let i=0;i<240;i++){let x=random()*w,y=random()*h;if(i%4!==0)x=random()<.5?random()*30:w-random()*30;const r=.3+random()*2.2;paths+='<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="'+color+'" opacity="'+(.1+random()*.5)+'"/>';}
 return svg(p,'Vết mực / giấy cũ • vector',`<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">${paths}</svg>`);
}
function scratches(p){
 const glyphs={T:'M3 9 L39 8 M22 2 L15 52',A:'M0 48 L21 0 L41 48 M2 32 L43 32',Y:'M2 0 L22 23 L40 0 M22 23 L20 52',I:'M2 3 L40 3 M23 3 L17 49 M0 51 L39 49',S:'M38 0 L7 13 L36 38 L17 53 L2 43 M14 0 L38 23',L:'M6 0 L6 50 L42 44',N:'M0 51 L0 0 L36 40 L36 0',E:'M5 0 L5 52 M0 6 L39 18 L0 25 L40 30 L0 49',R:'M0 52 L3 0 L30 26 L2 32 M5 22 L31 52'};
 ['TAYIS','ALIAS','NEARS'].forEach((row,j)=>[...row].forEach((g,i)=>{const path=glyphs[g];svg(p,'Vết khắc '+g,`<svg width="55" height="63" viewBox="-5 -5 55 63" xmlns="http://www.w3.org/2000/svg"><path d="${path}" fill="none" stroke="#727884" stroke-width="2.4" opacity=".6"/><path d="${path}" transform="translate(1.6 1)" fill="none" stroke="#adb0bc" stroke-width="1.4" opacity=".7"/></svg>`,40+i*78,110+j*83);}));
}
function vinyl(p){
 const stops=['#050505','#090909','#505050','#090909','#000000','#505050','#070707'].map((c,i)=>({position:i/6,color:{...rgb(c),a:1}}));
 ellipse(p,'Đĩa than • gradient chỉnh được',55,789,850,855,[{type:'GRADIENT_ANGULAR',gradientTransform:[[1,0,0],[0,1,0]],gradientStops:stops}]);
 for(let i=0;i<43;i++){const d=800-i*11;const e=ellipse(p,'Rãnh đĩa '+(i+1),480-d/2,1216-d/2,d,d,[]);e.strokes=[solid(i%3===0?'#545454':'#070707',.35)];e.strokeWeight=1.6;}
 ellipse(p,'Nhãn đĩa • màu cam',332,1060,299,299,[{type:'GRADIENT_LINEAR',gradientTransform:[[0,1,0],[-1,0,1]],gradientStops:[{position:0,color:{...rgb('#ffdb7c'),a:1}},{position:.499,color:{...rgb('#ffd579'),a:1}},{position:.501,color:{...rgb('#f9a638'),a:1}},{position:1,color:{...rgb('#eb8b2b'),a:1}}]}]);
 ellipse(p,'Lỗ tâm đĩa',467,1195,29,29,'#000000');ellipse(p,'Tâm màu nền',472,1200,19,19,'#15232f');
}
function background(f,s){const w=s.w,h=s.h;
 if(s.bg==='blue'){texture(f,'texture-blue',w,h);vignette(f,w,h,.35);}
 if(s.bg==='paper'){texture(f,'texture-paper',w,h);vignette(f,w,h,.1);}
 if(s.bg==='navy'){rect(f,'Nền xanh đậm',0,0,w,h,'#223646');texture(f,'texture-blue',w,h,.1);vignette(f,w,h,.25);}
 if(s.bg==='orange'){texture(f,'texture-orange',w,h);vignette(f,w,h,.14);}
 if(s.bg==='wallpaper'){texture(f,'texture-wallpaper',w,h);vignette(f,w,h,.35);svg(f,'Mũi tên phun sơn','<svg width="132" height="58" viewBox="0 0 132 58" xmlns="http://www.w3.org/2000/svg"><path d="M13 24 C83 11 95 56 78 47 C42 18 64 1 87 7 C119 11 123 31 127 39 M13 24 L38 11 M13 24 L37 34" stroke="#151218" stroke-width="8" stroke-linecap="round" fill="none"/></svg>',287,14);}
 if(s.bg==='writing'){rect(f,'Giấy nền tối',0,0,w,h,'#181b28');ragged(f,'Tờ giấy ghi tay',24,76,389,347,'#c8c5dd','#d3cfdf');rect(f,'Nếp gấp',30,222,385,2,[solid('#a7a3bb',.2)]);}
 if(s.bg==='evp'){rect(f,'Viền tối',0,0,w,h,'#171a21');ragged(f,'Giấy transcript',10,25,w-25,h-43,'#cdccdc','#b9b6c9');distress(f,w,h);}
 if(s.bg==='command'){
  rect(f,'Nền phòng điều khiển',0,0,w,h,'#55505e');photo(f,'texture-desk',0,389,w,113);rect(f,'Mặt tủ',0,503,w,100,'#6e687a');rect(f,'Chân tủ',0,596,w,34,'#373039');
  for(const [x,sw] of [[0,291],[297,292],[594,290]]){
   rect(f,'Màn hình • viền đen',x,220,sw,199,'#111115');rect(f,'Màn hình • viền sáng',x+6,227,sw-14,176,'#8c8999');rect(f,'Màn hình • nền',x+10,232,sw-22,165,'#c6c3d9');rect(f,'Chân màn hình',x+125,412,24,34,'#1b1b23');ellipse(f,'Đế màn hình',x+85,436,111,18,'#15151d');ellipse(f,'Viền đế',x+89,436,102,9,'#343441');
  }
 }
 if(s.bg==='hallway'){
  photo(f,'hallway',0,0,w,h);ragged(f,'Dải giấy rách',8,231,w-24,293,'#e1dfe2','#b8a9a5');const grain=texture(f,'texture-paper',w,280,.12);grain.y=235;
 }
 if(s.bg==='web'||s.bg==='webbook'){
  photo(f,'hallway',0,0,w,h,true);rect(f,'Lớp tối hành lang',0,0,w,h,[solid('#242424',.3)]);
  const x=s.file.includes('What-did')?61:64;const y=s.file.includes('What-did')?49:s.file.includes('What-do-you')?83:70;
  rect(f,'Khung nội dung xanh đen',x,y,w-x*2,h-y-(s.file.includes('What-did')?47:96),'#15232f');
  if(s.bg==='webbook'){
   const book=photo(f,'texture-leather',107,126,746,446);book.cornerRadius=18;book.strokes=[solid('#ddad60')];book.strokeWeight=6;
   rect(f,'Gáy da cuốn sách',115,130,130,425,'#9a5019');rect(f,'Đường chỉ gáy',242,133,2,418,'#efd7a0');
   svg(f,'Góc bìa sách','<svg width="160" height="145" viewBox="0 0 160 145" xmlns="http://www.w3.org/2000/svg"><path d="M0 0 H150 Q160 0 160 14 V145 Z" fill="#96501c" stroke="#efcd87" stroke-width="3" stroke-dasharray="3 4"/></svg>',686,124);
   ragged(f,'Giấy ghi chú • viền cháy',97,525,780,1115,'#f2eee6','#cbb398');const paper=photo(f,'texture-cream',113,542,747,1068);paper.opacity=.35;paper.locked=true;
   ragged(f,'Băng dính giấy',327,485,350,87,'#e0d5b3','#e0d5b3');
  }
  if(s.file.includes('Parking'))vinyl(f);
 }
}
let row;
for(let i=0;i<SPEC.length;i++){
 if(i%4===0){row=figma.createAutoLayout('HORIZONTAL',{name:'Hàng '+(1+i/4),itemSpacing:80});board.appendChild(row);row.fills=[];row.counterAxisAlignItems='MIN';created.push(row.id);}
 const s=SPEC[i];const f=figma.createFrame();row.appendChild(f);f.name=s.name;f.resize(s.w,s.h);f.fills=[];f.clipsContent=true;f.placeholder=true;created.push(f.id);frames.push({id:f.id,name:s.name,w:s.w,h:s.h});
 background(f,s);
 if(s.name.startsWith('07'))scratches(f);
 for(const a of s.assets){const inst=masters[a[0]].createInstance();f.appendChild(inst);inst.name=a[0]+' • thay ảnh trong thành phần gốc';inst.x=a[1];inst.y=a[2];inst.resize(a[3],a[4]);created.push(inst.id);}
 for(const spec of s.texts){const n=figma.createText();f.appendChild(n);n.fontName={family:spec.font,style:spec.style};n.fontSize=spec.size;n.lineHeight={unit:'PIXELS',value:spec.line};n.textAutoResize='HEIGHT';n.resize(spec.w,30);n.characters=spec.text;n.textAlignHorizontal=spec.align;n.fills=[solid(spec.color)];n.name='CHỮ • '+spec.text.split('\n')[0].slice(0,65);n.x=spec.x;n.y=spec.y;created.push(n.id);textEvidence.push({id:n.id,font:n.fontName,lines:spec.text.split('\n').length,x:n.x,y:n.y,w:n.width,h:n.height,bottom:n.y+n.height,frameH:s.h});}
 f.placeholder=false;
}
return {createdNodeIds:created,frames,textEvidence,board:{id:board.id,w:board.width,h:board.height},fontFamilies:fonts};
