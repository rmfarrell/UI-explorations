import React, { Component } from 'react';
import { summary, teaser } from '../mocks/generator';
import styles from '../styles/List.module.css';
import CarouselControls from './CarouselControls';

const total = 35,
  perpage = 5;

class Collection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      teasers: [],
      current: 0
    };
  }
  get slides() {
    let out = [];
    let slidesCounts = Math.ceil(this.state.teasers.length / perpage);
    for (let x = 0; x < slidesCounts; x++) {
      out.push(this.state.teasers.slice(x, perpage + x));
    }
    return out;
  }
  setOffset = (n = 0) => {
    this.setState({ current: n });
  };
  setTotal = (n = 0) => {};
  componentDidMount() {
    const teasers = [];
    for (let x = 0; x < total; x++) {
      teasers.push(teaser());
    }
    this.setState({ teasers });
  }
  render() {
    return (
      <div className={styles.root}>
        <div
          className="placeholder"
          style={{ width: '100%', minHeight: '22em', margin: '2em 0 2em' }}
        />
        <div className={styles.listContainer}>
          <div
            className={styles.carousel}
            style={{
              width: `${this.slides.length * 100}%`,
              transform: `translateX(-${(this.state.current /
                this.slides.length) *
                100}%)`
            }}
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
          </div>
          <CarouselControls
            total={total}
            limit={perpage}
            current={this.state.current}
            setOffset={this.setOffset}
          />
          <CarouselControls
            total={total}
            limit={perpage}
            current={this.state.current}
            setOffset={this.setOffset}
            variant="progress"
          />
        </div>
        <div className="placeholder" style={{ width: '62%' }} />
        {/* <form className="settings">
          <label for="results">Change list length</label>
          <input
            type="number"
            onChange={this.setTotal}
            placeholder="Set Results"
            value={this.state.teassers}
            name="results"
          />
        </form> */}
      </div>
    );
  }
}
export default Collection;
