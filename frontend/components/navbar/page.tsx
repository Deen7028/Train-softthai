'use client';

import * as React from 'react';
import {
    AppBar,
    Box,
    Toolbar,
    Typography,
    Container,
    Button,
    Stack
} from '@mui/material';
import AdbIcon from '@mui/icons-material/Adb';

const navItems = ['หน้าแรก', 'ตารางเรียน', 'ผู้ดูแลระบบ', 'ประวัติการจอง', 'กามารุดิง'];

export default function Navbar() {
    return (
        <AppBar
            position="sticky"
            elevation={0}
            sx={{
                backgroundColor: 'blue',
                borderBottom: '1px solid',
                borderColor: 'divider',
                color: 'white',
            }}
        >
            <Container maxWidth="lg">
                    <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>


                        <Stack direction="row" alignItems="center" spacing={1} sx={{ cursor: 'pointer' }}>
                            <Typography
                                variant="h6"
                                noWrap
                                sx={{
                                    fontWeight: 700,
                                    letterSpacing: '.1rem',
                                    color: 'white',
                                    textDecoration: 'none',
                                }}
                            >
                                MCS Booking
                            </Typography>
                        </Stack>

                        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
                            {navItems.map((item) => (
                                <Button
                                    key={item}
                                    sx={{
                                        color: 'white',
                                        fontWeight: '500'
                                        
                                    }}
                                >
                                    {item}
                                </Button>
                            ))}
                        </Box>
                    </Toolbar>
            </Container>
        </AppBar>
    );
}