"""Content and local-destination checks against the retrieved, approved sources."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit,unquote
import re,json,html
R=Path(__file__).parent
class Text(HTMLParser):
 def __init__(self): super().__init__();self.parts=[];self.skip=0
 def handle_starttag(self,tag,attrs):
  if tag in ('script','style'):self.skip+=1
  if tag=='article-header':
   a=dict(attrs);self.parts.extend([a.get('tags','').replace(',',' ·'),re.sub('<[^>]+>',' ',a.get('title',''))])
 def handle_endtag(self,tag):
  if tag in ('script','style'):self.skip-=1
 def handle_data(self,data):
  if not self.skip:self.parts.append(data)
def text(s):
 p=Text();p.feed(s);return ' '.join(' '.join(p.parts).split())
for slug in ['design-system-back-in-sync','soniq-design-system']:
 original=re.search(r'<article-layout\b[^>]*>(.*?)</article-layout>',(R/f'source/{slug}.html').read_text(),re.S)[1]
 built=re.search(r'<main id="main"[^>]*>(.*?)</main>',(R/f'{slug}.html').read_text(),re.S)[1]
 assert text(original)==text(built),f'Case copy mismatch: {slug}'
 print(f'PASS: complete published copy, {slug} ({len(text(original))} characters)')
original=re.search(r'<section id="ai-design-systems".*?</section>',(R/'source/home.html').read_text(),re.S)[0]
built=re.search(r'<section id="ai-design-systems".*?</section>',(R/'ai-design-systems.html').read_text(),re.S)[0]
assert text(original)==text(built),'AI copy mismatch'
print('PASS: AI essay, rules, emphasis text and links')
d=json.loads((R/'content/site.json').read_text());home=(R/'index.html').read_text();source=(R/'source/copy-handoff.md').read_text()
for item in d['questions']:
 assert html.escape(item['title'],quote=True) in home and all(html.escape(para,quote=True) in home for para in item['description'].split('\n\n'))
assert len(d['questions'])==4
for group in ['work','writing']:
 for item in d[group]:
  for key in ['title','description']:assert item[key] in source
home_text=re.sub(r'<[^>]+>','',home)
for p in d['about']:assert html.escape(p,quote=True) in home_text
assert 'Reworking this portfolio with AI' not in home
print('PASS: 4 approved questions, project/writing descriptions, and About paragraphs')
class Links(HTMLParser):
 def __init__(self):super().__init__();self.links=[];self.ids=set()
 def handle_starttag(self,t,attrs):
  a=dict(attrs)
  if 'id' in a:self.ids.add(a['id'])
  for key in ['href','src']:
   if key in a:self.links.append(a[key])
parsers={}
for f in R.glob('*.html'):
 p=Links();p.feed(f.read_text());parsers[f.name]=p
for name,p in parsers.items():
 for link in p.links:
  u=urlsplit(link)
  if u.scheme or u.netloc or not u.path and not u.fragment:continue
  path=unquote(u.path).lstrip('/') or name
  if path=='':path='index.html'
  if u.path=='/':path='index.html'
  target=R/path
  if not target.exists() and not target.suffix:target=target.with_suffix('.html')
  assert target.exists(),f'Missing local target {name}: {link}'
  if u.fragment and target.name in parsers:assert u.fragment in parsers[target.name].ids,f'Missing anchor: {name} {link}'
print('PASS: all local page, anchor, image, stylesheet and script destinations')
