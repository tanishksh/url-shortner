


// const sessionIdtoMap = new Map();


// function setUser(id, user) {
//     sessionIdtoMap.set(id, user);
// }

// function getUser(id) {
//     return sessionIdtoMap.get(id);
// }


//also we can use jwt tokens to mantain stateless authentication where we will place the whole data of the user in the payload ...

const jwt = require("jsonwebtoken");

const secretKey = "helloworld"

function setUser(user) {
    return jwt.sign({
        _id: user._id,
        email: user.email,
    },
    secretKey
    );
}

function getUser(token){
    if(!token){
        return null;
    }
    return jwt.verify(token,secretKey);
}

module.exports = {
    setUser, getUser,
}
