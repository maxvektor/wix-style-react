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
    text="Cannot continue!"
    onClose={() => {}}
    floatable
    show
  />
</MessageBoxFunctionalLayout>