/**
 * basicClone("#templateId");
 * @param {string} templateId
 * @returns
 */
function basicClone(templateId) {
  const template = document.querySelector(templateId);
  const clone = document.importNode(template.content, true);
  return clone;
}
/**
 * makeEmptyEL("type",[".class","#id"], [parent, placeBefore]);
 * @param {string} type
 * @param {array} classId
 * @param {array} parentBefore
 */
function makeEmptyEl(type, classId, parentBefore) {
  const el = document.createElement(type);
  if (classId.constructor === Array && classId !== []) {
    for (let i = 0; i < classId.length; i++) {
      if (classId[i].startsWith(".")) {
        el.classList.add(classId[i].replace(".", ""));
      } else if (classId[i].startsWith("#")) {
        el.id = classId[i].replace("#", "");
      }
    }
  }
  if (parentBefore.constructor === Array) {
    if (parentBefore.length === 2) {
      parentBefore[0].insertBefore(el, parentBefore[1]);
    } else if (parentBefore.length === 1) {
      parentBefore[0].appendChild(el);
    }
  }
}
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
function getNextDay(directory, index) {
  console.log("getNextDay index " + index);
  const currentTime = new Date(directory[index].dt_txt).getHours();
  console.log("getNextDay current time " + currentTime);
  let nextDay;
  if (currentTime > 12) {
    nextDay = directory.findIndex((element) =>
      element.dt_txt.includes("12:00")
    );
    console.log("next day midday index afternoon " + nextDay);
    return nextDay;
  } else {
    nextDay = directory.findIndex((element) =>
      element.dt_txt.includes("12:00")
    );
    nextDay += 8;
    console.log("next day midday index morning " + nextDay);
    return nextDay;
  }
}

class Current {
  constructor(directory, index, city) {
    this.directory = directory;
    this.index = index;
    this.day = new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(
      new Date(directory[index].dt_txt).getTime()
    );
    this.temp = Math.round(directory[index].main.temp);
    this.city = city.name;
    this.country = city.country;
  }
  relativeDay() {
    let tomorrow = getNextDay(this.directory, 0);
    if (this.directory[this.index] == this.directory[0]) {
      return "Today";
    } else if (this.directory[this.index] == this.directory[tomorrow]) {
      return "Tomorrow";
    }
  }
  fill() {
    document.querySelector(".current span").innerHTML = `${this.day}`;
    document.querySelector(
      ".current--conditions p"
    ).innerHTML = `${this.temp}°`;
    document.querySelector("#current_city").innerHTML = `${this.city}`;
    document.querySelector("#current_country").innerHTML = `${this.country}`;
  }
  openMenu() {
    const nav = makeEl(
      "nav",
      document.querySelector(".current"),
      [["classList", "current--date-menu"]],
      document.querySelector(".current--conditions")
    );
    for (let i = 0, dayIndex = 0; i < 5; i++) {
      let dayOfWeek;
      if (i == 0 || i == 1) {
        dayOfWeek = this.relativeDay(this.directory, this.index);
      } else {
        dayOfWeek = new Intl.DateTimeFormat("en-US", {
          weekday: "long",
        }).format(new Date(this.directory[dayIndex].dt_txt).getTime());
      }
      makeEl("p", nav, [["innerHTML", `${dayOfWeek}`]]);
      dayIndex = getNextDay(this.directory, dayIndex);
      console.log("dayIndex new value "+dayIndex);
    }
  }
}

class HourForecast {
  constructor(time, weather, temp) {
    this.time = new Date(time).getHours();
    this.weather = getWeather(weather);
    this.temp = Math.round(temp);
  }

  deploy(parent) {
    const wrapper = makeEl("div", parent);
    makeEl("p", wrapper, [["innerHTML", `${this.time}H`]]);
    makeEl("div", wrapper, [["classList", `hourly--icon ${this.weather}`]]);
    makeEl("p", wrapper, [["innerHTML", `${this.temp}°`]]);
  }
}

const openWeatherKey = "b9ead5b48dff0a393ee56b4dca49fc47";

// fetch("src/js/city.list.json")
//   .then((response) => response.json())
//   .then((data) => {
//     console.log(data);
//   })
//   .catch((err) => console.log(" City List Request Failed", err));

let city = {
  lat: 47.24,
  long: 6.01,
  name: "Besançon",
  country: "France",
};

