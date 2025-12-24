from flask import Flask, render_template, jsonify, request, session, redirect, url_for, make_response
from datetime import datetime
import json
import os
import random
import sqlite3
from functools import wraps
from werkzeug.security import generate_password_hash, check_password_hash
import atexit

app = Flask(__name__)
app.secret_key = "sbitm-pro-secret-2024-advanced"
app.config['TEMPLATES_AUTO_RELOAD'] = True
app.config['DATABASE'] = 'sbitm_database.db'


# Initialize database on startup
def init_db():
    try:
        conn = sqlite3.connect(app.config['DATABASE'])
        cursor = conn.cursor()

        # Create tables
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS contacts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                phone TEXT,
                subject TEXT,
                message TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                status TEXT DEFAULT 'new'
            )
        ''')

        cursor.execute('''
            CREATE TABLE IF NOT EXISTS applications (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                first_name TEXT NOT NULL,
                last_name TEXT NOT NULL,
                email TEXT NOT NULL,
                phone TEXT NOT NULL,
                program TEXT NOT NULL,
                qualification TEXT,
                percentage REAL,
                message TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                status TEXT DEFAULT 'pending'
            )
        ''')

        cursor.execute('''
            CREATE TABLE IF NOT EXISTS newsletter (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT UNIQUE NOT NULL,
                subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                active INTEGER DEFAULT 1
            )
        ''')

        # Create admin users table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS admin_users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')

        # Insert default admin if not exists
        cursor.execute('SELECT COUNT(*) FROM admin_users WHERE username = ?', ('admin',))
        if cursor.fetchone()[0] == 0:
            password_hash = generate_password_hash('sbitm@2024')
            cursor.execute('INSERT INTO admin_users (username, password_hash) VALUES (?, ?)',
                           ('admin', password_hash))

        conn.commit()
        print("✅ Database initialized successfully")

    except Exception as e:
        print(f"❌ Database initialization error: {e}")
    finally:
        conn.close()


# Initialize database immediately
init_db()


# Database helper functions
def get_db():
    conn = sqlite3.connect(app.config['DATABASE'])
    conn.row_factory = sqlite3.Row
    return conn


# Load college data
def load_college_data():
    data = {
        "college": {
            "name": "Shri Balaji Institute of Technology & Management",
            "short_name": "SBITM",
            "address": "NH-69, Betul Bypass Road, Betul, Madhya Pradesh",
            "phone": "+91 78981 23456",
            "email": "info@sbitm.edu.in",
            "established": "2009",
            "affiliation": "Rajiv Gandhi Proudyogiki Vishwavidyalaya (RGPV), Bhopal",
            "approval": "AICTE Approved",
            "naac": "NAAC A+ Accredited",
            "vision": "To be a premier institution of technical and management education producing globally competent professionals.",
            "mission": "To provide quality education through innovative pedagogy and foster research, innovation, and entrepreneurship."
        },
        "hero_slides": [
            {
                "title": "Excellence in Engineering Education",
                "subtitle": "Shaping Future Innovators Since 2009",
                "image": "hero-engineering.jpg",
                "cta": {"text": "Explore Programs", "link": "/academics"},
                "color": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            },
            {
                "title": "Placements with Top Companies",
                "subtitle": "92% Placement Record | ₹22 LPA Highest Package",
                "image": "hero-placements.jpg",
                "cta": {"text": "View Placements", "link": "/placements"},
                "color": "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
            },
            {
                "title": "Modern Infrastructure & Labs",
                "subtitle": "State-of-the-art Facilities for Practical Learning",
                "image": "hero-infrastructure.jpg",
                "cta": {"text": "Campus Tour", "link": "/facilities"},
                "color": "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
            },
            {
                "title": "Industry Ready Graduates",
                "subtitle": "Comprehensive Skill Development & Industry Training",
                "image": "hero-industry.jpg",
                "cta": {"text": "View Faculty", "link": "/faculty"},
                "color": "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"
            }
        ],
        "quick_stats": [
            {"number": "15+", "label": "Years of Excellence", "icon": "fas fa-award", "color": "#667eea"},
            {"number": "2500+", "label": "Students", "icon": "fas fa-users", "color": "#f093fb"},
            {"number": "85+", "label": "Faculty", "icon": "fas fa-chalkboard-teacher", "color": "#4facfe"},
            {"number": "92%", "label": "Placement", "icon": "fas fa-briefcase", "color": "#43e97b"},
            {"number": "75+", "label": "Companies", "icon": "fas fa-building", "color": "#f093fb"},
            {"number": "50+", "label": "Labs", "icon": "fas fa-flask", "color": "#667eea"}
        ],
        "programs": {
            "btech": [
                {"code": "CSE", "name": "Computer Science & Engineering", "duration": "4 Years", "seats": 120,
                 "description": "Comprehensive program covering AI, ML, Data Science, and Software Engineering",
                 "icon": "fas fa-laptop-code", "color": "#667eea"},
                {"code": "AI&DS", "name": "Artificial Intelligence and Data Science", "duration": "4 Years", "seats": 60,
                 "description": "Comprehensive program covering AI, ML, Data Science, and Software Engineering",
                 "icon": "fas fa-laptop-code", "color": "#667eea"},
                {"code": "ME", "name": "Mechanical Engineering", "duration": "4 Years", "seats": 60,
                 "description": "Focus on design, manufacturing, thermal systems, and automation",
                 "icon": "fas fa-cogs", "color": "#f093fb"},
                {"code": "CE", "name": "Civil Engineering", "duration": "4 Years", "seats": 60,
                 "description": "Infrastructure development, structural design, and construction management",
                 "icon": "fas fa-hard-hat", "color": "#4facfe"},
                {"code": "EE", "name": "Electrical Engineering", "duration": "4 Years", "seats": 60,
                 "description": "Power systems, renewable energy, and electrical machine design",
                 "icon": "fas fa-bolt", "color": "#43e97b"},

            ],

        },
        "placements": {
            "current_year": {
                "highest": "₹22 LPA",
                "average": "₹6.2 LPA",
                "percentage": "92%",
                "offers": "180+",
                "companies": ["TCS", "Infosys", "Wipro", "Capgemini", "Accenture", "IBM", "Cognizant",
                              "Tech Mahindra", "Amazon", "Microsoft", "Deloitte", "EY", "KPMG", "PwC",
                              "HCL", "L&T", "Tata Motors", "Mahindra", "Bajaj", "Reliance"]
            },
            "previous_years": [
                {"year": "2023", "highest": "₹18 LPA", "average": "₹5.8 LPA", "percentage": "90%"},
                {"year": "2022", "highest": "₹16 LPA", "average": "₹5.5 LPA", "percentage": "88%"},
                {"year": "2021", "highest": "₹14 LPA", "average": "₹5.2 LPA", "percentage": "85%"}
            ]
        },
        "facilities": [
            {"name": "Smart Classrooms", "icon": "fas fa-chalkboard-teacher",
             "description": "Digitally equipped with interactive boards and audio-visual systems", "color": "#667eea"},
            {"name": "Advanced Laboratories", "icon": "fas fa-flask",
             "description": "25+ labs with latest equipment and technology", "color": "#f093fb"},
            {"name": "Central Library", "icon": "fas fa-book",
             "description": "50,000+ books, journals, and digital resources", "color": "#4facfe"},
            {"name": "Computer Center", "icon": "fas fa-desktop",
             "description": "500+ systems with high-speed internet and software", "color": "#43e97b"},
            {"name": "Sports Complex", "icon": "fas fa-futbol", "description": "Indoor and outdoor sports facilities",
             "color": "#667eea"},
            {"name": "Cafeteria", "icon": "fas fa-utensils", "description": "Hygienic and nutritious food services",
             "color": "#4facfe"},
            {"name": "Medical Center", "icon": "fas fa-hospital",
             "description": "24x7 medical facility with qualified staff", "color": "#43e97b"}
        ],
        "departments": [
            {"name": "Computer Science", "head": "Dr. Pankaj singh Sisodiya", "faculty": 18, "color": "#667eea"},
            {"name": "Mechanical Engineering", "head": "Dr. Rajesh Barange", "faculty": 15, "color": "#f093fb"},
            {"name": "Civil Engineering", "head": "Dr. Hemant Badode", "faculty": 12, "color": "#4facfe"},
            {"name": "Electrical Engineering", "head": "Dr. Kapil Padlak", "faculty": 10, "color": "#43e97b"},


        ],
        "gallery": {
            "categories": ["Campus", "Labs", "Events", "Sports", "Cultural"],
            "images": [
                {"category": "Campus", "title": "Main Building", "image": "campus-1.jpg"},
                {"category": "Labs", "title": "Computer Lab", "image": "lab-1.jpg"},
                {"category": "Events", "title": "Tech Fest", "image": "event-1.jpg"},
                {"category": "Sports", "title": "Annual Sports", "image": "sports-1.jpg"},
                {"category": "Cultural", "title": "Cultural Fest", "image": "cultural-1.jpg"}
            ]
        }
    }
    return data


COLLEGE_DATA = load_college_data()


@app.context_processor
def inject_data():
    return {
        "data": COLLEGE_DATA,
        "current_year": datetime.now().year,
        "current_month": datetime.now().strftime("%B"),
        "site_name": "SBITM Betul",
        "site_description": "Premier Engineering College in Central India",
        "random": random.random()
    }


# ====================
# MAIN ROUTES - FIXED
# ====================
from flask import send_from_directory

@app.route('/service-worker.js')
def service_worker():
    return send_from_directory('static', 'service-worker.js')

@app.route('/')
def home():
    return render_template('index.html')


@app.route('/about')
def about():
    return render_template('about.html')


@app.route('/academics')
def academics():
    return render_template('academics.html')


@app.route('/admissions')
def admissions():
    return render_template('admissions.html')


@app.route('/placements')
def placements():
    return render_template('placements.html')


@app.route('/faculty')
def faculty():
    # Complete faculty data for all departments
    faculty_data = {
        "cse": [
            {"name": "Dr. Pankaj Singh Sisodiya", "designation": "HOD - CSE",
             "qualification": "Ph.D. (Computer Science)",
             "experience": "15+ years", "specialization": "Artificial Intelligence", "image": "faculty-1.jpg"},
            {"name": "Prof. Rahul Sharma", "designation": "Professor", "qualification": "Ph.D. (Computer Engineering)",
             "experience": "12+ years", "specialization": "Machine Learning", "image": "faculty-2.jpg"},
            {"name": "Prof. Anjali Verma", "designation": "Associate Professor",
             "qualification": "Ph.D. (Data Science)",
             "experience": "10+ years", "specialization": "Data Mining", "image": "faculty-3.jpg"},
            {"name": "Prof. Rajesh Kumar", "designation": "Assistant Professor", "qualification": "M.Tech (CSE)",
             "experience": "8+ years", "specialization": "Cyber Security", "image": "faculty-4.jpg"},
            {"name": "Prof. Priya Patel", "designation": "Assistant Professor", "qualification": "Ph.D. (AI)",
             "experience": "6+ years", "specialization": "Deep Learning", "image": "faculty-5.jpg"}
        ],
        "mechanical": [
            {"name": "Dr. Rajesh Barange", "designation": "HOD - Mechanical",
             "qualification": "Ph.D. (Mechanical Engineering)",
             "experience": "18+ years", "specialization": "Thermal Engineering", "image": "mech-1.jpg"},
            {"name": "Prof. Sanjay Mehta", "designation": "Professor", "qualification": "Ph.D. (Manufacturing)",
             "experience": "15+ years", "specialization": "Automation", "image": "mech-2.jpg"},
            {"name": "Prof. Ajay Singh", "designation": "Associate Professor", "qualification": "Ph.D. (Design)",
             "experience": "12+ years", "specialization": "CAD/CAM", "image": "mech-3.jpg"}
        ],
        "civil": [
            {"name": "Dr. Hemant Badode", "designation": "HOD - Civil", "qualification": "Ph.D. (Civil Engineering)",
             "experience": "16+ years", "specialization": "Structural Engineering", "image": "civil-1.jpg"},
            {"name": "Prof. Rahul Gupta", "designation": "Professor", "qualification": "Ph.D. (Construction)",
             "experience": "14+ years", "specialization": "Concrete Technology", "image": "civil-2.jpg"}
        ],
        "electrical": [
            {"name": "Dr. Kapil Padlak", "designation": "HOD - Electrical",
             "qualification": "Ph.D. (Electrical Engineering)",
             "experience": "17+ years", "specialization": "Power Systems", "image": "electrical-1.jpg"},
            {"name": "Prof. Mohan Sharma", "designation": "Professor", "qualification": "Ph.D. (Electronics)",
             "experience": "13+ years", "specialization": "Renewable Energy", "image": "electrical-2.jpg"}
        ],
        "ece": [
            {"name": "Dr. Sunil Verma", "designation": "HOD - ECE", "qualification": "Ph.D. (Electronics)",
             "experience": "15+ years", "specialization": "Communication Systems", "image": "ece-1.jpg"},
            {"name": "Prof. Anil Kumar", "designation": "Professor", "qualification": "Ph.D. (VLSI)",
             "experience": "11+ years", "specialization": "VLSI Design", "image": "ece-2.jpg"}
        ],
        "management": [
            {"name": "Dr. Meera Patel", "designation": "HOD - Management",
             "qualification": "Ph.D. (Business Administration)",
             "experience": "14+ years", "specialization": "Marketing", "image": "mba-1.jpg"},
            {"name": "Prof. Ravi Shankar", "designation": "Professor", "qualification": "Ph.D. (Finance)",
             "experience": "12+ years", "specialization": "Financial Management", "image": "mba-2.jpg"}
        ]
    }

    return render_template('faculty.html', faculty_data=faculty_data)
@app.route('/facilities')
def facilities():
    return render_template('facilities.html')


@app.route('/gallery')
def gallery():
    return render_template('gallery.html')


@app.route('/contact')
def contact():
    return render_template('contact.html')


@app.route('/apply')
def apply():
    return render_template('apply.html')


@app.route('/programs')
def programs():
    return render_template('programs.html')


# FIXED: Changed from departments_route to departments
@app.route('/departments')
def departments():  # Changed name from departments_route
    return render_template('departments.html')


@app.route('/campus_tour')
def campus_tour():
    return render_template('campus_tour.html')


@app.route('/sitemap')
def sitemap():
    return render_template('sitemap.html')


@app.route('/privacy')
def privacy():
    return render_template('privacy.html')


@app.route('/terms')
def terms():
    return render_template('terms.html')


@app.route('/results')
def results():
    return render_template('results.html')


@app.route('/examination')
def examination():
    return render_template('examination.html')


# ====================
# API ENDPOINTS
# ====================

@app.route('/api/contact', methods=['POST'])
def contact_api():
    try:
        data = request.json
        name = data.get('name')
        email = data.get('email')
        phone = data.get('phone')
        subject = data.get('subject')
        message = data.get('message')

        if not name or not email:
            return jsonify({"success": False, "message": "Name and email are required"}), 400

        # Save to database
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO contacts (name, email, phone, subject, message)
            VALUES (?, ?, ?, ?, ?)
        ''', (name, email, phone, subject, message))
        conn.commit()
        conn.close()

        # Generate reference number
        reference = f"ENQ{datetime.now().strftime('%Y%m%d%H%M%S')}"

        return jsonify({
            "success": True,
            "message": "Thank you! We'll contact you soon.",
            "reference": reference
        })
    except Exception as e:
        print(f"Contact form error: {e}")
        return jsonify({"success": False, "message": "Server error. Please try again."}), 500


