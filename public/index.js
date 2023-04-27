

let loginButton = document.getElementById("login-button");
let signupButton = document.getElementById("signup-button");

let accountButton = document.getElementById("account-button");
let logoutButton = document.getElementById("logout-button");

let loggedInDiv = document.getElementById("logged-in-div");
let loggedOutDiv = document.getElementById("logged-out-div");

let courses = document.getElementById("courses");
let courseData = fetch("/courses").then(res => res.json()).then(data => {
    data.forEach(course => {
        let courseDiv = document.createElement("div");
        courseDiv.innerHTML = `<div class="course-header">`
        + `<div><strong><p>${course.code}</strong> ${course.num}</p></div>`
        + `<p>${course.credits} credits</p>`
        + `</div>`
        + `<h2>${course.name}</h2>`
        + `<p>${course.description}</p>`;
        courseDiv.classList.add("course");
        if(userId) {
            let addCourseButton = document.createElement("button");
            addCourseButton.innerText = "Add Course";
            addCourseButton.addEventListener("click", () => {
                fetch(`/account/${userId}/courses/add`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(course)
                }).then(res => res.json()).then(data => {
                    if(data.error) {
                        alert(data.error);
                        return;
                    }
                    else if(data.courses) {
                        alert("Course added");
                    }
                    console.log(data);
                });
            });
            courseDiv.appendChild(addCourseButton);
        }
        courses.appendChild(courseDiv);
    });
});

let showUserDiaglog = false;

let userId;
let isAuthenticated = localStorage.getItem("isAuthenticated") == "true";
if(isAuthenticated) {
    userId = localStorage.getItem("userId");
}
updateState();


loginButton.addEventListener("click", () => {
    window.location.href = "/login.html";
});
signupButton.addEventListener("click", () => {
    window.location.href = "/signup.html";
});

logoutButton.addEventListener("click", () => {
    console.log("logout");
    localStorage.setItem("isAuthenticated", false);
    isAuthenticated = false;
    
    window.location.href = "/";
});

accountButton.addEventListener("click", () => {
    window.location.href = `/account.html`;
});

function updateState() {
    if (isAuthenticated) {
        loggedInDiv.style.display = "block";
        loggedOutDiv.style.display = "none";
    } else {
        loggedInDiv.style.display = "none";
        loggedOutDiv.style.display = "block";
    }
}
