"""Build the separate static portfolio. Python standard library only."""
from pathlib import Path
import json,re,html
R=Path(__file__).parent
D=json.loads((R/'content/site.json').read_text())
esc=lambda x:html.escape(str(x),quote=True)
SITE='https://ericamenin.com'
# Review copy stays out of search and answer engines: every page carries noindex until this is
# True. robots.txt and the sitemap are always the launch versions (as on the live site); noindex
# alone keeps the pages out of results, and crawlers have to be allowed in to read it.
LAUNCH=True
UPDATED='2026-10-08'
PAGES=[('/','1.0'),('/design-system-back-in-sync','0.9'),('/ai-design-systems','0.8'),('/soniq-design-system','0.5')]
def md(s):
 s=esc(s)
 s=re.sub(r'\[([^\]]+)\]\(([^)]+)\)',r'<a href="\2">\1</a>',s)
 return s

def email_copy(label='Copy my email'):
 return f'<span class="copy-control"><button type="button" class="email-copy" data-copy="erica@menin.me" data-cursor="Copy" aria-label="Copy my email address"><span>{esc(label)}</span><span class="copy-hint" aria-hidden="true">Copy</span></button><span class="copy-status" role="status"></span></span>'

def nav():
 return '<a class="skip-link" href="#main">Skip to content</a><header class="next-nav"><div class="frame nav-inner"><a class="wordmark" href="/" aria-label="Érica Menin, home">emenin<span class="identity-aside">It stands for Érica Menin, not the Eminem you thought ;)</span></a><button class="menu-toggle" aria-expanded="false" aria-controls="primary-nav">Menu <span aria-hidden="true">+</span></button><nav id="primary-nav" aria-label="Primary">'+''.join(f'<a href="/#{anchor}">{label}</a>' for anchor,label in [('work','Work'),('experiments','Experiments'),('writing','Writing'),('about','About'),('contact','Contact')])+'</nav></div></header>'

def terminal():
 responses=[]
 for cmd,x in D['terminal'].items():
  body=''
  for p in x['body'].split('\n\n'):
   if p.startswith('- '):body+='<ul>'+''.join('<li>'+md(l[2:])+'</li>' for l in p.splitlines())+'</ul>'
   else:body+='<p>'+md(p)+'</p>'
  if x['link']:
   if x['link'][0].startswith('mailto:'):body+=email_copy()
   else:body+=f'<a href="{esc(x["link"][0])}">{esc(x["link"][1])} ↗</a>' 
  if cmd=='contact':body=email_copy('erica@menin.me')+'<p><a href="https://www.linkedin.com/in/ericamenin/">Find me on LinkedIn</a></p>'
  responses.append(f'<template id="response-{cmd}">{body}</template>')
 return '''<button class="terminal-fab" data-terminal-open aria-label="Open portfolio terminal">&gt;_</button><dialog class="terminal-dialog" aria-labelledby="terminal-title"><div class="terminal-top"><h2 id="terminal-title">A few answers, via terminal</h2><button data-terminal-close aria-label="Close terminal">×</button></div><p class="terminal-intro">Type a command or choose one below.</p><form class="terminal-form"><label for="command-input">erica@portfolio:~$</label><input id="command-input" autocomplete="off" autocapitalize="none" spellcheck="false" placeholder="Type a command…" aria-label="Terminal command"><button type="submit" aria-label="Run command">↵</button></form><div class="terminal-output" role="status" aria-live="polite" hidden></div><div class="terminal-commands" aria-label="Available commands">'''+''.join(f'<button data-command="{cmd}"><span>{cmd}</span><span>{esc(x["label"])}</span></button>' for cmd,x in D['terminal'].items())+'''</div><div class="terminal-bottom"><button data-terminal-back hidden>Back to commands</button><span>↑ ↓ choose · Enter run · Esc close</span><button data-terminal-close>Close terminal</button></div></dialog>'''+''.join(responses)

