function signUp() {
  btn = document.getElementById("signUpBtn");
  btn.addEventListener("click", function() {
    username = document.getElementById("usernameSignUp").value;
    password = document.getElementById("passwordSignup").value;
    postData("https://bcca-pingpong.herokuapp.com/api/register/", {
      name: username,
      pass: password
    })
      .then(data => console.log(JSON.stringify(data)))
      .catch(error => console.error(error));
  });
}

function postData(url = "", data = {}) {
  return fetch(url, {
    method: "Post",
    mode: 'cors',
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
        name: username,
        pass: password
      })
        .then(data => console.log(JSON.stringify(data)))
        .catch(error => console.error(error));
    });
  }

signUp()
login()
