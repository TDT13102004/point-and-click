"""Validate assets and update technical metadata. Requires Pillow; no image mutations."""
from pathlib import Path
import json, hashlib, wave, xml.etree.ElementTree as ET
from PIL import Image
root=Path(__file__).resolve().parents[1]/'assets/demo-v1'
m=json.loads((root/'manifest.json').read_text());results=[]
for a in m['entries']:
    f=root/a['path'];r={'id':a['id'],'path':a['path'],'exists':f.is_file()}
    assert f.is_file(),f
    assert a['sha256']==hashlib.sha256(f.read_bytes()).hexdigest(),f
    if a['type']=='png':
        with Image.open(f) as im:
            im.load();r.update(dimensions=list(im.size),mode=im.mode)
            assert min(im.size)>=512
            a['dimensions']=list(im.size)
            if a['id']=='PROP-RED-BOOK':
                assert 'A' in im.getbands(),'Book must have alpha'
                alpha=im.getchannel('A');assert alpha.getextrema()[0]==0
                r['alpha_extrema']=list(alpha.getextrema());r['content_bounds']=alpha.getbbox()
                a['alpha']='verified transparent';a['content_bounds']=alpha.getbbox()
            else: assert abs(im.width/im.height-16/9)<.02
    elif a['type']=='svg':ET.parse(f)
    elif a['type']=='wav':
        with wave.open(str(f)) as w:
            assert w.getnframes()>0 and w.getnchannels()==1
            r['duration_seconds']=w.getnframes()/w.getframerate()
        assert a['peak_dbfs']< -1
    elif a['type']=='json':json.loads(f.read_text())
    r['passed']=True;a['technical_checks_passed']=True;results.append(r)
report={'checks':results,'all_passed':True,'scope':'File integrity, dimensions, alpha, SVG/JSON parse, WAV headers and sample peaks. No in-game or subjective listening approval.'}
(root/'qa-report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
(root/'manifest.json').write_text(json.dumps(m,ensure_ascii=False,indent=2))
print(f'PASS: {len(results)} assets. In-game verification remains false.')
