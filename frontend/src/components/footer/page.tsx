import { Box, Typography, Container } from '@mui/material';

export default function Footer() {
    return (
        <Box
            component="footer"
            sx={{
                bgcolor: 'blue',
                py: 3,
                textAlign: 'center',
                mt: 'auto',
                color: 'white',
            }}
        >
            <Container maxWidth="lg">
                <Typography variant="body2" sx={{ m: 0 }}>
                    Web Application Developer Module
                </Typography>
            </Container>
        </Box>
    );
}