import { i, id, init, InstaQLEntity } from '@instantdb/react';
import { useState } from 'react';

// ============================================================================
// INSTANT SETUP - Initialize connection and define schema
// ============================================================================

const schema = i.schema({
  entities: {
    notes: i.entity({
      title: i.string(),
      content: i.string(),
      timestamp: i.number().indexed(),
    }),
  },
});

const APP_ID = '42824120-dd80-4583-a23a-9c62dc936c8e';
const db = init({ appId: APP_ID, schema });

type Schema = typeof schema;
type Note = InstaQLEntity<Schema, 'notes'>;

// ============================================================================
// MAIN APP - Defines the Notepad App using InstantDB
// ============================================================================

function App() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);

  const { isLoading, error, data } = db.useQuery({
    notes: {
      $: { order: { timestamp: 'desc' } },
    },
  });

  const notes = data?.notes || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && content.trim()) {
      db.transact(
        db.tx.notes[id()].create({
          title: title.trim(),
          content: content.trim(),
          timestamp: Date.now(),
        })
      );
      setTitle('');
      setContent('');
    }
  };

  const handleSelectNote = (noteId: string) => {
    setSelectedNoteId(noteId);
  };

  const handleBack = () => {
    setSelectedNoteId(null);
  };

  if (isLoading) return null;
  if (error) return <div className="text-red-500 p-4">Error: {error.message}</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <header className="bg-white shadow-md p-4">
        <h1 className="text-xl font-bold text-center">Notepad</h1>
      </header>

      <main className="max-w-lg mx-auto mt-6 bg-white p-4 rounded-lg shadow-lg">
        {selectedNoteId ? (
          <NoteDetail noteId={selectedNoteId} onBack={handleBack} />
        ) : (
          <>
            <form onSubmit={handleSubmit} className="mb-4">
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full mb-2 px-3 py-2 border rounded"
                required
              />
              <textarea
                placeholder="Content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full mb-2 px-3 py-2 border rounded h-32"
                required
              />
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
                Add Note
              </button>
            </form>

            <div>
              {notes.map((note) => (
                <div
                  key={note.id}
                  className="p-4 border rounded mb-2 cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSelectNote(note.id)}>
                  <h2 className="font-semibold">{note.title}</h2>
                  <p className="text-sm text-gray-600">{note.content}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

function NoteDetail({ noteId, onBack }: { noteId: string; onBack: () => void }) {
  const { data } = db.useQuery({
    notes: {
      $: { where: { id: noteId } },
    },
  });

  const note = data?.notes?.[0];
  if (!note) return <div className="text-gray-500 p-4">Note not found</div>;

  return (
    <div>
      <button onClick={onBack} className="text-blue-500 hover:underline mb-2">
        ← Back
      </button>
      <h2 className="text-2xl font-bold mb-2">{note.title}</h2>
      <p className="text-gray-700">{note.content}</p>
      <div className="text-xs text-gray-500 mt-4">
        Created on {new Date(note.timestamp).toLocaleString()}
      </div>
    </div>
  );
}

export default App;
