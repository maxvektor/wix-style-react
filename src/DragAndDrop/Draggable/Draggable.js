import React from 'react';
import PropTypes from 'prop-types';

import WixComponent from '../../BaseComponents/WixComponent';
import DraggableSource from './components/DraggableSource';
import DraggableTarget from './components/DraggableTarget';

export class Draggable extends WixComponent {
  render() {
    const { hasDragged, ...restProps } = this.props;
    return (
      <DraggableTarget {...restProps}>
        <DraggableSource {...restProps} ignoreMouseEvents={hasDragged} />
      </DraggableTarget>
    );
  }
}

Draggable.propTypes = {
  /** decide whether to render a handle using `connectHandle` (see below) */
  withHandle: PropTypes.bool,
  /** uniq id of container that contain current draggable item */
  containerId: PropTypes.string,
  /* name of group between inside of each dnd is allowed */
  groupName: PropTypes.string,
  /* custom renderer for item */
  renderItem: PropTypes.func,
  /* position of item in container items array */
  index: PropTypes.number,
  /* uniq id of an item */
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  /* model that represent item */
  item: PropTypes.object,
  /** callback when item was moved out from current container to another container */
  onMoveOut: PropTypes.func,
  /** callback when item was dropped in a new location */
  onDrop: PropTypes.func,
  /** callback when item is hovered*/
  onHover: PropTypes.func,
  /** callback for drag start */
  onDragStart: PropTypes.func,
  /** callback for drag end */
  onDragEnd: PropTypes.func,

  /** visual positioning shifting for an element (transform: translate) without moving it from its real position at DOM (left, top) */
  shift: PropTypes.arrayOf(PropTypes.number),
  hasDragged: PropTypes.bool,
  setWrapperNode: PropTypes.func,
  /** animation duration in ms, default = 0 - disabled */
  animationDuration: PropTypes.number,
  /** animation timing function, default = linear */
  animationTiming: PropTypes.string,
  /** callback that prevents item from dragging */
  canDrag: PropTypes.func,
};

export default Draggable;
