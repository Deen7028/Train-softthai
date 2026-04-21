'use client';
import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
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

  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [status, setStatus] = useState<any[]>([]);
  const [typePost, setTypePost] = useState<any[]>([]);
  const [appliedFilters, setAppliedFilters] = useState<Partial<FilterInputs>>({});
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const fetchData = async () => {
    try {
      const res = await fetch(`http://localhost:5071/api/user`, {
        cache: 'no-store'
      });

      if (!res.ok) throw new Error('Network response was not ok');

      const response = await res.json();
      console.log("Data loaded:", response);
      setAnnouncements(response);
    } catch (error) {
      console.error("Fetch Error:", error);
    }
  };

  const fetchLocations = async () => {
    try {
      const res = await fetch(`http://localhost:5071/api/user/GetLocation`);
      if (res.ok) {
        const data = await res.json();
        setLocations(data);
      }
    } catch (error) {
      console.error("Fetch Locations Error:", error);
    }
  };

  const fetchstatus = async () => {
    try {
      const res = await fetch(`http://localhost:5071/api/user/GetStatus`);
      if (res.ok) {
        const data = await res.json();
        setStatus(data);
      }
    } catch (error) {
      console.error("Fetch Status Error:", error);
    }
  };

  const fetchTypePost = async () => {
    try {
      const res = await fetch(`http://localhost:5071/api/user/GetTypePost`);
      if (res.ok) {
        const data = await res.json();
        setTypePost(data);
      }
    } catch (error) {
      console.error("Fetch Type Post Error:", error);
    }
  };


  useEffect(() => {
    fetchData();
    fetchLocations();
    fetchstatus();
    fetchTypePost();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("คุณแน่ใจหรือไม่ว่าต้องการลบประกาศนี้?")) return;

    try {
      const res = await fetch(`http://localhost:5071/api/user/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        alert("ลบข้อมูลสำเร็จ!");
        window.location.reload();
      } else {
        alert("ไม่สามารถลบข้อมูลได้");
      }
    } catch (error) {
      console.error("Delete Error:", error);
    }
  };

  const onSearchSubmit = (data: FilterInputs) => {
    setAppliedFilters(data);
    setPage(1);
  };

  const handleRefresh = () => {
    reset();
    setAppliedFilters({});
    setPage(1);
  };

  const filteredRows = useMemo(() => {
    if (!Array.isArray(announcements)) return [];
    return announcements.filter(row => {

      const matchSearch = (row.sTitle || '').toLowerCase().includes((appliedFilters.searchTerm || '').toLowerCase());

      const matchStatus = appliedFilters.status ? Number(row.nStatusId) === Number(appliedFilters.status) : true;

      const matchLocation = appliedFilters.location ? Number(row.nLocationId) === Number(appliedFilters.location) : true;

      const matchCategory = appliedFilters.category ? Number(row.nTypePostId) === Number(appliedFilters.category) : true;

      const rowStartDate = row.dStartDate ? new Date(row.dStartDate) : null;
      const filterStart = appliedFilters.startDate ? new Date(appliedFilters.startDate) : null;
      const filterEnd = appliedFilters.endDate ? new Date(appliedFilters.endDate) : null;

      if (filterStart) filterStart.setHours(0, 0, 0, 0);
      if (filterEnd) filterEnd.setHours(23, 59, 59, 999);

      const matchStartDate = (filterStart && rowStartDate) ? rowStartDate >= filterStart : true;
      const matchEndDate = (filterEnd && rowStartDate) ? rowStartDate <= filterEnd : true;

      return matchSearch && matchStatus && matchLocation && matchCategory && matchStartDate && matchEndDate;
    });
  }, [appliedFilters, announcements]);

  const displayedRows = useMemo(() => {
    const startIndex = (page - 1) * rowsPerPage;
    return filteredRows.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredRows, page, rowsPerPage]);

  const handleReorderInFiltered = (currentId: number, targetIndexInFiltered: number) => {
    setAnnouncements((prev) => {
      const newData = [...prev];
      const currentIndexInMain = newData.findIndex(item => item.nId === currentId);
      const targetItemInFiltered = filteredRows[targetIndexInFiltered];
      const targetIndexInMain = newData.findIndex(item => item.nId === targetItemInFiltered.nId);

      if (currentIndexInMain !== -1 && targetIndexInMain !== -1) {
        const [movedItem] = newData.splice(currentIndexInMain, 1);
        newData.splice(targetIndexInMain, 0, movedItem);
      }
      return newData;
    });
  };


  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = filteredRows.map(row => row.nId);
      setSelectedIds(allIds);
    } else {
      setSelectedIds([]);
    }
  };

  // ติ๊กเลือกทีละตัว
  const handleSelectOne = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedIds(prev => [...prev, id]);
    } else {
      setSelectedIds(prev => prev.filter(item => item !== id));
    }
  };

  return (
    <Box sx={{ bgcolor: '#F4F4F4', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="xl" sx={{ mt: 5 }}>
        <Paper sx={{ p: 3, borderRadius: 4, boxShadow: '0px 4px 20px rgba(0,0,0,0.05)' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
            จัดการประกาศ
          </Typography>

          <form onSubmit={handleSubmit(onSearchSubmit)}>
            <Grid container spacing={2} sx={{ mb: 4 }}>
              <Grid size={4}>
                <TextField fullWidth size="small" placeholder="ค้นหาชื่อประกาศ..." {...register('searchTerm')} />
              </Grid>
              <Grid size={4}>
                <TextField fullWidth size="small" type="date" label="วันที่เริ่มต้น" InputLabelProps={{ shrink: true }} {...register('startDate')} />
              </Grid>
              <Grid size={4}>
                <TextField fullWidth size="small" type="date" label="วันที่สิ้นสุด" InputLabelProps={{ shrink: true }} {...register('endDate')} />
              </Grid>

              <Grid size={3}>
                <Controller name="location" control={control} render={({ field }) => (
                  <FormControl fullWidth size="small">
                    <Select {...field} displayEmpty>
                      <MenuItem value="">สถานที่</MenuItem>
                      {locations.map((loc) => (
                        <MenuItem key={loc.nLocationId} value={loc.nLocationId.toString()}>
                          {loc.sLocationName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )} />
              </Grid>
              <Grid size={3}>
                <Controller name="category" control={control} render={({ field }) => (
                  <FormControl fullWidth size="small">
                    <Select {...field} displayEmpty>
                      <MenuItem value="">ประเภทประกาศ</MenuItem>
                      {typePost.map((type) => (
                        <MenuItem key={type.nTypePostId} value={type.nTypePostId.toString()}>
                          {type.sTypeName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )} />
              </Grid>
              <Grid size={3}>
                <Controller name="status" control={control} render={({ field }) => (
                  <FormControl fullWidth size="small">
                    <Select {...field} displayEmpty>
                      <MenuItem value="">สถานะ</MenuItem>
                      {status.map((st) => (
                        <MenuItem key={st.nStatusId} value={st.nStatusId.toString()}>
                          {st.sStatusName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )} />
              </Grid>

              <Grid size={3} sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                <Button variant="outlined" onClick={handleRefresh} sx={{ minWidth: 40, borderColor: '#DDD', color: '#333' }}>
                  <RefreshIcon fontSize="small" />
                </Button>
                <Button type="submit" variant="contained" sx={{ bgcolor: primaryColor, '&:hover': { bgcolor: '#4A1435' } }}>
                  <SearchIcon fontSize="small" />
                </Button>
              </Grid>
            </Grid>
          </form>

          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: '#F9FAFB' }}>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      size="small"
                      indeterminate={selectedIds.length > 0 && selectedIds.length < filteredRows.length}
                      checked={filteredRows.length > 0 && selectedIds.length === filteredRows.length}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                    />
                  </TableCell>
                  <TableCell>ที่ ↓</TableCell>
                  <TableCell align="center">
                    <IconButton size="small" color="primary" component={Link} href="/noticeE/addEdit">
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
                    <TableRow key={row.nId} hover>
                      <TableCell padding="checkbox">
                        <Checkbox
                          size="small"
                          checked={selectedIds.includes(row.nId)}
                          onChange={(e) => handleSelectOne(row.nId, e.target.checked)}
                        />
                      </TableCell>
                      <TableCell>
                        <FormControl size="small">
                          <Select
                            value={filteredRows.findIndex(item => item.nId === row.nId)}
                            onChange={(e) => handleReorderInFiltered(row.nId, Number(e.target.value))}
                            sx={{ minWidth: 60 }}
                          >
                            {filteredRows.map((_, index) => (
                              <MenuItem key={index} value={index}>{index + 1}</MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </TableCell>
                      <TableCell align="center">
                        <IconButton size="small" component={Link} href={`/noticeE/addEdit?id=${row.nId}`}>
                          <EditIcon fontSize="small" sx={{ color: '#F1C40F' }} />
                        </IconButton>
                      </TableCell>

                      <TableCell>{row.sTitle}</TableCell>
                      <TableCell>{row.dStartDate ? new Date(row.dStartDate).toLocaleDateString() : '-'}</TableCell>
                      <TableCell>{row.dEndDate ? new Date(row.dEndDate).toLocaleDateString() : '-'}</TableCell>

                      <TableCell>
                        <Box sx={{
                          color: Number(row.nStatusId) === 1 ? '#2ECC71' : '#E74C3C',
                          fontWeight: '500'
                        }}>
                          {Number(row.nStatusId) === 1 ? 'ใช้งาน' : 'ไม่ใช้งาน'}
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <IconButton onClick={() => handleDelete(row.nId)}>
                          <DeleteIcon fontSize="small" color="error" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 3 }}>ไม่พบข้อมูลที่ค้นหา</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 2 }}>
            <Pagination
              count={Math.ceil(filteredRows.length / rowsPerPage)}
              page={page}
              onChange={(_, value) => setPage(value)}
              shape="rounded"
              size="small"
            />
            <Controller name="rowpage" control={control} render={({ field }) => (
              <FormControl size="small">
                <Select
                  {...field}
                  onChange={(e) => {
                    const newSize = Number(e.target.value);
                    field.onChange(e);
                    setRowsPerPage(newSize);
                    setPage(1);
                  }}
                >
                  <MenuItem value="5">5</MenuItem>
                  <MenuItem value="10">10</MenuItem>
                  <MenuItem value="25">25</MenuItem>
                </Select>
              </FormControl>
            )} />
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}