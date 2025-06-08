const { differenceInHours } = require("date-fns")

let days = Math.ceil(
  differenceInHours(new Date(2000, 10, 10), new Date(2000, 10, 10, 1)) / 24
)

// const hasRemainder = (days % 1) > 0
// if (hasRemainder) {
//   days = Math.floor(days + 1)
// }
// const totalAmount = days * parking.price

console.log(days)