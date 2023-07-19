class Current {
  constructor(day, temp, city, country) {
    this.day = new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(
      new Date(day).getTime()
    );
    this.temp = Math.round(temp);
    this.city = city;
    this.country = country;
  }
  relativeDay(data) {
    const currentTime = new Date(data.list[0].dt_txt).getHours();
    console.log(currentTime);
    let tomorrow = "";
    if (currentTime > 12) {
      tomorrow = data.list.findIndex((element) =>
        element.dt_txt.includes("12:00")
      );
      console.log(tomorrow);
    } else {
      tomorrow = data.list.findIndex((element) =>
        element.dt_txt.includes("12:00")
      );
      tomorrow += 8;
      console.log(tomorrow);
    }

    if (data.list[0]) {
      this.day = "Today";
    } else if (data.list[tomorrow]) {
      this.day = "Tomorrow";
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
  deploy() {
    const wrapper = makeEl("div", document.querySelector("main"), [
      ["classList", "current"],
    ]);
    const button = makeEl("button", wrapper, [["classList", "current--date"]]);
    makeEl("span", button, [
      ["classList", "inner-shadow"],
      ["innerHTML", `${this.day}`],
    ]);
    makeEl("div", button, [["classList", "current--date--arrow"]]);
    const conditions = makeEl("div", wrapper, [
      ["classList", "current--conditions"],
    ]);
    makeEl("div", conditions, [["classList", "current--conditions--icon"]]);
    makeEl("p", conditions, [
      ["classList", "inner-shadow"],
      ["innerHTML", `${this.temp}°`],
    ]);
    const place = makeEl("div", wrapper, [
      ["classList", "current--place inner-shadow"],
    ]);
    makeEl("span", place, [["innerHTML", `${this.city}`]]);
    makeEl("span", place, [["innerHTML", `${this.country}`]]);
  }
  
}

//alt 
// class Current {
//     constructor(weatherData, city) {
//       this.day = new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(
//         new Date(weatherData.dt_txt).getTime()
//       );
//       this.temp = Math.round(weatherData.main.temp);
//       this.city = city.name;
//       this.country = city.country;
//     }}

// fetch(
//   `https://api.openweathermap.org/data/2.5/forecast?lat=${city.lat}&lon=${city.long}&appid=${openWeatherKey}&units=metric`
// )
//   .then((response) => response.json())
//   .then((data) => {
//     console.log(data);

//     document.querySelector("body").classList = `${getWeather(
//       data.list[0].weather[0].id
//     )}`;
//     const current = new Current(
//       data.list[0].dt_txt,
//       data.list[0].main.temp,
//       city.name,
//       city.country
//     );
//     current.relativeDay(data, 0);
//     current.fill();

//     for (let i = 1; i < 7; i++) {
//       const forecast = new HourForecast(
//         data.list[i].dt_txt,
//         data.list[i].weather[0].id,
//         data.list[i].main.temp
//       );
//       forecast.deploy(document.querySelector(".hourly"));
//     }
//   })
//   .catch((err) => console.log("Open Weather Forecast Request Failed", err));
function openMenu() {
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

class Forecast {
  // constructor(time, weather, temp) {
  //   this.time = new Date(time).getHours();
  //   this.weather = getWeather(weather);
  //   this.temp = Math.round(temp);
constructor(time, weather, temp, startingPoint) {
  this.time = new Date(time).getHours();
  this.temp = Math.round(temp);
  this.start = startingPoint;
  if (weather.includes("[i]")) {
      let startWeather = weather.replace('[i]', '[this.start]');
      this.weather = getWeather(startWeather);
  } else {
      this.weather = getWeather(weather);
  }
  this.time = new Date(data.list[this.start].dt_txt).getHours(),
  this.weather = getWeather(data.list[this.start].weather[0].id),
  this.temp = Math.round(data.list[this.start].main.temp)
}
single() {
  const wrapper = makeEl("div", document.querySelector(".hourly"));
  makeEl("p", wrapper, [["innerHTML", `${this.time}H`]]);
  makeEl("div", wrapper, [["classList", `hourly--icon ${this.weather}`]]);
  makeEl("p", wrapper, [["innerHTML", `${this.temp}°`]]);
}

full() {
  for (let i = this.start; i < this.start + 6 ; i++) {
      const forecast = new Forecast(i);
      forecast.single();
    }
}
}
const currentForecast = new Forecast(1);
    currentForecast.full();

    // for (let i = 1; i < 7; i++) {
    //   const forecast = new HourForecast(
    //     data.list[i].dt_txt,
    //     data.list[i].weather[0].id,
    //     data.list[i].main.temp
    //   );
    //   forecast.deploy();
    // }

  //   open() {
  //     const nav = makeEl(
  //       "nav",
  //       document.querySelector(".current"),
  //       [["classList", "current--date-menu"]],
  //       document.querySelector(".current--conditions")
  //     );
  //     const dayIndexList = [];
  //     for (let i = 1, dayIndex; i < 5; i++) {
  //       let dayOfWeek;
  //       if (i == 1) {
  //         dayIndex = secondDayMidday(this.directory, 0);
  //         dayIndexList.push(dayIndex);
  //         dayOfWeek = "Tomorrow";
  //       } else {
  //         dayIndex += 8;
  //         dayIndexList.push(dayIndex);
  //         dayOfWeek = new Intl.DateTimeFormat("en-US", {
  //           weekday: "long",
  //         }).format(new Date(this.directory[dayIndex].dt_txt).getTime());
  //       }
  //       makeEl("p", nav, [["innerHTML", `${dayOfWeek}`]]);
  //     }
  //     console.log(dayIndexList);
  //     return dayIndexList;
  //   }
  // }
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
      this._initListeners();
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
      document.querySelector("body").classList = `${this.weather}`;
  
      document.querySelector(".current span").innerHTML = `${this.day}`;
      document.querySelector(
        ".current--conditions p"
      ).innerHTML = `${this.temp}°`;
      document.querySelector("#current_city").innerHTML = `${this.city}`;
      document.querySelector("#current_country").innerHTML = `${this.country}`;
    }
    _initListeners() {
      const currentDateBtn = document.querySelector(".current--date");
      let from,
        to = this.index;
      currentDateBtn.addEventListener("click", () => {
        const nav = new CurrentMenu(this.directory, this.index);
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
              document.querySelector(".hourly").replaceChildren();
              if (weeklyIndex[i] == 0) {
                for (let i = 1; i < 7; i++) {
                  const forecast = new HourForecast(
                    data.list[i].dt_txt,
                    data.list[i].weather[0].id,
                    data.list[i].main.temp
                  );
                  forecast.deploy();
                }
              } else {
                for (let j = weeklyIndex[i] - 4; j < weeklyIndex[i] + 4; j++) {
                  const forecast = new HourForecast(
                    data.list[j].dt_txt,
                    data.list[j].weather[0].id,
                    data.list[j].main.temp
                  );
                  forecast.deploy();
                }
              }
            });
          }
        } else {
          nav.close();
        }
      });
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

  new Intl.DisplayNames(['en'], { type: 'region' }).of(`${this.data[i].country}`);

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
let favList = [
  { lat: 47.24, long: 6.01, name: "Besançon", temp: 13 },
  { lat: 48.85, long: 2.34, name: "Paris", temp: 14 },
  { lat: 45.74, long: 4.84, name: "Lyon", temp: 13 },
  { lat: 43.29, long: 5.38, name: "Marseille", temp: 17 },
  { lat: 46.66, long: 4.36, name: "Montceau-les-Mines", temp: 12 },
];

