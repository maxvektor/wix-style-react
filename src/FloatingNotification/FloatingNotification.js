import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Text from '../Text';
import TextButton from '../TextButton';
import Button from '../Button';
import CloseButton from '../CloseButton/CloseButton';
import { NOTIFICATION_TYPES } from './constants';
import {
  BUTTON_DATA_HOOK,
  TEXT_BUTTON_DATA_HOOK,
  TEXT_DATA_HOOK,
  CLOSE_BUTTON_DATA_HOOK,
} from './datahooks.js';
import styles from './FloatingNotification.scss';

const buttonProps = PropTypes.shape({
  label: PropTypes.string,
  as: PropTypes.node,
  href: PropTypes.string,
  onClick: PropTypes.func,
});

/**
 * Displays simple and temporary messages or destructive events
 */
class FloatingNotification extends React.PureComponent {
  static displayName = 'FloatingNotification';

  static propTypes = {
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
    textButtonProps: buttonProps,

    /** boolean to enable/disable button to appear after content */
    showButton: PropTypes.bool,

    /** props to pass to button */
    buttonProps: buttonProps,

    /** An icon element to appear before content */
    prefixIcon: PropTypes.element,

    /** The text content of the notification */
    text: PropTypes.string,
  };

  static defaultProps = {
    type: NOTIFICATION_TYPES.STANDARD,
    buttonProps: {},
    textButtonProps: {},
    showCloseButton: true,
  };

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
      <Text
        size={'small'}
        ellipsis
        dataHook={TEXT_DATA_HOOK}
        className={styles.text}
      >
        {text}
      </Text>
    );
  }

  _getTextButton() {
    const { showTextButton, textButtonProps } = this.props;
    const { label, as, href, onClick } = textButtonProps;

    return showTextButton ? (
      <TextButton
        underline={'always'}
        skin={'dark'}
        size={'small'}
        className={styles.textButton}
        dataHook={TEXT_BUTTON_DATA_HOOK}
        as={as}
        href={href}
        onClick={onClick}
      >
        {label}
      </TextButton>
    ) : null;
  }

  _getButton() {
    const { showButton, buttonProps } = this.props;
    const { label, as, href, onClick } = buttonProps;

    return showButton ? (
      <Button
        className={styles.button}
        size={'tiny'}
        priority={'secondary'}
        skin={'dark'}
        dataHook={BUTTON_DATA_HOOK}
        as={as}
        href={href}
        onClick={onClick}
      >
        {label}
      </Button>
    ) : null;
  }

  _getClose() {
    const { showCloseButton, onClose } = this.props;
    return showCloseButton ? (
      <CloseButton
        size="medium"
        skin="dark"
        className={styles.close}
        dataHook={CLOSE_BUTTON_DATA_HOOK}
        onClick={onClose}
      />
    ) : null;
  }
}

export default FloatingNotification;
