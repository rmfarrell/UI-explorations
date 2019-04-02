import React from 'react';
import { BrowserRouter as Router, Route, NavLink } from 'react-router-dom';
import InfiniteCollection from './components/InfiniteCollection';
import ListContainer from './components/ListContainer';
import ListContainerExpandable from './components/ListContainerExpandable';
import ListContainerModal from './components/ListContainerModal';
import ExpandingColumns from './components/ExpandingColumns';
import LayoutGenerator from './components/LayoutGenerator';
import styles from './styles/Nav.module.css';

function AppRouter() {
  return <LayoutGenerator />;
}

export default AppRouter;
