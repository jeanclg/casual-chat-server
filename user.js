const users = [];

const addUser = ({ id, name, room }) => {
  // Concatena o nome e o room e deixa tudo minusculo
  name = name.trim().toLowerCase();
  room = room.trim().toLowerCase();

  // Pega o usuario que esta sendo criado e faz um filtro se o mesmo ja existe na lista de usuarios ja cadastrados
  const existingUser = users.find((x) => x.name === name && x.room === room);

  // Caso exista o usuario retorna uma mensagem de erro e impede de ser criado um novo usuario
  if (existingUser) return { error: "Username is taken" };

  // Cria um novo usuario
  const user = { id, name, room };

  // Coloca o usuario novo na lista de usuarios
  users.push(user);

  return { user };
};

const removeUser = (id) => {
  // Pego o indice do usuario que tem o mesmo id que quero que seja removido
  const index = users.findIndex((x) => x.id === id);

  // Caso encontrado o usuario, remove ele da lista de usuarios
  if (index !== -1) return users.splice(index, 1)[0];
};

// Pega o usuario a partir do id
const getUser = (id) => users.find((x) => x.id === id);

// Pega todos os usuarios que estão no mesmo room
const getUsersInRoom = (room) => users.filter((x) => x.room === room);

module.exports = { addUser, removeUser, getUser, getUsersInRoom };
