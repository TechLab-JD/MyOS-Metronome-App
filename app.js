// MyOS Metronome
const root = document.getElementById('MetronomeApp');
if (root) {
  const $ = (id) => document.getElementById(id);
  let bpm = 120, running = false, ac = null, next = 0, beat = 0, timer = null, taps = [];
  function setBpm(v) { bpm = Math.min(240, Math.max(40, Math.round(v))); $('mt-bpm').textContent = bpm; $('mt-range').value = bpm; }
  function dots() { const n = +$('mt-beats').value; $('mt-dots').innerHTML = ''; for (let i = 0; i < n; i++) { const d = document.createElement('div'); d.className = 'mt-dot' + (i === 0 ? ' acc' : ''); $('mt-dots').appendChild(d); } }
  function click(acc) { const o = ac.createOscillator(), g = ac.createGain(); o.connect(g); g.connect(ac.destination); o.frequency.value = acc ? 1500 : 900; g.gain.setValueAtTime(0.5, ac.currentTime); g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.05); o.start(); o.stop(ac.currentTime + 0.06); }
  function tick() {
    const n = +$('mt-beats').value, cells = $('mt-dots').children;
    while (ac.currentTime + 0.1 >= next) {
      click(beat === 0);
      for (let i = 0; i < cells.length; i++) cells[i].classList.toggle('on', i === beat);
      next += 60 / bpm; beat = (beat + 1) % n;
    }
  }
  function toggle() {
    if (running) { running = false; clearInterval(timer); $('mt-toggle').textContent = 'Start'; Array.from($('mt-dots').children).forEach(d => d.classList.remove('on')); return; }
    ac = ac || new (window.AudioContext || window.webkitAudioContext)(); if (ac.state === 'suspended') ac.resume();
    running = true; beat = 0; next = ac.currentTime + 0.05; $('mt-toggle').textContent = 'Stop'; timer = setInterval(tick, 25);
  }
  $('mt-range').oninput = (e) => setBpm(+e.target.value);
  $('mt-beats').onchange = dots;
  $('mt-toggle').onclick = toggle;
  $('mt-tap').onclick = function () { const now = performance.now(); taps = taps.filter(t => now - t < 2000); taps.push(now); if (taps.length >= 2) { const avg = (taps[taps.length - 1] - taps[0]) / (taps.length - 1); setBpm(60000 / avg); } };
  setBpm(120); dots();
}
