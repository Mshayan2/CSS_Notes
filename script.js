document.addEventListener('DOMContentLoaded', () => {
    // Select elements
    const slides = document.querySelectorAll('.slide');
    const sidebarNav = document.getElementById('sidebar-nav');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const progressBar = document.getElementById('progress-bar');
    const slideIndicator = document.getElementById('slide-indicator');
    const toggleSidebarBtn = document.getElementById('toggle-sidebar');
    const sidebar = document.getElementById('sidebar');

    let currentSlideIndex = 0;
    const totalSlides = slides.length;

    // 1. DYNAMIC SIDEBAR MENU
    function buildSidebar() {
        sidebarNav.innerHTML = '';
        slides.forEach((slide, idx) => {
            const slideTitleEl = slide.querySelector('.slide-title');
            const titleText = slideTitleEl ? slideTitleEl.textContent : `Slide ${idx + 1}`;
            
            const sidebarItem = document.createElement('div');
            sidebarItem.classList.add('sidebar-item');
            if (idx === currentSlideIndex) {
                sidebarItem.classList.add('active');
            }
            
            sidebarItem.innerHTML = `
                <span class="sidebar-item-num">${String(idx + 1).padStart(2, '0')}</span>
                <span class="sidebar-item-text">${titleText}</span>
            `;
            
            sidebarItem.addEventListener('click', () => {
                goToSlide(idx);
            });
            
            sidebarNav.appendChild(sidebarItem);
        });
    }

    // 2. SLIDE NAVIGATION CONTROLS
    function updateNavigationState() {
        // Show/hide slides
        slides.forEach((slide, idx) => {
            slide.classList.remove('active', 'prev', 'next');
            if (idx === currentSlideIndex) {
                slide.classList.add('active');
            } else if (idx < currentSlideIndex) {
                slide.classList.add('prev');
            } else {
                slide.classList.add('next');
            }
        });

        // Update progress tracking
        const percentage = ((currentSlideIndex + 1) / totalSlides) * 100;
        progressBar.style.width = `${percentage}%`;
        slideIndicator.textContent = `Slide ${currentSlideIndex + 1} / ${totalSlides}`;

        // Update active sidebar nav item
        const sidebarItems = sidebarNav.querySelectorAll('.sidebar-item');
        sidebarItems.forEach((item, idx) => {
            if (idx === currentSlideIndex) {
                item.classList.add('active');
                item.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
            } else {
                item.classList.remove('active');
            }
        });
    }

    function goToSlide(index) {
        if (index >= 0 && index < totalSlides) {
            currentSlideIndex = index;
            updateNavigationState();
            
            // Auto collapse sidebar on mobile screens
            if (window.innerWidth <= 768) {
                sidebar.classList.add('collapsed');
            }
        }
    }

    function nextSlide() {
        if (currentSlideIndex < totalSlides - 1) {
            goToSlide(currentSlideIndex + 1);
        }
    }

    function prevSlide() {
        if (currentSlideIndex > 0) {
            goToSlide(currentSlideIndex - 1);
        }
    }

    // Bind footer controls
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    // Toggle Sidebar
    toggleSidebarBtn.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
    });

    // Close Sidebar (Inside Sidebar Header on Mobile)
    const closeSidebarBtn = document.getElementById('close-sidebar');
    if (closeSidebarBtn) {
        closeSidebarBtn.addEventListener('click', () => {
            sidebar.classList.add('collapsed');
        });
    }

    // Close sidebar on mobile when clicking anywhere in the main container
    const presentationContainer = document.querySelector('.presentation-container');
    if (presentationContainer) {
        presentationContainer.addEventListener('click', (e) => {
            if (window.innerWidth <= 768 && !sidebar.classList.contains('collapsed')) {
                if (!e.target.closest('#toggle-sidebar') && !e.target.closest('#sidebar')) {
                    sidebar.classList.add('collapsed');
                }
            }
        });
    }

    // 3. KEYBOARD LISTENERS
    document.addEventListener('keydown', (e) => {
        // Avoid skipping slides when user is typing in interactive form elements
        const activeTagName = document.activeElement.tagName.toLowerCase();
        if (activeTagName === 'input' || activeTagName === 'select' || activeTagName === 'textarea') {
            return;
        }

        switch (e.key) {
            case 'ArrowRight':
            case ' ': // Space key
            case 'Enter':
                e.preventDefault();
                nextSlide();
                break;
            case 'ArrowLeft':
            case 'Backspace':
                e.preventDefault();
                prevSlide();
                break;
            case 'Tab':
                e.preventDefault();
                sidebar.classList.toggle('collapsed');
                break;
        }
    });

    // Initialize sidebar list and presentation states
    buildSidebar();
    updateNavigationState();
    
    // Auto collapse sidebar on initial mobile load
    if (window.innerWidth <= 768) {
        sidebar.classList.add('collapsed');
    }
    
    // Initial calls to populate simulator widgets
    updateBoxModel();
    updateFlexboxPlayground();
});