@app.route('/api/apply', methods=['POST'])
def apply_api():
    try:
        data = request.json
        first_name = data.get('first_name')
        last_name = data.get('last_name')
        email = data.get('email')
        phone = data.get('phone')
        program = data.get('program')
        qualification = data.get('qualification')
        percentage = data.get('percentage')
        message = data.get('message')

        # Validation
        required_fields = ['first_name', 'last_name', 'email', 'phone', 'program']
        for field in required_fields:
            if not data.get(field):
                return jsonify({"success": False, "message": f"{field.replace('_', ' ').title()} is required"}), 400

        # Save to database
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO applications (first_name, last_name, email, phone, program, qualification, percentage, message)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (first_name, last_name, email, phone, program, qualification, percentage, message))
        conn.commit()
        conn.close()

        # Generate application ID
        app_id = f"APP{datetime.now().strftime('%Y%m%d%H%M%S')}"

        return jsonify({
            "success": True,
            "message": "Application submitted successfully!",
            "application_id": app_id,
            "next_steps": "Our admissions team will contact you within 48 hours."
        })
    except Exception as e:
        print(f"Application error: {e}")
        return jsonify({"success": False, "message": "Server error. Please try again."}), 500


@app.route('/api/newsletter', methods=['POST'])
def newsletter_api():
    try:
        data = request.json
        email = data.get('email')

        if not email:
            return jsonify({"success": False, "message": "Email is required"}), 400

        # Save to database
        conn = get_db()
        cursor = conn.cursor()
        try:
            cursor.execute('''
                INSERT INTO newsletter (email) VALUES (?)
            ''', (email,))
            conn.commit()
        except sqlite3.IntegrityError:
            # Email already exists
            cursor.execute('''
                UPDATE newsletter SET active = 1 WHERE email = ?
            ''', (email,))
            conn.commit()
        finally:
            conn.close()

        return jsonify({
            "success": True,
            "message": "Successfully subscribed to newsletter!"
        })
    except Exception as e:
        print(f"Newsletter error: {e}")
        return jsonify({"success": False, "message": "Subscription failed. Please try again."}), 500


