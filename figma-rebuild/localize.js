const page=await figma.getNodeByIdAsync('231:31');await figma.setCurrentPageAsync(page);
const created=[],mutated=[],removed=[],evidence=[];
const preserve={'235:69':['235:75'],'235:125':['235:130'],'235:379':['235:383'],'235:384':['235:390'],'235:414':['235:430','235:431'],'235:432':['235:486','235:487']};
const records=[];const fonts=new Map();
for(const p of PLAN){const f=await figma.getNodeByIdAsync(p.id);const old=f.findAllWithCriteria({types:['TEXT']});const zones=[];for(const z of p.zones){const template=await figma.getNodeByIdAsync(z.template);zones.push({...z,font:template.fontName,fills:JSON.parse(JSON.stringify(template.fills))});}for(const n of old)for(const seg of n.getStyledTextSegments(['fontName']))fonts.set(JSON.stringify(seg.fontName),seg.fontName);records.push({p,f,old,zones});}
await Promise.all([...fonts.values(),{family:'Be Vietnam Pro',style:'Regular'}].map(f=>figma.loadFontAsync(f)));
const probe=figma.createText();probe.textAutoResize='WIDTH_AND_HEIGHT';const probeId=probe.id;
function wrap(text,width,font,size){probe.fontName=font;probe.fontSize=size;probe.letterSpacing={unit:'PIXELS',value:0};const out=[];for(const explicit of text.split('\n')){if(!explicit){out.push('');continue;}let line='';for(const word of explicit.split(/\s+/)){const candidate=line?line+' '+word:word;probe.characters=candidate;if(probe.width>width-5&&line){out.push(line);line=word;}else line=candidate;}out.push(line);}return out;}
for(const {p,f,old,zones} of records){
 const safeOld=old.filter(n=>!(preserve[p.id]||[]).includes(n.id));
 // Retrying replaces only this localization’s own text groups.
 for(const oldGroup of f.children.filter(n=>n.type==='FRAME'&&n.name.startsWith('VIỆT HOÁ • '))){removed.push(oldGroup.id);oldGroup.remove();}
 for(const z of zones){
  let size=z.size,line=z.line,paragraphs,total;
  for(let attempt=0;attempt<35;attempt++){
   line=z.line*(size/z.size);paragraphs=z.texts.map(t=>wrap(t,z.w,z.font,size));
   total=paragraphs.reduce((h,p)=>h+p.length*line,0)+z.gap*(paragraphs.length-1);
   if(total<=z.h-3)break;
   size*=.975;
  }
  const rawHeight=paragraphs.reduce((h,p)=>h+p.length*line,0);
  const gap=paragraphs.length>1?Math.max(0,Math.min(z.gap*1.6,(z.h*z.fill-rawHeight)/(paragraphs.length-1))):0;
  total=rawHeight+gap*(paragraphs.length-1);
  const group=figma.createAutoLayout('VERTICAL',{name:'VIỆT HOÁ • '+z.name,itemSpacing:gap});f.appendChild(group);group.resize(z.w,Math.max(total,1));group.layoutSizingHorizontal='FIXED';group.layoutSizingVertical='HUG';group.fills=[];group.clipsContent=false;group.x=z.x;group.y=z.y+(z.center?Math.max(0,(z.h-total)/2):0);created.push(group.id);
  const textIds=[];
  for(let i=0;i<paragraphs.length;i++){
   const n=figma.createText();group.appendChild(n);n.fontName=z.font;n.fontSize=size;n.lineHeight={unit:'PIXELS',value:line};n.letterSpacing={unit:'PIXELS',value:0};n.resize(z.w,Math.max(20,paragraphs[i].length*line));n.characters=paragraphs[i].join('\n');n.textAutoResize='HEIGHT';n.textAlignHorizontal=z.align;n.fills=z.fills;n.name='CHỮ • '+z.texts[i].slice(0,65);n.layoutSizingHorizontal='FIXED';created.push(n.id);textIds.push(n.id);
  }
  evidence.push({frameId:f.id,zone:z.name,groupId:group.id,textIds,font:z.font,size,line,gap,x:group.x,y:group.y,w:group.width,h:group.height,maxH:z.h,expectedHeight:total,sourceParagraphs:z.texts.length});
 }
 for(const n of safeOld){removed.push(n.id);n.remove();}
 f.name=p.title;mutated.push(f.id);
}
probe.remove();
const board=await figma.getNodeByIdAsync('234:2');board.name='BỘ TÀI LIỆU • Việt Nam / An Linh – An Vân';mutated.push(board.id);
const guideText=await figma.getNodeByIdAsync('238:7');for(const s of guideText.getStyledTextSegments(['fontName']))await figma.loadFontAsync(s.fontName);guideText.characters='Nội dung: bản Việt Nam — nhóm An Linh, khách sạn An Vân ở Đà Lạt. Câu đố tiếng Anh được giữ theo bản Việt hoá.';guideText.textAutoResize='HEIGHT';mutated.push(guideText.id);
return {createdNodeIds:created,mutatedNodeIds:mutated,removedNodeIds:[...removed,probeId],evidence,documents:records.length};