def footer():
 return '<footer class="next-footer"><div class="frame"><p>My work, experiments, and writing <span class="footer-agents"><span class="footer-sep" aria-hidden="true">· </span>For AI agents: <a href="/llms.txt">llms.txt</a></span></p><div class="footer-contact">'+email_copy()+'<a href="https://www.linkedin.com/in/ericamenin/">Find me on LinkedIn</a></div></div></footer>'

def page(title,description,content,kind='',extra='',path='/',schema=(),noindex=False):
 legacy='<link rel="stylesheet" href="/css/case-study.css">' if kind else ''
 return f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>{esc(title)}</title><meta name="description" content="{esc(description)}">{'' if LAUNCH and not noindex else '<meta name="robots" content="noindex, nofollow">'}<link rel="canonical" href="{SITE}{path}"><meta property="og:url" content="{SITE}{path}"><meta property="og:title" content="{esc(title)}"><meta property="og:description" content="{esc(description)}"><meta name="twitter:title" content="{esc(title)}"><meta name="twitter:description" content="{esc(description)}"><meta property="og:type" content="website"><meta property="og:site_name" content="Érica Menin"><meta property="og:image" content="{SITE}/images/site/og-image.png"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="Érica Menin, Staff Design Systems Designer"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:image" content="{SITE}/images/site/og-image.png"><meta name="twitter:image:alt" content="Érica Menin, Staff Design Systems Designer">{''.join(json_ld(x) for x in schema)}<link rel="icon" href="/images/site/favicon.png"><link rel="apple-touch-icon" href="/images/site/apple-touch-icon.png"><meta name="theme-color" content="#14161f"><link rel="stylesheet" href="/css/tokens.css">{legacy}<link rel="stylesheet" href="/css/next.css"><script src="/js/next.js" defer></script><script src="/js/motion.js" defer></script>{extra}</head><body class="next-site {kind}">{nav()}{content}{footer()}{terminal()}<div class="read-cursor" aria-hidden="true"><span></span></div></body></html>'''

def json_ld(data):
 # Escape "<" so no string in the data can close the script element early.
 return '<script type="application/ld+json">'+json.dumps(data,ensure_ascii=False).replace('<','\\u003c')+'</script>'

PERSON={'@id':f'{SITE}/#erica'}
AUTHOR={'@type':'Person','@id':f'{SITE}/#erica','name':'Érica Menin','url':f'{SITE}/'}

def home_schema():
 role='Staff Design Systems Designer'
 graph={'@context':'https://schema.org','@graph':[
  {'@type':'Person','@id':f'{SITE}/#erica','name':'Érica Menin','url':f'{SITE}/','image':f'{SITE}/images/site/erica-menin.png','jobTitle':role,'hasOccupation':{'@type':'Occupation','name':role},
   'description':'Staff design systems designer with 15+ years in design, working on design systems for people and AI: component audits, Figma and code alignment, tokens, documentation, and the guidance agents need to use a system well.',
   'email':'mailto:erica@menin.me','homeLocation':{'@type':'Country','name':'Germany'},'nationality':{'@type':'Country','name':'Brazil'},
   'knowsAbout':['Design systems','Design system audits','Design tokens','Component libraries','Component contracts','Figma Variables','Figma libraries','Design system documentation','Design system migration','Design-engineering collaboration','Design systems for AI','Agent guidance (AGENTS.md)','Agentic design systems'],
   'sameAs':['https://www.linkedin.com/in/ericamenin/','https://designsystemsunfiltered.substack.com/']},
  {'@type':'WebSite','@id':f'{SITE}/#website','url':f'{SITE}/','name':'Érica Menin','publisher':PERSON,'inLanguage':'en'},
  {'@type':'ProfilePage','@id':f'{SITE}/#profilepage','url':f'{SITE}/','name':D['metadata']['Home']['title'],'isPartOf':{'@id':f'{SITE}/#website'},'mainEntity':PERSON,'inLanguage':'en'}]}
 # Every answer here is visible on the page, word for word.
 about=D['about']
 faq=[('Who is Érica Menin?',' '.join([about[0],about[1],about[3]])),
      *[(q['title'],q['description'].replace('\n\n',' ')) for q in D['questions']],
      ('Is Érica available for work?','I’m open to staff-level design systems roles and freelance projects. Based in Germany · Working remotely.'),
      ('What is Design Systems Unfiltered?',about[2]),
      ('How can I get in touch?','Email erica@menin.me or find me on LinkedIn.')]
 faq={'@context':'https://schema.org','@type':'FAQPage','mainEntity':[{'@type':'Question','name':q,'acceptedAnswer':{'@type':'Answer','text':a}} for q,a in faq]}
 blog={'@context':'https://schema.org','@type':'Blog','@id':'https://designsystemsunfiltered.substack.com/#blog','name':'Design Systems Unfiltered','url':'https://designsystemsunfiltered.substack.com/','author':PERSON,
  'blogPost':[{'@type':'BlogPosting','headline':w['title'],'url':w['href'],'datePublished':w['datePublished'],'description':w['description'],'author':PERSON} for w in D['writing']]}
 return graph,faq,blog

