import Map2 from './map2.js'

// const registers = {
//  [agentId, seq]: path,
// }

// const tombstones = {
//   agentId: [[0, 100], [102, 500]],
// }

const indexInRange = (index, [min, max]) => index >= min && index <= max

const isIndexBeforeRange = (index, [min, _]) => index === min - 1
const isIndexAfterRange = (index, [_, max]) => index === max + 1

const beforeRangeIndex = (index, ranges) =>
  ranges.findIndex((range) => isIndexBeforeRange(index, range))

const afterRangeIndex = (index, ranges) =>
  ranges.findIndex((range) => isIndexAfterRange(index, range))

class Memory {
  constructor() {
    this.registers = new Map2()
    this.tombstones = {}
  }

  add([agentId, seq], path) {
    if (!this.has(agentId, seq) && !this.hasTombstone([agentId, seq])) {
      this.registers.set(agentId, seq, path)
    }
  }

  has([agentId, seq]) {
    return this.registers.has(agentId, seq)
  }

  get([agentId, seq]) {
    return this.registers.get(agentId, seq)
  }

  hasTombstone([agentId, seq]) {
    return this.tombstones[agentId]?.some((range) => indexInRange(seq, range))
  }

  remove([agentId, seq]) {
    this.registers.delete(agentId, seq)
    this.tombstones[agentId] ??= []

    const beforeIndex = beforeRangeIndex(seq, this.tombstones[agentId])
    const afterIndex = afterRangeIndex(seq, this.tombstones[agentId])

    if (beforeIndex !== -1 && afterIndex !== -1) {
      this.tombstones[agentId][beforeIndex][1] =
        this.tombstones[agentId][afterIndex][1]
      this.tombstones[agentId].splice(afterIndex, 1)
    } else if (beforeIndex !== -1) {
      this.tombstones[agentId][beforeIndex][0] = seq
    } else if (afterIndex !== -1) {
      this.tombstones[agentId][afterIndex][1] = seq
    } else {
      this.tombstones[agentId].push([seq, seq])
    }
  }
}

export default Memory

// const memory = new Memory()
// const agentId = 'james'
// let seq = 0
// memory.add([agentId, seq++], [[0, 'james']])
// memory.add([agentId, seq++], [[1, 'james']])
// memory.add([agentId, seq++], [[2, 'james']])
// memory.add([agentId, seq++], [[3, 'james']])
// memory.add([agentId, seq++], [[4, 'james']])
// memory.add([agentId, seq++], [[5, 'james']])
// memory.remove([agentId, 1])
// memory.remove([agentId, 2])
// memory.remove([agentId, 4])
// memory.remove([agentId, 5])
// console.log('_TOMBSTONES_', memory.tombstones)
// console.log('_REGISTERS_', memory.registers.getEntries())
