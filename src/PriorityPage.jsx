import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, CircularProgress, Alert, Box } from '@mui/material';

function PriorityPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
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
        
        const weights = { Placement: 3, Result: 2, Event: 1 };
        const now = new Date();

        // Calculate priority score for each notification
        const scoredNotifs = mockData.map(notif => {
          // Parse timestamp properly, assuming "YYYY-MM-DD HH:mm:ss" format
          const timestamp = new Date(notif.Timestamp.replace(' ', 'T'));
          const ageInHours = (now - timestamp) / (1000 * 60 * 60);
          
          const weight = weights[notif.Type] || 0;
          const score = (weight * 100) - ageInHours;
          
          return { ...notif, score };
        });

        // Sort descending by score
        scoredNotifs.sort((a, b) => b.score - a.score);
        
        // Show top 10 only
        setNotifications(scoredNotifs.slice(0, 10));
      } catch (err) {
        setError('Failed to fetch priority notifications.');
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

  if (loading) return <CircularProgress style={{ display: 'block', margin: '20px auto' }} />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box>
      <Typography variant="h5" style={{ marginBottom: '20px' }}>
        Top 10 Priority Notifications
      </Typography>
      
      {notifications.map((notif) => {
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
              <Typography variant="h6" color="secondary">
                {notif.Type} (Score: {notif.score.toFixed(1)})
              </Typography>
              <Typography variant="body1">{notif.Message}</Typography>
              <Typography variant="caption" color="textSecondary">{notif.Timestamp}</Typography>
            </CardContent>
          </Card>
        );
      })}
      
      {notifications.length === 0 && (
        <Typography variant="body1" align="center" style={{ marginTop: '20px' }}>
          No priority notifications found.
        </Typography>
      )}
    </Box>
  );
}

export default PriorityPage;
