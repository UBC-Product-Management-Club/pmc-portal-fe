import { useEnvironment } from "../../hooks/useEnvironment";

interface ProdOnlyProps {
  children: React.ReactNode;
}

export const ProdRenderer = ({ children} : ProdOnlyProps) => {
  const { isDev } = useEnvironment();

  return isDev ? null : children;
};