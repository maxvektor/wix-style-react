import React from 'react';
import ReactDOM from 'react-dom';
import ReactTestUtils from 'react-dom/test-utils';
import { mount } from 'enzyme';

import TestBackend from '../DragDropContextProvider/TestBackend';
import DragDropContextProvider from '../DragDropContextProvider';
import Modal from '../Modal';
import Tooltip from '../Tooltip';
import Button from '../Button';

import { sortableListTestkitFactory } from '../../testkit';
import { sortableListTestkitFactory as enzymeSortableListTestkitFactory } from '../../testkit/enzyme';

import privateSortableListDriver from './SortableList.driver.private';

import SortableList from './SortableList';

describe('SortableList', () => {
  const defaultProps = {
    contentClassName: 'cl',
    dataHook: 'sortable-list',
    containerId: 'sortable-list',
    groupName: 'group',
    items: [{ id: '1', text: 'item 1' }, { id: '2', text: 'item 2' }],
    renderItem: ({ item }) => <div data-hook={item.id}>{item.text}</div>,
  };

  const configureWrapper = props => {
    const elemProps = { ...defaultProps, ...props };
    return ReactTestUtils.renderIntoDocument(
      <DragDropContextProvider backend={TestBackend}>
        <SortableList {...elemProps} />
      </DragDropContextProvider>,
    );
  };

  const createDriver = wrapper => {
    return privateSortableListDriver({
      wrapper,
      element: ReactDOM.findDOMNode(wrapper),
    });
  };

  it('should exists', () => {
    const dataHook = 'sortable-list';
    const items = [{ id: '1', text: 'item 1' }, { id: '2', text: 'item 2' }];
    const onDrop = jest.fn();
    const renderItem = ({ item }) => <div>{item.text}</div>; // eslint-disable-line react/prop-types

    const wrapper = ReactTestUtils.renderIntoDocument(
      <DragDropContextProvider backend={TestBackend}>
        <SortableList
          contentClassName="cl"
          dataHook={dataHook}
          containerId="sortable-list"
          items={items}
          renderItem={renderItem}
          onDrop={onDrop}
        />
      </DragDropContextProvider>,
    );
    const driver = sortableListTestkitFactory({ wrapper, dataHook });
    expect(driver.exists()).toBeTruthy();
  });

  it('should call onDragStart and onDragEnd', () => {
    const dataHook = 'sortable-list';
    const items = [{ id: '1', text: 'item 1' }, { id: '2', text: 'item 2' }];
    const onDrop = jest.fn();
    const onDragStart = jest.fn();
    const onDragEnd = jest.fn();
    const renderItem = ({ item }) => <div>{item.text}</div>; // eslint-disable-line react/prop-types

    const wrapper = ReactTestUtils.renderIntoDocument(
      <DragDropContextProvider backend={TestBackend}>
        <SortableList
          contentClassName="cl"
          dataHook={dataHook}
          containerId="sortable-list"
          groupName="group"
          items={items}
          renderItem={renderItem}
          onDrop={onDrop}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
        />
      </DragDropContextProvider>,
    );

    const privateDriver = privateSortableListDriver({
      wrapper,
      element: ReactDOM.findDOMNode(wrapper),
    });

    privateDriver.beginDrag('1');
    privateDriver.endDrag();

    expect(onDragStart).toBeCalledWith({
      containerId: 'sortable-list',
      groupName: 'group',
      id: '1',
      index: 0,
      item: { id: '1', text: 'item 1' },
    });
    expect(onDragEnd).toBeCalledWith({
      containerId: 'sortable-list',
      groupName: 'group',
      id: '1',
      index: 0,
      item: { id: '1', text: 'item 1' },
    });
    expect(onDrop).not.toBeCalled();
  });

  it('should call onDrop', () => {
    const dataHook = 'sortable-list';
    const items = [{ id: '1', text: 'item 1' }, { id: '2', text: 'item 2' }];
    const onDrop = jest.fn();
    const renderItem = ({ item }) => <div>{item.text}</div>; // eslint-disable-line react/prop-types

    const wrapper = ReactTestUtils.renderIntoDocument(
      <DragDropContextProvider backend={TestBackend}>
        <SortableList
          contentClassName="cl"
          dataHook={dataHook}
          containerId="sortable-list"
          items={items}
          renderItem={renderItem}
          onDrop={onDrop}
        />
      </DragDropContextProvider>,
    );
    const driver = sortableListTestkitFactory({ wrapper, dataHook });

    driver.reorder({ removedId: '1', addedId: '2' });

    expect(onDrop).toBeCalledWith({
      addedIndex: 1,
      addedToContainerId: 'sortable-list',
      payload: { id: '1', text: 'item 1' },
      removedFromContainerId: 'sortable-list',
      removedIndex: 0,
    });
  });

  it('should call onDrop(with portal)', () => {
    const dataHook = 'sortable-list';
    const items = [{ id: '1', text: 'item 1' }, { id: '2', text: 'item 2' }];
    const onDrop = jest.fn();
    const renderItem = ({ item }) => <div>{item.text}</div>; // eslint-disable-line react/prop-types

    const wrapper = ReactTestUtils.renderIntoDocument(
      <DragDropContextProvider backend={TestBackend}>
        <SortableList
          usePortal
          contentClassName="cl"
          dataHook={dataHook}
          containerId="sortable-list"
          items={items}
          renderItem={renderItem}
          onDrop={onDrop}
        />
      </DragDropContextProvider>,
    );
    const driver = sortableListTestkitFactory({ wrapper, dataHook });

    driver.reorder({ removedId: '1', addedId: '2' });

    expect(onDrop).toBeCalledWith({
      addedIndex: 1,
      addedToContainerId: 'sortable-list',
      payload: { id: '1', text: 'item 1' },
      removedFromContainerId: 'sortable-list',
      removedIndex: 0,
    });
  });

  it('should call onDrop(inside of the modal)', () => {
    const dataHook = 'sortable-list';
    const items = [{ id: '1', text: 'item 1' }, { id: '2', text: 'item 2' }];
    const onDrop = jest.fn();
    const renderItem = ({ item }) => <div>{item.text}</div>; // eslint-disable-line react/prop-types

    const wrapper = ReactTestUtils.renderIntoDocument(
      <DragDropContextProvider backend={TestBackend}>
        <Modal isOpen>
          <SortableList
            contentClassName="cl"
            dataHook={dataHook}
            containerId="sortable-list"
            items={items}
            renderItem={renderItem}
            onDrop={onDrop}
          />
        </Modal>
      </DragDropContextProvider>,
    );
    const driver = sortableListTestkitFactory({ wrapper, dataHook });

    driver.reorder({ removedId: '1', addedId: '2' });

    expect(onDrop).toBeCalledWith({
      addedIndex: 1,
      addedToContainerId: 'sortable-list',
      payload: { id: '1', text: 'item 1' },
      removedFromContainerId: 'sortable-list',
      removedIndex: 0,
    });
  });

  it('should call onDrop(inside of the tooltip)', done => {
    const dataHook = 'sortable-list';
    const items = [{ id: '1', text: 'item 1' }, { id: '2', text: 'item 2' }];
    const onDrop = jest.fn();
    const renderItem = ({ item }) => <div>{item.text}</div>; // eslint-disable-line react/prop-types

    const wrapper = ReactTestUtils.renderIntoDocument(
      <DragDropContextProvider backend={TestBackend}>
        <Tooltip
          active
          showImmediately
          content={
            <SortableList
              contentClassName="cl"
              dataHook={dataHook}
              containerId="sortable-list"
              items={items}
              renderItem={renderItem}
              onDrop={onDrop}
            />
          }
        >
          <Button>Click me</Button>
        </Tooltip>
      </DragDropContextProvider>,
    );
    const driver = sortableListTestkitFactory({ wrapper, dataHook });
    setTimeout(() => {
      driver.reorder({ removedId: '1', addedId: '2' });

      expect(onDrop).toBeCalledWith({
        addedIndex: 1,
        addedToContainerId: 'sortable-list',
        payload: { id: '1', text: 'item 1' },
        removedFromContainerId: 'sortable-list',
        removedIndex: 0,
      });
      done();
    }, 100);
  });

  it('should call onDrop(inside of the tooltip with portal)', done => {
    const dataHook = 'sortable-list-inside-of-a-tooltip';
    const items = [{ id: '1', text: 'item 1' }, { id: '2', text: 'item 2' }];
    const onDrop = jest.fn();
    const renderItem = ({ item }) => <div>{item.text}</div>; // eslint-disable-line react/prop-types

    const wrapper = ReactTestUtils.renderIntoDocument(
      <DragDropContextProvider backend={TestBackend}>
        <Tooltip
          appendTo={document.body}
          active
          showImmediately
          content={
            <SortableList
              contentClassName="cl"
              dataHook={dataHook}
              containerId="sortable-list"
              items={items}
              renderItem={renderItem}
              onDrop={onDrop}
            />
          }
        >
          <Button>Click me</Button>
        </Tooltip>
      </DragDropContextProvider>,
    );
    const driver = sortableListTestkitFactory({ wrapper, dataHook });
    setTimeout(() => {
      driver.reorder({ removedId: '1', addedId: '2' });
      expect(onDrop).toBeCalledWith({
        addedIndex: 1,
        addedToContainerId: 'sortable-list',
        payload: { id: '1', text: 'item 1' },
        removedFromContainerId: 'sortable-list',
        removedIndex: 0,
      });
      done();
    }, 100);
  });

  it('should call onDrop(inside of the modal with nested DragDropContextProvider)', () => {
    const dataHook = 'sortable-list';
    const items = [{ id: '1', text: 'item 1' }, { id: '2', text: 'item 2' }];
    const onDrop = jest.fn();
    const renderItem = ({ item }) => <div>{item.text}</div>; // eslint-disable-line react/prop-types

    const wrapper = ReactTestUtils.renderIntoDocument(
      <Modal isOpen>
        <DragDropContextProvider backend={TestBackend}>
          <SortableList
            contentClassName="cl"
            dataHook={dataHook}
            containerId="sortable-list"
            items={items}
            renderItem={renderItem}
            onDrop={onDrop}
          />
        </DragDropContextProvider>
      </Modal>,
    );
    const driver = sortableListTestkitFactory({ wrapper, dataHook });
    driver.reorder({ removedId: '1', addedId: '2' });

    expect(onDrop).toBeCalledWith({
      addedIndex: 1,
      addedToContainerId: 'sortable-list',
      payload: { id: '1', text: 'item 1' },
      removedFromContainerId: 'sortable-list',
      removedIndex: 0,
    });
  });

  it('should not call onDragStart if canDrag prop is false', () => {
    const props = {
      onDragStart: jest.fn(),
      onDragEnd: jest.fn(),
      canDrag: () => false,
    };
    const wrapper = configureWrapper(props);
    const driver = createDriver(wrapper);

    driver.beginDrag('1');
    expect(props.onDragStart).not.toBeCalled();
  });

  it('should contain prop to set custom  class (`isDragging`) while dragging', () => {
    const renderItem = ({item, smthDragging}) => <div className={smthDragging ? 'isDragging' : null} data-hook={item.id}>{item.text}</div>;
    const wrapper = configureWrapper({renderItem});
    const driver = createDriver(wrapper);
    driver.beginDrag('1');
    expect(driver.getElement().querySelector('[data-hook="1"]').classList.contains('isDragging')).toBeTruthy();
    driver.endDrag();
    expect(driver.getElement().querySelector('[data-hook="1"]').classList.contains('isDragging')).toBeFalsy();
  });

  describe('with delay prop', () => {
    let privateDriver, onDragStart, onDragEnd;
    const items = [{ id: '1', text: 'item 1' }, { id: '2', text: 'item 2' }];
    const renderItem = ({ item }) => <div>{item.text}</div>; // eslint-disable-line react/prop-types

    const configureWrapperWithDelay = delay => {
      const wrapper = ReactTestUtils.renderIntoDocument(
        <DragDropContextProvider backend={TestBackend}>
          <SortableList
            containerId="sortable-list"
            groupName="group"
            items={items}
            renderItem={renderItem}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            delay={delay}
          />
        </DragDropContextProvider>,
      );

      privateDriver = privateSortableListDriver({
        wrapper,
        element: ReactDOM.findDOMNode(wrapper),
      });
    };

    beforeEach(() => {
      onDragStart = jest.fn();
      onDragEnd = jest.fn();
    });

    it('should not initiate drag immediately if delay specified', () => {
      configureWrapperWithDelay(200);

      ReactTestUtils.Simulate.mouseDown(privateDriver.getDelayWrapper());
      privateDriver.beginDrag('1');
      expect(onDragStart).not.toBeCalled();
    });

    it('should be able to drag after delay end', done => {
      configureWrapperWithDelay(200);

      ReactTestUtils.Simulate.mouseDown(privateDriver.getDelayWrapper());
      privateDriver.beginDrag('1');

      setTimeout(() => {
        privateDriver.beginDrag('1');
        privateDriver.endDrag();
        expect(onDragStart).toBeCalled();
        done();
      }, 210);
    });

    it('should be able to drag if delay is 0', () => {
      configureWrapperWithDelay(0);

      ReactTestUtils.Simulate.mouseDown(privateDriver.getDelayWrapper());
      privateDriver.beginDrag('1');
      privateDriver.endDrag();
      expect(onDragStart).toBeCalled();
    });
  });
});

