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
