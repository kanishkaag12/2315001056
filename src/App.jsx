import React, { useState } from 'react';
import { Container, Button, Typography, AppBar, Toolbar } from '@mui/material';
import NotificationsPage from './NotificationsPage';
import PriorityPage from './PriorityPage';

function App() {
  const [page, setPage] = useState('all');

  return (
    <Container maxWidth="md" style={{ marginTop: '20px' }}>
      <AppBar position="static" style={{ marginBottom: '20px' }}>
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Campus Notifications
          </Typography>
          <Button 
            color="inherit" 
            onClick={() => setPage('all')} 
            style={{ fontWeight: page === 'all' ? 'bold' : 'normal' }}
          >
            All Notifications
          </Button>
          <Button 
            color="inherit" 
            onClick={() => setPage('priority')} 
            style={{ fontWeight: page === 'priority' ? 'bold' : 'normal' }}
          >
            Priority Notifications
          </Button>
        </Toolbar>
      </AppBar>
      
      {/* Switch pages using React state */}
      {page === 'all' ? <NotificationsPage /> : <PriorityPage />}
    </Container>
  );
}

export default App;
