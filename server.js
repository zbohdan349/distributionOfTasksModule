require("dotenv").config();

const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const { applyMiddleware } = require('graphql-middleware')
const {makeExecutableSchema} = require('@graphql-tools/schema');
const jwt = require('jsonwebtoken');

const {typeDefs,resolvers} = require('./schema/schema');
const {permissions} = require('./schema/permissions');


const createContext = (req ) => {
  const { headers } = req;
  let currentUser;
  if(!headers.authorization) return;
  // put the auth info into context
  const token = headers.authorization.replace('Bearer ','');
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
    currentUser= {
      _id: decoded._id,
      role:decoded.role
    }
   
    } catch(err) {
      console.error(err);
      return;
    }
  return currentUser ;
};


const schema = applyMiddleware(
  makeExecutableSchema({
    typeDefs,
    resolvers
  }),
  permissions
);
const server = new ApolloServer({
  schema,
});


startStandaloneServer(server, {
  // Your async context function should async and
  // return an object
  context: async ({ req, res }) => ({
    currentUser: createContext(req),
  }),
});
console.log(`Server listening on ${4000} port`)

