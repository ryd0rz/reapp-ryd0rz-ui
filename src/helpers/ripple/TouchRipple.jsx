import React from 'react';
import ReactDOM from 'react-dom';
import ReactTransitionGroup from 'react-addons-transition-group';
import Dom from '../../utils/dom';
import CircleRipple from './CircleRipple';
import update from 'react-addons-update';
var Component = require('../../component');

function push(array, obj) {
  const newObj = Array.isArray(obj) ? obj : [obj];
  return update(array, {$push: newObj});
}

function shift(array) {
  // Remove the first element in the array using React immutability helpers
  return update(array, {$splice: [[0, 1]]});
}

module.exports = Component({
  name: 'TouchRipple',

  propTypes: {
    abortOnScroll: React.PropTypes.bool,
    centerRipple: React.PropTypes.bool,
    children: React.PropTypes.node,
    secondaryRipple: React.PropTypes.bool
  },

  getDefaultProps() {
    return {
      abortOnScroll: true,
      secondaryRipple: false
    };
  },

  getInitialState() {
    this.ignoreNextMouseDown = false;
    return {
      hasRipples: false,
      nextKey: 0,
      ripples: [],
    }
  },

  start(event, isRippleTouchGenerated) {

    if (this.ignoreNextMouseDown && !isRippleTouchGenerated) {
      this.ignoreNextMouseDown = false;
      return;
    }

    let ripples = this.state.ripples;

    // Add a ripple to the ripples array
    ripples = push(ripples, (
      <CircleRipple key={this.state.nextKey} style={!this.props.centerRipple ? this.getRippleStyle(event) : this.componentProps('ripple').style} touchGenerated={isRippleTouchGenerated} />
    ));

    this.ignoreNextMouseDown = isRippleTouchGenerated;
    this.setState({
      hasRipples: true,
      nextKey: this.state.nextKey + 1,
      ripples: ripples,
    });
  },

  end() {
    const currentRipples = this.state.ripples;
    this.setState({
      ripples: shift(currentRipples),
    });
    if (this.props.abortOnScroll) {
      this.stopListeningForScrollAbort();
    }
  },

  handleMouseDown(event) {
    if (event.button === 0) {
      this.start(event, false);
    }
  },

  handleMouseUp() {
    this.end();
  },

  handleMouseLeave() {
    this.end();
  },

  handleTouchStart(event) {
    //event.stopPropagation();
    // If the user is swiping (not just tapping), save the position so we can
    // abort ripples if the user appears to be scrolling.
    if (this.props.abortOnScroll && event.touches) {
      this.startListeningForScrollAbort(event);
      this.startTime = Date.now();
    }
    this.start(event, true);
  },

  handleTouchEnd() {
    this.end();
  },

  // Check if the user seems to be scrolling and abort the animation if so
  handleTouchMove(event) {
    // Stop trying to abort if we're already 300ms into the animation
    const timeSinceStart = Math.abs(Date.now() - this.startTime);
    if (timeSinceStart > 300) {
      this.stopListeningForScrollAbort();
      return;
    }

    // If the user is scrolling...
    const deltaY = Math.abs(event.touches[0].clientY - this.firstTouchY);
    const deltaX = Math.abs(event.touches[0].clientX - this.firstTouchX);
    // Call it a scroll after an arbitrary 6px (feels reasonable in testing)
    if (deltaY > 6 || deltaX > 6) {
      let currentRipples = this.state.ripples;
      const ripple = currentRipples[0];
      // This clone will replace the ripple in ReactTransitionGroup with a
      // version that will disappear immediately when removed from the DOM
      const abortedRipple = React.cloneElement(ripple, {aborted: true});
      // Remove the old ripple and replace it with the new updated one
      currentRipples = shift(currentRipples);
      currentRipples = push(currentRipples, abortedRipple);
      this.setState({ripples: currentRipples}, () => {
        // Call end after we've set the ripple to abort otherwise the setState
        // in end() merges with this and the ripple abort fails
        this.end();
      });
    }
  },

  startListeningForScrollAbort(event) {
    this.firstTouchY = event.touches[0].clientY;
    this.firstTouchX = event.touches[0].clientX;
    // Note that when scolling Chrome throttles this event to every 200ms
    // Also note we don't listen for scroll events directly as there's no general
    // way to cover cases like scrolling within containers on the page
    document.body.addEventListener('touchmove', this.handleTouchMove);
  },

  stopListeningForScrollAbort() {
    document.body.removeEventListener('touchmove', this.handleTouchMove);
  },

  getRippleStyle(event) {
    var style;
    if (!this.props.secondaryRipple) {
      style = Object.assign({}, ...this.componentProps('ripple').style, ...this.componentProps('primaryRipple').style);
    } else {
      style = Object.assign({}, ...this.componentProps('ripple').style, ...this.componentProps('secondaryRipple').style);
    }
    const el = ReactDOM.findDOMNode(this);
    const elHeight = el.offsetHeight;
    const elWidth = el.offsetWidth;
    const offset = Dom.offset(el);
    const isTouchEvent = event.touches && event.touches.length;
    const pageX = isTouchEvent ? event.touches[0].pageX : event.pageX;
    const pageY = isTouchEvent ? event.touches[0].pageY : event.pageY;
    const pointerX = pageX - offset.left;
    const pointerY = pageY - offset.top;
    const topLeftDiag = this.calcDiag(pointerX, pointerY);
    const topRightDiag = this.calcDiag(elWidth - pointerX, pointerY);
    const botRightDiag = this.calcDiag(elWidth - pointerX, elHeight - pointerY);
    const botLeftDiag = this.calcDiag(pointerX, elHeight - pointerY);
    const rippleRadius = Math.max(
      topLeftDiag, topRightDiag, botRightDiag, botLeftDiag
    );
    const rippleSize = rippleRadius * 2;
    const left = pointerX - rippleRadius;
    const top = pointerY - rippleRadius;
    var mergedStyles = Object.assign({height: `${rippleSize}px`, width: `${rippleSize}px`, top: `${top}px`, left: `${left}px`}, style);

    return mergedStyles;
  },

  calcDiag(a, b) {
    return Math.sqrt((a * a) + (b * b));
  },

  render() {
    const {children, style} = this.props;
    const {hasRipples, ripples} = this.state;

    let rippleGroup;

    if (hasRipples) {
      rippleGroup = (
        <ReactTransitionGroup {...this.componentProps('rippleGroup')}>
          {ripples}
        </ReactTransitionGroup>
      );
    }

    return (
      <div
        onMouseUp={this.handleMouseUp}
        onMouseDown={this.handleMouseDown}
        onMouseLeave={this.handleMouseLeave}
        onTouchStart={this.handleTouchStart}
        onTouchEnd={this.handleTouchEnd}
        {...this.componentProps()}
      >
        {rippleGroup}
        {children}
      </div>
    );
  }
});