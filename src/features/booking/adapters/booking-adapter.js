const { BookingDetailsEntity } = require("../schemas/booking.entity");

class BookingAdapter {
  adapt(item, bookingModel) {
    const {
      _id,
      firstName,
      lastName,
      email,
      phone,
      departureAirport,
      startDate,
      // startTime,
      endDate,
      // endTime,
      parkingId,
      parkingEstablishmentId,
      parkingName,
      isServices,
      totalAmount,
      bookingDate,
      checkoutSessionId,
      checkoutSessionPaymentDate,
      checkoutSessionFailedDate,
      status
    } = item;

    const [startDateStr, startTimeStr] = startDate.split(' ')
    const startDateArr = startDateStr.split('-')
    const startTimeArr = startTimeStr.split(':')
    const startDatetime = new Date(+startDateArr[0], +startDateArr[1] - 1, +startDateArr[2], +startTimeArr[0], +startTimeArr[1])
  
    const [endDateStr, endTimeStr] = endDate.split(' ')
    const endDateArr = endDateStr.split('-')
    const endTimeArr = endTimeStr.split(':')
    const endDatetime = new Date(+endDateArr[0], +endDateArr[1] - 1, +endDateArr[2], +endTimeArr[0], +endTimeArr[1])
  
    const result = bookingModel || new BookingDetailsEntity({ _id });
    result.firstName = firstName;
    result.lastName = lastName;
    result.email = email;
    result.phone = phone;
    result.departureAirport = departureAirport;
  
    result.startDate = new Date(Date.UTC(+startDateArr[0], +startDateArr[1] - 1, +startDateArr[2]));
    result.startDatetime = startDatetime
    result.startTimeHour = +startTimeArr[0]
    result.startTimeMinute = +startTimeArr[1]
  
    result.endDatetime = endDatetime
    result.endDate = new Date(Date.UTC(+endDateArr[0], +endDateArr[1] - 1, +endDateArr[2]));
    result.endTimeHour = +endTimeArr[0]
    result.endTimeMinute = +endTimeArr[1]
  
    result.parkingId = parkingId;
    result.parkingEstablishmentId = parkingEstablishmentId;
    result.parkingName = parkingName;
    result.isServices = isServices;
    result.totalAmount = totalAmount;
    result.bookingDate = bookingDate;
    result.checkoutSessionId = checkoutSessionId;
    result.checkoutSessionPaymentDate = checkoutSessionPaymentDate;
    result.checkoutSessionFailedDate = checkoutSessionFailedDate
    result.status = status

    return result;
  }

  adaptToExisting(item, model) {
    const {
      firstName,
      lastName,
      email,
      phone,
      departureAirport,
      startDate,
      startTime,
      endDate,
      endTime,
      parkingId,
      isServices,
      totalAmount,
    } = item;

    model.firstName = firstName ?? model.firstName;
    model.lastName = lastName ?? model.lastName;
    model.email = email ?? model.email;
    model.phone = phone ?? model.phone;
    model.departureAirport = departureAirport ?? model.departureAirport;
    model.startDate = startDate ?? model.startDate;
    model.startTime = startTime ?? model.startTime;
    model.endDate = endDate ?? model.endDate;
    model.endTime = endTime ?? model.endTime;
    model.parkingId = parkingId ?? model.parkingId;
    model.isServices = typeof isServices === 'boolean' ? isServices : model.isServices;
    model.totalAmount = totalAmount ?? model.totalAmount;

    return model;
  }

  /**
 * @param {Object} [booking] - validated booking schema
 * @param {string} [startDate] - Date string format "yyyy-MM-dd HH:mm"
 * @param {string} [endDate] - Date string format "yyyy-MM-dd HH:mm"
 * @return {BookingEntity} Modified Booking Model
 *
 * @example
 *
 *     modifyParkingPeriod(bookingModel, "2025-07-02 02:55", "2025-08-02 02:55")
 */
  modifyParkingPeriod(booking, startDate, endDate) {
    const [startDateStr, startTimeStr] = startDate.split(' ')
    const startDateArr = startDateStr.split('-')
    const startTimeArr = startTimeStr.split(':')
    const startDatetime = new Date(+startDateArr[0], +startDateArr[1] - 1, +startDateArr[2], +startTimeArr[0], +startTimeArr[1])
  
    const [endDateStr, endTimeStr] = endDate.split(' ')
    const endDateArr = endDateStr.split('-')
    const endTimeArr = endTimeStr.split(':')
    const endDatetime = new Date(+endDateArr[0], +endDateArr[1] - 1, +endDateArr[2], +endTimeArr[0], +endTimeArr[1])

    booking.startDate = new Date(Date.UTC(+startDateArr[0], +startDateArr[1] - 1, +startDateArr[2]));
    booking.startDatetime = startDatetime
    booking.startTimeHour = +startTimeArr[0]
    booking.startTimeMinute = +startTimeArr[1]
  
    booking.endDatetime = endDatetime
    booking.endDate = new Date(Date.UTC(+endDateArr[0], +endDateArr[1] - 1, +endDateArr[2]));
    booking.endTimeHour = +endTimeArr[0]
    booking.endTimeMinute = +endTimeArr[1]

    return booking
  }
}

module.exports = { BookingAdapter };
