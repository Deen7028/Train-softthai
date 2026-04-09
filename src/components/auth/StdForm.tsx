'use client';

import React from 'react';
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
    Divider
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import StdHook from "@/app/stdform/hooks";
import { Snackbar, Alert, Slide, SlideProps, SelectChangeEvent } from '@mui/material';

export default function StdForm() {
    const {
        birthDate,
        setBirthDate,
        province,
        district,
        subDistrict,
        zipcode,
        provinces,
        districts,
        subDistricts,
        handleProvinceChange,
        handleDistrictChange,
        handleSubDistrictChange,
        openSnackbar,
        setOpenSnackbar
    } = StdHook();

    function SlideTransition(props: SlideProps) {
        return <Slide {...props} direction="up" />;
    }
    return (
        <Container maxWidth="md" sx={{ mb: 4 }}>
            <Paper elevation={3} sx={{ mt: 10, borderRadius: 2, overflow: 'hidden' }}>

                <Paper elevation={0} sx={{ p: 4, backgroundColor: 'blue', borderRadius: 0 }}>
                    <Typography variant="h5" align="center" gutterBottom sx={{ color: 'white', fontWeight: 'bold' }}>
                        สมัครสมาชิก
                    </Typography>
                    <Typography variant="body2" align="center" sx={{ color: 'white' }}>
                        กรุณากรอกข้อมูลส่วนตัวและที่อยู่ให้ครบถ้วน
                    </Typography>
                </Paper>

                <Box component="form" noValidate sx={{ mt: 1, p: 4 }}>
                    <Grid container spacing={3}>

                        <Grid size={12}>
                            <Typography
                                variant="h6"
                                sx={{ fontWeight: 'bold', color: 'primary.main', mb: 1 }}>
                                ข้อมูลส่วนตัว
                            </Typography>
                            <Divider />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                id='firstname'
                                type="text"
                                fullWidth
                                variant="outlined"
                                size="small"
                                placeholder="ชื่อ"
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                id='lastname'
                                type="text"
                                variant="outlined"
                                fullWidth
                                size="small"
                                placeholder="นามสกุล"
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                id='nickname'
                                fullWidth
                                type="text"
                                variant="outlined"
                                size="small"
                                placeholder="ชื่อเล่น"
                            />
                        </Grid>


                        <Grid size={{ xs: 12, sm: 6 }}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    label="วัน/เดือน/ปีเกิด"
                                    value={birthDate}
                                    onChange={(newValue) => setBirthDate(newValue)}
                                    format="DD/MM/YYYY"
                                    slotProps={{ textField: { fullWidth: true, variant: 'outlined', size: 'small' } }}
                                />
                            </LocalizationProvider>
                        </Grid>


                        <Grid size={12} sx={{ mt: 2 }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 1 }}>
                                ข้อมูลที่อยู่ติดต่อ
                            </Typography>
                            <Divider />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 12 }}>
                            <FormLabel sx={{ fontSize: '0.875rem', mb: 0.5, fontWeight: 'bold' }}>ที่อยู่*</FormLabel>
                            <TextField
                                id='address'
                                fullWidth
                                variant="outlined"
                                size="small"
                                placeholder="รายละเอียดที่อยู่ (บ้านเลขที่, หมู่, ซอย, ถนน)"
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <FormControl fullWidth size="small">
                                <FormLabel sx={{ fontSize: '0.875rem', mb: 0.5, fontWeight: 'bold' }}>จังหวัด*</FormLabel>
                                <Select value={province} onChange={handleProvinceChange} displayEmpty>
                                    <MenuItem value="" disabled>เลือกจังหวัด</MenuItem>
                                    {provinces.map((p) => (
                                        <MenuItem key={p} value={p}>{p}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <FormControl fullWidth size="small">
                                <FormLabel sx={{ fontSize: '0.875rem', mb: 0.5, fontWeight: 'bold' }}>อำเภอ/เขต*</FormLabel>
                                <Select
                                    value={district}
                                    onChange={handleDistrictChange}
                                    displayEmpty
                                    disabled={!province}
                                >
                                    <MenuItem value="" disabled>เลือกอำเภอ</MenuItem>
                                    {districts.map((d) => (
                                        <MenuItem key={d} value={d}>{d}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <FormControl fullWidth size="small">
                                <FormLabel sx={{ fontSize: '0.875rem', mb: 0.5, fontWeight: 'bold' }}>ตำบล/แขวง*</FormLabel>
                                <Select
                                    value={subDistrict}
                                    onChange={handleSubDistrictChange}
                                    displayEmpty
                                    disabled={!district}
                                >
                                    <MenuItem value="" disabled>เลือกตำบล</MenuItem>
                                    {subDistricts.map((sd) => (
                                        <MenuItem key={sd} value={sd}>{sd}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <FormControl fullWidth size="small">
                                <FormLabel sx={{ fontSize: '0.875rem', mb: 0.5, fontWeight: 'bold' }}>รหัสไปรษณีย์*</FormLabel>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    value={zipcode}
                                    placeholder="รหัสไปรษณีย์"
                                    sx={{ backgroundColor: '#f5f5f5' }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid container spacing={1} size={12} justifyContent="flex-end" sx={{ mt: 2, display: 'flex' }}>
                            <Grid  size={{ xs: 5, sm: 2 }}>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    size="small"
                                    sx={{ py: 1, borderRadius: '10px' }}
                                    color="primary"
                                    onClick={() => {
                                        const form = document.querySelector('form');
                                        if (form) form.reset();
                                        setBirthDate(null);
                                        handleProvinceChange({ target: { value: '' } } as SelectChangeEvent<string>);
                                        handleDistrictChange({ target: { value: '' } } as SelectChangeEvent<string>);
                                        handleSubDistrictChange({ target: { value: '' } } as SelectChangeEvent<string>);
                                    }}
                                >
                                    ล้างข้อมูล
                                </Button>
                            </Grid>
                            <Grid size={{ xs: 7, sm: 4 }} >
                                <Button
                                    fullWidth
                                    variant="contained"
                                    size="small"
                                    sx={{ py: 1, borderRadius: '10px' }}
                                    color="primary"
                                    onClick={() => setOpenSnackbar(true)}
                                >
                                    ยืนยันการสมัครสมาชิก
                                </Button>
                            </Grid>
                        </Grid>

                        <Grid size={12}>
                            <Typography variant="body2" align="center" color="text.secondary">
                                Already have an account? <span style={{ color: 'blue', cursor: 'pointer', fontWeight: 'bold' }}>Sign In</span>
                            </Typography>
                        </Grid>

                    </Grid>
                </Box>
            </Paper>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={4000}
                onClose={() => setOpenSnackbar(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setOpenSnackbar(false)}
                    severity="success"
                    variant="filled"
                    sx={{ width: '100%', borderRadius: '12px', fontSize: '1rem', alignItems: 'center' }}
                >
                    สมัครสมาชิกสำเร็จ! ข้อมูลของคุณถูกบันทึกเรียบร้อยแล้ว
                </Alert>
            </Snackbar>
        </Container>
    );
}