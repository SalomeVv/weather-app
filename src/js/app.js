const openWeatherKey = "b9ead5b48dff0a393ee56b4dca49fc47";

const regionNamesInEnglish = new Intl.DisplayNames(["en"], { type: "region" });
/**
 * Create an element and add it to the DOM
 * makeEl("type", parent, [["property","value"], ["property","value"], etc];
 * @param {string} type required
 * @param {var} parent required
 * @param {array} properties optional
 */
function makeEl(type, parent, properties, before) {
  const el = document.createElement(type);
  if (
    properties !== undefined &&
    properties !== null &&
    properties.length > 0
  ) {
    for (let i = 0; i < properties.length; i++) {
      el[properties[i][0]] = properties[i][1];
    }
  }
  if (before !== undefined && before !== null) {
    parent.insertBefore(el, before);
  } else {
    parent.appendChild(el);
  }
  return el;
}

/**
 * returns the name of the css class that matches the weatherId
 * @param {Integer} weatherId
 * @returns
 */
function getWeather(weatherId) {
  if (weatherId >= 200 && weatherId < 300) {
    return "storm";
  } else if (
    (weatherId >= 300 && weatherId < 400) ||
    (weatherId >= 500 && weatherId < 600)
  ) {
    return "rainy";
  } else if (weatherId >= 600 && weatherId < 700) {
    return "snow";
  } else if (weatherId == 800) {
    return "sunny";
  } else if (weatherId == 801 || weatherId == 802) {
    return "p-cloudy";
  } else if (weatherId == 803 || weatherId == 804) {
    return "cloudy";
  }
}
/**
 * return the index of the next day midday from the date/time at index i
 * @param {Array} data
 * @param {Integer} index
 * @returns
 */
function secondDayMidday(directory, index) {
  const currentTime = new Date(directory[index].dt_txt).getHours();
  let secondDay;
  if (currentTime > 12) {
    secondDay = directory.findIndex((element) =>
      element.dt_txt.includes("12:00")
    );
    return secondDay;
  } else {
    secondDay =
      8 + directory.findIndex((element) => element.dt_txt.includes("12:00"));
    return secondDay;
  }
}

let cityMain = {
  lat: 47.24,
  long: 6.01,
  name: "Besançon",
  country: "FR",
};

let favList = [
  { lat: 47.24, long: 6.01, name: "Besançon", country: "FR", temp: 13 },
  { lat: 48.85, long: 2.34, name: "Paris", country: "FR", temp: 14 },
  { lat: 45.74, long: 4.84, name: "Lyon", country: "FR", temp: 13 },
  { lat: 43.29, long: 5.38, name: "Marseille", country: "FR", temp: 17 },
  {
    lat: 46.66,
    long: 4.36,
    name: "Montceau-les-Mines",
    country: "FR",
    temp: 12,
  },
];
let miscList = [
  { lat: 47.63, long: 6.16, name: "Vesoul", country: "FR", temp: 12 },
  { lat: 47.1, long: 5.5, name: "Dole", country: "FR", temp: 14 },
  { lat: 46.9, long: 6.35, name: "Pontarlier", country: "FR", temp: 10 },
  { lat: 47.68, long: 6.49, name: "Lure", country: "FR", temp: 12 },
  { lat: 47.51, long: 6.8, name: "Montbéliard", country: "FR", temp: 12 },
];
updateList(favList);
updateList(miscList);

