import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography,Paper } from '@mui/material';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const goToRepositories = () => {
    navigate('/repositories');
  };

  return (
    <Box
    sx={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #f5f7fa, #c3cfe2)', // Soft gradient background
      padding: 2,
    }}
  >
    <Paper
      elevation={4}
      sx={{
        padding: 4,
        borderRadius: 4,
        maxWidth: 500,
        textAlign: 'center',
        background: '#ffffff',
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        Repository Manager
      </Typography>
      <Typography variant="body1" color="textSecondary" gutterBottom>
        Effortlessly track and manage your GitHub repositories. Get started now!
      </Typography>
      <Button
        variant="contained"
        color="primary"
        size="large"
        onClick={goToRepositories}
        sx={{
          mt: 3,
          padding: '10px 20px',
          fontSize: '1rem',
          borderRadius: '8px',
          background: 'linear-gradient(45deg, #2196f3, #21cbf3)', // Button gradient
          boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
        }}
      >
        Manage Repositories
      </Button>
    </Paper>
  </Box>
  );
};

export default HomePage;
