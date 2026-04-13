// import React from 'react';
// import Card from '@mui/material/Card';
// import CardContent from '@mui/material/CardContent';
// import Typography from '@mui/material/Typography';
// import Box from '@mui/material/Box';
// import Alert from '@mui/material/Alert';

// function CoverageGaps() {
//   const sampleGaps = [
//     { 
//       id: 1, 
//       req_id: 'REQ_015', 
//       type: 'untested', 
//       severity: 'critical',
//       description: 'Payment validation has no test coverage'
//     },
//     { 
//       id: 2, 
//       req_id: 'REQ_023', 
//       type: 'partially_tested', 
//       severity: 'high',
//       description: 'Error handling paths not fully tested'
//     },
//   ];

//   return (
//     <Box>
//       <Typography variant="h4" gutterBottom>
//         Coverage Gap Analysis
//       </Typography>

//       {sampleGaps.map((gap) => (
//         <Alert 
//           key={gap.id} 
//           severity={gap.severity === 'critical' ? 'error' : 'warning'}
//           sx={{ mb: 2 }}
//         >
//           <Typography variant="subtitle2">
//             {gap.req_id} - {gap.type.toUpperCase()}
//           </Typography>
//           <Typography variant="body2">
//             {gap.description}
//           </Typography>
//         </Alert>
//       ))}

//       <Card sx={{ mt: 3 }}>
//         <CardContent>
//           <Typography variant="h6" gutterBottom>
//             Gap Statistics
//           </Typography>
//           <Typography variant="body1">
//             Total Gaps Detected: <strong>2</strong>
//           </Typography>
//           <Typography variant="body1">
//             Critical: <strong>1</strong>
//           </Typography>
//           <Typography variant="body1">
//             High Priority: <strong>1</strong>
//           </Typography>
//         </CardContent>
//       </Card>
//     </Box>
//   );
// }

// export default CoverageGaps;



import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import IconButton from '@mui/material/IconButton';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RefreshIcon from '@mui/icons-material/Refresh';

const API_BASE_URL = 'http://localhost:8004';

