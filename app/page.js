import Image from "next/image";
import getStripe from "./utils/get-stripe";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { AppBar, Container, Grid, Toolbar, Typography, Box, Button } from "@mui/material";
import Head from 'next/head'

export default function Home() {
  return (
    <Container maxWidth="100vw">
      <Head>
        <title>Flashcard</title>
        <meta name="description" content="Create flashcard from your text" />
      </Head>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Flashcard
          </Typography>
          <SignedOut>
            <Button color="inherit" href="/sign-in">Login</Button>
            <Button color="inherit" href="/sign-up">Sign Up</Button>
          </SignedOut>
          <SignedIn>
            <UserButton></UserButton>
          </SignedIn>
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: 'calc(65vh - 64px)',
          textAlign: 'center',
        }}
      >
        <Typography variant="h2">Welcome to Flashcard</Typography>
        <Typography variant="h5" sx={{ mt: 2 }}>
          The easiest way to make educational flashcards from your text!
        </Typography>
        <Button variant="contained" color="primary" sx={{ mt: 4 }}>
          Get Started
        </Button>
      </Box>
      <Grid container spacing={4} justifyContent="center">
        <Box
          sx={{
            p: 3,
            width: '100%',
            textAlign: 'center',
          }}
        >
          <Typography variant="h4">Pricing</Typography>
        </Box>

        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} sm={10} md={5}>
            <Box
              sx={{
                p: 4,
                border: '1px solid gray',
                borderRadius: 2,
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '100%',
              }}
            >
              <Typography variant="h4">Basic Plan</Typography>
              <Typography variant="h5">$5 / month</Typography>
              <Typography>
                Access to basic flashcard features and limited storage.
              </Typography>
              <Button variant="contained" color="primary" sx={{ mt: 2 }}>
                Choose Basic
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12} sm={10} md={5}>
            <Box
              sx={{
                p: 4,
                border: '1px solid gray',
                borderRadius: 2,
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '100%',
              }}
            >
              <Typography variant="h4">Premium Plan</Typography>
              <Typography variant="h5">$10 / month</Typography>
              <Typography>
                Unlimited flashcards and storage with priority support.
              </Typography>
              <Button variant="contained" color="primary" sx={{ mt: 2 }}>
                Choose Premium
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}