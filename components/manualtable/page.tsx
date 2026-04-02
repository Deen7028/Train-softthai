'use client';

import React from 'react';
import {
    Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, IconButton, Checkbox, Select, MenuItem, TextField, Button,
    Typography, Pagination, InputAdornment, Grid
} from '@mui/material';
import { Edit, Info, Add, Search, Refresh } from '@mui/icons-material';
import { IManual } from '@/interfaces';
import { ManualStatus } from '@/enum';
import Link from 'next/link';
import { useManualTable } from './useManualTable';

interface ManualTableProps {
    data: IManual[];
}

export const ManualTable: React.FC<ManualTableProps> = ({ data }) => {
    // ใช้ Hook จัดการ Logic การแบ่งหน้า
    const { page, count, paginatedData, handlePageChange, handleSelectPage } = useManualTable(data, 8);

    return (
        <Box sx={{ p: 3, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: '#4a148c' }}>
                จัดการคู่มือการใช้งาน
            </Typography>

            {/* Filter Section ใช้ Grid สำหรับ Responsive */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                        fullWidth placeholder="ค้นหาชื่อคู่มือ" size="small"
                        sx={{ bgcolor: 'white', '& .MuiOutlinedInput-root': { borderRadius: 30 } }}
                        InputProps={{ startAdornment: <InputAdornment position="start"><Search /></InputAdornment> }}
                    />
                </Grid>
                <Grid size={{ xs: 6, md: 2 }}>
                    <Select fullWidth size="small" displayEmpty defaultValue="" sx={{ bgcolor: 'white' }}>
                        <MenuItem value="">ระบบ</MenuItem>
                    </Select>
                </Grid>
                <Grid size={{ xs: 6, md: 2 }}>
                    <Select fullWidth size="small" displayEmpty defaultValue="" sx={{ bgcolor: 'white' }}>
                        <MenuItem value="">สถานะ</MenuItem>
                    </Select>
                </Grid>
                <Grid size="auto">
                    <IconButton sx={{ border: '1px solid #ccc', borderRadius: 1 }}><Refresh /></IconButton>
                </Grid>
                <Grid size="auto">
                    <Button variant="contained" sx={{ bgcolor: '#4a148c' }}><Search /></Button>
                </Grid>
            </Grid>

            <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 'none' }}>
                <Table sx={{ minWidth: 650 }}>
                    <TableHead sx={{ bgcolor: '#eeeeee' }}>
                        <TableRow>
                            <TableCell align="center" sx={{ width: 50 }}>
                                <Link href="/manual/manage" passHref>
                                    <IconButton size="small" sx={{ bgcolor: '#4a148c', color: 'white' }}><Add fontSize="small" /></IconButton>
                                </Link>
                            </TableCell>
                            <TableCell align="center" sx={{ width: 60 }}>ที่</TableCell>
                            <TableCell>ชื่อคู่มือ</TableCell>
                            <TableCell>ระบบ</TableCell>
                            <TableCell align="center">สถานะ</TableCell>
                            <TableCell>ปรับปรุงล่าสุด</TableCell>
                            <TableCell align="center" sx={{ width: 60 }}></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedData.map((row, index) => (
                            <TableRow key={row.id} hover>
                                <TableCell align="center"><Checkbox size="small" /></TableCell>
                                <TableCell align="center">
                                    <Grid container spacing={1} alignItems="center" justifyContent="center">
                                        <Edit sx={{ color: 'orange', fontSize: 18, cursor: 'pointer' }} />
                                        <Typography variant="body2">{(page - 1) * 8 + (index + 1)}</Typography>
                                    </Grid>
                                </TableCell>
                                <TableCell sx={{ maxWidth: 300 }}>{row.title}</TableCell>
                                <TableCell color="textSecondary">{row.system}</TableCell>
                                <TableCell align="center">
                                    <Typography sx={{ color: row.status === ManualStatus.ACTIVE ? 'green' : 'red', fontWeight: 'medium' }}>
                                        {row.status}
                                    </Typography>
                                </TableCell>
                                <TableCell sx={{ color: 'gray' }}>{row.updatedAt?.toString()}</TableCell>
                                <TableCell align="center">
                                    <IconButton size="small" sx={{ bgcolor: '#4a148c', color: 'white' }}><Info fontSize="inherit" /></IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {/* Pagination Section ใช้ Grid จัดให้อยู่แถวเดียวกันชิดขวา */}
                <Grid container spacing={2} sx={{ p: 2, borderTop: '1px solid #eee' }} justifyContent="flex-end" alignItems="center">
                    <Grid>
                        <Pagination
                            count={count} page={page} onChange={handlePageChange}
                            shape="rounded" color="primary" size="small"
                        />
                    </Grid>
                    <Grid>
                        <Grid container spacing={1} alignItems="center">
                            <Grid><Typography variant="body2" color="textSecondary">ไปหน้า</Typography></Grid>
                            <Grid>
                                <Select size="small" value={page} onChange={handleSelectPage} sx={{ height: 30, minWidth: 60 }}>
                                    {[...Array(count)].map((_, i) => (
                                        <MenuItem key={i + 1} value={i + 1}>{i + 1}</MenuItem>
                                    ))}
                                </Select>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </TableContainer>
        </Box>
    );
};