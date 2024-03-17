import { useState, useEffect, useCallback  } from "react";

const API_BASE_URL = "https://localhost:7299/api";

export function useFetch (endpoint, {immediate}, method = "GET", body = null) {

    const [ data, setData ] = useState(null);
    const [ loading, setLoading ] = useState(true);
    const [ error, setError ] = useState(null);

    const executeFetch = useCallback(async (dataToSend) => {
        setData(null);
        setLoading(true);
        setError(null);

        const requestOptions = {
            method: method,
            headers: { "Content-Type": "application/json" }
        };

        if (method !== "GET") {
            console.log(dataToSend);
            requestOptions.body = JSON.stringify(dataToSend);
        }

        fetch(`${API_BASE_URL}/${endpoint}`, requestOptions)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Ha ocurrido un error');
                }
                return response.json();
            })
            .then((data) => {
                
                console.log("UseFetch:data: " + data)
                setData(data)
            })
            .catch((error) => {
                console.error('Error al realizar la solicitud POST:', error);
                setError(error);
            })
            .finally(() => setLoading(false));

    }, [endpoint, method])

    useEffect(() => {
        if (immediate) {
            executeFetch()
        }
    }, [executeFetch, immediate]);

    return { data, loading, error, executeFetch };
    
}