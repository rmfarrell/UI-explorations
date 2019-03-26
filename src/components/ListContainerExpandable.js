import React, { Component } from 'react';
import List from './List';
import styles from '../styles/ListContainer.module.css';

class ListContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <article className={styles.root}>
        <div
          className="placeholder"
          style={{ width: '100%', minHeight: '22em', margin: '2em 0 2em' }}
        />
        <List className={styles.list} />
        <List className={styles.list} />
        <List className={styles.list} />
      </article>
    );
  }
}
export default ListContainer;
