// Function to retrieve and display stored vocabulary results
function displayResults() {
    chrome.storage.local.get(['word_entries'], function(data) {
        const wordEntries = data.word_entries || [];
        const vocabularyBody = document.getElementById('vocabulary-body');

        // Sort word entries by timestamp (recently viewed first)
        wordEntries.sort((a, b) => b.timestamp - a.timestamp);
        
        // Clear previous content
        vocabularyBody.innerHTML = '';

        // Check if there are no word entries
        if (wordEntries.length === 0) {
            const messageRow = document.createElement('tr');
            messageRow.innerHTML = `<td colspan="3">No definitions were recorded.</td>`;
            vocabularyBody.appendChild(messageRow);
            return;
        }

        // Display word entries
        wordEntries.forEach(entry => {
            const word = entry.word;
            const definitions = entry.definitions;
            
            // Create a new major row for the word
            const majorRow = document.createElement('tr');
            majorRow.innerHTML = `<td>${word}</td><td>${definitions.map((def, index) => `${index + 1}. ${def}`).join('<br>')}</td><td><button class="delete-btn" data-word="${word}">Delete</button></td>`;
            
            // Append the major row to the vocabulary table body
            vocabularyBody.appendChild(majorRow);
        });

        // Add event listener to delete buttons
        const deleteButtons = document.querySelectorAll('.delete-btn');
        deleteButtons.forEach(button => {
            button.addEventListener('click', function() {
                const wordToDelete = button.dataset.word;
                deleteWord(wordToDelete);
            });
        });
    });
}

// Function to delete a word and its definitions
function deleteWord(wordToDelete) {
    chrome.storage.local.get(['word_entries'], function(data) {
        const wordEntries = data.word_entries || [];
        const updatedEntries = wordEntries.filter(entry => entry.word !== wordToDelete);
        chrome.storage.local.set({ word_entries: updatedEntries }, function() {
            // Refresh the display after deletion
            displayResults();
        });
    });
}

// Function to delete all word entries with confirmation
function deleteAllEntries() {
    const confirmationContainer = document.getElementById('confirmation-container');
    confirmationContainer.style.display = 'block';

    // Add event listener to confirm delete button
    const confirmDeleteButton = document.getElementById('confirm-delete-button');
    confirmDeleteButton.addEventListener('click', function() {
        chrome.storage.local.remove('word_entries', function() {
            // Refresh the display after deletion
            displayResults();
        });
        confirmationContainer.style.display = 'none';
    });

    // Add event listener to cancel delete button
    const cancelDeleteButton = document.getElementById('cancel-delete-button');
    cancelDeleteButton.addEventListener('click', function() {
        confirmationContainer.style.display = 'none';
    });
}

// Run the displayResults function when the popup is opened
document.addEventListener('DOMContentLoaded', function() {
    displayResults();

    // Add event listener to delete all button
    const deleteAllButton = document.getElementById('delete-all-button');
    deleteAllButton.addEventListener('click', function() {
        deleteAllEntries();
    });
});
