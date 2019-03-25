import React, { Component } from 'react';
import { summary, teaser } from '../mocks/generator';
import Collection from './Collection';

class InfiniteCollection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      teasers: []
    };
  }

  componentDidMount() {
    const teasers = [];
    for (let x = 0; x < 10; x++) {
      teasers.push(teaser());
    }
    this.setState({ teasers });
  }

  render() {
    return <Collection teasers={this.state.teasers} />;
  }
}

export default InfiniteCollection;