fetch(
  `https://api.openweathermap.org/data/2.5/forecast?lat=${city.lat}&lon=${city.long}&appid=${openWeatherKey}&units=metric`
)
  .then((response) => response.json())
  .then((data) => {
    console.log(data);

    document.querySelector("body").classList = `${getWeather(
      data.list[0].weather[0].id
    )}`;
    const current = new Current(data.list, 0, city);
    current.day = current.relativeDay();
    current.fill();

    const currentDateBtn = document.querySelector(".current--date");
    currentDateBtn.addEventListener("click", () => {
      if (document.querySelector(".current--date-menu") === null) {
        // document
        //   .querySelector(".current")
        //   .insertBefore(
        //     basicClone("#date_menu"),
        //     document.querySelector(".current--conditions")
        //   );
        current.openMenu();
        document.querySelector(".current--date--arrow").style.backgroundImage =
          "url(src/assets/icons/Fleche-up.svg)";
      } else {
        document.querySelector(".current--date-menu").remove();
        document.querySelector(".current--date--arrow").style.backgroundImage =
          "url(src/assets/icons/Fleche.svg)";
      }
    });

    for (let i = 1; i < 7; i++) {
      const forecast = new HourForecast(
        data.list[i].dt_txt,
        data.list[i].weather[0].id,
        data.list[i].main.temp
      );
      forecast.deploy(document.querySelector(".hourly"));
    }
  })
  .catch((err) => console.log("Open Weather Forecast Request Failed", err));

const menuBtn = document.getElementById("menu");
menuBtn.addEventListener("click", () => {
  document.querySelector("header").style.display = "none";
  document.querySelector("main").style.display = "none";

  document.body.appendChild(basicClone("#main_menu_core"));
  document
    .querySelector(".main-menu")
    .appendChild(basicClone("#main_menu_suggestions"));

  const settings = document.getElementById("settings");
  settings.addEventListener("click", () => {
    if (document.querySelector(".main-menu--weather-types") === null) {
      document
        .querySelector(".main-menu")
        .replaceChild(
          basicClone("#main_menu_weather"),
          document.querySelector(".main-menu--suggestions")
        );
    }
  });

  const backBtn = document.getElementById("back_button");
  backBtn.addEventListener("click", () => {
    if (document.querySelector(".main-menu--weather-types") !== null) {
      document
        .querySelector(".main-menu")
        .replaceChild(
          basicClone("#main_menu_suggestions"),
          document.querySelector(".main-menu--weather-types")
        );
    } else {
      document.querySelector(".main-menu").remove();
      document.querySelector("header").style.display = "flex";
      document.querySelector("main").style.display = "flex";
    }
  });
});

const showMore = document.querySelector(".city-bio--toggle");
showMore.addEventListener("click", () => {
  const cityBio = document.querySelector(".city-bio");
  if (!cityBio.classList.contains("full")) {
    cityBio.classList.add("full");
    cityBio.style.position = "fixed";
    cityBio.style.height = "90vh";
    document.querySelector(".city-bio--toggle span").innerHTML = "Show Less";

    makeEmptyEl("p", [".city-bio--full"], [cityBio, showMore]);
    document.querySelector(".city-bio--full").innerHTML =
      "Capitale de la région historique et culturelle de Franche-Comté, Besançon constitue aujourd'hui un pôle administratif important au sein de la région administrative de Bourgogne-Franche-Comté en accueillant le siège du conseil régional et de la région académique ainsi qu'un certain nombre de directions régionales. Elle est également le siège d'une des quinze provinces ecclésiastiques françaises et de l'une des deux divisions de l'Armée de terre.";

    const stats = document.createElement("div");
    cityBio.insertBefore(stats, showMore);
    stats.classList.add("city-bio--full");
    stats.id = "stats";

    const departement = document.createElement("p");
    departement.innerHTML = "Département : Doubs";
    departement.classList.add("city-bio--stats");
    stats.appendChild(departement);

    const population = document.createElement("p");
    population.innerHTML = "Population : 118 258 habitants (2020)";
    population.classList.add("city-bio--stats");
    stats.appendChild(population);

    makeEl("p", stats, [
      ["classList", "city-bio--stats"],
      ["innerHTML", "Superficie : 65,05 km2"],
    ]);

    makeEmptyEl("p", [".city-bio--stats"], [stats]);
    document.querySelector("#stats :last-child").innerHTML =
      "Code postale : 25000";
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
