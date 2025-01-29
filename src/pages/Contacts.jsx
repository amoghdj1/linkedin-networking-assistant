// src/pages/Contacts.jsx
import { useState, useEffect } from "react";
import {
  collection,
  onSnapshot,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase-config";

function Contacts() {
  // ---------------------------
  // State
  // ---------------------------
  const [contacts, setContacts] = useState([]);

  // Form state for adding a new contact
  const [newContact, setNewContact] = useState({ name: "", company: "", role: "" });

  // Edit state
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ name: "", company: "", role: "" });

  // Search & filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("All");

  // Sorting states
  const [sortField, setSortField] = useState("name"); // 'name' | 'company' | 'role'
  const [sortOrder, setSortOrder] = useState("asc");  // 'asc' | 'desc'

  // Pagination states
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 5; // Number of contacts per page

  // ---------------------------
  // Real-time subscription to Firestore
  // ---------------------------
  useEffect(() => {
    // Subscribe to the "contacts" collection
    const unsubscribe = onSnapshot(collection(db, "contacts"), (snapshot) => {
      const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setContacts(docs);
      setCurrentPage(0); // Reset to page 0 whenever data changes
    });

    return () => unsubscribe();
  }, []);

  // ---------------------------
  // Get unique roles dynamically
  // ---------------------------
  const uniqueRoles = [
    "All",
    ...new Set(contacts.map((contact) => contact.role || "Other")),
  ];

  // ---------------------------
  // Derived state: Filtered & Sorted data
  // ---------------------------
  const processedContacts = contacts
    // 1) Search filter
    .filter((contact) => {
      const term = searchTerm.toLowerCase();
      return (
        contact.name?.toLowerCase().includes(term) ||
        contact.company?.toLowerCase().includes(term) ||
        contact.role?.toLowerCase().includes(term)
      );
    })
    // 2) Role filter
    .filter((contact) => {
      if (selectedRole === "All") return true;
      return contact.role === selectedRole;
    })
    // 3) Sort
    .sort((a, b) => {
      const fieldA = (a[sortField] || "").toLowerCase();
      const fieldB = (b[sortField] || "").toLowerCase();
      if (sortOrder === "asc") {
        return fieldA.localeCompare(fieldB);
      } else {
        return fieldB.localeCompare(fieldA);
      }
    });

  // ---------------------------
  // Pagination
  // ---------------------------
  const totalContacts = processedContacts.length;
  const totalPages = Math.ceil(totalContacts / pageSize);

  const pageStart = currentPage * pageSize;
  const pageEnd = pageStart + pageSize;
  const pageContacts = processedContacts.slice(pageStart, pageEnd);

  const canPrev = currentPage > 0;
  const canNext = currentPage < totalPages - 1;

  // ---------------------------
  // Firestore CRUD Functions
  // ---------------------------

  // 1) Add a new contact
  const handleAddContact = async (e) => {
    e.preventDefault();
    if (!newContact.name.trim()) {
      alert("Name is required!");
      return;
    }
    try {
      await addDoc(collection(db, "contacts"), newContact);
      setNewContact({ name: "", company: "", role: "" });
      alert("Contact added successfully!");
    } catch (error) {
      console.error("Error adding document:", error.message);
    }
  };

  // 2) Delete a contact
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this contact?")) return;
    try {
      await deleteDoc(doc(db, "contacts", id));
      alert("Contact deleted!");
    } catch (error) {
      console.error("Error deleting document:", error.message);
    }
  };

  // 3) Start editing a contact
  const startEdit = (contact) => {
    setEditingId(contact.id);
    setEditData({
      name: contact.name,
      company: contact.company,
      role: contact.role,
    });
  };

  // 4) Save edited contact
  const saveEdit = async (id) => {
    try {
      await updateDoc(doc(db, "contacts", id), editData);
      setEditingId(null);
      alert("Contact updated!");
    } catch (error) {
      console.error("Error updating document:", error.message);
    }
  };

  // ---------------------------
  // Event Handlers
  // ---------------------------
  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const goToPrevPage = () => {
    if (canPrev) setCurrentPage((prev) => prev - 1);
  };

  const goToNextPage = () => {
    if (canNext) setCurrentPage((prev) => prev + 1);
  };

  // ---------------------------
  // Render
  // ---------------------------
  return (
    <div className="contacts-page">
      <h1>Contacts</h1>

      {/* Search & Filter Controls */}
      <div className="controls-container">
        <input
          className="contacts-input"
          type="text"
          placeholder="Search Contacts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          className="contacts-select"
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
        >
          {uniqueRoles.map((role) => (
            <option key={role} value={role}>
              {role === "" ? "Unknown" : role}
            </option>
          ))}
        </select>

        {/* Sort Field */}
        <select
          className="contacts-select"
          value={sortField}
          onChange={(e) => {
            setSortField(e.target.value);
            setCurrentPage(0);
          }}
        >
          <option value="name">Sort by Name</option>
          <option value="company">Sort by Company</option>
          <option value="role">Sort by Role</option>
        </select>

        {/* Sort Order Toggle */}
        <button className="sort-button" onClick={toggleSortOrder}>
          {sortOrder === "asc" ? "Asc ▲" : "Desc ▼"}
        </button>
      </div>

      {/* Add Contact Form */}
      <form onSubmit={handleAddContact} className="add-form">
        <input
          className="contacts-input"
          type="text"
          placeholder="Name"
          value={newContact.name}
          onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
          required
        />
        <input
          className="contacts-input"
          type="text"
          placeholder="Company"
          value={newContact.company}
          onChange={(e) => setNewContact({ ...newContact, company: e.target.value })}
        />
        <input
          className="contacts-input"
          type="text"
          placeholder="Role"
          value={newContact.role}
          onChange={(e) => setNewContact({ ...newContact, role: e.target.value })}
        />
        <button type="submit" className="add-button">Add Contact</button>
      </form>

      {/* Contacts List */}
      {pageContacts.length === 0 ? (
        <p style={{ textAlign: "center", marginTop: 20 }}>No contacts found.</p>
      ) : (
        <ul className="contacts-list">
          {pageContacts.map((contact) => (
            <li key={contact.id} className="contact-item">
              {editingId === contact.id ? (
                // Edit Mode
                <div className="edit-form">
                  <input
                    className="contacts-input"
                    type="text"
                    value={editData.name}
                    onChange={(e) =>
                      setEditData({ ...editData, name: e.target.value })
                    }
                  />
                  <input
                    className="contacts-input"
                    type="text"
                    value={editData.company}
                    onChange={(e) =>
                      setEditData({ ...editData, company: e.target.value })
                    }
                  />
                  <input
                    className="contacts-input"
                    type="text"
                    value={editData.role}
                    onChange={(e) =>
                      setEditData({ ...editData, role: e.target.value })
                    }
                  />
                  <div className="action-buttons">
                    <button
                      className="save-btn"
                      onClick={() => saveEdit(contact.id)}
                    >
                      Save
                    </button>
                    <button
                      className="cancel-btn"
                      onClick={() => setEditingId(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // Display Mode
                <div className="contact-info">
                  <h3>{contact.name}</h3>
                  <p>
                    {contact.company} · {contact.role || "Unknown"}
                  </p>
                  <div className="contact-actions">
                    <button className="edit-btn" onClick={() => startEdit(contact)}>
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(contact.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* Pagination Controls */}
      <div className="pagination">
        <button className="page-btn" onClick={goToPrevPage} disabled={!canPrev}>
          &lt; Prev
        </button>
        <span style={{ margin: "0 8px" }}>
          Page {currentPage + 1} of {totalPages || 1}
        </span>
        <button className="page-btn" onClick={goToNextPage} disabled={!canNext}>
          Next &gt;
        </button>
      </div>
    </div>
  );
}

export default Contacts;
