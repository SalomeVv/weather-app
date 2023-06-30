const menuBtn = document.getElementById("menu");
const currentDateBtn = document.querySelector(".current--date");
const showMore = document.querySelector(".city-bio--toggle");

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
function makeEl(type, parent, properties, content) {
  const el = document.createElement(type);
  if (
    properties !== undefined &&
    properties !== null &&
    properties.length > 1
  ) {
    for (let i = 0; i < properties.length; i++) {
      el[properties[i][0]] = properties[i][1];
    }
  }
  parent.appendChild(el);
  return el;
}

class Current {
  constructor(day, temp, city, country) {
    this.day = day;
    this.temp = temp;
    this.city = city;
    this.country = country;
  }
  fill() {
    document.querySelector(".current span").innerHTML = `${this.day}`;
    document.querySelector(".current--conditions p").innerHTML = `${this.temp}`;
    document.querySelector("#current_city").innerHTML = `${this.city}`;
    document.querySelector("#current_country").innerHTML = `${this.country}`;
  }
}

class HourForecast {
  constructor(time, weather, temp) {
    this.time = time;
    this.weather = weather;
    this.temp = temp;
  }
  deploy(parent) {
    const wrapper = makeEl("div", parent);
    makeEl("p", wrapper, [["innerHTML", `${this.time}H`]]);
    makeEl("div", wrapper, [["classList", `hourly--icon ${this.weather}`]]);
    makeEl("p", wrapper, [["innerHTML", `${this.temp}°`]]);
  }
}

menuBtn.addEventListener("click", () => {
  document.querySelector("header").style.display = "none";
  document.querySelector("main").style.display = "none";

  document.body.appendChild(basicClone("#main_menu_core"));
  document
    .querySelector(".main-menu")
    .appendChild(basicClone("#main_menu_suggestions"));

  const backBtn = document.getElementById("back_button");
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

currentDateBtn.addEventListener("click", () => {
  if (document.querySelector(".current--date-menu") === null) {
    document
      .querySelector(".current")
      .insertBefore(
        basicClone("#date_menu"),
        document.querySelector(".current--conditions")
      );
    document.querySelector(".current--date--arrow").style.backgroundImage =
      "url(src/assets/icons/Fleche-up.svg)";
  } else {
    document.querySelector(".current--date-menu").remove();
    document.querySelector(".current--date--arrow").style.backgroundImage =
      "url(src/assets/icons/Fleche.svg)";
  }
});

showMore.addEventListener("click", () => {
  const cityBio = document.querySelector(".city-bio");
  if (!cityBio.classList.contains("full")) {
    cityBio.classList.add("full");
    cityBio.style.position = "fixed";
    cityBio.style.height = "90vh";
    document.querySelector(".city-bio--toggle span").innerHTML = "Show Less";

    /*const cityBioP2 = document.createElement("p");
    cityBioP2.classList.add("city-bio--full");
    cityBioP2.innerHTML =
      "Capitale de la région historique et culturelle de Franche-Comté, Besançon constitue aujourd'hui un pôle administratif important au sein de la région administrative de Bourgogne-Franche-Comté en accueillant le siège du conseil régional et de la région académique ainsi qu'un certain nombre de directions régionales. Elle est également le siège d'une des quinze provinces ecclésiastiques françaises et de l'une des deux divisions de l'Armée de terre.";
    cityBio.insertBefore(cityBioP2, showMore);*/
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

// const openWeatherKey = "b9ead5b48dff0a393ee56b4dca49fc47";

// fetch(
//   `https://api.openweathermap.org/data/2.5/weather?lat=47.24&lon=06.01&appid=${openWeatherKey}&units=metric `
// )
//   .then((response) => response.json())
//   .then((data) => {
//     console.log(data);
//     console.log(data.weather[0].main);
// })
//   .catch((err) => console.log("Request Failed", err));

// fetch("src/js/city.list.json")
//   .then((response) => response.json())
//   .then((data) => {
//     console.log(data);
//   })
//   .catch((err) => console.log("Request Failed", err));
