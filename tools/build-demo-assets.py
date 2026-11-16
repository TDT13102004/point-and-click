#!/usr/bin/env python3
"""Rebuild original demo SVGs, seeded synthesized WAVs and the asset catalog.
Does not regenerate or modify AI raster images. Python standard library only.
"""
from pathlib import Path
import json, math, random, struct, wave, hashlib
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'assets/demo-v1'
SR = 24000
entries = []

def register(id, path, kind, purpose, source='procedural-original', **extra):
    note=extra.pop('provenance_note',None)
    entries.append(dict(id=id, path=path, type=kind, purpose=purpose,
        status='demo-placeholder', version=1, source=source,
        provenance_note=note or ('Original deterministic project asset; no third-party media.'
            if source == 'procedural-original' else 'AI generated with built-in image_gen; reference provenance remains separate; no exclusive rights asserted.'),
        approval_status='awaiting-user-review', in_game_verified=False, **extra))

def svg(id, path, body, purpose, w=1600, h=900, **extra):
    f=OUT/path; f.parent.mkdir(parents=True, exist_ok=True)
    f.write_text(f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}"><title>{purpose}</title>{body}</svg>', encoding='utf-8')
    ET.parse(f)
    extra.setdefault('alpha','transparent unless drawn')
    register(id,path,'svg',purpose, dimensions=[w,h], technical_checks_passed=True, **extra)

# A fictional floor diagram, all apartment numbers represented, not a surveyed plan.
body='<rect width="1600" height="900" fill="#ded4b8"/><g fill="#292d28" font-family="Arial,sans-serif"><text x="80" y="85" font-size="32">AN LINH / KHỐI C — TẦNG 13</text><text x="80" y="125" font-size="19">Sơ đồ điều tra hư cấu • không theo tỷ lệ • bản demo v1</text></g>'
body+='<rect x="105" y="385" width="1350" height="130" fill="#b9b4a0" stroke="#454b43" stroke-width="4"/>'
important={1302,1305,1310,1313,1319}
for i,num in enumerate(range(1301,1320)):
    top=i<10; j=i if top else i-10
    x=115+j*132; y=210 if top else 515
    fill='#c5b17b' if num in important else '#e8e0cd'
    body+=f'<rect x="{x}" y="{y}" width="122" height="175" fill="{fill}" stroke="#454b43" stroke-width="3"/><text x="{x+61}" y="{y+90}" text-anchor="middle" font-family="Arial" font-size="25" fill="#292d28">{num}</text>'
    door_y=385 if top else 515
    body+=f'<path d="M{x+42},{door_y} h38" stroke="#ded4b8" stroke-width="7"/>'
body+='<rect x="1303" y="515" width="142" height="175" fill="#9da796" stroke="#454b43" stroke-width="3"/><path d="M1320 550 h105 m-105 18 h105 m-105 18 h105 m-105 18 h105 m-105 18 h105" stroke="#454b43" stroke-width="3"/><text x="1374" y="665" text-anchor="middle" font-family="Arial" font-size="16">Cầu thang</text>'
body+='<path d="M1370 730 V700" stroke="#474e43" stroke-width="4"/><text x="1080" y="760" font-family="Arial" font-size="20" fill="#292d28">Từ bàn theo dõi tầng 12 ↑</text>'
for x,label in [(130,'CAM A →'),(1290,'← CAM B')]:
    body+=f'<circle cx="{x}" cy="450" r="10" fill="#475e63"/><text x="{x-20}" y="490" font-family="Arial" font-size="16" fill="#253e43">{label}</text>'
body+='<text x="80" y="830" font-family="Arial" font-size="19" fill="#292d28">Ô vàng: căn liên quan hồ sơ • Camera: thiết bị tạm của An Linh • Mặt bằng cần chốt lại trước bản chính thức</text>'
svg('MAP-F13','maps/map-floor13-v1.svg',body,'Sơ đồ tầng 13 hư cấu',alpha='opaque')

# Positionable transparent original overlays. Coordinates use a 1600×900 stage.
ghost='<defs><filter id="soft"><feGaussianBlur stdDeviation="5"/></filter><linearGradient id="shade" x2="0" y2="1"><stop stop-color="#101615" stop-opacity=".92"/><stop offset="1" stop-color="#101615" stop-opacity=".18"/></linearGradient></defs><g filter="url(#soft)" fill="url(#shade)"><ellipse cx="800" cy="230" rx="58" ry="72"/><path d="M754 295 Q700 325 700 450 L675 680 Q800 735 925 680 L900 450 Q900 325 846 295Z"/></g>'
svg('OV-SHADOW','overlays/ov-shadow-v1.svg',ghost,'Bóng người mờ, cần đặt theo tọa độ cửa', integration='Render in a positioned container inside doorway; never stretch to cover entire scene.', default_opacity=0.55)
svg('OV-VIGNETTE','overlays/ov-vignette-v1.svg','<defs><radialGradient id="v"><stop offset=".4" stop-color="#06100e" stop-opacity="0"/><stop offset="1" stop-color="#06100e" stop-opacity=".72"/></radialGradient></defs><rect width="1600" height="900" fill="url(#v)"/>','Viền tối tăng căng thẳng', default_opacity=0.4)
scan=''.join(f'<path d="M0 {y}H1600" stroke="#10221d" stroke-opacity=".16" stroke-width="1"/>' for y in range(0,900,5))
svg('OV-CCTV','overlays/ov-cctv-v1.svg',scan,'Lớp dòng quét camera nhẹ', integration='Optional static overlay; no flashing. UI and timestamps must be code-native.')

