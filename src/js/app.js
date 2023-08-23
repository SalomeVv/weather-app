const openWeatherKey = "b9ead5b48dff0a393ee56b4dca49fc47";

const regionNamesInEnglish = new Intl.DisplayNames(["en"], { type: "region" });

let cityMain = {
  lat: 47.24,
  lon: 6.01,
  name: "Besançon",
  country: "FR",
};

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
  } else {
    return false;
  }
}
/**
 * returns the index of the next day midday from the date/time at index i
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
/**
 * removes html tag content and double white space from string
 * @param {*} data
 * @returns
 */
function filterRawHTML(data) {
  const htmlTag = /<.*?>|\(<.*>\)|\W*\d*\;|<sup>.*<\/sup>|\(.*\)/g;
  const doubleSpace = /\s\s/g;
  let textOnly = data.replaceAll(htmlTag, "");
  textOnly = textOnly.replaceAll(doubleSpace, " ");
  return textOnly;
}

/**
 * removes some classes from wikipedia data then filters the raw html string
 * @param {*} data
 * @param {*} parent
 */
function filterWiki(data, parent) {
  parent.innerHTML = `${data}`;
  const refs = document.querySelectorAll(".reference");
  refs.forEach((el) => el.remove());
  const geos = document.querySelectorAll(".geo-inline .geo-nondefault");
  geos.forEach((el) => el.remove());
  const extiw = document.querySelectorAll(".extiw");
  extiw.forEach((el) => el.remove());
  let dataM = parent.innerText;
  parent.innerHTML = `${filterRawHTML(dataM)}`;
}

class List {
  constructor() {
    this.list = [];
  }

