import React, { useEffect } from 'react';
import { handleOsuSiteRedirect, redirectToAuthorize } from "@/utils/utils";
import { useRouter } from "next/router";
import queryString from "query-string";
import LoadingSpinner from '@/components/LoadingSpinner';

const Authorize = () => {
    const router = useRouter();

    const authorize = async () => {
        if (localStorage.getItem('access_token') != null) {
            await router.push("/maps")
        } else {
            redirectToAuthorize()
        }
    };

    useEffect(() => {
        const { search } = window.location;
        const { code, state } = queryString.parse(search);

        if (code?.toString() != undefined && state?.toString() != undefined) {
            handleOsuSiteRedirect(state.toString(), code.toString()).then(() => {
                router.push("/maps").then(r => r)
            })
        }
        else {
            authorize().then(r => console.log(r))
        }
    }, []);

    return (
        <LoadingSpinner/>
    );
};

export default Authorize;