var PAGE_DATA = {};

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
    window.location = "#login";
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
      })
      .catch(error => console.error(error));
    window.location = "#profile";
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
function startGame(url = "", data = {}) {
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      Authorization: `Token ${PAGE_DATA.token}`
    },
    body: JSON.stringify(data)
  }).then(response => response.json());
}

function startingGame() {
  playerOne = document.getElementById("playerOneId").value;
  playerTwo = document.getElementById("playerTwoId").value;
  startBtn = document.getElementById("startGameBtn");
  startBtn.addEventListener("click", function() {
    startGame("https://bcca-pingpong.herokuapp.com/api/new-game", {
      "player-1": playerOne,
      "player-2": playerTwo
    });
  });
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
        users.hidden = false;
        users.innerText += `ID: ${user.id} \n\tUser: ${user.username}\n\n`;
        btn.style.display = "none";
        scoring.style.display = "block";
      });
      console.log(PAGE_DATA);
    });
  });
}

// window.location = '#home'

signUp();
login();
seeUsers();
