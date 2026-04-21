'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Box, Paper, Typography, TextField, Grid,
  Button, Checkbox, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import SaveIcon from '@mui/icons-material/Save';
import dayjs from 'dayjs';


function FormContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const editId = searchParams.get('id');

  const [formData, setFormData] = useState({
    sTitle: '',
    sNote: '',
    dStartDate: dayjs(),
    dEndDate: dayjs(),
    isShowAlways: false,
    nStatusId: 1,
    nLocationId: '',
    nTypePostId: '',
  });

  const [locations, setLocations] = useState<any[]>([]);
  const [types, setTypes] = useState<any[]>([]);

  // 2. ดึงข้อมูลกรณี "แก้ไข"
  useEffect(() => {
    if (editId) {
      const fetchData = async () => {
        try {
          // เรียกไปที่ .NET API
          const res = await fetch(`http://localhost:5071/api/user/${editId}`);
          if (!res.ok) throw new Error("ไม่สามารถดึงข้อมูลได้");

          const data = await res.json();

          // Mapping ข้อมูลจาก DB เข้าสู่ State
          setFormData({
            sTitle: data.sTitle || '',
            sNote: data.sNote || '',
            dStartDate: dayjs(data.dStartDate),
            dEndDate: data.dEndDate ? dayjs(data.dEndDate) : dayjs(),
            isShowAlways: Boolean(data.isShowAlways),
            nStatusId: data.nStatusId,
            nLocationId: data.nLocationId || '',
            nTypePostId: data.nTypePostId || '',
          });
        } catch (error) {
          console.error("Fetch Error:", error);
          alert("เกิดข้อผิดพลาดในการโหลดข้อมูล");
        }
      };
      fetchData();
    }
  }, [editId]);

  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const [locRes, typeRes] = await Promise.all([
          fetch('http://localhost:5071/api/user/GetLocation'),
          fetch('http://localhost:5071/api/user/GetTypePost')
        ]);

        if (locRes.ok) setLocations(await locRes.json());
        if (typeRes.ok) setTypes(await typeRes.json());
      } catch (error) {
        console.error("Master Data Fetch Error:", error);
      }
    };
    fetchMasterData();
  }, []);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // 3. บันทึกข้อมูล (POST สำหรับเพิ่ม / PUT สำหรับแก้ไข)
  const handleSave = async () => {
    if (!formData.sTitle) {
      alert("กรุณากรอกชื่อประกาศ");
      return;
    }

    // เตรียม Payload ให้ตรงกับ Model ที่เป็น DateOnly
    const payload = {
      nId: editId ? parseInt(editId) : 0, 
      sTitle: formData.sTitle,
      sNote: formData.sNote,
      dStartDate: formData.dStartDate ? formData.dStartDate.format('YYYY-MM-DD') : null,
      dEndDate: formData.dEndDate ? formData.dEndDate.format('YYYY-MM-DD') : null,
      isShowAlways: formData.isShowAlways,
      nStatusId: formData.nStatusId,
      nLocationId: formData.nLocationId ? parseInt(formData.nLocationId.toString()) : 0,
      nTypePostId: formData.nTypePostId ? parseInt(formData.nTypePostId.toString()) : 0,
    };

    try {
      const res = await fetch("http://localhost:5071/api/user" , {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert(editId ? "แก้ไขข้อมูลสำเร็จ!" : "เพิ่มประกาศใหม่สำเร็จ!");
        router.push('/noticeE');
        router.refresh();
      } else {
        const errorText = await res.text();
        console.error("Server Error:", errorText);
        alert(`เกิดข้อผิดพลาดในการบันทึก`);
      }
    } catch (error) {
      console.error("Save Error:", error);
      alert("ไม่สามารถติดต่อเซิร์ฟเวอร์ได้");
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', p: 3 }}>
        <Paper sx={{ p: 4, borderRadius: 4 }}>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
            {editId ? "แก้ไขประกาศ"  : 'เพิ่มประกาศใหม่'}
          </Typography>

          <Grid container spacing={3}>
            <Grid size={3}>
              <DatePicker
                label="วันที่เริ่มต้น *"
                sx={{ width: '100%' }}
                value={formData.dStartDate}
                onChange={(newValue) => handleChange('dStartDate', newValue)}
              />
            </Grid>
            <Grid size={3}>
              <DatePicker
                label="วันที่สิ้นสุด *"
                sx={{ width: '100%' }}
                value={formData.dEndDate}
                onChange={(newValue) => handleChange('dEndDate', newValue)}
              />
            </Grid>

            <Grid size={3}>
              <Box display="flex" alignItems="center" sx={{ height: '100%' }}>
                <Checkbox
                  checked={formData.isShowAlways}
                  onChange={(e) => handleChange('isShowAlways', e.target.checked)}
                />
                <Typography>แสดงตลอด</Typography>
              </Box>
            </Grid>

            {/* ส่วนเลือกสถานะ (ถ้าต้องการให้เลือกได้ในหน้าแก้) */}
            <Grid size={3}>
              <Checkbox
                checked={formData.nStatusId === 1}
                onChange={(e) => handleChange('nStatusId', e.target.checked ? 1 : 2)}
              />
              <Typography display="inline">เปิดใช้งาน</Typography>
            </Grid>
          </Grid>

          <Grid container spacing={3} sx={{ pt: 3 }}>
            <Grid size={4}>
              <TextField
                fullWidth
                label="ชื่อประกาศ *"
                value={formData.sTitle}
                onChange={(e) => handleChange('sTitle', e.target.value)}
              />
            </Grid>

            <Grid size={4}>
              <FormControl fullWidth>
                <InputLabel>สถานที่</InputLabel>
                <Select
                  value={formData.nLocationId}
                  label="สถานที่"
                  onChange={(e) => handleChange('nLocationId', e.target.value)}
                >
                  <MenuItem value=""><em>ไม่มี</em></MenuItem>
                  {locations.map((loc) => (
                    <MenuItem key={loc.nLocationId} value={loc.nLocationId}>
                      {loc.sLocationName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid size={4}>
              <FormControl fullWidth>
                <InputLabel>ประเภทประกาศ</InputLabel>
                <Select
                  value={formData.nTypePostId}
                  label="ประเภทประกาศ"
                  onChange={(e) => handleChange('nTypePostId', e.target.value)}
                >
                  <MenuItem value=""><em>ไม่มี</em></MenuItem>
                  {types.map((type) => (
                    <MenuItem key={type.nTypePostId} value={type.nTypePostId}>
                      {type.sTypeName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <TextField
            fullWidth
            multiline
            rows={4}
            label="หมายเหตุ"
            value={formData.sNote}
            onChange={(e) => handleChange('sNote', e.target.value)}
            inputProps={{ maxLength: 1000 }}
            helperText={`${(formData.sNote || '').length}/1000`}
            sx={{ mt: 3 }}
          />

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
            <Button variant="outlined" onClick={() => router.back()}>
              ยกเลิก
            </Button>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              sx={{ bgcolor: '#4a0072', px: 4, '&:hover': { bgcolor: '#38005a' } }}
              onClick={handleSave}
            >
              บันทึกข้อมูล
            </Button>
          </Box>
        </Paper>
      </Box>
    </LocalizationProvider>
  );
}

export default function AnnouncementForm() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FormContent />
    </Suspense>
  );
}