function updateList(list) {
  for (let city of list) {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${city.lat}&lon=${city.long}&appid=${openWeatherKey}&units=metric`
    )
      .then((response) => response.json())
      .then((data) => {
        city.temp = Math.round(data.main.temp);
      })
      .catch((err) => console.log("Open Weather Geo Request Failed", err));
  }
  console.log(list);
  return list;
}

class MainMenu {
  constructor() {
    this.openMenu();
    this._initListeners();
  }
  openMenu() {
    document.querySelector("header").style.display = "none";
    document.querySelector("main").style.display = "none";
    this._createBaseMenu();
  }
  _createBaseMenu() {
    const mainMenu = makeEl("div", document.body, [["classList", "main-menu"]]);
    const nav = makeEl("div", mainMenu, [["classList", "main-menu--nav"]]);
    makeEl("button", nav, [
      ["classList", "back-button"],
      ["alt", "back button"],
    ]);
    const searchWrapper = makeEl("form", nav, [
      ["classList", "main-menu--nav--search"],
    ]);
    const searchInput = makeEl("input", searchWrapper, [
      ["name", "main-menu--nav--search--input"],
      ["placeholder", "search for a city..."],
    ]);
    const searchSubmit = makeEl("button", searchWrapper, [
      ["type", "submit"],
      ["classList", "submit-button"],
      ["alt", "search icon"],
    ]);
    makeEl("button", nav, [
      ["classList", "settings-button"],
      ["alt", "settings"],
    ]);
    makeEl("div", mainMenu, [["classList", "main-menu--suggestions"]]);
    new Suggestions(favList, miscList);
  }
  _initListeners() {
    const backButton = document.querySelector(".main-menu--nav .back-button");
    backButton.addEventListener("click", () => {
      if (document.querySelector(".main-menu--weather-types") !== null) {
        document.querySelector(".main-menu--weather-types").remove();
        makeEl("div", document.querySelector(".main-menu"), [
          ["classList", "main-menu--suggestions"],
        ]);
        new Suggestions(favList, miscList);
      } else {
        closeMenu();
      }
    });

    const settings = document.querySelector(".main-menu--nav .settings-button");
    settings.addEventListener("click", () => {
      if (document.querySelector(".main-menu--weather-types") === null) {
        document.querySelector(".main-menu--suggestions").remove();
        new citiesByWeather();
      }
    });

    const searchInput = document.querySelector(".main-menu--nav--search input");
    searchInput.addEventListener("click", () => {});

    const search = document.querySelector(".main-menu--nav--search");
    search.addEventListener("submit", (event) => {
      event.preventDefault();
      console.log(searchInput.value);
      geoAPI(searchInput.value);
    });
  }
}

function closeMenu() {
  document.querySelector(".main-menu").remove();
  document.querySelector("header").style.display = "flex";
  document.querySelector("main").style.display = "flex";
}

class Suggestions {
  constructor(fav, misc) {
    this.fav = fav;
    this.misc = misc;
    this._createList(this.fav);
    this._createList(this.misc);
  }
  _createList(src) {
    let icon, titleContent;
    switch (src) {
      case this.fav:
        icon = "heart";
        titleContent = "Most Searched";
        break;
      case this.misc:
        icon = "star";
        titleContent = "Suggestions";
        break;
    }
    const suggestionsWrapper = document.querySelector(
      ".main-menu--suggestions"
    );
    const list = makeEl("div", suggestionsWrapper, [
      ["classList", "main-menu--list"],
    ]);
    const title = makeEl("h2", list);
    makeEl("div", title, [
      ["classList", `${icon}`],
      ["alt", `${icon}`],
    ]);
    title.textContent = `${titleContent}`;
    for (let city of src) {
      const wrapper = makeEl("div", list);
      makeEl("p", wrapper, [["textContent", `${city.name}`]]);
      makeEl("p", wrapper, [["textContent", `${city.temp}°`]]);

      wrapper.addEventListener("click", () => {
        cityMain.lat = city.lat;
        cityMain.long = city.long;
        cityMain.name = city.name;
        cityMain.country = city.country;

        getData(cityMain);
        closeMenu();
      });
    }
  }
}

class SearchResults {
  constructor(data) {
    this.data = data;
    this._createList();
  }
  _createList() {
    const mainMenu = document.querySelector(".main-menu");
    let mainMenuContent;
    if (document.querySelector(".main-menu--suggestions")) {
      mainMenuContent = document.querySelector(".main-menu--suggestions");
    } else if (document.querySelector(".main-menu--weather-types")) {
      mainMenuContent = document.querySelector(".main-menu--weather-types");
    }
    mainMenuContent.remove();
    const resultsWrapper = makeEl("div", mainMenu, [
      ["classList", "main-menu--list"],
    ]);
    makeEl("h2", resultsWrapper, [["textContent", "Search Results"]]);
    for (let match of this.data) {
      const wrapper = makeEl("div", resultsWrapper, [
        ["classList", "city-match"],
      ]);
      makeEl("p", wrapper, [["textContent", `${match.name}`]]);
      makeEl("p", wrapper, [["textContent", `${match.state}`]]);
      makeEl("p", wrapper, [
        ["textContent", `${regionNamesInEnglish.of(match.country)}`],
      ]);

      wrapper.addEventListener("click", () => {
        cityMain.lat = match.lat;
        cityMain.long = match.lon;
        cityMain.name = match.name;
        cityMain.country = match.country;

        getData(cityMain);
        closeMenu();
      });
    }
  }
}

const defaultWeatherCities = [
  "Auxerre",
  "Paris",
  "Lyon",
  "Marseille",
  "Montceau-les-mines",
];
class citiesByWeather {
  constructor() {
    this._createNav();
    this.createList(defaultWeatherCities);
  }
  _createNav() {
    const mainMenu = document.querySelector(".main-menu");
    const weatherMenu = makeEl("div", mainMenu, [
      ["classList", "main-menu--weather-types"],
    ]);
    const nav = makeEl("nav", weatherMenu);
    makeEl("button", nav, [
      ["classList", "weather-type sunny"],
      ["alt", "sun icon"],
    ]);
    makeEl("button", nav, [
      ["classList", "weather-type p-cloudy"],
      ["alt", "partly cloudy icon"],
    ]);
    makeEl("button", nav, [
      ["classList", "weather-type cloudy"],
      ["alt", "cloudy icon"],
    ]);
    makeEl("button", nav, [
      ["classList", "weather-type rainy"],
      ["alt", "rain icon"],
    ]);
    makeEl("button", nav, [
      ["classList", "weather-type storm"],
      ["alt", "storm icon"],
    ]);
    makeEl("button", nav, [
      ["classList", "weather-type snow"],
      ["alt", "snow icon"],
    ]);
  }
  createList(list) {
    console.log(list);
    for (let city of list) {
      const weatherMenu = document.querySelector(".main-menu--weather-types");
      let wrapper = makeEl("div", weatherMenu, [
        ["classList", "city-by-weather"],
      ]);
      makeEl("p", wrapper, [["textContent", `${city}`]]);
      makeEl("div", wrapper);
    }
  }
}

const menuBtn = document.getElementById("menu");
const menu = menuBtn.addEventListener("click", () => {
  let mainMenu = new MainMenu();
  return mainMenu;
});

class Current {
  constructor(directory, index, city) {
    this.directory = directory;
    this.index = index;
    this.day = new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(
      new Date(directory[index].dt_txt).getTime()
    );
    this.temp = Math.round(directory[index].main.temp);
    this.weather = getWeather(directory[index].weather[0].id);
    this.city = city.name;
    this.country = city.country;
  }
  relativeDay() {
    let tomorrow = secondDayMidday(this.directory, 0);
    if (this.directory[this.index] == this.directory[0]) {
      this.day = "Today";
    } else if (this.directory[this.index] == this.directory[tomorrow]) {
      this.day = "Tomorrow";
    }
  }
  fill() {
    document.body.classList = `${this.weather}`;

    document.querySelector(".current span").textContent = `${this.day}`;
    document.querySelector(
      ".current--conditions p"
    ).textContent = `${this.temp}°`;
    document.querySelector("#current_city").textContent = `${this.city}`;
    document.querySelector("#current_country").textContent = `${regionNamesInEnglish.of(this.country)}`;
  }
}

class CurrentMenu {
  constructor(directory, index) {
    this.directory = directory;
    this.index = index;
  }
  getIndexList(from, to, indexList) {
    if (from !== undefined && to !== undefined && indexList !== undefined) {
      indexList.unshift(0);
      let iLto = indexList.indexOf(to);
      indexList.splice(iLto, 1);
      return indexList;
    } else {
      let dayIndexList = [];
      for (let i = 1, dayIndex; i < 5; i++) {
        if (i == 1) {
          dayIndex = secondDayMidday(this.directory, 0);
          dayIndexList.push(dayIndex);
        } else {
          dayIndex += 8;
          dayIndexList.push(dayIndex);
        }
      }
      return dayIndexList;
    }
  }
  open(dayIndexList) {
    const nav = makeEl(
      "nav",
      document.querySelector(".current"),
      [["classList", "current--date-menu"]],
      document.querySelector(".current--conditions")
    );
    let dayOfWeek;
    for (let dayIndex of dayIndexList) {
      if (dayIndex == 0) {
        dayOfWeek = "Today";
      } else if (dayIndex == secondDayMidday(this.directory, 0)) {
        dayOfWeek = "Tomorrow";
      } else {
        dayOfWeek = new Intl.DateTimeFormat("en-US", {
          weekday: "long",
        }).format(new Date(this.directory[dayIndex].dt_txt).getTime());
      }
      makeEl("p", nav, [["innerHTML", `${dayOfWeek}`]]);
    }
    document.querySelector(".current--date--arrow").style.backgroundImage =
      "url(src/assets/icons/Fleche-up.svg)";
  }
  close() {
    document.querySelector(".current--date-menu").remove();
    document.querySelector(".current--date--arrow").style.backgroundImage =
      "url(src/assets/icons/Fleche.svg)";
  }
}

class HourForecast {
  constructor(time, weather, temp) {
    this.time = new Date(time).getHours();
    this.weather = getWeather(weather);
    this.temp = Math.round(temp);
  }

  deploy() {
    const wrapper = makeEl("div", document.querySelector(".hourly"));
    makeEl("p", wrapper, [["innerHTML", `${this.time}H`]]);
    makeEl("div", wrapper, [["classList", `hourly--icon ${this.weather}`]]);
    makeEl("p", wrapper, [["innerHTML", `${this.temp}°`]]);
  }
}

// async function checkCity(input) {
//   console.log(input);
//   fetch("src/js/city.list.json")
//     .then((response) => response.json())
//     .then((data) => {
//       console.log(data);
//       for (let i = 0; i < data.length; i++) {
//         for (let j = 0; j < data[i].length; j++) {
//           for (let k = 0; k < data[i][j].length; k++) {
//             if (input.toLowerCase() == data[i][j][k].name.toLowerCase()) {
//               console.log("data[i][j][k] "+ data[i][j][k]);
//               let city = {
//                 lat: Math.fround(data[i][j][k].coord.lat),
//                 long: Math.fround(data[i][j][k].coord.lon),
//                 name: data[i][j][k].name,
//                 country: data[i][j][k].country,
//               };
//               console.log("city"+ city);
//               return city;
//             } else {
//               console.log("No match found");
//             }
//           }
//         }
//       }
//     })
//     .catch((err) => console.log(" City List Request Failed", err));
// }

async function geoAPI(input) {
  fetch(
    `http://api.openweathermap.org/geo/1.0/direct?q=${input}&limit=5&appid=${openWeatherKey}`
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      new SearchResults(data);
      // for (let match of data) {
      // let city = {
      //   lat: match.lat,
      //   long: match.lon,
      //   name: match.name,
      //   country: match.country,
      // };
      // }
    })
    .catch((err) => console.log("Open Weather Geo Request Failed", err));
}

