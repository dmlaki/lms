// scripts.js
document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');
    const loginForm = document.getElementById('login-form');
    const logoutForm = document.getElementById('logout-form');

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(registerForm);
        const username = formData.get('username');
        const password = formData.get('password');
        const email = formData.get('email');
        const full_name = formData.get('full_name');
        try {
            const response = await fetch('/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password, email, full_name })
            });
            if (response.ok) {
                alert('Registration successful');
                window.location.href =  '/dashboard.html';
            } else {
                alert('Registration failed');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(loginForm);
        const username = formData.get('username');
        const password = formData.get('password');
        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });
            if (response.ok) {
                alert('Login successful');
                window.location.href =  '/course-content.html';
            } else {
                alert('Invalid username or password');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });

    logoutForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/logout', {
                method: 'POST'
            });
            if (response.ok) {
                alert('Logout successful');
                window.location.href ='/logout';
                
            } else {
                alert('Logout failed');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });

    // Check if the current page is the course content page
    if (window.location.pathname === '/course-content.html') {
        // Call the fetchCourseContent function
        fetchCourseContent();
    }

     // Check if the current page is the course content page
    if (window.location.pathname === '/leader-board.html') {
        // Fetch course content from server
        fetchLeaderboardData();
    }

    // Check if the current page is the course content page
    if (window.location.pathname === '/dashboard.html') {
        //fetch Logged in user's full name
        fetchFullName();
    }
});

function fetchCourseContent() {
    // Get course ID from URL parameter (assuming course ID is passed in the URL)
    const urlParams = new URLSearchParams(window.location.search);
    const courseId = urlParams.get('id');

    // Make AJAX request to fetch course content from server
    fetch(`/course/${courseId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Display course content on the page
            displayCourseContent(data);
        })
        .catch(error => {
            console.error('Error fetching course content:', error);
        });
}

//start of my code script --------------------------------------------------------------------------------------------------------

// Get all checkboxes with class 'course-checkbox'
const checkboxes = document.querySelectorAll('.course-checkbox');

// Function to handle checkbox change event
function handleCheckboxChange(event) {
    const course = event.target.value; // Get the value of the selected course
    if (event.target.checked) {
        // If checkbox is checked, add the course to user's preferences
        addUserCoursePreference(course);
    } else {
        // If checkbox is unchecked, remove the course from user's preferences
        removeUserCoursePreference(course);
    }
}

// Add event listener to each checkbox
checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', handleCheckboxChange);
});

// Function to add course to user's preferences
function addUserCoursePreference(course) {
    // Here, you would implement logic to add the course to user's preferences
    // This could involve storing the course in local storage, sending it to a server, etc.
    console.log(`Course '${course}' added to user's preferences.`);
}

// Function to remove course from user's preferences
function removeUserCoursePreference(course) {
    // Here, you would implement logic to remove the course from user's preferences
    // This could involve removing the course from local storage, updating server data, etc.
    console.log(`Course '${course}' removed from user's preferences.`);
}



// end of my code script  ------------------------------------------------------------------------------------




// Function to add course to user's selections
async function addUserCoursePreference(userId, courseId) {
    try {
        const response = await fetch('/api/user/courses/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId, courseId })
        });
        if (response.ok) {
            console.log('Course added successfully');
        } else {
            console.error('Failed to add course');
        }
    } catch (error) {
        console.error('Error adding course', error);
    }
}





// Function to fetch selected courses for a specific user
async function fetchUserCourses(userId) {
    try {
        const response = await fetch(`/api/user/${userId}/courses`);
        if (response.ok) {
            const data = await response.json();
            const courses = data.courses;
            const coursesList = document.getElementById('selected-courses-list');
            courses.forEach(course => {
                const listItem = document.createElement('li');
                listItem.textContent = course;
                coursesList.appendChild(listItem);
            });
        } else {
            console.error('Failed to fetch user courses');
        }
    } catch (error) {
        console.error('Error fetching user courses', error);
    }
}

// Replace 'user123' with actual user ID
const userId = 'user123';
fetchUserCourses(userId);








// Function to handle checkbox change event
function handleCheckboxChange(event) {
    const userId = 'user123'; // Replace with actual user ID
    const courseId = event.target.value;
    if (event.target.checked) {
        addUserCoursePreference(userId, courseId);
    } else {
        // Implement functionality to remove course
    }
}

// Add event listener to each checkbox
checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', handleCheckboxChange);
});

/// end of script -------------------------------------------------------------------------------------


function displayCourseContent(courseContent) {
    // Get the course name element
    const courseNameElement = document.getElementById('course-name');
    // Set the course name
    courseNameElement.textContent = courseContent.name;

    // Get the course content element
    const courseContentElement = document.getElementById('course-content');
    // Clear previous content
    courseContentElement.innerHTML = '';

    // Loop through the modules and display them
    courseContent.modules.forEach(module => {
        const moduleSection = document.createElement('section');
        moduleSection.innerHTML = `
            <h2>${module.title}</h2>
            <p>${module.description}</p>
            <!-- Add more elements as needed (e.g., videos, quizzes) -->
        `;
        courseContentElement.appendChild(moduleSection);
    });
}

function fetchLeaderboardData() {
    // Make AJAX request to fetch leaderboard data from server
    fetch('/leaderboard')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Display leaderboard data on the page
            displayLeaderboardData(data);
        })
        .catch(error => {
            console.error('Error fetching leaderboard data:', error);
        });
}

function displayLeaderboardData(leaderboardData) {
    // Get the leaderboard element
    const leaderboardElement = document.getElementById('leaderboard');
    // Clear previous content
    leaderboardElement.innerHTML = '';

    // Create a table to display leaderboard data
    const table = document.createElement('table');
    table.innerHTML = `
        <tr>
            <th>Rank</th>
            <th>Name</th>
            <th>Score</th>
        </tr>
    `;

    // Loop through the leaderboard data and add rows to the table
    leaderboardData.forEach((entry, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${entry.name}</td>
            <td>${entry.score}</td>
        `;
        table.appendChild(row);
    });

    // Append the table to the leaderboard element
    leaderboardElement.appendChild(table);
}

function fetchFullName() {
    // Make AJAX request to fetch the user's full name from the server
    fetch('/get-fullname')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Display the user's full name on the dashboard
            displayFullName(data.fullName);
        })
        .catch(error => {
            console.error('Error fetching user full name:', error);
        });
}

//function displayFullName(fullName) {
    // Get the element where the full name will be displayed
    //const fullNameElement = document.getElementById("user-fullname");
    // Set the inner HTML of the element to the user's full name
    //fullNameElement.textContent = fullName;
//}


document.addEventListener("DOMContentLoaded", function() {
    // Get the user's full name from the injected variable
    const fullName = '<%= fullName %>';

    const userFullNameSpan = document.getElementById("user-fullname");
    userFullNameSpan.textContent = fullName;

    const logoutBtn = document.getElementById("logout-btn");
    logoutBtn.addEventListener("click", function() {
        // Perform logout actions here
        window.location.href = "/logout";
    });
});
