'use client';

import React, { useMemo } from 'react';
import {
    Box, TextField, Typography, Select, MenuItem, Button,
    IconButton, Switch, FormControl, Paper, Divider, Grid
} from '@mui/material';
import { CloudUpload, Delete, Download, ArrowBackIos, Save } from '@mui/icons-material';
import { ManualStatus } from '@/enum';
import { IManual } from '@/interfaces';
import Link from 'next/link';
import { useManualForm } from '@/app/manual/manage/useManualForm';
import { MOCK_MANUALS } from '@/app/manual/mock';
interface ManualFormProps {
    initialData?: IManual;
}

export const ManualForm: React.FC<ManualFormProps> = ({ initialData }) => {
    const { state, handlers } = useManualForm(initialData);
    const systemOptions = useMemo(() => {
        const systems = MOCK_MANUALS.map((item) => item.system).filter(Boolean) as string[];
        return Array.from(new Set(systems));
    }, []);
    return (
        <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
            <Paper sx={{ p: { xs: 2, md: 4 }, borderRadius: 4, boxShadow: 'none' }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
                    {initialData ? 'แก้ไขคู่มือ' : 'เพิ่มคู่มือ'}
                </Typography>

                <Grid container spacing={3}>
                    <Grid size={12}>
                        <FormControl fullWidth size="small">
                            <Typography variant="body2" sx={{ mb: 1 }}>ระบบ *</Typography>
                            <Select displayEmpty value={state.system} onChange={handlers.setSystem}>
                                <MenuItem value="" disabled>เลือกระบบ</MenuItem>
                                {systemOptions.map((sys, index) => (
                                    <MenuItem key={index} value={sys}>
                                        {sys}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid size={12}>
                        <Typography variant="body2" sx={{ mb: 1 }}>ชื่อคู่มือ *</Typography>
                        <TextField
                            fullWidth size="small"
                            value={state.title}
                            onChange={handlers.setTitle}
                        />
                    </Grid>

                    <Grid size={12}>
                        <Typography variant="body2" sx={{ mb: 1 }}>คำอธิบาย</Typography>
                        <TextField
                            fullWidth multiline rows={4}
                            value={state.description}
                            onChange={handlers.setDescription}
                        />
                    </Grid>

                    <Grid size={12}><Divider /></Grid>

                    <Grid size={12}>
                        <Box sx={{ border: '1px dashed #ccc', p: 4, textAlign: 'center' }}>
                            <input type="file" hidden id="upload-file" onChange={handlers.handleFileChange} />
                            <label htmlFor="upload-file">
                                <IconButton component="span" sx={{ bgcolor: '#4a148c', color: 'white' }}>
                                    <CloudUpload />
                                </IconButton>
                                <Typography variant="body2">อัปโหลดไฟล์</Typography>
                            </label>
                        </Box>
                    </Grid>

                    {state.selectedFile && (
                        <Grid size={12}>
                            <Grid container justifyContent="space-between" sx={{ p: 1, border: '1px solid #eee' }}>
                                <Typography>{state.selectedFile.name}</Typography>
                                <Box>
                                    <IconButton onClick={handlers.handleDeleteFile} color="error"><Delete /></IconButton>
                                    <IconButton onClick={handlers.handleDownload} sx={{ color: '#4a148c' }}><Download /></IconButton>
                                </Box>
                            </Grid>
                        </Grid>
                    )}

                    <Grid size={12}>
                        <Typography variant="body2">สถานะ *</Typography>
                        <Switch checked={state.status} onChange={handlers.setStatus} color="success" />
                        <Typography variant="caption">
                            {state.status ? ManualStatus.ACTIVE : ManualStatus.INACTIVE}
                        </Typography>
                    </Grid>
                </Grid>
            </Paper>

            <Grid container spacing={2} justifyContent="space-between" sx={{ mt: 4 }}>
                <Grid size={{ xs: 6, sm: 'auto' }}>
                    <Link href="/manual" style={{ textDecoration: 'none' }}>
                        <Button variant="contained" startIcon={<ArrowBackIos />} sx={{ bgcolor: '#757575' }}>
                            ย้อนกลับ
                        </Button>
                    </Link>
                </Grid>
                <Grid size={{ xs: 6, sm: 'auto' }}>
                    <Button variant="contained" startIcon={<Save />} onClick={handlers.handleSubmit} sx={{ bgcolor: '#4a148c' }}>
                        บันทึก
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};