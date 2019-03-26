import React, { Component } from 'react';
import { summary, teaser } from '../mocks/generator';
import styles from '../styles/List.module.css';
import Carousel from './Carousel';

class Collection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      teasers: []
    };
  }
  render() {
    return (
      <aside className={[styles.root, this.props.className].join(' ')}>
        {this.props.children && <header>{this.props.children}</header>}
        <Carousel
          variant={this.props.variant}
          groupSize={this.props.groupSize}
          showControls={this.props.showControls}
        >
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
        {this.props.showReadMore && (
          <button onClick={this.props.expand} className={styles.readmore}>
            Read more ({this.total})
          </button>
        )}
      </aside>
    );
  }
  get total() {
    return this.props.total || 35;
  }
  get slides() {
    const perpage = this.props.perpage || 5;
    const out = [],
      slidesCounts = Math.ceil(this.state.teasers.length / perpage);
    for (let x = 0; x < slidesCounts; x++) {
      out.push(this.state.teasers.slice(x, perpage + x));
    }
    return out;
  }
  componentDidMount() {
    const teasers = [];
    for (let x = 0; x < this.total; x++) {
      teasers.push(teaser());
    }
    this.setState({ teasers });
  }
}
export default Collection;
