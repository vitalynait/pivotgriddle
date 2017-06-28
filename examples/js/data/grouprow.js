const data = [
  {
    area: 'Сахалинская область',
    product: 'Уголь',
    total: 10,
    total_group: {
      big: {
        big_total: 5,
        inner: {
          middle: 3,
          middle_small: 1,
        },
      },
      small: {
        small_total: 4,
        inner: 1,
      },
      ip: 1,
    },
  },
  {
    area: 'Сахалинская область',
    product: 'Битум',
    total: 28,
    total_group: {
      big: {
        big_total: 21,
        inner: {
          middle: 11,
          middle_small: 8,
        },
      },
      small: {
        small_total: 5,
        inner: 3,
      },
      ip: 2,
    },
  },
  {
    area: 'Московская область',
    product: 'Уголь',
    total: 26,
    total_group: {
      big: {
        big_total: 18,
        inner: {
          middle: 9,
          middle_small: 4,
        },
      },
      small: {
        small_total: 6,
        inner: 4,
      },
      ip: 2,
    },
  },
  {
    area: 'Московская область',
    product: 'Битум',
    total: 83,
    total_group: {
      big: {
        big_total: 63,
        inner: {
          middle: 42,
          middle_small: 10,
        },
      },
      small: {
        small_total: 15,
        inner: 10,
      },
      ip: 5,
    },
  },
];

export default data;
