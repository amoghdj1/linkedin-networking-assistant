import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Paper, List, ListItem, ListItemText, Button } from '@mui/material';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase-config';
import AddContactPopup from './AddContactPopup';

ChartJS.register(ArcElement, Tooltip, Legend);

function Dashboard() {
  const [companies, setCompanies] = useState([]);
  const [rolesData, setRolesData] = useState({ labels: [], datasets: [] });
  const [popupOpen, setPopupOpen] = useState(false);

  useEffect(() => {
    // Fetch companies from Firebase
    const unsubscribeCompanies = onSnapshot(collection(db, 'contacts'), (snapshot) => {
      const companiesList = snapshot.docs.map((doc) => doc.data().company);
      setCompanies(companiesList.slice(0, 5)); // Show only top 5 companies
    });

    // Fetch roles distribution from Firebase
    const unsubscribeRoles = onSnapshot(collection(db, 'contacts'), (snapshot) => {
      const rolesCount = {};
      snapshot.docs.forEach((doc) => {
        const role = doc.data().role || 'Unknown';
        rolesCount[role] = (rolesCount[role] || 0) + 1;
      });

      const labels = Object.keys(rolesCount);
      const data = Object.values(rolesCount);

      setRolesData({
        labels,
        datasets: [
          {
            label: '# of Contacts',
            data,
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
            ],
            borderWidth: 1,
          },
        ],
      });
    });

    return () => {
      unsubscribeCompanies();
      unsubscribeRoles();
    };
  }, []);

  const handleOpenPopup = () => {
    setPopupOpen(true);
  };

  const handleClosePopup = () => {
    setPopupOpen(false);
  };

  return (
    <Container>
      <Typography variant="h4" align="center" gutterBottom style={{ backgroundColor: '#4F46E5', color: 'white', padding: '10px 0' }}>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} style={{ padding: '20px' }}>
            <Typography variant="h5" align="center" gutterBottom>
              Recently Networked Companies
            </Typography>
            <List>
              {companies.map((company, index) => (
                <ListItem
                  key={index}
                  sx={{
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: '#f0f0f0',
                      borderRadius: '4px',
                    },
                  }}
                >
                  <ListItemText primary={`${index + 1}. ${company}`} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} style={{ padding: '20px' }}>
            <Typography variant="h5" align="center" gutterBottom>
              Contacts Distribution by Role
            </Typography>
            <Pie data={rolesData} />
          </Paper>
        </Grid>
      </Grid>
      <Button variant="contained" color="primary" onClick={handleOpenPopup} style={{ marginTop: '20px' }}>
        Add Contact
      </Button>
      <AddContactPopup open={popupOpen} onClose={handleClosePopup} />
    </Container>
  );
}

export default Dashboard;