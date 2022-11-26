import React, {useState, useEffect} from 'react';
import StreamingTable from './StreamingTable';
import {useQuery} from "react-query";
import {DataTableSkeleton, Button, Pagination} from 'carbon-components-react';

const tableHeaders = [
    {
        key: 'createdAt',
        header: 'Tweeted On',
        minWidth: 200,
        maxWidth: 200,
        width: 2000,
    },
    {
        key: 'user',
        header: 'Username',
        minWidth: 150,
        maxWidth: 150,
        width: 150,
    },
    {
        key: 'text',
        header: 'Tweet',
        minWidth: 1000,
        maxWidth: 1000,
        width: 1000,
    },
    {
        key: 'description',
        header: 'Details',
        minWidth: 1000,
        maxWidth: 1000,
        width: 1000,
    },
];


function fetchEvents() {
    return fetch(`http://localhost:3001/events`).then(res => res.json())
}

function Streams() {

    const [rowItems, setRowItems] = useState([]);
    const [refetchInterval, setRefetchInterval] = React.useState(1000);
    const [buttonText, setButtonText] = useState('Pause');
    const [firstRowIndex, setFirstRowIndex] = useState(0);
    const [currentPageSize, setCurrentPageSize] = useState(10);

    const {data, error, isLoading} = useQuery(['events'], fetchEvents,
        {
            refetchInterval: refetchInterval,
            keepPreviousData: true,
            enabled: refetchInterval !== 0,
            refetchIntervalInBackground: true
        });

    function pause() {
        if (refetchInterval === 0) {
            setRefetchInterval(1000);
            setButtonText('Pause');
        } else {
            setRefetchInterval(0);
            setButtonText('Resume');
        }
    }

    useEffect(() => {
        // console.log(JSON.stringify(status))
        if (!isLoading && JSON.stringify(data) !== '[]') {
            setRowItems(
                data.reverse().map((node, key) => {
                    return {
                        id: key.toString(),
                        createdAt: new Date(node.data.created_at).toLocaleString(),
                        description: JSON.stringify(node),
                        user: node.includes.users[0].username,
                        text: node.data.text,
                    };
                }),
            );
        }
    }, [data]);

    if (isLoading) // || JSON.stringify(data)==='[]')
        return (
            <>
                <Button className="btn-center" onClick={() => pause()}>{buttonText}</Button>
                <DataTableSkeleton
                    columnCount={tableHeaders.length}
                    rowCount={10}
                    headers={tableHeaders.slice(0, 3)}
                />

            </>
        );

    if (error) {
        return <p>Waiting for stream ...</p>;
    }

    return (
        <>
            <Button className="btn-center" onClick={() => pause()}>{buttonText}</Button>
            <StreamingTable
                tableHeaders={tableHeaders.slice(0, 3)}
                tableRows={rowItems.slice(firstRowIndex, firstRowIndex + currentPageSize)}
            />
            <Pagination
                totalItems={rowItems.length}
                backwardText="Previous page"
                forwardText="Next page"
                pageSize={currentPageSize}
                pageSizes={[10, 50, 100]}
                itemsPerPageText="Events per page"
                onChange={({page, pageSize}) => {
                    if (pageSize !== currentPageSize) {
                        setCurrentPageSize(pageSize);
                    }
                    setFirstRowIndex(pageSize * (page - 1));
                }}
            />
        </>
    )
}


function StreamingPage() {
    return (
        <div className="stream-page">
            <div className="stream-page__r1">
                <Streams/>
            </div>
        </div>
    );
}


export default StreamingPage;