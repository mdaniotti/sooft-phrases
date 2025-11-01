import {
  useState,
  useEffect,
  type ComponentType,
  type ReactElement,
} from "react";

const withLoadingState = <P extends object>(Component: ComponentType<P>) => {
  return function WithLoadingStateComponent(props: P): ReactElement {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 300);
      return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
      return (
        <div className="loading-container">
          <div className="loading-content">
            <div className="loading-spinner" />
            <div>Loading phrases...</div>
          </div>
        </div>
      );
    }

    return <Component {...props} />;
  };
};

export default withLoadingState;
