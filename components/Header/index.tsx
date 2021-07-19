import Menu from '@components/Menu';
import React, { useCallback, useState, VFC } from 'react';
import useSWR from 'swr';
import gravatar from 'gravatar';

import { Header as HeaderStyle, LogOutButton, ProfileImg, ProfileModal, RightMenu } from './styles';
import { IUser } from '@typings/api';
import fetcher from '@utils/fetcher';
interface Props {
  onLogout: () => Promise<void>;
}

const Header: VFC<Props> = ({ onLogout }) => {
  const { data: userData } = useSWR<IUser | false>('/api/users', fetcher, {
    dedupingInterval: 2000,
  });

  const [showUserMenu, setShowUserMenu] = useState(false);

  const onCloseUserProfile = useCallback((e) => {
    e.stopPropagation();
    setShowUserMenu(false);
  }, []);

  const onClickUserProfile = useCallback(() => {
    setShowUserMenu((prev) => !prev);
  }, []);

  if (!userData) {
    return null;
  }

  return (
    <HeaderStyle>
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
    </HeaderStyle>
  );
};

export default Header;
