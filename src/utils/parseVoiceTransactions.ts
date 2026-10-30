import type { ExtractedTransaction } from '../components/dashboard/ConfirmTransactionModal';

const CATEGORY_RULES: Array<[RegExp, string]> = [
  [/fuel|gas|petrol|diesel|uber|taxi|transport|bus|train/i, 'Transport'],
  [/lunch|dinner|breakfast|food|meal|restaurant|coffee|groceries|grocery/i, 'Food'],
  [/rent|house|apartment/i, 'Rent'],
  [/movie|game|entertainment/i, 'Entertainment'],
  [/bill|electricity|internet|phone/i, 'Bills'],
  [/doctor|medicine|health|hospital/i, 'Health'],
  [/shopping|clothes|shoes|purchase|bought/i, 'Shopping']
];

const getCategory = (title: string) => CATEGORY_RULES.find(([rule]) => rule.test(title))?.[1] || 'Other';

export function parseVoiceTransactions(text: string, currency = 'USD'): ExtractedTransaction[] {
  const normalized = text.replace(/[.!?;\n]+/g, ' ').replace(/\s+/g, ' ').trim();
  const amountMatches = [...normalized.matchAll(/\b[0-9]+(?:[.,][0-9]+)?\b/g)];
  const creditWords = /\b(cashback|cash back|refund|refunded|received|receive|credit|credited|got|earned|income|salary)\b/i;

  const parsed = amountMatches.map((match, index) => {
    const amountStart = match.index || 0;
    const amountEnd = amountStart + match[0].length;
    const previousEnd = index > 0
      ? (amountMatches[index - 1].index || 0) + amountMatches[index - 1][0].length
      : 0;
    const nextStart = index < amountMatches.length - 1
      ? amountMatches[index + 1].index || normalized.length
      : normalized.length;
    const before = normalized.slice(previousEnd, amountStart).trim();
    const after = normalized.slice(amountEnd, nextStart).trim();
    const creditSignal = creditWords.test(after) || /\b(?:get|got|received|receive|earned|credit|credited)\b\s*$/i.test(before);
    const type = creditSignal
      ? 'Credit'
      : 'Debit';

    let title = '';
    const afterTitle = after.match(/^(?:on|for|in|at)\s+(.+)/i);
    if (afterTitle) {
      title = afterTitle[1].replace(/\b(?:and then|then|get|got|received)\b.*$/i, '').trim();
    }
    if (!title && type === 'Credit') {
      const creditTitle = `${before} ${after}`.match(/(?:cashback|cash back|refund|salary|income)/i);
      title = creditTitle?.[0] || 'Cashback';
    }
    if (!title) {
      title = before
        .replace(/\b(?:i|spent|paid|bought|buy|purchased|purchase|costs?|and|then|get|got)\b/gi, '')
        .replace(/\b(?:on|for|in|at)\b/gi, '')
        .trim();
    }
    title = title.replace(/\s+/g, ' ').trim() || 'Transaction';
    return {
      title: title.charAt(0).toUpperCase() + title.slice(1),
      category: getCategory(title),
      amount: Number(match[0].replace(',', '.')),
      currency,
      type: type as 'Debit' | 'Credit'
    };
  }).filter(item => item.amount > 0);

  return parsed;
}
