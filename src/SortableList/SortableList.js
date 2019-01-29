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
    placeholderShift: [0, 0],
    isDragging: null,
  };

  draggableNodes = [];

  registerDraggableNode = (node, index, item) => {
    this.draggableNodes[index] = {node, item};
  };

  componentWillReceiveProps({ items }) {
    if (items) {
      this.setState({ items });
    }
  }

  handleMoveOut = id => {
    this.setState({ items: this.state.items.filter(it => it.id !== id), animationShifts: {} });
    // Handle nodes
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
        const shiftIndex = (addedIndex - originalIndex) / Math.abs(addedIndex - originalIndex);

        if (shiftIndex > 0) {
          const previousNodeIndex = originalIndex + 1;
          const {node} = this.draggableNodes[originalIndex] || {};
          const {node: prevNode} = this.draggableNodes[previousNodeIndex] || {};

          if (node && prevNode) {
            const nodeRect = node.getBoundingClientRect();
            const prevNodeRect = prevNode.getBoundingClientRect();

            animationShifts[previousNodeIndex] = [
              (nodeRect.y === prevNodeRect.y ? (nodeRect.left - prevNodeRect.left) : 0),
              (nodeRect.x === prevNodeRect.x ? (nodeRect.top - prevNodeRect.top) : 0),
            ];

            times(maxIndex - minIndex + 1, (i) => {
              const index = i + minIndex;
              if (index !== originalIndex && index !== previousNodeIndex) {
                animationShifts[index] = animationShifts[previousNodeIndex];
              }
            });
          }

        } else if (shiftIndex < 0) {
          const previousNodeIndex = originalIndex - 1;
          const {node} = this.draggableNodes[originalIndex] || {};
          const {node: prevNode} = this.draggableNodes[previousNodeIndex] || {};

          if (node && prevNode) {
            const nodeRect = node.getBoundingClientRect();
            const prevNodeRect = prevNode.getBoundingClientRect();

            animationShifts[previousNodeIndex] = [
              (nodeRect.y === prevNodeRect.y ? (nodeRect.right - prevNodeRect.right): 0),
              (nodeRect.x === prevNodeRect.x ? (nodeRect.bottom - prevNodeRect.bottom) : 0),
            ];

            times(maxIndex - minIndex + 1, (i) => {
              const index = i + minIndex;
              if (index !== originalIndex && index !== previousNodeIndex) {
                animationShifts[index] = animationShifts[previousNodeIndex];
              }
            });
          }
        }


        // Calculating placeholder shift
        const {node: targetNode} = this.draggableNodes[addedIndex] || {};
        const {node: placeholderNode} = this.draggableNodes[originalIndex] || {};

        if (targetNode && placeholderNode) {
          const placeholderNodeRect = placeholderNode.getBoundingClientRect();
          const targetNodeRect = targetNode.getBoundingClientRect();
          animationShifts[originalIndex] = [
            (placeholderNodeRect.y === targetNodeRect.y ? (shiftIndex > 0 ? (targetNodeRect.right - placeholderNodeRect.right) : (targetNodeRect.left - placeholderNodeRect.left)): 0),
            (placeholderNodeRect.x === targetNodeRect.x ? (shiftIndex > 0 ? (targetNodeRect.bottom - placeholderNodeRect.bottom) : (targetNodeRect.top - placeholderNodeRect.top)) : 0),
          ];
        }
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
                isDragging={!!this.state.isDragging && this.state.isDragging !== item.id} // TODO rename prop
                setDragNode={this.registerDraggableNode}

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
