export const getUrlParameter = (name: string): string | null => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
};

export const setUrlParameter = (name: string, value: string): void => {
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set(name, value);
    window.history.replaceState({}, '', `${window.location.pathname}?${urlParams}`);
};

export const removeUrlParameter = (name: string): void => {
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.delete(name);
    window.history.replaceState({}, '', `${window.location.pathname}?${urlParams}`);
};

export const getAllUrlParameters = (): Record<string, string> => {
    const urlParams = new URLSearchParams(window.location.search);
    const params: Record<string, string> = {};
    urlParams.forEach((value, key) => {
        params[key] = value;
    });
    return params;
};