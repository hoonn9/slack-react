import { IWorkspace } from '@typings/api';
import React, { createContext, Dispatch, FC, SetStateAction, useContext, useState } from 'react';

interface ContextProps {
  workspace?: IWorkspace;
  setWorkspace: Dispatch<SetStateAction<IWorkspace | undefined>>;
}

const Context = createContext<ContextProps | undefined>(undefined);

interface Props {}

export const WorkspaceContextProvider: FC<Props> = ({ children }) => {
  const [workspace, setWorkspace] = useState<IWorkspace>();
  return (
    <Context.Provider
      value={{
        workspace,
        setWorkspace,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useWorkspace = () => {
  const state = useContext(Context);
  if (!state) {
    throw new Error('workspace is not provided.');
  }
  return state;
};
