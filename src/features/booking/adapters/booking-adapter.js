const { BookingDetailsEntity } = require("../schemas/booking.entity");

class BookingAdapter {
  adapt(item) {
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
      parkingEstablishmentId,
      parkingName,
      isServices,
      totalAmount,
    } = item;

    const result = new BookingDetailsEntity();
    result.firstName = firstName;
    result.lastName = lastName;
    result.email = email;
    result.phone = phone;
    result.departureAirport = departureAirport;
    result.startDate = startDate;
    result.startTime = startTime;
    result.endDate = endDate;
    result.endTime = endTime;
    result.parkingId = parkingId;
    result.parkingEstablishmentId = parkingEstablishmentId;
    result.parkingName = parkingName;
    result.isServices = isServices;
    result.totalAmount = totalAmount;

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
}

module.exports = { BookingAdapter };