def article_schema(kind,path,headline,description,about):
 return ({'@context':'https://schema.org','@type':kind,'@id':f'{SITE}{path}','url':f'{SITE}{path}','headline':headline,'description':description,'about':about,'inLanguage':'en','image':f'{SITE}/images/site/og-image.png','author':AUTHOR},)

def project(x,i):
 images=['design-system-back-in-sync/cover.webp','soniq-design-system/01-cover.webp','maturing-a-design-system/cover.webp']
 return f'<article class="project-preview"><a href="{esc(x["href"])}" data-cursor="View"><p class="eyebrow">{esc(x["label"])}</p><div class="project-image"><img src="/images/{images[i]}" alt="" width="1200" height="680" loading="lazy"></div><h3>{esc(x["title"])}</h3><p>{esc(x["description"])}</p><span class="text-link">{esc(x["linkLabel"])} <span aria-hidden="true">↗</span></span></a></article>'

def question(x,i):
 open_=i==0
 return f'<article class="question-row{" open" if open_ else ""}"><h3><button class="question-trigger" aria-expanded="{str(open_).lower()}" aria-controls="question-{i}" id="question-label-{i}"><span>{esc(x["title"])}</span><span class="question-icon" aria-hidden="true">{"−" if open_ else "+"}</span></button></h3><div class="question-panel" id="question-{i}" role="region" aria-labelledby="question-label-{i}" aria-hidden="{str(not open_).lower()}"{"" if open_ else " inert"}><div>{"".join(f"<p>{esc(para)}</p>" for para in x["description"].split(chr(10)*2))}{question_link(x)}</div></div></article>'

def question_link(x):
 return f'<p class="question-link"><a class="text-link" href="{esc(x["href"])}">{esc(x["linkLabel"])} <span aria-hidden="true">↗</span></a></p>' if x.get('href') else ''

def about_copy(paragraphs):
 # The greeting doubles as the portrait trigger: hover, focus or tap shows the photo.
 lead='Hey, I’m Érica.'
 first,rest=paragraphs[0],paragraphs[1:]
 assert first.startswith(lead)
 name=f'<span class="name-reveal"><button class="about-reveal" aria-expanded="false" aria-controls="about-photo">{esc(lead)}</button><span id="about-photo" class="photo-reveal" aria-hidden="true"><img src="/images/site/erica-menin.webp" alt="Me" width="270" height="300" loading="lazy"></span></span>'
 unfiltered='<a href="https://designsystemsunfiltered.substack.com/">Design Systems Unfiltered</a>'
 return f'<p>{name}{md(first[len(lead):])}</p>'+''.join('<p>'+md(p).replace('Design Systems Unfiltered',unfiltered)+'</p>' for p in rest)

