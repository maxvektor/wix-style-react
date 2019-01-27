/* eslint-disable */
<MessageBoxFunctionalLayout
  title="Interruption Message"
  confirmText="Action"
  theme="blue"
  dataHook="alert-standard"
  disableConfirmation={true}
>
  This is a generic message. No harm done, but really needed to interrupt you.
  <FloatingNotification
    type="destructive"
    text="This is some very very very very very very very very very very very very very very very very very very long text"
    onClose={() => {}}
    floatable
    show
  />
</MessageBoxFunctionalLayout>