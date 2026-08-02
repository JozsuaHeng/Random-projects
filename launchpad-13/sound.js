// ============================================================
// LAUNCHPAD-13 — sound.js
// Small Web Audio sound-effects module. Everything is synthesized
// (oscillators + a noise buffer) — no audio files, so the project stays
// a handful of static files with no assets to fetch.
// ============================================================

const SFX = (function () {
  let actx = null;
  let enabled = true;
  let engineNode = null;

  function ctx() {
    if (!actx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      actx = new AC();
    }
    if (actx.state === "suspended") actx.resume();
    return actx;
  }

  function tone(freq, dur, type, vol) {
    if (!enabled) return;
    const c = ctx();
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = type || "square";
    osc.frequency.value = freq;
    gain.gain.value = vol ?? 0.12;
    gain.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + dur);
    osc.connect(gain).connect(c.destination);
    osc.start();
    osc.stop(c.currentTime + dur);
  }

  function noiseBurst(dur, vol, filterFreq) {
    if (!enabled) return;
    const c = ctx();
    const size = Math.max(1, Math.floor(c.sampleRate * dur));
    const buffer = c.createBuffer(1, size, c.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < size; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / size);
    const src = c.createBufferSource();
    src.buffer = buffer;
    const filter = c.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = filterFreq || 900;
    const gain = c.createGain();
    gain.gain.value = vol ?? 0.25;
    src.connect(filter).connect(gain).connect(c.destination);
    src.start();
  }

  function thud(vol) {
    if (!enabled) return;
    const c = ctx();
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(120, c.currentTime);
    osc.frequency.exponentialRampToValueAtTime(28, c.currentTime + 0.35);
    gain.gain.value = vol ?? 0.4;
    gain.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 0.4);
    osc.connect(gain).connect(c.destination);
    osc.start();
    osc.stop(c.currentTime + 0.4);
  }

  function rumbleStart() {
    if (!enabled || engineNode) return;
    const c = ctx();
    const osc = c.createOscillator();
    const osc2 = c.createOscillator();
    const filter = c.createBiquadFilter();
    const gain = c.createGain();
    osc.type = "sawtooth";
    osc.frequency.value = 55;
    osc2.type = "sawtooth";
    osc2.frequency.value = 58;
    filter.type = "lowpass";
    filter.frequency.value = 400;
    gain.gain.value = 0;
    gain.gain.linearRampToValueAtTime(0.09, c.currentTime + 0.3);
    osc.connect(filter);
    osc2.connect(filter);
    filter.connect(gain).connect(c.destination);
    osc.start();
    osc2.start();
    engineNode = { osc, osc2, gain };
  }

  function rumbleStop() {
    if (!engineNode) return;
    const c = ctx();
    const { osc, osc2, gain } = engineNode;
    gain.gain.cancelScheduledValues(c.currentTime);
    gain.gain.setValueAtTime(gain.gain.value, c.currentTime);
    gain.gain.linearRampToValueAtTime(0.0001, c.currentTime + 0.4);
    osc.stop(c.currentTime + 0.45);
    osc2.stop(c.currentTime + 0.45);
    engineNode = null;
  }

  function setEnabled(v) {
    enabled = v;
    if (!v) rumbleStop();
  }

  return {
    click: () => tone(520, 0.05, "square", 0.08),
    select: () => tone(1100, 0.05, "square", 0.09),
    deselect: () => tone(500, 0.05, "square", 0.07),
    error: () => tone(140, 0.15, "sawtooth", 0.12),
    countdownTick: (n) => tone(n === 0 ? 880 : 440, n === 0 ? 0.25 : 0.09, "square", 0.1),
    boom: () => {
      noiseBurst(0.5, 0.3, 700);
      thud(0.35);
    },
    rumbleStart,
    rumbleStop,
    setEnabled,
    get enabled() {
      return enabled;
    },
  };
})();
