"use strict";
(() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));

  // public/study/js/config.js
  var STORAGE_KEY = "yihan_word_game_v3";
  var V2_STORAGE_KEY = "yihan_word_game_v2_vocab";
  var SCHEMA_VERSION = 3;
  var FEEDBACK_DELAY = 1800;
  var MODE_RULES = Object.freeze({
    chunks: { label: "\u{1F9F1} \u62C6\u5206\u62FC\u8BCD", points: 5, correct: 2, wrong: -1 },
    listen: { label: "\u{1F3A7} \u542C\u97F3\u9009\u8BCD", points: 3, correct: 1, wrong: -1 },
    spell: { label: "\u270D\uFE0F \u62FC\u5199\u7B54\u9898", points: 8, correct: 3, wrong: -2 },
    wrong: { label: "\u{1F4D5} \u9519\u9898\u590D\u4E60", points: 5, correct: 2, wrong: -2 },
    mole: { label: "\u{1F439} \u5355\u8BCD\u6253\u5730\u9F20", points: 3, correct: 1, wrong: -1 },
    match: { label: "\u{1F9E9} \u5355\u8BCD\u6D88\u6D88\u4E50", points: 2, correct: 1, wrong: 0 }
  });

  // public/study/js/utils.js
  var todayKey = () => {
    const now2 = /* @__PURE__ */ new Date();
    const y = now2.getFullYear();
    const m = String(now2.getMonth() + 1).padStart(2, "0");
    const d = String(now2.getDate()).padStart(2, "0");
    return "".concat(y, "-").concat(m, "-").concat(d);
  };
  var normalizeAnswer = (value) => String(value || "").trim().toLowerCase().replace(/\s+/g, " ");
  var compactWord = (value) => normalizeAnswer(value).replace(/[\s-]/g, "");
  var clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  function shuffle(items) {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }
  function downloadJson(data, filename) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  // public/study/js/mastery.js
  function emptyProgress() {
    return { masteryScore: 0, spellingCorrectCount: 0, wrongCount: 0, reviewCorrectStreak: 0, inWrongBook: false, lastWrongTime: null, lastPracticeTime: null };
  }
  function ensureProgress(state, wordId) {
    var _a;
    (_a = state.wordProgress)[wordId] || (_a[wordId] = emptyProgress());
    return state.wordProgress[wordId];
  }
  function applyMastery(state, wordId, mode, correct) {
    const progress = ensureProgress(state, wordId);
    const delta = correct ? MODE_RULES[mode].correct : MODE_RULES[mode].wrong;
    progress.masteryScore = clamp(Number(progress.masteryScore || 0) + delta, 0, 12);
    if (correct && mode === "spell") progress.spellingCorrectCount = Number(progress.spellingCorrectCount || 0) + 1;
    progress.lastPracticeTime = (/* @__PURE__ */ new Date()).toISOString();
    return progress;
  }
  function masteryLevel(progress) {
    const p = progress || emptyProgress();
    if (p.masteryScore >= 9 && p.spellingCorrectCount >= 1) return { key: "mastered", label: "\u{1F3C6} \u638C\u63E1" };
    if (p.masteryScore >= 6) return { key: "skilled", label: p.masteryScore >= 9 ? "\u2B50 \u719F\u7EC3 \xB7 \u5F85\u62FC\u5199" : "\u2B50 \u719F\u7EC3" };
    if (p.masteryScore >= 3) return { key: "learning", label: "\u{1F33F} \u4E0D\u719F" };
    return { key: "new", label: "\u{1F331} \u964C\u751F" };
  }
  var isMastered = (progress) => masteryLevel(progress).key === "mastered";

  // public/study/js/storage.js
  var now = () => (/* @__PURE__ */ new Date()).toISOString();
  function defaultState() {
    return { schemaVersion: SCHEMA_VERSION, scores: { total: 0, daily: {} }, wordProgress: {}, meta: { createdAt: now(), updatedAt: now(), migratedFrom: null } };
  }
  function sanitizeProgress(raw = {}) {
    return {
      masteryScore: clamp(Number(raw.masteryScore || 0), 0, 12),
      spellingCorrectCount: Math.max(0, Number(raw.spellingCorrectCount || 0)),
      wrongCount: Math.max(0, Number(raw.wrongCount || 0)),
      reviewCorrectStreak: clamp(Number(raw.reviewCorrectStreak || 0), 0, 1),
      inWrongBook: Boolean(raw.inWrongBook),
      lastWrongTime: raw.lastWrongTime || null,
      lastPracticeTime: raw.lastPracticeTime || null
    };
  }
  function sanitizeV3(raw) {
    var _a, _b;
    const state = defaultState();
    state.scores.total = Math.max(0, Number(((_a = raw == null ? void 0 : raw.scores) == null ? void 0 : _a.total) || 0));
    state.scores.daily = ((_b = raw == null ? void 0 : raw.scores) == null ? void 0 : _b.daily) && typeof raw.scores.daily === "object" ? raw.scores.daily : {};
    const savedProgress = (raw == null ? void 0 : raw.wordProgress) || {};
    for (const id in savedProgress) {
      if (Object.prototype.hasOwnProperty.call(savedProgress, id)) {
        state.wordProgress[id] = sanitizeProgress(savedProgress[id]);
      }
    }
    state.meta = __spreadProps(__spreadValues(__spreadValues({}, state.meta), raw.meta || {}), { updatedAt: now() });
    return state;
  }
  function migrateV2(raw, words) {
    var _a, _b, _c;
    const state = defaultState();
    state.scores.total = Math.max(0, Number(raw.totalScore || 0));
    state.scores.daily = raw.dailyScores && typeof raw.dailyScores === "object" ? raw.dailyScores : {};
    const legacyScores = [0, 2, 5, 8];
    for (const word of words) {
      const oldWord = (raw.words || []).find((item) => compactWord(item.en) === compactWord(word.word));
      const oldKey = (oldWord == null ? void 0 : oldWord.en) || word.word.toLowerCase();
      const wrong = ((_a = raw.wrong) == null ? void 0 : _a[oldKey]) || ((_b = raw.wrong) == null ? void 0 : _b[normalizeAnswer(oldKey)]);
      const p = emptyProgress();
      p.masteryScore = legacyScores[clamp(Number(((_c = raw.mastery) == null ? void 0 : _c[oldKey]) || 0), 0, 3)];
      if (wrong) {
        p.wrongCount = Math.max(1, Number(wrong.count || 1));
        p.reviewCorrectStreak = clamp(Number(wrong.reviewStreak || 0), 0, 1);
        p.inWrongBook = true;
        p.lastWrongTime = wrong.lastWrongAt || null;
      }
      if (p.masteryScore || p.inWrongBook) state.wordProgress[word.id] = p;
    }
    state.meta.migratedFrom = "v2";
    state.meta.updatedAt = now();
    return state;
  }
  function loadState(words) {
    try {
      const current = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if ((current == null ? void 0 : current.schemaVersion) === SCHEMA_VERSION) return sanitizeV3(current);
    } catch (e) {
    }
    try {
      const legacy = JSON.parse(localStorage.getItem(V2_STORAGE_KEY));
      if (legacy == null ? void 0 : legacy.words) {
        const migrated = migrateV2(legacy, words);
        saveState(migrated);
        return migrated;
      }
    } catch (e) {
    }
    return defaultState();
  }
  function saveState(state) {
    state.meta.updatedAt = now();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }
  function importState(raw, words) {
    if ((raw == null ? void 0 : raw.schemaVersion) === SCHEMA_VERSION) return sanitizeV3(raw);
    if (Array.isArray(raw == null ? void 0 : raw.words) && typeof (raw == null ? void 0 : raw.totalScore) === "number") return migrateV2(raw, words);
    throw new Error("\u4E0D\u652F\u6301\u7684\u6570\u636E\u683C\u5F0F");
  }
  function resetState() {
    const state = defaultState();
    saveState(state);
    return state;
  }

  // public/study/js/scoring.js
  function addModeScore(state, mode) {
    const points = MODE_RULES[mode].points;
    const day = todayKey();
    state.scores.total += points;
    state.scores.daily[day] = (state.scores.daily[day] || 0) + points;
    return points;
  }

  // public/study/js/wrong-book.js
  function markWrong(state, wordId) {
    const p = ensureProgress(state, wordId);
    p.wrongCount = Number(p.wrongCount || 0) + 1;
    p.reviewCorrectStreak = 0;
    p.inWrongBook = true;
    p.lastWrongTime = (/* @__PURE__ */ new Date()).toISOString();
  }
  function recordReviewCorrect(state, wordId) {
    const p = ensureProgress(state, wordId);
    p.reviewCorrectStreak = Number(p.reviewCorrectStreak || 0) + 1;
    if (p.reviewCorrectStreak >= 2) {
      p.inWrongBook = false;
      p.reviewCorrectStreak = 0;
      return true;
    }
    return false;
  }
  var wrongWords = (state, words) => words.filter((word) => {
    var _a;
    return (_a = state.wordProgress[word.id]) == null ? void 0 : _a.inWrongBook;
  });

  // public/study/js/speech.js
  var speaking = false;
  function speak(text, onStateChange = () => {
  }) {
    if (!("speechSynthesis" in window)) return false;
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.82;
    const voices = speechSynthesis.getVoices();
    utterance.voice = voices.find((v) => /en-US/i.test(v.lang)) || voices.find((v) => /^en/i.test(v.lang)) || null;
    utterance.onstart = () => {
      speaking = true;
      onStateChange(true);
    };
    utterance.onend = utterance.onerror = () => {
      speaking = false;
      onStateChange(false);
    };
    speechSynthesis.speak(utterance);
    return true;
  }
  function stopSpeech() {
    if ("speechSynthesis" in window) speechSynthesis.cancel();
    speaking = false;
  }

  // public/study/js/practice.js
  var label = (mode) => "".concat(MODE_RULES[mode].label, " \xB7 \u7B54\u5BF9 +").concat(MODE_RULES[mode].points);
  function renderSpelling(card, word, mode, progress, handlers) {
    const review = mode === "wrong";
    card.innerHTML = '\n    <div class="mode-label">'.concat(label(mode), '</div>\n    <div class="cn">').concat(word.meaning, "</div>\n    ").concat(review ? '<p class="prompt">\u8FDE\u7EED\u6B63\u786E '.concat(progress.reviewCorrectStreak || 0, " / 2</p>") : '<p class="prompt">\u8BF7\u72EC\u7ACB\u5199\u51FA\u5B8C\u6574\u82F1\u6587</p>', '\n    <input id="answerInput" class="answer" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="\u8BF7\u8F93\u5165\u82F1\u6587">\n    <button id="submitAnswer" class="btn primary submit">\u63D0\u4EA4\u7B54\u6848</button>\n    <div id="feedback" class="feedback" aria-live="polite"></div>');
    const input = card.querySelector("#answerInput");
    const submit = card.querySelector("#submitAnswer");
    const send = () => {
      if (input.value.trim()) handlers.answer(normalizeAnswer(input.value));
      else handlers.toast("\u5148\u8F93\u5165\u7B54\u6848\u54E6");
    };
    submit.addEventListener("click", send);
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") send();
    });
    input.focus();
  }
  function renderListening(card, word, words, handlers) {
    const choices = shuffle([word, ...shuffle(words.filter((w) => w.id !== word.id)).slice(0, 3)]);
    card.innerHTML = '\n    <div class="mode-label">'.concat(label("listen"), '</div><div class="cn">\u542C\u53D1\u97F3\uFF0C\u9009\u51FA\u6B63\u786E\u5355\u8BCD</div>\n    <button class="speaker" id="speaker" aria-label="\u64AD\u653E\u53D1\u97F3">\u{1F50A}</button>\n    <div class="options">').concat(choices.map((w) => '<button class="option" data-id="'.concat(w.id, '">').concat(w.word, "</button>")).join(""), '</div>\n    <div id="feedback" class="feedback" aria-live="polite"></div>');
    card.querySelector("#speaker").addEventListener("click", handlers.speak);
    card.querySelectorAll(".option").forEach((button) => button.addEventListener("click", () => handlers.choose(button, button.dataset.id)));
    setTimeout(handlers.speak, 250);
  }
  function renderChunks(card, word, handlers) {
    const pieces = word.learningChunks.map((text, index) => ({ text, index, key: "".concat(index, "-").concat(text) }));
    let selected = [];
    card.innerHTML = '\n    <div class="mode-label">'.concat(label("chunks"), '</div><div class="cn">').concat(word.meaning, '</div>\n    <p class="prompt">\u6309\u6B63\u786E\u987A\u5E8F\u70B9\u51FB\u8BCD\u5757</p><div id="chunkAnswer" class="chunk-answer">\u7B49\u5F85\u62FC\u8BCD\u2026</div>\n    <div id="chunks" class="chunks"></div>\n    <button id="undoChunk" class="btn secondary">\u64A4\u56DE\u4E00\u6B65</button>\n    <div id="feedback" class="feedback" aria-live="polite"></div>');
    const answerBox = card.querySelector("#chunkAnswer");
    const board = card.querySelector("#chunks");
    const drawn = shuffle(pieces);
    const refresh = () => {
      answerBox.textContent = selected.length ? selected.map((piece) => piece.text).join(" + ") : "\u7B49\u5F85\u62FC\u8BCD\u2026";
      board.innerHTML = drawn.map((piece) => '<button class="chunk '.concat(selected.some((item) => item.key === piece.key) ? "used" : "", '" data-key="').concat(piece.key, '">').concat(piece.text, "</button>")).join("");
      board.querySelectorAll(".chunk").forEach((button) => button.addEventListener("click", () => {
        const piece = pieces.find((item) => item.key === button.dataset.key);
        selected.push(piece);
        refresh();
        if (selected.length === pieces.length) handlers.answer(compactWord(selected.map((item) => item.text).join("")) === compactWord(word.word));
      }));
    };
    card.querySelector("#undoChunk").addEventListener("click", () => {
      selected.pop();
      refresh();
    });
    refresh();
  }

  // public/study/js/games.js
  function renderMole(card, word, words, handlers) {
    const choices = shuffle([word, ...shuffle(words.filter((w) => w.id !== word.id)).slice(0, 3)]);
    card.innerHTML = '\n    <div class="mode-label">'.concat(MODE_RULES.mole.label, " \xB7 \u7B54\u5BF9 +").concat(MODE_RULES.mole.points, '</div>\n    <div class="cn">').concat(word.meaning, '</div><p class="prompt">\u5FEB\u70B9\u627E\u5230\u6B63\u786E\u5355\u8BCD\uFF01</p>\n    <div class="mole-grid">').concat(choices.map((w) => '<button class="mole" data-id="'.concat(w.id, '">\u{1F439}<br>').concat(w.word, "</button>")).join(""), '</div>\n    <div id="feedback" class="feedback" aria-live="polite"></div>');
    card.querySelectorAll(".mole").forEach((button) => button.addEventListener("click", () => handlers.choose(button, button.dataset.id)));
  }
  function createMatchRound(card, words, handlers) {
    const chosen = shuffle(words).slice(0, 4);
    const cards = shuffle(chosen.flatMap((word) => [
      { id: "en-".concat(word.id), wordId: word.id, type: "en", text: word.word },
      { id: "zh-".concat(word.id), wordId: word.id, type: "zh", text: word.meaning }
    ]));
    const matched = /* @__PURE__ */ new Set();
    let selected = [];
    let locked = false;
    card.innerHTML = '<div class="mode-label">'.concat(MODE_RULES.match.label, " \xB7 \u6BCF\u7EC4 +").concat(MODE_RULES.match.points, '</div><div class="cn">\u627E\u51FA\u5BF9\u5E94\u7684\u82F1\u6587\u548C\u4E2D\u6587</div><div id="matchBoard" class="match-board"></div><div id="feedback" class="feedback" aria-live="polite"></div>');
    const board = card.querySelector("#matchBoard");
    const draw = () => {
      board.innerHTML = cards.map((item) => '<button class="match-card '.concat(selected.includes(item.id) ? "selected" : "", " ").concat(matched.has(item.wordId) ? "matched" : "", '" data-id="').concat(item.id, '">').concat(item.text, "</button>")).join("");
      board.querySelectorAll(".match-card").forEach((button) => button.addEventListener("click", () => pick(button.dataset.id)));
    };
    const pick = (id) => {
      if (locked || selected.includes(id)) return;
      selected.push(id);
      draw();
      if (selected.length < 2) return;
      locked = true;
      const [a, b] = selected.map((key) => cards.find((item) => item.id === key));
      if (a.wordId === b.wordId && a.type !== b.type) {
        matched.add(a.wordId);
        handlers.match(a.wordId, matched.size === chosen.length);
        setTimeout(() => {
          selected = [];
          locked = false;
          draw();
        }, 450);
      } else {
        handlers.mismatch();
        setTimeout(() => {
          selected = [];
          locked = false;
          draw();
        }, 650);
      }
    };
    draw();
  }

  // public/study/js/app.js
  async function init() {
    const words = await fetch("./data/words.json").then((response) => {
      if (!response.ok) throw new Error("\u8BCD\u5E93\u52A0\u8F7D\u5931\u8D25");
      return response.json();
    });
    let state = loadState(words);
    let mode = null, currentWord = null, pool = [], poolIndex = 0, count = 0, locked = false, timer = null;
    const $ = (selector) => document.querySelector(selector);
    const card = $("#questionCard");
    function toast(message) {
      const el = $("#toast");
      el.textContent = message;
      el.classList.add("show");
      setTimeout(() => el.classList.remove("show"), 1800);
    }
    function star() {
      const el = document.createElement("div");
      el.className = "star";
      el.textContent = ["\u2B50", "\u{1F31F}", "\u2728"][Math.floor(Math.random() * 3)];
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 900);
    }
    function showView(id) {
      document.querySelectorAll(".view").forEach((view) => view.classList.toggle("active", view.id === id));
      if (id === "manage") renderManage();
      refreshStats();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    function refreshStats() {
      const mastered = words.filter((word) => isMastered(state.wordProgress[word.id])).length;
      const percent = words.length ? Math.round(mastered / words.length * 100) : 0;
      $("#totalScore").textContent = state.scores.total;
      $("#todayScore").textContent = state.scores.daily[todayKey()] || 0;
      $("#masteredCount").textContent = mastered;
      $("#wordCount").textContent = words.length;
      $("#progressText").textContent = "".concat(percent, "%");
      $("#progressBar").style.width = "".concat(percent, "%");
    }
    function renderManage() {
      $("#wordSummary").textContent = "\u5171 ".concat(words.length, " \u4E2A\u8BCD");
      $("#wordTableWrap").innerHTML = '<div style="overflow:auto"><table class="word-table"><thead><tr><th>\u82F1\u6587</th><th>\u4E2D\u6587</th><th>\u5B66\u4E60\u62C6\u5206</th><th>\u638C\u63E1\u5EA6</th><th>\u9519\u9898</th></tr></thead><tbody>'.concat(words.map((word) => {
        const p = ensureProgress(state, word.id);
        const level = masteryLevel(p);
        return "<tr><td><b>".concat(word.word, "</b></td><td>").concat(word.meaning, "</td><td>").concat(word.learningChunks.join(" \xB7 "), '</td><td><span class="tag">').concat(level.label, " ").concat(p.masteryScore, "/12</span></td><td>").concat(p.inWrongBook ? "\u{1F4D5} ".concat(p.reviewCorrectStreak, "/2") : "\u2014", "</td></tr>");
      }).join(""), "</tbody></table></div>");
    }
    function makePool() {
      pool = shuffle(mode === "wrong" ? wrongWords(state, words) : words);
      poolIndex = 0;
    }
    function pickWord() {
      if (!pool.length || poolIndex >= pool.length) makePool();
      if (!pool.length) return null;
      let word = pool[poolIndex++];
      if (word.id === (currentWord == null ? void 0 : currentWord.id) && pool.length > 1) {
        const next = poolIndex < pool.length ? poolIndex : 0;
        [word, pool[next]] = [pool[next], word];
      }
      return word;
    }
    function startMode(nextMode) {
      if (["listen", "mole", "match"].includes(nextMode) && words.length < 4) return toast("\u81F3\u5C11\u9700\u8981 4 \u4E2A\u8BCD");
      mode = nextMode;
      count = 0;
      locked = false;
      currentWord = null;
      makePool();
      showView("practice");
      nextQuestion();
    }
    function leave() {
      clearTimeout(timer);
      stopSpeech();
      mode = null;
      locked = false;
      showView("home");
    }
    function nextQuestion() {
      locked = false;
      count += 1;
      $("#practiceCounter").textContent = mode === "match" ? "\u7B2C ".concat(count, " \u8F6E") : "\u7B2C ".concat(count, " \u9898");
      if (mode === "match") return renderMatch();
      currentWord = pickWord();
      if (!currentWord) {
        card.innerHTML = '<div class="empty"><div class="cn">\u5F53\u524D\u6CA1\u6709\u9519\u9898 \u{1F389}</div><button id="emptyBack" class="btn primary">\u8FD4\u56DE\u9996\u9875</button></div>';
        $("#emptyBack").addEventListener("click", leave);
        return;
      }
      const handlers = { answer: (answer) => mode === "chunks" ? finish(Boolean(answer)) : finish(answer === normalizeAnswer(currentWord.word)), choose, speak: () => speak(currentWord.word), toast };
      if (mode === "chunks") renderChunks(card, currentWord, handlers);
      if (mode === "listen") renderListening(card, currentWord, words, handlers);
      if (mode === "spell" || mode === "wrong") renderSpelling(card, currentWord, mode, ensureProgress(state, currentWord.id), handlers);
      if (mode === "mole") renderMole(card, currentWord, words, handlers);
    }
    function disableQuestion() {
      locked = true;
      card.querySelectorAll("button,input").forEach((element) => element.disabled = true);
    }
    function feedbackHtml(ok, points, removed = false) {
      const headline = ok ? "\u2705 \u7B54\u5BF9\u4E86\uFF01+".concat(points, " \u5206") : "\u274C \u9009\u62E9\u9519\u8BEF";
      const review = removed ? "<div>\u5DF2\u8FDE\u7EED\u7B54\u5BF9 2 \u6B21\uFF0C\u79FB\u51FA\u9519\u9898\u672C</div>" : "";
      return "<div>".concat(headline, '</div><div class="answer-word">').concat(currentWord.word, '</div><div class="answer-meaning">').concat(currentWord.meaning, "</div>").concat(review);
    }
    function finish(ok, selectedButton = null) {
      var _a;
      if (locked) return;
      disableQuestion();
      if (selectedButton) {
        selectedButton.classList.add(ok ? "correct" : "wrong");
        if (!ok) (_a = card.querySelector('[data-id="'.concat(currentWord.id, '"]'))) == null ? void 0 : _a.classList.add("correct");
      }
      const points = ok ? addModeScore(state, mode) : 0;
      applyMastery(state, currentWord.id, mode, ok);
      let removed = false;
      if (ok && mode === "wrong") removed = recordReviewCorrect(state, currentWord.id);
      if (!ok) markWrong(state, currentWord.id);
      saveState(state);
      refreshStats();
      const fb = $("#feedback");
      fb.className = "feedback ".concat(ok ? "ok" : "bad");
      fb.innerHTML = feedbackHtml(ok, points, removed);
      if (ok) star();
      speak(currentWord.word);
      timer = setTimeout(() => {
        if (mode === "wrong") makePool();
        if (mode) nextQuestion();
      }, FEEDBACK_DELAY);
    }
    function choose(button, wordId) {
      finish(wordId === currentWord.id, button);
    }
    function renderMatch() {
      createMatchRound(card, words, {
        match(wordId, complete) {
          const word = words.find((item) => item.id === wordId);
          const points = addModeScore(state, "match");
          applyMastery(state, wordId, "match", true);
          saveState(state);
          refreshStats();
          star();
          const fb = $("#feedback");
          fb.className = "feedback ok";
          fb.innerHTML = "<div>\u2705 \u5339\u914D\u6210\u529F\uFF01+".concat(points, ' \u5206</div><div class="answer-word">').concat(word.word, '</div><div class="answer-meaning">').concat(word.meaning, "</div>");
          speak(word.word);
          if (complete) timer = setTimeout(nextQuestion, FEEDBACK_DELAY);
        },
        mismatch() {
          const fb = $("#feedback");
          fb.className = "feedback bad";
          fb.textContent = "\u518D\u60F3\u4E00\u60F3\uFF0C\u8FD9\u4E24\u5F20\u4E0D\u5339\u914D";
        }
      });
    }
    document.querySelectorAll("[data-mode]").forEach((button) => button.addEventListener("click", () => startMode(button.dataset.mode)));
    document.querySelectorAll("[data-view]").forEach((button) => button.addEventListener("click", () => showView(button.dataset.view)));
    $("#leaveBtn").addEventListener("click", leave);
    $("#exportBtn").addEventListener("click", () => {
      saveState(state);
      downloadJson(state, "\u7FCA\u6DB5-\u5355\u8BCD\u5B66\u4E60\u6570\u636E-".concat(todayKey(), ".json"));
      toast("\u5B66\u4E60\u6570\u636E\u5DF2\u5BFC\u51FA");
    });
    $("#importBtn").addEventListener("click", () => $("#importFile").click());
    $("#importFile").addEventListener("change", async (event) => {
      try {
        const file = event.target.files[0];
        if (!file) return;
        state = importState(JSON.parse(await file.text()), words);
        saveState(state);
        refreshStats();
        renderManage();
        toast("\u5B66\u4E60\u6570\u636E\u5BFC\u5165\u6210\u529F");
      } catch (error) {
        toast("\u5BFC\u5165\u5931\u8D25\uFF1A".concat(error.message));
      } finally {
        event.target.value = "";
      }
    });
    $("#resetBtn").addEventListener("click", () => {
      if (!confirm("\u786E\u5B9A\u6E05\u7A7A\u79EF\u5206\u3001\u638C\u63E1\u5EA6\u548C\u9519\u9898\u8BB0\u5F55\u5417\uFF1F")) return;
      state = resetState();
      refreshStats();
      renderManage();
      toast("\u5B66\u4E60\u8BB0\u5F55\u5DF2\u6E05\u7A7A");
    });
    window.addEventListener("beforeunload", () => saveState(state));
    refreshStats();
  }
  init().catch((error) => {
    console.error(error);
    const card = document.querySelector("#home .hero-main");
    if (card) card.insertAdjacentHTML("beforeend", '<p style="color:#c83f4b;font-weight:700">\u9875\u9762\u52A0\u8F7D\u5931\u8D25\uFF0C\u8BF7\u5237\u65B0\u6216\u5347\u7EA7\u6D4F\u89C8\u5668\u540E\u91CD\u8BD5\u3002</p>');
  });
})();
