import CreateWorkspaceModal from '@components/CreateWorkspaceModal';
import { useWorkspace } from '@contexts/WorkspaceContext';
import { AddButton, WorkspaceButton, Workspaces } from '@layouts/Workspace/styles';
import { IWorkspace } from '@typings/api';
import axios from 'axios';
import React, { useCallback, useState, VFC } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

interface Props {
  list: IWorkspace[];
  revalidate: () => Promise<boolean>;
}

const WorkspaceList: VFC<Props> = ({ list, revalidate }) => {
  const { setWorkspace } = useWorkspace();
  const [showCreateWorkspaceModal, setShowCreateWorkspaceModal] = useState(false);

  const onClickCreateWorkspace = useCallback(() => {
    setShowCreateWorkspaceModal(true);
  }, []);

  const onCloseModal = useCallback(() => {
    setShowCreateWorkspaceModal(false);
  }, []);

  const onCreateWorkspace = useCallback(async (newWorkspace: string, newUrl: string) => {
    try {
      await axios.post(
        '/api/workspaces',
        {
          workspace: newWorkspace,
          url: newUrl,
        },
        {
          withCredentials: true,
        },
      );
      revalidate();
      setShowCreateWorkspaceModal(false);
    } catch (error) {
      console.dir(error);
      toast.error(error.response?.data, { position: 'bottom-center' });
    }
  }, []);

  return (
    <>
      <Workspaces>
        {list &&
          list.map((workspace) => {
            return (
              <Link
                key={workspace.id}
                to={`/workspace/${workspace.url}/channel/일반`}
                onClick={() => setWorkspace(workspace)}
              >
                <WorkspaceButton>{workspace.name.slice(0, 1).toUpperCase()}</WorkspaceButton>
              </Link>
            );
          })}
        <AddButton onClick={onClickCreateWorkspace}>+</AddButton>
      </Workspaces>
      <CreateWorkspaceModal
        show={showCreateWorkspaceModal}
        onCloseModal={onCloseModal}
        onCreateWorkspace={onCreateWorkspace}
      />
    </>
  );
};

export default WorkspaceList;
