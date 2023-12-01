
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { createComplexityLimitRule } = require('graphql-validation-complexity');
require('dotenv').config();

const typeDefs = require('./schema');
const models = require('./models'); // add models 
const db = require('./db'); // for mongoDB connection
const resolvers = require('./resolvers');  // Provide resolver funcitons for our schema fields
const jwt = require('jsonwebtoken');
const helmet = require('helmet'); // for Helmet Middleware
const cors = require('cors'); // for CORS middleware
const depthLimit = require('graphql-depth-limit');


// get the user info from a JWT
const getUser = token => {
    if(token){
        try{
            return jwt.verify(token, process.env.JWT_SECRET); // return user information from the token
        }catch(err){
            throw new Error('Session Invalid');
        }
    }
}

// // for hashing
// const bcrypt = require('bcrypt'); // require for hashing and salting
// const saltRounds = 10;
// // function for hasing and salting
// const passwordEncrypt = async password => {
//     return await bcrypt.hash(password, saltRounds);
// }
// // hash is retrieved from our DB
// const checkPassword = async (plainTextPassword, hashedPassword) => {
//     // res is either true or false
//     return await bcrypt.compare(hashedPassword, plainTextPassword);
// }

// // for json web token
// const jwt = require('jsonwebtoken');
// // generate a JWT that stores a user id
// const generateJWT = await token => {
//     return await jwt.sign({ id: user._id }, process.env.JWT_SECRET);
// }
// // validate the JWT
// const validateJWT = await token => {
//     return await jwt.verify(token, process.env.JWT_SECRET);
// }

const app = express();

// add the middleware at the top of the stack, after const app = express()
app.use(helmet());
app.use(cors());

// env 
const DB_HOST = process.env.DB_HOST;
const port = process.env.PORT || 4000 ;

db.connect(DB_HOST); // connect to the database

// Apollo server setup
const server = new ApolloServer({
     typeDefs,
     resolvers,
     validationRules: [depthLimit(5), createComplexityLimitRule(1000)],
     context: ({ req }) => {
        // get the user token from header
        const token = req.headers.authorization;
        // try to retrieve a user with the token
        const user = getUser(token);
        // for now, let's log the user to the console.
        console.log(user);
        // add the db models to the context
        return { models, user };
     }
    
});

// Apply the Apollo GraphQL middleware and set the path to /api
server.applyMiddleware({ app, path: '/api' });

app.get('/', (req, res) => res.send('Hello world'));

app.listen({ port }, () => 
    console.log(
        `GraphQL server running at http://localhost:${port}${server.graphqlPath}`
    )
);