function CoverageGaps() {
  const [gaps, setGaps] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [backendStatus, setBackendStatus] = useState('checking');

  useEffect(() => {
    fetchCoverageGaps();
    checkBackendHealth();
  }, []);

  const checkBackendHealth = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      if (response.ok) {
        setBackendStatus('online');
      } else {
        setBackendStatus('offline');
      }
    } catch (err) {
      setBackendStatus('offline');
    }
  };

  const fetchCoverageGaps = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/coverage-gaps`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch coverage gaps');
      }
      
      const result = await response.json();
      
      if (result.success) {
        setGaps(result.gaps);
        setStatistics(result.statistics);
      } else {
        setError('Failed to load coverage gaps');
      }
    } catch (err) {
      setError('Unable to connect to backend. Make sure the server is running on port 8004.');
      console.error('Error fetching coverage gaps:', err);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityIcon = (severity) => {
    switch(severity) {
      case 'critical': return <ErrorIcon sx={{ color: '#f44336' }} />;
      case 'high': return <WarningIcon sx={{ color: '#ff9800' }} />;
      case 'medium': return <InfoIcon sx={{ color: '#2196f3' }} />;
      default: return <InfoIcon sx={{ color: '#9e9e9e' }} />;
    }
  };

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'critical': return '#f44336';
      case 'high': return '#ff9800';
      case 'medium': return '#2196f3';
      default: return '#9e9e9e';
    }
  };

  const getSeverityChipColor = (severity) => {
    switch(severity) {
      case 'critical': return { bgcolor: '#ffebee', color: '#c62828' };
      case 'high': return { bgcolor: '#fff3e0', color: '#ef6c00' };
      case 'medium': return { bgcolor: '#e3f2fd', color: '#1565c0' };
      default: return { bgcolor: '#f5f5f5', color: '#616161' };
    }
  };

  // Calculate coverage percentage from statistics
  const coveragePercentage = statistics ? 
    Math.max(0, 100 - (statistics.total_gaps * 5)) : 0;

  if (loading) {
    return (
      <Box sx={{ width: '100%', mt: 4 }}>
        <LinearProgress />
        <Typography variant="h6" align="center" sx={{ mt: 2 }}>
          Analyzing coverage gaps...
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: '#1a237e' }}>
            Coverage Gap Analysis
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Identify and prioritize test coverage gaps across requirements
          </Typography>
          {/* <Box sx={{ mt: 1 }}>
            <Chip
              icon={backendStatus === 'online' ? <CheckCircleIcon /> : <WarningIcon />}
              label={`Backend: ${backendStatus === 'online' ? 'Online' : 'Offline'}`}
              color={backendStatus === 'online' ? 'success' : 'error'}
              size="small"
            />
          </Box> */}
        </Box>
        
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={fetchCoverageGaps}
          disabled={loading || backendStatus === 'offline'}
        >
          Refresh
        </Button>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* No Gaps Found */}
      {!loading && gaps.length === 0 && (
        <Alert severity="success" icon={<CheckCircleIcon />} sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Excellent! No Coverage Gaps Detected
          </Typography>
          <Typography variant="body2">
            All requirements appear to have adequate test coverage.
          </Typography>
        </Alert>
      )}

      {/* Statistics Cards */}
      {statistics && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
            }}>
              <CardContent>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Total Gaps
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                  {statistics.total_gaps}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              color: 'white',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
            }}>
              <CardContent>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Critical Gaps
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                  {statistics.critical_gaps || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              color: 'white',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
            }}>
              <CardContent>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  High Priority
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                  {statistics.high_priority_gaps || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
              color: 'white',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
            }}>
              <CardContent>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Recommendations
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                  {statistics.recommendations_count || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Gaps List */}
      {gaps.length > 0 && (
        <>
          <Typography variant="h6" gutterBottom sx={{ mb: 2, color: '#1a237e', fontWeight: 600 }}>
            Identified Coverage Gaps ({gaps.length})
          </Typography>
          
          {gaps.map((gap) => (
            <Alert 
              key={gap.id} 
              severity={gap.severity === 'critical' ? 'error' : gap.severity === 'high' ? 'warning' : gap.severity === 'medium' ? 'info' : 'info'}
              icon={getSeverityIcon(gap.severity)}
              sx={{ 
                mb: 2,
                borderLeft: `4px solid ${getSeverityColor(gap.severity)}`,
                '& .MuiAlert-message': { width: '100%' }
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1, flexWrap: 'wrap', gap: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  {gap.requirement_id}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Chip 
                    label={gap.gap_type.toUpperCase().replace('_', ' ')} 
                    size="small"
                    sx={{ 
                      bgcolor: gap.gap_type === 'untested' ? '#ffebee' : '#fff3e0',
                      color: gap.gap_type === 'untested' ? '#c62828' : '#ef6c00',
                      fontWeight: 500
                    }}
                  />
                  <Chip 
                    label={gap.severity.toUpperCase()} 
                    size="small"
                    sx={{ 
                      ...getSeverityChipColor(gap.severity),
                      fontWeight: 500
                    }}
                  />
                </Box>
              </Box>
              <Typography variant="body2" sx={{ mb: 1 }}>
                {gap.description}
              </Typography>
              
              {/* Recommended Tests */}
              {gap.recommended_tests && gap.recommended_tests.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="caption" color="textSecondary" display="block" sx={{ mb: 1, fontWeight: 600 }}>
                    Recommended Actions:
                  </Typography>
                  {gap.recommended_tests.map((test, idx) => (
                    <Box key={idx} sx={{ 
                      ml: 2, 
                      mb: 1, 
                      p: 1.5, 
                      bgcolor: 'rgba(255,255,255,0.5)', 
                      borderRadius: 1,
                      border: '1px solid rgba(0,0,0,0.05)'
                    }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                        {test.title}
                      </Typography>
                      <Typography variant="caption" color="textSecondary" display="block">
                        {test.description}
                      </Typography>
                      <Chip 
                        label={test.priority} 
                        size="small" 
                        sx={{ 
                          mt: 0.5,
                          bgcolor: test.priority === 'high' ? '#ffcdd2' : '#fff9c4',
                          color: test.priority === 'high' ? '#c62828' : '#f57f17',
                          height: 20,
                          fontSize: '0.7rem'
                        }}
                      />
                    </Box>
                  ))}
                </Box>
              )}
              
              <Typography variant="caption" color="textSecondary" display="block" sx={{ mt: 1 }}>
                Detected: {new Date(gap.detected_at).toLocaleString()}
              </Typography>
            </Alert>
          ))}
        </>
      )}

      {/* Summary Card */}
      {statistics && gaps.length > 0 && (
        <Card sx={{ mt: 3, bgcolor: '#f8f9fa', border: '1px solid #e0e0e0' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <CheckCircleIcon sx={{ color: '#4caf50', mr: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Gap Statistics Summary
              </Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={3}>
                <Typography variant="body2" color="textSecondary">
                  Total Gaps
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1a237e' }}>
                  {statistics.total_gaps}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="body2" color="textSecondary">
                  Critical
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#f44336' }}>
                  {statistics.by_severity?.critical || 0}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="body2" color="textSecondary">
                  High
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#ff9800' }}>
                  {statistics.by_severity?.high || 0}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="body2" color="textSecondary">
                  Medium
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#2196f3' }}>
                  {statistics.by_severity?.medium || 0}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="body2" color="textSecondary">
                  Untested
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#c62828' }}>
                  {statistics.by_type?.untested || 0}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="body2" color="textSecondary">
                  Partial
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#ef6c00' }}>
                  {statistics.by_type?.partially_tested || 0}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="body2" color="textSecondary">
                  Recommendations
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
                  {statistics.recommendations_count || 0}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}

export default CoverageGaps;