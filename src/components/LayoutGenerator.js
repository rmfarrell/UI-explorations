import React, { Component } from 'react';
import { articles, socialMediaItems, Article } from '../mocks/generator';
import Carousel from './Carousel';
import ListItem from './ListItem';
import styles from '../styles/LayoutGenerator.module.css';

class LayoutGenerator extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <article className={[styles.root, 'constrain'].join(' ')}>
        <h1>Columns</h1>
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
            {articles(3).map(t => {
              return <ListItem data={t} size={1} key={t.id} />;
            })}
          </ul>
        </div>
        <h1>Article (large)</h1>
        <div className={styles.group}>
          <ul className={styles.large}>
            {articles(3)
              .slice(0, 3)
              .map(t => {
                return <ListItem data={t} size={2} key={t.id} />;
              })}
          </ul>
        </div>
        <h1>Mixed Layouts</h1>
        <div className={styles.group}>
          <ul className={styles.medium}>
            <ListItem data={Article()} size={2} />
          </ul>
          <Carousel className={styles.small}>
            <ul>
              {articles(4).map(t => {
                return <ListItem data={t} key={t.id} size={0} />;
              })}
            </ul>
            <ul>
              {articles(4).map(t => {
                return <ListItem data={t} key={t.id} size={0} />;
              })}
            </ul>
            <ul>
              {articles(4).map(t => {
                return <ListItem data={t} key={t.id} size={0} />;
              })}
            </ul>
            <ul>
              {articles(4).map(t => {
                return <ListItem data={t} key={t.id} size={0} />;
              })}
            </ul>
          </Carousel>
          <ul className={styles.small}>
            {articles(4).map(t => {
              return <ListItem data={t} key={t.id} />;
            })}
          </ul>
        </div>
      </article>
    );
  }
}
export default LayoutGenerator;
