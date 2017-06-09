function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const generateData = (count) => {
  const data = [];
  for (let i = 0; i < count; i += 1) {
    const item = {
      id: getRandomInt(1, count),
      name: `Name ${getRandomInt(1, count)}`,
      list: getRandomInt(1, 20),
      test: {
        superId: getRandomInt(1, count),
        maxId: getRandomInt(1, count),
      },
    };
    data.push(item);
  }
  return data;
};

export default generateData;
