export class View {
  // Список DOM элементов
  elements = {
    productList: document.getElementById("productList"),
    filterInput: document.getElementById("filterInput"),
    sortTypeSelect: document.getElementById("sortType"),
    sortOrderSelect: document.getElementById("sortOrder"),
    sortCategory: document.getElementById("sortCategory"),
    form: document.getElementById("form"),
  };

  // Метод возвращающий DOM элементы которые учавствуют в сортировке
  sortingElements() {
    return {
      sortTypeElem: this.elements.sortTypeSelect,
      sortOrderElem: this.elements.sortOrderSelect,
      sortCategoryElem: this.elements.sortCategory,
    };
  }

  // Метод возвращающий Value - DOM элементов которые учавствуют в сортировке
  sortingElementsValue() {
    return {
      sortType: this.elements.sortTypeSelect.value,
      sortOrder: this.elements.sortOrderSelect.value,
      sortCategory: this.elements.sortCategory.value,
    };
  }

  // Функция для выделения подстроки поиска в имени продукта
  highlightFilterValue(name, filterValue) {
    const lowerCaseName = name.toLowerCase();
    const lowerCaseFilterValue = filterValue.toLowerCase();
    const startIndex = lowerCaseName.indexOf(lowerCaseFilterValue);

    if (startIndex !== -1) {
      const highlightedName =
        name.substring(0, startIndex) +
        '<span class="active">' +
        name.substring(startIndex, startIndex + filterValue.length) +
        "</span>" +
        name.substring(startIndex + filterValue.length);

      return highlightedName;
    }

    return name;
  }

  // Ф-ция рендера (С возможностью выделения подстроки поиска подсветом красным цветом)
  renderProducts(filteredData) {
    this.elements.productList.innerHTML = "";

    filteredData.forEach((product) => {
      const name = this.highlightFilterValue(product.name, filterInput.value);

      const markup = `
        <li>
          <span>${product.subtitle}</span>
          <h3>${name}</h3>
          <p>Цена: ${product.price} руб.</p>
          <p>Дата добавления: ${product.date}</p>
        </li>
      `;

      productList.insertAdjacentHTML("afterbegin", markup);
    });
  }
}
