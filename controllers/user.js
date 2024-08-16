

const { UserModel } = require("../models/user");

const { v4: uuidv4 } = require('uuid');
const { setUser } = require("../utils/auth");


async function handleUserSignUp(req, res) {
    const { username, email, password } = req.body;
    await UserModel.create({
        username,
        password: password,
        email: email,
    });
    // return res.render("home");
    return res.redirect('/')
}

async function handleUserLogin(req, res) {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email, password });
    
    if (!user) return res.render('login', { error: "Invalid Username or Password", });

    // //now we will make session id with v4 of uuid named as uuidv4
    // const sessionID = uuidv4();
    // //now we will be using some funtions like (getters and setters) to set user with the uuid and get user using the uuid
    // setUser(sessionID, user);
    // res.cookie('uid', sessionID);

    //now we are using jwt soo 
    const token=setUser(user);
    res.cookie('uid',token);

    // return res.render("home");
    return res.redirect('/')
}

module.exports = {
    handleUserSignUp, handleUserLogin
}