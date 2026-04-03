'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form'; 



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
      rowpage: "5"
    }
  });



  // 2. State สำหรับข้อมูลหลัก และ Search Criteria หลังกด Search
  const [announcements, setAnnouncements] = useState([
    { id: 1, title: 'วันพ่อแห่งชาติ', categoryId: '1', locationId: '1', peaCode: 'BKK01', start: '01/12/2026', end: '06/12/2026', statusId: "1", status: 'ใช้งาน', showAlways: false, note: 'จัดกิจกรรมเฉลิมพระเกียรติ', updated: '13/02/2026' },
    { id: 2, title: 'วันแม่แห่งชาติ', categoryId: '1', locationId: '1', peaCode: 'BKK02', start: '01/08/2025', end: '13/08/2025', statusId: "1", status: 'ใช้งาน', showAlways: false, note: 'กิจกรรมวันแม่', updated: '14/02/2025' },
    { id: 3, title: 'ประกาศดับไฟซ่อมบำรุง (เขต 1)', categoryId: '2', locationId: '2', peaCode: 'NRT01', start: '15/03/2025', end: '15/03/2025', statusId: "1", status: 'ใช้งาน', showAlways: false, note: 'ซ่อมบำรุงเสาไฟฟ้า', updated: '15/02/2025' },
    { id: 4, title: 'ย้ายจุดติดตั้งมิเตอร์ไฟฟ้า', categoryId: '2', locationId: '2', peaCode: 'NRT02', start: '20/03/2025', end: '21/03/2025', statusId: "1", status: 'ใช้งาน', showAlways: false, note: 'ปรับปรุงระบบสายส่ง', updated: '16/02/2025' },
    { id: 5, title: 'แจ้งเตือนพายุฤดูร้อน', categoryId: '3', locationId: '1', peaCode: 'BKK03', start: '05/04/2026', end: '07/04/2026', statusId: "1", status: 'ใช้งาน', showAlways: true, note: 'เฝ้าระวังระบบจ่ายไฟ', updated: '01/04/2026' },
    { id: 6, title: 'วันสงกรานต์ 2026', categoryId: '1', locationId: '2', peaCode: 'NRT03', start: '13/04/2026', end: '17/04/2026', statusId: "1", status: 'ใช้งาน', showAlways: false, note: 'วันหยุดนักขัตฤกษ์', updated: '10/03/2026' },
    { id: 7, title: 'ปิดปรับปรุงระบบชำระเงินชั่วคราว', categoryId: '3', locationId: '1', peaCode: 'SYS01', start: '01/05/2025', end: '01/05/2025', statusId: "2", status: 'ไม่ใช้งาน', showAlways: false, note: 'อัปเดต Server', updated: '28/04/2025' },
    { id: 8, title: 'ประกาศรับสมัครพนักงานใหม่', categoryId: '2', locationId: '1', peaCode: 'HR001', start: '01/06/2025', end: '30/06/2025', statusId: "1", status: 'ใช้งาน', showAlways: false, note: 'ฝ่ายปฏิบัติการ', updated: '20/05/2025' },
    { id: 9, title: 'อบรมการใช้ไฟฟ้าอย่างปลอดภัย', categoryId: '2', locationId: '2', peaCode: 'NRT04', start: '15/07/2025', end: '15/07/2025', statusId: "1", status: 'ใช้งาน', showAlways: false, note: 'สัมมนาออนไลน์', updated: '01/07/2025' },
    { id: 10, title: 'วันขึ้นปีใหม่ 2027', categoryId: '1', locationId: '1', peaCode: 'BKK01', start: '31/12/2026', end: '01/01/2027', statusId: "2", status: 'ไม่ใช้งาน', showAlways: false, note: 'เฉลิมฉลองปีใหม่', updated: '15/12/2026' },
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

      // ค้นหาจากสถานะ (Status)

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

  return {
    primaryColor,
    router,
    setAnnouncements,
    announcements,
    reset,
    setPage,page,setAppliedFilters,appliedFilters,
  };
}