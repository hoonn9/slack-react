import { Chats, WorkspaceWrapper } from '@layouts/Workspace/styles';
import { IUser, IWorkspace } from '@typings/api';
import fetcher from '@utils/fetcher';
import axios from 'axios';
import React, { VFC, useCallback } from 'react';
import { Redirect, Route, Switch, useParams } from 'react-router';
import useSWR from 'swr';
import WorkspaceList from '@components/WorkspaceList';
import Channel from '@pages/Channel';
import Header from '@components/Header';
import { toast } from 'react-toastify';
import WorkspaceChannels from '@components/WorkspaceChannels';
import DirectMessage from '@pages/DirectMessage';

const Workspace: VFC = () => {
  const { workspace } = useParams<{ workspace?: string }>();

  const { data: userData, mutate } = useSWR<IUser | false>('/api/users', fetcher, {
    dedupingInterval: 2000,
  });
  const { data: workspacesData, revalidate: workspaceRevalidate } = useSWR<IWorkspace[] | false>(
    '/api/workspaces',
    fetcher,
    {
      dedupingInterval: 2000,
    },
  );

  const onLogout = useCallback(async () => {
    try {
      await axios.post('/api/users/logout', null, {
        withCredentials: true,
      });
      mutate(false, false);
    } catch (error) {
      console.dir(error);
      toast.error(error.response?.data, { position: 'bottom-center' });
    }
  }, []);

  if (!userData) {
    return <Redirect to="/login" />;
  }

  return (
    <div>
      <Header onLogout={onLogout} />
      <WorkspaceWrapper>
        <WorkspaceList list={workspacesData || []} revalidate={workspaceRevalidate} />
        <WorkspaceChannels onLogout={onLogout} />
        {workspace && workspace !== 'slack' && (
          <Chats>
            <Switch>
              <Route path="/workspace/:workspace/channel/:channel" component={Channel} />
              <Route path="/workspace/:workspace/dm/:id" component={DirectMessage} />
            </Switch>
          </Chats>
        )}
      </WorkspaceWrapper>
    </div>
  );
};

export default Workspace;
