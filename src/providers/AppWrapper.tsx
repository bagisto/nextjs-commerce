import {MainProvider} from "./MainProvider";

interface AppWrapperProps {
  children: React.ReactNode;
  className?: string;
}

 function AppWrapper({ children }: AppWrapperProps) {
  return (
          <MainProvider>
            {children}
          </MainProvider>
  );
}

export { AppWrapper };
