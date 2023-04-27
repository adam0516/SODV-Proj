const express = require("express");
const fs = require("fs");

const app = express();

const PORT = 3000;


app.use(express.static("public"));
app.use(express.json());

app.get("/courses", (req, res) => {
    let code = req.query.code;
    let num = req.query.num;

    if (!code && !num) {
        console.log('no code or num');
        res.status(200).sendFile(__dirname + "/database/courses.json");
    }
    else {
        console.log('code or num');

        let courses = JSON.parse(fs.readFileSync(__dirname + "/database/courses.json"));
        if (!code) {
            console.log('no code');
            res.status(200).json(courses.filter(course => course.num.substring(0,num.length) == num));
        }
        else if (!num) {
            console.log('no num');
            res.status(200).json(courses.filter(course => course.code == code));
        }
        else {
            console.log('code and num');
            res.status(200).json(courses.filter(course => course.code == code && course.num.substring(0,num.length) == num));
        }
    }
});

app.get("/account/:id", (req, res) => {
    let id = req.params.id;
    if(!id) {
        return res.status(400).json({error: "Bad Request"});
    }
    let accounts = JSON.parse(fs.readFileSync(__dirname + "/database/users.json"));
    let account = accounts.find(account => account.id == id);
    if (!account) {
        return res.status(404).json({error: "Account not found"});
    }
    res.json({user: {id: account.id, username: account.username, courses: account.courses}});
});

app.post("/users/login", (req, res) => {
    let { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({error: "Bad Request"});
    }
    let accounts = JSON.parse(fs.readFileSync(__dirname + "/database/users.json"));
    let account = accounts.find(account => account.username == username);
    if (!account) {
        return res.status(404).json({error: "Account not found"});
    }
    if (account.password != password) {
        return res.status(401).json({error: "Unauthorized"});
    }
    res.json({userId: account.id});
});

app.post("/users/signup", (req, res) => {
    let { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({error: "Bad Request"});
    }
    let accounts = JSON.parse(fs.readFileSync(__dirname + "/database/users.json"));
    let account = accounts.find(account => account.username == username);
    if (account) {
        return res.status(409).json({error: "Username already exists"});
    }
    let newAccount = {
        username: username,
        password: password,
        id: accounts.length + 1,
        courses: []
    };
    accounts.push(newAccount);
    fs.writeFileSync(__dirname + "/database/users.json", JSON.stringify(accounts));
    res.status(201).json({userId: newAccount.id});
});

app.patch("/account/:id/courses/add", (req, res) => {
    let course = req.body;
    let { code, num, name, credits, description } = course;
    if (!code || !name || !description) {
        return res.status(400).json({error: "Bad Request, missing required fields"});
    }
    let id = req.params.id;
    if(!id) {
        return res.status(400).json({error: "Bad Request, no id"});
    }
    let accounts = JSON.parse(fs.readFileSync(__dirname + "/database/users.json"));
    let account = accounts.find(account => account.id == id);
    if (!account) {
        return res.status(401).json({error: "Account not found"});
    }
    let existingCourse = account.courses.find(course => course.code == code && course.num == num);
    if (existingCourse) {
        return res.status(409).json({error: "Course already exists"});
    }

    let newCourse = {
        code: code,
        num: num,
        name: name,
        credits: credits,
        description: description
    };
    account.courses.push(newCourse);
    fs.writeFileSync(__dirname + "/database/users.json", JSON.stringify(accounts));
    res.status(201).json({courses: account.courses});
});

app.patch("/account/:id/courses/remove", (req, res) => {
    
    let course = req.body;
    let { code, num } = course;
    if (!code || !num) {
        return res.status(400).json({error: "Bad Request, missing required fields"});
    }
    let id = req.params.id;
    if(!id) {
        return res.status(400).json({error: "Bad Request, no id"});
    }
    let accounts = JSON.parse(fs.readFileSync(__dirname + "/database/users.json"));
    let account = accounts.find(account => account.id == id);
    if (!account) {
        return res.status(401).json({error: "Account not found"});
    }
    let existingCourse = account.courses.find(course => course.code == code && course.num == num);
    if (!existingCourse) {
        return res.status(409).json({error: "Course not found"});
    }
    account.courses = account.courses.filter(course => course.code != code || course.num != num);
    fs.writeFileSync(__dirname + "/database/users.json", JSON.stringify(accounts));
    res.status(200).json({courses: account.courses});
});


//Do not remove this line. This allows the test suite to start
//multiple instances of your server on different ports
module.exports = app;
