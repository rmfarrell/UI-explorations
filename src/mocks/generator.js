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
  }),
  TOPICS = ['Trade', 'Government', 'Regulation', 'Environment', 'Crime'],
  TYPES = [
    'Article',
    'Policy Document',
    'Analysis',
    'Opinion',
    'Media',
    'Data'
  ];

// -- Models

function teaser() {
  return {
    id: uuid(),
    title: lorem.generateSentences(1),
    source: capitalize(lorem.generateWords(3)),
    author: capitalize(lorem.generateWords(2)),
    date: date(),
    country: capitalize(lorem.generateWords(2)),
    issues: issues(),
    summary: lorem.generateSentences(3),
    image: image(),
    type: type()
  };
}

function summary() {
  const { title, date, image, source, id } = teaser();
  return {
    title,
    date: date(),
    image: image(),
    source,
    id
  };
}

const Article = teaser;
const articles = teasers;

function SocialMediaItem() {
  return {
    contentType: 'Social Media Item',
    source: ['Twitter', 'Facebook', 'Instagram', 'LinkedIn'][randomInt(0, 3)],
    text: '',
    author: '',
    image: image(),
    date: date()
  };
}

// -- Multiples
function teasers(n = 1) {
  const out = [];
  for (let x = 0; x < n; x++) {
    out.push(teaser());
  }
  return out;
}

function multiple(n = 0, type = 'Article') {
  const out = [];
  for (let x = 0; x < n; x++) {
    switch (type) {
      case 'Article':
        out.push(Article());
        break;
      case 'Social':
        out.push(SocialMediaItem());
        break;
      default:
        out.push(Article());
    }
    out.push(teaser());
  }
  return out;
}

// -- Field Generators

function issues() {
  const times = randomInt(1, 2),
    out = [];
  for (let x = 0; x < times; x++) {
    let topics = TOPICS.filter(t => !out.includes(t));
    out.push(topics[randomInt(0, topics.length)]);
    TOPICS.slice();
  }
  return out;
}

function randomInt(min = 0, max = 100) {
  return Math.floor(Math.random() * Math.floor(max)) + min;
}

function type() {
  return TYPES[randomInt(0, TYPES.length)];
}

function randomColor() {
  return `rgb(${randomInt(0, 150)}, 
  ${50}, 
  ${randomInt(0, 150)})`;
}

function image() {
  return {
    color: randomColor(),
    ratio: randomInt(50, 50)
  };
}

function date() {
  return 'November 31, 2019';
}

// -- Helpers

function capitalize(str = '') {
  return str
    .split(' ')
    .map(s => {
      return s.charAt(0).toUpperCase() + s.slice(1);
    })
    .join(' ');
}

export {
  teaser,
  teasers,
  summary,
  randomColor,
  TYPES,
  TOPICS,
  Article,
  SocialMediaItem,
  articles,
  multiple
};
