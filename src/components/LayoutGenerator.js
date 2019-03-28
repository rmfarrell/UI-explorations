import React, { Component } from 'react';
import { articles, socialMediaItems } from '../mocks/generator';
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
          <div className={styles.small}>
            <h3>Social</h3>
            <ul>
              {socialMediaItems(1).map(t => {
                return <ListItem data={t} key={t.id} />;
              })}
            </ul>
          </div>
          <ul className={styles.small}>
            {articles(6).map(t => {
              return <ListItem data={t} key={t.id} />;
            })}
          </ul>
          <ul className={styles.medium}>
            {articles(2).map(t => {
              return <ListItem data={t} size={1} key={t.id} />;
            })}
          </ul>
          <ul className={styles.large}>
            {articles(3)
              .slice(0, 3)
              .map(t => {
                return <ListItem data={t} size={2} key={t.id} />;
              })}
          </ul>
        </div>
      </article>
    );
  }
}
export default LayoutGenerator;
