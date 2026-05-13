import { useEffect, useState } from 'react'
import { api } from '../lib/api'

function ContactForm() {
  const [nom, setNom] = useState('')
  const [email, setEmail] = useState('')
  const [telephone, setTelephone] = useState('')
  const [contacts, setContacts] = useState([])
  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    api.get('/contacts').then(setContacts)
  }, [])

  const resetForm = () => {
    setNom('')
    setEmail('')
    setTelephone('')
    setEditingId(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!nom || !email || !telephone) return

    if (editingId !== null) {
      const updated = await api.put(`/contacts/${editingId}`, { nom, email, telephone })
      setContacts(contacts.map((c) => (c.id === editingId ? updated : c)))
    } else {
      const created = await api.post('/contacts', { nom, email, telephone })
      setContacts([...contacts, created])
    }
    resetForm()
  }

  const handleEdit = (contact) => {
    setNom(contact.nom)
    setEmail(contact.email)
    setTelephone(contact.telephone)
    setEditingId(contact.id)
  }

  const handleDelete = async (id) => {
    await api.delete(`/contacts/${id}`)
    setContacts(contacts.filter((c) => c.id !== id))
  }

  return (
    <div>
      <h2>{editingId !== null ? 'Modifier le contact' : 'Ajouter un contact'}</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <label>
          Nom :{' '}
          <input
            type="text"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
          />
        </label>
        <label>
          Email :{' '}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label>
          Téléphone :{' '}
          <input
            type="tel"
            value={telephone}
            onChange={(e) => setTelephone(e.target.value)}
          />
        </label>
        <button type="submit">{editingId !== null ? 'Enregistrer' : 'Ajouter'}</button>
        {editingId !== null && (
          <button type="button" onClick={resetForm}>
            Annuler
          </button>
        )}
      </form>

      <h2>Liste des contacts</h2>
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            {contact.nom} - {contact.email} - {contact.telephone}{' '}
            <button onClick={() => handleEdit(contact)}>Modifier</button>{' '}
            <button onClick={() => handleDelete(contact.id)}>Supprimer</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ContactForm
