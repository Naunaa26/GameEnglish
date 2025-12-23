console.log("Memuat QUESTIONS_DATA...");

const QUESTIONS_DATA = {
  easy: [
    {
      q: "My laptop <strong>battery</strong> is running low.",
      o: ["Noun", "Verb", "Adjective", "Adverb"],
      c: 0,
      explanation: "'Battery' adalah kata benda.",
    },
    {
      q: "I need to <strong>download</strong> the latest version of the app.",
      o: ["Noun", "Verb", "Adjective", "Adverb"],
      c: 1,
      explanation: "'Download' adalah kata kerja.",
    },
    {
      q: "The new <strong>smartphone</strong> has a very high-resolution screen.",
      o: ["Noun", "Verb", "Adjective", "Adverb"],
      c: 0,
      explanation: "'Smartphone' adalah kata benda.",
    },
    {
      q: "Artificial Intelligence is a <strong>digital</strong> revolution.",
      o: ["Noun", "Verb", "Adjective", "Adverb"],
      c: 2,
      explanation: "'Digital' adalah kata sifat.",
    },
    {
      q: "Which of the following is an input device?",
      o: ["Monitor", "Printer", "Keyboard", "Speaker"],
      c: 2,
      explanation: "Keyboard adalah input device.",
    },
    {
      q: "What does CPU stand for?",
      o: [
        "Computer Personal Unit",
        "Central Processing Unit",
        "Central Program Utility",
        "Core Processing User",
      ],
      c: 1,
      explanation: "CPU adalah Central Processing Unit.",
    },
    {
      q: "What is the physical part of a computer called?",
      o: ["Software", "Hardware", "Malware", "Firmware"],
      c: 1,
      explanation: "Hardware adalah bagian fisik komputer.",
    },
    {
      q: "_____ is used to type letters and numbers into a computer.",
      o: ["Mouse", "Monitor", "Keyboard", "Speaker"],
      c: 2,
      explanation: "Keyboard digunakan untuk mengetik.",
    },
    {
      q: "Data is stored in the computer's _____.",
      o: ["Monitor", "Keyboard", "Hard drive", "Mouse"],
      c: 2,
      explanation: "Hard drive digunakan untuk menyimpan data.",
    },
    {
      q: "Google Chrome is an example of a _____.",
      o: ["Search engine", "Browser", "Operating system", "Hardware"],
      c: 1,
      explanation: "Google Chrome adalah browser.",
    },
    {
      q: "The word <strong>automatically</strong> is an example of:",
      o: ["Noun", "Verb", "Adjective", "Adverb"],
      c: 3,
      explanation: "'Automatically' adalah kata keterangan.",
    },
    {
      q: "Cloud computing allows users to store data ____ the internet.",
      o: ["On", "In", "Under", "Between"],
      c: 0,
      explanation: "Data disimpan di internet.",
    },
  ],

  medium: [
    {
      q: "Last week, the IT team _____ the server issue.",
      o: ["fix", "fixes", "fixed", "is fixed"],
      c: 2,
      explanation: "Last week menunjukkan Simple Past.",
    },
    {
      q: "The IT team is working hard; _____ are upgrading the network.",
      o: ["He", "It", "They", "We"],
      c: 2,
      explanation: "'They' merujuk pada IT team.",
    },
    {
      q: "Data is transmitted _____ the router to client devices.",
      o: ["Between", "From", "Under", "Among"],
      c: 1,
      explanation: "'From' menunjukkan asal.",
    },
    {
      q: "A hacker tried to access the system, _____ the firewall blocked him.",
      o: ["Or", "But", "Because", "And"],
      c: 1,
      explanation: "'But' menunjukkan kontras.",
    },
    {
      q: "Developers usually _____ documentation after coding.",
      o: ["wrote", "write", "written", "are writing"],
      c: 1,
      explanation: "Usually menunjukkan kebiasaan.",
    },
    {
      q: "A new update is _____ every month.",
      o: ["release", "released", "releases", "releasing"],
      c: 1,
      explanation: "Kalimat pasif rutin.",
    },
    {
      q: "The system administrator _____ the network every day.",
      o: ["monitor", "monitors", "monitored", "is monitored"],
      c: 1,
      explanation: "Subjek tunggal + present tense.",
    },
    {
      q: "You cannot access the system _____ you have the password.",
      o: ["Unless", "Although", "While", "Because"],
      c: 0,
      explanation: "'Unless' berarti kecuali.",
    },
    {
      q: "The word <strong>archive</strong> is correctly pronounced as:",
      o: ["Ar-chiv", "Ar-kaiv", "Ar-shiv", "Ar-kev"],
      c: 1,
      explanation: "Pengucapan yang benar ar-kaiv.",
    },
    {
      q: "Which one is a motherboard?",
      o: ["Power cable", "Main circuit board", "Cooling fan", "Monitor screen"],
      c: 1,
      explanation: "Motherboard adalah papan utama.",
    },
    {
      q: "Data _____ processed by the system automatically.",
      o: ["is", "are", "was", "were"],
      c: 1,
      explanation: "Data dianggap jamak secara formal.",
    },
    {
      q: "Management is often misspelled. Which one is correct?",
      o: ["Managemant", "Menegement", "Management", "Managment"],
      c: 2,
      explanation: "Ejaan yang benar adalah management.",
    },
  ],

  hard: [
    {
      q: "Thousands of new accounts _____ by the system every minute.",
      o: ["Create", "Created", "Are created", "Was created"],
      c: 2,
      explanation: "Present passive digunakan.",
    },
    {
      q: "Last night, a critical bug _____ by the QA team.",
      o: ["Finds", "Found", "Is found", "Was found"],
      c: 3,
      explanation: "Past passive digunakan.",
    },
    {
      q: "Software developers _____ Java and Python two years ago.",
      o: ["Use", "Used", "Are used", "Were used"],
      c: 1,
      explanation: "Simple past active.",
    },
    {
      q: "The data was _____ by the administrator yesterday.",
      o: ["delete", "deleted", "deleting", "deletes"],
      c: 1,
      explanation: "Past passive menggunakan V3.",
    },
    {
      q: "The firewall _____ our network from external attacks.",
      o: ["protect", "protects", "protected", "is protect"],
      c: 1,
      explanation: "Subjek tunggal present tense.",
    },
    {
      q: "In professional emails, writing in ALL CAPS is considered:",
      o: ["Formal", "Polite", "Shouting and rude", "Friendly"],
      c: 2,
      explanation: "ALL CAPS dianggap berteriak.",
    },
    {
      q: "How should you respond to an angry bug report?",
      o: [
        "Ignore it",
        "Reply rudely",
        "Stay professional and focus on the issue",
        "Delete the message",
      ],
      c: 2,
      explanation: "Etika profesional dijaga.",
    },
    {
      q: "Before posting a question on a forum, you should:",
      o: [
        "Post it repeatedly",
        "Search for existing answers",
        "Use slang",
        "Share personal contacts",
      ],
      c: 1,
      explanation: "Menghindari duplikasi.",
    },
    {
      q: "Adware is best described as:",
      o: [
        "Hardware component",
        "Advertisement software",
        "Operating system",
        "Antivirus tool",
      ],
      c: 1,
      explanation: "Adware menampilkan iklan.",
    },
    {
      q: "In formal IT usage, 'data' is the plural form of:",
      o: ["Date", "Datum", "Daton", "Datis"],
      c: 1,
      explanation: "Data berasal dari datum.",
    },
    {
      q: "During virtual meetings, the best practice is:",
      o: [
        "Keep mic on",
        "Mute mic when not speaking",
        "Join late",
        "Play music",
      ],
      c: 1,
      explanation: "Mengurangi gangguan suara.",
    },
  ],
};

console.log("QUESTIONS_DATA telah dimuat:", QUESTIONS_DATA);


window.QUESTIONS_DATA = QUESTIONS_DATA; // Tambahkan ini
