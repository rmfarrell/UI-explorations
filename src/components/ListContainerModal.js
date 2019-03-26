import React, { Component } from 'react';
import List from './List';
import Modal from './Modal';
import styles from '../styles/ListContainer.module.css';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

class ListContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openModal: false
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
          expand={this.toggleModal}
          showControls={false}
          showReadMore={true}
        />
        <div
          className="placeholder"
          style={{ width: '66%', margin: '0 auto' }}
        />
        <ReactCSSTransitionGroup
          transitionName="modal"
          transitionEnterTimeout={500}
          transitionLeaveTimeout={500}
        >
          {this.state.openModal && (
            <Modal close={this.toggleModal} isOpen={this.state.openModal}>
              <List
                className={[styles.list, styles.fullwidth].join(' ')}
                perpage={35}
                total={35}
                showControls={false}
                showReadMore={false}
              />
            </Modal>
          )}
        </ReactCSSTransitionGroup>
      </article>
    );
  }
  toggleModal = ({ clientX, clientY }) => {
    console.log('test');
    this.setState({ openModal: !this.state.openModal });
  };
}
export default ListContainer;
