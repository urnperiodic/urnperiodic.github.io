import { getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { doc, getDocFromServer, getFirestore } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

export const firebaseApp = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
export const lobbyAuth = getAuth(firebaseApp);
export const lobbyDb = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId);

export const OperationType = {
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  LIST: 'list',
  GET: 'get',
  WRITE: 'write',
};

export function isFirestorePermissionError(error) {
  const code = String(error?.code || '').toLowerCase();
  const msg = String(error?.message || '').toLowerCase();
  return code === 'permission-denied' || msg.includes('missing or insufficient permissions');
}

export function handleFirestoreError(error, operationType, path) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: lobbyAuth.currentUser?.uid,
      email: lobbyAuth.currentUser?.email,
      emailVerified: lobbyAuth.currentUser?.emailVerified,
      isAnonymous: lobbyAuth.currentUser?.isAnonymous,
      tenantId: lobbyAuth.currentUser?.tenantId,
      providerInfo:
        lobbyAuth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

async function testConnection() {
  try {
    await getDocFromServer(doc(lobbyDb, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
  }
}
testConnection();
