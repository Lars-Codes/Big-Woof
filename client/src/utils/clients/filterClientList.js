import _ from "lodash";

export default function filterClientList(clientList, filterBy) {
  switch (filterBy) {
    case "all":
      return clientList;
    case "favorite":
      return _.filter(clientList, (client) => client.favorite === 1);
    // has an upcoming appointment
    // hasnt paid for the last appointment
    // etc...
    default:
      return _.filter(clientList, (client) => client.type === filterBy);
  }
}
