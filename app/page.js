"use client";

import { useRouter } from 'next/navigation';
import { SignedIn, SignedOut, UserButton, useUser } from '@clerk/nextjs';
import { AppBar, Container, Grid, Toolbar, Typography, Box, Button } from '@mui/material';
import getStripe from "./utils/get-stripe";
import Head from 'next/head';
import Link from 'next/link'; 

export default function Home() {
  const router = useRouter();
  const { isSignedIn } = useUser();

  const handleGetStartedClick = () => {
    if (isSignedIn) {
      router.push('/generate');
    } else {
      router.push('/sign-in'); 
    }
  };

  const handleSubmit = async (plan) => {
    try {
      const response = await fetch('/api/generate/checkout_session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ plan }),
      });
  
      const checkoutSession = await response.json();
      if (response.ok) {
        const stripe = await getStripe();
        const { error } = await stripe.redirectToCheckout({
          sessionId: checkoutSession.id,
        });
  
        if (error) {
          console.warn(error.message);
        }
      } else {
        console.error(checkoutSession.error.message);
      }
    } catch (err) {
      console.error('An error occurred:', err);
    }
  };
  

  return (
    <Container maxWidth="100vw">
      <Head>
        <title>Flashcard</title>
        <meta name="description" content="Create flashcards from your text" />
      </Head>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Flashcard
          </Typography>
          <SignedOut>
            <Button color="inherit" component={Link} href="/sign-in">Login</Button>
            <Button color="inherit" component={Link} href="/sign-up">Sign Up</Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
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
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 4 }}
          onClick={handleGetStartedClick}
        >
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
              <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={() => handleSubmit('basic')}>
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
              <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={() => handleSubmit('premium')}>
                Choose Premium
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}