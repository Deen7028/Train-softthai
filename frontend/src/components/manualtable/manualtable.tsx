'use client';

import React from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, IconButton, Checkbox, Select, MenuItem, TextField, Button,
    Typography, Pagination, InputAdornment, Grid, CircularProgress,
    FormControl
} from '@mui/material';
import { Edit, Info, Add, Search, Refresh } from '@mui/icons-material';
import Link from 'next/link';
import { IManualTableProps, IManual } from '@/src/interfaces';
import { ManualStatus } from '@/src/enum';
import { useManualTable } from './useManualTable';
import { formatThaiDate } from '@/src/utils/formatDate';

export default function ManualTablePage({ columns, data, apiUrl }: IManualTableProps & { apiUrl?: string }) {
    const {
        page, count, paginatedData,
        searchQuery, handleSearchChange,
        systemFilter, handleSystemChange, systemOptions,
        statusFilter, handleStatusChange,
        handleResetFilters,
        handlePageChange, handleSelectPage,
        isLoading,
        handleOrderChange,
        totalItems
    } = useManualTable(apiUrl, data as IManual[]);

    return (
        <Grid container spacing={3} sx={{ p: { xs: 2, md: 3 }, bgcolor: 'white', minHeight: '100vh' }}>
            <Grid size={12}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#4a148c' }}>
                    จัดการคู่มือการใช้งาน
                </Typography>
            </Grid>

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
                    <Table >
                        <TableHead sx={{ bgcolor: '#eeeeee' }}>
                            <TableRow>
                                <TableCell align="center" sx={{ width: 50 }}>
                                    <Link href="manual/manage" >
                                        <IconButton size="small" sx={{ bgcolor: '#4a148c', color: 'white' }}>
                                            <Add fontSize="small" />
                                        </IconButton>
                                    </Link>
                                </TableCell>
                                <TableCell align="center" sx={{ width: 60 }}>แก้ไข</TableCell>
                                <TableCell align="center" sx={{ width: 80 }}>ลำดับ</TableCell>
                                {columns?.map((col) => (
                                    <TableCell key={col.id} align={col.id === 'status' ? 'center' : 'center'} sx={col.id === 'title' ? { maxWidth: 300 } : { color: 'text.secondary' }}>
                                        {col.label}
                                    </TableCell>
                                ))}
                                <TableCell align="center" sx={{ width: 60 }}></TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={12} align="center" sx={{ py: 10 }}>
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

                                        {/* แก้ไขส่วนการดึงตัวเลขลำดับ */}
                                        <TableCell align="center">
                                            <FormControl size="small" sx={{ minWidth: 60 }}>
                                                <Select
                                                    value={row.order || (page - 1) * 8 + (index + 1)}
                                                    onChange={(e) => handleOrderChange(row.id, Number(e.target.value))}
                                                    sx={{ height: 35, fontSize: '0.875rem' }}
                                                >
                                                    {[...Array(totalItems || paginatedData.length)].map((_, i) => (
                                                        <MenuItem key={i + 1} value={i + 1}>
                                                            {i + 1}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </TableCell>

                                        <TableCell sx={{ maxWidth: 300 }}>{row.title}</TableCell>
                                        <TableCell sx={{ color: 'text.secondary' }}>{row.system}</TableCell>
                                        <TableCell align="center">
                                            <Typography sx={{
                                                color: row.status === ManualStatus.ACTIVE ? 'green' : 'red',
                                                fontWeight: 'medium'
                                            }}>
                                                {row.status === "ACTIVE" ? "ใช้งาน" : "ไม่ใช้งาน"}
                                            </Typography>
                                        </TableCell>
                                        <TableCell sx={{ color: 'gray' }}>{formatThaiDate(row.updatedAt)}
                                            <IconButton size="small" sx={{ bgcolor: '#4a148c', color: 'white', mx: 2 }}>
                                                <Info fontSize="inherit" />
                                            </IconButton>
                                        </TableCell>
                                        <TableCell sx={{ color: 'text.secondary' }}>{row.creatorName || '-'}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={10} align="center" sx={{ py: 5 }}>
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