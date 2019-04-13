const express = require("express");
const cors = require("cors");
const graphqlHTTP = require("express-graphql");
const gql = require("graphql-tag");
const { buildASTSchema } = require("graphql");
const mongoose = require("mongoose");
const User = require("../client/models/user");
const _ = require("lodash");
// const bcrypt = require("bcryptjs");

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

  schema {
    query: Query
    # mutation: Mutation
  }
`);

const mapCoin = (locker, id) => locker && { id, ...locker };

const root = {
  lockers: () => lockers.map(mapCoin),
  locker: ({ id }) => mapCoin(lockers[id], id),
  size: async ({input}) =>  await sizes.filter(size => size.name == input)[0],
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
  // changeLockerStatus: ({lockerId, status}) => {
  //   let locker = lockers.find(locker => locker.id == lockerId);
  //   locker.status = status;
  //   return locker;

  //   //TODO: INSERT TO MONGODB
   
  // },
  createUser: args => {
    return User.findOne({ email: args.usersInput.email })
      .then(user => {
        if (user) {
          throw new Error("User exists already.");
        }
        // return bcrypt.hash(args.usersInput.password, 12);
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

    return auhtLogin
      .save()
      .then(result => {
        console.log(result);
        return { ...result._doc, _id: result._doc._id };
      })
      .catch(err => {
        console.log(err);
        throw err;
      });
  }
};

const app = express();
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
    "mongodb+srv://admin:niteW9ZFmchb89j@cluster0-andry.mongodb.net/locker-react-dev?retryWrites=true"
  )
  .then(() => {
    // app.listen(3000);
    console.log("MONGODB CONNECT");
  })
  .catch(err => {
    console.log(err);
  });

const port = process.env.PORT || 4000;
app.listen(port);
console.log(`Running a GraphQL API server at localhost:${port}/graphql`);