// /**
//  * generate 5 cities for suggestions menu and fetches their current temp
//  */
// async function randomCityList() {
//   fetch("src/js/city.list.json")
//     .then((response) => response.json())
//     .then((data) => {
//       for (let i = 0; i < 5; i++) {
//         let j = Math.round(Math.random() * 209578);

//         miscList[i] = {
//           lat: Math.fround(data[j].coord.lat),
//           lon: Math.fround(data[j].coord.lon),
//           name: data[j].name,
//           country: data[j].country,
//         };
//       }
//       return miscList;
//     })
//     .then((miscList) => updateList(miscList))
//     .catch((err) => console.log("Random City Request Failed", err));
// }
// randomCityList();

// function updateList(list) {
//   for (let city of list) {
//     fetch(
//       `https://api.openweathermap.org/data/2.5/weather?lat=${city.lat}&lon=${city.lon}&appid=${openWeatherKey}&units=metric`
//     )
//       .then((response) => response.json())
//       .then((data) => {
//         city.temp = Math.round(data.main.temp);
//       })
//       .catch((err) => console.log("Open Weather Geo Request Failed", err));
//   }
//   console.log(list);
//   return list;
// }


// function addToFavList(city) {
//   if (city.count === undefined) {
//     city.count = 1;
//   }
//   let listCity = {
//     lat: city.lat,
//     lon: city.lon,
//     name: city.name,
//     country: city.country,
//     count: city.count,
//   };
//   console.log("city from suggestion list EL ", listCity);
//   favList.push(listCity);
//   console.log("favList suggestions list EL ", favList);
//   try {
//     localStorage.setItem("favList", JSON.stringify(favList));
//   } catch (e) {
//     console.log("localStorage unavailable");
//   }
// }
// /**
//  * removes duplicates from list and moves the element with most instances at the beginning
//  * @param {array} array
//  */
// function checkDuplicates(array) {
//   for (let i = 0; i < array.length; i++) {
//     for (let j = 0; j < array.length; j++) {
//       if (
//         i !== j &&
//         parseFloat(array[i].lat.toPrecision(3)) ===
//           parseFloat(array[j].lat.toPrecision(3)) &&
//         parseFloat(array[i].lon.toPrecision(3)) ===
//           parseFloat(array[j].lon.toPrecision(3))
//       ) {
//         console.log("i ", i, array[i], "j ", j, array[j]);
//         array[i].count += array[j].count;
//         array.splice(j, 1);
//         if (j < i) {
//           i -= 1;
//         }
//         j -= 1;
//       }
//     }
//   }
//   array.sort((a, b) => parseInt(b.count) - parseInt(a.count));
//   console.log("sorted list", array);
// }


  // checkSpace(data) {
  //   let total = 0;
  //   if (typeof data === Array) {
  //     data.forEach(() => {
  //       const temp = makeEl(
  //         "p",
  //         document.querySelector(".city-bio", [["style.display", "none"]])
  //       );
  //       filterWiki(data, temp);
  //       let dataM = temp.innerText;
  //       total += dataM.length;
  //     });
  //   } else {
  //     const temp = makeEl(
  //       "p",
  //       document.querySelector(".city-bio", [["style.display", "none"]])
  //     );
  //     filterWiki(data, temp);
  //     let dataM = temp.innerText;
  //     total += dataM.length;
  //   }

  //   if (total < 1600) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }