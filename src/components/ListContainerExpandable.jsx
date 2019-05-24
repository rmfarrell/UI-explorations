import React, { Component } from 'react';
import List from './List';
import styles from '../styles/ListContainer.module.css';

class ListContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lists: [
        {
          state: 'initial'
        },
        {
          state: 'initial'
        },
        {
          state: 'initial'
        }
      ]
    };
  }
  render() {
    return (
      <article className={styles.root}>
        <div
          className="placeholder"
          style={{ width: '100%', minHeight: '22em', margin: '2em 0 2em' }}
        />
        {this.state.lists.map((l, i) => {
          return (
            <List
              key={i}
              className={[styles.list, styles[l.state]].join(' ')}
              showControls={l.state === 'expanded'}
              showReadMore={l.state === 'initial'}
              expand={() => this.expand(i)}
              groupSize={l.state === 'expanded' ? 2 : 1}
            >
              <button
                className={styles.accordionHandle}
                disabled={l.state !== 'collapsed'}
                onClick={() => this.expand(i)}
              >
                <h2>{`Content Group ${i + 1}`}</h2>
              </button>
            </List>
          );
        })}
      </article>
    );
  }
  expand = (n = 0) => {
    console.log('test');
    this.setState({
      lists: this.state.lists.map(({}, idx) => {
        return idx === n ? { state: 'expanded' } : { state: 'collapsed' };
      })
    });
  };
}
export default ListContainer;
