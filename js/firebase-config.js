
const FirebaseConfig = {
  // Set to true and fill in your Firebase config to enable live mode
  LIVE_MODE: false,

  config: {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
  },

  db: null,
  auth: null,
  initialized: false,

  init() {
    if (this.LIVE_MODE && this.config.apiKey !== "YOUR_API_KEY") {
      try {
        firebase.initializeApp(this.config);
        this.db = firebase.firestore();
        this.auth = firebase.auth();
        this.initialized = true;
        console.log('🔥 Firebase initialized in LIVE mode');
      } catch (e) {
        console.warn('Firebase init failed, falling back to demo mode:', e);
        this.initialized = false;
      }
    } else {
      console.log('🎮 Running in DEMO mode (no Firebase config)');
      this.initialized = false;
    }
  },

  isLive() {
    return this.initialized && this.LIVE_MODE;
  }
};
