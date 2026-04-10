'use client';

import {
    Box,
    TextField,
    Button,
    Typography,
    Paper,
    Container,
    Grid,
    Link
} from '@mui/material';

import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import PersonIcon from '@mui/icons-material/Person';
export default function LoginForm() {
    return (
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ p: 4, mt: 10, borderRadius: 2 }}>
                <Typography variant="h5" align="center" gutterBottom sx={{ fontWeight: 'bold' }}>
                    <PersonAddAlt1Icon sx={{ mr: 1 }} />
                    Login
                </Typography>

                <Box component="form" noValidate sx={{ mt: 1 }}>
                    <Grid container spacing={2}>
                        <TextField
                            fullWidth
                            placeholder="Email Address"
                            variant="outlined"
                        />

                        <TextField
                            fullWidth
                            placeholder="Password"
                            type="password"
                            variant="outlined"
                        />

                        <Button
                            fullWidth
                            variant="contained"
                            size="large"
                            sx={{ mt: 2, py: 1.5 }}
                        >
                            Sign In
                        </Button>

                        <Typography variant="body2" align="center" color="text.secondary">
                            Don&apos;t have an account? <Link href="/register" sx={{ textDecoration: 'underline' ,color: 'primary' }}>Register</Link>
                        </Typography>
                    </Grid>
                </Box>
            </Paper>


        </Container>
    );
}