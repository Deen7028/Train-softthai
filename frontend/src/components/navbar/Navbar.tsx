'use client';

import * as React from 'react';
import {
    AppBar,
    Box,
    Toolbar,
    Typography,
    Container,
    Button,
    Stack,
    colors
} from '@mui/material';
import AdbIcon from '@mui/icons-material/Adb';
import Link from 'next/link';


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
                            Train SoftThai
                        </Typography>
                    </Stack>

                    <Box sx={{ display: { md: 'flex' }, gap: 2 }}>
                        <Link href="/manual" passHref>
                            <Button sx={{ color: "white", fontFamily: "'Prompt', sans-serif", fontSize: 16, fontWeight: 400 }}>จัดการคู่มือ</Button>
                        </Link>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}