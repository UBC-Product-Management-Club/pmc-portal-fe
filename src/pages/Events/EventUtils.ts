/**
 * Loads an event component. Should only be used in the Events Directory
 * @param {string} path - The path of the component, relative to Events directory.
 */ const loadComponent = async (path: string) => {
    return import(path);
};

export { loadComponent };
