import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import UserService from "../service/userservice";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import FavoriteIcon from '@mui/icons-material/Favorite';

import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Alert,
  Chip
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import PetsRoundedIcon from "@mui/icons-material/PetsRounded";

// COLORS & FONT
const PRIMARY = "#FCA311";
const DARK = "#14213D";
const BG = "#E5E5E5";
const TEXT = "#000000";
const WHITE = "#FFFFFF";
const FONT = "'Tinos', serif";

// Styled Containers
const Page = styled(Box)(({ theme }) => ({
  fontFamily: FONT,
  backgroundColor: BG,
  minHeight: "100vh",
  padding: theme.spacing(4),
}));

const Header = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: theme.spacing(4),
}));

const CardBox = styled(Card)(({ theme }) => ({
  backgroundColor: WHITE,
  borderRadius: 16,
  overflow: "hidden",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  textAlign: "center",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 10px 16px rgba(0,0,0,0.12)",
    cursor: "pointer",
  },
}));

const PetImage = styled(CardMedia)(({ theme }) => ({
  height: 220,
  objectFit: "cover",
}));

const IconPlaceholder = styled(Box)(({ theme }) => ({
  height: 220,
  backgroundColor: "#F0F0F0",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const CategoryTag = styled(Chip)(({ theme }) => ({
  backgroundColor: PRIMARY,
  color: WHITE,
  fontFamily: FONT,
  fontWeight: "bold",
  marginTop: theme.spacing(1),
}));

const AddPet = styled(Button)(({ theme }) => ({
  backgroundColor: PRIMARY,
  color: WHITE,
  fontFamily: FONT,
  padding: theme.spacing(1.5, 3),
  fontWeight: "bold",
  "&:hover": {
    backgroundColor: "#e69500",
  },
}));

const PetList = ({ token }) => {
  const [pets, setPets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [userId, setUserId] = useState(null);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setMessage({ text: "No token provided", type: "error" });
      return;
    }
    try {
      const decoded = jwtDecode(token);
      if (decoded.appUserId) {
        setUserId(decoded.appUserId);
      } else {
        setMessage({ text: "Invalid token", type: "error" });
      }
    } catch (error) {
      console.error("Token decoding error:", error);
      setMessage({ text: "Invalid token", type: "error" });
    }
  }, [token]);

  useEffect(() => {
    const fetchPets = async () => {
      if (!userId) return;
      setLoading(true);
      try {
        const response = await UserService.getAllPets(userId);
        const data = response.data?.filter((p) => typeof p === "object") || [];
        if (data.length === 0) {
          setMessage({ text: "You don't have any pets yet.", type: "info" });
        }
        setPets(data);
      } catch (error) {
        setMessage({ text: "Failed to load pets.", type: "error" });
      } finally {
        setLoading(false);
      }
    };
    fetchPets();
  }, [userId]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await UserService.findPetCategories();
        const formatted = response.data.map((item) => ({
          id: item.category_category_id,
          mscategory: item.mscategory,
        }));
        setCategories(formatted);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const getCategoryName = (categoryId) => {
    const cat = categories.find((c) => c.id === categoryId);
    return cat ? cat.mscategory : "Unknown";
  };

  if (loading) {
    return (
      <Page>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="60vh"
        >
          <CircularProgress sx={{ color: PRIMARY }} size={60} />
        </Box>
      </Page>
    );
  }

  return (
    <>
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Tinos&display=swap');`}
      </style>
      <Page>
        <Header>
          <Typography
            variant="h3"
            sx={{ fontFamily: FONT, color: DARK, display: "flex", alignItems: "center", gap: 1 }}
          >
            <PetsRoundedIcon sx={{ fontSize: 34, color: PRIMARY }} />
            My Pets
          </Typography>
         <AddPet onClick={() => navigate("/user/addpet")}>
  + New to the Family! <FavoriteIcon sx={{ ml: 1 }} />
</AddPet>
        </Header>

        {message.text && (
          <Alert severity={message.type} sx={{ mb: 4 }}>
            {message.text}
          </Alert>
        )}

        {pets.length === 0 ? (
          <Box textAlign="center" mt={10}>
            <PetsRoundedIcon sx={{ fontSize: 80, color: PRIMARY, mb: 2 }} />
            <Typography
              variant="h5"
              sx={{ fontFamily: FONT, color: TEXT, mb: 2 }}
            >
              No Pets Found
            </Typography>
            <Typography variant="body1" sx={{ fontFamily: FONT, mb: 3 }}>
              Click below to add your first pet.
            </Typography>
            <AddPet startIcon={<AddIcon />} onClick={() => navigate("/user/addpet")}>
              Add Your First Pet
            </AddPet>
          </Box>
        ) : (
          <Grid container spacing={4}>
            {pets.map((pet) => (
              <Grid item xs={12} sm={6} md={4} key={pet.petId}>
                <CardBox onClick={() => navigate(`/user/getpet/${pet.petId}`)}>
                  {pet.image ? (
                    <PetImage
                      component="img"
                      image={`data:image/jpeg;base64,${pet.image}`}
                      alt={pet.petName || "Pet"}
                    />
                  ) : (
                    <IconPlaceholder>
                      <PetsRoundedIcon sx={{ fontSize: 80, color: "#bbb" }} />
                    </IconPlaceholder>
                  )}
                  <CardContent>
                    <Typography
                      variant="h5"
                      sx={{
                        fontFamily: FONT,
                        color: DARK,
                        fontWeight: "bold",
                        mt: 1,
                      }}
                    >
                      {pet.petName || "Unnamed Pet"}
                    </Typography>

                    {pet.petCategory && (
                      <CategoryTag
                        label={getCategoryName(pet.petCategory.categoryId)}
                      />
                    )}
                  </CardContent>
                </CardBox>
              </Grid>
            ))}
          </Grid>
        )}
      </Page>
    </>
  );
};

PetList.propTypes = {
  token: PropTypes.string.isRequired,
};

export default PetList;
