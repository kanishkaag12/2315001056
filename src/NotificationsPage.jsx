import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, CircularProgress, Alert, Select, MenuItem, FormControl, InputLabel, Box } from '@mui/material';

function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('All');
  const [viewedIds, setViewedIds] = useState(() => {
    return JSON.parse(localStorage.getItem('viewedNotifications') || '[]');
  });

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const mockData = [
          { ID: "1", Type: "Placement", Message: "Google Hiring", Timestamp: "2026-04-22 17:51:18" },
          { ID: "2", Type: "Result", Message: "Mid Sem Results", Timestamp: "2026-04-22 17:50:18" },
          { ID: "3", Type: "Event", Message: "Tech Fest", Timestamp: "2026-04-22 17:49:18" }
        ];
        setNotifications(mockData);
      } catch (err) {
        setError('Failed to fetch notifications. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const handleCardClick = (id) => {
    if (!viewedIds.includes(id)) {
      const newViewed = [...viewedIds, id];
      setViewedIds(newViewed);
      localStorage.setItem('viewedNotifications', JSON.stringify(newViewed));
    }
  };

  const filteredNotifications = notifications.filter(n => filter === 'All' || n.Type === filter);

  if (loading) return <CircularProgress style={{ display: 'block', margin: '20px auto' }} />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box>
      <FormControl fullWidth style={{ marginBottom: '20px' }}>
        <InputLabel>Filter by Type</InputLabel>
        <Select 
          value={filter} 
          label="Filter by Type" 
          onChange={(e) => setFilter(e.target.value)}
        >
          <MenuItem value="All">All</MenuItem>
          <MenuItem value="Placement">Placement</MenuItem>
          <MenuItem value="Result">Result</MenuItem>
          <MenuItem value="Event">Event</MenuItem>
        </Select>
      </FormControl>

      {filteredNotifications.map((notif) => {
        const isViewed = viewedIds.includes(notif.ID);
        return (
          <Card 
            key={notif.ID} 
            onClick={() => handleCardClick(notif.ID)}
            style={{ 
              marginBottom: '10px', 
              cursor: 'pointer',
              backgroundColor: isViewed ? '#e0e0e0' : '#fff9c4', // Gray if viewed, yellow/highlighted if unviewed
              transition: 'background-color 0.3s'
            }}
          >
            <CardContent>
              <Typography variant="h6" color="primary">{notif.Type}</Typography>
              <Typography variant="body1">{notif.Message}</Typography>
              <Typography variant="caption" color="textSecondary">{notif.Timestamp}</Typography>
            </CardContent>
          </Card>
        );
      })}
      
      {filteredNotifications.length === 0 && (
        <Typography variant="body1" align="center" style={{ marginTop: '20px' }}>
          No notifications found.
        </Typography>
      )}
    </Box>
  );
}

export default NotificationsPage;
