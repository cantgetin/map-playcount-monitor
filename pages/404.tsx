import { useEffect } from 'react';
import { useRouter } from 'next/router';

const AuthorizePage = () => {
    const router = useRouter();

    useEffect(() => {
        // Redirect to the /authorize page
        router.replace('/authorize');
    }, []);

    return null;
};

export default AuthorizePage;