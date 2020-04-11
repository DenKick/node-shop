let express = require('express');
let mysql = require('mysql');
let bodyParser = require('body-parser');
let urlencodedParser = bodyParser.urlencoded({ extended: false });

let app = express();
let conn = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'j0vx858',
  database: 'video-store'
});

app.use(express.static('public'));
app.set('view engine', 'pug');

app.listen(3000, function () {
  console.log('Express works!');
});

app.get('/', function (req, res) {
  conn.query(
    'SELECT * FROM films ORDER BY name',
    function(error, result) {
      if (error) throw error;
      let films = {};
      for (let i = 0; i < result.length; i++) {
        films[result[i]['name']] = result[i];
      };
      res.render ('main', {
        films: JSON.parse(JSON.stringify(films))
      });
    }
  );
});

app.get('/genres', function (req, res) {
  conn.query(
    'SELECT * FROM genres ORDER BY name',
    function(error, result) {
      if (error) throw error;
      let genres = {};
      for (let i = 0; i < result.length; i++) {
        genres[result[i]['id']] = result[i];
      };
      res.render ('genres', {
        genres: JSON.parse(JSON.stringify(genres))
      });
    }
  );
});

app.get('/genre', function(req, res) {
  let genreId = req.query.id;

  let genre = new Promise(function(resolve, reject) {
    conn.query(
      `SELECT * FROM genres WHERE id=${genreId}`,
      function(error, result) {
        if (error) reject(error);
        resolve(result);
      });
  });

  let films = new Promise(function(resolve, reject) {
    conn.query(
      `SELECT * FROM films WHERE genre = (SELECT name FROM genres WHERE id = ${genreId})`,
      function(error, result) {
        if (error) reject(error);
        resolve(result);
      });
  })

  Promise.all([genre, films]).then(function(value) {
    let genreDesc = value[0];
    let genreFilms = value[1];

    for (let i = 0; i < value.length; i++) {
      genreFilms[value[i]['name']] = value[i];
    };

    res.render('genre', {
      genre: JSON.parse(JSON.stringify(genreDesc)),
      films: JSON.parse(JSON.stringify(genreFilms))
    })
  })
});

app.get('/film', function(req, res) {
  let filmId = req.query.id;

  let film = new Promise(function(resolve, reject) {
    conn.query(
      `SELECT * FROM films WHERE id=${filmId}`,
      function(error, result) {
        if (error) reject(error);
        resolve(result);
      });
  });

  Promise.all([film]).then(function(value) {
    let informFilm = value[0][0];
    res.render('film', {
      film: JSON.parse(JSON.stringify(informFilm))
    })
  })
});

app.get('/post', function (req, res) {
  res.render('post');
});

app.post('/order-success', urlencodedParser, function(req, res) {
  let request = {
    name: req.body.name,
    phone: req.body.phone,
    address: req.body.address,
    zip: req.body.zip,
    comment: req.body.comment,
    filmName: req.body.filmName,
    price: req.body.cost
  };
  conn.query(
    `INSERT orders(name, phone_number, address, zip, commentary, film_name, price) VALUES ('${request.name}', '${request.phone}', '${request.address}', '${request.zip}', '${request.comment}', '${request.filmName}', '${request.price}');`,
    function(error, result) {
      if (error) reject(error);
    });
  res.render('success');
});

// app.get('/orders', function (req, res) {
//   conn.query(
//     'SELECT * FROM orders ORDER BY id',
//     function(error, result) {
//       if (error) throw error;
//       let orders = {};
//       for (let i = 0; i < result.length; i++) {
//         orders[result[i]['id']] = result[i];
//       };
//       res.render ('orders', {
//         orders: JSON.parse(JSON.stringify(orders))
//       });
//       console.log(JSON.parse(JSON.stringify(orders)));
//     }
//   );
// });

app.get('/orders', function(req, res) {
  let notCompletedOrders = new Promise(function(resolve, reject) {
    conn.query(
      `SELECT * FROM orders WHERE completed=0`,
      function(error, result) {
        if (error) reject(error);
        resolve(result);
      });
  });

  let completedOrders = new Promise(function(resolve, reject) {
    conn.query(
      `SELECT * FROM orders WHERE completed=1`,
      function(error, result) {
        if (error) reject(error);
        resolve(result);
      });
  });

  Promise.all([film]).then(function(value) {
    let informFilm = value[0][0];
    res.render('film', {
      film: JSON.parse(JSON.stringify(informFilm))
    });
  })
});