@app.route('/api/stats')
def stats_api():
    # Get counts from database
    try:
        conn = get_db()
        cursor = conn.cursor()

        cursor.execute('SELECT COUNT(*) FROM contacts')
        contacts_count = cursor.fetchone()[0]

        cursor.execute('SELECT COUNT(*) FROM applications')
        applications_count = cursor.fetchone()[0]

        cursor.execute('SELECT COUNT(*) FROM newsletter')
        newsletter_count = cursor.fetchone()[0]

        conn.close()

        return jsonify({
            "success": True,
            "stats": {
                "contacts_today": random.randint(5, 20),
                "applications_month": random.randint(50, 150),
                "total_contacts": contacts_count,
                "total_applications": applications_count,
                "newsletter_subscribers": newsletter_count,
                "visitors_today": random.randint(100, 500),
                "timestamp": datetime.now().isoformat()
            }
        })
    except Exception as e:
        print(f"Stats error: {e}")
        return jsonify({
            "success": True,
            "stats": {
                "visitors": random.randint(1000, 5000),
                "applications": random.randint(50, 200),
                "timestamp": datetime.now().isoformat()
            }
        })


@app.route('/api/programs')
def api_programs():
    return jsonify({
        "success": True,
        "programs": COLLEGE_DATA["programs"]
    })


