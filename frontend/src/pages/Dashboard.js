// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import Card from '@mui/material/Card';
// import CardContent from '@mui/material/CardContent';
// import Grid from '@mui/material/Grid';
// import Typography from '@mui/material/Typography';
// import Box from '@mui/material/Box';
// import CircularProgress from '@mui/material/CircularProgress';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// const API_BASE_URL = 'http://localhost:8004';

// function Dashboard() {
//   const [loading, setLoading] = useState(true);
//   const [health, setHealth] = useState(null);
//   const [stats, setStats] = useState({
//     totalTests: 0,
//     avgQuality: 0,
//     coveredReqs: 0,
//     criticalGaps: 0
//   });

//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//   const fetchDashboardData = async () => {
//     try {
//       // Fetch health status
//       const healthRes = await axios.get(`${API_BASE_URL}/health`);
//       setHealth(healthRes.data);

//       // Simulate stats (replace with actual API calls)
//       setStats({
//         totalTests: 150,
//         avgQuality: 78.5,
//         coveredReqs: 92,
//         criticalGaps: 3
//       });

//       setLoading(false);
//     } catch (error) {
//       console.error('Error fetching dashboard data:', error);
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
//         <CircularProgress />
//       </Box>
//     );
//   }

//   const statCards = [
//     { title: 'Tests Analyzed', value: stats.totalTests, color: '#1976d2' },
//     { title: 'Avg Quality Score', value: stats.avgQuality, color: '#2e7d32' },
//     { title: 'Requirements Covered (%)', value: stats.coveredReqs, color: '#ff9800' },
//     { title: 'Critical Gaps', value: stats.criticalGaps, color: '#d32f2f' },
//   ];

//   const sampleChartData = [
//     { name: 'Excellent', tests: 45 },
//     { name: 'Good', tests: 68 },
//     { name: 'Fair', tests: 25 },
//     { name: 'Poor', tests: 12 },
//   ];

//   return (
//     <Box>
//       <Typography variant="h4" gutterBottom>
//         Component 4 Dashboard - ML Test Quality & RTM
//       </Typography>

//       {/* Health Status */}
//       <Card sx={{ mb: 3 }}>
//         <CardContent>
//           <Typography variant="h6" gutterBottom>
//             System Status
//           </Typography>
//           <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
//             {health?.services && Object.entries(health.services).map(([service, status]) => (
//               <Box key={service} sx={{ 
//                 px: 2, py: 1, 
//                 bgcolor: status ? '#e8f5e9' : '#ffebee',
//                 borderRadius: 1,
//                 border: `1px solid ${status ? '#4caf50' : '#f44336'}`
//               }}>
//                 <Typography variant="body2">
//                   {service.replace('_', ' ').toUpperCase()}: {status ? '✓' : '✗'}
//                 </Typography>
//               </Box>
//             ))}
//           </Box>
//         </CardContent>
//       </Card>

//       {/* Statistics Cards */}
//       <Grid container spacing={3} sx={{ mb: 3 }}>
//         {statCards.map((stat, index) => (
//           <Grid item xs={12} sm={6} md={3} key={index}>
//             <Card>
//               <CardContent>
//                 <Typography color="textSecondary" variant="body2" gutterBottom>
//                   {stat.title}
//                 </Typography>
//                 <Typography variant="h4" sx={{ color: stat.color }}>
//                   {stat.value}
//                 </Typography>
//               </CardContent>
//             </Card>
//           </Grid>
//         ))}
//       </Grid>

//       {/* Quality Distribution Chart */}
//       <Card>
//         <CardContent>
//           <Typography variant="h6" gutterBottom>
//             Test Quality Distribution
//           </Typography>
//           <ResponsiveContainer width="100%" height={300}>
//             <BarChart data={sampleChartData}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="name" />
//               <YAxis />
//               <Tooltip />
//               <Legend />
//               <Bar dataKey="tests" fill="#1976d2" />
//             </BarChart>
//           </ResponsiveContainer>
//         </CardContent>
//       </Card>
//     </Box>
//   );
// }

// export default Dashboard;



import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import BugReportIcon from '@mui/icons-material/BugReport';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SpeedIcon from '@mui/icons-material/Speed';

const API_BASE_URL = 'http://localhost:8004';

function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [health, setHealth] = useState(null);
  const [stats, setStats] = useState({
    totalTests: 0,
    avgQuality: 0,
    coveredReqs: 0,
    criticalGaps: 0,
    totalReqs: 100,
    qualityTrend: '+5.2%'
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const healthRes = await axios.get(`${API_BASE_URL}/health`);
      setHealth(healthRes.data);
      setStats({
        totalTests: 156,
        avgQuality: 78.5,
        coveredReqs: 92,
        criticalGaps: 3,
        totalReqs: 100,
        qualityTrend: '+5.2%'
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  const statCards = [
    { 
      title: 'Tests Analyzed', 
      value: stats.totalTests, 
      icon: <BugReportIcon sx={{ fontSize: 40 }} />,
      color: '#667eea',
      bgGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    { 
      title: 'Avg Quality Score', 
      value: stats.avgQuality, 
      suffix: '/100',
      icon: <TrendingUpIcon sx={{ fontSize: 40 }} />,
      color: '#43e97b',
      bgGradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
    },
    { 
      title: 'Coverage Rate', 
      value: stats.coveredReqs, 
      suffix: '%',
      icon: <CheckCircleIcon sx={{ fontSize: 40 }} />,
      color: '#4facfe',
      bgGradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    },
    { 
      title: 'Quality Trend', 
      value: stats.qualityTrend, 
      icon: <SpeedIcon sx={{ fontSize: 40 }} />,
      color: '#f093fb',
      bgGradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
  ];

  const sampleChartData = [
    { name: 'Excellent', tests: 45, color: '#4caf50' },
    { name: 'Good', tests: 68, color: '#8bc34a' },
    { name: 'Fair', tests: 25, color: '#ffc107' },
    { name: 'Poor', tests: 12, color: '#f44336' },
  ];

  const pieData = [
    { name: 'Covered', value: stats.coveredReqs, color: '#4caf50' },
    { name: 'Uncovered', value: stats.totalReqs - stats.coveredReqs, color: '#f44336' },
  ];

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: '#1a237e' }}>
          ML Test Quality Dashboard
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Real-time insights into test quality and requirements coverage
        </Typography>
      </Box>

      {/* Health Status */}
      <Card sx={{ mb: 4, bgcolor: '#f8f9fa', borderLeft: '4px solid #4caf50' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            System Health Status
          </Typography>
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            {health?.services && Object.entries(health.services).map(([service, status]) => (
              <Box key={service} sx={{ 
                px: 2, py: 1, 
                bgcolor: status ? '#e8f5e9' : '#ffebee',
                borderRadius: 2,
                border: `1px solid ${status ? '#4caf50' : '#f44336'}`,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                {status ? '🟢' : '🔴'}
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {service.replace('_', ' ').toUpperCase()}
                </Typography>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statCards.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ 
              background: stat.bgGradient,
              color: 'white',
              transition: 'transform 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
              }
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                      {stat.title}
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                      {stat.value}{stat.suffix || ''}
                    </Typography>
                  </Box>
                  {stat.icon}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#1a237e' }}>
                Test Quality Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={sampleChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="tests" fill="#667eea" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#1a237e' }}>
                Requirements Coverage
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
              <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                Coverage: <strong>{stats.coveredReqs}%</strong> of requirements
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;