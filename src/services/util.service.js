import { ACCES_KEY } from '../../secret.js';
import { storageService } from "./async-storage.service.js";

export const utilService = {
  makeId,
  makeLorem,
  getRandomIntInclusive,
  debounce,
  randomPastTime,
  saveToStorage,
  loadFromStorage,
  createBoardFromScene,
  fetchListOfPhotos,
  getImgs,
};

const STORAGE_KEY = "imgsDb";
let imgs = {}

function makeId(length = 6) {
  var txt = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < length; i++) {
    txt += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return txt;
}

async function fetchListOfPhotos (query = '', page= '1') {
  try {
    let response = null
    response = await fetch(`https://api.unsplash.com/search/photos?client_id=${ACCES_KEY}&query=${query}&page=${page}`)
    let json = await response.json()
    const res = json.results.map((img) => {
      return img.urls.regular
    })
    res.forEach(img => {
      if(!imgs[query.toLowerCase()]) imgs[query.toLowerCase()] = []
      imgs[query.toLowerCase()].push(img)
    })
    saveToStorage(STORAGE_KEY, imgs)
  } catch (err) {
    console.log('Cannot load photos', err)
    throw err
  }
}

function getImgs(query) {
  var imgs = loadFromStorage(STORAGE_KEY)[query.toLowerCase()];
  console.log(imgs);
  return imgs
}

function makeLorem(size = 100) {
  var words = [
    "The sky",
    "above",
    "the port",
    "was",
    "the color of television",
    "tuned",
    "to",
    "a dead channel",
    ".",
    "All",
    "this happened",
    "more or less",
    ".",
    "I",
    "had",
    "the story",
    "bit by bit",
    "from various people",
    "and",
    "as generally",
    "happens",
    "in such cases",
    "each time",
    "it",
    "was",
    "a different story",
    ".",
    "It",
    "was",
    "a pleasure",
    "to",
    "burn",
  ];
  var txt = "";
  while (size > 0) {
    size--;
    txt += words[Math.floor(Math.random() * words.length)] + " ";
  }
  return txt;
}

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}

function randomPastTime() {
  const HOUR = 1000 * 60 * 60;
  const DAY = 1000 * 60 * 60 * 24;
  const WEEK = 1000 * 60 * 60 * 24 * 7;

  const pastTime = getRandomIntInclusive(HOUR, WEEK);
  return Date.now() - pastTime;
}

function debounce(func, timeout = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}

function saveToStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function loadFromStorage(key) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : undefined;
}

function createBoardFromScene(scene) {
  delete scene.props, delete scene.type;
  scene.groups.forEach((group) => {
    delete group.props, delete group.type;
    group.tasks.forEach((task) => {
      delete task.loading, delete task.type, delete task.data;
    });
  });
  const board = {
    groups: scene.groups,
  };
  return board;
}
