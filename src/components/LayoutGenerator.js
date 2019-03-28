import React, { Component } from 'react';
import { teasers } from '../mocks/generator';
import ListItem from './ListItem';
import styles from '../styles/LayoutGenerator.module.css';

class LayoutGenerator extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <article className={[styles.root, 'constrain'].join(' ')}>
        <div className={styles.group}>
          <ul className={styles.small}>
            {teasers(12).map(t => {
              return <ListItem data={t} />;
            })}
          </ul>
          <ul className={styles.medium}>
            {teasers(5).map(t => {
              return <ListItem data={t} size={1} />;
            })}
          </ul>
          <ul className={styles.large}>
            {teasers(3)
              .slice(0, 3)
              .map(t => {
                return <ListItem data={t} size={2} />;
              })}
          </ul>
        </div>
      </article>
    );
  }
  componentDidMount() {}
}
export default LayoutGenerator;