// fetch(
//     `https://api.openweathermap.org/data/2.5/weather?lat=${city.lat}&lon=${city.long}&appid=${openWeatherKey}&units=metric`
//   )
//     .then((response) => response.json())
//     .then((data) => {
//       console.log(data);})

async function getData(city) {
  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${city.lat}&lon=${city.long}&appid=${openWeatherKey}&units=metric`
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);

      const current = new Current(data.list, 0, city);
      current.relativeDay();
      current.fill();

      function createForecast(start, end) {
        if (document.querySelector(".hourly")) {
          document.querySelector(".hourly").replaceChildren();
        }
        for (let i = start; i < end; i++) {
          const forecast = new HourForecast(
            data.list[i].dt_txt,
            data.list[i].weather[0].id,
            data.list[i].main.temp
          );
          forecast.deploy();
        }
      }

      const currentDateBtn = document.querySelector(".current--date");
      let from,
        to = current.index;
      currentDateBtn.addEventListener("click", () => {
        const nav = new CurrentMenu(current.directory, current.index);
        if (document.querySelector(".current--date-menu") === null) {
          let weeklyIndex = nav.getIndexList(from, to, nav.getIndexList());
          nav.open(weeklyIndex);
          const navDays = document.querySelectorAll(".current--date-menu > p");
          for (let i = 0; i < navDays.length; i++) {
            navDays[i].addEventListener("click", () => {
              from = to;
              nav.close();
              const day = new Current(nav.directory, weeklyIndex[i], cityMain);
              to = weeklyIndex[i];
              day.relativeDay();
              day.fill();
              if (weeklyIndex[i] == 0) {
                createForecast(1, 7);
              } else {
                createForecast(weeklyIndex[i] - 4, weeklyIndex[i] + 4);
              }
            });
          }
        } else {
          nav.close();
        }
      });
      createForecast(1, 7);
    })
    .catch((err) => console.log("Open Weather Forecast Request Failed", err));
}
getData(cityMain);

const showMore = document.querySelector(".city-bio--toggle");
showMore.addEventListener("click", () => {
  const cityBio = document.querySelector(".city-bio");
  if (!cityBio.classList.contains("full")) {
    cityBio.classList.add("full");
    cityBio.style.position = "fixed";
    cityBio.style.height = "90vh";
    document.querySelector(".city-bio--toggle span").textContent = "Show Less";

    makeEl(
      "p",
      cityBio,
      [
        ["classList", "city-bio--full"],
        [
          "textContent",
          "Capitale de la région historique et culturelle de Franche-Comté, Besançon constitue aujourd'hui un pôle administratif important au sein de la région administrative de Bourgogne-Franche-Comté en accueillant le siège du conseil régional et de la région académique ainsi qu'un certain nombre de directions régionales. Elle est également le siège d'une des quinze provinces ecclésiastiques françaises et de l'une des deux divisions de l'Armée de terre.",
        ],
      ],
      showMore
    );

    const stats = makeEl(
      "div",
      cityBio,
      [
        ["classList", "city-bio--full"],
        ["id", "stats"],
      ],
      showMore
    );
    makeEl("p", stats, [
      ["classList", "city-bio--stats"],
      ["textContent", "Département : Doubs"],
    ]);
    makeEl("p", stats, [
      ["classList", "city-bio--stats"],
      ["textContent", "Population : 118 258 habitants (2020)"],
    ]);
    makeEl("p", stats, [
      ["classList", "city-bio--stats"],
      ["textContent", "Superficie : 65,05 km2"],
    ]);
    makeEl("p", stats, [
      ["classList", "city-bio--stats"],
      ["textContent", "Code postale : 25000"],
    ]);
  } else {
    cityBio.classList.remove("full");
    cityBio.style.position = "relative";
    cityBio.style.height = "auto";
    document.querySelector(".city-bio--toggle span").innerHTML = "Show More";
    document
      .querySelectorAll(".city-bio--full")
      .forEach((element) => element.remove());
  }
});