// 4. CLIPBOARD COPY HELPER
window.copyCode = function(button) {
    const codeBlock = button.nextElementSibling.querySelector('code');
    if (!codeBlock) return;

    // Use absolute clean text content
    const textToCopy = codeBlock.textContent;

    navigator.clipboard.writeText(textToCopy).then(() => {
        const originalText = button.textContent;
        button.textContent = "Copied!";
        button.classList.add('copied');

        setTimeout(() => {
            button.textContent = originalText;
            button.classList.remove('copied');
        }, 1500);
    }).catch(err => {
        console.error("Failed to copy text: ", err);
    });
};

// ===============================================
// INTERACTIVE WIDGET FUNCTIONS
// ===============================================

// Widget A: Timeline Card Selector
const timelineDatabase = {
    1996: {
        title: "CSS 1.0 (1996)",
        text: "The initial official W3C recommendation. It supported basic visual properties like text colors, background styles, alignments, font sizing/styling, and margins."
    },
    1998: {
        title: "CSS 2.0 (1998)",
        text: "Added positioning styles (absolute, relative, fixed) allowing custom grid creation. Introduced z-index layout ordering, print styles, media types, and CSS selectors priority rules."
    },
    2005: {
        title: "CSS 3.0 (2005 - Present)",
        text: "Split into modular specifications to evolve independently. Added properties like border-radius, shadows, gradients, transitions, animations, and multi-column text."
    },
    2020: {
        title: "Modern CSS (2020+)",
        text: "Brings powerful tools like Flexbox and CSS Grid layout engines, CSS Variables (--custom-prop), prefers-color-scheme media queries, aspect-ratio, container queries, and native nestings."
    }
};

window.selectTimeline = function(year, btnElement) {
    // Remove active state from all nodes
    const nodes = document.querySelectorAll('.timeline-node');
    nodes.forEach(node => node.classList.remove('active'));
    
    // Highlight selected node
    btnElement.classList.add('active');

    // Update panel
    const info = timelineDatabase[year];
    const detailPanel = document.getElementById('timeline-detail');
    if (info && detailPanel) {
        detailPanel.innerHTML = `
            <h4>${info.title}</h4>
            <p>${info.text}</p>
        `;
    }
};

// Widget B: Toggleable Tab Viewers
window.switchTab = function(tabId, btnElement) {
    const parentContainer = btnElement.closest('.widget-container');
    
    // Remove active from all tabs inside this parent
    const tabs = parentContainer.querySelectorAll('.tab-btn');
    tabs.forEach(tab => tab.classList.remove('active'));
    
    // Remove active from all tab contents inside this parent
    const contents = parentContainer.querySelectorAll('.tab-content');
    contents.forEach(content => content.classList.remove('active'));

    // Activate selected
    btnElement.classList.add('active');
    const targetContent = document.getElementById(tabId);
    if (targetContent) {
        targetContent.classList.add('active');
    }
};

// Widget C: Interactive File & Folder Explorer
const fileExplorerDatabase = {
    'project-root': {
        title: "📁 project-root/",
        desc: "The main folder containing all your web app files. Keeps the project bundle organized together."
    },
    'index-html': {
        title: "📄 index.html",
        desc: "The core entry file of the page. Contains standard semantic tags (header, section, footer) and references the CSS link script."
    },
    'css-folder': {
        title: "📁 css/",
        desc: "A subfolder specifically designated for stylesheets, separating design files from document logic."
    },
    'main-css': {
        title: "📄 main.css",
        desc: "The central stylesheet holding the rules for layouts, background grids, colors, and responsive design breakpoints."
    },
    'assets-folder': {
        title: "📁 assets/",
        desc: "Houses media files like raster images, logos, vector icons, custom fonts, or illustrative SVGs."
    },
    'logo-svg': {
        title: "📄 logo.svg",
        desc: "A vector asset logo. Because it is vector, it loads quickly and remains crisp at any screen zoom scale."
    }
};

