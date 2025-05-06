export const html = (strings, ...values) => {
  const raw = String.raw(strings, ...values);

  return raw
    .split('\n')
    .filter(line => line.trim())
    .join('\n');
};
