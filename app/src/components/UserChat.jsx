import Chat from './Chat';

export default function UserChat({
  onClose,
  isMini = false,
  activeAccount = null,
  isOwnerAdmin = false,
  onOpenAccountModal = null,
  targetChannelRequest = null,
  onActiveChannelChange = null,
  workspaceConfig = null,
}) {
  return (
    <div id="chat-workspace-container" className="relative w-full h-full flex flex-col bg-[#000000] text-white overflow-hidden">
      <div className="flex-1 w-full h-full min-h-0 flex flex-col">
        <Chat
          onClose={onClose}
          isMini={isMini}
          activeAccount={activeAccount}
          isOwnerAdmin={isOwnerAdmin}
          onOpenAccountModal={onOpenAccountModal}
          targetChannelRequest={targetChannelRequest}
          onActiveChannelChange={onActiveChannelChange}
          workspaceConfig={workspaceConfig}
        />
      </div>
    </div>
  );
}
