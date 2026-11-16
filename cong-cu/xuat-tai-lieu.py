from pathlib import Path
import json, shutil
from PIL import Image
from docx import Document
from docx.shared import Inches, Pt, Cm, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement
from docx.oxml.ns import qn

ROOT=Path('/Users/macbook/Documents/ChatGPT/casefree')
OUT=ROOT/'viet-hoa-viet-nam'
D=json.loads((OUT/'noi-dung.json').read_text())
URLS={
'who':'https://deadboltmysterysociety.com/wp-content/uploads/2025/05/The-Shadow-People-Who-are-the-shadow-people.html',
'what':'https://deadboltmysterysociety.com/wp-content/uploads/2025/05/The-Shadow-People-What-did-they-do.html',
'garage':'https://deadboltmysterysociety.com/wp-content/uploads/2025/05/The-Shadow-People-Parking-Garage.html',
'read':'https://deadboltmysterysociety.com/wp-content/uploads/2025/05/The-Shadow-People-What-do-you-read.html',
'end':'https://deadboltmysterysociety.com/wp-content/uploads/2025/05/The-Shadow-People-Soltion.html'}
# Machine-readable authoring copy and one editable text file per original document.
(OUT/'noi-dung.json').write_text(json.dumps(D,ensure_ascii=False,indent=2))
for d in D:
 lines=['# '+d['title'],'']
 for b in d['blocks']:
  if b[0]=='h':lines += ['## '+b[1],'']
  elif b[0] in ('p','english'):lines += [b[1],'']
  elif b[0]=='image':lines += [f"![{d['title']}](../hinh-giu-nguyen/{b[1]})",'']
  elif b[0]=='qr':lines += [f"![Mã QR](../hinh-giu-nguyen/qr-{b[1]}.png)",'',f"[Mở trang QR]({URLS[b[1]]})",'']
 (OUT/'tai-lieu'/f"{d['slug']}.md").write_text('\n'.join(lines))

# Editable Word compilation, with a page break between each original artifact.
doc=Document()
s=doc.sections[0]
s.page_width=Cm(21);s.page_height=Cm(29.7)
s.top_margin=Cm(1.8);s.bottom_margin=Cm(1.8);s.left_margin=Cm(2.1);s.right_margin=Cm(2.1)
normal=doc.styles['Normal'];normal.font.name='Arial';normal.font.size=Pt(11)
normal.paragraph_format.line_spacing=1.14
normal.paragraph_format.space_after=Pt(8)
for sty,size in [('Title',23),('Heading 1',18),('Heading 2',12)]:
 st=doc.styles[sty];st.font.name='Arial';st.font.size=Pt(size);st.font.color.rgb=RGBColor(0,0,0)
 st.paragraph_format.space_after=Pt(12 if sty!='Heading 2' else 5)
 st.paragraph_format.space_before=Pt(0 if sty!='Heading 2' else 8)
 st.paragraph_format.keep_with_next=True
# Remove the template title border.
for style in doc.styles:
 if style.type == 1 and style.element.pPr is not None:
  for border in list(style.element.pPr.findall(qn('w:pBdr'))):
   style.element.pPr.remove(border)
# English puzzle text remains editable and visually distinct, without adding hints.
st=doc.styles.add_style('Puzzle English',1)
st.base_style=normal;st.font.name='Courier New';st.font.size=Pt(10.5)
st.paragraph_format.space_before=Pt(4);st.paragraph_format.space_after=Pt(10)

def hyperlink(par,url):
 rel=par.part.relate_to(url,'http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink',is_external=True)
 link=OxmlElement('w:hyperlink');link.set(qn('r:id'),rel)
 run=OxmlElement('w:r');props=OxmlElement('w:rPr')
 color=OxmlElement('w:color');color.set(qn('w:val'),'333333');props.append(color)
 size=OxmlElement('w:sz');size.set(qn('w:val'),'18');props.append(size)
 run.append(props);t=OxmlElement('w:t');t.text='Mở trang QR';run.append(t);link.append(run);par._p.append(link)

for i,d in enumerate(D):
 if i:doc.add_page_break()
 doc.add_paragraph(d['title'],'Title' if i==0 else 'Heading 1')
 for b in d['blocks']:
  typ=b[0]
  if typ in ('p','english','h'):
   par=doc.add_paragraph(b[1],{'p':'Normal','english':'Puzzle English','h':'Heading 2'}[typ])
   par.paragraph_format.widow_control=True
  elif typ=='image':
   par=doc.add_paragraph();par.alignment=WD_ALIGN_PARAGRAPH.CENTER
   par.add_run().add_picture(str(OUT/'hinh-giu-nguyen'/b[1]),width=Inches(b[2]))
  elif typ=='qr':
   par=doc.add_paragraph();par.alignment=WD_ALIGN_PARAGRAPH.CENTER
   par.paragraph_format.space_after=Pt(2);par.paragraph_format.keep_with_next=True
   par.add_run().add_picture(str(OUT/'hinh-giu-nguyen'/f'qr-{b[1]}.png'),width=Inches(1.05 if d['slug']=='09-trung-tam' else 1.45))
   par=doc.add_paragraph();par.alignment=WD_ALIGN_PARAGRAPH.CENTER;par.paragraph_format.space_after=Pt(10);hyperlink(par,URLS[b[1]])
# Mark all puzzle English paragraphs as English, without changing their characters.
for par in doc.paragraphs:
 if par.style.name=='Puzzle English':
  for run in par.runs:
   lang=OxmlElement('w:lang');lang.set(qn('w:val'),'en-US');run._r.get_or_add_rPr().append(lang)
doc.core_properties.title='Những bóng người trên tầng 13'
doc.core_properties.subject='Bản chuyển thể tại khu tập thể An Vân'
doc.core_properties.author=''
doc.save(OUT/'Bong-Nguoi-Khu-Tap-The.docx')
print('Created',len(D),'documents and Word compilation')
