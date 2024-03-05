var canvas = document.getElementById("team-canvas")
var ctx = canvas.getContext("2d");

var typesJSON;
var pokemonJSON;
var movesJSON;

var pokemonKeys;

var showdownForm = document.getElementsByClassName('showdown-form')[0];

//Font
var fontBold = new FontFace("Cabin Condensed-Bold", "url(fonts/CabinCondensed-Bold.ttf)")
var fontMedium = new FontFace("Cabin Condensed-Medium", "url(fonts/CabinCondensed-Medium.ttf)")
var fontRegular = new FontFace("Cabin Condensed-Regular", "url(fonts/CabinCondensed-Regular.ttf)")
var fontSemiBold = new FontFace("Cabin Condensed-SemiBold", "url(fonts/CabinCondensed-SemiBold.ttf)")

document.addEventListener("DOMContentLoaded", function() {
  loadImage("images/Background.png")
    .then(image => ctx.drawImage(image, 0, 0))

  fetch("types.json")
    .then(response => response.json())
    .then(json => typesJSON = json);

  fetch("pokemon.json")
    .then(response => response.json())
    .then(json => pokemonJSON = json)
    .then(x => pokemonKeys = Object.keys(pokemonJSON))
    .then(y => console.log(pokemonKeys));

  fetch("moves.json")
    .then(response => response.json())
    .then(json => movesJSON = json);
  
}, false);

fontBold.load().then(function(font) {
  document.fonts.add(font);
});
fontMedium.load().then(function(font) {
  document.fonts.add(font);
});
fontRegular.load().then(function(font) {
  document.fonts.add(font);
});
fontSemiBold.load().then(function(font) {
  document.fonts.add(font);
});

function hi() {
  console.log(typesJSON);
  console.log(pokemonJSON["BULBASAUR"].name);
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    let img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function handleRadioChange(src) {
  let showdownDiv = document.getElementById("showdown-div");
  let pokemonFormDiv = document.getElementById("pokemon-form-div");
  console.log("click");

  if (src.id == "showdownRadio1") {
    selectedInput = 1;
    pokemonFormDiv.setAttribute("hidden", false);
    showdownDiv.removeAttribute("hidden");
  }
  else {
    selectedInput = 2;
    showdownDiv.setAttribute("hidden", false);
    pokemonFormDiv.removeAttribute("hidden");
  }
}

function clearCanvas() {
  ctx.clearRect(0,0,canvas.width, canvas.height);
}

showdownForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  var form = e.target;

  let showdownFormat = form[2].value.trim().split("\n\n")
  let pokemonObj = [];
  showdownFormat.forEach(pokemon => {
    pokemonObj.push(showdownParser(pokemon.split("\n")));
  });
  console.log(pokemonObj);

  clearCanvas();
  await loadImage("images/Background.png")
    .then(image => ctx.drawImage(image, 0, 0))
    .then(function(x)  {
      ctx.font = '30pt Cabin Condensed-Regular';
      ctx.fillStyle = 'white';
      ctx.fillText(form[0].value, 85, 111);
      ctx.fillText(form[1].value, 552, 111);

      let pokemonSlot = 1;
      pokemonObj.forEach(pkmn => {
        drawPokemon(pkmn, pokemonSlot);
        pokemonSlot += 1;
      });
    })
    ;

  ctx.fillStyle = 'white';

});

/**
 * @param {Object} pokemon Pokemon object
 * @param pokemon.name The species of the Pokemon
 * @param pokemon.nickname The nickname given to the Pokemon
 * @param pokemon.gender The gender of the Pokemon
 * @param pokemon.ability The ability of the Pokemon
 * @param pokemon.item The item the Pokemon is holding
 * @param pokemon.level The level of the Pokemon, default 100
 * @param pokemon.shiny If the Pokemon is shiny, default false
 * @param pokemon.nature The nature of the Pokemon
 * @param pokemon.evs An array of the Pokemon's EVs [HP, Atk, Def, SpA, SpD, Spe]
 * @param pokemon.ivs An array of the Pokemon's IVs [HP, Atk, Def, SpA, SpD, Spe]
 * @param pokemon.moves An array of the Pokemon's moves
 * @param pokemon.hiddenPower The type of the Pokemon's Hidden Power
 * @param pokemon.teraType The Tera Type of the Pokemon
 */
