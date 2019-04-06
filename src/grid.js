function Grid(head) {
  function calculateWidth(items = []) {
    return items.reduce((acc, { width }) => (acc += width), 0);
  }

  function expandTiles(tiles = [], amt = 0) {
    let current = tiles.length - 1;
    while (amt > 0 && tiles[current]) {
      if (tiles[current].canExpand) {
        tiles[current].width++;
        tiles[current].canExpand = false;
        amt--;
      }
      current--;
    }
    return tiles;
  }

  return {
    head,
    balance() {
      let row = head;
      while (row) {
        let tries = 4;
        while (row.capacity > 0 && tries > 0) {
          if (row.next) {
            row.add(row.next.remove(0));
          }
          tries--;
        }
        row = row.next;
      }
    },
    addCapacity(cap) {
      while (cap < 0) {
        this.tail.next = Row(4);
        cap = cap + 4;
      }
      return cap;
    },
    add(tiles = []) {
      const width = calculateWidth(tiles);
      let cap = this.gaps - width;
      cap = this.addCapacity(cap);
      tiles = expandTiles(tiles, cap);

      tiles.forEach(item => {
        head.add(item);
      });
    },
    get tail() {
      let row = head,
        out;
      while (row) {
        out = row;
        row = row.next;
      }
      return out;
    },
    addRow(cap = 4) {
      this.tail.next = Row(cap);
    },
    get gaps() {
      return this.rows.reduce((acc, item) => {
        acc += item.gap;
        return acc;
      }, 0);
    },
    expand() {
      const rows = this.rows.reverse();
      let current = 0,
        gaps = this.gaps;
      while (gaps > 0 && rows[current]) {
        const expanded = rows[current].expandItems(gaps);
        gaps = gaps - expanded;
        current++;
      }
    },
    separateFeatured() {
      let row = head;
      while (row) {
        const types = row.items.map(({ type }) => type),
          first = types.indexOf('featured'),
          last = types.lastIndexOf('featured');

        if (first !== -1 && first !== last) {
          // console.log(row.remove(last));
          row.next = row.next || Row(4);
          row.next.append(row.remove(last));
        }
        row = row.next;
      }
    },
    get rows() {
      let out = [];
      let row = head;
      while (row) {
        out = out.concat(row);
        row = row.next;
      }
      return out;
    }
  };
}

function Row(size = 4) {
  const classNames = {
    3: ['grid--item__third', 'grid--item__two-thirds'],
    4: ['grid--item__quarter', 'grid--item__half']
  };
  return {
    next: null,
    items: [],
    get gap() {
      return this.capacity;
    },
    expandItems(max = 0) {
      // console.log(max);

      let current = 0;
      while (current < this.items.length && max) {
        const item = this.items[current];
        let items = [];
        if (item.canExpand) {
          max--;
          item.width = item.width + 1;
          item.canExpand = false;
          // items = this.items.slice(0);
          // this.items = [];
          // items.forEach(item => this.append(item));
        }
        current++;
      }
      console.log(max);
      return max;
    },
    append(item) {
      this.add(item);
    },
    prepend(item) {
      this.add(item, true);
    },
    get width() {
      return this.items.reduce((acc = 0, { width }) => {
        acc += width;
        return acc;
      }, 0);
    },
    get capacity() {
      return size - this.width;
    },
    add(item, toBeginning = false) {
      if (!item) {
        return;
      }
      if (!item.width) {
        throw new Error(
          `Cannot add item without width: ${JSON.stringify(item, null, '\t')}`
        );
      }
      if (!this.capacity || this.capacity < item.width) {
        this.next = this.next || Row();
        this.next.add(item, toBeginning);
        return;
      }
      if (toBeginning) {
        this.items.unshift(item);
      } else {
        this.items.push(item);
      }
      item.className = classNames[size][item.width - 1];
    },
    remove(idx = 0) {
      return this.items.splice(idx, 1)[0];
    }
  };
}

export { Grid, Row };
