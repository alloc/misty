const m = require('.')
const { startTask } = require('./task')

const task = startTask('Clearing trash mobs…')
setTimeout(() => m.success('Rare drop!'), 800)
setTimeout(() => task.update('Pulling the boss…'), 2000)
setTimeout(() => m.warn('Out of mana'), 3000)
setTimeout(() => task.finish('Dungeon cleared'), 4000)

// Try starting this task while the other is still active :D
setTimeout(() => {
  const task2 = startTask('Mining bitcoins…')
  setTimeout(() => {
    task2.finish()
    m.fatal('Mining failed: Not enough hash power >o<')
  }, 1500)
}, 5000)
