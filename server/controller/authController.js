const bcrypt = require("bcryptjs");

module.exports = {
  
  register: (req, res, next) => {
    const db = req.app.get("db");
    const { username, password, isAdmin } = req.body;
    db.get_user(username).then(user => {
      if (user.length) {
        res.status(400).send("username exists");
      }
      console.log([username, password, isAdmin])
      
      const saltRounds = 12;
      bcrypt.genSalt(saltRounds).then(salt => {
        bcrypt.hash(password, salt).then(hashedPassword => {
          db.register_user([isAdmin, username, hashedPassword]).then(createdUser => {
            req.session.user = {
              id: createdUser[0].id,
              username: createdUser[0].username,
              isAdmin: createdUser[0].is_admin
            };
            res.status(200).send(req.session.user);
          });
        });
      });
    });
  },

  login: async (req, res, next) => {
    const { username, password } = req.body;
    const foundUser = await req.app.get('db').get_user([username]);
    const user = foundUser[0];
    if (!user){
      return res.status(401).send('User not found');
    } 

    const isAuthenticated = bcrypt.compareSync(password, user.hash);
    if (!isAuthenticated) {
      return res.status(403).send('Incorrect Password');
    }
    req.session.user = { isAdmin: user.is_admin, id: user.id, username: user.username };
    console.log(req.session.user);
    return res.send(req.session.user);
    },

  logout: (req, res) => {
    console.log(req.session.user);
    req.session.destroy();
    console.log("hit")
    return res.status(200);
  }
};

