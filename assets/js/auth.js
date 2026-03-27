document.addEventListener('DOMContentLoaded', () => {
  const authCard = document.getElementById('auth-card');
  const authForm = document.getElementById('auth-form');
  const loggedInState = document.getElementById('logged-in-state');
  const toggleLink = document.getElementById('toggle-link');
  const authTitle = document.getElementById('auth-title');
  const authSubtitle = document.getElementById('auth-subtitle');
  const authSubmitBtn = document.getElementById('auth-submit-btn');
  const toggleText = document.getElementById('toggle-text');
  
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const nameInput = document.getElementById('name');
  
  const errorBox = document.getElementById('auth-error');
  const errorSpan = errorBox ? errorBox.querySelector('span') : null;
  const successBox = document.getElementById('auth-success');
  const successSpan = successBox ? successBox.querySelector('span') : null;
  const btnLogout = document.getElementById('btn-logout');

  let isSignup = false;

  function checkAuth() {
    const session = localStorage.getItem('vugandakumva_session');
    if (session) {
      if (authForm) authForm.classList.add('hidden');
      if (loggedInState) loggedInState.classList.add('active');
    } else {
      if (authForm) authForm.classList.remove('hidden');
      if (loggedInState) loggedInState.classList.remove('active');
    }
  }

  checkAuth();

  function showError(msg) {
    if(errorSpan) errorSpan.textContent = msg;
    errorBox.style.display = 'block';
    successBox.style.display = 'none';
  }

  function showSuccess(msg) {
    if(successSpan) successSpan.textContent = msg;
    successBox.style.display = 'block';
    errorBox.style.display = 'none';
  }

  if (toggleLink) {
    toggleLink.addEventListener('click', () => {
      isSignup = !isSignup;
      authCard.classList.toggle('is-signup', isSignup);
      
      errorBox.style.display = 'none';
      successBox.style.display = 'none';
      
      authTitle.textContent = isSignup ? 'Create Account' : 'Welcome Back';
      authSubtitle.textContent = isSignup ? 'Join us securely in supporting the mission.' : 'Sign in to securely access support.';
      authSubmitBtn.textContent = isSignup ? 'Create Account' : 'Sign In';
      toggleText.textContent = isSignup ? 'Already have an account?' : 'Don\'t have an account?';
      toggleLink.textContent = isSignup ? 'Sign in here' : 'Create one safely';
    });
  }

  if (authForm) {
    authForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const email = emailInput.value.trim();
      const password = passwordInput.value;
      const name = nameInput.value.trim();

      const endpoint = isSignup ? '/auth/signup' : '/auth/login';
      const payload = { email, password };
      if (isSignup) payload.name = name;

      authSubmitBtn.disabled = true;
      authSubmitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';

      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Authentication failed');
        }

        if (data.session) {
          localStorage.setItem('vugandakumva_session', JSON.stringify(data.session));
          localStorage.setItem('vugandakumva_user', JSON.stringify(data.user));
          
          if (isSignup) {
            showSuccess('Account created successfully! Welcome to Vugandakumva.');
          } else {
            showSuccess('Successfully signed in. Welcome back!');
          }

          setTimeout(() => {
            checkAuth();
          }, 1000);
        } else if (isSignup) {
          showSuccess('Registration successful! Please check your email to confirm your account.');
          setTimeout(() => toggleLink.click(), 4000);
        }

      } catch (err) {
        showError(err.message);
      } finally {
        authSubmitBtn.disabled = false;
        authSubmitBtn.textContent = isSignup ? 'Create Account' : 'Sign In';
      }
    });
  }

  if (btnLogout) {
    btnLogout.addEventListener('click', async () => {
      localStorage.removeItem('vugandakumva_session');
      localStorage.removeItem('vugandakumva_user');
      checkAuth();
      showSuccess('You have been safely signed out.');
      
      try {
        await fetch('/auth/logout', { method: 'POST' });
      } catch(e) {}
    });
  }
});
