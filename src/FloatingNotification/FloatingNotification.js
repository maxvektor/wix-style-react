import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Text from '../Text';
import TextButton from '../TextButton';
import Button from '../Button';
import X from '../new-icons/X';
import styles from './FloatingNotification.scss';

export const NOTIFICATION_TYPES = {
  STANDARD: 'standard',
  SUCCESS: 'success',
  DESTRUCTIVE: 'destructive',
  WARNING: 'warning',
  PREMIUM: 'premium',
};

class FloatingNotification extends React.PureComponent {
  static displayName = 'FloatingNotification';

  static propTypes = {
    /** data-hook argument to root element */
    dataHook: PropTypes.string,

    className: PropTypes.string,

    /** the type of notification */
    type: PropTypes.oneOf(Object.values(NOTIFICATION_TYPES)),

    /** decides if to show the close button */
    showCloseButton: PropTypes.bool,

    /** close button on click handler */
    onClose: PropTypes.func,

    /** boolean to enable/disable text button to appear after content */
    showTextButton: PropTypes.bool,

    /** props to pass to textButton */
    textButtonProps: PropTypes.object,

    /** boolean to enable/disable button to appear after content */
    showButton: PropTypes.bool,

    /** props to pass to button */
    buttonProps: PropTypes.object,

    /** An icon element to appear before content */
    prefixIcon: PropTypes.element,

    /** The text content of the notification */
    text: PropTypes.string,
  };

  static defaultProps = {
    type: NOTIFICATION_TYPES.STANDARD,
    buttonProps: {},
    textButtonProps: {},
  };

  state = {
    position: undefined,
  };

  componentWillUnmount() {
    cancelAnimationFrame(this._animationFrameId);
  }

  render() {
    const { type, className, dataHook } = this.props;
    const icon = this._getIcon();
    const content = this._getContent();
    const textButton = this._getTextButton();
    const button = this._getButton();
    const close = this._getClose();

    return (
      <div
        data-hook={dataHook}
        className={classNames(styles.root, styles[type], className)}
      >
        {icon}
        {content}
        {textButton}
        {button}
        <div className={styles.gap} />
        {close}
      </div>
    );
  }

  _getIcon() {
    const { prefixIcon } = this.props;
    return prefixIcon ? <div className={styles.icon}>{prefixIcon}</div> : null;
  }

  _getContent() {
    const { text } = this.props;
    return (
      <Text size={'small'} ellipsis dataHook={'FloatingNotification-text'}>
        {text}
      </Text>
    );
  }

  _getTextButton() {
    const { showTextButton, textButtonProps } = this.props;
    const textButtonText = textButtonProps.label;
    const props = { ...textButtonProps };
    delete props.label;

    return showTextButton ? (
      <TextButton
        underline={'always'}
        skin={'dark'}
        size={'small'}
        className={styles.textButton}
        {...props}
      >
        {textButtonText}
      </TextButton>
    ) : null;
  }

  _getButton() {
    const { showButton, buttonProps } = this.props;
    const buttonText = buttonProps.label;
    const props = { ...buttonProps };
    delete props.label;

    return showButton ? (
      <Button
        className={styles.button}
        size={'tiny'}
        priority={'secondary'}
        skin={'dark'}
        {...props}
        upgrade
      >
        {buttonText}
      </Button>
    ) : null;
  }

  _getClose() {
    const { showCloseButton, onClose } = this.props;
    return showCloseButton ? (
      <div className={styles.close} onClick={onClose}>
        <X size={16} />
      </div>
    ) : null;
  }
}

export default FloatingNotification;
