import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import StarIcon from '@mui/icons-material/StarBorder';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import GlobalStyles from '@mui/material/GlobalStyles';
import Container from '@mui/material/Container';
import { useAuth0 } from '@auth0/auth0-react';
import Phone from './Phone';

function Features() {
    
    const features = [
        {
            title: "Professional Call Answer"
        },
        {
            title: "Voicemail 2 Email"
        },
        {
            title: "Call Redirect"
        },
        {
            title: "Intelligent Call Routing"
        },
        {
            title: "Schedule Holiday/Custom Greeting"
        },
        {
            title: "Route call to Cellphone"
        },
    ]
    
    return (
    <div>
        
        <Container maxWidth="sm" component="main" sx={{ pt: 8, pb: 6 }}>



                <Typography
                    component="h1"
                    variant="h2"
                    align="center"
                    color="text.primary"
                    gutterBottom
                >
                    Features
                </Typography>

            </Container>

            <Container maxWidth="md" component="main">
                <Grid container spacing={5} alignItems="flex-end">
                    {
                        features.map((feature) => (
                            <Grid
                                item
                                key={feature.title}
                                sm={12}
                                md={6}
                            >
                                <Card>
                                    <CardHeader
                                        title={feature.title}
                                        titleTypographyProps={{ align: 'center' }}
                                        action={"tier.title" === 'Pro' ? <StarIcon /> : null}
                                        subheaderTypographyProps={{
                                            align: 'center',
                                        }}
                                        sx={{
                                            backgroundColor: (theme) =>
                                                theme.palette.mode === 'light'
                                                    ? theme.palette.grey[200]
                                                    : theme.palette.grey[700],
                                        }}
                                    />
                                    <CardContent>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'baseline',
                                                mb: 2,
                                            }}
                                        >
                                            <Typography component="h2" variant="h3" color="text.primary">


                                            </Typography>
                                        </Box>
                                        <ul>


                                        </ul>
                                    </CardContent>
                                    <CardActions>


                                    </CardActions>
                                </Card>
                            </Grid>
                        )
                        )
                    }
                </Grid>
            </Container>
    </div>
  )
}

export default Features