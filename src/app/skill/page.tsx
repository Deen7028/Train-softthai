'use client';

import React, { useState, useEffect, use } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    Paper,
    Container,
    Grid,
    FormLabel,
    FormControl,
    Select,
    MenuItem,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';

export default function RegisterForm() {
    // const [openSnackbar, setOpenSnackbar] = useState(false);
    const [room, setRoom] = useState('');
    const [subject, setSubject] = useState('');
    const [teacher, setTeacher] = useState('');
    const [term, setTerm] = useState('');
    const [day, setDay] = useState('');

    useEffect(() => {
        document.title = `เพิ่มตารางเรียน`;
    }, []);

    const handleSave = () => {
        alert(`บันทึกข้อมูลสำเร็จ! \nห้อง: ${room} \nวิชา: ${subject} \nอาจารย์ผู้สอน: ${teacher} \nเทอม/ปี: ${term} \nวัน: ${day}`);
    };

    // const handleCloseSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
    //     if (reason === 'clickaway') {
    //         return;
    //     }
    //     setOpenSnackbar(false);
    // };
    return (
        <Container maxWidth="md" sx={{ mb: 4 }}>
            <Paper elevation={3} sx={{ mt: 10, borderRadius: 2 }}>
                <Paper elevation={3} sx={{ p: 4, backgroundColor: 'blue' }}>
                    <Typography variant="h5" align="center" gutterBottom sx={{ color: 'white' }}>
                        <PersonIcon sx={{ mr: 1 }} />
                        เพิ่มตารางเรียน
                    </Typography>
                </Paper>

                <Box component="form" noValidate sx={{ mt: 1, p: 4 }}>
                    <Grid container spacing={2}>
                        <Grid size={12}>
                            <FormLabel sx={{ fontWeight: '600', fontSize: '0.875rem', color: 'text.primary' }}>ห้อง*</FormLabel>
                            <FormControl fullWidth size="small">
                                <Select
                                    value={room}
                                    onChange={(e) => setRoom(e.target.value)}
                                    displayEmpty
                                >
                                    <MenuItem value="" disabled>เลือกห้อง</MenuItem>
                                    <MenuItem value="computer">คอม</MenuItem>
                                    <MenuItem value="lecture">บรรยาย</MenuItem>
                                    <MenuItem value="it">IT</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid size={12}>
                            <FormLabel sx={{ fontWeight: '600', fontSize: '0.875rem' }}>วิชา*</FormLabel>
                            <FormControl fullWidth size="small">
                                <Select
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    displayEmpty
                                >
                                    <MenuItem value="" disabled>เลือกวิชา</MenuItem>
                                    <MenuItem value="math">คณิตศาสตร์</MenuItem>
                                    <MenuItem value="science">วิทยาศาสตร์</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid size={6}>
                            <FormLabel sx={{ fontWeight: '600', fontSize: '0.875rem' }}>section*</FormLabel>
                            <TextField fullWidth placeholder="เช่น 001" variant="outlined" size="small" />
                        </Grid>

                        <Grid size={6}>
                            <FormLabel sx={{ fontWeight: '600', fontSize: '0.875rem' }}>อาจารย์ผู้สอน*</FormLabel>
                            <FormControl fullWidth size="small">
                                <Select
                                    value={teacher}
                                    onChange={(e) => setTeacher(e.target.value)}
                                    displayEmpty
                                >
                                    <MenuItem value="" disabled>เลือกอาจารย์</MenuItem>
                                    <MenuItem value="กามารูดิง">กามารูดิง</MenuItem>
                                    <MenuItem value="ดีน">ดีน</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid size={6}>
                            <FormLabel sx={{ fontWeight: '600', fontSize: '0.875rem' }}>เทอม/ปี*</FormLabel>
                            <FormControl fullWidth size="small">
                                <Select
                                    value={term}
                                    onChange={(e) => setTerm(e.target.value)}
                                    displayEmpty
                                >
                                    <MenuItem value="" disabled>เลือกเทอม/ปี</MenuItem>
                                    <MenuItem value="2/2569">2/2569</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid size={6}>
                            <FormLabel sx={{ fontWeight: '600', fontSize: '0.875rem' }}>วัน*</FormLabel>
                            <FormControl fullWidth size="small">
                                <Select
                                    value={day}
                                    onChange={(e) => setDay(e.target.value)}
                                    displayEmpty
                                >
                                    <MenuItem value="" disabled>เลือกวัน</MenuItem>
                                    <MenuItem value="จันทร์">จันทร์</MenuItem>
                                    <MenuItem value="อังคาร">อังคาร</MenuItem>
                                    <MenuItem value="พุธ">พุธ</MenuItem>
                                    <MenuItem value="พฤหัสบดี">พฤหัสบดี</MenuItem>
                                    <MenuItem value="ศุกร์">ศุกร์</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid size={6}>
                            <FormLabel sx={{ fontWeight: '600', fontSize: '0.875rem' }}>เวลาเริ่ม*</FormLabel>
                            <TextField
                                placeholder="เวลา"
                                type="time"
                                fullWidth
                                size="small"
                            />
                        </Grid>
                        <Grid size={6}>
                            <FormLabel sx={{ fontWeight: '600', fontSize: '0.875rem' }}>เวลาสิ้นสุด*</FormLabel>
                            <TextField
                                placeholder="เวลา"
                                type="time"
                                fullWidth
                                size="small"
                            />
                        </Grid>
                        <Grid container spacing={2} size={12} justifyContent="flex-end" sx={{ mt: 2 }}>
                            <Grid size={{ xs: 4, sm: 2 }}>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    size="large"
                                    sx={{ mt: 2, borderRadius: '10px' }}
                                    color="primary"
                                >
                                    ยกเลิก
                                </Button>
                            </Grid>
                            <Grid size={{ xs: 8, sm: 3 }}>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    size="large"
                                    sx={{ mt: 2, borderRadius: '10px' }}
                                    color="primary"
                                    onClick={handleSave}
                                >
                                    บันทึกข้อมูล
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
            {/* <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity="success" variant="filled" sx={{ width: '100%' }}>
                    บันทึกข้อมูลสำเร็จ!
                </Alert>
            </Snackbar> */}
        </Container>
    );
}