describe('Enzyme: SortableList', () => {
  it('should call onDrop', () => {
    const dataHook = 'sortable-list';
    const items = [{ id: '1', text: 'item 1' }, { id: '2', text: 'item 2' }];
    const onDrop = jest.fn();
    const renderItem = ({ item }) => <div>{item.text}</div>; // eslint-disable-line react/prop-types

    const wrapper = mount(
      <DragDropContextProvider backend={TestBackend}>
        <SortableList
          contentClassName="cl"
          dataHook={dataHook}
          containerId="sortable-list"
          items={items}
          renderItem={renderItem}
          onDrop={onDrop}
        />
      </DragDropContextProvider>,
    );
    const driver = enzymeSortableListTestkitFactory({ wrapper, dataHook });

    driver.reorder({ removedId: '1', addedId: '2' });

    expect(onDrop).toBeCalledWith({
      addedIndex: 1,
      addedToContainerId: 'sortable-list',
      payload: { id: '1', text: 'item 1' },
      removedFromContainerId: 'sortable-list',
      removedIndex: 0,
    });
  });

  it('should call onDrop when drag between columns', () => {
    const dataHook = 'sortable-list';
    const items = [{ id: '1', text: 'item 1' }, { id: '2', text: 'item 2' }];
    const items2 = [
      { id: '11', text: 'item 11' },
      { id: '21', text: 'item 21' },
    ];
    const onDrop = jest.fn();
    const renderItem = ({ item }) => <div key={item.id}>{item.text}</div>; // eslint-disable-line react/prop-types

    class MyComponent extends React.Component {
      render() {
        return (
          <div>
            <SortableList
              contentClassName="cl"
              dataHook={dataHook}
              containerId="sortable-list-1"
              groupName="group1"
              items={items}
              renderItem={renderItem}
              onDrop={onDrop}
            />
            <SortableList
              contentClassName="cl"
              dataHook={dataHook}
              containerId="sortable-list-2"
              groupName="group1"
              items={items2}
              renderItem={renderItem}
              onDrop={onDrop}
            />
          </div>
        );
      }
    }

    const wrapper = mount(
      <DragDropContextProvider backend={TestBackend}>
        <MyComponent />
      </DragDropContextProvider>,
    );
    const driver = enzymeSortableListTestkitFactory({ wrapper, dataHook });

    driver.reorder({ removedId: '1', addedId: '21' });

    expect(onDrop).toBeCalledWith({
      addedIndex: 1,
      addedToContainerId: 'sortable-list-2',
      payload: { id: '1', text: 'item 1' },
      removedFromContainerId: 'sortable-list-1',
      removedIndex: 0,
    });
  });

  it('should not call onDrop when drag between columns with different groupName', () => {
    const dataHook = 'sortable-list';
    const items = [{ id: '1', text: 'item 1' }, { id: '2', text: 'item 2' }];
    const items2 = [
      { id: '11', text: 'item 11' },
      { id: '21', text: 'item 21' },
    ];
    const onDrop = jest.fn();
    const renderItem = ({ item }) => <div key={item.id}>{item.text}</div>; // eslint-disable-line react/prop-types

    class MyComponent extends React.Component {
      render() {
        return (
          <div>
            <SortableList
              contentClassName="cl"
              dataHook={dataHook}
              containerId="sortable-list-1"
              groupName="group1"
              items={items}
              renderItem={renderItem}
              onDrop={onDrop}
            />
            <SortableList
              contentClassName="cl"
              dataHook={dataHook}
              containerId="sortable-list-2"
              groupName="group2"
              items={items2}
              renderItem={renderItem}
              onDrop={onDrop}
            />
          </div>
        );
      }
    }

    const wrapper = mount(
      <DragDropContextProvider backend={TestBackend}>
        <MyComponent />
      </DragDropContextProvider>,
    );
    const driver = enzymeSortableListTestkitFactory({ wrapper, dataHook });

    driver.reorder({ removedId: '1', addedId: '21' });

    expect(onDrop).not.toBeCalled();
  });

  it('should not call onDrop when drag between columns without group name', () => {
    const dataHook = 'sortable-list';
    const items = [{ id: '1', text: 'item 1' }, { id: '2', text: 'item 2' }];
    const items2 = [
      { id: '11', text: 'item 11' },
      { id: '21', text: 'item 21' },
    ];
    const onDrop = jest.fn();
    const renderItem = ({ item }) => <div key={item.id}>{item.text}</div>; // eslint-disable-line react/prop-types

    class MyComponent extends React.Component {
      render() {
        return (
          <div>
            <SortableList
              contentClassName="cl"
              dataHook={dataHook}
              containerId="sortable-list-1"
              items={items}
              renderItem={renderItem}
              onDrop={onDrop}
            />
            <SortableList
              contentClassName="cl"
              dataHook={dataHook}
              containerId="sortable-list-2"
              items={items2}
              renderItem={renderItem}
              onDrop={onDrop}
            />
          </div>
        );
      }
    }

    const wrapper = mount(
      <DragDropContextProvider backend={TestBackend}>
        <MyComponent />
      </DragDropContextProvider>,
    );
    const driver = enzymeSortableListTestkitFactory({ wrapper, dataHook });

    driver.reorder({ removedId: '1', addedId: '21' });

    expect(onDrop).not.toBeCalled();
  });

  it('should call onDrop when drag&drop columns', () => {
    const dataHook = 'sortable-list';
    const items = [{ id: '1', text: 'item 1' }, { id: '2', text: 'item 2' }];
    const items2 = [
      { id: '11', text: 'item 11' },
      { id: '21', text: 'item 21' },
    ];
    const onDrop = jest.fn();
    const renderItem = ({ item }) => <div key={item.id}>{item.text}</div>; // eslint-disable-line react/prop-types
    const renderColumn = (
      { item }, // eslint-disable-line react/prop-types
    ) => (
      <div key={item.id}>
        <SortableList
          contentClassName="cl"
          dataHook={dataHook}
          containerId="sortable-list-2"
          items={items2}
          renderItem={renderItem}
          onDrop={onDrop}
        />
      </div>
    );

    class MyComponent extends React.Component {
      render() {
        return (
          <div>
            <SortableList
              contentClassName="cl"
              dataHook={dataHook}
              containerId="sortable-list-1"
              groupName="group1"
              items={items}
              renderItem={renderColumn}
              onDrop={onDrop}
            />
          </div>
        );
      }
    }

    const wrapper = mount(
      <DragDropContextProvider backend={TestBackend}>
        <MyComponent />
      </DragDropContextProvider>,
    );
    const driver = enzymeSortableListTestkitFactory({ wrapper, dataHook });

    driver.reorder({ removedId: '1', addedId: '2' });

    expect(onDrop).toBeCalledWith({
      addedIndex: 1,
      addedToContainerId: 'sortable-list-1',
      payload: { id: '1', text: 'item 1' },
      removedFromContainerId: 'sortable-list-1',
      removedIndex: 0,
    });
  });

  it('should call onDrop(with portal)', () => {
    const dataHook = 'sortable-list';
    const items = [{ id: '1', text: 'item 1' }, { id: '2', text: 'item 2' }];
    const onDrop = jest.fn();
    const renderItem = ({ item }) => <div>{item.text}</div>; // eslint-disable-line react/prop-types

    const wrapper = mount(
      <DragDropContextProvider backend={TestBackend}>
        <SortableList
          usePortal
          contentClassName="cl"
          dataHook={dataHook}
          containerId="sortable-list"
          items={items}
          renderItem={renderItem}
          onDrop={onDrop}
        />
      </DragDropContextProvider>,
    );
    const driver = enzymeSortableListTestkitFactory({ wrapper, dataHook });

    driver.reorder({ removedId: '1', addedId: '2' });

    expect(onDrop).toBeCalledWith({
      addedIndex: 1,
      addedToContainerId: 'sortable-list',
      payload: { id: '1', text: 'item 1' },
      removedFromContainerId: 'sortable-list',
      removedIndex: 0,
    });
  });
});
