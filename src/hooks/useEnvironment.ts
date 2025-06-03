export function useEnvironment() {
    const env = import.meta.env.VITE_ENVIRONMENT?.toUpperCase();

    return {
        isDev: env === 'DEV',
  };
}