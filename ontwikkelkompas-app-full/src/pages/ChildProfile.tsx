import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getObservations, addObservation } from "../lib/observations";

export const ChildProfile = () => {
  const { id } = useParams();
  const [notes, setNotes] = useState<any[]>([]);
  const [newNote, setNewNote] = useState("");

  useEffect(() => {
    if (id) getObservations(id).then(setNotes);
  }, [id]);

  const handleSubmit = async () => {
    if (!id || !newNote) return;
    await addObservation(id, newNote);
    setNewNote("");
    getObservations(id).then(setNotes);
  };

  return (
    <main className="p-4 space-y-4">
      <h1 className="text-xl font-bold capitalize">Observaties voor {id}</h1>

      <div className="space-y-2">
        <textarea
          placeholder="Nieuwe observatie"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-1 rounded">
          Toevoegen
        </button>
      </div>

      <ul className="list-disc list-inside pt-4">
        {notes.map((obs) => (
          <li key={obs.id}>
            <strong>{obs.date}</strong>: {obs.note}
          </li>
        ))}
      </ul>
    </main>
  );
};