import ApolloClient from 'apollo-boost';

export default new ApolloClient({
  // uri: "http://localhost:5000/graphql",
  uri: "https://server-locker.herokuapp.com/graphql"
});