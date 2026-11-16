import json, statistics, pathlib
P=pathlib.Path(__file__).parent
docs=json.loads((P/'ocr.json').read_text())
spec=[]
def doc(index,name,bg):
 d=docs[index];s=dict(file=d['file'],name=name,w=d['w'],h=d['h'],bg=bg,texts=[],assets=[]);spec.append(s);return s
def t(s,text,x,y,w,size=16,line=22,font='IBM Plex Mono',style='Bold',align='LEFT',color='#10131c'):
 s['texts'].append(dict(text=text,x=x,y=y,w=w,size=size,line=line,font=font,style=style,align=align,color=color))
s=doc(1,'01 • Investigation brief','blue')
t(s,"You are the owner and founder of the\nparanormal investigation service, GhostRid.\nPeople hire you to determine the cause and\nsource of their haunting and get rid of it.\nThis typically involves learning as much as\nyou can about the location and the person or\npeople who died there. This is the most recent\njob for which you’ve been hired.",50,60,514,16.6,25.5,align='CENTER')
t(s,"Ever since workers began renovations on the 13th\nfloor of the Augustine Hotel, numerous reports have\ncome in about sightings of strange shadow people.\nAre these sightings merely tricks of the light or\nhas all the recent construction awakened something\notherworldly? Grab your EMF meter, head on up to\nthe 13th floor, and investigate to find out the\ntrue answer to this paranormal mystery.",49,289,525,16.2,27.5)
t(s,'As is the case with every investigation you\nperform, you should do the following:',49,540,520,16.4,28)
t(s,'1.Read the reports about any deaths that occurred\n  on the 13ᵗʰ floor throughout the location’s\n  history.\n2.Examine the interviews with the workers who\n  have seen the shadow people.\n3.Use the various tools in your paranormal\n  investigation kit to rule out certain spirits.\n4.Cleanse the location of the spirits that need\n  help moving on and collect your fee from the\n  Augustine Hotel.',62,622,516,16,28)
s=doc(0,'02 • Deaths on the 13th floor','paper')
t(s,'DEATHS ON THE 13ᵀᴴ FLOOR',95,29,500,30,40,'Oswald','Regular','CENTER')
t(s,'*These deaths have been independently confirmed\nvia public records and via psychic.',94,77,508,14.9,18.5,align='CENTER')
t(s,'John and Mary Collins: Devoted husband and wife who\ncommitted suicide together in room 1310 back in 2002\nafter finding out that Mary had terminal brain\ncancer and was only expected to live a few more\nweeks. They had been together since high school and\nwere unwilling to go on without each other. They\neach took half a bottle of sleeping pills, downed a\nfifth of whiskey, and died in an eternal embrace.',101,130,505,14.7,20.7)
t(s,'Fargo Pepper: A local musician known best as the\nfrontman for the band, Zombified Zeus, who was prone\nto massive weekend partying in room 1319. On the\nweekend he died in 2018, sources say Fargo did a\nplethora of drugs including angel dust, meth,\nmushrooms, and cocaine. The coroner ruled the death\nas accidental since it was well known that Fargo\nPepper was a hard partyer and a lover of life.',101,315,505,14.7,20.7)
t(s,'Brotherhood of the Stars: A doomsday cult who formed\na pact to end it all in anticipation of the arrival\nof the Mother Ship which would take them all to the\n9ᵗʰ Heaven on December 25, 2018. There were five\nmembers in all. Yet, strangely, none of them died as\nthe result of suicide. Instead, the group’s leader,\nBaron Vance, murdered the other four members of the\ncult in a blind rage after he discovered that\nGoddess Athena, a female member of the group with\nwhom he was in love, had actually fallen for Brother\nAnott who was also a member of the group. Grief\nstricken and inconsolable, Baron shot everyone in\nroom 1302 and then shot himself. Or at least that is\nwhat police think. Goddess Athena’s body was never\nfound. Investigators assume that Athena was dead.\nHowever, there hasn’t been any concrete proof to\nsubstantiate that claim.',101,499,505,14.5,20.7)
t(s,'Members of the group included:\n 1.Baron Vance\n 2.Goddess Athena\n 3.Brother Anott\n 4.Brother Paul\n 5.Brother Black',100,872,505,14.7,20.7)
s=doc(4,'03 • Witness sightings','navy')
t(s,'SIGHTINGS ON THE 13ᵀᴴ FLOOR',22,20,650,34,44,'Oswald','Regular',color='#f0edf5')
t(s,'Trey Garza: ‘Look, I don’t believe in this\nstuff at all. But, I know what I saw. There\nwere two of them. They were people that looked\nlike shadows. They were darting back and forth\nacross the hall, going from room to room. It\nwas impossible to tell whether they were male\nor female. But, they had definite human\ncharacteristics. And yes, I’m sure it wasn’t\nsomebody playing a prank. We’ve been doing work\non the 13ᵗʰ floor for about three weeks now,\nand I haven’t seen anything like this until we\nstarted tearing into the sheetrock. Do you\nthink we are disturbing them? I did find\nsomething weird written on the sheetrock we\ntore out. See what you think.’',198,70,465,14.8,22.4,color='#e8e5ef')
t(s,'Alfonzo Smith: ‘This place is haunted. No\ndoubt. My grandmother used to tell me stories\nabout what happens when a spirit can’t rest.\nIt roams and seeks peace without ever finding\nit. She was a psychic, and I believe she passed\nsome of her psychic gifts along to me as well.\nWhen we first started seeing the shadow people,\nI did some automatic writing which is where you\nlet the spirit guide your hand and use you to\npen their own message. The results I got were\ninteresting to say the least.’',198,429,465,14.8,22.4,color='#e8e5ef')
t(s,'Franklin Archer: ‘I don’t know how to answer\nthis specifically. I haven’t seen the shadow\npeople personally, but I know people who have.\nAnd I trust those people. What I do know is\nthat I was hired as a painter, and I paint. I\nspent an entire day painting only to come back\nto the next day and find some sort of graffiti\npainted over what I had done. Not happy! If it\nis shadow people, they need to mind their own\nbusiness and leave the living alone.’',198,719,465,14.8,22.4,color='#e8e5ef')
s['assets']=[['portrait-trey',23,78,163,215],['portrait-alfonzo',24,457,163,216],['portrait-franklin',25,724,163,218]]
s=doc(2,'04 • Command center','command')
t(s,'COMMAND CENTER',170,70,530,50,64,'Oswald','Medium','CENTER')
t(s,'In some paranormal investigations, cameras are set up in various places\nto monitor activity in the location. This place is usually referred to as\na command center/nerve center.',60,131,746,14.3,21,align='CENTER')
t(s,'WHAT ARE THE FIRST NAMES\nOF THE SHADOW PEOPLE IN\nALPHABETICAL ORDER?',12,229,265,13,16.5,align='CENTER')
t(s,'WHAT DID THE SHADOW\nPEOPLE DO?',309,239,270,13.5,18,align='CENTER')
t(s,'SEARCH THE\nPARKING GARAGE',604,242,260,13.5,18,align='CENTER')
t(s,'(no caps, no spaces)',290,502,300,12.5,18,align='CENTER')
s['assets']=[['qr-who',85,282,103,103],['qr-what',390,279,104,104],['qr-garage',687,281,104,104]]
s=doc(3,'05 • Clairvoyant vision','blue')
t(s,'One of the things that got you\ninterested in the paranormal in\nthe first place was a gift of\nclairvoyance that you’ve always\nseemed to have. In the middle\nof your investigation, you get\na vision that there is\nsomething you are supposed to\nread. But what is it and what\nroom number on the 13ᵗʰ floor\nshould you search (spell out)?',44,120,380,17.5,29.8,align='CENTER')
t(s,'(no caps, no spaces)',120,576,230,12.3,18,align='CENTER')
s['assets']=[['qr-read',174,459,111,111]]
s=doc(5,'06 • Automatic writing','writing')
t(s,'Alfonzo Smith’s automatic writing:',25,45,395,16,21,color='#e6e0ee')
t(s,'scratches on wall\nthird is first\nfirst is second\nsecond is third\na joke on my name',38,97,377,45,62,'Caveat','Bold','CENTER')
s=doc(6,'07 • Scratched sheetrock','paper')
t(s,'Found written/scratched on torn\nout sheetrock:',38,51,350,13.8,20,align='CENTER')
s=doc(7,'08 • Graffiti cipher','wallpaper')
t(s,'xF BSFOu\nNBSSJFE\ncVu BSF IF\nBOETIF',36,44,365,62,81,'Caveat Brush','Regular','CENTER')
s=doc(8,'09 • EVP transcript','evp')
t(s,'Upon spending a night on the 13ᵗʰ floor, you spot the elusive\nshadow figures on more than one occasion. You are fairly\ncertain there are at least two of them. You decide to do a\ncall and response EVP session in hopes one or both of them\nwill communicate. This is the transcript of the result:',70,82,560,15.5,23,'IBM Plex Mono','Regular','CENTER')
t(s,'You: Hi, if you’re one of the shadow people. I want to\ntalk. If you can speak my audio recorder may catch it.\nI mean you no harm.\n\n*hissing sounds*\n\nYou: Can you make a sign? Can you make a noise of some\nsort?\n\n*loud bang*\n\nYou: Thank you for that. I want to know more about you.\nHow did you die?\n\n*hissing sounds*\n\nYou: Ok, can you tell me your name instead? Or tell me\nsomething about you?\n\n...mistake...\n\nYou: You made a mistake? Is that what you are trying to\ntell me.\n\n...there brad cloth believer fixed hobo cook sin wifi\nalive...\n\nYou: Can you explain what you mean by that?\n\n*hissing sounds*\n\nYou: Please keep talking.\n\n*hissing sounds*\n\nYou: Help me out here?\n\n...yz is your guide...',80,216,560,15.2,20.3,'IBM Plex Mono','Regular')
s=doc(9,'10 • Paranormal tools','orange')
t(s,'PARANORMAL TOOLS',80,42,455,37,49,'Oswald','Regular','CENTER')
t(s,'a. crucifix\nb. holy water\nc. digital voice recorder\nd. EMF meter\nd. ovilus\ne. laser grid\nf. motion sensor\ng. blood\nh. pendulum\ni. ouija board\nj. dowsing rods\nk. prayer book\nl. rosary\nm. salt\nn. sage\no. Palo santo\np. smoky quartz\nq. candles\nr. incense\ns. bell\nt. sigils\nu. heat camera\nv. digital camera\nw. Polaroid camera\nx. night vision\ny. spirit box\nz. Trifield meter',80,97,455,20.3,28.5,align='CENTER',color='#382116')
s=doc(10,'11 • Cleansing question','hallway')
t(s,'WHAT DO YOU\nUSE TO CLEANSE\nTHE 13ᵀᴴ FLOOR?',100,280,440,39.5,57,'IBM Plex Mono','Bold','CENTER')
t(s,'(in order,\nno caps, no spaces)',145,607,345,20.5,26,align='CENTER',color='#eee5ed')
s['assets']=[['qr-end',245,458,140,140]]
# Keep the web cards’ paragraph boundaries and original line breaks.
for index,name in [(15,'12 • Who are the shadow people'),(14,'13 • Incantations book'),(11,'14 • Parking garage'),(13,'15 • What did they do'),(12,'16 • Solution')]:
 s=doc(index,name,'webbook' if index==14 else 'web')
 lines=docs[index]['lines']
 if index==11:lines=[l for l in lines if l['y']<810]
 if index==14:lines=[l for l in lines if l['y']>500]
 groups=[]
 for l in lines:
  if not groups or l['y']-groups[-1][-1]['y']>(55 if index in [14,12] else 49):groups.append([])
  groups[-1].append(l)
 for group in groups:
  txt='\n'.join(l['text'] for l in group)
  txt=txt.replace('13"','13ᵗʰ').replace('13th','13ᵗʰ').replace('13t floor','13ᵗʰ floor').replace('If thepresence','If the presence')
  if index==15:txt=txt.replace('*er...ay...and..you..king..kin...greed"','*er...ay...and...you...king...kin...greed”')
  x= min(l['x'] for l in group)-2; y=group[0]['y']-5
  gap=statistics.median([b['y']-a['y'] for a,b in zip(group,group[1:])]) if len(group)>1 else 36
  if index==14:x=168;w=630;align='CENTER';size=32
  else:w=(715 if index==15 else 750 if index in [11,12] else 620);align='LEFT';size=(32 if index==15 else 34 if index==12 else 31.5 if index==11 else 27.7)
  t(s,txt,x,y,w,size,gap,'Cormorant Garamond','Bold',align,'#0d0b09' if index==14 else '#ffffff')
 if index==14:t(s,'INCANTATIONS',247,307,575,98,120,'Oswald','Medium','CENTER','#613314')
 if index==11:
  t(s,'1. Summer One Day\n2. So, Me and You...',372,1110,220,24,36,'Oswald','Light','CENTER','#160e03')
  t(s,'3. Thinking\n4. King Greed',372,1238,220,24,36,'Oswald','Light','CENTER','#160e03')
(P/'spec.json').write_text(json.dumps(spec,ensure_ascii=False,indent=2))
print('Prepared',len(spec),'documents and',sum(len(s['texts']) for s in spec),'editable text blocks')
