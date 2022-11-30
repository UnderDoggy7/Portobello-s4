// import { storageService } from './async-storage.service.js'
import { httpService } from "./http.service.js";
import { utilService } from "./util.service.js";
import { userService } from "./user.service.js";
import { storageService } from "./async-storage.service.js";

import data from '../../fixed-dta.json' assert {type: 'json'};


const STORAGE_KEY = "board";

export const boardService = {
  query,
  getById,
  save,
  remove,
  getEmptyBoard,
  addBoardMsg,
  getTask,
  getGroupById,
};
window.boardService = boardService;

async function query(filterBy = { txt: "" }) {
  var boards = await storageService.query(STORAGE_KEY);
  // return httpService.get(STORAGE_KEY, filterBy)

  // var boards = await storageService.query(STORAGE_KEY)
  // if (filterBy.txt) {
  //     const regex = new RegExp(filterBy.txt, 'i')
  //     boards = boards.filter(board => regex.test(board.title) || regex.test(board.description))
  // }
  // if (filterBy.price) {
  //     boards = boards.filter(board => board.price <= filterBy.price)
  // }
  return boards;
}
function getById(boardId) {
  return storageService.get(STORAGE_KEY, boardId);
  // return httpService.get(`board/${boardId}`)
}

 async function getGroupById(boardId, groupId){
  try{
    const board = await getById(boardId)
    console.log(board);
    return board.groups.find(group => group.id === groupId)

  }catch{

  }
}

function getTask(boardId, groupId, taskId) {
  return storageService.get(STORAGE_KEY, boardId)
    .then(board => board.groups.find(group => group.id === groupId))
    .then(group => group.tasks.find(task => task.id === taskId))
}
function removeTask(boardId, groupId, taskId) {
  return storageService.remove(STORAGE_KEY, boardId)
    .then(board => board.groups.find(group => group.id === groupId))
    .then(group => group.tasks.find(task => task.id === taskId))
}

async function remove(boardId) {
  await storageService.remove(STORAGE_KEY, boardId);
  // return httpService.delete(`board/${boardId}`)
}
async function save(board) {
  var savedBoard;
  if (board._id) {
    savedBoard = await storageService.put(STORAGE_KEY, board);
    // savedBoard = await httpService.put(`board/${board._id}`, board)
  } else {
    // Later, owner is set by the backend
    board.owner = userService.getLoggedinUser();
    savedBoard = await storageService.post(STORAGE_KEY, board);
    // savedBoard = await httpService.post('board', board)
  }
  return savedBoard;
}

async function addBoardMsg(boardId, txt) {
  const savedMsg = await httpService.post(`board/${boardId}/msg`, { txt });
  return savedMsg;
}

function getEmptyBoard() {
  return {
    title: "Board" + utilService.getRandomIntInclusive(1, 100),
    groups: [
      {
        id: "g" + utilService.getRandomIntInclusive(1, 100),
        title: "Group 1",
        archivedAt: 1589983468418,
        tasks: [
          {
            id: "c101" + utilService.getRandomIntInclusive(1, 100),
            title: "Replace logo",
          },
          {
            id: "c102" + utilService.getRandomIntInclusive(1, 100),
            title: "Add Samples",
          },
        ],
      },
      {
        id: "g" + utilService.getRandomIntInclusive(1, 100),
        title: "Group 2",
        archivedAt: 1589983468418,
        tasks: [
          {
            id: "c101" + utilService.getRandomIntInclusive(1, 100),
            title: "Replace logo",
          },
          {
            id: "c102" + utilService.getRandomIntInclusive(1, 100),
            title: "Add Samples",
          },
        ],
      },
      {
        id: "g" + utilService.getRandomIntInclusive(1, 100),
        title: "Group 3",
        archivedAt: 1589983468418,
        tasks: [
          {
            id: "c101" + utilService.getRandomIntInclusive(1, 100),
            title: "Replace logo",
          },
          {
            id: "c102" + utilService.getRandomIntInclusive(1, 100),
            title: "Add Samples",
          },
        ],
      },
    ],
  };
}



// test data

// ; (async () => {
//   setTimeout(async () => {
//     let boardie = data
//     // console.log(boardie[0]);
//     await boardService.save(boardie[0])
//     // await boardService.save(getEmptyBoard())

//   }, 50)
// })()
