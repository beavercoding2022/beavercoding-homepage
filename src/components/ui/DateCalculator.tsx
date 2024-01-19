type DateCalculatorProps = {
  startDate: Date;
  lang: string;
};

// https://stackoverflow.com/a/31615643
function getNumberWithOrdinal(n: number) {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

export default function DateCalculator(props: DateCalculatorProps) {
  const now = new Date();

  const diff = now.getTime() - props.startDate.getTime();

  const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30));

  const years = Math.floor(months / 12);

  if (props.lang === 'ko') {
    return <>{years + 1} 년차</>;
  }

  return <>{getNumberWithOrdinal(years + 1)} year</>;
}
