var React = require('react');
var Component = require('../component');
var Icon = require('../components/Icon');
var Tappable = require('../helpers/Tappable');

module.exports = Component({
  name: 'Radio',

  propTypes: {
    iconProps: React.PropTypes.object
  },

  getInitialState() {
    return {
      checked: this.props.checked || this.props.defaultChecked
    };
  },

  handleChange(e) {
    if (!this.refs.input.checked)
      this.setState({ checked: true });
    else
      this.setState({ checked: false });

    if (this.props.onChange)
      this.props.onChange(e);
  },

  render() {
    var { iconProps, defaultChecked, checked, onChange, ...props } = this.props;

    return (
      <Tappable {...this.componentProps()} onTap={this.handleChange} stopPropagation>
        <input
          {...this.componentProps('input')}
          {...props}
          checked={this.state.checked}
        />
        <Icon
          file={require('../assets/icons/check.svg')}
          size={24}
          color={this.getConstant(this.state.checked ? 'active' : 'inactive')}
          styles={{ self: { margin: 'auto' } }}
          {...iconProps}
        />
      </Tappable>
    );
  }
});
