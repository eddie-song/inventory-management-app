'use client'

import { useState, useEffect } from 'react'
import { Box, Stack, Typography, Button, Modal, TextField, Paper } from '@mui/material'
import { firestore } from '@/app/firebase'
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
  borderRadius: 2,
}

export default function Home() {
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResult, setSearchResult] = useState(null)

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({ name: doc.id, ...doc.data() })
    })
    setInventory(inventoryList)
  }

  useEffect(() => {
    updateInventory()
  }, [])

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item.toLowerCase())
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      await setDoc(docRef, { quantity: quantity + 1 })
    } else {
      await setDoc(docRef, { quantity: 1 })
    }
    await updateInventory()
  }

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item.toLowerCase())
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      if (quantity === 1) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, { quantity: quantity - 1 })
      }
    }
    await updateInventory()
  }

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const handleSearch = async () => {
    const searchQuery = searchTerm.trim().toLowerCase()
    const docRef = doc(collection(firestore, 'inventory'), searchQuery)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      setSearchResult({ name: searchQuery, ...docSnap.data() })
    } else {
      setSearchResult(null)
    }
  }

  return (
    <Box
      width="100vw"
      height="100vh"
      display={'flex'}
      justifyContent={'center'}
      alignItems={'center'}
      gap={2}
      bgcolor="#f5f5f5"
      p={3}
    >
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Item
          </Typography>
          <Stack width="100%" direction={'row'} spacing={2}>
            <TextField
              id="outlined-basic"
              label="Item"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                addItem(itemName)
                setItemName('')
                handleClose()
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Box display="flex" width="100%" maxWidth="1200px" gap={4}>
        <Paper elevation={3} sx={{ width: '60%', p: 2, borderRadius: 2 }}>
          <Box
            width="100%"
            height="100px"
            bgcolor="primary.main"
            display={'flex'}
            justifyContent={'center'}
            alignItems={'center'}
            borderRadius="8px 8px 0 0"
            mb={2}
          >
            <Typography variant={'h4'} color={'white'} textAlign={'center'}>
              Inventory Items
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpen}
            sx={{ mb: 2 }}
          >
            Add Item
          </Button>
          <Stack width="100%" height="400px" spacing={2} overflow={'auto'}>
            {inventory.map(({ name, quantity }) => (
              <Paper
                key={name}
                elevation={2}
                sx={{
                  width: '100%',
                  minHeight: '100px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: 2,
                  bgcolor: 'background.default',
                  borderRadius: 1,
                }}
              >
                <Typography variant={'h6'} color={'textPrimary'}>
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </Typography>
                <Typography variant={'h6'} color={'textPrimary'}>
                  Quantity: {quantity}
                </Typography>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => removeItem(name)}
                >
                  Remove
                </Button>
              </Paper>
            ))}
          </Stack>
        </Paper>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          width="40%"
          gap={4}
        >
          <TextField
            label="Search Item"
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button variant="contained" color="primary" onClick={handleSearch}>
            Search
          </Button>
          {searchResult && (
            <Paper elevation={3} sx={{ p: 2, border: '1px solid #333', width: '100%', borderRadius: 2 }}>
              <Typography variant={'h5'} color={'textPrimary'} textAlign={'center'}>
                {searchResult.name.charAt(0).toUpperCase() + searchResult.name.slice(1)}
              </Typography>
              <Typography variant={'h5'} color={'textPrimary'} textAlign={'center'}>
                Quantity: {searchResult.quantity} 
              </Typography>
            </Paper>
          )}
          {searchResult === null && searchTerm.trim() !== '' && (
            <Typography variant={'h6'} color={'textPrimary'} textAlign={'center'}>
              Item not found.
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  )
}
