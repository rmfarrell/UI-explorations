import React, { Component } from 'react';
import styles from '../styles/Carousel.module.css';
import CarouselControls from './CarouselControls';

class Carousel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 0
    };
  }
  render() {
    return (
      <div>
        <div
          className={styles.carousel}
          style={{
            width: `${this.childLength * 100}%`,
            transform: `translateX(-${(this.state.current / this.childLength) *
              100}%)`
          }}
        >
          {this.props.children}
        </div>
        <CarouselControls
          size={this.childLength}
          current={this.state.current}
          setOffset={this.setOffset}
        />
        <CarouselControls
          size={this.childLength}
          current={this.state.current}
          setOffset={this.setOffset}
          variant={this.props.variant}
        />
      </div>
    );
  }
  get childLength() {
    return this.props.children.length / this.groupSize;
  }
  get groupSize() {
    return this.props.groupSize || 1;
  }
  setOffset = (n = 0) => {
    this.setState({ current: n });
  };
}

export default Carousel;
