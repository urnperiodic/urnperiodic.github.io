import Chat from './Chat';

export default function UserChat({
  onClose,
  isMini = false,
  activeAccount = null,
  isOwnerAdmin = false,
  onOpenAccountModal = null,
}) {
  return (
    <div id="chat-workspace-container" className="relative w-full h-full flex flex-col bg-[#000000] text-white overflow-hidden">
      <div className="flex-1 w-full h-full min-h-0">
        <Chat
          onClose={onClose}
          isMini={isMini}
          activeAccount={activeAccount}
          isOwnerAdmin={isOwnerAdmin}
          onOpenAccountModal={onOpenAccountModal}
        />
      </div>
    </div>
  );
}