@app.route('/api/placements')
def api_placements():
    return jsonify({
        "success": True,
        "placements": COLLEGE_DATA["placements"]
    })


@app.route('/api/facilities')
def api_facilities():
    return jsonify({
        "success": True,
        "facilities": COLLEGE_DATA["facilities"]
    })


# ====================
# ADMIN ROUTES
# ====================

@app.route('/admin/login', methods=['GET', 'POST'])
def admin_login():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')

        # Check credentials in database
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute('SELECT password_hash FROM admin_users WHERE username = ?', (username,))
        result = cursor.fetchone()
        conn.close()

        if result and check_password_hash(result['password_hash'], password):
            session['admin_logged_in'] = True
            session['admin_username'] = username
            return redirect(url_for('admin_dashboard'))

        return render_template('admin/login.html', error="Invalid credentials")

    return render_template('admin/login.html')


@app.route('/admin/logout')
def admin_logout():
    session.pop('admin_logged_in', None)
    session.pop('admin_username', None)
    return redirect(url_for('home'))


def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not session.get('admin_logged_in'):
            return redirect(url_for('admin_login'))
        return f(*args, **kwargs)

    return decorated_function


@app.route('/admin/dashboard')
@admin_required
def admin_dashboard():
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute('SELECT COUNT(*) FROM contacts')
    contacts_count = cursor.fetchone()[0]

    cursor.execute('SELECT COUNT(*) FROM applications')
    applications_count = cursor.fetchone()[0]

    cursor.execute('SELECT COUNT(*) FROM newsletter')
    newsletter_count = cursor.fetchone()[0]

    cursor.execute('SELECT * FROM contacts ORDER BY created_at DESC LIMIT 5')
    recent_contacts = cursor.fetchall()

    cursor.execute('SELECT * FROM applications ORDER BY created_at DESC LIMIT 5')
    recent_applications = cursor.fetchall()

    conn.close()

    return render_template('admin/dashboard.html',
                           contacts_count=contacts_count,
                           applications_count=applications_count,
                           newsletter_count=newsletter_count,
                           recent_contacts=recent_contacts,
                           recent_applications=recent_applications,
                           admin_username=session.get('admin_username'))


