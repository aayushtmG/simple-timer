"use strict";

// ALL ASSIGNMENTS
const startBtn = document.querySelector("#startButton");
const stopBtn = document.querySelector("#stopButton");
const resetBtn = document.querySelector("#resetButton");
const timerContainer = document.querySelectorAll(".timer-container");
const body = document.querySelector("body");
const minuteContainer = document.querySelector("#minuteContainer");
const secondContainer = document.querySelector("#secondContainer");
const hourContainer = document.querySelector("#hourContainer");
const target = document.querySelectorAll("span");
const turnOff = document.querySelector("#turnOff");

const audio = new Audio("./src/audio.wav");
let timer; //VARIABLE FOR INTERVAL

turnOff.classList.add("hidden");

stopBtn.setAttribute("disabled", "disabled");
//ADDING SPAN ELEMENT IN BOTH CONTAINER WITH LOOP
for (let i = 0; i < 60; i++) {
  let el = document.createElement("span");
  let el1 = document.createElement("span");
  el1.innerText = `${i < 10 ? "0" + i : i}`;
  el.innerText = `${i < 10 ? "0" + i : i}`;
  el1.setAttribute("data-data", i);
  el.setAttribute("data-data", i);
  minuteContainer.appendChild(el1);
  secondContainer.appendChild(el);
}

//ADDING SPAN ELEMENTS IN HOURS CONTAINER
for (let i = 0; i < 24; i++) {
  let el = document.createElement("span");
  el.innerText = `${i < 10 ? "0" + i : i}`;
  hourContainer.appendChild(el);
}
// USING INTERSECTION OBSERVER TO OBSERVE SCROLL
let observer = new IntersectionObserver(
  (entries) => {
    let entry = entries[0];
    if (entry.isIntersecting) {
      if (entry.target.parentNode == minuteContainer) {
        // console.log(entry.target.dataset.data + " min");
        min = Number(entry.target.dataset.data);
      } else if (entry.target.parentNode == secondContainer) {
        // console.log(entry.target.dataset.data + " sec");
        sec = Number(entry.target.dataset.data);
      }
    }
  },
  {
    root: null,
    threshold: 1,
  }
);
target.forEach((el) => {
  observer.observe(el);
});

// -- FUNCTION DECLARATIONS---
//stop timer
function stop() {
  stopBtn.setAttribute("disabled", "disabled");
  clearInterval(timer);
  startInteraction();
}
// SCROLLING
function scroll(targ) {
  targ.scrollBy(0, -40);
}

// STARTING FROM THE BOTTOM AFTER ONE CYCLE
function scrollToBottom(targ) {
  targ.scrollTop = targ.scrollHeight;
}

// PREVENTING KEYBOARD TO MOVE TIMER AFTER STARTED
function preventKeys(e) {
  e.preventDefault();
}
function toggleBtns() {
  document
    .querySelectorAll(".disappear")
    .forEach((btn) => btn.classList.toggle("hidden"));
}
//END WITH RINGTONE
function end() {
  turnOff.classList.remove("hidden");
  toggleBtns();
  stop();
  audio.play();
}

//RESETTING
function reset() {
  audio.load();
  stop();
  secondContainer.scroll(0, 0);
  minuteContainer.scroll(0, 0);
  hourContainer.scroll(0, 0);
}
// START SCROLLING OR ANY OTHER INTERACTION WITH THE TIMER
function startInteraction() {
  timerContainer.forEach((element) => {
    element.style.pointerEvents = "auto";
  });
  document.removeEventListener("keydown", preventKeys);
}

// STOPS SCROLL INTERACTION AFTER STARTING THE TIMER
function stopInteraction() {
  timerContainer.forEach((element) => {
    element.style.pointerEvents = "none";
  });
  document.addEventListener("keydown", preventKeys);
}
function run() {
  stopBtn.removeAttribute("disabled");
  timer = setInterval(() => {
    // RESETING SECONDS AFTER A CYCLE
    if (secondContainer.scrollTop < 60) {
      scrollToBottom(secondContainer);
    } else {
      scroll(secondContainer);
    }
    //END WHEN EVERYTHING IS ZERO
    if (
      minuteContainer.scrollTop < 60 &&
      secondContainer.scrollTop < 60 &&
      hourContainer.scrollTop < 60
    ) {
      end();
    }
    if (
      hourContainer.scrollTop > 55 &&
      secondContainer.scrollTop < 60 &&
      minuteContainer.scrollTop < 60
    ) {
      scroll(hourContainer);
      scrollToBottom(minuteContainer);
    } else {
      // CHECKING WHETHER TO SCROLL THE MINUTE OR NOT
      minuteContainer.scrollTop > 55 && secondContainer.scrollTop < 60
        ? scroll(minuteContainer)
        : null;
    }
  }, 1000);
}
// CODES--->
//STARTS THE TIMER
startBtn.addEventListener("click", () => {
  stopInteraction();
  if (minuteContainer.scrollTop > 55 && secondContainer.scrollTop < 60) {
    scroll(minuteContainer);
    scrollToBottom(secondContainer);
    run();
  } else if (
    hourContainer.scrollTop > 55 &&
    minuteContainer.scrollTop < 60 &&
    secondContainer.scrollTop < 60
  ) {
    scroll(hourContainer);
    scrollToBottom(secondContainer);
    scrollToBottom(minuteContainer);
    run();
  } else if (
    hourContainer.scrollTop < 60 &&
    minuteContainer.scrollTop < 60 &&
    secondContainer.scrollTop < 60
  ) {
    alert("Invalid timer");
    stop();
  } else {
    run();
  }
});

// TURN OFF THE ALARM
turnOff.addEventListener("click", () => {
  reset();
  turnOff.classList.add("hidden");
  toggleBtns();
});

//---STOPS! THE TIMER
stopBtn.addEventListener("click", stop);
//---- RESETS THE TIMER
resetBtn.addEventListener("click", () => {
  reset();
});
