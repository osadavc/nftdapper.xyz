import { Project as DBProject, SmartContractFeatures } from "@prisma/client";
import create from "zustand";

export interface Project extends DBProject {
  smartContract: {
    abi: string | null;
    saleStartingTime: string | null;
    mintFee: string | null;
    maxMintAmount: string | null;
    contractAddress: string | null;
    features: SmartContractFeatures;
  } | null;
}

interface Store {
  projects: Project[];
  addProject: (project: Project) => void;
  replaceProject: (project: Project) => void;
  openedProject: Project | null;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const useStore = create<Store>((set, get) => ({
  projects: [],
  addProject: (project) =>
    set(() => ({ projects: [...get().projects, project] })),
  openedProject: null,
  replaceProject: (project) => set(() => ({ openedProject: project })),
  loading: false,
  setLoading: (loading) => set(() => ({ loading })),
}));

export default useStore;
