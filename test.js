const today = new Date(2022, 6, 32);

const nextDate = new Date(
  today.getFullYear(),
  today.getMonth(),
  today.getDate() + 1
);
console.log(today);
console.log(nextDate);
