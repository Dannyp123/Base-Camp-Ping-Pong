var PAGE_DATA = {};
var playerOnePts = 0;
var playerTwoPts = 0;

function signUp() {
  btn = document.getElementById("signUpBtn");
  btn.addEventListener("click", function() {
    username = document.getElementById("usernameSignUp").value;
    password = document.getElementById("passwordSignup").value;
    repeat = document.getElementById("passwordRepeatSignUp").value;
    postData("https://bcca-pingpong.herokuapp.com/api/register/", {
      username: username,
      password: password,
      password_repeat: repeat
    })
      .then(data => console.log(JSON.stringify(data)))
      .catch(error => console.error(error));
  });
}

function postData(url = "", data = {}) {
  return fetch(url, {
    method: "Post",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    },
    body: JSON.stringify(data)
  }).then(response => response.json());
}

function login() {
  btn = document.getElementById("loginBtn");
  btn.addEventListener("click", function() {
    username = document.getElementById("usernameLogin").value;
    password = document.getElementById("passwordLogin").value;
    postData("https://bcca-pingpong.herokuapp.com/api/login/", {
      username: username,
      password: password
    })
      .then(data => {
        console.log(JSON.stringify(data));
        PAGE_DATA.token = data.token;
        showingWelcomeHeader();
      })
      .catch(error => console.error(error));
  });
}

function seeData(url = "") {
  return fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      Authorization: `Token ${PAGE_DATA.token}`
    }
  }).then(response => response.json());
}
function postGame(url = "", data = {}) {
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      Authorization: `Token ${PAGE_DATA.token}`
    },
    body: JSON.stringify(data)
  }).then(response => response.json());
}

function seeUsers() {
  btn = document.getElementById("userBtn");
  users = document.getElementById("userList");
  scoring = document.getElementById("scoreCard");
  btn.addEventListener("click", function() {
    seeData("https://bcca-pingpong.herokuapp.com/api/users/").then(data => {
      console.log(JSON.stringify(data));
      PAGE_DATA.users = data;
      PAGE_DATA.users.forEach(user => {
        document.getElementById("playerForms").hidden = false;
        document.getElementById("startGameBtn").hidden = false;

        users.hidden = false;
        users.innerText += `ID: ${user.id} \n\tUser: ${user.username}\n\n`;
        btn.style.display = "none";
        scoring.style.display = "block";
      });
      console.log(PAGE_DATA);
    });
  });
}

function startingGame() {
  var startBtn = document.getElementById("startGameBtn");

  startBtn.addEventListener("click", function() {
    var playerOne = document.getElementById("playerOneId").value;
    var playerTwo = document.getElementById("playerTwoId").value;
    PAGE_DATA.player_1 = playerOne;
    PAGE_DATA.player_2 = playerTwo;
    var topTextArea = document.getElementById("usernameOneArea");
    var bottmTextArea = document.getElementById("usernameTwoArea");
    postGame("https://bcca-pingpong.herokuapp.com/api/new-game/", {
      player_1: playerOne,
      player_2: playerTwo
    })
      .then(data => {
        console.log(JSON.stringify(data));
        PAGE_DATA.game = data;
        console.log(PAGE_DATA);
        topTextArea.innerText = data.player_1;
        bottmTextArea.innerText = data.player_2;
      })
      .catch(error => console.error(error));
    document.getElementById("playerForms").hidden = true;
    document.getElementById("userList").hidden = true;
    document.getElementById("startGameBtn").hidden = true;
  });
}

function reloadGame() {
  var reloadBtn = document.getElementById("finishBtn");
  reloadBtn.addEventListener("click", function() {
    console.log(PAGE_DATA);
    postGameScores(
      `https://bcca-pingpong.herokuapp.com/api/score-game/${
        PAGE_DATA.game.id
      }/`,
      {
        points: PAGE_DATA.points
      }
    ).then(data => {
      console.log(JSON.stringify(data));
      PAGE_DATA.game.points = data;
      console.log(PAGE_DATA);
      window.location.reload();
    });
  });
}
reloadGame();

function postGameScores(url = "", data = {}) {
  return fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      Authorization: `Token ${PAGE_DATA.token}`
    },
    body: JSON.stringify(data)
  }).then(response => response.json());
}

function scoreCounter(playerOnePts) {
  PAGE_DATA.points = [];
  var leftButton = document.getElementById("leftBtn");
  var rightBtn = document.getElementById("rightBtn");
  var nameAreaOne = document.getElementById("winner");

  var topTextArea = document.getElementById("scoreHeader");
  leftButton.addEventListener("click", function() {
    if (playerOnePts < 10) {
      topTextArea.innerText = playerOnePts = playerOnePts + 1;
      PAGE_DATA.points.push(PAGE_DATA.game.player_1);
      console.log(PAGE_DATA.game.player_1);
      console.log(PAGE_DATA.points);
    } else {
      rightBtn.disabled = true;
      nameAreaOne.innerText = `Id: ${PAGE_DATA.game.player_1} WON`;
    }
  });
}

