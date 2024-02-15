export function groupBy<T>(
  items: T[],
  keyFn: (item: T) => string
): Record<string, T[]> {
  return items.reduce((result, item) => {
    const key = keyFn(item);
    return {
      ...result,
      [key]: [...(result[key] || []), item],
    };
  }, {} as Record<string, T[]>);
}
