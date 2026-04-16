import React from 'react';
import { Box, Typography, Container } from '@mui/material';

export default function Footer() {
    return (
        <Box
            component="footer"
            sx={{
                bgcolor: '#1976D2', 
                py: 3, 
                textAlign: 'center',
                mt: 'auto', 
            }}
        >
            <Container maxWidth="lg">
                <Typography variant="body2" sx={{ color: 'white', m: 0 }}>
                    Web Application Developer Module
                </Typography>
            </Container>
        </Box>
    );
}