module.exports = c => ({
  self: {
    flex: 1,
    height: '100%',
    zIndex: 1
  },
  
  fullscreen: {
    position: 'fixed',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    padding: `0 ${c.viewPad}`
  },

  after: {
    position: 'absolute',
    width: '100%',
    top: '0px',
    height: 'calc(100% + 1px)',
    zIndex: -1
  },

  scrollingEnabled: {
    zIndex: 1,
    WebkitOverflowScrolling: 'touch',
    overflowY: 'scroll',
    overflowX: 'hidden',
    // fix nested views overlay each other
    transform: 'translateZ(0)'
  }
});