const { ParkingSpaceEntity } = require("../schemas/parking.entity");

class ParkingSpaceAdapter {
  adapt(item) {
    const {
      spaceNumber,
      isOccupied,
      parkingId
    } = item;

    const result = new ParkingSpaceEntity();

    result.spaceNumber = spaceNumber;
    result.isOccupied = isOccupied;
    result.parkingId = parkingId;
    return result;
  }

  adaptToExisting(item, model) {
    model.spaceNumber = item.spaceNumber ?? model.spaceNumber;
    model.isOccupied = item.isOccupied ?? model.isOccupied;
    model.parkingId = item.parkingId ?? model.parkingId;

    return model;
  }
}

module.exports = { ParkingSpaceAdapter };
