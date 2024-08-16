const express = require("express");
const { connectToMongoDB } = require("./connect");
const urlRoute = require("./routes/url");
const URL = require("./models/url");
const path = require('path');
const staticRouter = require("./routes/staticRouter");
const Userrouter = require("./routes/user");
const cookieParser = require("cookie-parser");
const { restrictToLoginUserOnly, checkAuth } = require("./middlewares/auth");

const app = express();
const PORT = 8001;

connectToMongoDB("mongodb://localhost:27017/short-url").then(() =>
  console.log("Mongodb connected")
);

//telling express that i want to use ejs to do server side rendering
//we will be doing ssr using ejs
app.set("view engine", "ejs");
app.set('views', path.resolve("./views"));


app.use(express.json());
//since we are sending the redirecting url in the form and we are using express.json so we will be needing another middleware i.e. urlendcoded to parse the form data 
app.use(express.urlencoded({ extended: false }));
//this above line means that we wil be supporting the json format as well as the form data

//now we have to also do the same as above for the cookie parser because we are using cookies for something check out auth.js in middlewares
app.use(cookieParser());

// -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//now we will be trying server side rendering
// app.get('/test', async (req, res) => {
//   // return res.end("<h1>hello world !!</h1>");

//   const allUrls = await URL.find({});
//   // return res.end(`
//   //         <html>
//   //           <head>
//   //             <body>
//   //               <ol>
//   //                 ${allUrls.map(url => `<li> ${url.shortId} - ${url.redirectURL} - ${url.visitHistory.length} </li>`).join('')}
//   //               </ol>
//   //             </body>
//   //           </head>
//   //         </html>
//   //   `)

//   return res.render('home',{
//     urls:allUrls,
//     name:'Tanishk Sharma',
//   })
// })
// -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
app.use("/url",restrictToLoginUserOnly, urlRoute);    //-----
                                    //--- these two lines means that if the url starts with any of these then urlRoute , staticRouter will be used respectively
app.use("/",checkAuth, staticRouter);    //-----

app.use('/user', Userrouter);

app.get("/url/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    {
      shortId,
    },
    {
      $push: {
        visitHistory: {
          timestamp: Date.now(),
        },
      },
    }
  );
  res.redirect(entry.redirectURL);
});



app.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`));
