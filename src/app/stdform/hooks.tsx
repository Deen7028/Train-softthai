'use client';

import { Dayjs } from 'dayjs';
import { useState } from 'react';
import { SelectChangeEvent } from '@mui/material';

const thaiAddressData: Record<string, Record<string, Record<string, string>>> = {
    "กรุงเทพมหานคร": {
        "เขตพญาไท": { "สามเสนใน": "10400" },
        "เขตดินแดง": { "ดินแดง": "10400", "รัชดาภิเษก": "10400" }
    },
    "เชียงใหม่": {
        "เมืองเชียงใหม่": { "ช้างเผือก": "50300", "พระสิงห์": "50200" },
        "หางดง": { "หางดง": "50230", "หนองควาย": "50230" }
    },
    "ภูเก็ต": {
        "เมืองภูเก็ต": { "ตลาดใหญ่": "83000", "ตลาดเหนือ": "83000" },
        "ถลาง": { "เทพกระษัตรี": "83110", "ศรีสุนทร": "83110" }
    }
};

export default function StdHook() {
    const [birthDate, setBirthDate] = useState<Dayjs | null>(null);

    const [province, setProvince] = useState('');
    const [district, setDistrict] = useState('');
    const [subDistrict, setSubDistrict] = useState('');
    const [zipcode, setZipcode] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const provinces = Object.keys(thaiAddressData);
    const districts = province ? Object.keys(thaiAddressData[province]) : [];
    const subDistricts = (province && district) ? Object.keys(thaiAddressData[province][district]) : [];

    const handleProvinceChange = (e: SelectChangeEvent<string>) => {
        setProvince(e.target.value);
        setDistrict('');
        setSubDistrict('');
        setZipcode('');
    };

    const handleDistrictChange = (e: SelectChangeEvent<string>) => {
        setDistrict(e.target.value);
        setSubDistrict('');
        setZipcode('');
    };

    const handleSubDistrictChange = (e: SelectChangeEvent<string>) => {
        const selectedSubDistrict = e.target.value;
        setSubDistrict(selectedSubDistrict);
        if (province && district && selectedSubDistrict) {
            setZipcode(thaiAddressData[province][district][selectedSubDistrict]);
        }
    };

    return {
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
    };
}