// Convert numbers to Arabic numerals when lang === 'ar'
export const toArabicNumerals = (num, lang) => {
  if (lang !== 'ar') return num.toString();
  
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return num.toString().replace(/\d/g, (digit) => arabicDigits[parseInt(digit)]);
};

export const formatNumber = (num, lang) => {
  const formatted = num.toLocaleString();
  return lang === 'ar' ? toArabicNumerals(formatted, lang) : formatted;
};