source=(R/'source/home.html').read_text()
thumbs=re.findall(r'<img\s+loading="lazy"\s+src="(https://substack[^\"]+)"',source)
writing=''.join(f'<a class="writing-row" data-cursor="View" href="{esc(x["href"])}"><img src="{esc(thumbs[i])}" alt="" width="96" height="96" loading="lazy"><div><h3>{esc(x["title"])}</h3><p>{esc(x["description"])}</p><span class="text-link">Read on Substack <span aria-hidden="true">↗</span></span></div></a>' for i,x in enumerate(D['writing']))
cross='<span class="crossout-wrap"><span class="crossout-word">polished</span><svg class="crossout-svg" viewBox="0 0 100 24" preserveAspectRatio="none" aria-hidden="true"><path class="crossout-path" d="M2,12 Q 50,15 98,10"/></svg></span> <em class="crossout-replacement">unfiltered</em>'
home=f'''<main id="main"><section class="next-hero"><div class="frame"><p class="eyebrow hero-identity">Érica Menin <span>Staff Design Systems Designer</span></p><h1>Design systems,<br><span>and what comes next.</span></h1><p class="hero-description">{esc(D['hero']['description'])}</p><div class="hero-actions"><a class="button primary" href="#experiments">What I’m exploring <span aria-hidden="true">↓</span></a><a class="button" href="#contact">Get in touch</a></div><div class="hero-bottom"><p class="eyebrow">Based in Germany · Working remotely</p></div></div></section>
<section id="work" tabindex="-1" class="next-section light-section"><div class="frame"><h2 class="section-label">Selected work</h2><p class="section-intro display-intro">{md(D['workIntro'])}</p><div class="project-grid">{''.join(project(D['work'][i],i) for i in [0,2])}</div><aside class="earlier-work"><p class="eyebrow">Earlier work · 2020–2023</p><a href="/soniq-design-system" data-cursor="View">soniq Design System <span aria-hidden="true">↗</span></a><p>{esc(D['work'][1]['description'])}</p></aside></div></section>
<section id="experiments" tabindex="-1" class="next-section"><div class="frame"><h2 class="section-label">What I’m exploring</h2><p class="section-intro display-intro">{esc(D['experimentsIntro'])}</p><p class="section-note">{esc(D['experimentsNote'])}</p><div class="question-list">{''.join(question(x,i) for i,x in enumerate(D['questions']))}</div><a class="related-page" href="/ai-design-systems"><span class="eyebrow">AI + Design Systems</span><span>A design system built only for people is easy for AI to <span class="keep-together">get wrong. <span aria-hidden="true">↗</span></span></span></a></div></section>
<section id="writing" tabindex="-1" class="next-section writing-section"><div class="frame"><h2 class="section-label">Writing</h2><p class="writing-intro">Writing {cross} about design systems and AI.</p><div class="writing-list">{writing}</div><a class="text-link" href="https://designsystemsunfiltered.substack.com/">More on Substack ↗</a></div></section>
<section id="about" tabindex="-1" class="next-section light-section"><div class="frame about-layout"><div><h2 class="section-label">A little about me</h2></div><div class="about-copy">{about_copy(D['about'])}</div></div></section>
<section id="contact" tabindex="-1" class="next-section"><div class="frame contact-layout"><div><h2 class="section-label">Let’s compare notes</h2><p class="display-intro">Have a design system that no longer quite agrees with itself? Let’s talk!</p><p>I’m open to staff-level design systems roles and freelance projects.</p><div class="contact-links">{email_copy("Email me")}<a href="https://www.linkedin.com/in/ericamenin/">Find me on LinkedIn ↗</a></div><p class="eyebrow">Based in Germany · Working remotely</p></div><div class="terminal-invite"><span class="terminal-symbol" aria-hidden="true">&gt;_</span><h2>A few answers, via terminal</h2><p>Type a command or choose one below.</p><button class="button" data-terminal-open aria-label="Open portfolio terminal">Open terminal ↗</button></div></div></section></main>'''
(R/'index.html').write_text(page(**D['metadata']['Home'],content=home,schema=home_schema(),extra='<script src="/js/crossout.js" defer></script>'))

