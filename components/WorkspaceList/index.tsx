import CreateWorkspaceModal from '@components/CreateWorkspaceModal';
import { useWorkspace } from '@contexts/WorkspaceContext';
import { AddButton, WorkspaceButton, Workspaces } from '@layouts/Workspace/styles';
import { IWorkspace } from '@typings/api';
import axios from 'axios';
import React, { useCallback, useEffect, useState, VFC } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';

interface Props {
  list: IWorkspace[];
  revalidate: () => Promise<boolean>;
}

const WorkspaceList: VFC<Props> = ({ list, revalidate }) => {
  const history = useHistory();
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

  useEffect(() => {
    if (history.location.pathname.split('/').length > 2) {
      const workspace = list.find((wp) => wp.url === history.location.pathname.split('/')[2]);
      if (workspace) {
        setWorkspace(workspace);
      }
    }
  }, [list, history.location]);

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
