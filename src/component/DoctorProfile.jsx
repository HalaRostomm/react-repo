import React, { useEffect, useState } from 'react';
import DoctorService from '../service/doctorservice';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Avatar, Button, Paper, Grid, Divider,
  CircularProgress, Alert, IconButton
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import EditIcon from '@mui/icons-material/Edit';
import LockResetIcon from '@mui/icons-material/LockReset';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

const COLORS = {
  primary: '#64B5F6',
  light: '#ffffff',
  text: '#000000',
};

const ProfileContainer = styled(Box)(({ theme }) => ({
  fontFamily: '"Poppins", sans-serif',
  maxWidth: '900px',
  margin: '40px auto',
  padding: theme.spacing(4),
  backgroundColor: COLORS.light,
  color: COLORS.text,
  borderRadius: '16px',
  boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
}));

const HeaderSection = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  marginBottom: '24px',
});

const ProfileAvatar = styled(Avatar)({
  width: '120px',
  height: '120px',
  marginRight: '32px',
  border: `4px solid ${COLORS.primary}`,
});

const InfoItem = styled(Box)({
  marginBottom: '16px',
  '& .label': {
    fontWeight: 600,
    color: COLORS.primary,
    marginBottom: '4px',
  },
  '& .value': {
    color: COLORS.text,
  },
});

const AvailabilityChip = styled(Box)({
  display: 'inline-block',
  backgroundColor: COLORS.primary,
  color: COLORS.light,
  padding: '4px 12px',
  borderRadius: '16px',
  marginRight: '8px',
  marginBottom: '8px',
  fontSize: '14px',
});

const ActionButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1),
  padding: '10px 20px',
  borderRadius: '8px',
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '0.9rem',
  fontFamily: '"Poppins", sans-serif',
  '&.edit': {
    backgroundColor: COLORS.primary,
    color: COLORS.light,
    '&:hover': {
      backgroundColor: '#42A5F5',
    },
  },
  '&.password': {
    borderColor: COLORS.primary,
    color: COLORS.primary,
  },
  '&.logout': {
    color: '#f44336',
    borderColor: '#f44336',
  },
}));

const DoctorProfile = () => {
  const [doctorInfo, setDoctorInfo] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [resolvedAddress, setResolvedAddress] = useState('');
  const [showUrgentAlert, setShowUrgentAlert] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctorProfile = async () => {
      try {
        const response = await DoctorService.getUserProfile();
        setDoctorInfo(response);
      } catch (err) {
        setError('Failed to fetch user profile');
      } finally {
        setLoading(false);
      }
    };
    fetchDoctorProfile();
  }, []);

  useEffect(() => {
    if (doctorInfo?.address?.includes(',')) {
      const [longitude, latitude] = doctorInfo.address.split(',').map(Number);
      const fetchAddress = async () => {
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await response.json();
          setResolvedAddress(data.display_name);
        } catch {
          setResolvedAddress(doctorInfo.address);
        }
      };
      fetchAddress();
    }
  }, [doctorInfo]);

  const handleLogout = () => {
    localStorage.removeItem('jwt_token');
    navigate('/login');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress style={{ color: COLORS.primary }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <ProfileContainer component={Paper} elevation={6}>
      {doctorInfo?.urgent && showUrgentAlert && (
        <Alert
          severity="warning"
          sx={{
            mb: 3,
            backgroundColor: COLORS.primary,
            color: COLORS.text,
            fontFamily: 'Poppins, sans-serif',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}
          icon={<WarningAmberIcon sx={{ color: COLORS.text }} />}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => setShowUrgentAlert(false)}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          You are currently accepting urgent cases.
          <Button
            variant="text"
            sx={{ color: COLORS.text, textDecoration: 'underline', ml: 1 }}
            onClick={() => navigate(`/doctor/updatedoctor/${doctorInfo.appUserId}`)}
          >
            Update Urgent
          </Button>
        </Alert>
      )}

      <HeaderSection>
        <ProfileAvatar
          src={doctorInfo.image ? `data:image/jpeg;base64,${doctorInfo.image}` : '/default-avatar.jpg'}
          alt="Profile"
        />
        <Box>
          <Typography variant="h4" component="h1" style={{ fontWeight: 700 }}>
            Dr. {doctorInfo.username.split('@')[0]}
          </Typography>
          <Typography variant="subtitle1" style={{ color: COLORS.primary }}>
            {doctorInfo.specialization}
          </Typography>
          <Box mt={2}>
            <ActionButton className="edit" variant="contained" startIcon={<EditIcon />} onClick={() => navigate(`/doctor/updatedoctor/${doctorInfo.appUserId}`)}>
              Edit Profile
            </ActionButton>
            <ActionButton className="password" variant="outlined" startIcon={<LockResetIcon />} onClick={() => navigate('/doctor/updatePassword')}>
              Update Password
            </ActionButton>
            <ActionButton className="logout" variant="outlined" startIcon={<LogoutIcon />} onClick={handleLogout}>
              Logout
            </ActionButton>
          </Box>
        </Box>
      </HeaderSection>

      <Divider style={{ backgroundColor: COLORS.primary, marginBottom: '24px' }} />

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" style={{ color: COLORS.primary, marginBottom: '16px' }}>
            Personal Information
          </Typography>

          <InfoItem>
            <Typography className="label">Email</Typography>
            <Typography className="value">{doctorInfo.username}</Typography>
          </InfoItem>

          <InfoItem>
            <Typography className="label">Gender</Typography>
            <Typography className="value">{doctorInfo.gender || 'Not specified'}</Typography>
          </InfoItem>

          <InfoItem>
            <Typography className="label">Phone</Typography>
            <Typography className="value">{doctorInfo.phone || 'Not provided'}</Typography>
          </InfoItem>

          <InfoItem>
            <Typography className="label">Birth Date</Typography>
            <Typography className="value">{doctorInfo.birthDate || 'Not provided'}</Typography>
          </InfoItem>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="h6" style={{ color: COLORS.primary, marginBottom: '16px' }}>
            Professional Information
          </Typography>

          <InfoItem>
            <Typography className="label">Address</Typography>
            <Typography className="value">{resolvedAddress || 'Resolving address...'}</Typography>
          </InfoItem>

          <InfoItem>
            <Typography className="label">Experience</Typography>
            <Typography className="value">
              {doctorInfo.experienceYears ? `${doctorInfo.experienceYears} years` : 'Not specified'}
            </Typography>
          </InfoItem>

          <InfoItem>
            <Typography className="label">Availability</Typography>
            <Box>
              {doctorInfo.availableDays ? (
                Object.entries(doctorInfo.availableDays).map(([day, hours]) => (
                  <AvailabilityChip key={day}>{day}: {hours}</AvailabilityChip>
                ))
              ) : (
                <Typography className="value">Not available</Typography>
              )}
            </Box>
          </InfoItem>
        </Grid>
      </Grid>
    </ProfileContainer>
  );
};

export default DoctorProfile;
