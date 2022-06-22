import { Chain, SmartContract, User } from "@prisma/client";
import create from "zustand";

export interface Project {
  ownerId: string;
  name: string;
  chainId: Chain;
  description: string | null;
  id: string;
  smartContractId: string | null;
  owner: User;
  smartContract: SmartContract | null;
}

interface Store {
  projects: Project[];
  addProject: (project: Project) => void;
  replaceProject: (project: Project) => void;
  openedProject: Project | null;
}

const useStore = create<Store>((set, get) => ({
  projects: [],
  addProject: (project) =>
    set(() => ({ projects: [...get().projects, project] })),
  openedProject: null,
  replaceProject: (project) => set(() => ({ openedProject: project })),
}));

export default useStore;
