import { Model } from "./model.js";
import { View } from "./view.js";

const model = new Model();
const view = new View();

init();

// Ф-ция инициализирующая первоначальные данные.
async function init() {
  // Запрос на загрузку данных из json файла (Асинхронная операция).
  await model.loadingData();

  // Достаем из view DOM элименты отвечающие за сортировку.
  const sortingElements = view.sortingElements();

  // Метод, в котором мы вырезаем данные фильтров из url ссылки и подставляем их в селекты.
  model.updateFromURL(sortingElements);

  // Ф-ция запускающая первоначальную сортировку наших данных после того, как мы подставили
  // данные фильтров в селекты.
  sortProducts();

  // Ф-ция инициализирующая прослушки событий.
  addEventListeners();
}

// Инициализация прослушек события
function addEventListeners() {
  view.elements.sortTypeSelect.addEventListener("change", sortProducts);
  view.elements.sortOrderSelect.addEventListener("change", sortProducts);
  view.elements.sortCategory.addEventListener("change", sortProducts);

  view.elements.filterInput.addEventListener("input", filterProducts);

  view.elements.form.addEventListener("submit", resetFilters);
}

// Функция для сортировки по выбранному типу и направлению
function sortProducts() {
  // Достаем из view значения наших фильтров отвечающие за сортировку.
  const sortingValue = view.sortingElementsValue();

  // Метод который отвечает за сортировку по всем параметрам. Принимает в себя значения фильтров
  const sortingData = model.sortingProducts(sortingValue);

  // Метод отвечающий за отображение данных
  view.renderProducts(sortingData);

  // Метод служающий для обновления URL ссылки на основе значений фильтров
  model.updateURL(sortingValue);
}

// Функция для фильтрации по введенным буквам
function filterProducts() {
  // Достаем value инпута ищ view
  const value = view.elements.filterInput.value.toLowerCase();

  // Метод отвечающий за сортировку данных по символам введенным в инпуте
  model.filterSearch(value);

  // Функция отвечающая за сортировку по выбранному типу и направлению
  sortProducts();
}

// Ф-ция отвечающая за сброс фильтров
function resetFilters(e) {
  e.preventDefault();

  // Достаем из view DOM элименты отвечающие за сортировку.
  const sortingElements = view.sortingElements();

  // Метод отвечающий за сброс фильтров
  model.resetFilters(sortingElements);

  // Функция отвечающая за сортировку по выбранному типу и направлению
  sortProducts();
}
