export class Model {
  constructor() {
    this.data = [];
    this.filteredData = [];
  }

  // Метод отвечающий за подгрузку данных из JSON
  async loadingData() {
    return new Promise((resolve, reject) => {
      fetch("data.json")
        .then((response) => response.json())
        .then((jsonData) => {
          this.data = jsonData;
          this.filteredData = [...this.data];
          resolve();
        })
        .catch((error) => {
          console.error("Ошибка загрузки данных:", error);
          reject(error);
        });
    });
  }

  // Метод отвечающий за сортировку данных по селектам (Привел 2 варианта, один из них закомментирован)
  sortingProducts(sortingValue) {
    const { sortOrder, sortType, sortCategory } = sortingValue;

    // !!!! Первоначально делаем фильтрацию по категории (Ноутбуки, смартфоны, планшеты ...)
    let filtredData;

    // Если выбран показ не всех категорий
    if (sortCategory !== "all") {
      // Тогда в переменную записываем результат фильтрации по конкретной категории
      filtredData = this.filteredData.filter((request) => {
        return request.category === sortCategory;
      });
    } else {
      // Иначе записываем абсолютно все наши фильтрованные заявки
      filtredData = [...this.filteredData];
    }

    // !!! После того, как мы сделали фильтрацию по категории, начинаем СОРТИРОВАТЬ по ДАТЕ, АЛФАВИТУ И ЦЕНЕ
    return filtredData.sort((a, b) => {
      // Проверка типа сортировки
      switch (sortType) {
        // Если тип сортировки "дата", преобразуем дату в метку времени и вычитаем a - b или b - a
        // для сортировки по возрастанию или убыванию соответственно.
        case "date":
          return sortOrder === "desc"
            ? Date.parse(a.date) - Date.parse(b.date)
            : Date.parse(b.date) - Date.parse(a.date);

        // ! Если тип сортировки - "алфавит", то для каждого элемента данных преобразуем их имена в нижний регистр.
        // Далее сравниваем преобразованные имена для установления порядка сортировки.
        // Если a < b (в алфавитном порядке), возвращаем 1 (как положительное число). По убыванию
        // Если a > b, возвращаем -1 (как отрицательное число). По возрастанию
        // В случае равенства строк возвращаем 0.
        // Это обеспечивает сортировку строк по возрастанию или убыванию в зависимости от порядка сортировки.
        case "alphabet":
          const nameA = a.name.toLowerCase();
          const nameB = b.name.toLowerCase();

          if (sortOrder === "desc") {
            // При порядке сортировки "desc" сравниваем имена в обратном порядке для установления сортировки по убыванию.
            return nameA < nameB ? 1 : nameA > nameB ? -1 : 0;
          } else {
            // При порядке сортировки "asc" сравниваем имена для установления сортировки по возрастанию.
            return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
          }

        // ! Если тип сортировки - "цена" (дефолтный вариант), то для каждого элемента данных берем значения их цен.
        // Простым вычитанием одного значения из другого устанавливаем порядок сортировки.
        // Если результат вычитания положительный, то сортируем по убыванию цены.
        // Если результат вычитания отрицательный, то сортируем по возрастанию цены.
        default:
          const comparisonValueA = a.price;
          const comparisonValueB = b.price;

          return sortOrder === "desc"
            ? comparisonValueA - comparisonValueB
            : comparisonValueB - comparisonValueA;
      }

      //  ========================= ИЛИ (ДРУГОЙ, РАБОЧИЙ ВАРИАНТ, можно выбрать более понравившийся) ==============
      // switch (sortOrder) {
      //   case "desc":
      //     // Если сортировка по алфавиту
      //     if (sortType === "alphabet") {
      //       const nameA = a.name.toLowerCase();
      //       const nameB = b.name.toLowerCase();

      //       return nameA < nameB ? 1 : nameA > nameB ? -1 : 0;
      //     }

      //     // Если сортировка по дате или цене
      //     return a[sortType] > b[sortType] ? 1 : -1;
      //   case "asc":
      //     // Если сортировка по алфавиту
      //     if (sortType === "alphabet") {
      //       const nameA = a.name.toUpperCase();
      //       const nameB = b.name.toUpperCase();
      //       return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
      //     }

      //     // Если сортировка по дате или цене
      //     return a[sortType] < b[sortType] ? 1 : -1;
      // }
    });
  }

  // Метод отвечающий за сортировку данных по символам введенным в инпуте
  filterSearch(value) {
    if (value === "") {
      this.filteredData = [...this.data];
    } else {
      this.filteredData = this.data.filter((product) =>
        product.name.toLowerCase().includes(value)
      );
    }
  }

  // Метод отвечающий за сброс фильтров
  resetFilters(sortingElements) {
    const { sortOrderElem, sortTypeElem, sortCategoryElem } = sortingElements;

    // Устанавливаем селекты в дефолтные значения.
    sortTypeElem.value = "price";
    sortOrderElem.value = "asc";
    sortCategoryElem.value = "all";
  }

  // Функция для обновления URLSearchParams
  updateURL(sortingValue) {
    const { sortOrder, sortType, sortCategory } = sortingValue;

    const urlParams = new URLSearchParams();

    // Добавление параметров фильтрации и сортировки
    urlParams.set("sortType", sortType);
    urlParams.set("sortOrder", sortOrder);
    urlParams.set("sortCategory", sortCategory);

    // Обновление URL
    window.history.replaceState(null, null, "?" + urlParams.toString());
  }

  // Функция для обновления данных из URLSearchParams
  updateFromURL(sortingElements) {
    const { sortOrderElem, sortTypeElem, sortCategoryElem } = sortingElements;

    // Получение данных из URL ссылки
    const urlParams = new URLSearchParams(window.location.search);

    // Обновление параметров сортировки
    const sortTypeValue = urlParams.get("sortType") || "price";
    const sortOrderValue = urlParams.get("sortOrder") || "asc";
    const sortCategoryValue = urlParams.get("sortCategory") || "all";

    // Подстановка данных полученных из URL в value селектов
    sortTypeElem.value = sortTypeValue;
    sortOrderElem.value = sortOrderValue;
    sortCategoryElem.value = sortCategoryValue;
  }
}
