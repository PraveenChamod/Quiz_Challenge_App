let rows;
let columns;
let imgArr = [];
let testArr = [];
let current_tile;
let other_tile;
let Completed = false;
let disMatchingCount = 0;
let matchingCount = 0;
let availableMoves = 30;
let countdownSeconds = 100;
const selectedOptionVal = localStorage.getItem("selectedOption");
if (selectedOptionVal == 3) {
  rows = 3;
  columns = 3;
  let imgArr_3x3 = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
  imgArr = [...imgArr_3x3];
} else {
  rows = 4;
  columns = 4;
  let imgArr_4x4 = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16"];
  imgArr = [...imgArr_4x4];
}

window.onload = function () {
  if (selectedOptionVal == 3) {
    const puzzle_3x3 = document.getElementById("3x3_puzzle");
    puzzle_3x3.style.display = "flex";
  } else {
    const puzzle_4x4 = document.getElementById("4x4_puzzle");
    puzzle_4x4.style.display = "flex";
  }

  let sampleArr = [...imgArr];
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
  const randomArray = [...imgArr];
  const targetArr = shuffleArray(randomArray);
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      let tile = document.createElement("img");
      tile.id = i.toString() + "_" + j.toString() + "_" + sampleArr[0];
      sampleArr.shift();
      if (selectedOptionVal == 3) {
        tile.src = "../assets/slices_3/" + targetArr.shift() + ".jpg";
      } else {
        tile.src = "../assets/slices_4/" + targetArr.shift() + ".jpg";
      }
      tile.addEventListener("dragstart", dragStart);
      tile.addEventListener("dragover", dragOver);
      tile.addEventListener("dragenter", dragEnter);
      tile.addEventListener("dragleave", dragLeave);
      tile.addEventListener("drop", dragDrop);
      tile.addEventListener("dragend", dragEnd);
      if (selectedOptionVal == 3) {
        document.getElementById("puzzle_board1").append(tile);
      } else {
        document.getElementById("puzzle_board2").append(tile);
      }
    }
  }
  completion();
};

function dragStart() {
  current_tile = this;
}

function dragOver(e) {
  e.preventDefault();
}

function dragEnter(e) {
  e.preventDefault();
}

function dragLeave(e) {
  e.preventDefault();
}

function dragDrop() {
  other_tile = this;
}

function dragEnd() {
  let current_Img = current_tile.src;
  let other_Img = other_tile.src;
  const selected_id_arr = current_Img.match(/\/(\d+)\.jpg$/);
  const selected_id = selected_id_arr[1];
  const parts = other_tile.id.split("_");
  const lastNumber = parts[parts.length - 1];

  if (selected_id === lastNumber) {
    current_tile.src = other_Img;
    other_tile.src = current_Img;
  }

  setTimeout(function () {
    completion();
    //Update available moves count
    availableMoves -= 1;
    let movesCount = document.getElementById("movesCount");
    movesCount.textContent = availableMoves;
  }, 1000);
}

function completion() {
  //Find image slices are in correct order
  let testingArr = [];
  if (selectedOptionVal == 3) {
    testingArr = Array.from(
      document.querySelectorAll("#puzzle_board1 img")
    ).map((img) => img.src);
  } else {
    testingArr = Array.from(
      document.querySelectorAll("#puzzle_board2 img")
    ).map((img) => img.src);
  }
  for (const url of testingArr) {
    const digitMatch = url.match(/\/(\d+)\.jpg$/);
    testArr.push(digitMatch[1]);
  }
  if (arraysAreEqual(testArr, imgArr)) {
    Completed = true;
  }

  //Update match & dismatch count
  checkDismatchCount(testArr, imgArr);

  testArr = [];
  if (Completed) {
    succes.classList.add("show");
  }
  if (availableMoves === 0) {
    failure.classList.add("show");
  }
}
function arraysAreEqual(arr1, arr2) {
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }
  return true;
}
function checkDismatchCount(arr1, arr2) {
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      disMatchingCount += 1;
    }
  }
  let disMatchValue = document.getElementById("disMatchValue");
  let matchValue = document.getElementById("matchValue");
  disMatchValue.textContent = disMatchingCount;
  if (selectedOptionVal == 3) {
    matchValue.textContent = 9 - disMatchingCount;
  } else {
    matchValue.textContent = 25 - disMatchingCount;
  }

  disMatchingCount = 0;
  matchingCount = 0;
}

//button configurations
restartPopup.addEventListener("click", function () {
  location.reload();
});
playAgain.addEventListener("click", function () {
  location.reload();
});
closePopup.addEventListener("click", function () {
  succes.classList.remove("show");
  window.history.back();
  Completed = false;
});
window.addEventListener("click", function (event) {
  if (event.target == succes) {
    succes.classList.remove("show");
    window.history.back();
    Completed = false;
  }
});

const exitButton = document.getElementById("exitBtn");
exitButton.addEventListener("click", function () {
  localStorage.removeItem("selectedOption");
  window.history.back();
});

const hintButton = document.getElementById("hintBtn");
const hintPop = document.getElementById("myHintPopup");
const puzzleContainer = document.getElementById("puzzle_container");

hintButton.addEventListener("click", function () {
  hintPop.style.display = "flex";
  puzzleContainer.style.backgroundColor = "#1b1d25";
  setTimeout(function () {
    hintPop.style.display = "none";
    puzzleContainer.style.backgroundColor = "#2d303e";
  }, 1500);
});

window.addEventListener("click", function (event) {
  if (event.target == hintPop) {
    hintPop.style.display = "none";
  }
});

const restartButton = document.getElementById("restartBtn");
restartButton.addEventListener("click", function () {
  location.reload();
});

//sidebar configurations
document.addEventListener("DOMContentLoaded", function () {
  const toggleBtn = document.getElementById("toggleSidebar");
  const sideBar = document.querySelector(".side_bar");
  if (window.innerWidth <= 768) {
    sideBar.style.display = "none";
  }

  toggleBtn.addEventListener("click", function () {
    if (sideBar.style.display === "none") {
      sideBar.style.display = "block";
    } else {
      sideBar.style.display = "none";
    }
  });
});

//Timer configurations
function updateTimerDisplay() {
  const timerElement = document.getElementById("countDown");
  timerElement.textContent = countdownSeconds;
}
function countdown() {
  countdownSeconds--;
  updateTimerDisplay();
  if (countdownSeconds === 0) {
    clearInterval(timerInterval);
    failure.classList.add("show");
  }
}
updateTimerDisplay();
const timerInterval = setInterval(countdown, 1000);

//Status update configurations
document.addEventListener("DOMContentLoaded", function () {
  const disMatchValue = document.getElementById("disMatchValue");
  const matchValue = document.getElementById("matchValue");
  const movesCount = document.getElementById("movesCount");
  const timerElement = document.getElementById("countDown");
  timerElement.textContent = countdownSeconds;
  movesCount.textContent = availableMoves;
  matchValue.textContent = matchingCount;
  disMatchValue.textContent = disMatchingCount;
});
