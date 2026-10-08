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
