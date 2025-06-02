export function useEnvironment() {
    const env = import.meta.env.VITE_ENVIRONMENT?.toUpperCase() || 'DEV';

    return {
        isDev: env === 'DEV',
        isProd: env === 'PROD',
  };
}