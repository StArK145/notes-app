document.addEventListener('DOMContentLoaded', function() {
    const addNoteBtn = document.getElementById('addNote');
    const notesContainer = document.getElementById('notesContainer');
    
    // Load saved notes
    loadNotes();
    
    addNoteBtn.addEventListener('click', function() {
        addNewNote();
    });
    
    function addNewNote(text = '', color = '#ffffff', id = Date.now()) {
        // Remove empty state if present
        const emptyState = document.querySelector('.empty-state');
        if (emptyState) {
            emptyState.remove();
        }
        
        const note = document.createElement('div');
        note.classList.add('note');
        note.dataset.id = id;
        note.style.backgroundColor = color;
        
        const now = new Date();
        const formattedDate = now.toLocaleDateString() + ' ' + now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        
        note.innerHTML = `
            <textarea placeholder="Write your note here...">${text}</textarea>
            <div class="note-footer">
                <span class="timestamp">Created: ${formattedDate}</span>
                <div class="btn-container">
                    <button class="color-btn">Color</button>
                    <button class="delete">Delete</button>
                </div>
            </div>
            <div class="color-palette">
                <div class="color-option" style="background-color: #ffffff;"></div>
                <div class="color-option" style="background-color: #ffdfba;"></div>
                <div class="color-option" style="background-color: #ffffba;"></div>
                <div class="color-option" style="background-color: #baffc9;"></div>
                <div class="color-option" style="background-color: #bae1ff;"></div>
                <div class="color-option" style="background-color: #ffb3ba;"></div>
            </div>
        `;
        
        notesContainer.appendChild(note);
        
        // Auto-focus new note
        const textarea = note.querySelector('textarea');
        textarea.focus();
        
        // Save note when text changes
        textarea.addEventListener('input', function() {
            saveNotes();
        });
        
        // Delete note
        const deleteBtn = note.querySelector('.delete');
        deleteBtn.addEventListener('click', function() {
            note.remove();
            saveNotes();
            
            // Show empty state if no notes
            if (notesContainer.children.length === 0) {
                notesContainer.innerHTML = `
                    <div class="empty-state">
                        <p>No notes yet. Click "Add New Note" to get started!</p>
                    </div>
                `;
            }
        });
        
        // Color palette toggle
        const colorBtn = note.querySelector('.color-btn');
        const colorPalette = note.querySelector('.color-palette');
        
        colorBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            // Close all other color palettes first
            document.querySelectorAll('.color-palette.show').forEach(palette => {
                if (palette !== colorPalette) {
                    palette.classList.remove('show');
                }
            });
            colorPalette.classList.toggle('show');
        });
        
        // Color options
        const colorOptions = note.querySelectorAll('.color-option');
        colorOptions.forEach(option => {
            option.addEventListener('click', function(e) {
                e.stopPropagation();
                const color = this.style.backgroundColor;
                note.style.backgroundColor = color;
                colorPalette.classList.remove('show');
                saveNotes();
            });
        });
        
        saveNotes();
    }
    
    // Close color palette when clicking outside
    document.addEventListener('click', function() {
        document.querySelectorAll('.color-palette.show').forEach(palette => {
            palette.classList.remove('show');
        });
    });
    
    function saveNotes() {
        const notes = [];
        document.querySelectorAll('.note').forEach(noteElement => {
            const id = noteElement.dataset.id;
            const text = noteElement.querySelector('textarea').value;
            const color = noteElement.style.backgroundColor;
            
            notes.push({
                id,
                text,
                color
            });
        });
        
        localStorage.setItem('notes', JSON.stringify(notes));
    }
    
    function loadNotes() {
        const savedNotes = JSON.parse(localStorage.getItem('notes')) || [];
        
        if (savedNotes.length === 0) {
            return; // Keep the empty state
        }
        
        // Remove empty state if we have notes
        const emptyState = document.querySelector('.empty-state');
        if (emptyState) {
            emptyState.remove();
        }
        
        savedNotes.forEach(note => {
            addNewNote(note.text, note.color, note.id);
        });
    }
});