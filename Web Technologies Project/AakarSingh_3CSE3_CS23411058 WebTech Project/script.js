// script.js

document.addEventListener('DOMContentLoaded', () => {
    console.log("StudyBuddy AI initialized");

    // Replace the string below with your actual Gemini API Key
    const GEMINI_API_KEY = 'AIzaSyD39-AKY3YLqBgDgy6544ZEQAC0rjXVEHc';

    // Global tracking states for pagination
    let currentPage = 1;
    let currentTopic = '';
    let currentEduLevel = '';

    // Call real Gemini API
    const fetchAIRecommendations = async (topic, eduLevel, pageNumber) => {
        if (!GEMINI_API_KEY || GEMINI_API_KEY.length < 20) {
            throw new Error("Missing or invalid API Key. Please insert your valid Gemini API Key directly into script.js around line 7.");
        }

        const prompt = `Return a valid JSON array containing exactly 6 real, free online courses or learning resources for the topic: "${topic}". 
        CRITICAL: The "url" field MUST contain a full, real, working absolute HTTP link (starting with https://).
        These resources must be specifically tailored for a student at the "${eduLevel}" level.
        This is Batch / Page # ${pageNumber}. Ensure that the courses provided are distinct from general results to provide variety.
        Each object in the array MUST have these exact keys:
        - "title": (string) Short title of the course
        - "desc": (string) A 1-sentence description
        - "domain": (string) The root domain of the website offering this course (e.g., "coursera.org", "edx.org", "udemy.com", "freecodecamp.org").
        - "match": (string) e.g., "98% Match"
        - "time": (string) e.g., "⏱️ 3h 15m" or "⏱️ 10 videos"
        - "url": (string) The absolute working URL (starting with https://) to the resource
        - "tagClass": (string) randomly choose: "tag-high" or "tag-medium"
        - "gradClass": (string) randomly choose: "bg-gradient-1", "bg-gradient-2", or "bg-gradient-3"
        Do not include any markdown formatting, backticks, or text outside the raw JSON array. Just the raw JSON format.`;

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${GEMINI_API_KEY}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: prompt }]
                }],
                generationConfig: {
                    temperature: 0.7,
                }
            })
        });

        if (!response.ok) {
            let errorText = 'Unknown Error';
            try { errorText = await response.text(); } catch (e) { }
            throw new Error(`API Error: ${response.status}\nDetails: ${errorText}`);
        }

        const data = await response.json();
        const rawText = data.candidates[0].content.parts[0].text;

        try {
            let cleanedText = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
            return JSON.parse(cleanedText);
        } catch (e) {
            console.error("Failed to parse JSON:", rawText);
            throw new Error("Failed to parse AI response. It might not be valid JSON.");
        }
    };

    const recommendBtn = document.getElementById('recommend-btn');
    const loadMoreBtn = document.getElementById('load-more-btn');
    const loadMoreContainer = document.getElementById('load-more-container');
    const cardsGrid = document.querySelector('.cards-grid');
    const matchInfo = document.querySelector('.match-info');

    const renderCards = (recommendations, append = false) => {
        if (!cardsGrid) return;
        
        if (!append) {
            cardsGrid.innerHTML = ''; // Clear existing on first load
        }
        
        recommendations.forEach(rec => {
            const cardHTML = `
                <div class="card">
                    <div style="height: 120px; display: flex; align-items: center; justify-content: center; background: #ffffff; border-bottom: 1px solid #f0f0f0;">
                         <img src="https://s2.googleusercontent.com/s2/favicons?domain=${rec.domain || 'google.com'}&sz=128" alt="Logo" style="max-height: 60px; max-width: 80%; object-fit: contain;">
                    </div>
                    <div class="card-content">
                        <span class="tag ${rec.tagClass || 'tag-high'}">${rec.match || '90% Match'}</span>
                        <h3>${rec.title}</h3>
                        <p>${rec.desc}</p>
                        <div class="card-footer">
                            <span class="time">${rec.time || '⏱️ Self-paced'}</span>
                            <a href="${rec.url && rec.url.startsWith('http') ? rec.url : `https://www.google.com/search?q=${encodeURIComponent(rec.title + ' ' + currentTopic + ' free course')}`}" target="_blank" rel="noopener noreferrer" class="btn-secondary" style="text-decoration:none; display:inline-block; text-align:center;">Start Learning</a>
                        </div>
                    </div>
                </div>
            `;
            cardsGrid.insertAdjacentHTML('beforeend', cardHTML);
        });
        
        if (loadMoreContainer) {
            loadMoreContainer.style.display = 'block';
        }
    };

    if (recommendBtn) {
        recommendBtn.addEventListener('click', async () => {
            const topicInput = document.getElementById('topic-input');
            const eduInput = document.getElementById('edu-level-input');
            
            const topic = topicInput ? topicInput.value.trim() : '';
            const eduLevel = eduInput ? eduInput.options[eduInput.selectedIndex].text : 'Undergraduate';
            
            if (topic !== '') {
                // Initialize state
                currentTopic = topic;
                currentEduLevel = eduLevel;
                currentPage = 1;

                const originalText = recommendBtn.textContent;
                recommendBtn.textContent = 'Generating...';
                recommendBtn.disabled = true;
                if (loadMoreContainer) loadMoreContainer.style.display = 'none';

                try {
                    const recommendations = await fetchAIRecommendations(currentTopic, currentEduLevel, currentPage);
                    renderCards(recommendations, false);

                    if (matchInfo) {
                        matchInfo.textContent = `Targeted for: "${currentTopic}" at ${currentEduLevel} Level`;
                    }
                } catch (error) {
                    console.error('Error fetching recommendations:', error);
                    alert(error.message || 'Failed to get recommendations. Please try again.');
                } finally {
                    recommendBtn.textContent = originalText;
                    recommendBtn.disabled = false;
                }

            } else {
                alert('Please enter a topic to get recommendations.');
            }
        });
    }

    if (recommendBtn && window.location.search.includes('onboarded=true')) {
        let activeSession = JSON.parse(localStorage.getItem('studyBuddyActiveSession'));
        if (activeSession && activeSession.primaryInterest) {
            const topicInputAuto = document.getElementById('topic-input');
            const eduInputAuto = document.getElementById('edu-level-input');
            if (topicInputAuto) topicInputAuto.value = activeSession.primaryInterest;
            if (eduInputAuto) {
                for (let i = 0; i < eduInputAuto.options.length; i++) {
                    if (eduInputAuto.options[i].value === activeSession.eduLevel) {
                        eduInputAuto.selectedIndex = i;
                        break;
                    }
                }
            }
            
            // Auto click after slight delay for visual smoothness
            setTimeout(() => {
                recommendBtn.click();
                // Clean the URL without refreshing
                window.history.replaceState({}, document.title, window.location.pathname);
            }, 400);
        }
    }

    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', async () => {
            if (!currentTopic) return;
            
            currentPage++;
            const originalText = loadMoreBtn.textContent;
            loadMoreBtn.textContent = 'Loading more...';
            loadMoreBtn.disabled = true;
            
            try {
                const recommendations = await fetchAIRecommendations(currentTopic, currentEduLevel, currentPage);
                renderCards(recommendations, true); // true = append
            } catch (error) {
                console.error('Error fetching more recommendations:', error);
                alert(error.message || 'Failed to load more. Please try again.');
                currentPage--; // Revert counter if it failed
            } finally {
                loadMoreBtn.textContent = originalText;
                loadMoreBtn.disabled = false;
            }
        });
    }

    // --- Form Handling for Edit Profile ---
    const editProfileForm = document.getElementById('edit-profile-form');
    if (editProfileForm) {
        // We are on edit-profile.html

        // Load existing data into form if it exists
        const savedProfile = JSON.parse(localStorage.getItem('studyBuddyProfile'));
        if (savedProfile) {
            document.getElementById('fullName').value = savedProfile.fullName || '';
            document.getElementById('bio').value = savedProfile.bio || '';
            document.getElementById('learningPath').value = savedProfile.learningPath || 'data-science';
            document.getElementById('dailyGoal').value = savedProfile.dailyGoal || '2';

            // Handle checkboxes
            const checkboxes = document.querySelectorAll('.skill-checkbox');
            checkboxes.forEach(cb => {
                if (savedProfile.skills && savedProfile.skills.includes(cb.value)) {
                    cb.checked = true;
                } else if (savedProfile.skills) {
                    cb.checked = false;
                }
            });
        }

        editProfileForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Stop default GET submission

            const fullName = document.getElementById('fullName').value;
            const bio = document.getElementById('bio').value;
            const learningPath = document.getElementById('learningPath').value;
            const dailyGoal = document.getElementById('dailyGoal').value;

            const skills = [];
            document.querySelectorAll('.skill-checkbox:checked').forEach(cb => {
                skills.push(cb.value);
            });

            const profileData = {
                fullName,
                bio,
                learningPath,
                dailyGoal,
                skills
            };

            localStorage.setItem('studyBuddyProfile', JSON.stringify(profileData));

            // Redirect back to profile page
            window.location.href = 'profile.html';
        });
    }

    // --- Profile Display for Profile Page ---
    const profileName = document.getElementById('profile-name');
    if (profileName) {
        // We are on profile.html
        const savedProfile = JSON.parse(localStorage.getItem('studyBuddyProfile')) || {};
        const activeSession = JSON.parse(localStorage.getItem('studyBuddyActiveSession'));
        
        profileName.textContent = (activeSession && activeSession.fullname) ? activeSession.fullname : (savedProfile.fullName || 'Aakar');

        const profileBio = document.getElementById('profile-bio');
            if (profileBio) {
                // Map learning path values to nice text
                const pathMap = {
                    'data-science': 'Data Science',
                    'web-dev': 'Web Development',
                    'machine-learning': 'Machine Learning',
                    'mathematics': 'Mathematics'
                };
                const displayPath = pathMap[savedProfile.learningPath] || 'Data Science';
                profileBio.textContent = `${savedProfile.bio || 'AI Engineering Student'} • Learning Path: ${displayPath}`;
            }

            const profileGoal = document.getElementById('profile-goal-display');
            if (profileGoal) {
                profileGoal.textContent = `${savedProfile.dailyGoal || 2} Hours / Day`;
            }

            const profileSkills = document.getElementById('profile-skills');
            if (profileSkills && savedProfile.skills && savedProfile.skills.length > 0) {
                profileSkills.innerHTML = ''; // Clear default tags
                savedProfile.skills.forEach(skill => {
                    const span = document.createElement('span');
                    span.className = 'tag tag-high'; // Using the default CSS class for tags
                    span.textContent = skill;
                    profileSkills.appendChild(span);
                });
            }
    }

    // --- Login & Registration Logic ---
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        let isSignupMode = false;
        
        // Use event delegation for toggle buttons because innerHTML destroys listeners
        loginForm.addEventListener('click', (e) => {
            if (e.target && (e.target.id === 'toggle-auth' || e.target.id === 'toggle-auth-back')) {
                e.preventDefault();
                isSignupMode = !isSignupMode;
                
                const nameGroup = document.getElementById('name-group');
                const authSubmitBtn = document.getElementById('auth-submit-btn');
                const loginOptions = document.getElementById('login-options');
                const togglePrompt = document.getElementById('toggle-prompt');
                const authError = document.getElementById('auth-error');
                
                if (authError) authError.style.display = 'none';

                if (isSignupMode) {
                    nameGroup.style.display = 'block';
                    document.getElementById('fullname').required = true;
                    loginOptions.style.display = 'none';
                    authSubmitBtn.innerHTML = 'Create Account &rarr;';
                    togglePrompt.innerHTML = `Already have an account? <a href="#" id="toggle-auth-back">Sign in</a>`;
                } else {
                    nameGroup.style.display = 'none';
                    document.getElementById('fullname').required = false;
                    loginOptions.style.display = 'flex';
                    authSubmitBtn.innerHTML = 'Sign In &rarr;';
                    togglePrompt.innerHTML = `Don't have an account? <a href="#" id="toggle-auth">Sign up</a>`;
                }
            }
        });

        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const authError = document.getElementById('auth-error');
            if(authError) authError.style.display = 'none';
            
            const email = document.getElementById('email').value.trim().toLowerCase();
            const password = document.getElementById('password').value.trim();
            const fullnameInput = document.getElementById('fullname');
            const fullname = fullnameInput ? fullnameInput.value.trim() : '';

            let usersDB = JSON.parse(localStorage.getItem('studyBuddyUsersDB')) || [];
            
            console.log("Current DB:", usersDB); // For debugging
            console.log("Attempting with:", email, password);

            if (isSignupMode) {
                if (usersDB.find(u => u.email === email)) {
                    authError.textContent = 'An account with this email already exists.';
                    authError.style.display = 'block';
                    return;
                }
                const newUser = { email, password, fullname };
                usersDB.push(newUser);
                localStorage.setItem('studyBuddyUsersDB', JSON.stringify(usersDB));
                
                localStorage.setItem('studyBuddyActiveSession', JSON.stringify(newUser));
                window.location.href = 'onboarding.html';
            } else {
                const user = usersDB.find(u => u.email === email && u.password === password);
                if (user) {
                    localStorage.setItem('studyBuddyActiveSession', JSON.stringify(user));
                    window.location.href = 'index.html';
                } else {
                    console.warn("Login failed. No match found in DB for email/pass combo.");
                    authError.textContent = 'Invalid email or password.';
                    authError.style.display = 'block';
                }
            }
        });
    }

    // --- Logout Handling ---
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('studyBuddyActiveSession');
            window.location.href = 'login.html';
        });
    }

    // --- Onboarding Logic ---
    const onboardingForm = document.getElementById('onboarding-form');
    if (onboardingForm) {
        onboardingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const interest = document.getElementById('primary-interest').value.trim();
            const eduLevel = document.getElementById('onboarding-edu-level').value;
            
            let activeSession = JSON.parse(localStorage.getItem('studyBuddyActiveSession')) || {};
            activeSession.primaryInterest = interest;
            activeSession.eduLevel = eduLevel;
            localStorage.setItem('studyBuddyActiveSession', JSON.stringify(activeSession));
            
            window.location.href = 'index.html?onboarded=true';
        });
    }
});
