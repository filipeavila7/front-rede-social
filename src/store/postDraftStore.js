import { create } from "zustand";

const usePostDraftStore = create((set) => ({
    hasUnsavedChanges: false,
    setHasUnsavedChanges: (value) => set({ hasUnsavedChanges: value }),
}))

export default usePostDraftStore
