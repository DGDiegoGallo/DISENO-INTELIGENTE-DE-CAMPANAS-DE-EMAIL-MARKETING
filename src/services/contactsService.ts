interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
  group: string;
}

// Claves para localStorage
const CONTACTS_STORAGE_KEY = 'email_marketing_contacts';
const GROUPS_STORAGE_KEY = 'email_marketing_groups';

// Inicializar localStorage con valores por defecto si no existen
const initializeStorage = () => {
  if (!localStorage.getItem(CONTACTS_STORAGE_KEY)) {
    localStorage.setItem(CONTACTS_STORAGE_KEY, JSON.stringify([]));
  }
  
  if (!localStorage.getItem(GROUPS_STORAGE_KEY)) {
    localStorage.setItem(GROUPS_STORAGE_KEY, JSON.stringify([]));
  }
};

// Obtener todos los contactos
export const getAllContacts = (): Contact[] => {
  initializeStorage();
  return JSON.parse(localStorage.getItem(CONTACTS_STORAGE_KEY) || '[]');
};

// Guardar todos los contactos
export const saveAllContacts = (contacts: Contact[]): void => {
  localStorage.setItem(CONTACTS_STORAGE_KEY, JSON.stringify(contacts));
};

// Obtener todos los grupos
export const getAllGroups = (): string[] => {
  initializeStorage();
  return JSON.parse(localStorage.getItem(GROUPS_STORAGE_KEY) || '[]');
};

// Guardar todos los grupos
export const saveAllGroups = (groups: string[]): void => {
  localStorage.setItem(GROUPS_STORAGE_KEY, JSON.stringify(groups));
};

// Añadir un nuevo grupo
export const addGroup = (groupName: string): void => {
  const groups = getAllGroups();
  if (!groups.includes(groupName)) {
    groups.push(groupName);
    saveAllGroups(groups);
  }
};

// Eliminar un grupo
export const removeGroup = (groupName: string): void => {
  const groups = getAllGroups();
  const newGroups = groups.filter(g => g !== groupName);
  saveAllGroups(newGroups);
  
  // Actualizar contactos que tenían este grupo
  const contacts = getAllContacts();
  
  // Asignar a otro grupo disponible o dejar sin grupo
  let targetGroup = '';
  if (newGroups.length > 0) {
    targetGroup = newGroups[0]; // Usar el primer grupo disponible
  }
  
  const updatedContacts = contacts.map(contact => 
    contact.group === groupName ? { ...contact, group: targetGroup } : contact
  );
  saveAllContacts(updatedContacts);
};

// Añadir un nuevo contacto
export const addContact = (contact: Omit<Contact, 'id'>): Contact => {
  const contacts = getAllContacts();
  
  // Generar un ID único que evite colisiones
  // Combinamos timestamp con un número aleatorio
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  const uniqueId = timestamp * 10000 + random;
  
  const newContact = {
    ...contact,
    id: uniqueId
  };
  
  contacts.push(newContact);
  saveAllContacts(contacts);
  return newContact;
};

// Actualizar un contacto existente
export const updateContact = (id: number, updatedContact: Partial<Contact>): void => {
  const contacts = getAllContacts();
  const newContacts = contacts.map(contact => 
    contact.id === id ? { ...contact, ...updatedContact } : contact
  );
  saveAllContacts(newContacts);
};

// Eliminar un contacto
export const removeContact = (id: number): void => {
  const contacts = getAllContacts();
  const newContacts = contacts.filter(contact => contact.id !== id);
  saveAllContacts(newContacts);
};

// Obtener contactos por grupo
export const getContactsByGroup = (groupName: string): Contact[] => {
  const contacts = getAllContacts();
  return contacts.filter(contact => contact.group === groupName);
};

// Obtener todos los correos electrónicos de un grupo específico
export const getEmailsByGroup = (groupName: string): string[] => {
  const contacts = getContactsByGroup(groupName);
  return contacts.map(contact => contact.email);
};

// Convertir un array de correos a string separado por comas
export const emailArrayToString = (emails: string[]): string => {
  return emails.join(', ');
};

// Obtener todos los correos electrónicos de varios grupos
export const getEmailsFromGroups = (groupNames: string[]): string => {
  const allEmails: string[] = [];
  
  groupNames.forEach(groupName => {
    const groupEmails = getEmailsByGroup(groupName);
    allEmails.push(...groupEmails);
  });
  
  // Eliminar duplicados (un contacto podría estar en múltiples grupos)
  const uniqueEmails = [...new Set(allEmails)];
  
  return emailArrayToString(uniqueEmails);
};
