'use client';

import React from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, IconButton, Checkbox, Select, MenuItem, TextField, Button,
    Typography, Pagination, InputAdornment, Grid, CircularProgress
} from '@mui/material';
import { Edit, Info, Add, Search, Refresh } from '@mui/icons-material';
import Link from 'next/link';
import { IManualTableProps, IManual } from '@/interfaces';
import { ManualStatus } from '@/enum';
import { useManualTable } from './useManualTable';
import { formatThaiDate } from '@/utils/formatDate';

interface Props extends IManualTableProps {
    apiUrl?: string;
}

export default function ManualTablePage({ columns, data, apiUrl }: Props) {
    const {
        page, count, paginatedData,
        searchQuery, handleSearchChange,
        systemFilter, handleSystemChange, systemOptions,
        statusFilter, handleStatusChange,
        handleResetFilters,
        handlePageChange, handleSelectPage,
        isLoading
    } = useManualTable(apiUrl, data as IManual[]);

    return (
        <Grid container spacing={3} sx={{ p: { xs: 2, md: 3 }, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
            <Grid size={12}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#4a148c' }}>
                    จัดการคู่มือการใช้งาน
                </Typography>
            </Grid>

            {/* Filter Section */}
            <Grid size={12} sx={{ mt: 1 }}>
                <Grid container spacing={2} >
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            placeholder="ค้นหาชื่อคู่มือ"
                            size="small"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            sx={{ bgcolor: 'white', '& .MuiOutlinedInput-root': { borderRadius: 30 } }}
                            InputProps={{ startAdornment: <InputAdornment position="start"><Search /></InputAdornment> }}
                        />
                    </Grid>

                    {/* Filter: ระบบ */}
                    <Grid size={{ xs: 6, md: 2 }}>
                        <Select
                            fullWidth
                            size="small"
                            displayEmpty
                            value={systemFilter}
                            onChange={handleSystemChange}
                            sx={{ bgcolor: 'white' }}
                        >
                            <MenuItem value="">ระบบทั้งหมด</MenuItem>
                            {systemOptions.map((sys, index) => (
                                <MenuItem key={index} value={sys}>{sys}</MenuItem>
                            ))}
                        </Select>
                    </Grid>

                    {/* Filter: สถานะ */}
                    <Grid size={{ xs: 6, md: 2 }}>
                        <Select
                            fullWidth
                            size="small"
                            displayEmpty
                            value={statusFilter}
                            onChange={handleStatusChange}
                            sx={{ bgcolor: 'white' }}
                        >
                            <MenuItem value="">สถานะทั้งหมด</MenuItem>
                            <MenuItem value={ManualStatus.ACTIVE}>{ManualStatus.ACTIVE}</MenuItem>
                            <MenuItem value={ManualStatus.INACTIVE}>{ManualStatus.INACTIVE}</MenuItem>
                        </Select>
                    </Grid>

                    {/* Button: ล้างค่าตัวกรอง */}
                    <Grid size="auto">
                        <IconButton
                            onClick={handleResetFilters}
                            sx={{ border: '1px solid #ccc', borderRadius: 1, bgcolor: 'white' }}
                        >
                            <Refresh />
                        </IconButton>
                    </Grid>

                    <Grid size="auto">
                        <Button variant="contained" sx={{ bgcolor: '#4a148c' }}>
                            <Search />
                        </Button>
                    </Grid>
                </Grid>
            </Grid>

            {/* Table Section */}
            <Grid size={12}>
                <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 'none' }}>
                    <Table sx={{ minWidth: 650 }}>
                        <TableHead sx={{ bgcolor: '#eeeeee' }}>
                            <TableRow>
                                <TableCell align="center" sx={{ width: 50 }}>
                                    <Link href="/manual/manage" passHref>
                                        <IconButton size="small" sx={{ bgcolor: '#4a148c', color: 'white' }}>
                                            <Add fontSize="small" />
                                        </IconButton>
                                    </Link>
                                </TableCell>
                                <TableCell align="center" sx={{ width: 60 }}>
                                    แก้ไข
                                </TableCell>
                                <TableCell align="center" sx={{ width: 60 }}>ที่</TableCell>
                                {columns?.map((col) => (
                                    <TableCell key={col.id} align={col.id === 'status' ? 'center' : 'left'}>
                                        {col.label}
                                    </TableCell>
                                ))}
                                <TableCell align="center" sx={{ width: 60 }}></TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={columns?.length ? columns.length + 4 : 8} align="center" sx={{ py: 10 }}>
                                        <CircularProgress sx={{ color: '#4a148c' }} />
                                    </TableCell>
                                </TableRow>
                            ) : paginatedData.length > 0 ? (
                                paginatedData.map((row, index) => (
                                    <TableRow key={row.id || index} hover>
                                        <TableCell align="center"><Checkbox size="small" /></TableCell>
                                        <TableCell align="center">
                                            <Link href={`/manual/manage/${row.id}`} passHref>
                                                <IconButton size="small" sx={{ color: 'orange' }}>
                                                    <Edit fontSize="inherit" />
                                                </IconButton>
                                            </Link>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Typography variant="body2">{(page - 1) * 8 + (index + 1)}</Typography>
                                        </TableCell>

                                        <TableCell sx={{ maxWidth: 300 }}>{row.title}</TableCell>
                                        <TableCell sx={{ color: 'text.secondary' }}>{row.system}</TableCell>
                                        <TableCell align="center">
                                            <Typography sx={{ color: row.status === ManualStatus.ACTIVE ? 'green' : 'red', fontWeight: 'medium' }}>
                                                {row.status}
                                            </Typography>
                                        </TableCell>
                                        <TableCell sx={{ color: 'gray' }}>{formatThaiDate(row.updatedAt)}</TableCell>
                                        <TableCell align="center">
                                            <IconButton size="small" sx={{ bgcolor: '#4a148c', color: 'white' }}>
                                                <Info fontSize="inherit" />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns?.length ? columns.length + 4 : 8} align="center" sx={{ py: 5 }}>
                                        <Typography color="text.secondary">ไม่พบข้อมูลที่ค้นหา</Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>

                    {/* Pagination Section */}
                    {paginatedData.length > 0 && !isLoading && (
                        <Grid container spacing={2} sx={{ p: 2, borderTop: '1px solid #eee' }} justifyContent="flex-end" alignItems="center">
                            <Grid size="auto">
                                <Pagination count={count} page={page} onChange={handlePageChange} shape="rounded" color="primary" size="small" />
                            </Grid>
                            <Grid size="auto">
                                <Grid container spacing={1} alignItems="center">
                                    <Grid size="auto">
                                        <Typography variant="body2" color="text.secondary">ไปหน้า</Typography>
                                    </Grid>
                                    <Grid size="auto">
                                        <Select size="small" value={page} onChange={handleSelectPage} sx={{ height: 30, minWidth: 60 }}>
                                            {[...Array(count)].map((_, i) => (
                                                <MenuItem key={i + 1} value={i + 1}>{i + 1}</MenuItem>
                                            ))}
                                        </Select>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    )}
                </TableContainer>
            </Grid>
        </Grid>
    );
}