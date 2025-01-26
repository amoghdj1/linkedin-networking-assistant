import { useState, useEffect } from 'react';
import { db } from '../firebase-config';
import { collection, getDocs, addDoc } from 'firebase/firestore';

function Contacts() {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    const fetchContacts = async () => {
      const querySnapshot = await getDocs(collection(db, "contacts"));
      setContacts(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    fetchContacts();
  }, []);

  const addContact = async () => {
    try {
      await addDoc(collection(db, "contacts"), {
        name: "Jane Doe",
        company: "ABC Corp",
        role: "Product Manager",
      });
      alert("Contact added successfully!");
    } catch (error) {
      console.error("Error adding document:", error.message);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-indigo-600">Contacts</h1>
      <button onClick={addContact} className="mt-4 bg-indigo-600 text-white p-2 rounded">
        Add Contact
      </button>

      <ul className="mt-6">
        {contacts.length > 0 ? (
          contacts.map((contact) => (
            <li key={contact.id} className="border p-4 rounded mb-2">
              <p className="font-semibold">{contact.name}</p>
              <p className="text-gray-600">{contact.company} - {contact.role}</p>
            </li>
          ))
        ) : (
          <p className="text-gray-500">No contacts found.</p>
        )}
      </ul>
    </div>
  );
}

export default Contacts;
