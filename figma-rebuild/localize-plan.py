import json,pathlib
P=pathlib.Path(__file__).parent
docs=json.loads((P.parent/'viet-hoa-viet-nam/noi-dung.json').read_text())
D={d['slug']:d for d in docs}
plans=[]
def plan(id,slug):
 d=D[slug];p={'id':id,'title':d['title'],'slug':slug,'zones':[]};plans.append(p);return p,d['blocks']
def zone(p,name,template,x,y,w,h,texts,size,line,gap=12,align='LEFT',center=False,fill=.94):
 p['zones'].append(dict(name=name,template=template,x=x,y=y,w=w,h=h,texts=texts,size=size,line=line,gap=gap,align=align,center=center,fill=fill))
def prose(bs):return [b[1] for b in bs if b[0] in ['p','english']]
p,bs=plan('235:3','01-gioi-thieu')
zone(p,'Nội dung vụ án','235:6',50,65,514,845,prose(bs),16.6,25,15,fill=.96)
p,bs=plan('235:10','02-nhung-cai-chet')
zone(p,'Tiêu đề','235:13',45,28,596,45,[p['title'].upper()],30,40,0,'CENTER')
zone(p,'Chú thích hồ sơ','235:14',85,82,516,64,[bs[0][1]],13.4,18.5,0,'CENTER')
body=[]
for b in bs[1:]:
 if b[0]=='h':body.append(b[1]+': ')
 elif b[0]=='p':
  if body and body[-1].endswith(': '):body[-1]+=b[1]
  else:body.append(b[1])
zone(p,'Các hồ sơ tử vong','235:15',88,165,510,824,body,14.2,20.2,12,fill=.98)
p,bs=plan('235:19','03-loi-khai')
zone(p,'Tiêu đề','235:26',22,18,650,46,[p['title'].upper()],31,42,0)
for i,(y,h) in enumerate([(76,330),(431,246),(721,222)]):
 zone(p,'Lời khai '+bs[i*2][1],'235:27',198,y,465,h,[bs[i*2][1]+': '+bs[i*2+1][1]],16.4,23,0)
p,bs=plan('235:30','09-trung-tam')
zone(p,'Tiêu đề','235:56',170,67,530,62,[p['title'].upper()],50,62,0,'CENTER')
zone(p,'Mô tả bàn theo dõi','235:57',60,137,746,66,[bs[0][1]],14.2,20,0,'CENTER')
for template,x,y,w,h,txt in [('235:58',12,232,265,47,bs[1][1]),('235:59',309,241,270,36,bs[3][1]),('235:60',604,244,250,36,bs[5][1])]:
 zone(p,'Câu hỏi trên màn hình',template,x,y,w,h,[txt],13,16,0,'CENTER')
zone(p,'Hướng dẫn nhập đáp án','235:61',170,505,530,30,[bs[-1][1]],12.5,18,0,'CENTER')
p,bs=plan('235:63','08-linh-thi')
zone(p,'Linh thị và câu hỏi','235:67',43,108,380,332,[bs[0][1],bs[1][1]],17,27,20,'CENTER',True)
zone(p,'Hướng dẫn nhập đáp án','235:68',70,576,326,47,[bs[-1][1]],12.7,18,0,'CENTER')
p,bs=plan('235:69','04-chu-viet-tu-dong')
zone(p,'Tên người viết','235:74',20,28,391,43,['Chữ viết tự động của\nTrần Hữu Phước:'],15.5,20,0,'CENTER')
p,bs=plan('235:76','05-vet-khac')
zone(p,'Chú thích vết khắc','235:124',34,47,354,46,['Chữ viết và vết khắc trên\nvách thạch cao đã tháo ra:'],13.7,20,0,'CENTER')
p,bs=plan('235:125','06-graffiti')
p,bs=plan('235:132','07-phien-evp-dau')
zone(p,'Dẫn nhập phiên EVP','235:377',67,77,552,135,[bs[0][1]],15.2,21.5,0,'CENTER')
zone(p,'Bản chép hỏi đáp','235:378',78,237,550,759,prose(bs[1:]),15.2,21,13,fill=.96)
p,bs=plan('235:379','10-dung-cu')
zone(p,'Tiêu đề','235:382',55,40,504,52,['DỤNG CỤ ĐIỀU TRA'],37,49,0,'CENTER')
p,bs=plan('235:384','11-thanh-tay')
zone(p,'Hướng dẫn nhập đáp án','235:391',92,614,451,82,[bs[-1][1]],17.5,25,0,'CENTER')
p,bs=plan('235:392','14-phien-evp-thu-hai')
zone(p,'Phiên EVP thứ hai','235:396',122,130,719,1535,prose(bs),33,42,26,fill=.97)
p,bs=plan('235:414','12-sach-do')
zone(p,'Ghi chú mở đầu','235:428',161,579,640,182,[bs[1][1]],32,42,0,'CENTER')
zone(p,'Lời nhắn trong sách','235:429',158,790,646,505,[bs[2][1]],32,42,0,'CENTER')
p,bs=plan('235:432','13-gara')
zone(p,'Câu chuyện trong gara','235:483',112,130,738,650,prose(bs[:3]),32,39,28,fill=.98)
p,bs=plan('235:488','15-phong-1313')
zone(p,'Bức thư và diễn biến','235:492',99,86,615,1604,prose(bs),26,33,22,fill=.98)
p,bs=plan('235:494','16-ket-thuc')
zone(p,'Khép lại vụ án','235:498',112,124,739,1518,prose(bs),34,44,36,fill=.98)
(P/'localize-plan.json').write_text(json.dumps(plans,ensure_ascii=False,indent=2))
print('Prepared',len(plans),'documents;',sum(len(p['zones']) for p in plans),'layout zones')
