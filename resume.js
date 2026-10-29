/* Varaprasad Sukala: résumé data, live durations and the PDF generator.
   Shared by index.html and card.html, so there is one place to edit.

   Dates are "YYYY-MM"; leave "end" as null for a current role. Durations are
   calculated from today's date every time the page loads or the PDF is built. */

(function () {
    'use strict';

    const resume = {
        "name": "Varaprasad Sukala",
        "headline": "Forward Deployed AI Engineer · MSc Data Science",
        "location": "Coventry, England, United Kingdom",
        "email": "sukalavaraprasad@gmail.com",
        "links": [
            { "label": "linkedin.com/in/varaprasadsukalathedatascientist", "url": "https://www.linkedin.com/in/varaprasadsukalathedatascientist" },
            { "label": "github.com/varaprasad1016", "url": "https://github.com/varaprasad1016" }
        ],
        "summary": [
            "As a Forward Deployed AI Engineer at Beckett's Foods, my role primarily revolves around managing the core backend system with a strong focus on SQL. I ensure the efficiency, integrity, and optimization of backend databases, supporting business operations and decision-making. My responsibilities include analysing system requirements, troubleshooting database issues, improving workflows, and implementing data-driven solutions. Additionally, I take on various roles as required, adapting to evolving business needs, whether it's enhancing system functionality, integrating new technologies, or supporting cross-functional teams. My expertise in SQL and backend management plays a crucial role in maintaining and enhancing the company's operational efficiency.",
            "At Neatcom, my data analysis initiatives are propelled by the fresh perspective, SQL and Python expertise I cultivated at Coventry University. My role pivots around extracting actionable insights, which significantly enhances our fleet management solutions. The analytical prowess honed through my recent academic journey and prior development experience at Codegnan is instrumental in enriching our educational curriculum. Certifications from Microsoft and IBM affirm my commitment to maintaining precision in our data-driven strategies."
        ],
        "experience": [
            { "id": "becketts", "title": "Forward Deployed AI Engineer", "org": "Beckett's Foods Ltd", "location": "Coventry, England, United Kingdom", "start": "2024-11", "end": null, "points": [] },
            { "id": "neatcom", "title": "Data Analyst", "org": "Neatcom", "location": "United Kingdom", "start": "2023-03", "end": "2024-11", "points": [] },
            { "id": "codegnan-developer", "title": "Python Developer", "org": "Codegnan", "location": "Vijayawada, Andhra Pradesh, India", "start": "2022-01", "end": "2023-01", "points": [] },
            { "id": "codegnan-intern", "title": "Data Science Intern", "org": "Codegnan", "location": "Vijayawada, Andhra Pradesh, India", "start": "2020-12", "end": "2021-05", "points": [] }
        ],
        "education": [
            { "degree": "Master's degree, Data Science", "school": "Coventry University", "period": "2023 – 2024" },
            { "degree": "Bachelor's degree, Data Science", "school": "Parvathaneni Brahmayya Siddhartha College of Arts & Science", "period": "2018 – 2022" }
        ],
        "projects": [
            { "name": "The Ashvale Files: SQL Mystery", "url": "https://github.com/varaprasad1016/SQL-Mystery-by-Vara", "description": "Detective game teaching SQL over 42 chapters; runs real SQLite in WebAssembly and grades by result set." },
            { "name": "Warehouse Management System", "url": "https://github.com/varaprasad1016/SriyaWMS", "description": "Flask and SQLite warehouse system: role-based dashboards, barcode scanning, stock workflows, pandas trends." },
            { "name": "Network Intrusion Detection", "url": "https://github.com/varaprasad1016/IntrusionDetectionSystem", "description": "Classifies NSL-KDD network traffic as normal or anomalous with chi-square tests, PCA and ensemble models." },
            { "name": "Self-Hosted Restaurant ERP", "url": "https://github.com/varaprasad1016/restaurant-ERP", "description": "One-command ERPNext, Frappe HR and URY POS deployment with SumUp payments, kiosk tills and backups." }
        ],
        "skills": ["Transact-SQL (T-SQL)", "Microsoft SQL Server", "IT Business Analysis", "Python", "Machine Learning", "Statistical Analysis", "Data Analytics", "Artificial Intelligence"],
        "certifications": [
            "What is Data Science?",
            "Data Analysis with Python",
            "Data Visualization with Python",
            "Microsoft Technology Associate: Python Programming",
            "IBM Data Science Specialization"
        ]
    };


    const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // "YYYY-MM" to { y, m }, or null when the value is not a real month.
    const parseMonth = ym => {
        const match = /^(\d{4})-(0?[1-9]|1[0-2])$/.exec(String(ym));
        return match ? { y: Number(match[1]), m: Number(match[2]) } : null;
    };

    const thisMonth = () => {
        const d = new Date();
        return { y: d.getFullYear(), m: d.getMonth() + 1 };
    };

    const warned = new Set();

    // Start and end months of a role, or null (with one console warning) when its dates are unusable.
    const roleSpan = role => {
        const s = parseMonth(role.start);
        const e = role.end == null ? thisMonth() : parseMonth(role.end);
        if (s && e && e.y * 12 + e.m >= s.y * 12 + s.m) return { s, e };
        const key = role.id || role.title;
        if (!warned.has(key)) {
            warned.add(key);
            console.warn(`Résumé: skipping dates for "${key}"; use "YYYY-MM" and an end on or after the start.`);
        }
        return null;
    };

    // Counts both the first and last month, as LinkedIn does: Mar 2023 – Nov 2024 is 1 year 9 months.
    const monthsInRole = role => {
        const span = roleSpan(role);
        return span ? (span.e.y - span.s.y) * 12 + (span.e.m - span.s.m) + 1 : null;
    };

    const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;

    const formatDuration = (months, long) => {
        const y = Math.floor(months / 12), m = months % 12;
        return [y && plural(y, long ? 'year' : 'yr'), m && plural(m, long ? 'month' : 'mo')].filter(Boolean).join(' ');
    };

    const formatMonth = ({ y, m }) => `${MONTHS[m - 1]} ${y}`;

    const formatRange = (role, dash) => {
        const span = roleSpan(role);
        return span ? `${formatMonth(span.s)} ${dash} ${role.end == null ? 'Present' : formatMonth(span.e)}` : '';
    };

    document.querySelectorAll('.row[data-role]').forEach(row => {
        const role = resume.experience.find(r => r.id === row.dataset.role);
        const months = role && monthsInRole(role);
        if (!months) return; // keep the static text in the markup
        const period = row.querySelector('.row-period');
        period.textContent = formatRange(role, '—');
        if (role.end == null) {
            const tag = document.createElement('span');
            tag.className = 'tag';
            tag.textContent = 'Now';
            period.append(' ', tag);
        }
        const duration = document.createElement('span');
        duration.className = 'row-duration';
        duration.textContent = formatDuration(months);
        period.append(duration);
    });

    const JSPDF_SRC = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/4.2.1/jspdf.umd.min.js';
    const JSPDF_SRI = 'sha512-plOdviVmws4Y3JAvbnpfKb2hVxKM1lCwsi3vmElYRj+tiDLffZ4FVUj5a8vyKJ9pIgl8JCAHEJ4D1iUKBecswg==';
    let jspdfLoading = null;

    const loadJsPDF = () => jspdfLoading || (jspdfLoading = new Promise((resolve, reject) => {
        if (window.jspdf) return resolve(window.jspdf.jsPDF);
        const script = document.createElement('script');
        script.src = JSPDF_SRC;
        script.integrity = JSPDF_SRI;
        script.crossOrigin = 'anonymous';
        script.referrerPolicy = 'no-referrer';
        script.onload = () => window.jspdf ? resolve(window.jspdf.jsPDF) : reject(new Error('jsPDF did not initialise'));
        script.onerror = () => { jspdfLoading = null; script.remove(); reject(new Error('jsPDF failed to load')); };
        document.head.append(script);
    }));

    const buildResume = jsPDF => {
        const doc = new jsPDF({ unit: 'mm', format: 'a4' });
        const W = 210, H = 297, MX = 18, MY = 15, CW = W - MX * 2, GAP = 2.6;
        const INK = [17, 17, 17], MUTED = [92, 92, 92], LINE = [210, 210, 210], ACCENT = [96, 122, 28];
        const lh = pt => pt * 0.3528 * 1.3;
        let y = MY;

        // Applicant tracking systems read the text layer, so keep it plain ASCII; dots and bullets are drawn instead.
        const plain = str => String(str).replace(/[–—]/g, '-').replace(/[‘’]/g, "'").replace(/[“”]/g, '"');

        const style = (weight, size, color) => { doc.setFont('helvetica', weight); doc.setFontSize(size); doc.setTextColor(...color); };

        // jsPDF draws the standard fonts without kerning, so measure without it too.
        const tw = str => doc.getStringUnitWidth(str, { kerning: {} }) * doc.getFontSize() / doc.internal.scaleFactor;

        // Word wrap with the same metrics the text is drawn with (set the font first).
        const wrap = (str, maxW) => {
            const lines = [];
            let line = '';
            plain(str).split(/\s+/).filter(Boolean).forEach(word => {
                const next = line ? `${line} ${word}` : word;
                if (line && tw(next) > maxW) { lines.push(line); line = word; }
                else line = next;
            });
            if (line) lines.push(line);
            return lines;
        };

        const ensure = h => { if (y + h > H - MY) { doc.addPage(); y = MY; } };
        const dot = (cx, size, r = 0.38) => { doc.setFillColor(...MUTED); doc.circle(cx, y - size * 0.3528 * 0.33, r, 'F'); };

        const write = (item, x) => {
            const label = plain(item.label);
            if (item.url) doc.textWithLink(label, x, y, { url: item.url });
            else doc.text(label, x, y);
            return tw(label);
        };

        // Lays out items separated by drawn dots, wrapping to the content width.
        const flow = (items, size, color, weight = 'normal') => {
            style(weight, size, color);
            ensure(lh(size));
            y += lh(size);
            let x = MX;
            items.forEach((item, i) => {
                style(weight, size, color);
                const w = tw(plain(item.label));
                if (i && x + GAP * 2 + w > W - MX) { ensure(lh(size)); y += lh(size); x = MX; }
                else if (i) { dot(x + GAP, size); x += GAP * 2; }
                style(weight, size, color);
                x += write(item, x);
            });
        };

        const rightWidth = (items, size) => {
            style('normal', size, MUTED);
            return items.reduce((sum, t) => sum + tw(plain(t)), 0) + GAP * 2 * Math.max(0, items.length - 1);
        };

        // Right-aligned items on the current baseline, separated by drawn dots.
        const flowRight = (items, size, color) => {
            let x = W - MX - rightWidth(items, size);
            items.forEach((t, i) => {
                if (i) { dot(x + GAP, size); x += GAP * 2; }
                style('normal', size, color);
                doc.text(plain(t), x, y);
                x += tw(plain(t));
            });
        };

        const paragraph = (str, size = 9.5, color = INK) => {
            style('normal', size, color);
            wrap(str, CW).forEach(line => { ensure(lh(size)); y += lh(size); doc.text(line, MX, y); });
        };

        const bullet = str => {
            style('normal', 9.5, INK);
            wrap(str, CW - 5).forEach((line, j) => {
                ensure(lh(9.5));
                y += lh(9.5);
                if (!j) dot(MX + 1.6, 9.5, 0.55);
                style('normal', 9.5, INK);
                doc.text(line, MX + 5, y);
            });
        };

        // `need` is the height of the first block, so a heading never ends a page on its own.
        const section = (title, need) => {
            ensure(8.2 + need);
            y += 5.4;
            style('bold', 9.5, ACCENT);
            doc.text(title.toUpperCase(), MX, y, { charSpace: 0.5 });
            y += 2;
            doc.setDrawColor(...LINE);
            doc.setLineWidth(0.25);
            doc.line(MX, y, W - MX, y);
            y += 0.8;
        };

        // A bold title (wrapped if needed) with muted details right-aligned on its last line, or below it if they collide.
        const titleLayout = (title, right, size) => {
            style('bold', size, INK);
            const lines = wrap(title, CW);
            const lastW = tw(lines[lines.length - 1] || '');
            const ownLine = right.length > 0 && lastW + rightWidth(right, 9) + 6 > CW;
            return { lines, ownLine, height: lines.length * lh(size) + (ownLine ? lh(9) : 0) };
        };

        const heading = (title, right, size) => {
            const layout = titleLayout(title, right, size);
            layout.lines.forEach(line => { y += lh(size); style('bold', size, INK); doc.text(line, MX, y); });
            if (layout.ownLine) y += lh(9);
            flowRight(right, 9, MUTED);
        };

        const roleRight = role => {
            const months = monthsInRole(role);
            return months ? [formatRange(role, '-'), formatDuration(months, true)] : [];
        };
        const roleNeed = role => titleLayout(role.title, roleRight(role), 10.5).height + lh(9.5) + ((role.points || []).length ? lh(9.5) : 0);
        const eduNeed = ed => titleLayout(ed.degree, [ed.period], 10).height + lh(9.5);

        const linkLabel = url => /github\.com/i.test(url) ? 'View on GitHub' : 'View project';
        const projectLines = project => {
            style('normal', 9, ACCENT);
            const labelW = tw(linkLabel(project.url));
            style('bold', 10, INK);
            return { labelW, lines: wrap(project.name, CW - labelW - 6) };
        };
        const projectNeed = project => projectLines(project).lines.length * lh(10) + lh(9.5);

        // Header
        style('bold', 24, INK);
        y += 8;
        doc.text(plain(resume.name), MX, y);
        y += 1;
        flow(resume.headline.split(/\s+[·|]\s+/).map(label => ({ label })), 11, MUTED);

        const site = /^https?:$/.test(location.protocol) && !/^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname)
            ? { label: location.host, url: location.origin + '/' } : null;
        y += 1;
        flow([
            { label: resume.location },
            { label: resume.email, url: 'mailto:' + resume.email },
            ...(site ? [site] : []),
            ...resume.links
        ], 9, INK);
        y += 3.5;
        doc.setDrawColor(...ACCENT);
        doc.setLineWidth(0.7);
        doc.line(MX, y, W - MX, y);

        section('Summary', lh(9.5) * 2);
        resume.summary.forEach((para, i) => { if (i) y += 1.2; paragraph(para); });

        section('Experience', resume.experience.length ? roleNeed(resume.experience[0]) : 0);
        resume.experience.forEach((role, i) => {
            if (i) y += 1.8;
            ensure(roleNeed(role));
            heading(role.title, roleRight(role), 10.5);
            flow([{ label: role.org }, { label: role.location }].filter(item => item.label), 9.5, MUTED);
            (role.points || []).forEach(bullet);
        });

        section('Education', resume.education.length ? eduNeed(resume.education[0]) : 0);
        resume.education.forEach((ed, i) => {
            if (i) y += 1.8;
            ensure(eduNeed(ed));
            heading(ed.degree, [ed.period], 10);
            flow([{ label: ed.school }], 9.5, MUTED);
        });

        section('Projects', resume.projects.length ? projectNeed(resume.projects[0]) : 0);
        resume.projects.forEach((project, i) => {
            if (i) y += 1.8;
            ensure(projectNeed(project));
            const { labelW, lines } = projectLines(project);
            lines.forEach((line, j) => {
                y += lh(10);
                style('bold', 10, INK);
                doc.textWithLink(line, MX, y, { url: project.url });
                if (!j) {
                    style('normal', 9, ACCENT);
                    doc.textWithLink(linkLabel(project.url), W - MX - labelW, y, { url: project.url });
                }
            });
            paragraph(project.description);
        });

        section('Skills', lh(9.5));
        flow(resume.skills.map(label => ({ label })), 9.5, INK);

        section('Certifications', lh(9.5));
        resume.certifications.forEach(bullet);

        const pages = doc.getNumberOfPages();
        if (pages > 1) {
            for (let i = 1; i <= pages; i++) {
                doc.setPage(i);
                style('normal', 8, MUTED);
                doc.text(`${plain(resume.name)} - Page ${i} of ${pages}`, W / 2, H - 8, { align: 'center' });
            }
        }

        doc.setProperties({ title: `${plain(resume.name)} - Resume`, author: plain(resume.name), subject: plain(resume.headline.replace(/\s+·\s+/g, ', ')), creator: site ? site.url : plain(resume.name) });
        return doc;
    };

    const resumeFileName = `${resume.name.replace(/\s+/g, '-')}-Resume.pdf`;

    // A stalled CDN connection should not leave the button waiting for the browser's network timeout.
    const withTimeout = (promise, ms) => Promise.race([
        promise,
        new Promise((_, reject) => setTimeout(() => reject(new Error('timed out')), ms))
    ]);

    document.querySelectorAll('[data-resume]').forEach(link => {
        // Start fetching the generator as soon as someone shows intent, so the click itself is instant.
        ['pointerenter', 'focus', 'touchstart'].forEach(type =>
            link.addEventListener(type, () => loadJsPDF().catch(() => {}), { once: true, passive: true }));

        link.addEventListener('click', async event => {
            event.preventDefault();
            if (link.getAttribute('aria-busy') === 'true') return;
            link.setAttribute('aria-busy', 'true');
            try {
                buildResume(await withTimeout(loadJsPDF(), 8000)).save(resumeFileName);
            } catch (err) {
                // Offline, blocked or too slow: fall back to the static PDF in the repo.
                const fallback = document.createElement('a');
                fallback.href = link.getAttribute('href');
                fallback.download = '';
                document.body.append(fallback);
                fallback.click();
                fallback.remove();
            } finally {
                link.removeAttribute('aria-busy');
            }
        });
    });
    // For debugging in the console and for the test harness.
    window.PortfolioResume = { resume, monthsInRole, formatDuration, formatRange, loadJsPDF, buildResume };
})();
