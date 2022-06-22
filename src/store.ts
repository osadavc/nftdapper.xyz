import { Chain, SmartContract, User } from "@prisma/client";
import create from "zustand";

interface Project {
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
  openedProject: Project | null;
}

const useStore = create<Store>((set, get) => ({
  projects: [],
  addProject: (project) =>
    set(() => ({ projects: [...get().projects, project] })),
  openedProject: null,
}));

export default useStore;