def wav(id,name,seconds,fn,purpose,loop=False,cues=None):
    rng=random.Random(1305+sum(map(ord,name)))
    samples=[]
    for i in range(round(seconds*SR)):
        t=i/SR
        v=fn(t,rng)
        # Edge fade for preview; loop clips use periodic synthesis instead.
        if not loop: v*=min(1,t/.025,max(0,(seconds-t)/.06))
        samples.append(max(-.65,min(.65,v)))
    data=b''.join(struct.pack('<h',round(v*32767)) for v in samples)
    f=OUT/'audio'/name
    with wave.open(str(f),'wb') as w:
        w.setnchannels(1);w.setsampwidth(2);w.setframerate(SR);w.writeframes(data)
    peak=max(abs(v) for v in samples)
    rms=math.sqrt(sum(v*v for v in samples)/len(samples))
    register(id,'audio/'+name,'wav',purpose, duration_seconds=seconds,sample_rate=SR,channels=1,
        loop=loop,bus='Ambience' if loop else 'SFX',peak_dbfs=round(20*math.log10(max(peak,1e-9)),2),rms_dbfs=round(20*math.log10(max(rms,1e-9)),2),technical_checks_passed=peak<.99,
        listening_review='not yet auditioned in game; synthesized placeholders, not field recordings',cues=cues or [])

wav('AMB-ROOM','amb-room-tone-v1.wav',12,lambda t,r:.017*math.sin(2*math.pi*50*t)+.007*math.sin(2*math.pi*100*t)+.003*math.sin(2*math.pi*173*t),'Điện và nền phòng, tổng hợp tuần hoàn',True)
wav('SFX-STATIC','sfx-recorder-static-v1.wav',4,lambda t,r:(r.random()*2-1)*.065*(.65+.35*math.sin(2*math.pi*.7*t)),'Nhiễu máy ghi âm tạm')
knocks=[.35,.9,1.45]
def knock(t,r):
    return sum((.25*math.exp(-32*(t-a))*(math.sin(2*math.pi*155*(t-a))+.3*math.sin(2*math.pi*371*(t-a)))) if 0<=t-a<.25 else 0 for a in knocks)
wav('SFX-KNOCK','sfx-three-knocks-v1.wav',2.2,knock,'Ba tiếng gõ sau vách',cues=knocks)
wav('SFX-CREAK','sfx-door-creak-v1.wav',1.6,lambda t,r:.065*math.sin(2*math.pi*(180*t+20*math.sin(t*9)))*math.sin(math.pi*t/1.6)**2+.014*(r.random()*2-1)*math.sin(math.pi*t/1.6)**2,'Tiếng cửa cũ, hiệu ứng tổng hợp')
wav('SFX-PAPER','sfx-paper-v1.wav',.8,lambda t,r:.05*(r.random()*2-1)*(math.sin(math.pi*t/.8)**2)*(.5+.5*math.sin(2*math.pi*21*t)**2),'Tiếng giấy tạm, không phải bản thu thực')
wav('SFX-CLICK','sfx-ui-click-v1.wav',.15,lambda t,r:.09*math.exp(-55*t)*math.sin(2*math.pi*850*t),'Nút máy ghi âm',False)

dry=OUT/'source/evp-linh-dry-v1.wav'
if dry.exists():
    with wave.open(str(dry),'rb') as w:
        assert w.getframerate()==SR and w.getnchannels()==1 and w.getsampwidth()==2
        raw=w.readframes(w.getnframes())
    voice=[v[0]/32768 for v in struct.iter_unpack('<h',raw)]
    filtered=[];low=0;slow=0
    for value in voice:
        low+=.32*(value-low);slow+=.035*(value-slow);filtered.append(low-slow)
    def evp(t,r):
        i=round((t-1)*SR)
        v=filtered[i] if 0<=i<len(filtered) else 0
        j=i-round(.18*SR)
        echo=filtered[j] if 0<=j<len(filtered) else 0
        return .7*v+.2*echo+.018*(r.random()*2-1)
    wav('VOICE-EVP','voice-evp-placeholder-v1.wav',len(voice)/SR+2,evp,'Giọng EVP tiếng Việt tổng hợp tạm; không phải manh mối hoàn chỉnh')
    entries[-1].update(bus='Voice',source='local-system-tts-plus-procedural-effects',
        provenance_note='macOS local voice Linh vi_VN via say; not a real actor or cloned person. Platform voice terms not assessed for commercial distribution; replace with cleared recording before release.',
        transcript='Đừng nhìn phía sau. Cuốn sách. Trong vách.',
        recreate="say -v Linh -r 100 -o assets/demo-v1/source/evp-linh-v1.aiff 'Đừng nhìn phía sau. Cuốn sách. Trong vách.'; then afconvert to mono 24kHz PCM and rebuild pack")

