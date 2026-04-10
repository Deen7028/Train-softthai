'use client';

import {
    Box,
    TextField,
    Button,
    Typography,
    Paper,
    Container,
    Grid,

} from '@mui/material';

export default function RegisterForm() {
    return (
        <Container maxWidth="xs" sx={{ mb: 4 }}>
            <Paper elevation={3} sx={{ mt: 10, borderRadius: 2 }}>
                <Paper elevation={3} sx={{ p: 4, backgroundColor: 'blue' }}>
                    <Typography variant="h5" align="center" gutterBottom sx={{ color: 'white' }}>
                        สมาชักสมาชิก
                    </Typography>
                    <Typography variant="body2" align="center" gutterBottom sx={{ color: 'white' }}>
                        ระบบจะสุ่มรหัสผ่านส่งไปยังอีเมลของคุณ
                    </Typography>
                </Paper>
                <Box component="form" noValidate sx={{ mt: 1, p: 4 }}>
                    <Grid container spacing={2}>
                        <Grid size={6}>

                            <TextField
                                slotProps={{
                                    htmlInput: {
                                        "aria-label": "ชื่อ"
                                    }
                                }}
                                type="text"
                                fullWidth
                                variant="outlined"
                                placeholder="ชื่อ"
                            />
                        </Grid>
                        <Grid size={6}>

                            {/* <TextField
                                fullWidth
                                label="นามสกุล"
                                type="text"
                                variant="outlined"

                            /> */}
                        </Grid>
                        <Grid size={12}>


                            <TextField
                                fullWidth
                                type="text"
                                id='xx'
                                variant="outlined"
                            // labelProps={{
                            //     text: 'ชื่อผู้ใช้'
                            // }}
                            />
                        </Grid>
                        <Grid size={12}>

                            <TextField
                                fullWidth
                                label="อีเมล"
                                type="email"
                                variant="outlined"

                            />
                            <Typography variant="body2" align="left" gutterBottom>
                                รหัสผ่านจะถูกสุ่มและส่งไปยังอีเมลของคุณ
                            </Typography>
                        </Grid>

                        <Grid size={12}>
                            <Button
                                fullWidth
                                variant="contained"
                                size="large"
                                sx={{ mt: 2, py: 1.5, borderRadius: '35px' }}
                                color="primary"

                            >
                                Sign In
                            </Button>
                        </Grid>

                        <Grid size={12}>
                            <Typography variant="body2" align="center" color="text.secondary">
                                Don&apos;t have an account? Register
                            </Typography>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </Container>
    );
}