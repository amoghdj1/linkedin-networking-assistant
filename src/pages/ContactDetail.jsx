import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase-config';

function ContactDetail() {
  const { id } = useParams();
  const [contact, setContact] = useState(null);

  useEffect(() => {
    const fetchContact = async () => {
      const docRef = doc(db, 'contacts', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setContact(docSnap.data());
      } else {
        console.log('No such document!');
      }
    };

    fetchContact();
  }, [id]);

  if (!contact) {
    return <p>Loading...</p>;
  }

  return (
    <div className="contact-detail">
      <h1>{contact.name}</h1>
      <p>Company: {contact.company}</p>
      <p>Role: {contact.role}</p>
      <p>LinkedIn Profile: <a href={contact.profileUrl} target="_blank" rel="noopener noreferrer">{contact.profileUrl}</a></p>
    </div>
  );
}

export default ContactDetail;