icons={
 'folder':'<path d="M12 24h24l8 9h40v43H12Z"/>',
 'camera':'<rect x="12" y="25" width="52" height="43" rx="5"/><path d="m64 38 20-9v35L64 55Z"/>',
 'recorder':'<rect x="28" y="10" width="40" height="76" rx="7"/><circle cx="48" cy="30" r="10"/><path d="M36 54h24m-24 9h24m-24 9h14"/>',
 'notes':'<rect x="20" y="12" width="58" height="72" rx="3"/><path d="M32 30h33M32 43h33M32 56h33M32 69h20"/>',
 'book':'<path d="M22 16h52v64H22q-8 0-8-8V24q0-8 8-8Zm0 0v64M23 70h51"/>'}
for name,path in icons.items():
    svg('ICON-'+name.upper(),'icons/icon-'+name+'-v1.svg','<g fill="none" stroke="#cfc49f" stroke-width="4" stroke-linejoin="round" stroke-linecap="round">'+path+'</g>','Biểu tượng '+name,w=96,h=96)

docs={
 'notice':{'id':'DOC-NOTICE','title':'Ghi chú bàn giao chìa khóa','body':'An Linh kiểm tra căn 1305 theo sự thu xếp của tổ quản lý. Giữ lại hiện trạng đồ đạc, chụp ảnh trước khi di chuyển. Căn hộ đã bỏ trống nhiều năm.','source':'New demo-only connective text; not a historic document.'},
 'book_note':{'id':'DOC-BOOK-NOTE','title':'Mảnh giấy trong sách đỏ','body':'Chúng tôi thuê lại căn hộ này qua một người quen để có chỗ gặp nhau. Tôi đã nghĩ ở ngay tầng này sẽ dễ che giấu mọi chuyện hơn. Nếu có ai tìm thấy cuốn sách, xin đừng coi những gì viết trong đó là một trò đùa.','source':'Demo adaptation from viet-hoa-viet-nam/tai-lieu/12-sach-do.md; shortened and newly worded, next garage clue intentionally omitted.'},
 'evp':{'id':'DOC-EVP','title':'Phiên EVP — bản chép tạm','body':'[Nhiễu] Đừng nhìn phía sau. Cuốn sách. Trong vách. [Nhiễu]','source':'New demo placeholder; NOT a Vietnamese translation of the original English word puzzle.', 'voice_status':'local synthesized Vietnamese voice, not an actor recording','puzzle_status':'not finalized; no coded room number or complete solve chain is claimed'}}
(OUT/'documents/demo-documents.json').write_text(json.dumps(docs,ensure_ascii=False,indent=2),encoding='utf-8')
register('DOCS-DEMO','documents/demo-documents.json','json','Nội dung kết nối và bản chép EVP tạm',technical_checks_passed=True,source='authored-demo-text',provenance_note='New and adapted demo prose; original story files preserved.')

# Raster outputs are registered when copied into the expected names.
rasters=[
 ('BG-1305','backgrounds/bg-1305-v1.png','Phòng sinh hoạt căn 1305','room'),
 ('BG-CORRIDOR','backgrounds/bg-corridor-v1.png','Hành lang camera tầng 13','corridor'),
 ('BG-STATION','backgrounds/bg-station-v1.png','Bàn theo dõi tầng 12','station'),
 ('CL-HATCH-CLOSED','closeups/cl-hatch-closed-v1.png','Ô kỹ thuật đóng','hatch'),
 ('CL-HATCH-OPEN','closeups/cl-hatch-open-v1.png','Ô kỹ thuật mở có sách','hatch_open'),
 ('CL-HATCH-EMPTY','closeups/cl-hatch-empty-v1.png','Ô kỹ thuật sau khi lấy sách','hatch_empty'),
 ('PROP-RED-BOOK','props/prop-red-book-v1.png','Sách đỏ, vật phẩm kiểm tra','book')]
for id,path,purpose,key in rasters:
    f=OUT/path
    if f.exists():
        raw=f.read_bytes(); width,height=struct.unpack('>II',raw[16:24])
        register(id,path,'png',purpose,source='ai-generated-image_gen',dimensions=[width,height],prompt_key=key,prompt_file='prompts/all-prompts.json',technical_checks_passed=False,reference='references/images/can-1305-noi-that-reference.png' if key in ['room','corridor','station'] else 'See prompt input chain',collision='none; hotspots separate')

for entry in entries:
    f=OUT/entry['path'];entry['sha256']=hashlib.sha256(f.read_bytes()).hexdigest();entry['bytes']=f.stat().st_size

(OUT/'manifest.json').write_text(json.dumps(dict(schema_version=1,pack='an-linh-demo-v1',created='2026-11-16',entries=entries),ensure_ascii=False,indent=2),encoding='utf-8')
print(f'Built catalog for {len(entries)} assets. Raster validation separate. No AI raster overwritten.')
