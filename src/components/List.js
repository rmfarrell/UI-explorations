import React, { Component } from 'react';
import { summary, teaser } from '../mocks/generator';
import styles from '../styles/List.module.css';
import Carousel from './Carousel';

const total = 35,
  perpage = 5;

class Collection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      teasers: []
    };
  }
  render() {
    return (
      <div className={[styles.root, this.props.className].join(' ')}>
        <Carousel variant="progress" groupSize={1}>
          {this.slides.map((collection, idx) => {
            return (
              <ul key={idx} className={styles.itemList}>
                {collection.map(item => {
                  return (
                    <li key={item.id}>
                      <h4>{item.date}</h4>
                      <h3>{item.title}</h3>
                    </li>
                  );
                })}
              </ul>
            );
          })}
        </Carousel>
      </div>
    );
  }
  get slides() {
    let out = [];
    let slidesCounts = Math.ceil(this.state.teasers.length / perpage);
    for (let x = 0; x < slidesCounts; x++) {
      out.push(this.state.teasers.slice(x, perpage + x));
    }
    return out;
  }
  componentDidMount() {
    const teasers = [];
    for (let x = 0; x < total; x++) {
      teasers.push(teaser());
    }
    this.setState({ teasers });
  }
}
export default Collection;
