'use client';

import React, { useEffect, useState } from 'react';
import {
    Box, TextField, Typography, Select, MenuItem, Button,
    IconButton, Switch, FormControl, Paper, Divider, Grid
} from '@mui/material';
import { CloudUpload, Delete, ArrowBackIos, Save } from '@mui/icons-material';
import { ManualStatus } from '@/src/enum';
import { IManual } from '@/src/interfaces';
import Link from 'next/link';
import { useManualForm } from '@/src/app/manual/manage/useManualForm';
import { ManualFormProps } from './ManualFormProps';

export const ManualForm: React.FC<ManualFormProps> = ({ initialData }) => {
    const { state, handlers } = useManualForm(initialData);
    const [systemOptions, setSystemOptions] = useState<string[]>([]);
    const [mounted, setMounted] = useState(false);
    const [userOptions, setUserOptions] = useState<{ id: number; name: string }[]>([]);
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);
        const fetchSystems = async () => {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5214/api";
            try {
                const res = await fetch(`${apiUrl}/manual`);
                const data: IManual[] = await res.json();
                const uniqueSystems = Array.from(new Set(data.map(item => item.system).filter(Boolean)));
                setSystemOptions(uniqueSystems as string[]);
            } catch (err) {
                console.error("Fetch systems error", err);
            }
        };

        const fetchUsers = async () => {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5214/api";
            try {
                const res = await fetch(`${apiUrl}/user`); 
                const data = await res.json();

                setUserOptions(
                    data.map((u: unknown) => ({
                        id: (u as { nUserId: number }).nUserId,
                        name: (u as { sUserName: string }).sUserName
                    }))
                );
            } catch (err) {
                console.error("Fetch users error", err);
            }
        };
        fetchSystems();
        fetchUsers();
    }, []);

    if (!mounted) return null;

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
            <Paper sx={{ p: { xs: 2, md: 4 }, borderRadius: 4, boxShadow: 'none' }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
                    {initialData?.id ? 'แก้ไขคู่มือ' : 'เพิ่มคู่มือ'}
                </Typography>

                <Grid container spacing={3}>
                    <Grid size={12}>
                        <FormControl fullWidth size="small">
                            <Typography variant="body2" sx={{ mb: 1 }}>ระบบ *</Typography>
                            <Select displayEmpty value={state.system} onChange={(e) => handlers.setSystem(e.target.value as string)}>
                                <MenuItem value="" disabled>เลือกระบบ</MenuItem>
                                {systemOptions.map((sys, index) => (
                                    <MenuItem key={index} value={sys}>{sys}</MenuItem>
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

                    <Grid size={12}>
                        <FormControl fullWidth size="small">
                            <Typography variant="body2" sx={{ mb: 1 }}>
                                ผู้สร้าง *
                            </Typography>
                            <Select
                                value={state.createdBy}
                                onChange={(e) => handlers.setCreatedBy(e.target.value as string)}
                                displayEmpty
                            >
                                <MenuItem value="" disabled>เลือกผู้ใช้</MenuItem>
                                {userOptions.map((user) => (
                                    <MenuItem key={user.id} value={user.id.toString()}>
                                        {user.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
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
                            <Grid container justifyContent="space-between" alignItems="center" sx={{ p: 1, border: '1px solid #eee' }}>
                                <Typography>{state.selectedFile.name}</Typography>
                                <Box>
                                    <IconButton onClick={handlers.handleDeleteFile} color="error"><Delete /></IconButton>
                                </Box>
                            </Grid>
                        </Grid>
                    )}

                    <Grid size={12}>
                        <Typography variant="body2">สถานะ *</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Switch checked={state.status} onChange={handlers.setStatus} color="success" />
                            <Typography variant="caption" sx={{ ml: 1 }}>
                                {state.status ? ManualStatus.ACTIVE : ManualStatus.INACTIVE}
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>

            <Grid container spacing={2} justifyContent="space-between" sx={{ mt: 4 }}>
                <Grid size="auto">
                    <Link href="/manual" style={{ textDecoration: 'none' }}>
                        <Button variant="contained" startIcon={<ArrowBackIos />} sx={{ bgcolor: '#757575' }}>
                            ย้อนกลับ
                        </Button>
                    </Link>
                </Grid>
                <Grid size="auto">
                    <Button variant="contained" startIcon={<Save />} onClick={handlers.handleSubmit} sx={{ bgcolor: '#4a148c' }}>
                        บันทึก
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};