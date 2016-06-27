export default c => ({
  self: {
    border: `1px solid ${c.buttonBorderColor}`, // todo: variables
    color: c.buttonColor,
    fontSize: '16px',
    background: 'none',
    borderRadius: '5px',
    textAlign: 'center',
    height: '40px',
    minHeight: '40px',
    zoom: 1,
    lineHeight: 'normal',
    whiteSpace: 'nowrap',
    verticalAlign: 'baseline',
    cursor: 'pointer',
    outline: 'none',
    flexFlow: 'row',
    flexAlign: 'center',
    alignItems: 'center',
    margin: '0 0'
  },

  rippleGroup: {
    display: 'none',
    opacity: '0'
  },

  ripple: {
    display: 'none',
    opacity: '0'
  },

  rippleLight: {
    backgroundColor: '#FFF'
  },

  rippleDark: {
    backgroundColor: '#FFF'
  },

  inner: {
    position: 'relative',
    flexFlow: 'row',
    margin: 'auto',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    width: '100%',
    height: '100%'
  },

  text: {
    margin: 'auto auto'
  },

  isInTitleBar: {
    margin: 'auto 8px',
    color: c.buttonColorTitleBar
  },

  chromeless: {
    border: 'none',
    borderRadius: 0
  },

  fullscreen: {
    border: 'none',
    borderRadius: 0,
    margin: '0 -20px'
  },

  rounded: {
    borderRadius: '100px'
  },

  filled: {
    background: c.buttonFilledBG,
    color: c.buttonFilledColor
  },

  inactive: {
    opacity: 0.2,
    pointerEvents: 'none'
  },

  tapActive: {
    background: c.buttonTapActiveBG
  },

  tapActiveFilled: {
    background: c.buttonTapActiveBG
  },

  tapActiveTitleBar: {
    opacity: 0.2
  }
});