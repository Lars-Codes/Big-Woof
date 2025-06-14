import _ from 'lodash';

export default function searchClients(str, clientResultSet) {
  const searchStr = str.toLowerCase();
  return _.chain(clientResultSet)
    .filter((client) => {
      if (
        client.fname &&
        client.fname.toLowerCase().indexOf(searchStr) !== -1
      ) {
        return true;
      }
      if (
        client.lname &&
        client.lname.toLowerCase().indexOf(searchStr) !== -1
      ) {
        return true;
      }
      if (
        client.phone_number &&
        client.phone_number.toString().toLowerCase().indexOf(searchStr) !== -1
      ) {
        return true;
      }
      return false;
    })
    .value();
}
