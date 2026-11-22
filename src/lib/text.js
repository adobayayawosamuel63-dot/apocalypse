const STOPWORDS = new Set([
  'le',
  'la',
  'les',
  'un',
  'une',
  'des',
  'de',
  'du',
  'au',
  'aux',
  'et',
  'ou',
  'mais',
  'donc',
  'or',
  'ni',
  'car',
  'que',
  'qui',
  'quoi',
  'dont',
  'ou',
  'il',
  'elle',
  'ils',
  'elles',
  'je',
  'tu',
  'nous',
  'vous',
  'on',
  'se',
  'sa',
  'son',
  'ses',
  'leur',
  'leurs',
  'ce',
  'cet',
  'cette',
  'ces',
  'mon',
  'ma',
  'mes',
  'ton',
  'ta',
  'tes',
  'notre',
  'votre',
  'nos',
  'vos',
  'est',
  'sont',
  'etait',
  'etaient',
  'a',
  'ont',
  'avait',
  'avaient',
  'fut',
  'furent',
  'dans',
  'en',
  'par',
  'pour',
  'sur',
  'sous',
  'avec',
  'sans',
  'vers',
  'chez',
  'entre',
  'ne',
  'pas',
  'plus',
  'tres',
  'tout',
  'tous',
  'toute',
  'toutes',
  'comme',
  'si',
  'y',
  'lui',
  'l',
  'd',
  'j',
  'n',
  's',
  'c',
  'qu',
  'a',
  'etait',
  'voici',
  'celui',
  'celle',
  'ceux',
  'celles',
]);

const LETTER_OR_DIGIT = /[\p{L}\p{N}]/u;

export function normalizeWord(raw = '') {
  return raw
    .toLowerCase()
    .normalize('NFC')
    .replace(/œ/g, 'oe')
    .replace(/æ/g, 'ae')
    .replace(/[’‘‛`]/g, "'")
    .replace(/[“”«»„]/g, '')
    .replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, '');
}

export function stripPunctuation(raw = '') {
  return raw.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, '');
}

export function trailingPunctuation(raw = '') {
  const match = raw.match(/[^\p{L}\p{N}]+$/u);
  return match ? match[0] : '';
}

export function splitWords(text = '') {
  return text.split(/\s+/).filter(Boolean);
}

export function maskWord(word) {
  let letterKeptInSegment = false;
  return [...word]
    .map((character) => {
      // Chaque partie d'un mot composé garde son initiale : Jésus-Christ → J____-C_____
      if (character === '-' || character === "'" || character === '’') {
        letterKeptInSegment = false;
        return character;
      }
      if (!LETTER_OR_DIGIT.test(character)) return character;
      if (!letterKeptInSegment) {
        letterKeptInSegment = true;
        return character;
      }
      return '_';
    })
    .join('');
}

export function shuffle(items, random = Math.random) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const target = Math.floor(random() * (index + 1));
    [result[index], result[target]] = [result[target], result[index]];
  }
  return result;
}

// Faute d'étiquetage grammatical, les mots pleins (hors mots-outils) sont masqués en priorité.
export function pickBlankIndices(words, ratio = 0.5) {
  const preferred = [];
  const fallback = [];

  words.forEach((word, index) => {
    const normalized = normalizeWord(word);
    if (!normalized) return;
    if (STOPWORDS.has(normalized) || normalized.length <= 2) fallback.push(index);
    else preferred.push(index);
  });

  const hideable = preferred.length + fallback.length;
  if (hideable === 0) return [];
  const target = Math.max(1, Math.round(hideable * ratio));
  const ordered = [...shuffle(preferred), ...shuffle(fallback)];
  return ordered.slice(0, target).sort((a, b) => a - b);
}

export function buildSegments(words, random = Math.random) {
  if (!words.length) return [];
  const segments = [];
  let index = 0;

  while (index < words.length) {
    const remaining = words.length - index;
    if (remaining <= 3) {
      segments.push(words.slice(index));
      break;
    }
    let size = random() < 0.55 ? 2 : 3;
    if (remaining - size === 1) size = size === 2 ? 3 : 2;
    segments.push(words.slice(index, index + size));
    index += size;
  }

  if (segments.length === 1 && segments[0].length > 1) {
    const only = segments[0];
    const middle = Math.ceil(only.length / 2);
    return [only.slice(0, middle), only.slice(middle)];
  }

  return segments;
}

function alignLength(words) {
  return words.map((raw) => ({ raw, normalized: normalizeWord(raw) })).filter((entry) => entry.normalized);
}

export function diffWords(expectedText, actualText) {
  const expected = alignLength(splitWords(expectedText));
  const actual = alignLength(splitWords(actualText));
  const rows = expected.length;
  const columns = actual.length;

  const table = Array.from({ length: rows + 1 }, () => new Uint16Array(columns + 1));
  for (let row = rows - 1; row >= 0; row -= 1) {
    for (let column = columns - 1; column >= 0; column -= 1) {
      table[row][column] =
        expected[row].normalized === actual[column].normalized
          ? table[row + 1][column + 1] + 1
          : Math.max(table[row + 1][column], table[row][column + 1]);
    }
  }

  const items = [];
  let row = 0;
  let column = 0;

  while (row < rows && column < columns) {
    if (expected[row].normalized === actual[column].normalized) {
      items.push({ type: 'match', expected: expected[row].raw, actual: actual[column].raw });
      row += 1;
      column += 1;
    } else if (table[row + 1][column] >= table[row][column + 1]) {
      items.push({ type: 'missing', expected: expected[row].raw });
      row += 1;
    } else {
      items.push({ type: 'extra', actual: actual[column].raw });
      column += 1;
    }
  }

  while (row < rows) {
    items.push({ type: 'missing', expected: expected[row].raw });
    row += 1;
  }
  while (column < columns) {
    items.push({ type: 'extra', actual: actual[column].raw });
    column += 1;
  }

  const correct = items.filter((item) => item.type === 'match').length;
  const errors = items.length - correct;

  return {
    items,
    correct,
    errors,
    total: rows,
    perfect: rows > 0 && correct === rows && errors === 0,
  };
}