function drawPokemon(pokemon, slot) {
  let boxPosition = 0;

  switch (slot) {
    case 1:
      boxPosition = [64, 154]
      break;
    case 2:
      boxPosition = [976, 154]
      break;
    case 3:
      boxPosition = [64, 423]
      break;
    case 4:
      boxPosition = [976, 423]
      break;
    case 5:
      boxPosition = [64, 692]
      break;
    case 6:
      boxPosition = [976, 692]
      break;
    default:
      break;
  }

  //Pokemon Name
  ctx.font = "30pt Cabin Condensed-Bold";
  ctx.fillText(pokemon.nickname != "" ? pokemon.nickname : pokemon.name, boxPosition[0] + 24, boxPosition[1] + 52);

  //Level
  ctx.font = "18pt Cabin Condensed-Regular";
  ctx.fillText("Lv. " + pokemon.level, boxPosition[0] + 24, boxPosition[1] + 99);

  //Ability
  ctx.font = "24pt Cabin Condensed-Regular";
  ctx.fillText(pokemon.ability, boxPosition[0] + 24, boxPosition[1] + 154);

  //Item
  ctx.fillText(pokemon.item, boxPosition[0] + 66, boxPosition[1] + 210);
  if (pokemon.item != "") {
    loadImage("images/items/" + pokemon.item + " SV.png")
      .then(image => ctx.drawImage(image, boxPosition[0] + 24, boxPosition[1] + 184, 35, 35))
      .catch(rejected => console.log("Item image is unavailable"));
  }

  //Gender
  if (pokemon.gender == "M") {
    loadImage("images/M.png")
      .then(image => ctx.drawImage(image, boxPosition[0] + 116, boxPosition[1] + 71, 35, 35))
  }
  else if (pokemon.gender == "F") {
    loadImage("images/F.png")
      .then(image => ctx.drawImage(image, boxPosition[0] + 116, boxPosition[1] + 71, 35, 35))
  }

  //EVs and IVs
  ctx.font = "10pt Cabin Condensed-Bold";
  ctx.textAlign = "center";
  let height = boxPosition[1] + 64;
  pokemon.evs.forEach(ev => {
    ctx.fillText(ev == "999" ? "0" : ev, boxPosition[0] + 838, height);
    height += 16.7;
  });
  height = boxPosition[1] + 64;
  pokemon.ivs.forEach(iv => { 
    ctx.fillText(iv == "999" ? "31" : iv, boxPosition[0] + 866, height);
    height += 16.7;
  });

  //Pokemon
  let pokemonData = pokemonJSON[pokemon.name.toUpperCase()];
  loadImage(pokemonData.icon)
      .then(image => ctx.drawImage(image,  boxPosition[0] + 282, boxPosition[1] + 65, 165, 165))

  //Types  
  let typeIcon = typesJSON[pokemonData.types[0]].icon;

  loadImage(typeIcon)
      .then(image => ctx.drawImage(image, boxPosition[0] + 317, boxPosition[1] + 20, 40, 40));
  if (pokemonData.types.length > 1) {
    typeIcon = typesJSON[pokemonData.types[1]].icon;

    loadImage(typeIcon)
      .then(image => ctx.drawImage(image, boxPosition[0] + 357, boxPosition[1] + 20, 40, 40));
  }
  if (pokemon.teraType != "") {
    typeIcon = typesJSON[pokemon.teraType].teraIcon;
    loadImage(typeIcon)
      .then(image => ctx.drawImage(image, boxPosition[0] + 417, boxPosition[1] + 20, 40, 40));
  } else {
    typeIcon = typesJSON[pokemonData.types[0]].teraIcon;
    loadImage(typeIcon)
      .then(image => ctx.drawImage(image, boxPosition[0] + 417, boxPosition[1] + 20, 40, 40));
  }
  
  //Moves
  ctx.font = "24pt Cabin Condensed-Regular";
  ctx.textAlign = "left";
  let moveTypeHeight = boxPosition[1] + 20;
  let moveTextHeight = boxPosition[1] + 51;
  pokemon.moves.forEach(move => {
    let moveType = movesJSON[move.toUpperCase()];
    typeIcon = typesJSON[moveType].icon;

    loadImage(typeIcon)
      .then(image => ctx.drawImage(image, boxPosition[0] + 488, moveTypeHeight, 40, 40))
      .then(x => {
        ctx.fillText(move, boxPosition[0] + 538, moveTextHeight);
    
        moveTypeHeight += 52;
        moveTextHeight += 52;
      });
  });
}

