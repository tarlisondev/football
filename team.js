
//const token = "SEU TOKEN DE APIFUTEBOL";

const findCountries = async () => {
  const response = await fetch(`https://apiv3.apifootball.com/?action=get_countries&APIkey=` + token);
  const data = await response.json();
  listCountries(data);
  return data;
};

const createElement = (tag, innerText = "", innerHTML = "") => {

  const element = document.createElement(tag);

  if (innerText) {
    element.innerText = innerText;
  };
  if (innerHTML) {
    element.innerHTML = innerHTML;
  };
  return element;

};

const listCountries = (countries) => {

  const selectCountry = createElement("select");
  const defaultOption = createElement("option", "selecione um país");
  defaultOption.setAttribute("selected", "");

  selectCountry.appendChild(defaultOption);

  countries.map((country) => {

    const optionCountry = createElement("option", country.country_name);
    optionCountry.setAttribute("value", country.country_id);
    selectCountry.appendChild(optionCountry);

  });

  selectCountry.addEventListener("change", () => {

    const newSelect = document.getElementById("select-competitions");

    if (!newSelect) {
      findCompetitions(selectCountry.value);
    }
    if (newSelect) {
      newSelect.remove();
      findCompetitions(selectCountry.value);
    }

  });

  document.body.appendChild(selectCountry);

};

const findCompetitions = async (country_id) => {
  const response = await fetch(`https://apiv3.apifootball.com/?action=get_leagues&country_id=${country_id}&APIkey=` + token);
  const data = await response.json();
  listCompetitions(data);
  return data;
};


const listCompetitions = (leagues) => {

  const selectLeague = createElement("select");
  selectLeague.setAttribute("id", "select-competitions");

  const defaultOption = createElement("option", "selecione uma competição");
  defaultOption.setAttribute("selected", "");

  selectLeague.appendChild(defaultOption);

  leagues.map((league) => {

    const optionLeague = createElement("option", league.league_name);
    optionLeague.setAttribute("value", league.league_id);
    selectLeague.appendChild(optionLeague);

  });

  selectLeague.addEventListener("change", () => {

    const newBanner = document.querySelector(".banner");

    if (!newBanner) {
      findTeams(selectLeague.value);
    }

    if (newBanner) {
      newBanner.remove();
      findTeams(selectLeague.value);
    }
  });

  document.body.appendChild(selectLeague);

};

const findTeams = async (league_id) => {
  const response = await fetch(`https://apiv3.apifootball.com/?action=get_teams&league_id=${league_id}&APIkey=` + token);
  const data = await response.json();
  listTeams(data);
  return data;
};

const listTeams = async (teams) => {

  let current = 0;

  const game = createElement("div");
  game.classList.add("game");

  const image = createElement("img");
  const fieldLyric = createElement("div");
  const inputLyric = createElement("input");

  const fieldControls = createElement("div");
  fieldControls.setAttribute("id", "controls")
  const back = createElement("button", "Anterior");
  back.setAttribute("disabled", "");
  back.setAttribute("id", "back");
  const teamCurrent = createElement("span", String(current));
  const skip = createElement("button", "Proxímo");
  skip.setAttribute("id", "skip");

  function mountLyric() {

    const newLyrics = teams[current].team_name.split("");
    for (i in newLyrics) {
      const lyric = createElement("p", "*");
      lyric.setAttribute("id", newLyrics[i].toUpperCase() + i);
      lyric.classList.add("lyric");
      fieldLyric.appendChild(lyric);
    }

  }

  mountLyric();

  inputLyric.addEventListener("input", ({ target }) => {

    const lyricInput = target.value.toUpperCase();
    const lyrics = document.querySelectorAll(".lyric");

    lyrics.forEach((element, index) => {

      if (element.id === lyricInput + index) {
        document.querySelector(`#${lyricInput}${index}`).innerHTML = lyricInput;
      }
    })

    inputLyric.value = "";

  })

  image.src = teams[current].team_badge;
  fieldLyric.classList.add("field-lyrics");

  back.addEventListener("click", () => {

    current -= 1;

    if (current === 0) {
      document.querySelector(".game #back").setAttribute("disabled", "");
      document.querySelector(".game span").innerHTML = current;
      document.querySelector(".game img").src = teams[current].team_badge;
      return;
    }

    document.querySelector(".field-lyrics").innerHTML = "";
    mountLyric();

    document.querySelector(".game span").innerHTML = current;
    document.querySelector(".game img").src = teams[current].team_badge;
    document.querySelector(".game #skip").removeAttribute("disabled", "");

  });

  skip.addEventListener("click", () => {

    current += 1;

    if (current == teams.length) {
      document.querySelector(".game #skip").setAttribute("disabled", "");
      document.querySelector(".game span").innerHTML = current;
      return
    }

    document.querySelector(".field-lyrics").innerHTML = "";
    mountLyric();

    document.querySelector(".game #back").removeAttribute("disabled", "");
    document.querySelector(".game span").innerHTML = current;
    document.querySelector("img").src = teams[current].team_badge;

  });

  fieldControls.appendChild(back);
  fieldControls.appendChild(teamCurrent);
  fieldControls.appendChild(skip);

  game.appendChild(image);
  game.appendChild(fieldLyric);
  game.appendChild(inputLyric);
  game.appendChild(fieldControls);

  container(game);

};

const container = (element) => {

  const banner = createElement("div");
  banner.classList.add("banner");
  banner.appendChild(element);
  document.body.appendChild(banner);

}

findCountries();
