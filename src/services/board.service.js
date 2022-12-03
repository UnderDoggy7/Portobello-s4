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
  getTaskById,
  getGroupById,
  saveTask
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

async function getGroupById(boardId, groupId) {
  try {
    const board = await getById(boardId)
    console.log(board);
    return board.groups.find(group => group.id === groupId)

  } catch {

  }
}

function getTaskById(board,taskId){
  var task
  board.groups.forEach(group => {
    group.tasks.forEach((t) =>{
      if(t.id === taskId) {
        
        task = t
      }
    })
  });

  return task
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
function saveTask(boardId, groupId, taskToSave) {
  if(taskToSave.id){
    return storageService.get(STORAGE_KEY, boardId)
          .then(board =>{
            let groupIdx  = board.groups.findIndex(group => group.id === groupId)
            let taskIdx  = board.groups[groupIdx].tasks.findIndex(task => task.id === taskToSave.id)
            board.groups[groupIdx].tasks[taskIdx] = taskToSave
            return board
          })
          .then(newBoard => storageService.put(STORAGE_KEY,newBoard))
  }
  else{
    return storageService.get(STORAGE_KEY, boardId)
    .then(board =>{
      let groupIdx  = board.groups.findIndex(group => group.id === groupId)
      board.groups[groupIdx].tasks.push(taskToSave)
      return board
    })
    .then(newBoard => storageService.put(STORAGE_KEY,newBoard))
  }
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
    // board.owner = userService.getLoggedinUser();
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
    title: "Portobello",
    isStarred: false,
    archivedAt: 1589983468418,
    owner: {
      _id: "u101",
      fullname: "David Beckham",
      imgUrl: "https://media.gq.com/photos/56e853e7161e63486d04d6c8/4:3/w_1600,h_1200,c_limit/david-beckham-gq-0416-2.jpg"
    },
    style: {
      bgColor: "#75151E",
      imgUrl: ""
    },
    labels: [
      {
        title: "Manager task",
        color: "#7bc86c",
        id: "JsY1qR"
      },
      {
        title: "Low priority",
        color: "#faf3c0",
        id: "d6cjhb"
      },
      {
        title: "Medium priority",
        color: "#fce6c6",
        id: "YIQPhe"
      },
      {
        title: "High priority",
        color: "#f5d3ce",
        id: "DNfXVp"
      },
      {
        title: "Bug",
        color: "#eddbf4",
        id: "oKpZV4"
      },
      {
        title: "Adjustment",
        color: "#0079bf",
        id: "rZnFvJ"
      },
      {
        title: "Design",
        color: "#bcd9ea",
        id: "kT8v8m"
      },
      {
        title: "Styles",
        color: "#bdecf3",
        id: "AYKlTC"
      }
    ],
    members: [
      {
        _id: "u102",
        fullname: "Shakira",
        imgUrl: "https://imagez.tmz.com/image/86/4by3/2022/07/29/86ef71e21a30452980f337bad314dadf_md.jpg"
      },
      {
        _id: "u103242",
        fullname: "Dima",
        imgUrl: "https://ca.slack-edge.com/T03PU4YR4NS-U03QN8N2GSZ-0205edc3fee4-512"
      },
      {
        _id: "u103",
        fullname: "Drake",
        imgUrl: "https://www.biography.com/.image/ar_1:1%2Cc_fill%2Ccs_srgb%2Cfl_progressive%2Cq_auto:good%2Cw_1200/MTQ3NTI2OTA4NzY5MjE2MTI4/drake_photo_by_prince_williams_wireimage_getty_479503454.jpg"
      }
    ],
    groups: [
      {
        id: "g101",
        title: "TODO Today",
        archivedAt: 1589983468418,
        tasks: [
          {
            id: "c101",
            title: "Replace logo"
          },
          {
            id: "c102",
            title: "Add Samples"
          },
          {
            id: "c103",
            title: "Desgin HomePage"
          },
          {
            id: "c104",
            title: "Create AboutPage"
          },
          {
            id: "c105",
            title: "Create SCSS folders"
          }
        ],
        style: {}
      },
      {
        id: "g102",
        title: "High priority",
        tasks: [
          {
            id: "c107",
            title: "Logo",
            archivedAt: 1589983468418
          },
          {
            id: "c108",
            title: "Create board-filter",
            status: "in-progress",
            priority: "high",
            description: "Create a board-filter.cmp that filters the tasks by title,date,priority etc..",
            comments: [
              {
                id: "ZdPnm",
                txt: "also @yaronb please CR this",
                createdAt: 1590999817436,
                byMember: {
                  _id: "u103242",
                  fullname: "Dave",
                  imgUrl: "https://yt3.ggpht.com/ytc/AMLnZu91y_wc558BmAoKGoPJ-HulcExG1u3YQpW_NhbyRA=s900-c-k-c0x00ffffff-no-rj"
                }
              }
            ],
            checklists: [
              {
                id: "YEhmF",
                title: "Todo first",
                todos: [
                  {
                    id: "212jX",
                    title: "Design the cmp",
                    isDone: false
                  },
                  {
                    id: "212jX",
                    title: "Crate MongoDB criteria",
                    isDone: false
                  }
                ]
              }
            ],
            memberIds: [
              "u102",
              "u103"
            ],
            labelIds: [
              "d6cjhb"
            ],
            dueDate: 16156215211,
            byMember: {
              _id: "u101",
              username: "Tal",
              fullname: "Tal Tarablus",
              imgUrl: "http://res.cloudinary.com/shaishar9/image/upload/v1590850482/j1glw3c9jsoz2py0miol.jpg"
            },
            style: {
              bgColor: "#26de81"
            }
          }
        ],
        style: {}
      }
    ],
    activities: [
      {
        id: "a101",
        txt: "Changed Color",
        createdAt: 154514,
        byMember: {
          _id: "u101",
          fullname: "Abi Abambi",
          imgUrl: "http://some-img"
        },
        task: {
          id: "c101",
          title: "Replace Logo"
        }
      }
    ],
    cmpsOrder: [
      "status-picker",
      "member-picker",
      "date-picker"
    ]
  };
}

// test data
    // let boardie = data
    // storageService._save(STORAGE_KEY,boardie)
// ; (async () => {
//   setTimeout(async () => {
//     // console.log(boardie[0]);
//     await boardService.save(boardie[0])
//     // await boardService.save(getEmptyBoard())
//     console.log(boardie[0]);
//   }, 50)
// })()
