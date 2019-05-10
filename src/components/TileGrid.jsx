import React, { useState, useEffect, renderComponent } from 'react';

// -- Libs
import { Grid, Row } from '../lib/grid';

export default function(props) {
  const { children = [], featured = [], collection = [] } = props;
  // const tiles = children
  //     .map(() => {
  //       return {
  //         width: 1,
  //         canExpand: false
  //       };
  //     })
  //     .concat(
  //       ...featured.map(art => {
  //         return Object.assign(art, {
  //           cat: 'Featured',
  //           width: 1,
  //           canExpand: true,
  //           featured: true
  //         });
  //       })
  //     )
  // .concat(
  //   Object.keys(collectionData).map(cat => ({
  //     cat,
  //     content: collectionData[cat]
  //   }))
  // )

  //   .map(addWidths),

  const adapter = gridAdapter(...children, ...featured, ...collection);
  const rows = makeGrid(adapter);
  const firstRow = rows.slice(0, 1)[0];
  const rest = rows.slice(1);

  return (
    <section>
      <div className="grid">
        {firstRow.items.map(item => {
          return (
            <div className={tileClassName(3, item.width)} key={item.key}>
              {item.component}
            </div>
          );
        })}
      </div>
      {rest.map(({ items, size }, idx) => {
        return (
          <div className="grid" key={idx}>
            {items.map(item => {
              return (
                <div className={tileClassName(size, item.width)} key={item.key}>
                  {item.component}
                </div>
              );
            })}
          </div>
        );
      })}
      {/* {rows.map(({ items, size }, idx) => {
        return (
          <div className="grid" key={idx}>
            {items.map(data => {
              return (
                <div
                  key={data.cat}
                  className={[
                    tileClassName(size, data.width),
                    styles.tile
                  ].join(' ')}
                >
                  <Tile
                    data={data}
                    category={data.cat}
                    width={data.width}
                    row={idx}
                  />
                </div>
              );
            })}
          </div>
        );
      })} */}
    </section>
  );

  /**
   * Factory funciton for rendering Tiles
   *
   */
  // function Tile(props) {
  //   const { data, category, width, row = 0 } = props,
  //     { content } = data,
  //     firstRow = row === 0;

  //   switch (category) {
  //     case 'Custom Article':
  //       return <CustomArticle data={custom_article} />;
  //     case 'Map':
  //       return <Map />;
  //     case 'Featured':
  //       return featured(data);
  //     default:
  //       const perpage = row > 0 ? 4 : 3;
  //       return content.length > 1 ? (
  //         <List items={content} groupSize={width} perpage={perpage}>
  //           <h3>{pluralize(category)}</h3>
  //         </List>
  //       ) : (
  //         featured(content[0])
  //       );
  //   }

  //   function featured(data = {}) {
  //     return (
  //       <SingleItem
  //         data={data}
  //         className=""
  //         size={firstRow ? 2 : width}
  //         summaryLines={firstRow ? 0 : 4}
  //         type="article"
  //       />
  //     );
  //   }
  // }
}

function makeGrid(adapter) {
  const grid = Grid(Row(3));
  grid.add(adapter.gridData);
  grid.separateFeatured();
  grid.balance();

  return grid.rows;
}

function gridAdapter(...components) {
  const data = components.reduce((acc, component) => {
    const { props, key } = component;
    const { canExpand, featured } = props;
    const width = Number(props.width);

    if (!key) throw new Error('key is required in component');
    acc[key] = {
      canExpand: !!canExpand,
      width,
      featured,
      key,
      get component() {
        if (width !== this.width) {
          return React.cloneElement(component, {
            width: this.width,
            groupSize: this.width
          });
        }
        return component;
      }
    };
    return acc;
  }, {});

  return {
    get gridData() {
      return Object.values(data);
    }
  };
}

function tileClassName(rowSize = 4, width = 1) {
  const isWide = width > 1;
  if (rowSize === 3) {
    return isWide ? 'grid--item__two-thirds' : 'grid--item__third';
  }
  if (rowSize === 4) {
    return isWide ? 'grid--item__half' : 'grid--item__quarter';
  }
}
