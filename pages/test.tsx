import React, {useEffect} from 'react';
import queryString from 'query-string';

function TestPage() {

    useEffect(() => {
        const { search } = window.location;
        const { code, state } = queryString.parse(search);

        console.log(code)
        console.log(state)
    }, [])

    return (
        <div>
            <h1>Query Params:</h1>
        </div>
    );
}

export default TestPage;