def size_images(body):
 sizes=json.loads((R/'content/image-sizes.json').read_text())
 def image_tag(match):
  tag=match[0]; src=re.search(r'\bsrc="([^"]+)"',tag)
  if not src or src[1] not in sizes:return tag
  w,h=sizes[src[1]]
  tag=re.sub(r'\s(?:width|height)="[^"]*"','',tag)
  return tag.replace('<img',f'<img width="{w}" height="{h}"',1)
 return re.sub(r'<img\b[^>]*>',image_tag,body,flags=re.S)

# Preserve published article bodies and AI essay. Only presentation and local navigation change.
case_schema={
 'design-system-back-in-sync':('BlogPosting',['Design system audits','Cross-platform alignment','Figma Variables','Design tokens','Design system migration']),
 'soniq-design-system':('CreativeWork',['Design systems','Figma libraries','Component documentation'])}
for slug,meta in [('design-system-back-in-sync','Alignment case study'),('soniq-design-system','soniq case study')]:
 raw=(R/f'source/{slug}.html').read_text()
 body=re.search(r'<article-layout\b[^>]*>(.*?)</article-layout>',raw,re.S).group(1)
 def header(m):
  attrs=m[1]; title=html.unescape(re.search(r'title="([^"]+)"',attrs)[1]);tags=re.search(r'tags="([^"]+)"',attrs)[1].replace(',',' ·')
  return f'<div class="projectheader"><div class="taggroup"><div class="tag primary">{tags}</div></div><h1 class="projecttitle">{title}</h1><div class="textcontainer">{m[2]}</div></div>'
 body=re.sub(r'<article-header\b((?:"[^"]*"|[^">])*)>(.*?)</article-header>',header,body,flags=re.S)
 body=re.sub(r'<h2 class="projecttitle">(.*?)</h2>',r'<h1 class="projecttitle">\1</h1>',body,flags=re.S)
 # Keep source headings and all wording; promote section levels for a semantic outline.
 body=re.sub(r'<(/?)h3\b',r'<\1h2',body);body=re.sub(r'<(/?)h4\b',r'<\1h3',body)
 body=size_images(body)
 body=body.replace('https://ericamenin.com/','/').replace('index.html#','/#')
 (R/f'{slug}.html').write_text(page(**D['metadata'][meta],content='<main id="main" class="section project">'+body+'</main><div class="frame case-back"><a href="/#work">← Back to work</a></div>',kind='has-article-end case-study',path=f'/{slug}',schema=article_schema(case_schema[slug][0],f'/{slug}',D['metadata'][meta]['title'].split(' | ')[0],D['metadata'][meta]['description'],case_schema[slug][1]),extra='<script src="/js/gallery.js" defer></script>'))
