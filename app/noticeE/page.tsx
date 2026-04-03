'use client';

import React, { useState, useMemo, useEffect } from 'react';
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
import Navbar from '@/components/navbar/page';

// กำหนด Interface สำหรับ Form Data
interface FilterInputs {
  searchTerm: string;
  startDate: string;
  endDate: string;
  location: string;
  category: string;
  status: string;
  rowpage: string;
}

export default function AnnouncementManagement() {
  const router = useRouter();
  const primaryColor = "#6A1B4D";

  // 1. React Hook Form Setup
  const { register, handleSubmit, reset, control } = useForm<FilterInputs>({
    defaultValues: {
      searchTerm: '',
      startDate: '',
      endDate: '',
      location: '',
      category: '',
      status: '',
      rowpage: "5",
    }
  });



  // 2. State สำหรับข้อมูลหลัก และ Search Criteria หลังกด Search
  const [announcements, setAnnouncements] = useState([
    { id: 1, title: 'วันพ่อแห่งชาติ', categoryId: '1', locationId: '1', start: '01/12/2026', end: '06/12/2026', statusId: "1", showAlways: false, note: 'จัดกิจกรรมเฉลิมพระเกียรติ', updated: '13/02/2026' },
    { id: 2, title: 'วันแม่แห่งชาติ', categoryId: '1', locationId: '1', start: '01/08/2025', end: '13/08/2025', statusId: "1", showAlways: false, note: 'กิจกรรมวันแม่', updated: '14/02/2025' },
    { id: 3, title: 'ประกาศดับไฟซ่อมบำรุง (เขต 1)', categoryId: '2', locationId: '2', start: '15/03/2025', end: '15/03/2025', statusId: "1", showAlways: false, note: 'ซ่อมบำรุงเสาไฟฟ้า', updated: '15/02/2025' },
    { id: 4, title: 'ย้ายจุดติดตั้งมิเตอร์ไฟฟ้า', categoryId: '2', locationId: '2', start: '20/03/2025', end: '21/03/2025', statusId: "1", showAlways: false, note: 'ปรับปรุงระบบสายส่ง', updated: '16/02/2025' },
    { id: 5, title: 'แจ้งเตือนพายุฤดูร้อน', categoryId: '3', locationId: '1', start: '05/04/2026', end: '07/04/2026', statusId: "1", showAlways: true, note: 'เฝ้าระวังระบบจ่ายไฟ', updated: '01/04/2026' },
    { id: 6, title: 'วันสงกรานต์ 2026', categoryId: '1', locationId: '2', start: '13/04/2026', end: '17/04/2026', statusId: "1", showAlways: false, note: 'วันหยุดนักขัตฤกษ์', updated: '10/03/2026' },
    { id: 7, title: 'ปิดปรับปรุงระบบชำระเงินชั่วคราว', categoryId: '3', locationId: '1', start: '01/05/2025', end: '01/05/2025', statusId: "2", showAlways: false, note: 'อัปเดต Server', updated: '28/04/2025' },
    { id: 8, title: 'ประกาศรับสมัครพนักงานใหม่', categoryId: '2', locationId: '1', start: '01/06/2025', end: '30/06/2025', statusId: "1", showAlways: false, note: 'ฝ่ายปฏิบัติการ', updated: '20/05/2025' },
    { id: 9, title: 'อบรมการใช้ไฟฟ้าอย่างปลอดภัย', categoryId: '2', locationId: '2', start: '15/07/2025', end: '15/07/2025', statusId: "1", showAlways: false, note: 'สัมมนาออนไลน์', updated: '01/07/2025' },
    { id: 10, title: 'วันขึ้นปีใหม่ 2027', categoryId: '1', locationId: '1', start: '31/12/2026', end: '01/01/2027', statusId: "2", showAlways: false, note: 'เฉลิมฉลองปีใหม่', updated: '15/12/2026' },
  ]);

  const [appliedFilters, setAppliedFilters] = useState<Partial<FilterInputs>>({});

  // เพิ่ม State นี้เข้าไปข้างๆ page
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);



  // 3. Logic การลบ
  const handleDelete = (id: number) => {
    if (window.confirm('คุณต้องการลบประกาศนี้ใช่หรือไม่?')) {
      setAnnouncements(prev => prev.filter(item => item.id !== id));
    }
  };

  // 4. Submit Handler สำหรับค้นหา
  const onSearchSubmit = (data: FilterInputs) => {
    setAppliedFilters(data);
    setPage(1);
  };

  const handleRefresh = () => {
    reset(); // Reset form values สู่ default
    setAppliedFilters({});
    setPage(1);
  };

  // 5. Logic การกรองข้อมูล (รองรับทุก Field)
  const filteredRows = useMemo(() => {
    return announcements.filter(row => {
      // ค้นหาจากชื่อประกาศ (Search Term)
      const matchSearch = row.title.toLowerCase().includes((appliedFilters.searchTerm || '').toLowerCase());
      // ค้นหาจากสถานที่ (Location) - สมมติว่าเปรียบเทียบกับ category หรือ field ที่เกี่ยวข้อง
      const matchLocation = appliedFilters.location ? row.locationId === appliedFilters.location : true;

      const matchStatus = appliedFilters.status ? row.statusId === appliedFilters.status : true;

      const matchcategory = appliedFilters.category ? row.categoryId === appliedFilters.category : true;

      // ค้นหาจากช่วงวันที่ (Date Range)
      // แปลงวันที่จาก string "DD/MM/YYYY" เป็น Date Object เพื่อเปรียบเทียบ
      const parseDate = (dateStr: string) => {
        const [day, month, year] = dateStr.split('/').map(Number);
        return new Date(year, month - 1, day);
      };

      const rowStartDate = parseDate(row.start);
      const filterStart = appliedFilters.startDate ? new Date(appliedFilters.startDate) : null;
      const filterEnd = appliedFilters.endDate ? new Date(appliedFilters.endDate) : null;

      const matchStartDate = filterStart ? rowStartDate >= filterStart : true;
      const matchEndDate = filterEnd ? rowStartDate <= filterEnd : true;

      // ต้องผ่านเงื่อนไขทุกข้อ
      return matchSearch && matchStatus && matchLocation && matchStartDate && matchEndDate && matchcategory;
    });
  }, [appliedFilters, announcements]);

  const displayedRows = useMemo(() => {
    const startIndex = (page - 1) * rowsPerPage;
    return filteredRows.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredRows, page, rowsPerPage]);

  const handleReorderInFiltered = (currentId: number, targetIndexInFiltered: number) => {
    setAnnouncements((prev) => {
      const newData = [...prev];

      // 1. หาตำแหน่งของแถวที่จะย้ายใน Array หลัก
      const currentIndexInMain = newData.findIndex(item => item.id === currentId);

      // 2. หาข้อมูลของแถวที่เป็น 'เป้าหมาย' จากรายการที่กรองแล้ว
      const targetItemInFiltered = filteredRows[targetIndexInFiltered];

      // 3. หาตำแหน่งของแถวเป้าหมายนั้นใน Array หลัก
      const targetIndexInMain = newData.findIndex(item => item.id === targetItemInFiltered.id);

      if (currentIndexInMain !== -1 && targetIndexInMain !== -1) {
        // 4. ดึงออกแล้วแทรกใหม่ (Move)
        const [movedItem] = newData.splice(currentIndexInMain, 1);
        newData.splice(targetIndexInMain, 0, movedItem);
      }

      return newData;
    });
  };

  return (
    <>
      <Navbar></Navbar>
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
                          <MenuItem value="1">โรงเเรม1</MenuItem>
                          <MenuItem value="2">โรงเเรม2</MenuItem>
                        </Select>
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid size={3}>
                  <Controller
                    name="category"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth size="small">
                        <Select {...field} displayEmpty>
                          <MenuItem value="">ประเภทประกาศ</MenuItem>
                          <MenuItem value="1">วันสำคัญ</MenuItem>
                          <MenuItem value="2">ประกาศ</MenuItem>
                          <MenuItem value="3">เเจ้งเตือน</MenuItem>
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
                          <MenuItem value="1">ใช้งาน</MenuItem>
                          <MenuItem value="2">ไม่ใช้งาน</MenuItem>
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
                      <TableCell>
                        <FormControl size="small">
                          <Select
                            // 1. หาตำแหน่งของแถวนี้ในรายการที่ 'กรองแล้ว'
                            value={filteredRows.findIndex(item => item.id === row.id)}
                            onChange={(e) => {
                              const newIndex = Number(e.target.value);
                              // เรียกฟังก์ชันย้ายตำแหน่งโดยอิงจากรายการที่กรอง
                              handleReorderInFiltered(row.id, newIndex);
                            }}
                            sx={{ minWidth: 60 }}
                          >
                            {/* 2. วนลูปสร้างตัวเลขตามจำนวนที่ 'กรองได้จริง' เท่านั้น */}
                            {filteredRows.map((_, index) => (
                              <MenuItem key={index} value={index}>
                                {index + 1}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </TableCell>
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
                          color: row.statusId === '1' ? '#2ECC71' : '#E74C3C',
                          fontWeight: '500'
                        }}>
                          {row.statusId === '1' ? 'ใช้งาน' : 'ไม่ใช้งาน'}
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

              <Controller
                name="rowpage"
                control={control}
                render={({ field }) => (
                  <FormControl size="small">
                    <Select
                      {...field}
                      onChange={(e) => {
                        const newSize = Number(e.target.value);
                        field.onChange(e);      // 1. อัปเดตค่าใน react-hook-form
                        setRowsPerPage(newSize); // 2. อัปเดต State เพื่อให้ตารางเปลี่ยนทันที
                        setPage(1);             // 3. รีเซ็ตกลับไปหน้าแรก (กัน Error กรณีหน้าเกิน)
                      }}
                    >
                      <MenuItem value="5">5</MenuItem>
                      <MenuItem value="10">10</MenuItem>
                      <MenuItem value="25">25</MenuItem>
                      <MenuItem value="50">50</MenuItem>
                      <MenuItem value="100">100</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Box>
          </Paper>
        </Container>
      </Box>
    </>
  );
}