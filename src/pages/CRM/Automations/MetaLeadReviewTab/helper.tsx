export interface PendingMetaLead {
    leadgenId: string;
    formId: string;
    formName: string;
    pageId: string;
    pageName: string;
    studentName: string;
    phone: string;
    email: string;
    receivedAt: string;
    answers: Array<{ question: string; answer: string }>;
    unmappedCount: number;
}

export const pendingMetaLeads: Array<PendingMetaLead> = [
    {
        leadgenId: "lg-7781200402",
        formId: "form-9001",
        formName: "Admissions 2026-27 Enquiry",
        pageId: "1010101010",
        pageName: "Digital Campus Schools",
        studentName: "Ananya Iyer",
        phone: "9701234567",
        email: "ananya.parent@example.com",
        receivedAt: "2026-08-19T09:12:00",
        answers: [
            { question: "What is your full name?", answer: "Ananya Iyer" },
            { question: "Phone number", answer: "9701234567" },
            { question: "Email", answer: "ananya.parent@example.com" },
            { question: "What class are you applying for?", answer: "Class V" },
            { question: "Which city do you live in?", answer: "Hyderabad" },
            { question: "When would you like to start?", answer: "" },
        ],
        unmappedCount: 1,
    },
    {
        leadgenId: "lg-7781200399",
        formId: "form-9001",
        formName: "Admissions 2026-27 Enquiry",
        pageId: "1010101010",
        pageName: "Digital Campus Schools",
        studentName: "",
        phone: "9848098765",
        email: "",
        receivedAt: "2026-08-19T08:40:00",
        answers: [
            { question: "What is your full name?", answer: "" },
            { question: "Phone number", answer: "9848098765" },
            { question: "What class are you applying for?", answer: "Class I" },
        ],
        unmappedCount: 2,
    },
    {
        leadgenId: "lg-7781200395",
        formId: "form-9002",
        formName: "Open House Registration",
        pageId: "1010101011",
        pageName: "Digital Campus — Kompally",
        studentName: "Rohit Bhat",
        phone: "",
        email: "rohit.bhat@example.com",
        receivedAt: "2026-08-18T17:05:00",
        answers: [
            { question: "What is your full name?", answer: "Rohit Bhat" },
            { question: "Parent name", answer: "Suhas Bhat" },
            { question: "Preferred open house slot", answer: "Saturday morning" },
        ],
        unmappedCount: 0,
    },
    {
        leadgenId: "lg-7781200390",
        formId: "form-9002",
        formName: "Open House Registration",
        pageId: "1010101011",
        pageName: "Digital Campus — Kompally",
        studentName: "Meghna Rao",
        phone: "9963012345",
        email: "",
        receivedAt: "2026-08-18T14:22:00",
        answers: [
            { question: "What is your full name?", answer: "Meghna Rao" },
            { question: "Parent name", answer: "Kiran Rao" },
            { question: "Preferred open house slot", answer: "Sunday afternoon" },
        ],
        unmappedCount: 0,
    },
];
