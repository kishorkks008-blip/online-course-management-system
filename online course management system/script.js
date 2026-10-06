let courses = JSON.parse(localStorage.getItem("courses")) || [
    {
        id: 1,
        title: "Web Development",
        instructor: "John Smith",
        category: "Programming",
        duration: 20,
        description: "Learn HTML, CSS and JavaScript from the basics.",
        enrolled: false,
        progress: 0
    },

    {
        id: 2,
        title: "Python Programming",
        instructor: "Sarah Johnson",
        category: "Programming",
        duration: 25,
        description: "Learn Python programming and build real applications.",
        enrolled: false,
        progress: 0
    },

    {
        id: 3,
        title: "Database Management",
        instructor: "David Wilson",
        category: "Database",
        duration: 18,
        description: "Learn SQL, databases and database design.",
        enrolled: false,
        progress: 0
    },

    {
        id: 4,
        title: "Data Science",
        instructor: "Emily Brown",
        category: "Data Science",
        duration: 30,
        description: "Learn data analysis, visualization and machine learning.",
        enrolled: false,
        progress: 0
    }
];


function saveCourses() {

    localStorage.setItem(
        "courses",
        JSON.stringify(courses)
    );

}


/* Display courses */

function displayCourses(courseArray = courses) {

    const courseList =
        document.getElementById("courseList");

    courseList.innerHTML = "";

    if (courseArray.length === 0) {

        courseList.innerHTML =
            "<p>No courses found.</p>";

        return;
    }


    courseArray.forEach(course => {

        const card =
            document.createElement("div");

        card.className = "course-card";

        card.innerHTML = `

            <span class="category">
                ${course.category}
            </span>

            <h3>
                ${course.title}
            </h3>

            <p>
                <strong>Instructor:</strong>
                ${course.instructor}
            </p>

            <p>
                <strong>Duration:</strong>
                ${course.duration} hours
            </p>

            <p>
                ${course.description}
            </p>

            <div class="course-buttons">

                <button
                    class="btn"
                    onclick="enrollCourse(${course.id})"
                >
                    ${course.enrolled ? "Enrolled" : "Enroll"}
                </button>

                <button
                    class="secondary-btn"
                    onclick="viewCourse(${course.id})"
                >
                    Details
                </button>

            </div>
        `;

        courseList.appendChild(card);

    });

}


/* Search */

function searchCourses() {

    const search =
        document
        .getElementById("searchInput")
        .value
        .toLowerCase();

    const filtered =
        courses.filter(course =>

            course.title
                .toLowerCase()
                .includes(search)

            ||

            course.category
                .toLowerCase()
                .includes(search)

            ||

            course.instructor
                .toLowerCase()
                .includes(search)

        );

    displayCourses(filtered);

}


/* Enroll */

function enrollCourse(id) {

    const course =
        courses.find(course => course.id === id);

    if (!course) {
        return;
    }

    if (course.enrolled) {

        alert(
            "You are already enrolled in this course."
        );

        return;
    }

    course.enrolled = true;

    course.progress = 0;

    saveCourses();

    displayCourses();

    updateDashboard();

    alert(
        `Successfully enrolled in ${course.title}!`
    );

}


/* View course */

function viewCourse(id) {

    const course =
        courses.find(course => course.id === id);

    if (!course) {
        return;
    }

    const modal =
        document.getElementById("courseModal");

    const content =
        document.getElementById("modalContent");

    content.innerHTML = `

        <span
            class="category"
        >
            ${course.category}
        </span>

        <h2>${course.title}</h2>

        <br>

        <p>
            <strong>Instructor:</strong>
            ${course.instructor}
        </p>

        <p>
            <strong>Duration:</strong>
            ${course.duration} hours
        </p>

        <br>

        <p>
            ${course.description}
        </p>

        <br>

        ${
            course.enrolled
            ?
            `
            <p>
                <strong>Progress:</strong>
                ${course.progress}%
            </p>

            <div class="progress-container">

                <div
                    class="progress-bar"
                    style="width:${course.progress}%"
                ></div>

            </div>

            <button
                class="btn"
                onclick="increaseProgress(${course.id})"
            >
                Complete Lesson
            </button>
            `
            :
            `
            <button
                class="btn"
                onclick="enrollCourse(${course.id}); closeModal();"
            >
                Enroll Now
            </button>
            `
        }

    `;

    modal.style.display = "flex";

}


/* Close modal */

function closeModal() {

    document.getElementById(
        "courseModal"
    ).style.display = "none";

}


/* Increase progress */

function increaseProgress(id) {

    const course =
        courses.find(course => course.id === id);

    if (!course || !course.enrolled) {
        return;
    }

    course.progress += 10;

    if (course.progress > 100) {
        course.progress = 100;
    }

    saveCourses();

    updateDashboard();

    viewCourse(id);

}


/* Dashboard */

function updateDashboard() {

    const enrolled =
        courses.filter(
            course => course.enrolled
        );

    const completed =
        enrolled.filter(
            course => course.progress === 100
        );

    let average = 0;

    if (enrolled.length > 0) {

        const total =
            enrolled.reduce(
                (sum, course) =>
                    sum + course.progress,
                0
            );

        average =
            Math.round(total / enrolled.length);
    }


    document.getElementById(
        "enrolledCount"
    ).textContent = enrolled.length;


    document.getElementById(
        "completedCount"
    ).textContent = completed.length;


    document.getElementById(
        "averageProgress"
    ).textContent = average + "%";


    const myCourses =
        document.getElementById("myCourses");

    myCourses.innerHTML = "";


    if (enrolled.length === 0) {

        myCourses.innerHTML =
            "<p>You have not enrolled in any courses yet.</p>";

        return;
    }


    enrolled.forEach(course => {

        const card =
            document.createElement("div");

        card.className = "course-card";

        card.innerHTML = `

            <h3>${course.title}</h3>

            <p>
                Instructor:
                ${course.instructor}
            </p>

            <p>
                Progress:
                ${course.progress}%
            </p>

            <div class="progress-container">

                <div
                    class="progress-bar"
                    style="width:${course.progress}%"
                ></div>

            </div>

            <button
                class="btn"
                onclick="increaseProgress(${course.id})"
            >
                Complete Lesson
            </button>

        `;

        myCourses.appendChild(card);

    });

}


/* Add course */

document
    .getElementById("courseForm")
    .addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const newCourse = {

                id: Date.now(),

                title:
                    document
                    .getElementById("courseTitle")
                    .value,

                instructor:
                    document
                    .getElementById("courseInstructor")
                    .value,

                category:
                    document
                    .getElementById("courseCategory")
                    .value,

                duration:
                    Number(
                        document
                        .getElementById("courseDuration")
                        .value
                    ),

                description:
                    document
                    .getElementById("courseDescription")
                    .value,

                enrolled: false,

                progress: 0
            };


            courses.push(newCourse);

            saveCourses();

            displayCourses();

            this.reset();

            alert(
                "Course added successfully!"
            );

        }
    );


/* Close modal when clicking outside */

window.onclick = function(event) {

    const modal =
        document.getElementById("courseModal");

    if (event.target === modal) {

        closeModal();

    }

};


/* Initial display */

displayCourses();

updateDashboard();
