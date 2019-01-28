import React from 'react';
import PropTypes from 'prop-types';

import WixComponent from '../BaseComponents/WixComponent';
import { Draggable } from '../DragAndDrop/Draggable';
import Container from '../DragAndDrop/Draggable/components/Container';
import DragDropContextProvider from '../DragDropContextProvider';

import times from '../utils/operators/times';

/**
 * Attaches Drag and Drop behavior to a list of items
 */
export default class SortableList extends WixComponent {
  state = {
    items: this.props.items || [],
    animationShifts: {},
    isDragging: null,
  };

  componentWillReceiveProps({ items }) {
    if (items) {
      this.setState({ items });
    }
  }

  handleMoveOut = id => {
    this.setState({ items: this.state.items.filter(it => it.id !== id), animationShifts: {} });
  };

  handleHover = ({removedIndex, addedIndex, originalIndex, id, item}) => {
    this.setState(prevState => {
      const nextItems = [...prevState.items];
      let animationShifts = {};
      let isDragging = this.state.isDragging;

      // New item added from other list
      if (!nextItems.find(it => it.id === id)) {
        nextItems.splice(addedIndex, 0, item);
        isDragging = true;
      }
      // Existing item moved
      else {
        const minIndex = Math.min(originalIndex, addedIndex);
        const maxIndex = Math.max(originalIndex, addedIndex);

        // TODO change this to coordinates
        const shiftDirection = originalIndex <= addedIndex ? -1 : 1;

        times(maxIndex - minIndex + 1, (i) => {
          const index = i + minIndex;
          if (index !== originalIndex) {
            // TODO change this to use actual node size and position
            animationShifts[index] = [0, shiftDirection * 72];
          }
        });
      }

      return { items: nextItems, animationShifts, isDragging };
    });
  };

  handleDrop = ({
    payload,
    addedIndex,
    removedIndex,
    addedToContainerId,
    removedFromContainerId,
  }) => {
    this.props.onDrop({
      payload,
      addedIndex,
      removedIndex,
      addedToContainerId,
      removedFromContainerId,
    });
  };

  handleDragStart = data => {
    this.setState({animationShifts: {}, isDragging: data.id});
    if (this.props.onDragStart) {
      this.props.onDragStart(data);
    }
  };

  handleDragEnd = data => {
    this.setState({animationShifts: {}, isDragging: null});
    if (this.props.onDragEnd) {
      this.props.onDragEnd(data);
    }
  };

  renderPreview() {
    const { className, contentClassName, renderItem } = this.props;
    return (
      <div className={className}>
        <div className={contentClassName}>
          {this.state.items.map((item, index) => (
            <div key={`${item.id}-${index}-${this.props.containerId}`}>
              {renderItem({
                item,
                id: item.id,
                isPlaceholder: false,
                isPreview: false,
              })}
            </div>
          ))}
        </div>
      </div>
    );
  }

  render() {
    const { className, contentClassName, groupName, dragPreview } = this.props;
    const common = {
      groupName,
      containerId: this.props.containerId,
      onHover: this.handleHover,
      onMoveOut: this.handleMoveOut,
    };

    if (dragPreview) {
      return this.renderPreview();
    }

    return (
      <DragDropContextProvider>
        <Container
          className={className}
          total={this.state.items.length}
          {...common}
        >
          <div className={contentClassName}>
            {this.state.items.map((item, index) => (
              <Draggable
                key={`${item.id}-${this.props.containerId}`}
                shift={this.state.animationShifts[index]}
                isDragging={this.state.isDragging && this.state.isDragging !== item.id} // TODO rename prop

                {...common}
                id={item.id}
                index={index}
                item={item}
                renderItem={this.props.renderItem}
                withHandle={this.props.withHandle}
                usePortal={this.props.usePortal}
                onDrop={this.handleDrop}
                onDragStart={this.handleDragStart}
                onDragEnd={this.handleDragEnd}
              />
            ))}
          </div>
        </Container>
      </DragDropContextProvider>
    );
  }
}

SortableList.displayName = 'SortableList';

SortableList.propTypes = {
  ...Draggable.propTypes,
  /** in case of wrong position of item during drag you can force SortableList to use portals */
  usePortal: PropTypes.bool,
  /**
    if you are having nested SortableLists,
    list that you are currently dragging need to be marked as dragPreview
    inside of renderItem callback
  */
  dragPreview: PropTypes.bool,
  /** list of items with {id: any} */
  items: PropTypes.array,
  /** callback for drag start */
  onDragStart: PropTypes.func,
  /** callback for drag end */
  onDragEnd: PropTypes.func,
  /** className of the root container */
  className: PropTypes.string,
  /** className of the first items parent container */
  contentClassName: PropTypes.string,
};
