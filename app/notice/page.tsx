'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form'; // นำเข้า useForm
import {
  Box, TextField, Button, Typography, Paper, Container, Grid,
  FormControl, Select, MenuItem, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Checkbox, IconButton,
  Pagination,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import RefreshIcon from '@mui/icons-material/Refresh';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Link from 'next/link';

// กำหนด Interface สำหรับ Form Data
interface FilterInputs {
  searchTerm: string;
  startDate: string;
  endDate: string;
  location: string;
  powerPlant: string;
  status: string;
}

export default function AnnouncementManagement() {
  const router = useRouter();
  const primaryColor = "#6A1B4D";

  // 1. React Hook Form Setup
  const { register, handleSubmit, reset, control, watch } = useForm<FilterInputs>({
    defaultValues: {
      searchTerm: '',
      startDate: '',
      endDate: '',
      location: '',
      powerPlant: 'โรงไฟฟ้า',
      status: ''
    }
  });



 // 2. State สำหรับข้อมูลหลัก และ Search Criteria หลังกด Search

  const [announcements, setAnnouncements] = useState([
    { id: 1, title: 'วันพ่อแห่งชาติ', category: 'วันสำคัญ', locationId: '1', peaCode: 'BKK01', start: '01/12/2026', end: '06/12/2026', status: 'ใช้งาน', showAlways: false, note: 'จัดกิจกรรมเฉลิมพระเกียรติ', updated: '13/02/2026' },
    { id: 2, title: 'วันแม่แห่งชาติ', category: 'วันสำคัญ', locationId: '1', peaCode: 'BKK02', start: '01/08/2025', end: '13/08/2025', status: 'ใช้งาน', showAlways: false, note: 'กิจกรรมวันแม่', updated: '14/02/2025' },
    { id: 3, title: 'ประกาศดับไฟซ่อมบำรุง', category: 'แจ้งเตือน', locationId: '2', peaCode: 'NRT01', start: '15/03/2025', end: '15/03/2025', status: 'ใช้งาน', showAlways: false, note: 'ซ่อมบำรุงเสาไฟฟ้า', updated: '15/02/2025' },
    // ... ข้อมูลเดิมที่เหลือ

  ]);




  const [appliedFilters, setAppliedFilters] = useState<Partial<FilterInputs>>({});
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  // 3. Logic การลบ
  const handleDelete = (id: number) => {
    if (window.confirm('คุณต้องการลบประกาศนี้ใช่หรือไม่?')) {
      setAnnouncements(prev => prev.filter(item => item.id !== id));
    }
  };

  const onSearchSubmit = (data: FilterInputs) => {
    setAnnouncements([
      { id: 1, title: 'วันพ่อแห่งชาติ', category: 'วันสำคัญ', locationId: '1', peaCode: 'BKK01', start: '01/12/2026', end: '06/12/2026', status: 'ใช้งาน', showAlways: false, note: 'จัดกิจกรรมเฉลิมพระเกียรติ', updated: '13/02/2026' },
      { id: 2, title: 'วันแม่แห่งชาติ', category: 'วันสำคัญ', locationId: '1', peaCode: 'BKK02', start: '01/08/2025', end: '13/08/2025', status: 'ใช้งาน', showAlways: false, note: 'กิจกรรมวันแม่', updated: '14/02/2025' }
      // ... ข้อมูลเดิมที่เหลือ
    ])
    setAppliedFilters(data);
    setPage(1);
  };

  const handleRefresh = () => {
    reset(); // Reset form values สู่ default
    setAppliedFilters({});
    setPage(1);
  };

  // 5. Logic การกรองข้อมูล (ทำงานเมื่อ appliedFilters เปลี่ยน)
  const filteredRows = useMemo(() => {
    return announcements.filter(row => {
      const matchSearch = row.title.toLowerCase().includes((appliedFilters.searchTerm || '').toLowerCase());
      const matchStatus = appliedFilters.status ? row.status === appliedFilters.status : true;
      // เพิ่ม logic กรองอื่นๆ (วันที่, สถานที่) ได้ที่นี่
      return matchSearch && matchStatus;
    });
  }, [appliedFilters, announcements]);

  // 6. Logic สำหรับ Pagination
  const displayedRows = useMemo(() => {
    const startIndex = (page - 1) * rowsPerPage;
    return filteredRows.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredRows, page]);

  return (
    <Box sx={{ bgcolor: '#F4F4F4', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="xl" sx={{ mt: 5 }}>
        <Paper sx={{ p: 3, borderRadius: 4, boxShadow: '0px 4px 20px rgba(0,0,0,0.05)' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
            จัดการประกาศ
          </Typography>

          {/* Filter Section using react-hook-form */}
          <form onSubmit={handleSubmit(onSearchSubmit)}>
            <Grid container spacing={2} sx={{ mb: 4 }}>
              <Grid size={6}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="ค้นหาชื่อประกาศ..."
                  {...register('searchTerm')}
                />
              </Grid>
              <Grid size={3}>
                <TextField
                  fullWidth size="small" type="date" label="วันที่เริ่มต้น"
                  InputLabelProps={{ shrink: true }} {...register('startDate')}
                />
              </Grid>
              <Grid size={3}>
                <TextField
                  fullWidth size="small" type="date" label="วันที่สิ้นสุด"
                  InputLabelProps={{ shrink: true }} {...register('endDate')}
                />
              </Grid>

              <Grid size={3}>
                <Controller
                  name="location"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth size="small">
                      <Select {...field} displayEmpty>
                        <MenuItem value="">สถานที่</MenuItem>
                        <MenuItem value="โรงเเรม1">โรงเเรม1</MenuItem>
                        <MenuItem value="โรงเเรม2">โรงเเรม2</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid size={3}>
                <Controller
                  name="powerPlant"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth size="small">
                      <Select {...field}>
                        <MenuItem value="โรงไฟฟ้า">โรงไฟฟ้า</MenuItem>
                        <MenuItem value="โรงไฟฟ้า2">โรงไฟฟ้า2</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid size={3}>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth size="small">
                      <Select {...field} displayEmpty>
                        <MenuItem value="">สถานะ</MenuItem>
                        <MenuItem value="ใช้งาน">ใช้งาน</MenuItem>
                        <MenuItem value="ไม่ใช้งาน">ไม่ใช้งาน</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>

              <Grid size={3} sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={handleRefresh}
                  sx={{ minWidth: 40, borderColor: '#DDD', color: '#333' }}
                >
                  <RefreshIcon fontSize="small" />
                </Button>
                <Button
                  type="submit" // ใช้ type submit เพื่อเรียก handleSubmit
                  variant="contained"
                  sx={{ bgcolor: primaryColor, '&:hover': { bgcolor: '#4A1435' } }}
                >
                  <SearchIcon fontSize="small" />
                </Button>
              </Grid>
            </Grid>
          </form>

          {/* Table Section */}
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: '#F9FAFB' }}>
                <TableRow>
                  <TableCell padding="checkbox"><Checkbox size="small" /></TableCell>
                  <TableCell>ที่ ↓</TableCell>
                  <TableCell align="center">
                    <IconButton size="small" color="primary" component={Link} href="/notice/addEdit">
                      <AddCircleIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                  <TableCell>ชื่อประกาศ</TableCell>
                  <TableCell>วันที่เริ่มต้น</TableCell>
                  <TableCell>วันที่สิ้นสุด</TableCell>
                  <TableCell>สถานะ</TableCell>
                  <TableCell align="center">จัดการ</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {displayedRows.length > 0 ? (
                  displayedRows.map((row) => (
                    <TableRow key={row.id} hover>
                      <TableCell padding="checkbox"><Checkbox size="small" /></TableCell>
                      <TableCell>{row.id}</TableCell>
                      <TableCell align="center">
                        <IconButton size="small" component={Link} href={`/notice/addEdit?id=${row.id}`}>
                          <EditIcon fontSize="small" sx={{ color: '#F1C40F' }} />
                        </IconButton>
                      </TableCell>
                      <TableCell>{row.title}</TableCell>
                      <TableCell>{row.start}</TableCell>
                      <TableCell>{row.end}</TableCell>
                      <TableCell>
                        <Box sx={{
                          color: row.status === 'ใช้งาน' ? '#2ECC71' : '#E74C3C',
                          fontWeight: '500'
                        }}>
                          {row.status}
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <IconButton onClick={() => handleDelete(row.id)}>
                          <DeleteIcon fontSize="small" color="error" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                      ไม่พบข้อมูลที่ค้นหา
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination Section */}
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 2 }}>
            <Pagination
              count={Math.ceil(filteredRows.length / rowsPerPage)}
              page={page}
              onChange={(_, value) => setPage(value)}
              shape="rounded"
              size="small"
            />
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}