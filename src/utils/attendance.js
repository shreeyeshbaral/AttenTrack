export function calculateAttendance(attendance) {
  let present = 0;
  let absent = 0;

  Object.values(attendance).forEach(day => {
    Object.values(day).forEach(status => {
      if (status === "present") present++;
      if (status === "absent") absent++;
    });
  });

  const total = present + absent;
  return total === 0 ? 0 : Math.round((present / total) * 100);
}
