let coursesDiv = document.getElementById("courses");

let loginButton = document.getElementById("login-button");
let signupButton = document.getElementById("signup-button");

let accountButton = document.getElementById("account-button");
let logoutButton = document.getElementById("logout-button");

let loggedInDiv = document.getElementById("logged-in-div");
let loggedOutDiv = document.getElementById("logged-out-div");

let backButton = document.getElementById("back-button");

let showUserDiaglog = false;

let userId;
let isAuthenticated = localStorage.getItem("isAuthenticated") == "true";
if(isAuthenticated) {
    userId = localStorage.getItem("userId");
}
updateState();

backButton.addEventListener("click", () => {
    window.location.href = "/";
});

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
let userObj = fetch(`/account/${userId}`).then(res => res.json()).then(data => {
    if(data.error) {
        alert(data.error);
        return;
    }
    let userCourses = data.user.courses;
    console.log(userCourses);

    if(userCourses.length == 0) {
        let noCoursesDiv = document.createElement("div");
        noCoursesDiv.innerHTML = `<h2>No courses added</h2><a href="/"><button>Add Courses</button></a>`;
        coursesDiv.appendChild(noCoursesDiv);
        return data.user;
    }
    userCourses.forEach(course => {
        let courseDiv = document.createElement("div");
        courseDiv.innerHTML = `<div class="course-header">`
        + `<div><strong><p>${course.code}</strong> ${course.num}</p></div>`
        + `<p>${course.credits} credits</p>`
        + `</div>`
        + `<h2>${course.name}</h2>`
        + `<p>${course.description}</p>`;

        let removeCourseButton = document.createElement("button");
        removeCourseButton.innerText = "Remove Course";
        removeCourseButton.addEventListener("click", () => {
            fetch(`/account/${userId}/courses/remove`, {
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
                    alert("Course removed");
                    window.location.href = "/account.html";
                }
                console.log(data);
            });
        });
        courseDiv.appendChild(removeCourseButton);
    
        courseDiv.classList.add("course");
        coursesDiv.appendChild(courseDiv);
    });
    return data.user;
});
