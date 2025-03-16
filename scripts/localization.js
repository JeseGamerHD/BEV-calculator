export class LocalizationManager {
  constructor() {
    this.currentLanguage = 'en';
    this.translations = {};
  }

  async loadLanguage(languageCode) {
    try {
      const response = await fetch(`/scripts/locales/${languageCode}.json`);
      this.translations = await response.json();
      this.currentLanguage = languageCode;
      this.updatePageText();
    } catch (error) {
      console.error(`Failed to load language: ${languageCode}`, error);
    }
  }

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

    // Update dropdown tips
    document.querySelectorAll('.dropdown-tip').forEach(element => {
      const dropdownId = element.closest('.dropdown-content').id;
      let key = '';
      
      if (dropdownId.includes('batteryCapacity')) {
        key = 'inputs.batteryCapacity.tip';
      } else if (dropdownId.includes('energyConsumption')) {
        key = 'inputs.energyConsumption.tip';
      } else if (dropdownId.includes('chargePower')) {
        key = 'inputs.chargePower.tip';
      }
      
      if (key) {
        element.textContent = this.getText(key);
      }
    });

    // Update comparison options
    document.querySelectorAll('.option-text').forEach((element, index) => {
      const key = index % 2 === 0 ? 'results.optionText.option1' : 'results.optionText.option2';
      element.textContent = this.getText(key);
    });
  }
}