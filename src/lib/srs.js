export const REVIEW_INTERVALS = [1, 3, 7, 14, 30];

export function nextReviewDays(currentStep) {
  const safeStep = Number.isFinite(currentStep) ? currentStep : -1;
  const nextStep = Math.min(safeStep + 1, REVIEW_INTERVALS.length - 1);
  return REVIEW_INTERVALS[nextStep];
}

export function intervalLabel(index) {
  return `J+${REVIEW_INTERVALS[index]}`;
}