function scoreCounterRight(playerTwoPts) {
  PAGE_DATA.points = [];
  var rightBtn = document.getElementById("rightBtn");
  var leftButton = document.getElementById("leftBtn");
  var nameAreaTwo = document.getElementById("winner");

  var bottmTextArea = document.getElementById("scoreFooter");
  rightBtn.addEventListener("click", function() {
    if (playerTwoPts < 10) {
      bottmTextArea.innerText = playerTwoPts = playerTwoPts + 1;
      PAGE_DATA.points.push(PAGE_DATA.game.player_2);
      console.log(PAGE_DATA.game.player_2);
      console.log(PAGE_DATA.points);
    } else {
      leftButton.disabled = true;
      nameAreaTwo.innerText = `Id: ${PAGE_DATA.game.player_2} WON`;
    }
  });
}

function showingWelcomeHeader() {
  var welcomeArea = document.getElementById("welcomeHeader");
  var loginInput = document.getElementById("usernameLogin").value;
  welcomeArea.innerText = `Welcome ${loginInput}`;
}

function loginValidation() {
  var password_input = document.getElementById("passwordLogin");
  var login_inputUsername = document.getElementById("usernameLogin");
  var submittingLogin = document.getElementById("loginBtn");
  var validationAreaPass = document.getElementById("loginPasswordErrorMessage");
  submittingLogin.disabled = true;
  password_input.addEventListener("input", function() {
    if (password_input.value === "") {
      submittingLogin.disabled = true;
      validationAreaPass.innerText = "Must enter a valid Password!";
    } else {
      submittingLogin.disabled = false;
      submittingLogin.addEventListener("click", function() {
        window.location = "#profile";
      });
    }
  });
  login_inputUsername.addEventListener("input", function() {
    if (login_inputUsername.value === "") {
      submittingLogin.disabled = true;
    } else {
      submittingLogin.disabled = false;
    }
  });
}
loginValidation();

function isPasswordValid() {
  var password = document.getElementById("passwordSignup");
  var passwordRepeat = document.getElementById("passwordRepeatSignUp");
  var signUpButton = document.getElementById("signUpForms");
  var error = document.getElementById("errorMessage");

  signUpButton.addEventListener("submit", function(e) {
    e.preventDefault();
    if (password.value.length < 6) {
      passwordRepeat.classList.add("border-danger");
      password.classList.add("border-danger");
      error.innerText = "Password must be at least 6 characters.";
    } else if (passwordRepeat.value != password.value) {
      passwordRepeat.classList.add("border-danger");
      error.innerText = "Passwords Must Match!";
    } else if (passwordRepeat.value === password.value) {
      password.classList.add("border-success");
      passwordRepeat.classList.remove("border-danger");
      passwordRepeat.classList.add("border-success");
      password.classList.remove("border-danger");
      password.classList.add("border-success");
      error.innerText = "";
      window.location = "#login";
    }
  });
}
isPasswordValid();

var player1Points = 0;

function freeStylePlay(player1Points) {
  var leftButton = document.getElementById("lBtn");
  var rightButton = document.getElementById("rBtn");
  var topTextArea = document.getElementById("scoreHeaders");
  var nameOne = document.getElementById("nameOneArea");
  var nameInputOne = document.getElementById("freestyleInputOne");
  var winnerAreaOne = document.querySelector(".winner");
  leftButton.addEventListener("click", function() {
    if (player1Points < 10) {
      topTextArea.innerText = player1Points = player1Points + 1;
    }
    if (player1Points <= 9) {
      nameOne.innerText = nameInputOne.value;
      nameInputOne.style.display = "none";
    } else {
      winnerAreaOne.innerText = `${nameInputOne.value} WINS!`;
      rightButton.disabled = true;
      document.window.reload();
    }
  });
}
freeStylePlay(player1Points);

var player2Points = 0;

function freeStylePlayTwo(player2Points) {
  var rightButton = document.getElementById("rBtn");
  var leftButton = document.getElementById("lBtn");
  var topTextArea = document.getElementById("scoreFooters");
  var nameTwo = document.getElementById("nameTwoArea");
  var nameInputTwo = document.getElementById("freestyleInputTwo");
  var winnerArea = document.querySelector(".winner");
  rightButton.addEventListener("click", function() {
    if (player2Points < 10) {
      topTextArea.innerText = player2Points = player2Points + 1;
    }
    if (player2Points <= 9) {
      nameTwo.innerText = nameInputTwo.value;
      nameInputTwo.style.display = "none";
    } else {
      winnerArea.innerText = `${nameInputTwo.value} WINS!`;
      leftButton.disabled = true;
    }
  });
}
freeStylePlayTwo(player2Points);

function finishFreestyle() {
  var btton = document.getElementById("finishButton");
  btton.addEventListener("click", function() {
    location.reload();
  });
}
finishFreestyle();

window.location = "#home";

signUp();
login();
seeUsers();
startingGame();
scoreCounter(playerOnePts);
scoreCounterRight(playerTwoPts);