@app.route('/admin/contacts')
@admin_required
def admin_contacts():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM contacts ORDER BY created_at DESC')
    contacts = cursor.fetchall()
    conn.close()
    return render_template('admin/contacts.html', contacts=contacts)


@app.route('/admin/applications')
@admin_required
def admin_applications():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM applications ORDER BY created_at DESC')
    applications = cursor.fetchall()
    conn.close()
    return render_template('admin/applications.html', applications=applications)


# ====================
# ERROR HANDLERS
# ====================

@app.errorhandler(404)
def page_not_found(e):
    return render_template('errors/404.html'), 404


@app.errorhandler(500)
def internal_server_error(e):
    return render_template('errors/500.html'), 500


# ====================
# UTILITY ROUTES
# ====================

@app.route('/sitemap.xml')
def sitemap_xml():
    pages = []
    base_url = request.host_url.rstrip('/')

    # Add all static routes
    for rule in app.url_map.iter_rules():
        if "GET" in rule.methods and len(rule.arguments) == 0:
            url = base_url + str(rule)
            if not url.endswith('/admin') and not url.endswith('/api'):
                pages.append(url)

    sitemap_xml = render_template('sitemap.xml', pages=pages, base_url=base_url)
    response = make_response(sitemap_xml)
    response.headers['Content-Type'] = 'application/xml'
    return response


