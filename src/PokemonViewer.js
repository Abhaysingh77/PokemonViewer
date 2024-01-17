import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';


import axios from "axios";
import { useState, useEffect } from "react";
import { TextField } from "@mui/material/";

export default function PokemonViewer() {
  const [pokeData, setPokeData] = useState([]);
  const [filteredPokeData, setFilteredPokeData] = useState({});
  const [debounceTime, setDebounceTimeout] = useState(0);

  async function fetchPokeData(text) {
    try {
      const res = text
        ? await axios.get(`https://pokeapi.co/api/v2/pokemon/${text}`)
        : await axios.get(`https://pokeapi.co/api/v2/pokemon/?limit=10`);

      setPokeData(res.data.results || res.data.forms);
      return res.data;
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetchPokeData("");
  }, []);

  async function handleClick(e) {
    const data = await fetchPokeData(e.target.value);
    setFilteredPokeData(data);
  }

  async function handleChange(text) {
    try {
      const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${text}`);
      setFilteredPokeData(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  function debounceSearch(e, timeoutId) {
    let text = e.target.value;
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    const newTimeout = setTimeout(() => handleChange(text), 1000);
    setDebounceTimeout(newTimeout);
  }

  return (
    <>
      {Object.keys(filteredPokeData).length ? (
        <Box>
          <AppBar position="static">
          <Button variant="secondary" onClick={() => window.location.reload()}>
          Home
        </Button>
            <Typography variant="h4" align="center">
              {filteredPokeData.name.toUpperCase()}
            </Typography>
          </AppBar>
          <Typography variant="h4" padding={2}>
            Sprites
          </Typography>
          <ImageList sx={{ width: 400, height: 250 }} cols={2} rowHeight={164}>
            <ImageListItem
              key={filteredPokeData.sprites.other.home.front_default}
            >
              <img
                srcSet={`${filteredPokeData.sprites.other.home.front_default}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                src={`${filteredPokeData.sprites.other.home.front_default}?w=164&h=164&fit=crop&auto=format`}
                loading="lazy"
              />
            </ImageListItem>
            <ImageListItem key={filteredPokeData.sprites.other.home.front_shiny}>
              <img
                srcSet={`${filteredPokeData.sprites.other.home.front_shiny}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                src={`${filteredPokeData.sprites.other.home.front_shiny}?w=164&h=164&fit=crop&auto=format`}
                loading="lazy"
              />
            </ImageListItem>
          </ImageList>

          <Typography variant="h4" padding={2}>
            Types
          </Typography>
          <Box padding={3}>
            {filteredPokeData["types"].map((type) => (
              <Typography key={type.type.name} variant="h5">
                {type.type.name}
              </Typography>
            ))}
          </Box>

          <Typography variant="h4" padding={2}>
            Weight
          </Typography>
          <Typography variant="h5" padding={2}>
            {filteredPokeData.weight}
          </Typography>
        </Box>
      ) : (
        <Box>
          <AppBar position="static">
            <Typography variant="h4" align="center">
              Pokemons
            </Typography>
          </AppBar>
          <TextField
            label="Search Your Pokemon"
            variant="outlined"
            fullWidth
            margin="dense"
            onChange={(e) => debounceSearch(e, debounceTime)}
          ></TextField>
          <Stack spacing={2} margin={3}>
            {pokeData.map((ele) => (
              <Button
                value={ele.name}
                key={ele.name}
                variant="secondary"
                onClick={async (e) => {
                  handleClick(e);
                }}
              >
                {ele.name.toUpperCase()}
              </Button>
            ))}
          </Stack>
        </Box>
      )}
    </>
  );
}
