import _ from "lodash";

export default function sortClientList(clientList, sortBy) {
  switch (sortBy) {
    case "lname":
    case "fname":
      return _.sortBy(clientList, (client) => client[sortBy].toLowerCase());
    case "favorite":
      return _.sortBy(clientList, (client) => client.favorite === true);
    // other sorting criteria can be added here
    default:
      return clientList;
  }
}
