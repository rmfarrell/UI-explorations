import { LoremIpsum } from 'lorem-ipsum';
import uuid from 'uuid/v4';

const lorem = new LoremIpsum({
  sentencesPerParagraph: {
    max: 8,
    min: 4
  },
  wordsPerSentence: {
    max: 20,
    min: 4
  }
});

function teaser() {
  return {
    id: uuid(),
    title: lorem.generateSentences(1),
    source: capitalize(lorem.generateWords(3)),
    author: capitalize(lorem.generateWords(2)),
    date: 'December 31, 2019',
    country: capitalize(lorem.generateWords(2)),
    issues: issues(4),
    summary: lorem.generateSentences(3),
    image: {
      color: randomColor(),
      ratio: randomInt(50, 50)
    },
    type: type()
  };
}

function summary() {
  const { title, date, image, source, id } = teaser();
  return {
    title,
    date,
    image,
    source,
    id
  };
}

function capitalize(str = '') {
  return str
    .split(' ')
    .map(s => {
      return s.charAt(0).toUpperCase() + s.slice(1);
    })
    .join(' ');
}

function issues(max = 5) {
  return lorem.generateWords(randomInt(1, max)).split(' ');
}

function randomInt(min = 0, max = 100) {
  return Math.floor(Math.random() * Math.floor(max)) + min;
}

function type() {
  const types = ['opinion', 'white paper', 'analysis', 'media'];
  return types[randomInt(0, types.length)];
}

function randomColor() {
  return `rgb(${randomInt(0, 150)}, 
  ${50}, 
  ${randomInt(0, 150)})`;
}

export { teaser, summary, randomColor };
