const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const connection = require('./DB/db');
const Games = require('./games/games');
const { Error } = require("sequelize");


//Database
connection
.authenticate()
.then(() => {
    console.log("successfully connected!!!");
})
.catch((error) => {
    console.log("error");
})


//Static
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


app.get("/games", (req, res) => {
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

app.post("/games", (req, res) => {
    var games = req.body;
    console.log(games);
    Games.create(
        games
    );
    res.sendStatus(200);
    console.log("Game cadastrado");
})

app.delete("/games/:id", (req,res) => {
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

app.put("/games/:id", (req,res) => {
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


/* app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json()); */




app.listen(8080, () =>{ console.log("app rodando");});