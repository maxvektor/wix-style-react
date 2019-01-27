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
    dataHook: PropTypes.string,

    /** the type of notification */
    type: PropTypes.oneOf(Object.values(NOTIFICATION_TYPES)),

    /** close button click handler - if exists shows X button */
    onClose: PropTypes.func,

    /** Text for text button to appear after content */
    linkButtonText: PropTypes.string,

    /** On click handler for text button */
    onLinkButtonClick: PropTypes.func,

    /** Text for button to appear after content/textButton */
    buttonText: PropTypes.string,

    /** On click handler for button */
    onButtonClick: PropTypes.func,

    /** An icon element to appear before content */
    prefixIcon: PropTypes.element,

    /** The text content of the notification */
    text: PropTypes.string,

    /** Is the element a floating element or inline */
    floatable: PropTypes.bool,

    /** If floatable shows and hides the element */
    show: PropTypes.bool,
  };

  static defaultProps = {
    type: NOTIFICATION_TYPES.STANDARD,
  };

  render() {
    const { floatable, show } = this.props;
    const notificationBox = this._getNotificationBox();

    return (
      <div
        ref={this._wrapperRef}
        className={classNames(styles.wrapper, { [styles.float]: floatable })}
      >
        <div
          className={classNames(styles.positioner, {
            [styles.show]: show,
          })}
        >
          {notificationBox}
        </div>
      </div>
    );
  }

  _getNotificationBox() {
    const { dataHook, type } = this.props;
    const icon = this._getIcon();
    const content = this._getContent();
    const textButton = this._getTextButton();
    const button = this._getButton();
    const close = this._getClose();

    return (
      <div
        className={classNames(styles.root, styles[type])}
        data-hook={dataHook}
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
      <Text size={'small'} ellipsis>
        {text}
      </Text>
    );
  }

  _getTextButton() {
    const { linkButtonText, onLinkButtonClick } = this.props;
    return linkButtonText ? (
      <TextButton
        underline={'always'}
        skin={'dark'}
        size={'small'}
        className={styles.textButton}
        onClick={onLinkButtonClick}
      >
        {linkButtonText}
      </TextButton>
    ) : null;
  }

  _getButton() {
    const { buttonText, onButtonClick } = this.props;
    return buttonText ? (
      <Button
        className={styles.button}
        onClick={onButtonClick}
        size={'tiny'}
        priority={'secondary'}
        skin={'dark'}
        upgrade
      >
        {buttonText}
      </Button>
    ) : null;
  }

  _getClose() {
    const { onClose } = this.props;
    return onClose ? (
      <div className={styles.close} onClick={onClose}>
        <X size={16} />
      </div>
    ) : null;
  }

  _wrapperRef = el => {
    const { floatable } = this.props;

    if (floatable && el) {
      const parentPosition = el.parentNode.style.position;
      el.parentNode.style.position =
        ['relative', 'absolute'].indexOf(parentPosition) > -1
          ? parentPosition
          : 'relative';
    }
  };
}

export default FloatingNotification;
