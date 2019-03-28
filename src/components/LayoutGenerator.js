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
            <h2>Social (small)</h2>
            <ul>
              {socialMediaItems(3).map(t => {
                return <ListItem data={t} key={t.id} type="social" />;
              })}
            </ul>
          </div>
          <ul className={styles.small}>
            <h2>Article (small)</h2>
            {articles(6).map(t => {
              return <ListItem data={t} key={t.id} />;
            })}
          </ul>
          <ul className={styles.medium}>
            <h2>Article (medium)</h2>
            {articles(2).map(t => {
              return <ListItem data={t} size={1} key={t.id} />;
            })}
          </ul>
          <ul className={styles.large}>
            <h2>Article (large)</h2>
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
