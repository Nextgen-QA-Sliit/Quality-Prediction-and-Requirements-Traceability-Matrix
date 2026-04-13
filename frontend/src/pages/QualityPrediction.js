import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  Alert,
  Paper,
  CircularProgress,
  Chip,
  LinearProgress,
  Switch,
  FormControlLabel
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import AssessmentIcon from '@mui/icons-material/Assessment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';

const API_BASE_URL = 'http://localhost:8004';

function QualityPrediction() {
  const [testCase, setTestCase] = useState({
    id: 'TEST_001',
    assertion_count: 5,
    has_boundary_values: true,
    has_negative_test: true,
    step_count: 8,
    has_error_handling: true,
    cyclomatic_complexity: 4.5,
    has_setup_teardown: true,
    historical_pass_rate: 0.85
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [backendStatus, setBackendStatus] = useState('checking');

  useEffect(() => {
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

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTestCase(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? parseFloat(value) || 0 : value)
    }));
  };

  const handleSwitchChange = (e) => {
    const { name, checked } = e.target;
    setTestCase(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const predictQuality = async () => {
    setLoading(true);
    setError(null);
    setPrediction(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/quality/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testCase)
      });

      if (!response.ok) {
        throw new Error('Failed to predict quality');
      }

      const result = await response.json();
      
      if (result.success) {
        setPrediction(result.prediction);
      } else {
        setError('Prediction failed');
      }
    } catch (err) {
      setError('Failed to connect to backend. Ensure the server is running on port 8004.');
      console.error('Prediction error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: '#1a237e' }}>
          Test Quality Prediction
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Predict test case quality using ML-based analysis
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

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Input Form */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Test Case Features
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Test ID"
                    name="id"
                    value={testCase.id}
                    onChange={handleInputChange}
                    size="small"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Assertion Count"
                    name="assertion_count"
                    value={testCase.assertion_count}
                    onChange={handleInputChange}
                    size="small"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Step Count"
                    name="step_count"
                    value={testCase.step_count}
                    onChange={handleInputChange}
                    size="small"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Cyclomatic Complexity"
                    name="cyclomatic_complexity"
                    value={testCase.cyclomatic_complexity}
                    onChange={handleInputChange}
                    size="small"
                    inputProps={{ step: 0.1 }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Historical Pass Rate"
                    name="historical_pass_rate"
                    value={testCase.historical_pass_rate}
                    onChange={handleInputChange}
                    size="small"
                    inputProps={{ step: 0.01, min: 0, max: 1 }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={testCase.has_boundary_values}
                        onChange={handleSwitchChange}
                        name="has_boundary_values"
                        color="primary"
                      />
                    }
                    label="Has Boundary Values"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={testCase.has_negative_test}
                        onChange={handleSwitchChange}
                        name="has_negative_test"
                        color="primary"
                      />
                    }
                    label="Has Negative Test"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={testCase.has_error_handling}
                        onChange={handleSwitchChange}
                        name="has_error_handling"
                        color="primary"
                      />
                    }
                    label="Has Error Handling"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={testCase.has_setup_teardown}
                        onChange={handleSwitchChange}
                        name="has_setup_teardown"
                        color="primary"
                      />
                    }
                    label="Has Setup/Teardown"
                  />
                </Grid>

                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={predictQuality}
                    disabled={loading || backendStatus === 'offline'}
                    fullWidth
                    size="large"
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <PlayArrowIcon />}
                  >
                    {loading ? 'Predicting...' : 'Predict Quality'}
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Results */}
        <Grid item xs={12} md={6}>
          {loading && (
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8 }}>
                  <CircularProgress size={60} sx={{ mb: 2 }} />
                  <Typography variant="h6" color="textSecondary">
                    Analyzing test quality...
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                    ML model is processing your test case
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          )}

          {!loading && prediction && (
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AssessmentIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Quality Prediction Results
                  </Typography>
                </Box>

                {/* Main Score */}
                <Paper 
                  sx={{ 
                    p: 3, 
                    mb: 3, 
                    bgcolor: prediction.is_accepted ? '#e8f5e9' : '#ffebee',
                    border: '2px solid',
                    borderColor: prediction.is_accepted ? '#4caf50' : '#f44336'
                  }}
                >
                  <Typography variant="h2" align="center" sx={{ 
                    color: prediction.is_accepted ? '#2e7d32' : '#d32f2f',
                    fontWeight: 'bold',
                    mb: 1
                  }}>
                    {prediction.quality_score}
                  </Typography>
                  <Typography variant="body1" align="center" color="textSecondary">
                    Quality Score / 100
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    <Chip
                      icon={prediction.is_accepted ? <CheckCircleIcon /> : <WarningIcon />}
                      label={prediction.is_accepted ? '✓ ACCEPTED' : '✗ REJECTED'}
                      color={prediction.is_accepted ? 'success' : 'error'}
                      size="large"
                    />
                  </Box>
                </Paper>

                {/* Sub-Scores */}
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, mt: 3, mb: 2 }}>
                  Detailed Sub-Scores:
                </Typography>
                {Object.entries(prediction.sub_scores).map(([key, value]) => {
                  const maxValue = key === 'assertion_strength' ? 30 : 
                                  key === 'code_coverage' ? 20 :
                                  key === 'boundary_testing' ? 15 :
                                  key === 'error_handling' ? 15 : 20;
                  const percentage = (value / maxValue) * 100;
                  
                  return (
                    <Box key={key} sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                          {key.replace(/_/g, ' ')}
                        </Typography>
                        <Typography variant="body2" fontWeight="bold">
                          {value} / {maxValue}
                        </Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={percentage} 
                        sx={{ 
                          height: 8, 
                          borderRadius: 1,
                          bgcolor: '#e0e0e0',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: percentage >= 70 ? '#4caf50' : percentage >= 40 ? '#ff9800' : '#f44336'
                          }
                        }}
                      />
                    </Box>
                  );
                })}

                {/* Recommendation */}
                <Alert 
                  severity={prediction.is_accepted ? 'success' : 'warning'}
                  sx={{ mt: 3 }}
                >
                  <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                    Recommendation:
                  </Typography>
                  <Typography variant="body2">
                    {prediction.recommendation}
                  </Typography>
                </Alert>

                {/* Features Used */}
                <Paper sx={{ p: 2, mt: 3, bgcolor: '#f5f5f5' }}>
                  <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                    Features Analyzed:
                  </Typography>
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <Typography variant="caption">Assertions: {prediction.features.assertion_count}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption">Steps: {prediction.features.step_count}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption">Complexity: {prediction.features.cyclomatic_complexity}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption">Pass Rate: {(prediction.features.historical_pass_rate * 100).toFixed(0)}%</Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}

export default QualityPrediction;
