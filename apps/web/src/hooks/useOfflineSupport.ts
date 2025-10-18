import { useState, useEffect } from 'react'

interface OfflineOperation {
  id: string
  type: 'sale' | 'product_update' | 'inventory_adjustment'
  data: any
  timestamp: number
  retries: number
}

export function useOfflineSupport() {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [pendingOperations, setPendingOperations] = useState<OfflineOperation[]>([])
  const [syncInProgress, setSyncInProgress] = useState(false)

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      syncPendingOperations()
    }

    const handleOffline = () => {
      setIsOnline(false)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const saveOfflineOperation = (type: OfflineOperation['type'], data: any) => {
    const operation: OfflineOperation = {
      id: generateId(),
      type,
      data,
      timestamp: Date.now(),
      retries: 0
    }

    setPendingOperations(prev => [...prev, operation])

    // Save to IndexedDB for persistence
    saveToIndexedDB(operation)
  }

  const syncPendingOperations = async () => {
    if (!isOnline || pendingOperations.length === 0 || syncInProgress) {
      return
    }

    setSyncInProgress(true)

    const failedOperations: OfflineOperation[] = []

    for (const operation of pendingOperations) {
      try {
        await syncOperation(operation)
      } catch (error) {
        console.error('Failed to sync operation:', error)
        failedOperations.push({ ...operation, retries: operation.retries + 1 })
      }
    }

    setPendingOperations(failedOperations)
    setSyncInProgress(false)
  }

  const syncOperation = async (operation: OfflineOperation): Promise<void> => {
    const endpoint = getEndpointForOperation(operation.type)

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      },
      body: JSON.stringify({
        ...operation.data,
        clientTimestamp: operation.timestamp
      })
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    // Remove from IndexedDB on successful sync
    removeFromIndexedDB(operation.id)
  }

  const clearPendingOperations = () => {
    setPendingOperations([])
    clearIndexedDB()
  }

  return {
    isOnline,
    pendingOperations,
    syncInProgress,
    saveOfflineOperation,
    syncPendingOperations,
    clearPendingOperations
  }
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

function getEndpointForOperation(type: OfflineOperation['type']): string {
  switch (type) {
    case 'sale':
      return '/api/v1/sales/sync'
    case 'product_update':
      return '/api/v1/products/sync'
    case 'inventory_adjustment':
      return '/api/v1/inventory/sync'
    default:
      throw new Error(`Unknown operation type: ${type}`)
  }
}

// IndexedDB helpers
function getIndexedDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('StoreWiseOfflineDB', 1)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)

    request.onupgradeneeded = (event) => {
      const db = event.target.result
      if (!db.objectStoreNames.contains('operations')) {
        const store = db.createObjectStore('operations', { keyPath: 'id' })
        store.createIndex('timestamp', 'timestamp')
        store.createIndex('type', 'type')
      }
    }
  })
}

async function saveToIndexedDB(operation: OfflineOperation): Promise<void> {
  const db = await getIndexedDB()
  const transaction = db.transaction(['operations'], 'readwrite')
  const store = transaction.objectStore('operations')
  return new Promise((resolve, reject) => {
    const request = store.put(operation)
    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}

async function removeFromIndexedDB(id: string): Promise<void> {
  const db = await getIndexedDB()
  const transaction = db.transaction(['operations'], 'readwrite')
  const store = transaction.objectStore('operations')
  return new Promise((resolve, reject) => {
    const request = store.delete(id)
    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}

async function clearIndexedDB(): Promise<void> {
  const db = await getIndexedDB()
  const transaction = db.transaction(['operations'], 'readwrite')
  const store = transaction.objectStore('operations')
  return new Promise((resolve, reject) => {
    const request = store.clear()
    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}