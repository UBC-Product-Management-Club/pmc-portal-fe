import { useEnvironment } from "../../hooks/useEnvironment";

interface ProdOnlyProps {
  children: React.ReactNode;
}

export const ProdRenderer = ({ children} : ProdOnlyProps) => {
  const { isProd } = useEnvironment();

  return isProd ? children : null;
};