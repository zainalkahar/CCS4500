import { useEffect, useState } from 'react'
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
} from 'firebase/firestore'
import { db } from './firebase.js'
import './Crypto.css'

const blocksRef = collection(db, 'blocks')
const chainStateRef = doc(db, 'chain', 'state')
const FIRST_BLOCK_HASH = '0'.repeat(64)

async function hashBlock(block) {
  const contents = JSON.stringify({
    index: block.index,
    previousHash: block.previousHash,
    timestamp: block.timestamp,
    message: block.message,
  })
  const digest = await window.crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(contents),
  )

  return Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, '0'),
  ).join('')
}

function Crypto() {
  const [message, setMessage] = useState('')
  const [blocks, setBlocks] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const blocksQuery = query(blocksRef, orderBy('index', 'asc'))
    const unsubscribe = onSnapshot(
      blocksQuery,
      (snapshot) => {
        setBlocks(snapshot.docs.map((blockDoc) => blockDoc.data()))
        setIsLoading(false)
      },
      (snapshotError) => {
        setError(`Could not load blocks: ${snapshotError.message}`)
        setIsLoading(false)
      },
    )

    return unsubscribe
  }, [])

  async function addBlock(event) {
    event.preventDefault()
    const blockMessage = message.trim()
    if (!blockMessage) return

    setIsAdding(true)
    setError('')

    try {
      const newBlockRef = doc(blocksRef)
      const timestamp = new Date().toISOString()

      await runTransaction(db, async (transaction) => {
        const stateSnapshot = await transaction.get(chainStateRef)
        const state = stateSnapshot.exists() ? stateSnapshot.data() : null
        const block = {
          index: state?.length ?? 0,
          previousHash: state?.latestHash ?? FIRST_BLOCK_HASH,
          timestamp,
          message: blockMessage,
        }

        const hash = await hashBlock(block)
        transaction.set(newBlockRef, { ...block, hash })
        transaction.set(chainStateRef, {
          length: block.index + 1,
          latestHash: hash,
        })
      })

      setMessage('')
    } catch (addError) {
      setError(`Could not add block: ${addError.message}`)
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <main className="crypto-page">
      <header className="crypto-header">
        <div className="crypto-mark" aria-hidden="true">
          ◈
        </div>
        <p className="crypto-eyebrow">FIRESTORE LEDGER</p>
        <h1>Blockchain</h1>
        <p className="crypto-intro">
          Add a block to the chain. Each block links to the hash of the one
          before it.
        </p>
      </header>

      <section className="block-composer" aria-labelledby="add-block-title">
        <div className="section-heading">
          <div>
            <p className="crypto-eyebrow">NEW TRANSACTION</p>
            <h2 id="add-block-title">Add a block</h2>
          </div>
          <span className="chain-count">{blocks.length} blocks</span>
        </div>

        <form onSubmit={addBlock}>
          <label htmlFor="block-message">Block data</label>
          <textarea
            id="block-message"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Write a message to store in this block..."
            rows={3}
            maxLength={1000}
            required
          />
          <div className="form-footer">
            <span className="character-count">{message.length}/1000</span>
            <button type="submit" disabled={isAdding || !message.trim()}>
              {isAdding ? 'Adding block…' : '＋ Add block'}
            </button>
          </div>
        </form>

        {error && (
          <p className="crypto-error" role="alert">
            {error}
          </p>
        )}
      </section>

      <section className="chain-section" aria-labelledby="chain-title">
        <div className="section-heading">
          <div>
            <p className="crypto-eyebrow">PUBLIC RECORD</p>
            <h2 id="chain-title">The chain</h2>
          </div>
          <span className="live-indicator">LIVE</span>
        </div>

        {isLoading ? (
          <p className="chain-empty">Loading blocks…</p>
        ) : blocks.length === 0 ? (
          <div className="chain-empty">
            <span className="empty-icon" aria-hidden="true">◇</span>
            <p>No blocks yet</p>
            <span>Your first block will start the chain.</span>
          </div>
        ) : (
          <ol className="block-list">
            {blocks.map((block) => (
              <li className="block-card" key={block.hash}>
                <div className="block-topline">
                  <span className="block-number">
                    BLOCK <strong>#{block.index}</strong>
                  </span>
                  <time dateTime={block.timestamp}>
                    {new Date(block.timestamp).toLocaleString()}
                  </time>
                </div>
                <p className="block-message">{block.message}</p>
                <dl className="block-hashes">
                  <div>
                    <dt>HASH</dt>
                    <dd>{block.hash}</dd>
                  </div>
                  <div>
                    <dt>PREVIOUS HASH</dt>
                    <dd>{block.previousHash}</dd>
                  </div>
                </dl>
              </li>
            ))}
          </ol>
        )}
        <p className="chain-note">
          Blocks are stored in Firestore and linked with SHA-256 hashes. This
          demo ledger is not a decentralized blockchain.
        </p>
      </section>
    </main>
  )
}

export default Crypto
