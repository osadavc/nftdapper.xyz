import { Project } from "@prisma/client";
import create from "zustand";

interface Store {
  projects: Project[];
  addProject: (project: Project) => void;
}

const useStore = create<Store>((set, get) => ({
  projects: [],
  addProject: (project) =>
    set(() => ({ projects: [...get().projects, project] })),
}));

export default useStore;
