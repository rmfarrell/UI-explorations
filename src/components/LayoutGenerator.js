import React, { Component } from 'react';
import { teaser } from '../mocks/generator';
import ListItem from './ListItem';
import styles from '../styles/LayoutGenerator.module.css';

class LayoutGenerator extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const teasers = [];
    for (let x = 0; x < 5; x++) {
      teasers.push(teaser());
    }
    return (
      <article className={[styles.root, 'constrain'].join(' ')}>
        <div className={styles.group}>
          <ul className={styles.small}>
            {teasers.map(t => {
              return <ListItem data={t} />;
            })}
          </ul>
          <ul className={styles.medium}>
            {teasers.map(t => {
              return <ListItem data={t} size={1} />;
            })}
          </ul>
        </div>
      </article>
    );
  }
  componentDidMount() {}
}
export default LayoutGenerator;