  // removes duplicates from list and moves the element with most instances at the beginning
  checkDuplicates() {
    for (let i = 0; i < this.list.length; i++) {
      for (let j = 0; j < this.list.length; j++) {
        if (
          i !== j &&
          parseFloat(this.list[i].lat.toPrecision(3)) ===
            parseFloat(this.list[j].lat.toPrecision(3)) &&
          parseFloat(this.list[i].lon.toPrecision(3)) ===
            parseFloat(this.list[j].lon.toPrecision(3))
        ) {
          console.log("i ", i, this.list[i], "j ", j, this.list[j]);
          this.list[i].count += this.list[j].count;
          this.list.splice(j, 1);
          if (j < i) {
            i -= 1;
          }
          j -= 1;
        }
      }
    }
    this.list.sort((a, b) => parseInt(b.count) - parseInt(a.count));
    console.log("sorted list", this.list);
  }
  //gets current temp of each list element
  async update() {
    for (let city of this.list) {
      fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${city.lat}&lon=${city.lon}&appid=${openWeatherKey}&units=metric`
      )
        .then((response) => response.json())
        .then((data) => {
          city.temp = Math.round(data.main.temp);
        })
        .catch((err) => console.log("Open Weather Geo Request Failed", err));
    }
    return this.list;
  }
}

class FavList extends List {
  constructor() {
    super();
    this.get();
    this.checkDuplicates();
    this.update();
  }
  //recuperates favList data from localStorage
  get() {
    try {
      if (
        localStorage.getItem("favList") !== undefined &&
        localStorage.getItem("favList") !== null
      ) {
        let favString = localStorage.getItem("favList");
        this.list = JSON.parse(favString);
      }
    } catch (e) {
      console.log("localStorage unavailable");
    }
  }
  //adds an element to the list (+ checkDuplicates and updates)
  add(el) {
    if (el.count === undefined) {
      el.count = 1;
    }
    let listEl = {
      lat: el.lat,
      lon: el.lon,
      name: el.name,
      country: el.country,
      count: el.count,
    };
    this.list.push(listEl);
    try {
      localStorage.setItem("favList", JSON.stringify(this.list));
    } catch (e) {
      console.log("localStorage unavailable");
    }
    this.checkDuplicates();
    this.update();
  }
}

class MiscList extends List {
  constructor() {
    super();
    this.randomCities();
  }
  // generates 5 cities from json file and fetches their current temp
  async randomCities() {
    fetch("src/js/city.list.json")
      .then((response) => response.json())
      .then((data) => {
        for (let i = 0; i < 5; i++) {
          let j = Math.round(Math.random() * 209578);

          this.list[i] = {
            lat: Math.fround(data[j].coord.lat),
            lon: Math.fround(data[j].coord.lon),
            name: data[j].name,
            country: data[j].country,
          };
        }
        return this.list;
      })
      .then(() => super.update())
      .catch((err) => console.log("Random City Request Failed", err));
  }
}

class MainMenu {
  constructor() {
    this.fav = new FavList();
    this.misc = new MiscList();
  }
  open() {
    document.querySelector("header").style.display = "none";
    document.querySelector("main").style.display = "none";
    this._createBase();
    this._initListeners();
  }
  close() {
    document.querySelector(".main-menu-wrapper").remove();
    document.querySelector("header").style.display = "flex";
    document.querySelector("main").style.display = "flex";
  }
  _createBase() {
    const mainMenuWrapper = makeEl("div", document.body, [["classList", "main-menu-wrapper"]]);
    const mainMenu = makeEl("div", mainMenuWrapper, [["classList", "main-menu"]]);
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
    new Suggestions(this.fav.list, this.misc.list);

    makeEl("button", mainMenu, [["classList", "random-button"]]);
  }
  _initListeners() {
    const backButton = document.querySelector(".main-menu--nav .back-button");
    backButton.addEventListener("click", () => {
      if (document.querySelector(".main-menu--weather-types") !== null) {
        document.querySelector(".main-menu--weather-types").remove();
        makeEl("div", document.querySelector(".main-menu"), [
          ["classList", "main-menu--suggestions"],
        ]);
        new Suggestions(this.fav.list, this.misc.list);
        makeEl("button", document.querySelector(".main-menu"), [
          ["classList", "random-button"],
        ]);
      } else {
        this.close();
      }
    });

    const settings = document.querySelector(".main-menu--nav .settings-button");
    settings.addEventListener("click", () => {
      if (document.querySelector(".main-menu--suggestions")) {
        document.querySelector(".main-menu--suggestions").remove();
        document.querySelector(".main-menu .random-button").remove();
        new citiesByWeather();
      }
    });

    const randomButton = document.querySelector(".main-menu .random-button");
    randomButton.addEventListener("click", () => {
      this.misc.randomCities();
      setTimeout(() => {
        document.querySelector(".main-menu--suggestions").replaceChildren();
        new Suggestions(this.fav.list, this.misc.list);
      }, "200");
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
    const title = makeEl("div", list, [["classList", "suggestions-title"]]);
    makeEl("div", title, [
      ["classList", `${icon}`],
      ["alt", `${icon}`],
    ]);
    makeEl("h2", title, [["textContent", `${titleContent}`]]);
    for (let i = 0; i < 5; i++) {
      if (src[i] !== undefined && src[i] !== null) {
        const wrapper = makeEl("div", list);
        makeEl("p", wrapper, [["textContent", `${src[i].name}`]]);
        makeEl("p", wrapper, [["textContent", `${src[i].temp}°`]]);

        wrapper.addEventListener("click", () => {
          cityMain.lat = src[i].lat;
          cityMain.lon = src[i].lon;
          cityMain.name = src[i].name;
          cityMain.country = src[i].country;

          cityMain.count = 1;

          getData(cityMain);
          menu.close();
        });
      }
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
    if (document.querySelector(".main-menu--suggestions")) {
      document.querySelector(".main-menu--suggestions").remove();
      document.querySelector(".main-menu .random-button").remove();
    } else if (document.querySelector(".main-menu--weather-types")) {
      document.querySelector(".main-menu--weather-types").remove();
    }
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
        cityMain.lon = match.lon;
        cityMain.name = match.name;
        cityMain.country = match.country;

        cityMain.count = 5;

        getData(cityMain);
        menu.close();
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

class Current {
  constructor(directory, city, index) {
    this.directory = directory;
    this.index = index;
    if (index == null || index == undefined) {
      this.path = directory;
      this.day = "Today";
    } else {
      this.path = directory[index];
      this.day = new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(
        new Date(directory[index].dt_txt).getTime()
      );
    }
    this.temp = Math.round(this.path.main.temp);
    this.weather = getWeather(this.path.weather[0].id);
    this.city = city.name;
    this.country = city.country;
  }

  relativeDay() {
    if (this.index !== undefined || this.index !== null) {
      let tomorrow = secondDayMidday(this.directory, 0);
      if (this.directory[this.index] == this.directory[0]) {
        this.day = "Today";
      } else if (this.directory[this.index] == this.directory[tomorrow]) {
        this.day = "Tomorrow";
      }
    }
  }
  fill() {
    document.body.classList = `${this.weather}`;

    document.querySelector(".current span").textContent = `${this.day}`;
    document.querySelector(
      ".current--conditions p"
    ).textContent = `${this.temp}°`;
    document.querySelector("#current_city").textContent = `${this.city}`;
    document.querySelector(
      "#current_country"
    ).textContent = `${regionNamesInEnglish.of(this.country)}`;
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

class CityBio {
  constructor(city) {
    this.city = city;
    this.wiki = [];
    this.wikiScrapper();
  }
  _create() {
    const cityBio = document.querySelector(".city-bio");
    cityBio.replaceChildren();
    makeEl("h2", cityBio, [
      [
        "textContent",
        `${this.city.name} - ${regionNamesInEnglish.of(this.city.country)}`,
      ],
    ]);
    const min = makeEl("p", cityBio, [["classList", "min-bio"]]);
    filterWiki(this.wiki[0], min);
    const button = makeEl("button", cityBio, [
      ["classList", "city-bio--toggle"],
    ]);
    makeEl("span", button, [
      ["classList", "inner-shadow"],
      ["textContent", "Show More"],
    ]);

    button.addEventListener("click", () => {
      const cityBio = document.querySelector(".city-bio");
      if (!cityBio.classList.contains("full")) {
        cityBio.classList.add("full");
        cityBio.style.position = "fixed";
        cityBio.style.height = "90vh";
        const showMore = document.querySelector(".city-bio--toggle");
        document.querySelector(".city-bio--toggle span").textContent =
          "Show Less";

        for (let i = 1; i < this.wiki.length; i++) {
          const extra = makeEl(
            "p",
            cityBio,
            [["classList", "city-bio--full"]],
            showMore
          );
          filterWiki(this.wiki[i], extra);
        }
      } else {
        cityBio.classList.remove("full");
        cityBio.style.position = "relative";
        cityBio.style.height = "auto";
        document.querySelector(".city-bio--toggle span").innerHTML =
          "Show More";
        document
          .querySelectorAll(".city-bio--full")
          .forEach((element) => element.remove());
      }
    });
  }
  //gets first few wikipedia paragraphs of city page
  async wikiScrapper() {
    fetch(`src/php/scrapp-wikipedia.php?location=${this.city.name}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        for (let p in data) {
          this.wiki.push(data[p]);
        }
        this._create();
      })
      .catch((err) => {
        console.log("Wikipedia Scrap Request Failed", err);
        this.wiki = ["...", ":<"];
        this._create();
      });
  }
}
/**
 * fetches random city from json list and loads the page
 */
