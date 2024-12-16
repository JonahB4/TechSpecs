class Education {
    static majors = {
        BUSINESS: {
            name: "Business",
            cost: 15000,
            duration: 4,
            careers: ["manager", "consultant", "entrepreneur"],
            intelligence_requirement: 60
        },
        MEDICINE: {
            name: "Medicine",
            cost: 25000,
            duration: 8, // Including residency
            careers: ["doctor", "surgeon", "psychiatrist"],
            intelligence_requirement: 85
        },
        ENGINEERING: {
            name: "Engineering",
            cost: 20000,
            duration: 4,
            careers: ["software_engineer", "mechanical_engineer", "civil_engineer"],
            intelligence_requirement: 75
        },
        EDUCATION: {
            name: "Education",
            cost: 12000,
            duration: 4,
            careers: ["teacher", "principal", "professor"],
            intelligence_requirement: 65
        },
        ARTS: {
            name: "Arts",
            cost: 10000,
            duration: 4,
            careers: ["artist", "musician", "designer"],
            intelligence_requirement: 50
        }
    };

    constructor() {
        this.currentMajor = null;
        this.yearsStudied = 0;
        this.graduated = false;
    }

    startMajor(major) {
        if (Education.majors[major]) {
            this.currentMajor = major;
            this.yearsStudied = 0;
            this.graduated = false;
            return true;
        }
        return false;
    }

    studyYear() {
        if (!this.currentMajor) return false;
        
        this.yearsStudied++;
        if (this.yearsStudied >= Education.majors[this.currentMajor].duration) {
            this.graduated = true;
            return true;
        }
        return false;
    }
}