ai=re.search(r'<section id="ai-design-systems".*?</section>',source,re.S)[0]
ai=ai.replace('<p class="spec-lede','<h1 class="spec-lede',1)
ai=ai.replace('</p>\n          <div class="spec-doc','</h1>\n          <div class="spec-doc',1)
ai=re.sub(r'<h2([^>]*)>AI \+ Design Systems</h2>',r'<p\1>AI + Design Systems</p>',ai)
(R/'ai-design-systems.html').write_text(page('AI + Design Systems | Érica Menin','A design system built only for people is easy for AI to get wrong.', '<main id="main" class="ai-page"><div class="frame back-home"><a href="/">← Back to home</a></div>'+ai+'</main>',kind='ai-page-body',path='/ai-design-systems',schema=article_schema('Article','/ai-design-systems','AI + Design Systems','A design system built only for people is easy for AI to get wrong.',['Design systems for AI','Design system documentation','Agent guidance']),extra='<script src="/js/ai-read.js" defer></script><script src="/js/crossout.js" defer></script>'))
AI_BOTS=['GPTBot','OAI-SearchBot','ChatGPT-User','ClaudeBot','Claude-SearchBot','PerplexityBot','Google-Extended','Applebot-Extended']
robots='# robots.txt for ericamenin.com\n# Public content is available for search engines and AI systems.\n# The goal is discoverability through search and answer engines.\n\nUser-agent: *\nAllow: /\n\n# AI / answer-engine crawlers\n'+''.join(f'User-agent: {bot}\nAllow: /\n\n' for bot in AI_BOTS)+f'Sitemap: {SITE}/sitemap.xml\n'
urls=''.join(f'\n  <url>\n    <loc>{SITE}{p}</loc>\n    <lastmod>{UPDATED}</lastmod>\n    <priority>{pr}</priority>\n  </url>\n' for p,pr in PAGES)
(R/'robots.txt').write_text(robots)
(R/'sitemap.xml').write_text(f'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n{urls}\n</urlset>\n')
# Netlify serves 404.html for any missing path.
(R/'404.html').write_text(page('Page not found | Érica Menin','This page doesn’t exist, or it moved.','<main id="main" class="next-section not-found"><div class="frame"><p class="section-label">404</p><h1 class="display-intro">This page doesn’t exist. Maybe it never did, maybe it moved with the redesign.</h1><div class="hero-actions"><a class="button primary" href="/">Back to the homepage</a><a class="button" href="/#writing">Read the writing</a></div></div></main>',path='/404',noindex=True))

# The Advent Calendar lives on Figma Sites; this page keeps ericamenin.com/design-system-calendar
# working and gives link previews their card before it forwards visitors.
CAL='https://design-system-calendar.figma.site/'
cal_title='The Design System Advent Calendar | Érica Menin'; cal_desc='A small insight for every day until Christmas.'
(R/'design-system-calendar.html').write_text(f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>{esc(cal_title)}</title><meta name="description" content="{esc(cal_desc)}">{'' if LAUNCH else '<meta name="robots" content="noindex, nofollow">'}<link rel="canonical" href="{SITE}/design-system-calendar"><meta property="og:type" content="website"><meta property="og:url" content="{SITE}/design-system-calendar"><meta property="og:title" content="{esc(cal_title)}"><meta property="og:description" content="{esc(cal_desc)}"><meta property="og:image" content="{SITE}/images/design-system-calendar/og-image.png"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="The Design System Advent Calendar cover illustration"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="{esc(cal_title)}"><meta name="twitter:description" content="{esc(cal_desc)}"><meta name="twitter:image" content="{SITE}/images/design-system-calendar/og-image.png"><link rel="icon" href="/images/site/favicon.png"><link rel="apple-touch-icon" href="/images/site/apple-touch-icon.png"><meta name="theme-color" content="#14161f"><meta http-equiv="refresh" content="2;url={CAL}"><link rel="stylesheet" href="/css/tokens.css"><link rel="stylesheet" href="/css/next.css"></head><body class="next-site"><main id="main" class="calendar-redirect"><div class="frame"><p class="eyebrow">Érica Menin</p><h1>The Design System Advent Calendar</h1><p>Taking you to the calendar… If nothing happens, <a class="text-link" href="{CAL}">open it here ↗</a>.</p><img src="/images/design-system-calendar/og-image.png" alt="The Design System Advent Calendar cover illustration" width="1200" height="630"></div></main></body></html>''')
print(f'Built homepage, two preserved case studies, AI + Design Systems, the calendar redirect and 404 ({"launch" if LAUNCH else "review, noindex"}).')
