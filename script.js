document.addEventListener('DOMContentLoaded', () => {
    const newNoteTextarea = document.getElementById('new-note');
    const addNoteButton = document.getElementById('add-note');
    const notesList = document.getElementById('notes-list');

    addNoteButton.addEventListener('click', addNote);

    function addNote() {
        const noteText = newNoteTextarea.value.trim();
        if (noteText) {
            const note = {
                id: Date.now(),
                text: noteText,
                completed: false,
                timestamp: new Date()
            };
            saveNoteToStorage(note);
            renderNotes();
            newNoteTextarea.value = '';
        }
    }

    function saveNoteToStorage(note) {
        chrome.storage.sync.get(['notes'], (result) => {
            const notes = result.notes || [];
            notes.push(note);
            chrome.storage.sync.set({ notes });
        });
    }

    function renderNotes() {
        chrome.storage.sync.get(['notes'], (result) => {
            const notes = result.notes || [];
            notes.sort((a, b) => {
                if (a.completed === b.completed) {
                    return b.timestamp - a.timestamp;
                }
                return a.completed - b.completed;
            });

            notesList.innerHTML = '';
            notes.forEach(note => {
                const li = document.createElement('li');
                li.className = note.completed ? 'completed' : '';
                li.innerHTML = `
                    <input type="checkbox" ${note.completed ? 'checked' : ''} data-id="${note.id}">
                    ${note.text}
                `;
                li.querySelector('input').addEventListener('change', toggleNoteCompletion);
                notesList.appendChild(li);
            });
        });
    }

    function toggleNoteCompletion(event) {
        const noteId = Number(event.target.getAttribute('data-id'));
        chrome.storage.sync.get(['notes'], (result) => {
            const notes = result.notes || [];
            const note = notes.find(n => n.id === noteId);
            if (note) {
                note.completed = event.target.checked;
                chrome.storage.sync.set({ notes }, renderNotes);
            }
        });
    }

    renderNotes();
});
