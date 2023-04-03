import { useCallback, useState } from "react";


export const useHttp = () => {
    // Loading states and errors
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);


    // Server request
    const request = useCallback(async (url, method = 'GET', body = null, headers = { 'Content-Type': 'application/json' }) => {
        // Loading state management
        setLoading(loading => true)
        // The response block is placed in a try catch block to catch errors and so that the site does not break
        try {
            const response = await fetch(url, { method, body, headers });

            if (!response.ok) {
                if (response.status === 409) {
                    throw new Error("User with this phone or email already exist")
                } else {
                    throw new Error(`Could not fetch ${url}, status ${response.status}`)
                }
            }

            const data = await response.json();

            setLoading(loading => false)
            return data
        } catch (e) {
            setError(e.message)
            setLoading(loading => false)
            throw e;
        }
    }, []);
    // Error cleanup function if needed
    const clearError = useCallback(() => setError(null), [])

    return { request, loading, error, clearError }

}
export default useHttp;