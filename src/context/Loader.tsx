import React from "react";

export type GlobalLoaderContext = {
    isLoading: boolean
    loaderText: string
    changeLoadingStatus:(c: boolean) => void
    changeLoaderText:(c: string) => void
  }

const LoaderContextProvider = React.createContext<GlobalLoaderContext>({
    isLoading: false,
    loaderText: "",
    changeLoadingStatus: () => {},
    changeLoaderText: () => {}
});
LoaderContextProvider.displayName = "Loader Context Provider";
export default LoaderContextProvider;