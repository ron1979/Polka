const UserService = require('../services/UserService');

module.exports = app => {
  app.post('/user', (req, res) => {
    const userData = req.body;
    UserService.add(userData)
      .then(addedUser => res.json(addedUser))
      .catch(err => res.status(403).send({ error: `Register failed, ${err}` }));
  });

  app.get('/users', (req, res) => {
    UserService.query()
      .then(users => {
        res.json(users);
      })
      .catch(err => res.status(403).send({ err }));
  });

  app.get('/user', (req, res) => {
    const loginData = req.query.loginData;
    UserService.checkLogin(loginData).then(userFromDB => {
      if (userFromDB) {
        delete userFromDB.password;

        // send back a cookie with userData
        req.session.user = userFromDB;
        res.json(userFromDB);
      } else {
        // send back empty cookie
        req.session.user = null;
        res.status(403).send({ error: 'Login failed!' });
      }
    });
  });

  app.delete('/user', (req, res) => {
    const userId = req.query.userId;
    UserService.remove(userId).then(userId => {
      res.json(userId);
    }).catch(err => res.status(403).send(err));
  });

  app.post('/logout', (req, res) => {
    req.session.reset();
    res.end('Loggedout');
  });
};
