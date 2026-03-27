// ===== AUTH SYSTEM =====
// switch login/signup
let isSignup = false;
let isOnce = false;


function toggleAuthMode() {
  isSignup = !isSignup;

  const title = document.getElementById("authTitle");
  const nameField = document.getElementById("authName");
  const toggleText = document.getElementById("toggleAuth");
  const confirmPassword = document.getElementById("confirmPassword");

  

  if (isSignup) {
    title.textContent = "Signup";
    nameField.style.display = "block";
    confirmPassword.style.display = "block";
    toggleText.textContent = "Already have account? Login";
  } else {
    title.textContent = "Login";
    nameField.style.display = "none";
    confirmPassword.style.display = "none";
    toggleText.textContent = "Don't have account? Signup";
  }

  // clear fields when switching
  document.getElementById("authName").value = "";
  document.getElementById("authEmail").value = "";
  document.getElementById("authPassword").value = "";
  document.getElementById("passwordError").innerHTML = "";
  document.getElementById("confirmPassword").value = "";
  document.getElementById("passwordStrength").innerHTML = "";
  document.getElementById("emailError").style.display = "none";
  isOnce = false;
}

// submit login/signup
async function submitAuth(event) {
  if (event) event.preventDefault();

  const name = document.getElementById("authName").value.trim();
  const email = document.getElementById("authEmail").value.trim();
  const password = document.getElementById("authPassword").value.trim();
  const confirmPassword = document.getElementById("confirmPassword").value.trim();

  if(!isSignup){
    if (!email || !password) {
      alert("Email and password are required!");
      return;
    }
  }else{
    if (!name || !email || !password) {
      alert("All fields are required!");
      return;
    }
  }

  if (!validateEmail()) {
    alert("Please enter a valid email");
    return;
  }
  
  if(isSignup){
    if (password !== confirmPassword) {
      alert("Passwords do'nt match!");
      return;
    }
  }

  const url = isSignup
    ? "http://localhost:5000/api/auth/signup"
    : "http://localhost:5000/api/auth/login";

  const body = isSignup
    ? { name, email, password }
    : { email, password };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    const data = await res.json();
    console.log("AUTH RESPONSE:", data);

    // ===== LOGIN SUCCESS =====
    if (!isSignup && data.message === "Login successful") {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      showApp();
      return;
    }

    // ===== SIGNUP SUCCESS =====
    if (isSignup && data.userId) {
      alert("otp send successfully 🎉");

      currentUserId = data.userId;
      document.getElementById("otpSection").style.display = "flex";
      // auto switch to login
      toggleAuthMode();
      return;
    }

    alert(data.message || data.error);

  } catch (err) {
    console.error(err);
    alert("Something went wrong");
  }
}

const password = document.getElementById("authPassword");
const confirmPassword = document.getElementById("confirmPassword");
const passwordError = document.getElementById("passwordError");

confirmPassword.addEventListener("input", () => {
  if (password.value !== confirmPassword.value) {
    passwordError.textContent = "Passwords do not match ❌";
    passwordError.style.color = "red";
  } else {
    passwordError.textContent = "Passwords match ✅";
    passwordError.style.color = "lightgreen";
    passwordError.style.textShadow = "1px 1px black";
  }
  isOnce = true;
});


password.addEventListener("input", () => {
  if(isSignup){
  if(isOnce){
    if (password.value !== confirmPassword.value) {
      passwordError.textContent = "Passwords does not match ❌";
      passwordError.style.color = "red";
    } else {
      passwordError.textContent = "Passwords match ✅";
      passwordError.style.color = "lightgreen";
      passwordError.style.textShadow = "1px 1px black";
    }
  }

    const passwordP = password.value;
    const strengthText = document.getElementById("passwordStrength");
    strengthText.style.display = "block";

    let strength = 0;

    // length check
    if (passwordP.length >= 6) strength++;

    // uppercase + lowercase
    if (/[a-z]/.test(passwordP) && /[A-Z]/.test(passwordP)) strength++;

    // number
    if (/[0-9]/.test(passwordP)) strength++;

    // special character
    if (/[^A-Za-z0-9]/.test(passwordP)) strength++;

    // show result
    if (passwordP.length === 0) {
        strengthText.textContent = "";
        strengthText.style.display = "none";
    } else if (strength <= 1) {
        strengthText.textContent = "Weak Password";
        strengthText.style.color = "red";
        strengthText.style.textShadow = "1px 1px black";
    } else if (strength <= 3) {
        strengthText.textContent = "Medium Password";
        strengthText.style.color = "orange";
        strengthText.style.textShadow = "1px 1px black";
    } else {
        strengthText.textContent = "Strong Password";
        strengthText.style.color = "lightgreen";
        strengthText.style.textShadow = "1px 1px black";
    }
  }
  });



// show app after login
function showApp() {
  document.getElementById("authPage").style.display = "none";
  document.querySelector(".main-container").style.display = "block";
  loadUserInfo();
}

// check login on page load
document.addEventListener("DOMContentLoaded", () => {
  const user = localStorage.getItem("user");

  if (user) showApp();
  else document.querySelector(".main-container").style.display = "none";
});

//email validation
const emailInput = document.getElementById("authEmail");
const emailError = document.getElementById("emailError");

if (emailInput) {
  emailInput.addEventListener("input", validateEmail);
}

function validateEmail() {
  const email = emailInput.value.trim();
  emailError.style.display = "block";

  // simple email regex
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (email.length === 0) {
    emailError.style.display = "none";
    emailError.textContent = "";
    return false;
  }

  if (!emailPattern.test(email)) {
    emailError.textContent = "Invalid email address";
    return false;
  } else {
    emailError.style.display = "none";
    emailError.textContent = "";
    return true;
  }
}

let currentUserId = null;

async function verifyOTP() {
  const otp = document.getElementById("otpInput").value;

  const res = await fetch("https://localhost:5000/api/auth/verify-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId: currentUserId,
      otp
    })
  });

  const data = await res.json();
  alert(data.message);
  document.getElementById("otpSection").style.display = "none";
}


//profile cntrolles
const profileIcon = document.getElementById("profileIcon");
const profileMenu = document.getElementById("profileMenu");

profileIcon.addEventListener("click", () => {
  profileMenu.classList.toggle("show");
});

// close menu when clicking outside
document.addEventListener("click", (e) => {
  if (!e.target.closest(".profile-container")) {
    profileMenu.classList.remove("show");
  }
});

function logout() {
  localStorage.clear();
  location.reload();
}

function loadUserInfo() {
  const user = JSON.parse(localStorage.getItem("user"));

  if (user) {
    document.getElementById("userName").textContent = user.name;
  }else{
    alert("user not found");
  }
}

window.onload = () => {
  const token = localStorage.getItem("token");

  if (token) {
    showApp();
    loadUserInfo();
  } else {
    showLogin();
  }
};