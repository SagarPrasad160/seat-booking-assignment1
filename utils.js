function getRandomBoolean() {
  return Math.random() < 0.5;
}

function getPrice(type) {
  return type === "lower-deck" ? "200" : "500";
}

function generateData(length, deckType) {
  const dataArray = [];
  for (let i = 1; i <= length; i++) {
    const dataObject = {
      id: getRandomId(),
      booked: getRandomBoolean(),
      available: getRandomBoolean(),
      reserved: getRandomBoolean(),
      type: deckType,
      price: getPrice(deckType),
    };
    dataArray.push(dataObject);
  }
  return dataArray;
}

function getRandomId() {
  return Math.random().toString(16).slice(2);
}
