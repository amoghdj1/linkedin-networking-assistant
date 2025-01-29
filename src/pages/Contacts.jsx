import { useState, useEffect } from "react";
import {
  db
} from "../firebase-config";
import {
  collection,
  onSnapshot,
  addDoc,
  doc,
  updateDoc,
  deleteDoc
} from "firebase/firestore";

function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [newContact, setNewContact] = useState({ name: "", company: "", role: "" });
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ name: "", company: "", role: "" });

  // Real-time subscription to contacts
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "contacts"), (snapshot) => {
      setContacts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // Clean up listener on unmount
    return () => unsubscribe();
  }, []);

  // Add a new contact
  const handleAddContact = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "contacts"), newContact);
      setNewContact({ name: "", company: "", role: "" });
      alert("Contact added!");
    } catch (error) {
      console.error("Error adding document:", error.message);
    }
  };

  // Delete a contact
  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "contacts", id));
      alert("Contact deleted!");
    } catch (error) {
      console.error("Error deleting document:", error.message);
    }
  };

  // Start editing
  const startEdit = (contact) => {
    setEditingId(contact.id);
    setEditData({ name: contact.name, company: contact.company, role: contact.role });
  };

  // Save edited contact
  const saveEdit = async (id) => {
    try {
      await updateDoc(doc(db, "contacts", id), editData);
      setEditingId(null);
      alert("Contact updated!");
    } catch (error) {
      console.error("Error updating document:", error.message);
    }
  };

  return (
    <div className="contacts-page">
      <h1>Contacts</h1>
      
      {/* Add Contact Form */}
      <form onSubmit={handleAddContact} className="add-form">
        <input
          type="text"
          placeholder="Name"
          value={newContact.name}
          onChange={e => setNewContact({ ...newContact, name: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Company"
          value={newContact.company}
          onChange={e => setNewContact({ ...newContact, company: e.target.value })}
        />
        <input
          type="text"
          placeholder="Role"
          value={newContact.role}
          onChange={e => setNewContact({ ...newContact, role: e.target.value })}
        />
        <button type="submit">Add Contact</button>
      </form>

      {/* Contacts List */}
      <ul className="contacts-list">
        {contacts.map(contact => (
          <li key={contact.id} className="contact-item">
            {editingId === contact.id ? (
              <div className="edit-form">
                <input
                  type="text"
                  value={editData.name}
                  onChange={e => setEditData({ ...editData, name: e.target.value })}
                />
                <input
                  type="text"
                  value={editData.company}
                  onChange={e => setEditData({ ...editData, company: e.target.value })}
                />
                <input
                  type="text"
                  value={editData.role}
                  onChange={e => setEditData({ ...editData, role: e.target.value })}
                />
                <button onClick={() => saveEdit(contact.id)}>Save</button>
                <button onClick={() => setEditingId(null)}>Cancel</button>
              </div>
            ) : (
              <div className="contact-info">
                <h3>{contact.name}</h3>
                <p>{contact.company} · {contact.role}</p>
                <div className="contact-actions">
                  <button onClick={() => startEdit(contact)}>Edit</button>
                  <button onClick={() => handleDelete(contact.id)}>Delete</button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Contacts;
