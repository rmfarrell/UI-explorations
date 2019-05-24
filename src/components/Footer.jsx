import React from 'react';
import PagesMenu from './PagesMenu.jsx';
import styles from '../styles/Footer.module.css';
import { i18n, classNames } from '../lib/helpers';

export default function(props) {
  const { helpEmail = '', formAction } = props;

  return (
    <footer className={classNames(styles.root)}>
      <aside className={classNames(styles.questions)}>
        {i18n('footer', 'questions')}
        <a href={`mailto:${helpEmail}`}> {i18n('footer', 'let_us_know')}</a>
      </aside>
      <div className={classNames(styles.columns, 'constrain')}>
        <PagesMenu
          activeClassName={styles.active}
          className={styles.pagesMenu}
        />
        <div>
          <h3>{i18n('footer', 'stay_informed')}</h3>
          <form action={formAction} onSubmit={submitHandler}>
            <input
              type="email"
              placeholder={i18n('footer', 'email_placeholder')}
            />
            <input type="submit" value={i18n('footer', 'subscribe')} />
          </form>
          <div className={styles.ancillary}>Social/Privacy/Terms</div>
        </div>
      </div>
      <div className={styles.columns}>copyright/BF</div>
    </footer>
  );

  function submitHandler(ev) {
    ev.preventDefault();
  }
}
