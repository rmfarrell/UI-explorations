import React from 'react';
import PagesMenu from './PagesMenu.jsx';
import styles from '../styles/Footer.module.css';
import { i18n, classNames } from '../lib/helpers';
import { Link } from 'react-router-dom';

export default function(props) {
  const { helpEmail = '', formAction } = props;

  return (
    <footer className={classNames(styles.root)}>
      <aside className={classNames(styles.questions)}>
        {`${i18n('footer', 'questions')} `}
        <a href={`mailto:${helpEmail}`}>{i18n('footer', 'let_us_know')}</a>
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
          <div className={styles.ancillary}>
            <div>
              <h3>{i18n('footer', 'share')}</h3>
              <div className={styles.shareIcons}>
                <a target="_blank">
                  <i className={classNames('material-icons')}>favorite</i>
                </a>
                <a target="_blank">
                  <i className={classNames('material-icons')}>favorite</i>
                </a>
                <a target="_blank">
                  <i className={classNames('material-icons')}>favorite</i>
                </a>
              </div>
            </div>
            <p>
              <Link to="/privacy-policy">
                {i18n('footer', 'privacy_policy')}
              </Link>{' '}
              | <Link to="/terms">{i18n('footer', 'terms')}</Link>
            </p>
          </div>
        </div>
      </div>

      <div className={classNames(styles.copyright)}>
        <span>
          &copy; {new Date().getFullYear()} {i18n('title')}
        </span>
        <a>{i18n('foundation')} </a>
      </div>
    </footer>
  );

  function submitHandler(ev) {
    ev.preventDefault();
  }
}
