document.addEventListener('DOMContentLoaded', async () => {
    await loadComponent('navbar-placeholder', 'components/navbar.html');
    await loadComponent('footer-placeholder', 'components/footer.html');

    loadProjects();

    initScrollSpy();
});

function initScrollSpy() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav ul li a');

    window.addEventListener('scroll', () => {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            
            if (scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

async function loadProjects() {
    try {
        const response = await fetch('data/projects.json');
        const projects = await response.json();
        const projectGrid = document.getElementById('project-grid');

        projects.forEach(project => {
            const tagsHtml = project.tags.map(tag => `<span class="tag">${tag}</span>`).join('');
            
            let linksHtml = '';
            if (project.github) {
                linksHtml = `
                <div class="project-links">
                    <a href="${project.github}" target="_blank" class="btn btn-outline btn-sm">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: text-bottom; margin-right: 6px;">
                            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                        </svg>
                        Source Code
                    </a>
                </div>`;
            }

            const card = document.createElement('article');
            card.className = 'project-card';
            card.innerHTML = `
                <img src="${project.image}" alt="${project.title}" class="project-img">
                <div class="project-content">
                    <div class="tags">${tagsHtml}</div>
                    <h3>${project.title}</h3>
                    <p>${project.description}</p>
                    ${linksHtml}
                </div>
            `;
            projectGrid.appendChild(card);
        });
    } catch (error) {
        console.error('Error loading projects:', error);
    }
}