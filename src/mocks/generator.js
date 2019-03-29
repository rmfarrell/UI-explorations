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
    contentType: 'Article',
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

function SocialMediaItem() {
  return {
    id: uuid(),
    contentType: 'Social Media Item',
    source: pickRandomFromArray(['Twitter', 'Facebook', 'Instagram']),
    text: lorem.generateWords(randomInt(10, 200)),
    author: lorem.generateWords(1),
    image: randomInt(0, 4) === 0 ? image() : null,
    date: date()
  };
}

function DeepDive() {
  return {
    id: uuid(),
    title: lorem.generateSentences(2),
    issues: issues(),
    summary: lorem.generateSentences(3),
    image: image(),
    type: type()
  };
}

// aliases
const Article = teaser;
const articles = teasers;

// -- Multiples
function teasers(n = 1) {
  return multiple('article', n);
}

function socialMediaItems(n = 1) {
  return multiple('social', n);
}

function multiple(type = 'article', n = 1) {
  const out = [];
  for (let x = 0; x < n; x++) {
    switch (type) {
      case 'article':
        out.push(Article());
        break;
      case 'social':
        out.push(SocialMediaItem());
        break;
      case 'mixed':
        break;
      default:
        out.push(Article());
    }
  }
  return out;
}

// -- Field Generators

// For now, this combines Entities & Countries, primaries come first
function issues() {
  const count = randomInt(1, 3);
  return pickRandomFromArray(TOPICS.slice(0), count);
}

function type() {
  return pickRandomFromArray(TYPES.slice(0))[0];
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

// -- Helpers/utilities

function capitalize(str = '') {
  return str
    .split(' ')
    .map(s => {
      return s.charAt(0).toUpperCase() + s.slice(1);
    })
    .join(' ');
}

function randomColor() {
  return `hsl(${randomInt(30, 30)},0%, ${randomInt(30, 30)}%)`;
}

function randomInt(min = 0, max = 100) {
  return Math.floor(Math.random() * Math.floor(max)) + min;
}

function pickRandomFromArray(arr = [], n = 1) {
  const out = [];
  for (let x = 0; x < n; x++) {
    let filtered = arr.filter(t => !out.includes(t));
    out.push(filtered[randomInt(0, filtered.length)]);
  }
  return out;
}

export {
  teaser,
  teasers,
  randomColor,
  TYPES,
  TOPICS,
  Article,
  SocialMediaItem,
  socialMediaItems,
  articles,
  multiple
};
