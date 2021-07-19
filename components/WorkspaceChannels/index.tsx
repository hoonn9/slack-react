import ChannelList from '@components/ChannelList';
import CreateChannelModal from '@components/CreateChannelModal';
import DMList from '@components/DMList';
import InviteWorkspaceModal from '@components/InviteWorkspaceModal';
import Menu from '@components/Menu';
import { useWorkspace } from '@contexts/WorkspaceContext';
import { Channels, MenuScroll, WorkspaceModal, WorkspaceName } from '@layouts/Workspace/styles';
import React, { useCallback, useState, VFC } from 'react';

interface Props {
  onLogout: () => Promise<void>;
}

const WorkspaceChannels: VFC<Props> = ({ onLogout }) => {
  const { workspace } = useWorkspace();

  const [showWorkspaceModal, setShowWorkspaceModal] = useState(false);
  const [showCreateChannelModal, setShowCreateChannelModal] = useState(false);
  const [showInviteWorkspaceModal, setShowInviteWorkspaceModal] = useState(false);

  const toggleWorkspaceModal = useCallback(() => {
    setShowWorkspaceModal((prev) => !prev);
  }, []);

  const onClickInviteWorkspace = useCallback(() => {
    setShowInviteWorkspaceModal(true);
  }, []);
  const onClickAddChannel = useCallback(() => {
    setShowCreateChannelModal((prev) => !prev);
  }, []);

  const onCloseModal = useCallback(() => {
    setShowCreateChannelModal(false);
    setShowInviteWorkspaceModal(false);
  }, []);

  return (
    <>
      <Channels>
        <WorkspaceName onClick={toggleWorkspaceModal}>{workspace?.name || ''}</WorkspaceName>
        <i />
        <MenuScroll>
          <Menu show={showWorkspaceModal} onCloseModal={toggleWorkspaceModal} style={{ top: 95, left: 80 }}>
            <WorkspaceModal>
              <h2>{workspace?.name}</h2>
              <button onClick={onClickInviteWorkspace}>워크스페이스에 사용자 초대</button>
              <button onClick={onClickAddChannel}>채널 만들기</button>
              <button onClick={onLogout}>로그아웃</button>
            </WorkspaceModal>
          </Menu>
          <ChannelList />
          <DMList />
        </MenuScroll>
      </Channels>
      <CreateChannelModal
        show={showCreateChannelModal}
        onCloseModal={onCloseModal}
        setShowCreateChannelModal={setShowCreateChannelModal}
      />
      <InviteWorkspaceModal
        show={showInviteWorkspaceModal}
        onCloseModal={onCloseModal}
        setShowInviteWorkspaceModal={setShowInviteWorkspaceModal}
      />
    </>
  );
};

export default WorkspaceChannels;
