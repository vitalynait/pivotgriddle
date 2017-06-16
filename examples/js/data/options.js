export default {
  columns: [
    {
      column: 'props',
      displayName: 'Свойство',
      width: 100,
    },
    {
      column: 'type',
      displayName: 'Тип данных',
      width: 100,
    },
    {
      column: 'default',
      displayName: 'По умолчанию',
      width: 100,
    },
    {
      column: 'description',
      displayName: 'Описание',
      width: 400,
    },
  ],
  rows: [
    {
      props: 'columns',
      type: 'array of objects',
      default: '[]',
      description: 'Массив объектов содержащий (мета) настройки колонок, <i>опционально</i>, может быть пустым',
    },
    {
      props: 'hiddenColumns',
      type: 'array',
      default: '[]',
      description: 'Массив со списком столбцов которые будут скрыты, опционально при findRowColumns = true',
    },
    {
      props: 'findRowColumns',
      type: 'bool',
      default: 'true',
      description: 'Позволяет выбрать колонки из первой строки переданной в rows',
    },
    {
      props: 'groupBy',
      type: 'false/string',
      default: 'false',
      description: 'Имя колонки для группирования значений',
    },
    {
      props: 'groupChildrenKey',
      type: 'string',
      default: 'children',
      description: 'Ключ используемый при группировке строк (в строках должен отсутствовать данный параметр)',
    },
    {
      props: 'depthChildrenKey',
      type: 'false/string',
      default: 'false',
      description: 'Ключ для построения иерархических таблиц, запись с данным ключом в rows должна быть равна массиву',
    },
    {
      props: 'pagination',
      type: 'bool',
      default: 'false',
      description: 'Пагинация средствами таблицы',
    },
    {
      props: 'pageSize',
      type: 'false/number',
      default: 'false',
      description: 'Изменить дефолтный размер страницы = 20',
    },
    {
      props: 'page',
      type: 'false/number',
      default: 'false',
      description: 'Номер таблицы при инициализации',
    },
    {
      props: 'customTableClass',
      type: 'string',
      default: '',
      description: 'Кастомизация таблицы через применение CSS классов',
    },
    {
      props: 'fixedTableHead',
      type: 'bool',
      default: 'false',
      description: 'Зафиксировать шапку таблицы',
    },
    {
      props: 'fixedHeadOffset',
      type: 'number',
      default: '0',
      description: 'Отступ таблицы сверху, для отображения шапки (опционально, при фиксированной шапке сайта)',
    },
    {
      props: 'fixedHeadClass',
      type: 'string',
      default: '',
      description: 'Дополнительный CSS класс для фиксированной шапки',
    },
    {
      props: 'customPageChange',
      type: 'func',
      default: 'false',
      description: '<b>Функция кастомного переключения страниц</b><br />Принимает на вход выбранную страницу и размер страницы, должна вернуть объект содержащий: <b>rows</b><br />ОПЦИОНАЛЬНО: page - номер новой страницы, pageSize - размер страницы, sortBy - ключ по которому произведена сортировка, sortDir - направление сортировки "asc" "desc"',
    },
    {
      props: 'customSortChange',
      type: 'func',
      default: 'false',
      description: 'Кастомная сортировка, принимает на вход, свойство (ключ) колонки, номер текущей страницы, размер текущей страницы, должна вернуть: sortBy - ключ по которому сортировано, sortDir - направление сортировки "asc" "desc", rows - отсортированный массив строк. ОПЦИОНАЛЬНО: page - номер страницы, maxItems - если изменился (для кастомной пагинации), pageSize - если изменился',
    },
    {
      props: 'maxItems',
      type: 'number',
      default: 'false',
      description: '<span style="color:red">Количество</span> записей таблицы - для кастомной пагинации',
    },
  ],
};
