import React, { useCallback, useEffect, useRef, useState } from 'react';
import ChatBox from '@components/ChatBox';
import ChatList from '@components/ChatList';
import useInput from '@hooks/useInput';
import useSocket from '@hooks/useSocket';
import { Container, Header, DragOver } from '@pages/DirectMessage/styles';
import { IDM } from '@typings/api.d';
import fetcher from '@utils/fetcher';
import makeSection from '@utils/makeSection';
import axios from 'axios';
import gravatar from 'gravatar';
import Scrollbars from 'react-custom-scrollbars';
import { useParams } from 'react-router';
import useSWR, { useSWRInfinite } from 'swr';

const DirectMessage = () => {
  const { workspace, id } = useParams<{ workspace: string; id: string }>();
  const { data: userData } = useSWR(`/api/workspaces/${workspace}/users/${id}`, fetcher);
  const { data: myData } = useSWR('/api/users', fetcher);
  const [chat, onChangeChat, setChat] = useInput('');
  const { data: chatData, mutate: mutateChat, revalidate, setSize } = useSWRInfinite<IDM[]>(
    (index) =>
      workspace !== 'slack' ? `/api/workspaces/${workspace}/dms/${id}/chats?perPage=20&page=${index + 1}` : null,
    fetcher,
  );
  const [socket] = useSocket(workspace);
  const isEmpty = chatData?.[0]?.length === 0;
  const isReachingEnd = isEmpty || (chatData && chatData[chatData.length - 1]?.length < 20) || false;
  const scrollbarRef = useRef<Scrollbars>(null);
  const [dragOver, setDragOver] = useState(false);

  const onSubmitForm = useCallback(
    async (event) => {
      event.preventDefault();

      if (!(chat?.trim() && chatData)) {
        return;
      }
      try {
        await mutateChat((prevChatData) => {
          prevChatData?.[0].unshift({
            id: (chatData[0][0]?.id || 0) + 1,
            content: chat,
            SenderId: myData.id,
            Sender: myData,
            ReceiverId: userData.id,
            Receiver: userData,
            createdAt: new Date(),
          });
          return prevChatData;
        }, false);
        setChat('');
        scrollbarRef.current?.scrollToBottom();
        await axios.post(`/api/workspaces/${workspace}/dms/${id}/chats`, {
          content: chat,
        });
        revalidate();
      } catch (error) {
        console.error(error);
      }
    },
    [chat, chatData, myData, userData, workspace, id],
  );

  const onMessage = useCallback(async (data: IDM) => {
    if (data.SenderId === Number(id) && myData.id !== Number(id)) {
      await mutateChat((chatData) => {
        chatData?.[0].unshift(data);
        return chatData;
      }, false);

      if (scrollbarRef.current) {
        if (
          scrollbarRef.current.getScrollHeight() <
          scrollbarRef.current.getClientHeight() + scrollbarRef.current.getScrollTop() + 150
        ) {
          console.log('scrollToBottom!', scrollbarRef.current?.getValues());
          setTimeout(() => {
            scrollbarRef.current?.scrollToBottom();
          }, 50);
        }
      }
    }
  }, []);

  useEffect(() => {
    socket?.on('dm', onMessage);
    return () => {
      socket?.off('dm', onMessage);
    };
  }, [socket, onMessage]);

  useEffect(() => {
    if (chatData?.length === 1) {
      setTimeout(() => {
        scrollbarRef.current?.scrollToBottom();
      }, 100);
    }
  }, [chatData]);

  const onDrop = useCallback(
    async (event) => {
      event.preventDefault();
      console.log(event);
      const formData = new FormData();
      if (event.dataTransfer.items) {
        // Use DataTransferItemList interface to access the file(s)
        for (let i = 0; i < event.dataTransfer.items.length; i++) {
          // If dropped items aren't files, reject them
          if (event.dataTransfer.items[i].kind === 'file') {
            const file = event.dataTransfer.items[i].getAsFile();
            console.log('... file[' + i + '].name = ' + file.name);
            formData.append('image', file);
          }
        }
      } else {
        // Use DataTransfer interface to access the file(s)
        for (let i = 0; i < event.dataTransfer.files.length; i++) {
          console.log('... file[' + i + '].name = ' + event.dataTransfer.files[i].name);
          formData.append('image', event.dataTransfer.files[i]);
        }
      }
      try {
        await axios.post(`/api/workspaces/${workspace}/dms/${id}/images`, formData);
        setDragOver(false);
        revalidate();
      } catch (error) {
        console.log(error);
      }
    },
    [revalidate, workspace, id],
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    console.log('onDragOver');
    setDragOver(true);
  }, []);

  const onDragLeave = useCallback((event) => {
    event.preventDefault();
    console.log('onDragLeave');
    setDragOver(false);
  }, []);

  if (!userData || !myData) {
    return null;
  }

  const chatSections = makeSection(chatData ? chatData.flat().reverse() : []);

  return (
    <Container onDrop={onDrop} onDragOver={onDragOver} onDragLeave={onDragLeave}>
      <Header>
        <img src={gravatar.url(userData.email, { s: '24px', d: 'retro' })} alt={userData.nickname} />
        <span>{userData.nickname}</span>
      </Header>
      <ChatList chatSections={chatSections} ref={scrollbarRef} setSize={setSize} isReachingEnd={isReachingEnd} />
      <ChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitForm} />
      {dragOver && <DragOver>업로드</DragOver>}
    </Container>
  );
};

export default DirectMessage;
