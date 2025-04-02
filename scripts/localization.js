/**
* This class is responsible for handling the localization of the page.
* Language is initialized, set and updated using this class.
*/
export class LocalizationManager {
  constructor() {
    this.currentLanguage = 'en';
    this.translations = {};
  }

  /**
  * Initializes the language by attempting the following: 
  * 1. First tries to set the language based on "language" in ```localStorage```
  * 2. Then tries to set the language based on browser using ```navigator.language```
  * 3. If the above fail, sets the language using a fall back "en"
  */
  async initializeLanguage() {

    // Languages by default are loaded from local storage, the browser or a fallback
    // Arranged based on the "priority" or the source. Eg., should first try loading from local storage, then browser...
    const languageSources = {
      "localStorage": localStorage.getItem("language"),
      "browser": navigator.language.split("-")[0], // TODO: Maybe rename files to the full en-US, fi-FI that .language returns
      "defaultFallback": "en"
    }

    // Attempt to load the language from the above sources
    for (const source in languageSources) {
      try {
        await this.loadLanguage(languageSources[source]);
        return; // Language was loaded succesfully

        // Language could not be loaded:
      } catch (error) {
        console.warn(`Failed to load language from: ${source} with value: ${languageSources[source]}`);
      }
    }
  };

  /** Attempts to load a localization file based on the given parameter and then to update the texts to the new language.
   * @param {string} languageCode - The language code/name of the localization file
   * @throws An error if language file could not be fetched using languageCode
   */
  async loadLanguage(languageCode) {
    try {
      const response = await fetch(`/scripts/locales/${languageCode}.json`);
      this.translations = await response.json();
      this.currentLanguage = languageCode;
      this.updatePageText();
    } catch (error) {
      throw new Error(`Failed to load language: ${languageCode}`, error);
    }
  }

  /** Attempts to read and return a value from the active localization file
  * using the given parameter (key)
  * @param {string} path - The localization key
  */
  getText(path) {
    // Split the path by dots to navigate the nested JSON
    const keys = path.split('.');
    let result = this.translations;
    
    for (const key of keys) {
      if (result[key] === undefined) {
        console.warn(`Missing translation: ${path}`);
        return path;
      }
      result = result[key];
    }
    
    return result;
  }

  updatePageText() {
    // Update all elements with data-localization attribute
    document.querySelectorAll('[data-localization]').forEach(element => {
      const key = element.getAttribute('data-localization');
      element.textContent = this.getText(key);
    });

    // Update placeholders
    document.querySelectorAll('[data-localization-placeholder]').forEach(element => {
      const key = element.getAttribute('data-localization-placeholder');
      element.placeholder = this.getText(key);
    });

    // Update tooltips
    document.querySelectorAll('[data-localization-tooltip]').forEach(element => {
      const key = element.getAttribute('data-localization-tooltip');
      element.title = this.getText(key);
    });
  }
}