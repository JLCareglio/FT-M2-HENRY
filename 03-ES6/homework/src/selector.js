var traverseDomAndCollectElements = function (matchFunc, startEl) {
  var resultSet = [];

  if (typeof startEl === "undefined") startEl = document.body;

  // recorre el árbol del DOM y recolecta elementos que matchien en resultSet
  // usa matchFunc para identificar elementos que matchien
  // TU CÓDIGO AQUÍ

  if (matchFunc(startEl)) resultSet.push(startEl);

  for (let i = 0; i < startEl.children.length; i++) {
    let result = traverseDomAndCollectElements(matchFunc, startEl.children[i]);
    resultSet = [...resultSet, ...result];
  }

  return resultSet;
};

// Detecta y devuelve el tipo de selector
// devuelve uno de estos tipos: id, class, tag.class, tag

var selectorTypeMatcher = function (selector) {
  // tu código aquí
  if (selector[0] == "#") return "id";
  else if (selector[0] == ".") return "class";
  else if (selector.includes(".")) return "tag.class";
  else if (selector.includes(">")) {
    let tags = selector.split(">");
    return "tag > ".repeat(tags.length).slice(0, -3);
  } else if (selector.includes(" ")) {
    let tags = selector.split(" ");
    return "tag ".repeat(tags.length).slice(0, -1);
  } else return "tag";
};

// NOTA SOBRE LA FUNCIÓN MATCH
// recuerda, la función matchFunction devuelta toma un elemento como un
// parametro y devuelve true/false dependiendo si el elemento
// matchea el selector.

var matchFunctionMaker = function (selector) {
  var selectorType = selectorTypeMatcher(selector);
  var matchFunction;

  if (selectorType === "id") matchFunction = (el) => selector === "#" + el.id;
  else if (selectorType === "class")
    matchFunction = (el) => el.classList.contains(selector.substr(1));
  else if (selectorType === "tag.class") {
    matchFunction = (el) => {
      let [tag, clase] = selector.split(".");
      return (
        el.classList.contains(clase) &&
        el.tagName.toLowerCase() === tag.toLowerCase()
      );
    };
  } else if (selectorType === "tag")
    matchFunction = (el) => el.tagName.toLowerCase() === selector.toLowerCase();
  else if (selectorType.includes(">")) {
  } else if (selectorType.includes(" ")) {
  }

  return matchFunction;
};

var $ = function (selector) {
  var elements;
  var selectorMatchFunc = matchFunctionMaker(selector);
  elements = traverseDomAndCollectElements(selectorMatchFunc);
  return elements;
};
