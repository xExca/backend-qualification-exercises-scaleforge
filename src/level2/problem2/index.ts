export type DowntimeLogs = [Date, Date][];

export function merge(...args: DowntimeLogs[]): DowntimeLogs {
  const all = args.flat();

  if (all.length === 0) return [];

  // Sort by start time in ascending order
  all.sort((a, b) => a[0].getTime() - b[0].getTime());

  const merged: DowntimeLogs = [];
  let [currentStart, currentEnd] = all[0];

  for (let i = 1; i < all.length; i++) {
    const [nextStart, nextEnd] = all[i];

    // If the next interval overlaps or touches the current one
    if (nextStart.getTime() <= currentEnd.getTime()) {
      // Extend the end time if necessary
      if (nextEnd.getTime() > currentEnd.getTime()) {
        currentEnd = nextEnd;
      }
    } else {
      // Push the previous interval and start a new one
      merged.push([currentStart, currentEnd]);
      [currentStart, currentEnd] = [nextStart, nextEnd];
    }
  }

  // Push the final merged interval
  merged.push([currentStart, currentEnd]);

  return merged;
}