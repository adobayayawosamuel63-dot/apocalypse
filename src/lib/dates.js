export function dayKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseDay(key) {
  const [year, month, day] = key.split('-').map(Number);
  return new Date(year, month - 1, day, 12, 0, 0, 0);
}

export function addDays(key, amount) {
  const date = parseDay(key);
  date.setDate(date.getDate() + amount);
  return dayKey(date);
}

export function daysBetween(from, to) {
  return Math.round((parseDay(to).getTime() - parseDay(from).getTime()) / 86400000);
}

export function formatDay(key, style = 'short') {
  if (!key) return '';
  const date = parseDay(key);
  if (style === 'full') {
    return new Intl.DateTimeFormat('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  }
  if (style === 'long') {
    return new Intl.DateTimeFormat('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    }).format(date);
  }
  return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short' }).format(date);
}

export function dueLabel(due, today = dayKey()) {
  if (!due) return '';
  const diff = daysBetween(today, due);
  if (diff === 0) return "aujourd'hui";
  if (diff === 1) return 'demain';
  if (diff > 1) return `dans ${diff} jours`;
  const late = Math.abs(diff);
  return `en retard de ${late} ${late > 1 ? 'jours' : 'jour'}`;
}
