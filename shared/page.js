/*
 * The page controller shared by every language site.
 *
 * A site's app.js describes its language and calls VerbKit.startPage(profile).
 * This file owns everything else: the English lookup box, the translation
 * buttons, the person selector, the table of examples and the "show more"
 * button. It expects the markup every index.html shares (#verb-input,
 * #verb-list, #message, #result, #example-head, #toggle-tenses, the
 * input[name="person"] radios and td[data-tense] example cells). The table and
 * its button are hidden by styles.css until this file adds `ready` to <body>,
 * which it does once the table is filled in and collapsed.
 *
 * profile:
 *   verbs         { english: [entry, ...] }, the site's database
 *   initialVerb   English verb shown first
 *   coreTenses    table rows visible at first; every other row gets the
 *                 `hidden` attribute until the button is pressed
 *   unit          what the rows are called on the button (default 'tenses')
 *   lang          language tag for translated text
 *   headword(entry)                   the translation as plain text
 *   chipLabel(entry)                  text of a translation button (default: headword)
 *   labelSeparator                    joins translations in the lookup list (default ', ')
 *   titleClass, titleExtras(entry)    optional class and extra nodes after the translation
 *   analyse(entry)                    what the example cells are built from
 *   exampleLabel(entry, analysis)     the part inside "Example (...)"
 *   fillCell(cell, tense, analysis, person)
 *
 * Under Node this file only exports its functions (nothing touches `document`
 * until startPage runs).
 */
(function (global) {
  'use strict';

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function startPage(profile) {
    const {
      verbs, initialVerb, coreTenses, lang, headword, analyse, exampleLabel, fillCell,
      chipLabel = headword,
      labelSeparator = ', ',
      unit = 'tenses',
      titleClass = '',
      titleExtras = () => [],
    } = profile;
    const core = new Set(coreTenses);

    const input = document.getElementById('verb-input');
    const datalist = document.getElementById('verb-list');
    const message = document.getElementById('message');
    const result = document.getElementById('result');
    const exampleHead = document.getElementById('example-head');
    const exampleCells = document.querySelectorAll('td[data-tense]');
    const personRadios = document.querySelectorAll('input[name="person"]');
    const toggle = document.getElementById('toggle-tenses');
    const extraRows = [...exampleCells]
      .filter(cell => !core.has(cell.dataset.tense))
      .map(cell => cell.closest('tr'));

    const englishVerbs = Object.keys(verbs).sort();
    const state = { english: initialVerb, choice: 0, person: 0, expanded: false };

    function fillDatalist() {
      for (const english of englishVerbs) {
        const option = el('option');
        option.value = english;
        option.label = verbs[english].map(entry => headword(entry)).join(labelSeparator);
        datalist.append(option);
      }
    }

    function renderResult(options) {
      const current = options[state.choice];
      const title = el('p', 'translation');
      const word = el('strong', titleClass, headword(current));
      word.lang = lang;
      title.append(`to ${state.english}`, el('span', 'arrow', '→'), word, ...titleExtras(current));

      const chips = el('div', 'chips');
      options.forEach((option, i) => {
        const chip = el('button', 'chip', chipLabel(option));
        chip.type = 'button';
        chip.lang = lang;
        chip.setAttribute('aria-pressed', String(i === state.choice));
        chip.addEventListener('click', () => { state.choice = i; render(); });
        chips.append(chip);
      });

      result.replaceChildren(title);
      if (options.length > 1) result.append(chips);
      if (current.note) result.append(el('p', 'note', current.note));
    }

    function renderTable(analysis, entry) {
      exampleHead.textContent = `Example (${exampleLabel(entry, analysis)})`;
      exampleHead.lang = lang;
      for (const cell of exampleCells) fillCell(cell, cell.dataset.tense, analysis, state.person);
    }

    function renderTenseVisibility() {
      extraRows.forEach(row => { row.hidden = !state.expanded; });
      toggle.textContent = state.expanded ? `Show fewer ${unit}` : `Show ${extraRows.length} more ${unit}`;
      toggle.setAttribute('aria-expanded', String(state.expanded));
    }

    function render() {
      const options = verbs[state.english];
      const entry = options[state.choice];
      const analysis = analyse(entry);
      renderResult(options);
      renderTable(analysis, entry);
    }

    function lookUp() {
      const query = input.value.trim().toLowerCase().replace(/^to\s+/, '');
      if (!query) { message.textContent = ''; return; }
      if (Object.hasOwn(verbs, query)) {
        message.textContent = '';
        state.english = query;
        state.choice = 0;
        render();
      } else if (!englishVerbs.some(verb => verb.startsWith(query))) {
        message.textContent = `"${input.value.trim()}" isn't in the verb list yet. Showing "${state.english}" instead.`;
      } else {
        message.textContent = '';
      }
    }

    fillDatalist();
    input.addEventListener('input', lookUp);
    personRadios.forEach(radio => radio.addEventListener('change', () => {
      state.person = Number(radio.value);
      render();
    }));
    toggle.addEventListener('click', () => {
      state.expanded = !state.expanded;
      renderTenseVisibility();
    });
    renderTenseVisibility();
    render();

    // The table is filled in and collapsed; now it can be shown (see styles.css).
    document.body.classList.add('ready');
  }

  /*
   * The profile fields shared by languages whose verbs conjugate (Spanish,
   * Catalan): entries carry the translation under the language code, the
   * engine's `conjugate(infinitive)` fills the table, and the imperative rows
   * add the person to the form, e.g. "habla (tú)". imperativeLabels has one
   * label per person; the imperative has no 1st-person form, so that slot
   * repeats the 2nd person's label. A form that does not exist is written "—"
   * by the engine and shown without a label.
   */
  function inflectedLanguage({ lang, conjugate, imperativeLabels, imperativeTenses = ['impAff', 'impNeg'] }) {
    const imperative = new Set(imperativeTenses);
    return {
      lang,
      headword: entry => entry[lang],
      analyse: entry => conjugate(entry[lang]),
      exampleLabel: (entry, conjugated) => conjugated.inf[0].toUpperCase() + conjugated.inf.slice(1),
      fillCell(cell, tense, conjugated, person) {
        const form = conjugated.forms[tense][person];
        const label = imperative.has(tense) && form !== '—' ? ` (${imperativeLabels[person]})` : '';
        cell.textContent = form + label;
      },
    };
  }

  const api = { el, startPage, inflectedLanguage };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else Object.assign(global.VerbKit = global.VerbKit || {}, api);
})(typeof window !== 'undefined' ? window : globalThis);
