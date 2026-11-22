import { BookOpen, Brain, Blocks, PenLine, Type } from 'lucide-react';

export const LEVELS = [
  {
    id: 1,
    name: 'Imprégnation',
    short: 'Écoute',
    title: 'Lire et écouter le verset',
    instruction: 'Lisez le texte, écoutez-le en français, puis déclarez-le compris.',
    icon: BookOpen,
  },
  {
    id: 2,
    name: 'Premières lettres',
    short: 'Initiales',
    title: 'Retrouvez le verset à partir des initiales',
    instruction: 'Récitez à voix haute. Touchez un mot si un souvenir vous échappe.',
    icon: Type,
  },
  {
    id: 3,
    name: 'Texte à trous',
    short: 'Trous',
    title: 'Complétez les mots manquants',
    instruction: 'Touchez un blanc, puis les mots de la banque pour le remplir.',
    icon: PenLine,
  },
  {
    id: 4,
    name: 'Puzzle de mots',
    short: 'Puzzle',
    title: 'Reconstituez le verset',
    instruction: 'Touchez les segments dans le bon ordre pour reformer le texte.',
    icon: Blocks,
  },
  {
    id: 5,
    name: 'Maîtrise',
    short: 'Maîtrise',
    title: 'Restituez le verset de mémoire',
    instruction: 'Écrivez ou dictez le verset. Ponctuation et majuscules sont tolérées.',
    icon: Brain,
  },
];

export function levelMeta(level) {
  return LEVELS[Math.min(Math.max(level, 1), LEVELS.length) - 1];
}
