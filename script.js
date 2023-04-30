let displayInit = () => {
  const displayName = document.createElement("h1");
  const displayDescription = document.createElement("p");
  const display = document.createElement("div");
  const displayText = document.createElement("textarea");

  display.classList.add("keyboard__container");
  displayText.classList.add("use-keyboard-input");
  displayName.classList.add("keyboard-name");
  displayDescription.classList.add("keyboard-description");

  displayName.textContent = "RSS Виртуальная клавиатура";
  displayDescription.textContent =
    "Клавиатура создана в операционной системе Windows. Для переключения языка комбинация: левыe shift + alt. Баг: корректное переключение сработатет только при условии, что язык вашей системы ОС совпадает с языком, который становлен в Виртуальной клавиатуре";

  document.body.appendChild(display);
  display.appendChild(displayName);
  display.appendChild(displayDescription);
  display.appendChild(displayText);
};
const Keyboard = {
  elements: {
    main: null,
    keysContainer: null,
    keys: [],
  },

  eventHandlers: {
    oninput: null,
    onclose: null,
  },

  properties: {
    value: "",
    language: "eng",
    capsLock: false,
  },

  init() {
    // Create main elements
    this.elements.main = document.createElement("div");
    this.elements.keysContainer = document.createElement("div");

    // Setup main elements
    this.elements.main.classList.add("keyboard", "keyboard--hidden");
    this.elements.keysContainer.classList.add("keyboard__keys");
    this.elements.keysContainer.appendChild(this._createKeys());

    this.elements.keys =
      this.elements.keysContainer.querySelectorAll(".keyboard__key");

    // Add to DOM
    this.elements.main.appendChild(this.elements.keysContainer);
    document.body.appendChild(this.elements.main);

    // Automatically use keyboard for elements with .use-keyboard-input
    document.querySelectorAll(".use-keyboard-input").forEach((element) => {
      this.open(element.value, (currentValue) => {
        element.value = currentValue;
      });
    });
  },

  _createKeys() {
    const fragment = document.createDocumentFragment();
    const keyLayoutEng = [
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "0",
      "-",
      "=",
      "backspace",
      "tab",
      "q",
      "w",
      "e",
      "r",
      "t",
      "y",
      "u",
      "i",
      "o",
      "p",
      "[",
      "]",
      "caps",
      "a",
      "s",
      "d",
      "f",
      "g",
      "h",
      "j",
      "k",
      "l",
      ";",
      "'",
      "enter",
      "shift",
      "z",
      "x",
      "c",
      "v",
      "b",
      "n",
      "m",
      ",",
      ".",
      "?",
      "done",
      "alt",
      "space",
      "lang",
    ];
    const keyLayoutBel = [
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "0",
      "-",
      "=",
      "backspace",
      "tab",
      "й",
      "ц",
      "у",
      "к",
      "е",
      "н",
      "г",
      "ш",
      "ў",
      "з",
      "х",
      "'",
      "caps",
      "ф",
      "ы",
      "в",
      "а",
      "п",
      "р",
      "о",
      "л",
      "д",
      "ж",
      "э",
      "enter",
      "shift",
      "я",
      "ч",
      "с",
      "м",
      "і",
      "т",
      "ь",
      "б",
      "ю",
      ".",
      "done",
      "alt",
      "space",
      "lang",
    ];

    // Creates HTML for an icon
    const createIconHTML = (icon_name) => {
      return `<i class="material-icons">${icon_name}</i>`;
    };

    keyLayoutEng.forEach((key) => {
      const keyElement = document.createElement("button");
      const insertLineBreak =
        ["backspace", "]", "enter", "done"].indexOf(key) !== -1;

      // Add attributes/classes
      keyElement.setAttribute("type", "button");
      keyElement.classList.add("keyboard__key");

      switch (key) {
        case "backspace":
          keyElement.classList.add("keyboard__key--wide");
          keyElement.innerHTML = createIconHTML("backspace");
          keyElement.dataset.value = key;

          keyElement.addEventListener("click", () => {
            this.properties.value = this.properties.value.substring(
              0,
              this.properties.value.length - 1
            );
            this._triggerEvent("oninput");
          });

          break;

        case "caps":
          keyElement.classList.add(
            "keyboard__key--wide",
            "keyboard__key--activatable"
          );
          keyElement.innerHTML = createIconHTML("keyboard_capslock");
          keyElement.dataset.value = key;

          keyElement.addEventListener("click", () => {
            this._toggleCapsLock();
            keyElement.classList.toggle(
              "keyboard__key--active",
              this.properties.capsLock
            );
          });

          break;

        case "tab":
          keyElement.classList.add("keyboard__key--wide");
          keyElement.dataset.value = key;
          keyElement.textContent = key.toLowerCase();
          keyElement.addEventListener("click", () => {
            this.properties.value += "    ";
            this._triggerEvent("oninput");
          });

          break;

        case "enter":
          keyElement.classList.add("keyboard__key--wide");
          keyElement.innerHTML = createIconHTML("keyboard_return");
          keyElement.dataset.value = key;

          keyElement.addEventListener("click", () => {
            this.properties.value += "\n";
            this._triggerEvent("oninput");
          });

          break;

        case "space":
          keyElement.classList.add("keyboard__key--extra-wide");
          keyElement.innerHTML = createIconHTML("space_bar");
          keyElement.dataset.value = key;

          keyElement.addEventListener("click", () => {
            this.properties.value += " ";
            this._triggerEvent("oninput");
          });

          break;

        case "done":
          keyElement.classList.add(
            "keyboard__key--wide",
            "keyboard__key--dark"
          );
          keyElement.innerHTML = createIconHTML("check_circle");

          keyElement.addEventListener("click", () => {
            this.close();
            this._triggerEvent("onclose");
          });

          break;

        case "lang":
          keyElement.classList.add("keyboard__key--wide");
          keyElement.textContent = this.properties.language;
          keyElement.addEventListener("click", () => {
            if (this.properties.language == "bel") {
              this.properties.language = "eng";
              keyElement.textContent = "eng";
              this._toggleLanguage(keyLayoutEng);
            } else {
              this.properties.language = "bel";
              keyElement.textContent = "bel";
              this._toggleLanguage(keyLayoutBel);
            }
            lang = this.properties.language;
            setLocalStorage();
            this._triggerEvent("oninput");
          });
          keyElement.dataset.value = key;
          break;

        default:
          keyElement.textContent = key.toLowerCase();
          keyElement.dataset.value = key;
          keyElement.addEventListener("click", () => {
            const key = keyElement.dataset.value;
            this.properties.value += this.properties.capsLock
              ? key.toUpperCase()
              : key.toLowerCase();
            this._triggerEvent("oninput");
          });

          break;
      }

      fragment.appendChild(keyElement);

      if (insertLineBreak) {
        fragment.appendChild(document.createElement("br"));
      }
    });

    return fragment;
  },

  _triggerEvent(handlerName) {
    if (typeof this.eventHandlers[handlerName] == "function") {
      this.eventHandlers[handlerName](this.properties.value);
    }
  },

  _toggleCapsLock() {
    this.properties.capsLock = !this.properties.capsLock;

    //////////////change textContent on keyboard///////////////////
    // for (const key of this.elements.keys) {
    //     if (key.childElementCount === 0) {
    //         key.textContent = this.properties.capsLock ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
    //     }
    // }
  },
  _toggleLanguage(keys) {
    const totalNumberOfKeys = document.getElementsByClassName("keyboard__key");
    for (let i = 0; i < totalNumberOfKeys.length; i++) {
      if (
        totalNumberOfKeys[i].classList.contains("keyboard__key--extra-wide")
      ) {
        totalNumberOfKeys[i].dataset.value = keys[i];
      } else if (
        !totalNumberOfKeys[i].classList.contains("keyboard__key--wide")
      ) {
        totalNumberOfKeys[i].textContent = keys[i];
        totalNumberOfKeys[i].dataset.value = keys[i];
      }
    }
  },
  open(initialValue, oninput, onclose) {
    this.properties.value = initialValue || "";
    this.eventHandlers.oninput = oninput;
    this.eventHandlers.onclose = onclose;
    this.elements.main.classList.remove("keyboard--hidden");
  },

  close() {
    this.properties.value = "";
    this.eventHandlers.oninput = oninput;
    this.eventHandlers.onclose = onclose;
    this.elements.main.classList.add("keyboard--hidden");
  },
};

