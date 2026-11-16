const p=await figma.getNodeByIdAsync('231:31');await figma.setCurrentPageAsync(p);
const b=await figma.getNodeByIdAsync('234:2');const texts=b.findAllWithCriteria({types:['TEXT']});
const unique=new Map();for(const n of texts){for(const seg of n.getStyledTextSegments(['fontName']))unique.set(JSON.stringify(seg.fontName),seg.fontName);}
await Promise.all([...unique.values()].map(f=>figma.loadFontAsync(f)));
const ids=[],evidence=[];const probe=figma.createText();const probeId=probe.id;
for(const n of texts){
 probe.fontName=n.fontName;probe.fontSize=n.fontSize;probe.textAutoResize='WIDTH_AND_HEIGHT';let max=0;
 for(const line of n.characters.split('\n')){probe.characters=line||' ';max=Math.max(max,probe.width);}
 if(max>n.width-4)n.fontSize=n.fontSize*(n.width-4)/max;
 if(n.id==='235:493')n.characters=n.characters.replace('\n1. So','\nl. So');
 n.textAutoResize='HEIGHT';
 ids.push(n.id);evidence.push({id:n.id,font:n.fontName,size:n.fontSize,w:n.width,h:n.height,lines:n.characters.split('\n').length,bottom:n.y+n.height,parentHeight:n.parent.height});
}
probe.remove();
// Restore the original flat paper silhouettes; printed page texture stays separate.
for(const [frameId,name] of [['235:69','Tờ giấy ghi tay'],['235:132','Giấy transcript']]){
 const f=await figma.getNodeByIdAsync(frameId);const shape=f.children.find(n=>n.name===name);if(shape){const v=shape.findAllWithCriteria({types:['VECTOR']})[0];if(v){v.vectorPaths=[{windingRule:'NONZERO',data:`M 0 0 L ${v.width} 0 L ${v.width} ${v.height} L 0 ${v.height} Z`}];ids.push(v.id);}}
}
for(const n of b.findAll(()=>true)){
 if(!('fills'in n)||!Array.isArray(n.fills))continue;
 if(['texture-orange','texture-wallpaper','texture-leather','texture-paper','texture-cream','texture-desk'].includes(n.name)){
  n.fills=n.fills.map(f=>f.type==='IMAGE'?{...f,scaleMode:'TILE',scalingFactor:1}:f);ids.push(n.id);
 }
}
return {mutatedNodeIds:ids,removedProbeIds:[probeId],textEvidence:evidence};
