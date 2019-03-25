import React, { Component } from 'react';
import { summary, teaser } from '../mocks/generator';
import Card from './Card';
import Masonry from 'react-masonry-component';
import styles from '../styles/App.css';

const masonryOptions = {
  transitionDuration: 0
};
class Collection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      teasers: []
    };
  }
  componentDidMount() {
    const teasers = [];
    for (let x = 0; x < 10; x++) {
      teasers.push(teaser());
    }
    this.setState({ teasers });
  }
  render() {
    return (
      <div className="App">
        <Masonry options={masonryOptions} className={styles.masonryContainer}>
          {this.state.teasers.map(t => {
            return <Card data={t} key={t.id} />;
          })}
        </Masonry>
      </div>
    );
  }
}

export default Collection;