//////////////////////////LOCAL STORAGE////////////////////////////////////
let lang = "eng";
function setLocalStorage() {
  localStorage.setItem("lang", lang);
}
function getLocalStorage() {
  if (localStorage.getItem("lang")) {
    const lang = localStorage.getItem("lang");
    getTranslate(lang);
  }
}
//////////change language keys//////////
const getTranslate = (lang) => {
  let languageElement = document.querySelector(
    `button[data-value="${"lang"}"]`
  );
  languageElement.textContent = lang;
  Keyboard.properties.language == lang;
  if (lang == "bel") {
    const keyLayoutBel = [
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "0",
      "-",
      "=",
      "backspace",
      "tab",
      "й",
      "ц",
      "у",
      "к",
      "е",
      "н",
      "г",
      "ш",
      "ў",
      "з",
      "х",
      "'",
      "caps",
      "ф",
      "ы",
      "в",
      "а",
      "п",
      "р",
      "о",
      "л",
      "д",
      "ж",
      "э",
      "enter",
      "shift",
      "я",
      "ч",
      "с",
      "м",
      "і",
      "т",
      "ь",
      "б",
      "ю",
      ".",
      "done",
      "alt",
      "space",
      "lang",
    ];

    Keyboard._toggleLanguage(keyLayoutBel);
  } else {
    const keyLayoutEng = [
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "0",
      "-",
      "=",
      "backspace",
      "tab",
      "q",
      "w",
      "e",
      "r",
      "t",
      "y",
      "u",
      "i",
      "o",
      "p",
      "[",
      "]",
      "caps",
      "a",
      "s",
      "d",
      "f",
      "g",
      "h",
      "j",
      "k",
      "l",
      ";",
      "'",
      "enter",
      "shift",
      "z",
      "x",
      "c",
      "v",
      "b",
      "n",
      "m",
      ",",
      ".",
      "?",
      "done",
      "alt",
      "space",
      "lang",
    ];

    Keyboard._toggleLanguage(keyLayoutEng);
  }
};
//////////////////////////keyboard keystroke handling//////////////////////////
const checkPressing = (key, event) => {
  let keyboardElement;
  if (key == "Shift") {
    keyboardElement = key.toLowerCase();
  } else if (key == "Enter") {
    keyboardElement = key.toLowerCase();
    Keyboard.properties.value += "\n";
    Keyboard.eventHandlers["oninput"](Keyboard.properties.value);
  } else if (key == "Backspace") {
    keyboardElement = key.toLowerCase();
    Keyboard.properties.value = Keyboard.properties.value.substring(
      0,
      Keyboard.properties.value.length - 1
    );
    Keyboard.eventHandlers["oninput"](Keyboard.properties.value);
  } else if (key == "Alt") {
    keyboardElement = key.toLowerCase();
    let languageElement = document.querySelector(
      `button[data-value="${"lang"}"]`
    );
    if (event.shiftKey === true) {
      if (Keyboard.properties.language == "bel") {
        const keyLayoutEng = [
          "1",
          "2",
          "3",
          "4",
          "5",
          "6",
          "7",
          "8",
          "9",
          "0",
          "-",
          "=",
          "backspace",
          "tab",
          "q",
          "w",
          "e",
          "r",
          "t",
          "y",
          "u",
          "i",
          "o",
          "p",
          "[",
          "]",
          "caps",
          "a",
          "s",
          "d",
          "f",
          "g",
          "h",
          "j",
          "k",
          "l",
          ";",
          "'",
          "enter",
          "shift",
          "z",
          "x",
          "c",
          "v",
          "b",
          "n",
          "m",
          ",",
          ".",
          "?",
          "done",
          "alt",
          "space",
          "lang",
        ];
        Keyboard.properties.language = "eng";
        languageElement.textContent = "eng";
        Keyboard._toggleLanguage(keyLayoutEng);
      } else {
        const keyLayoutBel = [
          "1",
          "2",
          "3",
          "4",
          "5",
          "6",
          "7",
          "8",
          "9",
          "0",
          "-",
          "=",
          "backspace",
          "tab",
          "й",
          "ц",
          "у",
          "к",
          "е",
          "н",
          "г",
          "ш",
          "ў",
          "з",
          "х",
          "'",
          "caps",
          "ф",
          "ы",
          "в",
          "а",
          "п",
          "р",
          "о",
          "л",
          "д",
          "ж",
          "э",
          "enter",
          "shift",
          "я",
          "ч",
          "с",
          "м",
          "і",
          "т",
          "ь",
          "б",
          "ю",
          ".",
          "done",
          "alt",
          "space",
          "lang",
        ];
        Keyboard.properties.language = "bel";
        languageElement.textContent = "bel";
        Keyboard._toggleLanguage(keyLayoutBel);
      }
      lang = Keyboard.properties.language;
      setLocalStorage();
    }
  } else if (key == "Tab") {
    keyboardElement = key.toLowerCase();
    event.preventDefault();
    document.querySelectorAll(".use-keyboard-input").forEach((element) => {
      Keyboard.properties.value = element.value + "    ";
    });
  } else if (key == " ") {
    keyboardElement = "space";
    document.querySelectorAll(".use-keyboard-input").forEach((element) => {
      element.value += " ";
      Keyboard.properties.value = element.value + "";
    });
  } else if (key == "CapsLock") {
    keyboardElement = "caps";
    let capsLockElement = document.querySelector(
      `button[data-value="${keyboardElement}"]`
    );
    Keyboard.properties.capsLock = !Keyboard.properties.capsLock;
    capsLockElement.classList.toggle("keyboard__key--active");
  } else {
    keyboardElement = key.toLowerCase();
    addValueToDisplay(keyboardElement);
  }
  return keyboardElement;
};
//////////////////////////Find keyboard element and add active class//////////////////////////
const toggleKeyClass = (key) => {
  let elementOfKeyboard = document.querySelector(`button[data-value="${key}"]`);
  elementOfKeyboard.classList.toggle("keyboard__key--active--manual");
  setTimeout(
    () => elementOfKeyboard.classList.toggle("keyboard__key--active--manual"),
    100
  );
};
//////////////////////////Find keyboard element and add active class//////////////////////////
// const concatenationOfValues = (displayValue) => {
//     document.querySelectorAll(".use-keyboard-input").forEach(element => {
//             let displayResult = element.value;
//             displayValue += displayResult;
//             setLocalStorage();
//         });
// }
//////////////
document.addEventListener("keydown", function (e) {
  let dataValue = checkPressing(e.key, e);
  toggleKeyClass(dataValue);
});
const addValueToDisplay = (dataValue) => {
  const key = document.querySelector(`button[data-value="${dataValue}"]`)
    .dataset.value;
  Keyboard.properties.value += Keyboard.properties.capsLock
    ? key.toUpperCase()
    : key.toLowerCase();
  Keyboard.eventHandlers["oninput"](Keyboard.properties.value);
};

window.addEventListener("DOMContentLoaded", function () {
  displayInit();
  Keyboard.init();
});

window.addEventListener("beforeunload", setLocalStorage);
window.addEventListener("load", getLocalStorage);
