'use client'; // ตามกฎ Interactivity Boundary

import React from 'react';
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Checkbox,
    Select,
    MenuItem,
    TextField,
    Button,
    Typography,
    Pagination,
    InputAdornment,
    Chip,
    Grid
} from '@mui/material';
import {
    Edit,
    Info,
    Add,
    Search,
    Refresh,
    ArrowForwardIos
} from '@mui/icons-material';
import { IManual } from '@/interfaces';
import { ManualStatus } from '@/enum';
import Link from 'next/link';

interface ManualTableProps {
    data: IManual[];
}

export const ManualTable: React.FC<ManualTableProps> = ({ data }) => {
    return (
        <Box sx={{ p: 3, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: '#333' }}>
                จัดการคู่มือการใช้งาน
            </Typography>

            <Grid container spacing={2} sx={{ mb: 3 }} >
                <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                        fullWidth
                        placeholder="ค้นหาชื่อคู่มือ"
                        size="small"
                        sx={{ flexGrow: 1, bgcolor: 'white', borderRadius: 30 }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Grid>

                <Grid size={{ xs: 12, md: 2 }}>
                    <Select fullWidth size="small" displayEmpty defaultValue="" sx={{ minWidth: 150, bgcolor: 'white' }}>
                        <MenuItem value="">ระบบ</MenuItem>
                    </Select>
                </Grid>

                <Grid size={{ xs: 12, md: 2 }}>
                    <Select fullWidth size="small" displayEmpty defaultValue="" sx={{ minWidth: 150, bgcolor: 'white' }}>
                        <MenuItem value="">สถานะ</MenuItem>
                    </Select>
                </Grid>

                <Grid>
                    <IconButton sx={{ border: '1px solid #ccc', borderRadius: 1 }}>
                        <Refresh />
                    </IconButton>
                </Grid>

                <Grid>
                    <Button fullWidth variant="contained" sx={{ bgcolor: '#4a148c', '&:hover': { bgcolor: '#311b92' } }}>
                        <Search />
                    </Button>
                </Grid>

            </Grid>

            <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 'none' }}>
                <Table sx={{ minWidth: 650 }}>
                    <TableHead sx={{ bgcolor: '#eeeeee' }}>
                        <TableRow>
                            <TableCell align="center" sx={{ width: 50 }}>
                                <Link href="/manual/manage" passHref>
                                    <IconButton size="small" sx={{ bgcolor: '#4a148c', color: 'white', '&:hover': { bgcolor: '#311b92' } }}>
                                        <Add fontSize="small" />
                                    </IconButton>
                                </Link >
                            </TableCell>
                            <TableCell align="center">ที่</TableCell>
                            <TableCell>ชื่อคู่มือ</TableCell>
                            <TableCell>ระบบ</TableCell>
                            <TableCell align="center">สถานะ</TableCell>
                            <TableCell>ปรับปรุงล่าสุด</TableCell>
                            <TableCell align="center"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((row, index) => (
                            <TableRow key={row.id} hover>
                                <TableCell align="center">
                                    <Checkbox size="small" />
                                </TableCell>
                                <TableCell align="center">
                                    <Grid direction="row" spacing={1} alignItems="center" justifyContent="center">
                                        <Edit sx={{ color: 'orange', fontSize: 18, cursor: 'pointer' }} />
                                        <Select size="small" defaultValue={index + 1} sx={{ height: 30, fontSize: 12 }}>
                                            <MenuItem value={index + 1}>{index + 1}</MenuItem>
                                        </Select>
                                    </Grid>
                                </TableCell>
                                <TableCell sx={{ maxWidth: 300 }}>{row.title}</TableCell>
                                <TableCell color="textSecondary">{row.system}</TableCell>
                                <TableCell align="center">
                                    <Typography
                                        sx={{
                                            color: row.status === ManualStatus.ACTIVE ? 'green' : 'red',
                                            fontWeight: 'medium'
                                        }}
                                    >
                                        {row.status}
                                    </Typography>
                                </TableCell>
                                <TableCell sx={{ color: 'gray' }}>{row.updatedAt?.toString()}</TableCell>
                                <TableCell align="center">
                                    <IconButton
                                        size="small"
                                        sx={{ bgcolor: '#4a148c', color: 'white', '&:hover': { bgcolor: '#311b92' } }}
                                    >
                                        <Info fontSize="inherit" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>


                    <Grid
                        container
                        spacing={1}
                        wrap="nowrap"
                        alignItems="center"
                        justifyContent="flex-end"
                        sx={{ p: 2, borderTop: '1px solid #eee', width: '100%', m: 0 }}
                    >
                        <Grid sx={{ flexShrink: 0 }}>
                            <Pagination
                                count={3}
                                shape="circular"
                                color="primary"
                                size="small"
                            />
                        </Grid>

                        <Grid>
                            <Grid container  spacing={1}>
                                <Grid>
                                    <Typography variant="body2" color="textSecondary">
                                        ไปหน้า
                                    </Typography>
                                </Grid>
                                <Grid>
                                    <Select
                                        size="small"
                                        defaultValue={1}
                                        sx={{ height: 30, minWidth: 60 }}
                                    >
                                        <MenuItem value={1}>1</MenuItem>
                                        <MenuItem value={2}>2</MenuItem>
                                    </Select>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Table>
            </TableContainer>
        </Box>
    );
};