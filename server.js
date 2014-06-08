// //////////////////////////////////////////////////////////////////////////
// Configuracion Base
//////////////////////////////////////////////////////////////////////////////

// llamada a los paquetes necesarios
var express    = require("express"); //llamado a ExpressJS
var app        = express(); //definimos nuestra app usando ExpressJS
var bodyParser = require("body-parser"); //llamado al parseador
var mongoose   = require("mongoose"); //llamado al driver MongoDB

app.use(bodyParser()); // nuesta app ahora puede parsear datos

mongoose.connect("mongodb://localhost/userapi"); //coneccion a la BD MongoDB
var User = require("./app/models/user"); //llamado a nuestro modelo de datos

var port = process.env.PORT || 8080; // configuramos el puerto de escucha
/////////////////////////////////////////////////////////////////////////////
//
// Rutas para  la API
// //////////////////////////////////////////////////////////////////////////

var router = express.Router(); //una instancia de el ruteador ExpressJS

//middleware a usar en todas nuestras peticiones
router.use(function(req, res, next) {
  // registros
  console.log("Algo esta sucediendo por aqui...");
  next(); //nos aseguramos de ir a la siguiente ruta y no parar aqui
});

//Ruta inicial de prueba para confirmar que todo este bien
//escucha en http://localhost:8080/api mediante el metodo HTTP GET
router.get("/", function(req, res) {
  res.json({ message: "Hola API REST en NodeJS + ExpressJS + MongoDB !!!"});
});

// Mas rutas para nuestra API //

//ruta POST /users
router.route("/users").post(function(req, res) {
  // crea un user accesando a http://localhost:8080/api/users
  var user = new User(); // creamos una instancia del modelo User
  user.name = req.body.name; //asignamos el nombre de user desde la peticion 
  user.gender = req.body.gender;
  user.company = req.body.company;
  user.email = req.body.email;
  user.phone = req.body.company;
  user.address = req.body.address;

  //guardamos user y verificamos si hay errores
  user.save(function(err) {
    if (err) {
      res.send(err);
    }
    res.json({ message: "Usuario creado!"});
  });
})//esta ruta a continuacion me parece que esta concatenada o anidada a la 
///ruta que creamos arriba
// ruta GET /users que muestra todos los users existentes en la BD
.get(function(req, res) {
  User.find(function(err, users) {
    if (err) {
      res.send(err);
    }
    res.json(users);
  });
});


//ruta GET a /users/:user_id
router.route("/users/:user_id").get(function(req, res) {
  //muestra un user buscado por su ID en
  // http://localhost:8080/api/users/:user_id
  User.findById(req.params.user_id, function(err, user) {
    if (err) {
      res.send(err);
    }
    res.json(user);
  });
})
// ruta PUT a /users/:user_id
// actualiza un user especifico buscado por su ID
.put(function(req, res) {
  User.findById(req.params.user_id, function(err, user) {
    if (err) {
      res.send(err);
    }
    user.name = req.body.name;
    user.gender = req.body.gender;
    user.company = req.body.company;
    user.email = req.body.email;
    user.phone = req.body.company;
    user.address = req.body.address;

    user.save(function(err) {
      if (err) {
        res.send(err);
      }
      res.json({ message: 'Usuario Actualizado!' });
    });
  });
})
// ruta DELETE a /users/:user_id
// elimina un user especifico buscado por su ID
.delete(function(req, res) {
  User.remove({
    _id: req.params.user_id
  }, function(err, user) {
    if (err) {
      res.send(err);
    }
    res.json({ message: 'Usuario eliminado con exito!' });
  });
});


//Nuestras rutas estan prefijadas con /api
app.use("/api", router);

//////////////////////////////////////////////////////////////////////////////

// Arranque de nuestro servidor
// //////////////////////////////////////////////////////////////////////////

app.listen(port);
console.log("Iniciado el servidor NodeJS en el puerto " + port);
