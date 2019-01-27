import React from 'react';
import LiveCodeExample from '../../utils/Components/LiveCodeExample';
import { Layout, Cell } from '../../../src/Layout';
import FloatingNotification from '../../../src/FloatingNotification';
import MessageBoxFunctionalLayout from '../../../src/MessageBox/MessageBoxFunctionalLayout';
import Text from '../../../src/Text/Text';

import ExampleSimple from '!raw-loader!./ExampleSimple';
import ExampleWithEverything from '!raw-loader!./ExampleWithEverything';
import ExampleFloating from '!raw-loader!./ExampleFloating';

export default class FloatingNotificationExample extends React.Component {
  state = {
    examples: [
      { example: ExampleSimple, title: 'Only text' },
      { example: ExampleWithEverything, title: 'All options, inline' },
      { example: ExampleFloating, title: 'Floating example' },
    ],
    showFloater: false,
  };

  render() {
    const { examples } = this.state;

    return (
      <Layout>
        {examples.map(({ example, title }) => (
          <Cell span={12}>
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
            disableConfirmation={this.state.showFloater}
          >
            This is a generic message. No harm done, but really needed to
            interrupt you.
            <FloatingNotification
              type="destructive"
              text="Cannot continue!"
              onClose={() => this.setState({ showFloater: false })}
              floatable
              show={this.state.showFloater}
            />
          </MessageBoxFunctionalLayout>
        </Cell>
      </Layout>
    );
  }
}
