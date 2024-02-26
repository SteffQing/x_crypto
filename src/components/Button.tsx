import React from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';

const TinyButton = styled(Button)({
  boxShadow: 'none',
  textTransform: 'none',
  border: 'none',
  fontSize: 12,
  padding: '6px 12px',
  backgroundColor: '#111111',
  color: 'rgba(255, 255, 255, 0.3)',
  minWidth: 50,
  '&:hover': {
    color: '#fff',
    border: 'none',
  },
});

const MainButton = styled(Button)(({ theme }) => ({
  color: '#000',
  backgroundColor: '#fff',
  textTransform: 'none',
  //   '&:hover': {
  //     backgroundColor: '#000',
  //     color: '#fff',
  //   },
}));

export { TinyButton, MainButton };
