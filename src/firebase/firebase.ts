// IMPORTANTE: Archivo de compatibilidad para importaciones antiguas
// Ahora usa la configuración centralizada en lib/firebase.ts

import { db, auth, storage, messaging } from '../lib/firebase';

export { db, auth, storage, messaging };
export default { db, auth, storage, messaging };
