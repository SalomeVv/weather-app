const menuBtn = document.getElementById("menu");
const currentDateBtn = document.querySelector(".current--date");
const showMore = document.querySelector(".city-bio--toggle");

function basicClone(templateId) {
  const template = document.querySelector(templateId);
  const clone = document.importNode(template.content, true);
  return clone;
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

    const cityBioP2 = document.createElement("p");
    cityBioP2.classList.add("city-bio--full");
    cityBioP2.innerHTML =
      "Capitale de la région historique et culturelle de Franche-Comté, Besançon constitue aujourd'hui un pôle administratif important au sein de la région administrative de Bourgogne-Franche-Comté en accueillant le siège du conseil régional et de la région académique ainsi qu'un certain nombre de directions régionales. Elle est également le siège d'une des quinze provinces ecclésiastiques françaises et de l'une des deux divisions de l'Armée de terre.";
    cityBio.insertBefore(cityBioP2, showMore);

    const stats = document.createElement("div"); 
    cityBio.insertBefore(stats, showMore);
    stats.classList.add("city-bio--full");

    const departement = document.createElement("p");
    departement.innerHTML = "Département : Doubs";
    departement.classList.add("city-bio--stats");
    stats.appendChild(departement);

    const population = document.createElement("p");
    population.innerHTML = "Population : 118 258 habitants (2020)";
    population.classList.add("city-bio--stats");
    stats.appendChild(population);


  } else {
    cityBio.classList.remove("full");
    cityBio.style.position = "relative";
    cityBio.style.height = "auto";
    document.querySelector(".city-bio--toggle span").innerHTML = "Show More";
    document.querySelectorAll(".city-bio--full").forEach(element => element.remove());
  }
});
