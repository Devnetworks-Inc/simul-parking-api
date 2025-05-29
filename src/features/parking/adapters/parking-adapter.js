const { ParkingEntity } = require("../schemas/parking.entity");

class ParkingAdapter {
  adapt(item) {
    const {
      name,
      rating,
      transferTime,
      description,
      img,
      price,
      tags,
      address
    } = item;

    const result = new ParkingEntity();

    result.name = name;
    result.rating = rating;
    result.transferTime = transferTime;
    result.description = description;
    result.img = img;
    result.price = price;
    result.tags = tags;
    result.address = address

    return result;
  }

  adaptToExisting(item, model) {
    model.name = item.name ?? model.name;
    model.rating = item.rating ?? model.rating;
    model.transferTime = item.transferTime ?? model.transferTime;
    model.description = item.description ?? model.description;
    model.img = item.img ?? model.img;
    model.price = item.price ?? model.price;
    model.tags = item.tags ?? model.tags;
    model.address = item.address ?? model.address;

    return model;
  }

  adaptAsObject(item) {
    const {
      name,
      rating,
      transferTime,
      description,
      img,
      price,
      tags,
      address
    } = item;

    const result = {};

    result.name = name;
    result.rating = rating;
    result.transferTime = transferTime;
    result.description = description;
    result.img = img;
    result.price = price;
    result.tags = tags;
    result.address = address

    return result;
  }
}

module.exports = { ParkingAdapter };
