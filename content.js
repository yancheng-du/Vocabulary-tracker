// content.js

// Function to check if the current page is a Google search result page
function isGoogleSearchPage() {
    return location.hostname === 'www.google.com' && location.pathname === '/search';
}

// Function to extract search query from Google search result page
function extractSearchQuery() {
    const searchInput = document.querySelector('input[name="q"]');
    if (searchInput) {
        console.log('Google search found!');
        return searchInput.value;
    }
    return null;
}

// Function to save word entry with timestamp
function saveWordEntry(word, definitions) {
    const timestamp = Date.now();
    chrome.storage.local.get(['word_entries'], function(data) {
        const wordEntries = data.word_entries || [];
        
        // Check if the word already exists in wordEntries
        const existingIndex = wordEntries.findIndex(entry => entry.word === word);
        
        if (existingIndex === -1) {
            // Word does not exist, so add it as a new entry
            wordEntries.push({ word, definitions, timestamp });
            chrome.storage.local.set({ word_entries: wordEntries });
        } else {
            // Word already exists, update the entry's timestamp
            wordEntries[existingIndex].timestamp = timestamp;
            chrome.storage.local.set({ word_entries: wordEntries });
        }
    });
}

// Function to extract dictionary box results
function extractDictionaryBoxResults() {
    const dictionaryBoxs = document.querySelectorAll('PZPZlf gBoaXb sxr04b');
    console.log(dictionaryBoxs)
    const dictionaryBox = document.querySelector('[jscontroller="g3PTRd"]');
    const definitionElements = dictionaryBox ? dictionaryBox.querySelectorAll('[data-attrid="SenseDefinition"]') : [];
    const definitions = Array.from(definitionElements).map(definitionElement => definitionElement.getAttribute('data-psd').split('~:&')[1]);

    if (dictionaryBox) {
        const word = dictionaryBox.getAttribute('data-query-term');
        console.log(word)
        if (word && definitions.length > 0) {
            saveWordEntry(word, definitions);
        }
    }
}


// Main function to track dictionary box results
function trackDictionaryBoxResults() {
    if (isGoogleSearchPage()) {
        const query = extractSearchQuery();
        if (query) {
            extractDictionaryBoxResults();
        }
    }
}

// Run the main function
trackDictionaryBoxResults();