import useInput from '@hooks/useInput';
import {
  AddButton,
  Channels,
  Chats,
  Header,
  LogOutButton,
  MenuScroll,
  ProfileImg,
  ProfileModal,
  RightMenu,
  WorkspaceButton,
  WorkspaceModal,
  WorkspaceName,
  Workspaces,
  WorkspaceWrapper,
} from '@layouts/Workspace/styles';
import loadable from '@loadable/component';
import { Button, Input, Label } from '@pages/SignUp/styles';
import { IUser, IWorkspace } from '@typings/api';
import fetcher from '@utils/fetcher';
import axios from 'axios';
import React, { VFC, useCallback, useState, useEffect } from 'react';
import { Redirect, useParams } from 'react-router';
import { Link, Route, Switch } from 'react-router-dom';
import useSWR from 'swr';
import gravatar from 'gravatar';
import Menu from '@components/Menu';
import WorkspaceList from '@components/WorkspaceList';

const Workspace: VFC = () => {
  const { data: userData, error, revalidate, mutate } = useSWR<IUser | false>('/api/users', fetcher, {
    dedupingInterval: 2000, // 2초
  });
  const { data: workspacesData, revalidate: workspaceRevalidate } = useSWR<IWorkspace[] | false>(
    '/api/workspaces',
    fetcher,
    {
      dedupingInterval: 2000, // 2초
    },
  );
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showWorkspaceModal, setShowWorkspaceModal] = useState(false);

  const onLogout = useCallback(() => {
    axios
      .post('/api/users/logout', null, {
        withCredentials: true,
      })
      .then(() => {
        mutate(false, false);
      });
  }, []);

  const onCloseUserProfile = useCallback((e) => {
    e.stopPropagation();
    setShowUserMenu(false);
  }, []);

  const onClickUserProfile = useCallback(() => {
    setShowUserMenu((prev) => !prev);
  }, []);

  const onCloseModal = useCallback(() => {
    // setShowCreateWorkspaceModal(false);
    // setShowCreateChannelModal(false);
    // setShowInviteWorkspaceModal(false);
    // setShowInviteChannelModal(false);
  }, []);

  const toggleWorkspaceModal = useCallback(() => {}, []);
  const onClickInviteWorkspace = useCallback(() => {}, []);
  const onClickAddChannel = useCallback(() => {}, []);

  console.log(userData);
  if (!userData) {
    return <Redirect to="/login" />;
  }

  return (
    <div>
      <Header>
        <RightMenu>
          <span onClick={onClickUserProfile}>
            <ProfileImg src={gravatar.url(userData.email, { s: '28px', d: 'retro' })} alt={userData.nickname} />
            {showUserMenu && (
              <Menu style={{ right: 0, top: 38 }} show={showUserMenu} onCloseModal={onCloseUserProfile}>
                <ProfileModal>
                  <img src={gravatar.url(userData.nickname, { s: '36px', d: 'retro' })} alt={userData.nickname} />
                  <div>
                    <span id="profile-name">{userData.nickname}</span>
                    <span id="profile-active">Active</span>
                  </div>
                </ProfileModal>
                <LogOutButton onClick={onLogout}>로그아웃</LogOutButton>
              </Menu>
            )}
          </span>
        </RightMenu>
      </Header>
      <WorkspaceWrapper>
        <WorkspaceList list={workspacesData || []} revalidate={workspaceRevalidate} />
        <Channels>
          <WorkspaceName onClick={toggleWorkspaceModal}>Sleact</WorkspaceName>
          <MenuScroll>
            <Menu show={showWorkspaceModal} onCloseModal={toggleWorkspaceModal} style={{ top: 95, left: 80 }}>
              <WorkspaceModal>
                <h2>Slack</h2>
                <button onClick={onClickInviteWorkspace}>워크스페이스에 사용자 초대</button>
                <button onClick={onClickAddChannel}>채널 만들기</button>
                <button onClick={onLogout}>로그아웃</button>
              </WorkspaceModal>
            </Menu>
            {/* <ChannelList />
            <DMList /> */}
          </MenuScroll>
        </Channels>
        {/* <Chats>
          <Switch>
            <Route path="/workspace/:workspace/channel/:channel" component={Channel} />
            <Route path="/workspace/:workspace/dm/:id" component={DirectMessage} />
          </Switch>
        </Chats> */}
      </WorkspaceWrapper>
    </div>
  );
};

export default Workspace;
