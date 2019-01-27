import React from 'react';
import LiveCodeExample from '../../utils/Components/LiveCodeExample';
import { Layout, Cell } from '../../../src/Layout';
import FloatingNotification, { NOTIFICATION_TYPES } from '../../../src/FloatingNotification';
import MessageBoxFunctionalLayout from '../../../src/MessageBox/MessageBoxFunctionalLayout';
import Text from '../../../src/Text/Text';

import ExampleSimple from '!raw-loader!./ExampleSimple';
import ExampleWithEverything from '!raw-loader!./ExampleWithEverything';
import ExampleFloating from '!raw-loader!./ExampleFloating';
import ExampleFloatingLongText from '!raw-loader!./ExampleFloatingLongText';

export default class FloatingNotificationExample extends React.Component {
  state = {
    examples: [
      { example: ExampleSimple, title: 'Only text' },
      { example: ExampleWithEverything, title: 'All options, inline' },
      { example: ExampleFloating, title: 'Floating example' },
      {
        example: ExampleFloatingLongText,
        title: 'Floating example with long text',
      },
    ],
    showFloater: false,
  };

  render() {
    const { showFloater } = this.state;
    const { examples } = this.state;

    return (
      <Layout>
        {examples.map(({ example, title }) => (
          <Cell span={12} key={title}>
            <LiveCodeExample compact title={title} initialCode={example} />
          </Cell>
        ))}
        <Cell span={12}>
          <Text weight={'bold'}>Toggle show and hide</Text>
          <MessageBoxFunctionalLayout
            title="Interruption Message"
            confirmText="Action"
            theme="blue"
            dataHook="alert-standard"
            onOk={() => this.setState({ showFloater: true })}
            disableConfirmation={showFloater}
          >
            Click the action to view a floating notification
            <FloatingNotification
              type={NOTIFICATION_TYPES.SUCCESS}
              text="Click the X to close"
              onClose={() => this.setState({ showFloater: false })}
              floatable
              show={showFloater}
            />
          </MessageBoxFunctionalLayout>
        </Cell>
      </Layout>
    );
  }
}
