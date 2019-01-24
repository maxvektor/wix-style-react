import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './FloatingNotification.scss';

import Text from '../Text';
import TextButton from '../TextButton';
import Button from '../Button';
import X from '../new-icons/X';

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
    textButtonText: PropTypes.string,

    /** On click handler for text button */
    onTextButtonClick: PropTypes.func,

    /** Text for button to appear after content/textButton */
    buttonText: PropTypes.string,

    /** On click handler for button */
    onButtonClick: PropTypes.func,

    /** An icon element to appear before content */
    icon: PropTypes.node,

    /** The text content of the notification */
    text: PropTypes.string,
  };

  static defaultProps = {
    type: NOTIFICATION_TYPES.STANDARD,
  };

  render() {
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
    const { icon } = this.props;
    return icon ? <div className={styles.icon}>{icon}</div> : null;
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
    const { textButtonText, onTextButtonClick } = this.props;
    return textButtonText ? (
      <TextButton
        underline={'always'}
        skin={'dark'}
        size={'small'}
        className={styles.textButton}
        onClick={onTextButtonClick}
      >
        {textButtonText}
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
}

export default FloatingNotification;
