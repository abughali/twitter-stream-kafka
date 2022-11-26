import React from 'react';
import {
    DataTable,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableExpandHeader,
    TableHeader,
    TableBody,
    TableExpandRow,
    TableCell,
    TableExpandedRow,
    TableToolbar,
    TableToolbarSearch,
    TableToolbarContent
} from '@carbon/react';

function urlify(text) {
    let urlRegex = /(https?:\/\/\S+)/g;
    return text.replace(urlRegex, function (url) {
        return '<a target="_blank" rel="noopener noreferrer" href="' + url + '">' + url + '</a>';
    })
}


const StreamingTable = ({tableRows, tableHeaders}) => {

    const getRowDescription = (rowId) => {
        const row = tableRows.find(({id}) => id === rowId);
        return row ? row.description : '';
    };

    return (
        <DataTable
            rows={tableRows}
            headers={tableHeaders}
            isSortable={true}
            render={({
                         rows,
                         headers,
                         getHeaderProps,
                         getRowProps,
                         getTableProps,
                         onInputChange,
                         getBatchActionProps,
                     }) => (
                <TableContainer
                    title="Twitter Streams"
                    description="Random (re)tweets tagged Elon Musk"
                >
                    <TableToolbar>
                        <TableToolbarContent>
                            <TableToolbarSearch
                                tabIndex={getBatchActionProps().shouldShowBatchActions ? -1 : 0}
                                onChange={onInputChange}
                            />
                        </TableToolbarContent>
                    </TableToolbar>

                    <Table {...getTableProps()}>
                        <TableHead>
                            <TableRow>
                                <TableExpandHeader/>
                                {headers.map((header) => (
                                    <TableHeader    {...getHeaderProps({
                                        header,
                                        style: {
                                            minWidth: header.minWidth,
                                            width: header.width,
                                            maxWidth: header.maxWidth
                                        },
                                    })}>
                                        {header.header}
                                    </TableHeader>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row) => (
                                <React.Fragment key={row.id}>
                                    <TableExpandRow {...getRowProps({row})}>
                                        {row.cells.map((cell) => (
                                            <TableCell key={cell.id}>
                                                {
                                                    <span
                                                        dangerouslySetInnerHTML={{__html: cell.info.header === "text" ? urlify(cell.value) : cell.value}}></span>

                                                }
                                            </TableCell>
                                        ))}
                                    </TableExpandRow>
                                    <TableExpandedRow colSpan={headers.length + 1}>
                                        {getRowDescription(row.id)}
                                    </TableExpandedRow>
                                </React.Fragment>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        />
    );
};

export default StreamingTable;