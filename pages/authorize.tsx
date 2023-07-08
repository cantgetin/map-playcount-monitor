import React, {useEffect, useState} from 'react';
import {redirectToAuthorize} from "@/helpers/redirect";
import axios from "axios";
import {useRouter} from "next/router";
import queryString from "query-string";

const Authorize = () => {
    const router = useRouter();
    const {state, code} = router.query;

    let [stateParam, setStateParam] = useState<string>('')
    let [codeParam, setCodeParam] = useState<string>('')

    const authorize = async () => {
        if (localStorage.getItem('access_token') != null) {
            await router.push("/maps")
        } else {
            redirectToAuthorize()
        }
    };

    interface RequestDataResult {
        access_token: string
        refresh_token: string
    }

    const handleOsuSiteRedirect = async () => {
        console.log('handle osu! site redirect function')
        if (state == localStorage.getItem('state')) {
            localStorage.setItem('code', code?.toString())
            console.log('set the code to local storage, now exchange code for token')

            // exchange code for authorization token
            let res = await axios.post('/api/exchange', {code: code})

            let data : RequestDataResult = res.data.result
            localStorage.setItem('access_token', JSON.stringify(data.access_token))
            localStorage.setItem('refresh_token', JSON.stringify(data.refresh_token))
            await router.push("/maps")
        }
    }

    useEffect(() => {
        const { search } = window.location;
        const { code, state } = queryString.parse(search);

        if (code?.toString() != undefined && state?.toString() != undefined) {
            setCodeParam(code?.toString())
            setStateParam(state?.toString())
            handleOsuSiteRedirect().then(r => r)
        }
        else {
            authorize().then(r => console.log(r))
        }
    }, []);

    return (
        <div>
            <h1>Authorize Page</h1>
            <p>Code: {codeParam}</p>
            <p>State: {stateParam}</p>
        </div>
    );
};

export default Authorize;