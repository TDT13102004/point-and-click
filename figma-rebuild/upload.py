import json,urllib.request,pathlib,concurrent.futures
items=json.loads(pathlib.Path(__file__).with_name('uploads.json').read_text())
def upload(item):
 req=urllib.request.Request(item['url'],data=pathlib.Path(item['file']).read_bytes(),headers={'Content-Type':'image/png'},method='POST')
 with urllib.request.urlopen(req) as response:return json.loads(response.read())
with concurrent.futures.ThreadPoolExecutor(max_workers=8) as executor:
 results=list(executor.map(upload,items))
pathlib.Path(__file__).with_name('upload-results.json').write_text(json.dumps(results))
print('Uploaded',len(results),'discrete photo, QR and texture assets')
