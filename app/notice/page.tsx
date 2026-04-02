'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
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

export default function AnnouncementManagement() {
  const router = useRouter();
  const primaryColor = "#6A1B4D";

  // 1. State สำหรับข้อมูลหลัก
  const [announcements, setAnnouncements] = useState([
  { 
    id: 1, 
    title: 'วันพ่อแห่งชาติ', 
    category: 'วันสำคัญ',
    locationId: '1', 
    peaCode: 'BKK01',
    start: '01/12/2569 13:00', 
    end: '06/12/2569 13:00', 
    status: 'ใช้งาน', 
    showAlways: false,
    note: 'จัดกิจกรรมเฉลิมพระเกียรติ ณ ลานหน้าสำนักงานใหญ่',
    updated: '13/02/2569 10:00' 
  },
  { 
    id: 2, 
    title: 'วันแม่แห่งชาติ', 
    category: 'วันสำคัญ',
    locationId: '1', 
    peaCode: 'BKK02',
    start: '01/08/2569 09:00', 
    end: '13/08/2569 18:00', 
    status: 'ใช้งาน', 
    showAlways: false,
    note: 'กิจกรรมวันแม่ มอบเกียรติบัตรแม่ดีเด่น',
    updated: '14/02/2569 11:30' 
  },
  { 
    id: 3, 
    title: 'ประกาศดับไฟซ่อมบำรุง', 
    category: 'แจ้งเตือน',
    locationId: '2', 
    peaCode: 'NRT01',
    start: '15/03/2569 08:30', 
    end: '15/03/2569 16:30', 
    status: 'ใช้งาน', 
    showAlways: false,
    note: 'ซ่อมบำรุงเสาไฟฟ้าแรงสูง บริเวณถนนสุขุมวิท',
    updated: '15/02/2569 09:15' 
  },
  { 
    id: 4, 
    title: 'วันวิสาขบูชา', 
    category: 'วันสำคัญทางศาสนา',
    locationId: '3', 
    peaCode: 'CHM01',
    start: '02/06/2569 13:00', 
    end: '04/06/2569 13:00', 
    status: 'ใช้งาน', 
    showAlways: true,
    note: 'เชิญชวนเวียนเทียน ณ วัดประจำจังหวัด',
    updated: '16/02/2569 14:00' 
  },
  { 
    id: 5, 
    title: 'โปรโมชั่นชำระค่าน้ำค่าไฟ', 
    category: 'โปรโมชั่น',
    locationId: '1', 
    peaCode: 'BKK01',
    start: '01/04/2569 00:00', 
    end: '30/04/2569 23:59', 
    status: 'ใช้งาน', 
    showAlways: false,
    note: 'รับส่วนลดเมื่อชำระผ่านแอปพลิเคชัน',
    updated: '17/02/2569 08:00' 
  },
  { 
    id: 6, 
    title: 'วันสงกรานต์', 
    category: 'วันหยุดนักขัตฤกษ์',
    locationId: '4', 
    peaCode: 'PKT01',
    start: '13/04/2569 08:00', 
    end: '16/04/2569 20:00', 
    status: 'ใช้งาน', 
    showAlways: false,
    note: 'แจ้งวันหยุดทำการสำนักงาน',
    updated: '18/02/2569 16:45' 
  },
  { 
    id: 7, 
    title: 'วันปิยมหาราช', 
    category: 'วันสำคัญ',
    locationId: '1', 
    peaCode: 'BKK03',
    start: '23/10/2569 07:00', 
    end: '23/10/2569 18:00', 
    status: 'ไม่ใช้งาน', 
    showAlways: false,
    note: 'พิธีวางพวงมาลา',
    updated: '19/02/2569 10:20' 
  },
  { 
    id: 8, 
    title: 'วันจักรี', 
    category: 'วันสำคัญ',
    locationId: '1', 
    peaCode: 'BKK01',
    start: '06/04/2569 08:00', 
    end: '06/04/2569 17:00', 
    status: 'ไม่ใช้งาน', 
    showAlways: false,
    note: 'วันครบรอบการก่อตั้งราชวงศ์จักรี',
    updated: '20/02/2569 13:10' 
  },
  { 
    id: 9, 
    title: 'กิจกรรมปลูกป่าชายเลน', 
    category: 'CSR',
    locationId: '5', 
    peaCode: 'RAY01',
    start: '20/05/2569 09:00', 
    end: '20/05/2569 15:00', 
    status: 'ใช้งาน', 
    showAlways: false,
    note: 'โครงการรักษ์โลกกับ PEA',
    updated: '21/02/2569 11:00' 
  },
  { 
    id: 10, 
    title: 'แจ้งย้ายที่ทำการใหม่', 
    category: 'แจ้งเตือน',
    locationId: '2', 
    peaCode: 'NRT02',
    start: '01/01/2569 08:30', 
    end: '31/12/2569 16:30', 
    status: 'ใช้งาน', 
    showAlways: true,
    note: 'ตั้งแต่วันที่ 1 ม.ค. เป็นต้นไป ย้ายไปอาคาร B ชั้น 4',
    updated: '22/02/2569 09:00' 
  }
]);

  // 2. State สำหรับ Filter และ UI
  const [searchTerm, setSearchTerm] = useState('');
  const [tempSearch, setTempSearch] = useState(''); // เก็บค่าที่พิมพ์ก่อนกดค้นหา
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  // 3. Logic การลบ
  const handleDelete = (id: number) => {
    if (window.confirm('คุณต้องการลบประกาศนี้ใช่หรือไม่?')) {
      setAnnouncements(prev => prev.filter(item => item.id !== id));
    }
  };

  // 4. Logic การกรองข้อมูล (ทำงานเมื่อ searchTerm เปลี่ยน)
  const filteredRows = useMemo(() => {
    return announcements.filter(row =>
      row.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, announcements]);

  // 5. Logic สำหรับ Pagination
  const displayedRows = useMemo(() => {
    const startIndex = (page - 1) * rowsPerPage;
    return filteredRows.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredRows, page]);

  // 6. Action Handlers
  const handleSearch = () => {
    setSearchTerm(tempSearch);
    setPage(1); // กลับไปหน้าแรกเมื่อค้นหาใหม่
  };

  const handleRefresh = () => {
    setTempSearch('');
    setSearchTerm('');
    setPage(1);
  };

  return (
    <Box sx={{ bgcolor: '#F4F4F4', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="xl" sx={{ mt: 5 }}>
        <Paper sx={{ p: 3, borderRadius: 4, boxShadow: '0px 4px 20px rgba(0,0,0,0.05)' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
            จัดการประกาศ
          </Typography>

          {/* Filter Section */}
          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid size={6}>
              <TextField
                fullWidth
                size="small"
                placeholder="ค้นหาชื่อประกาศ..."
                value={tempSearch}
                onChange={(e) => setTempSearch(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </Grid>
            <Grid size={3}>
              <TextField fullWidth size="small" type="date" label="วันที่เริ่มต้น" InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid size={3}>
              <TextField fullWidth size="small" type="date" label="วันที่สิ้นสุด" InputLabelProps={{ shrink: true }} />
            </Grid>

            <Grid size={3}>
                <FormControl fullWidth size="small">
                  <Select displayEmpty defaultValue="">
                    <MenuItem value="">สถานที่</MenuItem>
                    <MenuItem value="โรงเเรม1">โรงเเรม1</MenuItem>
                    <MenuItem value="โรงเเรม2">โรงเเรม2</MenuItem>
                    <MenuItem value="โรงเเรม3">โรงเเรม3</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            <Grid size={3}>
                <FormControl fullWidth size="small">
                  <Select displayEmpty defaultValue="โรงไฟฟ้า">
                    <MenuItem value="โรงไฟฟ้า">โรงไฟฟ้า</MenuItem>
                    <MenuItem value="โรงไฟฟ้า2">โรงไฟฟ้า2</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            <Grid size={3}>
                <FormControl fullWidth size="small">
                  <Select displayEmpty defaultValue="">
                    <MenuItem value="">สถานะ</MenuItem>
                    <MenuItem value="ใช้งาน">ใช้งาน</MenuItem>
                    <MenuItem value="	ไม่ใช้งาน">	ไม่ใช้งาน</MenuItem>
                  </Select>
                </FormControl>
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
                variant="contained" 
                onClick={handleSearch}
                sx={{ bgcolor: primaryColor, '&:hover': { bgcolor: '#4A1435' } }}
              >
                <SearchIcon fontSize="small" />
              </Button>
            </Grid>
          </Grid>

          {/* Table Section */}
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: '#F9FAFB' }}>
                <TableRow>
                  <TableCell padding="checkbox"><Checkbox size="small"  /></TableCell>
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
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2">ไปหน้า</Typography>
              <Select 
                size="small" 
                value={page} 
                onChange={(e) => setPage(Number(e.target.value))}
                sx={{ height: 30 }}
              >
                {Array.from({ length: Math.ceil(filteredRows.length / rowsPerPage) }, (_, i) => (
                  <MenuItem key={i + 1} value={i + 1}>{i + 1}</MenuItem>
                ))}
              </Select>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}