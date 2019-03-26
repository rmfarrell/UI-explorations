import React, { Component } from 'react';
import List from './List';
import Modal from './Modal';
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
        <div
          className="placeholder"
          style={{ width: '66%', margin: '0 auto' }}
          expand={this.openModal}
        />
        <Modal>
          <List className={styles.list} />
        </Modal>
      </article>
    );
  }
  openModal = () => {};
}
export default ListContainer;