@app.route('/feed.rss')
def rss_feed():
    feed_xml = render_template('feed.rss')
    response = make_response(feed_xml)
    response.headers['Content-Type'] = 'application/rss+xml'
    return response


@app.route('/health')
def health_check():
    return jsonify({
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "service": "SBITM Website",
        "version": "1.0.0"
    })

@app.route('/courses')
def courses():
    return render_template('courses.html')

# ====================
# MAIN ENTRY POINT
# ====================

if __name__ == '__main__':
    print("=" * 70)
    print("🚀 SBITM Betul - Professional Engineering College Website")
    print("✨ Modern Design | Advanced Animations | Professional Graphics")
    print("🌐 Main Website: http://127.0.0.1:5000")
    print("👨‍💼 Admin Panel: http://127.0.0.1:5000/admin/login")
    print("📊 Admin Credentials: admin / sbitm@2024")
    print("💾 Database: sbitm_database.db")
    print("=" * 70)

    # Create templates directory if not exists
    templates_dir = os.path.join(os.path.dirname(__file__), 'templates')
    if not os.path.exists(templates_dir):
        os.makedirs(templates_dir)
        print("📁 Created templates directory")

    # Create static directories if not exists
    static_dir = os.path.join(os.path.dirname(__file__), 'static')
    if not os.path.exists(static_dir):
        os.makedirs(static_dir)
        os.makedirs(os.path.join(static_dir, 'css'))
        os.makedirs(os.path.join(static_dir, 'js'))
        os.makedirs(os.path.join(static_dir, 'images'))
        print("📁 Created static directories")

    app.run(debug=True, host='0.0.0.0', port=5000)