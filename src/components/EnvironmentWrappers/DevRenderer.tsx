import { useEnvironment } from '../../hooks/useEnvironment';

interface DevOnlyProps {
    children: React.ReactNode;
}

export const DevRenderer = ({ children }: DevOnlyProps) => {
    const { isProd } = useEnvironment();

    return isProd ? null : children;
};
