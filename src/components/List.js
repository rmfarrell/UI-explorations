import React, { Component } from 'react';
import { summary, teaser } from '../mocks/generator';
import styles from '../styles/List.module.css';
import Carousel from './Carousel';
import ListItem from './ListItem';

export default function List({
  className = '',
  children,
  variant,
  groupSize = 1,
  showControls = true,
  showReadMore = false,
  perpage = 5,
  total = 0,
  expand = false
}) {
  //   get slides() {
  //     const perpage = this.props.perpage || 5;
  //     const out = [],
  //       slidesCounts = Math.ceil(this.state.teasers.length / perpage);
  //     for (let x = 0; x < slidesCounts; x++) {
  //       out.push(this.state.teasers.slice(x, perpage + x));
  //     }
  //     return out;
  //   }
  let slide = [],
    slides = [],
    counter = total;
  while (counter > 0) {
    if (slide.length < perpage * groupSize) {
      slide.push(teaser());
    } else {
      slides.push(slide);
      slide = [teaser()];
    }
    counter--;
  }
  slides.push(slide);
  // for (let x = 0; x < slidesCounts; x++) {
  //   for (let i = 0; i < perpage; i++) {
  //     slide.push(teaser());
  //   }
  //   slides.push(slide);
  //   slide = [];
  // }
  const ulClassName = [styles.itemList, styles[`width${groupSize}`]].join(' ');
  return (
    <aside className={[styles.root, className].join(' ')}>
      {children && <header>{children}</header>}
      <Carousel
        variant={variant}
        showControls={showControls && total > perpage * groupSize}
      >
        {slides.map((collection, idx) => {
          return (
            <ul key={idx} className={ulClassName}>
              {collection.map(item => {
                return <ListItem key={item.id} data={item} />;
              })}
            </ul>
          );
        })}
      </Carousel>
      {showReadMore && (
        <button onClick={expand} className={styles.readmore}>
          Read more ({total})
        </button>
      )}
    </aside>
  );
}

// class Collection extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       teasers: []
//     };
//   }
//   render() {
//     const  = this.props;
//     return (
//       <aside className={[styles.root, className].join(' ')}>
//         {children && <header>{children}</header>}
//         <Carousel
//           variant={variant}
//           groupSize={groupSize}
//           showControls={showControls && this.total > perpage}
//         >
//           {this.slides.map((collection, idx) => {
//             return (
//               <ul key={idx} className={styles.itemList}>
//                 {collection.map(item => {
//                   return <ListItem key={item.id} data={item} />;
//                 })}
//               </ul>
//             );
//           })}
//         </Carousel>
//         {showReadMore && (
//           <button onClick={this.props.expand} className={styles.readmore}>
//             Read more ({this.total})
//           </button>
//         )}
//       </aside>
//     );
//   }
//   get total() {
//     return this.props.total || 35;
//   }
//   get slides() {
//     const perpage = this.props.perpage || 5;
//     const out = [],
//       slidesCounts = Math.ceil(this.state.teasers.length / perpage);
//     for (let x = 0; x < slidesCounts; x++) {
//       out.push(this.state.teasers.slice(x, perpage + x));
//     }
//     return out;
//   }
//   componentDidMount() {
//     const teasers = [];
//     for (let x = 0; x < this.total; x++) {
//       teasers.push(teaser());
//     }
//     this.setState({ teasers });
//   }
// }
