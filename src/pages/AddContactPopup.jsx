import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from '@mui/material';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase-config';

function AddContactPopup({ open, onClose }) {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [profileUrl, setProfileUrl] = useState('');

  const handleAddContact = async () => {
    if (!name.trim() || !role.trim() || !profileUrl.trim()) {
      alert('All fields are required!');
      return;
    }

    try {
      await addDoc(collection(db, 'contacts'), { name, role, profileUrl });
      alert('Contact added successfully!');
      onClose();
    } catch (error) {
      console.error('Error adding document:', error.message);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Contact</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Name"
          type="text"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Role"
          type="text"
          fullWidth
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />
        <TextField
          margin="dense"
          label="LinkedIn Profile URL"
          type="text"
          fullWidth
          value={profileUrl}
          onChange={(e) => setProfileUrl(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleAddContact} color="primary">
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddContactPopup;