import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
  const [contacts, setContacts] = useState([]);
  const [newContact, setNewContact] = useState({ name: "", company: "", role: "" });
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ name: "", company: "", role: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("All");
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 5;

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "contacts"), (snapshot) => {
      const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setContacts(docs);
      setCurrentPage(0);
    });

    return () => unsubscribe();
  }, []);

  const uniqueRoles = [
    "All",
    ...new Set(contacts.map((contact) => contact.role || "Other")),
  ];

  const processedContacts = contacts
    .filter((contact) => {
      const term = searchTerm.toLowerCase();
      return (
        contact.name?.toLowerCase().includes(term) ||
        contact.company?.toLowerCase().includes(term) ||
        contact.role?.toLowerCase().includes(term)
      );
    })
    .filter((contact) => {
      if (selectedRole === "All") return true;
      return contact.role === selectedRole;
    })
    .sort((a, b) => {
      const fieldA = (a[sortField] || "").toLowerCase();
      const fieldB = (b[sortField] || "").toLowerCase();
      if (sortOrder === "asc") {
        return fieldA.localeCompare(fieldB);
      } else {
        return fieldB.localeCompare(fieldA);
      }
    });

  const totalContacts = processedContacts.length;
  const totalPages = Math.ceil(totalContacts / pageSize);

  const pageStart = currentPage * pageSize;
  const pageEnd = pageStart + pageSize;
  const pageContacts = processedContacts.slice(pageStart, pageEnd);

  const canPrev = currentPage > 0;
  const canNext = currentPage < totalPages - 1;

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

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this contact?")) return;
    try {
      await deleteDoc(doc(db, "contacts", id));
      alert("Contact deleted!");
    } catch (error) {
      console.error("Error deleting document:", error.message);
    }
  };

  const startEdit = (contact) => {
    setEditingId(contact.id);
    setEditData({
      name: contact.name,
      company: contact.company,
      role: contact.role,
    });
  };

  const saveEdit = async (id) => {
    try {
      await updateDoc(doc(db, "contacts", id), editData);
      setEditingId(null);
      alert("Contact updated!");
    } catch (error) {
      console.error("Error updating document:", error.message);
    }
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const goToPrevPage = () => {
    if (canPrev) setCurrentPage((prev) => prev - 1);
  };

  const goToNextPage = () => {
    if (canNext) setCurrentPage((prev) => prev + 1);
  };

  return (
    <div className="contacts-page">
      <h1>Contacts</h1>
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
        <button className="sort-button" onClick={toggleSortOrder}>
          {sortOrder === "asc" ? "Asc ▲" : "Desc ▼"}
        </button>
      </div>
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
      {pageContacts.length === 0 ? (
        <p style={{ textAlign: "center", marginTop: 20 }}>No contacts found.</p>
      ) : (
        <ul className="contacts-list">
          {pageContacts.map((contact) => (
            <li key={contact.id} className="contact-item">
              {editingId === contact.id ? (
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
                <div className="contact-info">
                  <h3><Link to={`/contacts/${contact.id}`}>{contact.name}</Link></h3>
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