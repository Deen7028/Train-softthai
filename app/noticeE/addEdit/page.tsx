"use client";
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Box, Container, Paper, Typography, TextField, Grid,
  Switch, Button, Breadcrumbs, Link, MenuItem, Tab, Tabs, IconButton
} from '@mui/material';
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import dayjs from 'dayjs';
import Checkbox from '@mui/material/Checkbox';
import Navbar from '@/components/navbar/page';

function FormContent() {
  // 1. State สำหรับเก็บข้อมูลฟอร์มทั้งหมด
  const [formData, setFormData] = useState({
    startDate: dayjs('2026-02-23'),
    endDate: dayjs('2026-02-23'),
    startTime: dayjs().hour(10).minute(0),
    endTime: dayjs().hour(13).minute(0),
    showAlways: false,
    title: 'เหนือ',
    note: '',
    status: true,
    image: null as File | null
  });

  const [tabValue, setTabValue] = useState(0);

  // 3. Logic การเลือกรูปภาพ
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, image: e.target.files![0] }));
    }
  };

  const searchParams = useSearchParams();
  const router = useRouter();
  const editId = searchParams.get('id'); // ดึง ID จาก URL (?id=1)

  // 2. Logic: ถ้ามี ID ให้ดึงข้อมูลเก่ามาใส่ใน State (Simulate API Fetch)
  useEffect(() => {
    if (editId) {
      // ตัวอย่าง: ในใช้งานจริงคุณจะ fetch จาก API โดยใช้ editId
      // สมมติข้อมูลที่ได้จาก API:
      const mockData = {
        title: editId === '1' ? 'วันพ่อ' : 'วันแม่',
        note: 'รายละเอียดประกาศเดิม...',
        status: true,
        startDate: dayjs('2026-12-01'),
      };

      setFormData(prev => ({
        ...prev,
        ...mockData
      }));
    }
  }, [editId]);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // 3. Logic การบันทึก (แยกเป็น Create หรือ Update)
  const handleSave = () => {
    if (!formData.title) {
      alert("กรุณากรอกชื่อประกาศ");
      return;
    }

    if (editId) {
      console.log("Updating ID:", editId, formData);
      alert(`แก้ไขข้อมูล ID: ${editId} เรียบร้อยแล้ว!`);
    } else {
      console.log("Creating New:", formData);
      alert("เพิ่มประกาศใหม่เรียบร้อยแล้ว!");
    }

    router.push('/notice'); // บันทึกเสร็จกลับไปหน้ารายการ
  };



  return (
    <>
    <Navbar></Navbar>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', p: 3 }}>
          <Paper sx={{ p: 4, borderRadius: 4 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
              {editId ? `แก้ไขประกาศ (ID: ${editId})` : 'เพิ่มประกาศใหม่'}
            </Typography>

            <Grid container spacing={3}>
              <Grid size={2}>
                <DatePicker
                  label="วันที่เริ่มต้น *"
                  sx={{ width: '100%' }}
                  value={formData.startDate}
                  onChange={(newValue) => handleChange('startDate', newValue)}
                />
              </Grid>
              <Grid size={2}>
                <DatePicker
                  label="วันที่สิ้นสุด *"
                  sx={{ width: '100%' }}
                  value={formData.startDate}
                  onChange={(newValue) => handleChange('startDate', newValue)}
                />
              </Grid>
              <Grid size={2}>
                <DatePicker
                  label="เวลาเริ่มต้น *"
                  sx={{ width: '100%' }}
                  value={formData.startDate}
                  onChange={(newValue) => handleChange('startDate', newValue)}
                />
              </Grid>
              <Grid size={2}>
                <DatePicker
                  label="เวลาสิ้นสุด *"
                  sx={{ width: '100%' }}
                  value={formData.startDate}
                  onChange={(newValue) => handleChange('startDate', newValue)}
                />
              </Grid>
              <Grid size={2}>
                <Box display="flex" alignItems="center" sx={{ height: '100%' }}>
                  <Checkbox
                    checked={formData.showAlways}
                    onChange={(e) => handleChange('showAlways', e.target.checked)}
                  />
                  <label>แสดงตลอด</label>
                </Box>
              </Grid>
            </Grid>

            <Grid size={2} sx={{ pt: 3 }}>
              <TextField
                fullWidth
                label="ชื่อประกาศ *"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
              />
            </Grid>

            <TextField
              fullWidth
              multiline
              rows={4}
              label="หมายเหตุ"
              value={formData.note}
              onChange={(e) => handleChange('note', e.target.value)}
              inputProps={{ maxLength: 1000 }}
              helperText={`${formData.note.length}/1000`}
              sx={{ mt: 3 }}
            />

            {/* Upload Section */}
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
              <Button variant="outlined" onClick={() => router.back()}>
                ยกเลิก
              </Button>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                sx={{ bgcolor: '#4a0072', px: 4 }}
                onClick={handleSave}
              >
                บันทึกข้อมูล
              </Button>
            </Box>
          </Paper>
        </Box>
      </LocalizationProvider>
    </>
  );
}

export default function AnnouncementForm() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FormContent />
    </Suspense>
  );
}