function showdownParser(pokemonArr = []) {
  if (pokemonArr.length == 0) return;
  if (pokemonArr.length == 1 && pokemonArr[0] == "") return;

  var pokemon = {
    name: "",
    nickname: "",
    gender:"",
    ability:"",
    item: "",
    level: "100",
    shiny: false,
    nature: "",
    evs: [],
    ivs: [],
    moves:[],
    hiddenPower:"",
    teraType: ""
  }

  pokemonArr.forEach(line => {
    line = line.trim();

    //Ability
    if (line.toUpperCase().startsWith("ABILITY")) {
      if (line.includes("Ability:")) {
        line = line.replace("Ability:", "").trim();
      }
      else if (line.includes("Ability")) {
        line = line.replace("Ability", "").trim();
      }
      pokemon.ability = line;
    }

    //Level
    if (line.toUpperCase().startsWith("LEVEL")) {
      if (line.includes("Level:")) {
        line = line.replace("Level:", "").trim();
      }
      else if (line.includes("Level")) {
        line = line.replace("Level", "").trim();
      }
      pokemon.level = line;
    }

    //Shiny
    if (line.toUpperCase().startsWith("SHINY")) {
      if (line.includes("Shiny:")) {
        line = line.replace("Shiny:", "").trim();
      }
      else if (line.includes("Shiny")) {
        line = line.replace("Shiny", "").trim();
      }
      pokemon.shiny = line.toUpperCase() == "YES" ? true : false;
    }

    //Nature
    if (line.toUpperCase().endsWith(" NATURE")) {
      line = line.replace("Nature", "").trim();
      pokemon.nature = line;
    }

    //EVs
    if (line.toUpperCase().startsWith("EVS")) {
      if (line.includes("EVs:")) {
        line = line.replace("EVs:", "").trim();
      }
      else if (line.includes("EVs")) {
        line = line.replace("EVs", "").trim();
      }
      let evs = getAllIvs(line);
      pokemon.evs = evs
    }

    //IVs
    if (line.toUpperCase().startsWith("IVS")) {
      if (line.includes("IVs:")) {
        line = line.replace("IVs:", "").trim();
      }
      else if (line.includes("IVs")) {
        line = line.replace("IVs", "").trim();
      }
      let ivs = getAllIvs(line);
      pokemon.ivs = ivs
    }

    //Moves
    if (line.startsWith("-")) {
      pokemon.moves.push(line.replace("-", "").trim());
    }


    //Hidden Power
    if (line.toUpperCase().startsWith("HIDDEN POWER")) {
      if (line.includes("Hidden Power:")) {
        line = line.replace("Hidden Power:", "").trim();
      }
      else if (line.includes("Hidden Power")) {
        line = line.replace("Hidden Power", "").trim();
      }
      pokemon.hiddenPower = line;
    }

    //Tera Type
    if (line.toUpperCase().startsWith("TERA TYPE")) {
      if (line.includes("Tera Type:")) {
        line = line.replace("Tera Type:", "").trim();
      }
      else if (line.includes("Tera Type")) {
        line = line.replace("Tera Type", "").trim();
      }
      pokemon.teraType = line;
    }

  });

  //First line for name, nickname, gender, and item
  let firstLine = pokemonArr[0].trim();
  let splitFirstLine = firstLine.split(" ");
  let itemExists = false;

  splitFirstLine.forEach(word => {

    if (pokemonKeys.includes(word.toUpperCase().trim())) {
      pokemon.name = word.trim();
    }
    else if (word.startsWith("(") && word.endsWith(")")) {
      let slicedWord = word.slice(1, -1);
      if (slicedWord == "F" || slicedWord == "M") {
        pokemon.gender = slicedWord;
      } else {
        pokemon.name = slicedWord;
      }
    }
    else if (word == "@") {
      itemExists = true;
    }
    else if (itemExists) {
      pokemon.item += word + " ";
    }
    else {
      pokemon.nickname += word + " ";
    }
  });
  //Nickname and item trimmed
  pokemon.nickname = pokemon.nickname.trim();
  pokemon.item = pokemon.item.trim();

  return pokemon;
}

function calculateHiddenPower(ivs = []) {

}

function getAllIvs(ivs = "") {
  let result = ["999", "999", "999", "999", "999", "999"];
  let ivArr = ivs.split("/");

  ivArr.forEach(e => {
    if(e.includes("HP")) {
      result[0] = e.trim().split(" ")[0]
    } 

    else if(e.includes("Atk")) {
      result[1] = e.trim().split(" ")[0]
    } 
    
    else if(e.includes("Def")) {
      result[2] = e.trim().split(" ")[0]
    } 
    
    else if(e.includes("SpA")) {
      result[3] = e.trim().split(" ")[0]
    } 

    else if(e.includes("SpD")) {
      result[4] = e.trim().split(" ")[0]
    } 

    else if(e.includes("Spe")) {
      result[5] =e.trim().split(" ")[0]
    } 
  });

  return result;
}