window.selectFileExplorer = function(key, element) {
    const items = document.querySelectorAll('.file-item');
    items.forEach(item => item.classList.remove('active'));

    element.classList.add('active');

    const info = fileExplorerDatabase[key];
    const detailPanel = document.getElementById('explorer-detail');
    if (info && detailPanel) {
        detailPanel.innerHTML = `
            <h4>${info.title}</h4>
            <p>${info.desc}</p>
        `;
    }
};

// Widget D: Box Model Simulator
window.updateBoxModel = function() {
    const widthVal = document.getElementById('input-width').value;
    const paddingVal = document.getElementById('input-padding').value;
    const borderVal = document.getElementById('input-border').value;
    const marginVal = document.getElementById('input-margin').value;
    const boxSizing = document.getElementById('input-boxsizing').value;

    // Update labels
    document.getElementById('val-width').textContent = `${widthVal}px`;
    document.getElementById('val-padding').textContent = `${paddingVal}px`;
    document.getElementById('val-border').textContent = `${borderVal}px`;
    document.getElementById('val-margin').textContent = `${marginVal}px`;

    // Apply sizes directly to visual representation boxes
    const contentBox = document.getElementById('visual-content-box');
    const paddingBox = document.getElementById('visual-padding-box');
    const borderBox = document.getElementById('visual-border-box');
    const marginBox = document.getElementById('visual-margin-box');

    // Dynamic width & height adjustments
    borderBox.style.borderWidth = `${borderVal}px`;
    borderBox.style.padding = `${paddingVal}px`;
    marginBox.style.padding = `${marginVal}px`;

    // Calculate final printed box report
    let calculatedWidth = 0;
    let formulaString = "";

    if (boxSizing === 'content-box') {
        // Rendered Width = width + padding*2 + border*2
        calculatedWidth = parseInt(widthVal) + (parseInt(paddingVal) * 2) + (parseInt(borderVal) * 2);
        formulaString = `Content Width (${widthVal}px) + Padding (${paddingVal}px × 2) + Border (${borderVal}px × 2) = ${calculatedWidth}px`;
        contentBox.style.width = `${widthVal}px`;
        contentBox.style.height = '60px'; // fixed inner box height
    } else {
        // border-box: total element width is set width
        calculatedWidth = parseInt(widthVal);
        const innerContentVal = calculatedWidth - (parseInt(paddingVal) * 2) - (parseInt(borderVal) * 2);
        
        if (innerContentVal >= 0) {
            formulaString = `Total Set Width = ${calculatedWidth}px (Content shrinks to: ${innerContentVal}px to accommodate padding & border)`;
        } else {
            formulaString = `Total Set Width = ${calculatedWidth}px (Warning: padding/border exceeded set width!)`;
        }
        
        // Scale representation
        contentBox.style.width = `${Math.max(0, innerContentVal)}px`;
        contentBox.style.height = '60px';
    }

    document.getElementById('box-calculated-width').textContent = `${calculatedWidth}px`;
    document.getElementById('box-formula-desc').textContent = formulaString;
};

// Widget D & E: Flexbox Playground
window.updateFlexboxPlayground = function() {
    const direction = document.getElementById('flex-direction').value;
    const justify = document.getElementById('flex-justify').value;
    const align = document.getElementById('flex-align').value;
    const gap = document.getElementById('flex-gap').value;

    const sandbox = document.getElementById('flex-sandbox');
    if (!sandbox) return;

    // Apply styles live
    sandbox.style.flexDirection = direction;
    sandbox.style.justifyContent = justify;
    sandbox.style.alignItems = align;
    sandbox.style.gap = gap;

    // Update Console Code display
    const consoleOutput = document.getElementById('console-output');
    if (consoleOutput) {
        consoleOutput.textContent = `/* Interactive Flexbox Styles */
.container {
  display: flex;
  flex-direction: ${direction};
  justify-content: ${justify};
  align-items: ${align};
  gap: ${gap};
}`;
    }
};
