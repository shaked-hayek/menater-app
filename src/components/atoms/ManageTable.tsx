import { ReactNode } from 'react';
import {
    Table,
    TableBody,
    TableHead,
    TableRow,
    Paper,
    TableContainer,
} from '@mui/material';

import { tableBgColor } from 'style/colors';


interface ManageTableProps {
    headerFields: ReactNode;
    rows: ReactNode;
    maxHeight?: string;
}

const ManageTable = ({ headerFields, rows, maxHeight='445px' } : ManageTableProps) => {
    return (
        <>
            <Paper
                elevation={2}
                sx={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    bgcolor: tableBgColor,
                }}
            >
                <TableContainer sx={{ maxHeight }}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                {headerFields}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </>
    );
};

export default ManageTable;