async function getRandom() {
  let i = Math.round(Math.random() * 209578);
  fetch("src/js/city.list.json")
    .then((response) => response.json())
    .then((data) => {
      cityMain = {
        lat: Math.fround(data[i].coord.lat),
        lon: Math.fround(data[i].coord.lon),
        name: data[i].name,
        country: data[i].country,
      };
      return cityMain;
    })
    .then((cityRandom) => getData(cityRandom))
    .catch((err) => console.log("Get Random City Request Failed", err));
}
/**
 * fetches coordinates from city name
 * @param {string} input
 */
async function geoAPI(input) {
  fetch(
    `http://api.openweathermap.org/geo/1.0/direct?q=${input}&limit=5&appid=${openWeatherKey}`
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      new SearchResults(data);
    })
    .catch((err) => console.log("Open Weather Geo Request Failed", err));
}
/**
 * fetches current weather data
 * @param {object} city
 * @returns
 */
async function getCurrent(city) {
  return await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${city.lat}&lon=${city.lon}&appid=${openWeatherKey}&units=metric`
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);

      const current = new Current(data, city);
      current.fill();

      if (getWeather(current.path.weather[0].id) === false) {
        console.log("weatherID no match");
        return false;
      }
    })
    .catch((err) => console.log("Open Weather Current Request Failed", err));
}
/**
 * fetches 5 days weather forecast in 3 hours interval + checks if current weather has css category match
 * @param {object} city
 * @param {boolean} bool
 */
async function getForecast(city, bool) {
  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${city.lat}&lon=${city.lon}&appid=${openWeatherKey}&units=metric`
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);

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

      if (bool !== undefined && bool !== null && bool === false) {
        let j = -1,
          weather;
        do {
          j++;
          weather = getWeather(data.list[j].weather[0].id);
        } while (getWeather(data.list[j].weather[0].id) === false);
        document.body.classList = `${weather}`;
      }

      const currentDateBtn = document.querySelector(".current--date");
      let index = 0;
      let from,
        to = index;
      currentDateBtn.addEventListener("click", () => {
        const nav = new CurrentMenu(data.list, index);
        if (document.querySelector(".current--date-menu") === null) {
          let weeklyIndex = nav.getIndexList(from, to, nav.getIndexList());
          nav.open(weeklyIndex);
          const navDays = document.querySelectorAll(".current--date-menu > p");
          for (let i = 0; i < navDays.length; i++) {
            navDays[i].addEventListener("click", () => {
              from = to;
              nav.close();
              const day = new Current(nav.directory, cityMain, weeklyIndex[i]);
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

/**
 * loads the whole page
 * @param {object} city
 */
async function getData(city) {
  menu.fav.add(city);
  let current = await getCurrent(city);
  getForecast(city, current);
  new CityBio(city);
}

const menu = new MainMenu();
const menuBtn = document.getElementById("menu");
menuBtn.addEventListener("click", () => {
  menu.open();
});

getRandom();
