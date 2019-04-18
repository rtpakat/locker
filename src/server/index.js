const express = require("express");
const cors = require("cors");
const graphqlHTTP = require("express-graphql");
const gql = require("graphql-tag");
const { buildASTSchema } = require("graphql");
const mongoose = require("mongoose");
const User = require("../client/models/user");
const Locker = require("../client/models/lockers");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const bcrypt = require("bcryptjs");

const sizes = [
  {
    name: "s",
    price: 50,
    nextMinute: 25
  },
  {
    name: "m",
    price: 100,
    nextMinute: 50
  },
  {
    name: "l",
    price: 200,
    nextMinute: 100
  }
];
const lockers = [
  { id: 1, name: "locker1", status: 1, size: "s" },
  { id: 2, name: "locker2", status: 2, size: "m" },
  { id: 3, name: "locker3", status: 0, size: "l" },
  { id: 4, name: "locker4", status: 0, size: "s" },
  { id: 5, name: "locker5", status: 0, size: "m" },
  { id: 6, name: "locker6", status: 0, size: "l" },
  { id: 7, name: "locker7", status: 2, size: "s" },
  { id: 8, name: "locker8", status: 2, size: "m" },
  { id: 9, name: "locker9", status: 2, size: "l" },
  { id: 10, name: "locker10", status: 2, size: "s" },
  { id: 11, name: "locker11", status: 2, size: "m" },
  { id: 12, name: "locker12", status: 1, size: "l" }
];

const schema = buildASTSchema(gql`
  input UsersInput {
    email: String!
    password: String!
  }
  type Query {
    lockers: [Locker]
    locker(id: ID): Locker
    User: [User!]!
    size(input: String): Size
    login(email: String!, password: String!): AuthData!
  }
  type Mutation {
    createUser(usersInput: UsersInput): User
    changeLockerStatus(lockerId: ID!, status: Int): Locker
  }

  enum STATUS {
    AVIABLE
    PENDING
    RESERVED
  }

  type Size {
    price: Int
    name: Int
    nextMinute: Int
  }

  type Locker {
    id: ID!
    name: String
    status: Int
    size: String
  }

  type User {
    _id: ID!
    email: String!
    password: String
  }
  type AuthData {
    userId: ID!
    token: String!
    tokenExpiration: Int!
  }

  schema {
    query: Query
    mutation: Mutation
  }
`);

const mapCoin = (locker, id) => locker && { id, ...locker };

const root = {
  lockers: () => lockers.map(mapCoin),
  locker: ({ id }) => mapCoin(lockers[id], id),
  size: async ({ input }) => await sizes.filter(size => size.name == input)[0],
  User: () => {
    return User.find()
      .then(users => {
        return users.map(user => {
          return { ...user._doc, _id: user.id };
        });
      })
      .catch(err => {
        throw err;
      });
  },
  changeLockerStatus: ({ lockerId, status }) => {
    let locker = lockers.find(locker => locker.id == lockerId);
    locker.status = status;
    console.log(locker);
    const lockerss = new Locker({
      id: lockerId,
      name: locker.name,
      status: status,
      size: locker.size
    });
    console.log(lockerss);
    return lockerss.save();

    //TODO: INSERT TO MONGODB
  },
  createUser: args => {
    return User.findOne({
      email: args.usersInput.email,
      password: args.usersInput.password
    })
      .then(user => {
        if (user) {
          throw new Error("User exists already.");
        }
        return bcrypt.hash(args.usersInput.password, 12);
      })
      .then(hashedpassword => {
        const auhtLogin = new User({
          email: args.usersInput.email,
          password: hashedpassword
        });
        return auhtLogin.save();
      })
      .then(result => {
        return { ...result._doc, password: null, _id: result._doc._id };
      })
      .catch(err => {
        throw err;
      });
  },
  login: async ({ email, password }) => {
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("User does not exist!");
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      throw new Error("Password is incorrect!");
    }
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      "somesupersecretkey",
      {
        expiresIn: "1h"
      }
    );
    return { userId: user.id, token: token, tokenExpiration: 1 };
  }
};

const app = express();
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});
app.use(cors());
app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true
  })
);

mongoose
  .connect(
    //  "mongodb+srv://admindb:3L8MAWSuhSsKVDHvcluster0-andry.mongodb.net/test?retryWrites=true"
    "mongodb+srv://admin:niteW9ZFmchb89j@cluster0-andry.mongodb.net/locker-react-dev?retryWrites=true"
  )
  .then(() => {
    // app.listen(3000);
    console.log("MONGODB CONNECT");
  })
  .catch(err => {
    console.log(err);
  });

app.use(favicon(__dirname + "/build/favicon.ico"));
// the __dirname is the current directory from where the script is running
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, "build")));
app.get("/ping", function(req, res) {
  return res.send("pong");
});
app.get("/*", function(req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

const port = process.env.PORT || 4000;
app.listen(port);
console.log(`Running a GraphQL API server at localhost:${port}/graphql`);
