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

const newData = [
  {
    area: 'Сахалинская область',
    product: 'Уголь,тыс.т',
    total: 5446,
    total_group: {
      big: {
        big_total: 4643,
        inner: {
          middle: 444,
          middle_small: 0,
        },
      },
      small: {
        small_total: 803,
        inner: 28,
      },
      ip: 0,
    },
  },
  {
    area: 'Сахалинская область',
    product: 'Каменный уголь,тыс.т',
    total: 1147,
    total_group: {
      big: {
        big_total: 992,
        inner: {
          middle: 0,
          middle_small: 0,
        },
      },
      small: {
        small_total: 155,
        inner: 28,
      },
      ip: 0,
    },
  },
  {
    area: 'Сахалинская область',
    product: 'Уголь,за исключением антрацита, угля коксующегося и угля бурого,тыс.т',
    total: 1147,
    total_group: {
      big: {
        big_total: 992,
        inner: {
          middle: 0,
          middle_small: 0,
        },
      },
      small: {
        small_total: 155,
        inner: 28,
      },
      ip: 0,
    },
  },
  {
    area: 'Сахалинская область',
    product: 'Уголь бурый,тыс.т',
    total: 4299,
    total_group: {
      big: {
        big_total: 3651,
        inner: {
          middle: 444,
          middle_small: 0,
        },
      },
      small: {
        small_total: 648,
        inner: 0,
      },
      ip: 0,
    },
  },
];

export default newData;
