'use strict';
const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];
const menu = $('.menu-toggle');
const navigation = $('#primary-nav');
function closeMenu() { navigation.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); }
menu.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded', String(open)); navigation.classList.toggle('open', open); });
$$('a', navigation).forEach(a => a.addEventListener('click', closeMenu));
document.addEventListener('keydown', e => { if (e.key === 'Escape' && navigation.classList.contains('open')) { closeMenu(); menu.focus(); } });
function setQuestion(button, open) {
  button.setAttribute('aria-expanded', String(open));
  button.closest('.question-row').classList.toggle('open', open);
  $('#' + button.getAttribute('aria-controls')).inert = !open;
  $('#' + button.getAttribute('aria-controls')).setAttribute('aria-hidden', String(!open));
  $('.question-icon', button).textContent = open ? '−' : '+';
}
// Accordion: opening one answer closes the others.
const questionTriggers = $$('.question-trigger');
questionTriggers.forEach(button => button.addEventListener('click', () => {
  const open = button.getAttribute('aria-expanded') !== 'true';
  if (open) questionTriggers.forEach(other => { if (other !== button) setQuestion(other, false); });
  setQuestion(button, open);
}));
// Inspect follows the actual hero element, without inserting a layout panel.
const inspect = $('#inspect-toggle');
if (inspect) {
 const layer = $('#inspection'), outline = $('.inspect-outline'), tip = $('.inspect-tooltip');
 const hero = $('.next-hero');
 const targets = $$('.hero-identity,.hero-identity span,h1,h1 span,.hero-description,.hero-actions a,.hero-bottom p', hero);
 let active = false, selected = null;
 function tokenChain(name) {
  const declarations = new Map();
  function read(rules) {
   for(const rule of rules) {
    if(rule.type === CSSRule.MEDIA_RULE) { if(matchMedia(rule.conditionText).matches) read(rule.cssRules); }
    else if(rule.selectorText === ':root') {
     for(const property of rule.style) if(property.startsWith('--')) declarations.set(property,rule.style.getPropertyValue(property).trim());
    }
   }
  }
  for(const sheet of document.styleSheets) { if(sheet.href?.endsWith('/tokens.css')) read(sheet.cssRules); }
  const chain = [], seen = new Set([name]);
  let value = declarations.get(name);
  while(value) {
   const alias = value.match(/^var\((--[\w-]+)\)$/)?.[1];
   if(!alias || seen.has(alias)) break;
   chain.push(alias); seen.add(alias); value = declarations.get(alias);
  }
  return chain;
 }
 function highlight(el) {
  if (!active || !el) return;
  selected = el;
  const rect = el.getBoundingClientRect(), style = getComputedStyle(el);
  outline.hidden = false; tip.hidden = false;
  Object.assign(outline.style, {left:rect.left+'px',top:rect.top+'px',width:rect.width+'px',height:rect.height+'px'});
  const role = el.matches('h1') ? 'Heading' : el.matches('h1 span') ? 'Heading accent' : el.matches('a') ? 'Action' : el.matches('.hero-description') ? 'Body' : 'Label';
  tip.replaceChildren();
  const title = document.createElement('strong'); title.textContent = role; tip.append(title);
  // Read the real CSS token references from the element's component recipe.
  const names = style.getPropertyValue('--inspect-tokens').trim().split(',').filter(Boolean);
  names.forEach(name => {
   name = '--'+name.trim();
   const row = document.createElement('span'), token = document.createElement('code'), value = document.createElement('small');
   row.className = 'inspect-token'; token.textContent = name;
   value.textContent = [...tokenChain(name),style.getPropertyValue(name).trim()].join(' → ');
   row.append(token,value); tip.append(row);
  });
  const width = Math.min(320, innerWidth-24);
  tip.style.width = width+'px';
  tip.style.left = Math.max(12,Math.min(rect.left,innerWidth-width-12))+'px';
  const height = tip.offsetHeight;
  tip.style.top = Math.max(12,rect.bottom+height+96 < innerHeight ? rect.bottom+8 : rect.top-height-8)+'px';
 }
 function inspection(open) {
  active = open; layer.hidden = !open;
  inspect.setAttribute('aria-expanded',String(open));
  document.body.classList.toggle('inspecting',open);
  targets.forEach(el => { if(!el.matches('a')) { if(open) el.setAttribute('tabindex','0'); else el.removeAttribute('tabindex'); } });
  if(open) highlight($('h1',hero));
  else selected = null;
 }
 inspect.addEventListener('click',() => inspection(!active));
 $('#inspect-close').addEventListener('click',() => { inspection(false); inspect.focus(); });
 targets.forEach(el => {
  el.addEventListener('pointerenter',() => highlight(el));
  el.addEventListener('focus',() => highlight(el));
  el.addEventListener('click',e => { if(active) { e.preventDefault(); highlight(el); } });
 });
 document.addEventListener('keydown',e => { if(active && e.key==='Escape') { inspection(false); inspect.focus(); } });
 window.addEventListener('resize',() => highlight(selected));
 window.addEventListener('scroll',() => {
  if(!active || !selected) return;
  const r = selected.getBoundingClientRect();
  if(r.bottom < 0 || r.top > innerHeight) { outline.hidden = true; tip.hidden = true; }
  else highlight(selected);
 },{passive:true});
}
const dialog = $('.terminal-dialog'), input = $('#command-input'), commands = $('.terminal-commands'), output = $('.terminal-output'), back = $('[data-terminal-back]');
let opener = null, commandIndex = -1;
const commandButtons = $$('[data-command]');
function showCommands() { output.hidden = true; output.replaceChildren(); commands.hidden = false; back.hidden = true; commandIndex = -1; input.value = ''; }
function openTerminal(button) { opener = button || document.activeElement; showCommands(); dialog.showModal(); document.body.style.overflow = 'hidden'; input.focus(); }
function run(command) {
  const cmd = command.trim().toLowerCase();
  input.value = ''; commandIndex = -1;
  if (cmd === 'help') { showCommands(); output.hidden = false; output.append($('#response-help').content.cloneNode(true)); input.focus(); return; }
  const template = $('#response-' + cmd.replace(/[^a-z]/g, ''));
  output.replaceChildren(); output.hidden = false;
  if (template && /^[a-z]+$/.test(cmd)) { output.append(template.content.cloneNode(true)); commands.hidden = true; back.hidden = false; }
  else { output.textContent = cmd ? 'Command not found. Type “help” or choose a command below.' : 'Type a command or choose one below.'; commands.hidden = false; back.hidden = true; }
  input.focus();
}
$$('[data-terminal-open]').forEach(b => b.addEventListener('click', () => openTerminal(b)));
$$('[data-terminal-close]').forEach(b => b.addEventListener('click', () => dialog.close()));
dialog.addEventListener('close', () => { document.body.style.overflow = ''; opener?.focus(); });
dialog.addEventListener('click', e => { if (e.target === dialog) { const r = dialog.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dialog.close(); } });
$('.terminal-form').addEventListener('submit', e => { e.preventDefault(); run(input.value); });
commandButtons.forEach(b => b.addEventListener('click', () => run(b.dataset.command)));
back.addEventListener('click', () => { showCommands(); input.focus(); });
dialog.addEventListener('keydown', e => {
  if ((e.key === 'ArrowDown' || e.key === 'ArrowUp') && !commands.hidden) {
    e.preventDefault(); const current = commandButtons.indexOf(document.activeElement); commandIndex = current >= 0 ? current : commandIndex;
    commandIndex = commandIndex < 0 ? (e.key === 'ArrowDown' ? 0 : commandButtons.length - 1) : (commandIndex + (e.key === 'ArrowDown' ? 1 : -1) + commandButtons.length) % commandButtons.length;
    commandButtons[commandIndex].focus();
  }
});
output.addEventListener('click', e => { if (e.target.closest('a')) dialog.close(); });
document.addEventListener('keydown', e => { if (dialog.open || /INPUT|TEXTAREA|SELECT/.test(e.target.tagName) || e.target.isContentEditable) return; if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !e.metaKey && !e.ctrlKey)) { e.preventDefault(); openTerminal(); } });
// For the curious ones who open devtools.
console.log('%c👋 Hey, curious one. AI agents get their own version of this site: ' + location.origin + '/llms.txt', 'font:14px/1.6 system-ui; color:#f6b0ff');
