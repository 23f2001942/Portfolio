
import type { PortfolioData } from '@/types/portfolio';

export const portfolioData: PortfolioData = {
  name: "Shamanthak Reddy Mallu",
  title: "Aspiring Aerospace Engineer | Propulsion, Structures & CFD | AI/ML",
  summary: "Currently pursuing a dual degree in Mechanical Engineering and studying AI, I am passionate about combining aerospace engineering with AI to innovate new technologies.",
  intro: "I'm a third-year Mechanical Engineering student at BITS Pilani, Hyderabad, in the BITS Pilani – University at Buffalo 2+2 program, and I also hold a BSc in Programming and Data Science from IIT Madras, where I'm continuing toward the full BS.\n\nMy interest in aerospace started in 2017, watching ISRO's PSLV-C37 carry 104 satellites into orbit, and grew through years of following NASA missions, Chandrayaan-2 and 3, and SpaceX's reusable boosters. Today I learn it by doing: I'm working on a CFD research project under Prof. Supradeepan K and contribute to airframe design and structural simulation in Aeolus, our fixed-wing UAV club. Earlier, I supported PCB development in Project Vanguard, our Mars Rover team.\n\nOutside coursework, I build: the Sky Series drones, Dum-E (a 6-DOF robotic arm), and a custom RC system, and I take NPTEL aerospace courses to learn beyond my curriculum. Away from engineering, I'm a Trinity-certified guitarist, a cricket and F1 fan, and a beginner in Japanese, Spanish and German.",
  location: "Hyderabad, Telangana, India",
  about_summary: "Mechanical Engineering student at BITS Pilani, learning aerospace engineering by building: from drones and robotic arms to CFD. Aiming for a future in reusable launch vehicles.",
  socials: [
    { name: "linkedin", url: "https://www.linkedin.com/in/shamanthak/" },
    { name: "github", url: "https://github.com/23f2001942" },
    { name: "email", url: "mailto:shamanthakreddy@gmail.com" },
  ],
  experience: [
    {
      role: "Mechanical Subsystem Member",
      company: "Aeolus - BITS Pilani Hyderabad Campus",
      period: "Sep 2025 - Present",
      description: "As a member of the mechanical subsystem, I contribute to the design, analysis, and fabrication of our aircraft's structural components. My responsibilities include CAD modeling, performing structural simulations, and ensuring the airframe meets competition requirements for durability and performance.",
      logoUrl: "/images/AelousLogo.png",
      socials: [
        { name: "linkedin", url: "https://www.linkedin.com/company/aeolus-bphc/" },
        { name: "instagram", url: "https://www.instagram.com/aeolusbphc/" },
      ]
    },
    {
      role: "Associate Electronics Subdivision",
      company: "Project Vanguard (formerly Mars Rover Team)",
      period: "Mar 2025 - May 2026",
      description: "Assisted in developing a custom power-distribution PCB for the rover's drive motors and sensors, supporting schematic work and PCB layout under senior team members and learning hands-on hardware design along the way.",
      logoUrl: "/images/VanguardLogo.png",
      socials: [
        { name: "instagram", url: "https://www.instagram.com/vanguard_bphc/" }
      ]
    },
    {
      role: "Tech Team Member",
      company: "Innovation Cell, BITS Pilani Hyderabad Campus",
      period: "Sep 2024 - May 2025",
      description: "I contribute to the Innovation Cell Technical Team, where we empower students by organizing hands-on workshops and sessions on core technologies such as Python, Arduino, Raspberry Pi, and AI. Our goal is to foster a strong technical foundation among peers and ignite a culture of innovation across the campus.",
      logoUrl: "/images/ICellLogo.png",
      socials: [
        { name: "linkedin", url: "https://www.linkedin.com/company/icellbphc/" },
        { name: "instagram", url: "https://www.instagram.com/icell_bphc/" }
      ]
    },
    {
      role: "Project Intern",
      company: "CADD Centre Training Services Pvt Ltd.",
      period: "Jul 2021 - Dec 2021",
      description: "Project Internship in Product Design of Electric Bike"
    }
  ],
  research: [
    {
      title: "CFD Solver Development (Research Project)",
      supervisor: "Prof. Supradeepan K",
      institution: "BITS Pilani, Hyderabad Campus",
      period: "Jul 2026 - Present",
      description: "Learning to build a CFD solver in C++ under faculty guidance, starting with a 2D implementation and planning a 3D extension. Currently studying the fundamentals of Computational Fluid Dynamics and the Finite Volume Method, with a focus on unstructured meshes, and implementing core solver components as I learn the underlying numerical methods. The project is written from scratch rather than on commercial CFD packages, and it is steadily building my understanding of fluid mechanics, numerical analysis and scientific programming in C++.",
      skills: ["C++", "Computational Fluid Dynamics", "Finite Volume Method", "Unstructured Meshes", "Numerical Methods"],
      logoUrl: "/images/BITS_Logo.png"
    }
  ],
  education: [
    {
      degree: "B.E. Mechanical Engineering",
      institution: "BITS Pilani, Hyderabad Campus",
      period: "2024 - 2028",
      description: "Pursuing a comprehensive curriculum focused on Mechanical and Aerospace engineering. Student under BITS-UB 2+2 international collaboration program.",
      logoUrl: "/images/BITS_Logo.png",
      universityUrl: "https://www.bits-pilani.ac.in/"
    },
    {
      degree: "BS in Data Science and Applications",
      institution: "Indian Institute of Technology, Madras",
      period: "2023 - 2027",
      description: "A rigorous remote degree program covering Programming, Machine Learning, and Application Development.",
      logoUrl: "/images/IITM_Logo.png",
      universityUrl: "https://study.iitm.ac.in/ds/",
      studentProfileUrl: "https://ds.study.iitm.ac.in/student/23F2001942"
    },
    {
      degree: "B.S. Mechanical Engineering",
      institution: "University at Buffalo School of Engineering and Applied Sciences",
      period: "2024 - 2028",
      description: "Yet to move on-campus under BITS-UB 2+2 international collaboration program but took few remote courses from them during my time at BITS Pilani Hyderabad Campus.",
      logoUrl: "/images/UB_Logo.png",
      universityUrl: "https://www.buffalo.edu/"
    }
  ],
  qualifications: [
    { skill: "Python", category: "top" },
    { skill: "C++", category: "top" },
    { skill: "MATLAB", category: "top" },
    { skill: "Solidworks", category: "top" },

    { skill: "Solidworks", category: "cad" },
    { skill: "CATIA", category: "cad" },
    { skill: "Structural Simulation", category: "cad" },

    { skill: "Arduino", category: "hardware" },
    { skill: "ESP32", category: "hardware" },
    { skill: "Raspberry Pi", category: "hardware" },
    { skill: "Pixhawk", category: "hardware" },
    { skill: "3D Printing", category: "hardware" },
    { skill: "KiCad", category: "hardware" },

    { skill: "Python", category: "programming" },
    { skill: "C++", category: "programming" },
    { skill: "MATLAB", category: "programming" },
    { skill: "NumPy", category: "programming" },
    { skill: "Pandas", category: "programming" },
    { skill: "Matplotlib", category: "programming" },
    { skill: "PyTorch", category: "programming" },
    { skill: "TensorFlow", category: "programming" },
    { skill: "OpenCV", category: "programming" },

    { skill: "React", category: "web" },
    { skill: "Next.js", category: "web" },
    { skill: "TypeScript", category: "web" },
    { skill: "Flask", category: "web" },
    { skill: "Vue.js", category: "web" }
  ],
  licenses: [
    {
      name: "Introduction to Aerospace Engineering - Flight",
      issuer: "NPTEL & IIT Bombay",
      type: "nptel",
      date: "Oct 2025",
      credentialUrl: "https://archive.nptel.ac.in/content/noc/NOC25/SEM2/Ecertificates/101/noc25-ae19/Course/NPTEL25AE19S35820973410846767.pdf"
    },
    {
      name: "Drone Systems and Control",
      issuer: "NPTEL & IISc Bangalore",
      type: "nptel",
      date: "Oct 2025",
      credentialUrl: "https://archive.nptel.ac.in/content/noc/NOC25/SEM2/Ecertificates/101/noc25-ae30/Course/NPTEL25AE30S115820792210846767.pdf"    
    },
    {
      name: "16.00x: Introduction to Aerospace Engineering: Astronautics and Human Spaceflight",
      issuer: "MITx Courses",
      date: "Jul 2020",
      type: "mooc",
      credentialUrl: "https://courses.edx.org/certificates/ff48f74788ad42e59a27002bdff38f67"
    },
    {
      name: "Raspberry Pi Projects Specialization",
      issuer: "The Johns Hopkins University",
      date: "Jul 2025",
      type: "mooc",
      credentialUrl: "https://www.coursera.org/account/accomplishments/specialization/certificate/XRH84RBLSAPS"
    },
    {
      name: "Embedding Sensors and Motors",
      issuer: "University of Colorado Boulder",
      date: "May 2025",
      type: "mooc",
      credentialUrl: "https://www.coursera.org/account/accomplishments/specialization/certificate/LKL4IE8Y9M40"
    },
    {
      name: "Essential Computer-Aided Design (CAD) and Essential CATIA",
      issuer: "CADD Centre Training Services Pvt Ltd.",
      date: "Jul 2021",
      type: "mooc",
      credentialUrl: "https://www.caddcentre.com/caddVerification.php?ddac=OTAwODc3"
    },
    {
      name: "Certified C and C++",
      issuer: "Tata Consultancy Services",
      date: "Sep 2016",
      type: "mooc",
      credentialId: "5801616170043"
    },
    {
      name: "Achieving Personal and Professional Success Specilization",
      issuer: "University of Pennsylvania",
      date: "May 2025",
      type: "mooc",
      credentialUrl: "https://www.coursera.org/account/accomplishments/specialization/AC16XFWBSQZ6"
    },
    {
      name: "Professional Skills for the Workplace Specilization",
      issuer: "University of California, Davis",
      date: "May 2025",
      type: "mooc",
      credentialUrl: "https://www.coursera.org/account/accomplishments/specialization/SZPQT2OZMBGF"
    },
    {
      name: "Generative AI Fundamentals Specialization",
      issuer: "IBM",
      date: "Dec 2024",
      type: "mooc",
      credentialUrl: "https://www.coursera.org/account/accomplishments/specialization/TXITSAF06H4X"
    },
    {
      name: "IBM AI Engineering Professional Certificate",
      issuer: "IBM",
      date: "Jan 2025",
      type: "mooc",
      credentialUrl: "https://www.coursera.org/account/accomplishments/specialization/HWNNGTLKPNH0"
    },
    {
      name: "A Story of Economics: A Principles Tale Specilization",
      issuer: "Rice University",
      date: "Jul 2025",
      type: "mooc",
      credentialUrl: "https://www.coursera.org/account/accomplishments/specialization/6Q9JUX0SM0XB"
    },
    {
      name: "Applied Data Science Specialization",
      issuer: "IBM",
      date: "Jun 2025",
      type: "mooc",
      credentialUrl: "https://www.coursera.org/account/accomplishments/specialization/UYOVWSJZU45B"
    },
    {
      name: "IBM Data Analytics with Excel and R Specialization",
      issuer: "IBM",
      date: "Jun 2025",
      type: "mooc",
      credentialUrl: "https://www.coursera.org/account/accomplishments/specialization/3SR95WJCVYIS"
    },
    {
      name: "IBM Machine Learning Specialization",
      issuer: "IBM",
      date: "Jun 2025",
      type: "mooc",
      credentialUrl: "https://www.coursera.org/account/accomplishments/professional-cert/certificate/7LNEIN30LGUC"
    },
    {
      name: "Microsoft Python Development Specilization",
      issuer: "Microsoft",
      date: "Jun 2025",
      type: "mooc",
      credentialUrl: "https://www.coursera.org/account/accomplishments/specialization/8WZ22LA31387"
    },
    {
      name: "Meta Android Developer",
      issuer: "Meta",
      date: "Jun 2025",
      type: "mooc",
      credentialUrl: "https://www.coursera.org/account/accomplishments/professional-cert/certificate/3TW821DB0UPX"
    },
    {
      name: "Meta Back-End Developer",
      issuer: "Meta",
      date: "Jun 2025",
      type: "mooc",
      credentialUrl: "https://www.coursera.org/account/accomplishments/professional-cert/certificate/3SD3W3NHU64U"
    },
    {
      name: "Meta Front-End Developer",
      issuer: "Meta",
      date: "Jun 2025",
      type: "mooc",
      credentialUrl: "https://www.coursera.org/account/accomplishments/specialization/100V3LKD29A5"
    },
    {
      name: "Diploma in Data Science",
      issuer: "Indian Institute of Technology, Madras",
      date: "April 2025",
      type: "iitm",
      credentialUrl: "https://ds.study.iitm.ac.in/document_verification/a4d154f538ad2e0523dc3b397c98a81e1babf43e71844e38786a7be5dc437c33"
    },
    {
      name: "Diploma in Programming",
      issuer: "Indian Institute of Technology, Madras",
      date: "September 2025",
      type: "iitm",
      credentialUrl: "https://ds.study.iitm.ac.in/document_verification/514f9e47f3785298e09c50fc53a06b590e6a5617fb2e7eef6b881f1967f3983f"
    },
    {
      name: "Advanced Certificate in Programming and Application Development",
      issuer: "Indian Institute of Technology, Madras",
      date: "June 2025",
      type: "iitm",
      credentialUrl: "https://ds.study.iitm.ac.in/document_verification/e401fabd2b7d7c0a8994084978f3a56cf2932eb7728a55ffc3e9adf4f5c8bb5f"
    },
    {
      name: "Foundation Level",
      issuer: "Indian Institute of Technology, Madras",
      date: "December 2023",
      type: "iitm",
      credentialUrl: "https://app.onlinedegree.iitm.ac.in/document_verification/8a6f0a3f1a1fed74af1e3053c965a4f359f880bf904920ab523129ad881574fc"
    },
    {
      name: "SOLIDWORKS 2025 Basics & User Interface",
      issuer: "Tata Technologies",
      date: "Jun 2026",
      type: "solidworks",
      credentialId: "IGI-649631-19537"
    },
    {
      name: "SOLIDWORKS 2025 Sketching",
      issuer: "Tata Technologies",
      date: "Aug 2026",
      type: "solidworks",
      credentialId: "IGI-649631-19542"
    },
    {
      name: "SOLIDWORKS 2025 Assemblies",
      issuer: "Tata Technologies",
      date: "Aug 2026",
      type: "solidworks",
      credentialId: "IGI-649631-19540"
    },
    {
      name: "SOLIDWORKS 2024 Motion Fundamentals",
      issuer: "Tata Technologies",
      date: "Aug 2026",
      type: "solidworks",
      credentialId: "IGI-649631-18494"
    }
  ],
  leadership: [
    {
      role: "Student Representative (BITS-UB 2024 Cohort)",
      organization: "BITS Pilani Hyderabad Campus",
      logo: "/images/BITS_Logo.png",
      date: "Aug 2024 - Present",
      location: "Hyderabad, India",
      description: "Serving as the primary liaison between the BITS-UB 2+2 International Collaboration cohort and the administration of both universities. I facilitate seamless communication by disseminating critical academic and administrative updates to students while representing their concerns to key offices. I collaborate frequently with the Mechanical Engineering Department (Hyderabad), AUGSD, the BITS-UB Office (Pilani), and the UB SEAS Office to resolve student issues and ensure operational efficiency."
    }
  ],
  projects: [
    {
      name: "Dum-E",
      description: "Dum-E is a self-designed 6-DOF robotic arm built around the XIAO ESP32 S3, featuring a WiFi-hosted web UI for real-time servo control and a custom glove controller using ESP-NOW wireless communication, an MPU6050 IMU, and flex sensors for intuitive gesture-based operation.",
      image: "dum-e",
      tags: ["ESP32", "Robotics", "3D Printing", "ESP-NOW", "IMU", "Servo Control"],
      detailsUrl: "/projects/dum-e",
      type: "hardware",
      status: "in-progress"
    },
    {
      name: "SpillSense",
      description: "A smart milk froth monitor that warns before boiling milk spills over. V1 paired an Arduino Nano with a K-type thermocouple, MAX6675, buzzer, and LED bar on a custom PCB, tested on real milk. V2 is being redesigned around a XIAO ESP32-C3 with a KiCad PCB and 3D-printed enclosure.",
      image: "milkfroth",
      tags: ["Arduino", "ESP32", "Sensors", "PCB Design", "KiCad"],
      detailsUrl: "/projects/spillsense",
      repoUrl: "https://github.com/23f2001942/SpillSense",
      type: "hardware",
      status: "in-progress"
    },
    {
      name: "SkyOne",
      description: "My first drone, built with the APM 2.8 flight controller. SkyOne introduced me to the fundamentals of drone technology — from components to flight principles — and gave me a hands-on foundation in UAV design.",
      image: "skyone",
      tags: [],
      detailsUrl: "/projects/skyone",
      type: "hardware",
      status: "in-progress"
    },
    {
      name: "SkyTwo",
      description: "My upgrade to SkyOne: the same F450 frame rebuilt around a Pixhawk 2.4.8 with GPS and telemetry. SkyTwo flies in Loiter and returns home on its own with RTL, and I'm now tuning it with log analysis and AutoTune as groundwork for autonomous flight.",
      image: "skytwo",
      tags: [],
      detailsUrl: "/projects/skytwo",
      type: "hardware",
      status: "in-progress"
    },
    {
      name: "AirLink",
      description: "A custom DIY Arduino-based RC transmitter and receiver system, designed to wirelessly control any Arduino project — from drones to RC cars and planes. With simple receiver-side adjustments, AirLink provides a versatile and low-cost alternative to commercial transmitters.",
      image: "airlink",
      tags: ["Arduino", "Communication", "PCB Design", "Sensors"],
      detailsUrl: "/projects/airlink",
      type: "hardware"
    },
    {
      name: "VitalLink",
      description: "A wireless SpO₂ and temperature monitor built for my Digital Fundamentals (BITS F235) course. A XIAO ESP32-C3 reads a MAX30102 and an MLX90614 over a shared I2C bus and streams the readings over Wi-Fi/TCP to a live MATLAB App Designer dashboard with connection-loss detection.",
      image: "vitallink",
      tags: ["ESP32-C3", "Arduino", "MATLAB", "I2C", "TCP/Wi-Fi"],
      detailsUrl: "/projects/vitallink",
      repoUrl: "https://github.com/23f2001942/VitalLink",
      type: "hardware",
      status: "completed"
    },
    {
      name: "Sponnect",
      description: "A platform built with Python (Flask) to connect sponsors and influencers for campaign collaborations, ad request negotiations, and real-time analytics with a role-based system.",
      image: "sponnect",
      tags: ["Flask (Python)", "HTML + CSS", "SQLite"],
      repoUrl: "https://github.com/23f2001942/Sponnect",
      type: "software"
    },
    {
      name: "ParkEase",
      description: "ParkEase is a full-stack web application that streamlines 4-wheeler parking management with role-based dashboards for admins and users. It supports parking lot creation, spot reservations, cost tracking, and data-driven analytics. The app also automates reminders, monthly reports, and CSV exports for a seamless management experience.",
      image: "parkease",
      tags: ["Flask (Python)", "Vue.js", "SQLite", "Redis", "Celery"],
      repoUrl: "https://github.com/23f2001942/ParkEase",
      type: "software"
    },
    {
      name: "Vendora",
      description: "A full-stack B2B2C e-commerce platform connecting Customers, Retailers, and Wholesalers in a seamless supply chain ecosystem. Features role-based dashboards, real-time order tracking, multi-address management, and secure authentication with Google OAuth.",
      image: "vendora",
      tags: ["React", "TypeScript", "Tailwind CSS", "Supabase", "PostgreSQL", "Nominatim", "Edge Functions", "TanStack Query", "shadcn/ui"],
      repoUrl: "https://github.com/23f2001942/Vendora",
      liveUrl: "https://vendora-sam.vercel.app",
      type: "software"
    }
  ],
  awards: [
    {
      name: "AP Scholar Award",
      issuer: "College Board, USA",
      date: "2023",
      description: "I received this award for my performance on AP Exams in 2023, where I demonstrated strong college-level achievement across multiple subjects.",
      logoUrl: "/images/CollegeBoard.png",
      awardUrl: "https://apcentral.collegeboard.org/exam-administration-ordering-scores/scores/awards/scholar-awards"
    },
    {
      name: "AP Scholar Award",
      issuer: "College Board, USA",
      date: "2022",
      description: "I was honored with this award for excelling in several AP Exams, showcasing consistent academic strength at the college level while in high school.",
      logoUrl: "/images/CollegeBoard.png",
      awardUrl: "https://apcentral.collegeboard.org/exam-administration-ordering-scores/scores/awards/scholar-awards"
    }
  ]
};
