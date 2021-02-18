const main = () => {
  import('./base.js').then((analytics) => analytics.init())
}

main()

export {}
