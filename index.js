const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const connection = require('./DB/db');
const Users = require('./users/users');
const cors = require("cors");
const JWT = require('jsonwebtoken');
const Games = require('./games/games');

const { Error } = require("sequelize");

const JWTSecret = "iutyrbfpuioebyo";

function auth(req,res,next){
  const authToken = req.headers['authorization'];
  if(authToken != undefined){
    const bearer = authToken.split(' ');
    var token = bearer[1];
    JWT.verify(token, JWTSecret, (err,data) => {
      if(err) {
        res.status(401);
        res.json({err: "Token invalido"});
      }else{
        req.token = token;
        req.loggedUser = {id: data.id, email: data.email};
        next();
        
            }
    });


  }else{
    res.status(401);
    res.json({err: "Token invalido"});
  }
 
}


//Database
connection
.authenticate()
.then(() => {
    console.log("successfully connected!!!");
})
.catch((error) => {
    console.log("error");
})

app.use(cors());
//Static
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


app.get("/games",  (req, res) => {
    Games.findAll().then(games =>{
        res.send(games);
    })
    res.statusCode = 200;
    });

    app.get("/games/:id", (req, res) => {
        var id = req.params.id;
        Games.findOne({
          where: {
            id: id
          }
        }).then(games => {
          if (games != undefined){
            return res.status(200).json(games);
          } else {
            return res.status(400).send('Id invalido');
          }
           
        })
        
      });

app.post("/games", auth, (req, res) => {
    var games = req.body;
    console.log(games);
    Games.create(
        games
    );
    res.sendStatus(200);
    console.log("Game cadastrado");
})

app.delete("/games/:id", auth,  (req,res) => {
  var id = req.params.id;
  Games.destroy({
    where: {
      id: id
    }
  }).then(games => {
    if (games != undefined){
      return res.status(200).json(games);
    } else {
      return res.status(400).send('Id invalido');
    }
     
  })
});

app.put("/games/:id", auth, (req,res) => {
  var id = req.params.id;
  var title = req.body.title;
  var year = req.body.year;
  var price = req.body.price;
   /* Category.update({title: title, slug: slugify(title)}, */
  Games.update({title:title, year:year, price:price},{
    where: {
      id: id
    }
  }).then(games => {
    if (games != undefined){
      return res.status(200).json(games);
    } else {
      return res.status(400).send('Id invalido');
    }
     
  })
});


app.post("/login", (req, res) => {
  var email = req.body.email;
  var password = req.body.password; 
  if(email != undefined){
    Users.findOne({where:{
      email: email,
      password: password
    }}).then(user =>{

   
    if(user != undefined) {
      if(user.password == password) {
          //payload - as informações que serao salvas no payload
          JWT.sign({id:user.id, email: user.email}, JWTSecret,{expiresIn:'24h'},(err, token) => {
              if(err){
                  res.status(400);
                  res.json({err: "Falha interna"});
              }else{
                  res.status(200);
                  res.json({token: token});
              }
          })          
      }else{
          res.status(401);
          res.json({err: "Credenciais invalidas"});
      }
     }else{
      res.status(404);
      res.json({err: "O email enviado não existe na base de dados"});
     }
    })
  }else{
      res.status(400);
      res.json({err: "Email invalido"});
  }
    
  });

 app.get("/users", (req, res) => {
  Users.findAll().then(user =>{
      res.send(user);
  })
  res.statusCode = 200;
  });




/* app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json()); */




app.listen(8080, () =>{ console.log("app rodando");});