import filterClientList from './filterClientList';
import sortClientList from './sortClients';

export default function getClientResultSet(
  clientList,
  filterBy,
  sortBy,
  sortedDirection,
) {
  let clientsList = filterClientList(clientList, filterBy);

  clientsList = sortClientList(clientsList, sortBy);

  if (sortedDirection === 'desc') {
    clientsList.reverse();
  }

  return clientsList;
}
