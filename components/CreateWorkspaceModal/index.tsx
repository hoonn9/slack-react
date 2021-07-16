import Modal from '@components/Modal';
import React, { FC, useCallback } from 'react';
import { Button, Input, Label } from '@pages/SignUp/styles';
import useInput from '@hooks/useInput';
import axios from 'axios';

interface Props {
  show: boolean;
  onCloseModal: () => void;
  onCreateWorkspace: (newWorkspace: string, newUrl: string) => Promise<void>;
}

const CreateWorkspaceModal: FC<Props> = ({ show, onCloseModal, onCreateWorkspace }) => {
  const [newWorkspace, onChangeNewWorkspace, setNewWorkpsace] = useInput('');
  const [newUrl, onChangeNewUrl, setNewUrl] = useInput('');

  const onSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!newWorkspace || !newWorkspace.trim()) return;
      if (!newUrl || !newUrl.trim()) return;

      await onCreateWorkspace(newWorkspace, newUrl);

      setNewWorkpsace('');
      setNewUrl('');
    },
    [newWorkspace, newUrl],
  );

  return (
    <Modal show={show} onCloseModal={onCloseModal}>
      <form onSubmit={onSubmit}>
        <Label id="workspace-label">
          <span>워크스페이스 이름</span>
          <Input id="workspace" value={newWorkspace} onChange={onChangeNewWorkspace} />
        </Label>
        <Label id="workspace-url-label">
          <span>워크스페이스 url</span>
          <Input id="workspace" value={newUrl} onChange={onChangeNewUrl} />
        </Label>
        <Button type="submit">생성하기</Button>
      </form>
    </Modal>
  );
};

export default CreateWorkspaceModal;
