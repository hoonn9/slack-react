export type IUser = {
  id: number;
  nickname: string;
  email: string;
  Workspaces: IWorkspace[];
};

export type IWorkspace = {
  id: number;
  name: string;
  url: string;
  OwnerId: number;
};
