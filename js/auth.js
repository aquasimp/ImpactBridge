const Auth = {
  currentUser: null,

  init() {
    if (FirebaseConfig.isLive()) {
      FirebaseConfig.auth.onAuthStateChanged(user => {
        if (user) {
          this.currentUser = {
            uid: user.uid,
            name: user.displayName || 'User',
            email: user.email,
            avatar: user.photoURL
          };
          this.updateUI();
        }
      });
    } else {

      this.currentUser = {
        uid: 'demo-user-001',
        name: 'Demo User',
        email: 'demo@impactbridge.in',
        avatar: null
      };
      this.updateUI();
    }
  },

  async signInWithGoogle() {
    if (FirebaseConfig.isLive()) {
      try {
        const provider = new firebase.auth.GoogleAuthProvider();
        const result = await FirebaseConfig.auth.signInWithPopup(provider);
        ImpactBridge.ui.showToast('success', 'Welcome!', `Signed in as ${result.user.displayName}`);
      } catch (e) {
        ImpactBridge.ui.showToast('error', 'Sign-in Failed', e.message);
      }
    } else {
      ImpactBridge.ui.showToast('info', 'Demo Mode', 'Using demo user account');
    }
  },

  signOut() {
    if (FirebaseConfig.isLive()) {
      FirebaseConfig.auth.signOut();
    }
    this.currentUser = { uid: 'demo-user-001', name: 'Demo User', email: 'demo@impactbridge.in', avatar: null };
    this.updateUI();
  },

  updateUI() {
    const userEl = document.getElementById('nav-user');
    const avatarEl = document.getElementById('nav-user-avatar');
    const nameEl = document.getElementById('nav-user-name');

    if (this.currentUser) {
      userEl.classList.remove('hidden');
      nameEl.textContent = this.currentUser.name;
      avatarEl.textContent = this.currentUser.name.charAt(0).toUpperCase();
    }
  }
};
