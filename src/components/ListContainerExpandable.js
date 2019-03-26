import React, { Component } from 'react';
import List from './List';
import styles from '../styles/ListContainer.module.css';

class ListContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: [false, false, false]
    };
  }
  render() {
    return (
      <article className={styles.root}>
        <div
          className="placeholder"
          style={{ width: '100%', minHeight: '22em', margin: '2em 0 2em' }}
        />
        <List
          className={styles.list}
          showControls={this.state.expanded[0]}
          expand={() => this.expand(0)}
        />
        <List
          className={styles.list}
          showControls={this.state.expanded[1]}
          expand={() => this.expand(1)}
        />
        <List
          className={styles.list}
          showControls={this.state.expanded[2]}
          expand={() => this.expand(2)}
        />
      </article>
    );
  }
  expand(n = 0) {
    let expanded = [false, false, false];
    expanded[n] = true;
    this.setState({ expanded });
  }
}
export default ListContainer;
