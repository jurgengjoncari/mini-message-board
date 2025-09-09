export function groupByDate(data: any[]) {
  const map = data.reduce((groups, message) => {
    const date = new Date(message.createdAt).toLocaleDateString();
    console.log(date);
    if (!groups.has(date)) {
      groups.set(date, []);
    }
    groups.get(date)?.push(message);
    return groups;
  }, new Map());

  // @ts-ignore
  return Array.from(map.entries()).map(([key, value]) => ({ key, value }));
}
