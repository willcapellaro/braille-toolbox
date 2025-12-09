import { useEffect, useState } from 'react';

interface UrlParams {
  [key: string]: string;
}

const useUrlParams = () => {
    const [params, setParams] = useState(new URLSearchParams(window.location.search));

    const updateUrlParams = (newParams: UrlParams) => {
        const updatedParams = new URLSearchParams(params);
        Object.keys(newParams).forEach(key => {
            if (newParams[key] === null || newParams[key] === undefined) {
                updatedParams.delete(key);
            } else {
                updatedParams.set(key, newParams[key]);
            }
        });
        setParams(updatedParams);
        window.history.replaceState({}, '', `?${updatedParams.toString()}`);
    };

    const getParam = (key: string): string | null => {
        return params.get(key);
    };

    const getAllParams = (): UrlParams => {
        const result: UrlParams = {};
        params.forEach((value, key) => {
            result[key] = value;
        });
        return result;
    };

    useEffect(() => {
        const handlePopState = () => {
            setParams(new URLSearchParams(window.location.search));
        };

        window.addEventListener('popstate', handlePopState);
        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, []);

    return { 
        params, 
        updateUrlParams, 
        getParam, 
        getAllParams 
    };
};

export default useUrlParams;