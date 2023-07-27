import { useEffect } from 'react';
import { useRouter } from 'next/router';

const AuthorizePage = () => {
    const router = useRouter();

    useEffect(() => {
        // Redirect to the /authorize page
        router.replace('/authorize');
    }, []);

    return null; // Return null as we don't need to render anything for the custom 404 page
};

export default AuthorizePage;