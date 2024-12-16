

// Update Career class with more detailed career options
class Career {
    static availableCareers = {
        // Entry level careers (no education required)
        retail: {
            jobTitle: "Retail Worker",
            company: "Local Store",
            salary: 25000,
            happiness: 40,
            requirements: { age: 16, intelligence: 20 }
        },
        office: {
            jobTitle: "Office Clerk",
            company: "Corporate Inc",
            salary: 35000,
            happiness: 45,
            requirements: { age: 18, intelligence: 40 }
        },

        // Business careers
        manager: {
            jobTitle: "Business Manager",
            company: "Enterprise Corp",
            salary: 75000,
            happiness: 65,
            requirements: { age: 22, intelligence: 60, major: "BUSINESS" }
        },
        consultant: {
            jobTitle: "Management Consultant",
            company: "Big Four Consulting",
            salary: 95000,
            happiness: 70,
            requirements: { age: 22, intelligence: 70, major: "BUSINESS" }
        },
        entrepreneur: {
            jobTitle: "Entrepreneur",
            company: "Self-Employed",
            salary: 120000,
            happiness: 80,
            requirements: { age: 22, intelligence: 75, major: "BUSINESS" }
        },

        // Medical careers
        doctor: {
            jobTitle: "Medical Doctor",
            company: "City Hospital",
            salary: 180000,
            happiness: 75,
            requirements: { age: 26, intelligence: 85, major: "MEDICINE" }
        },
        surgeon: {
            jobTitle: "Surgeon",
            company: "University Hospital",
            salary: 250000,
            happiness: 80,
            requirements: { age: 26, intelligence: 90, major: "MEDICINE" }
        },
        psychiatrist: {
            jobTitle: "Psychiatrist",
            company: "Mental Health Center",
            salary: 200000,
            happiness: 85,
            requirements: { age: 26, intelligence: 85, major: "MEDICINE" }
        },

        // Engineering careers
        software_engineer: {
            jobTitle: "Software Engineer",
            company: "Tech Giant",
            salary: 120000,
            happiness: 75,
            requirements: { age: 22, intelligence: 75, major: "ENGINEERING" }
        },
        mechanical_engineer: {
            jobTitle: "Mechanical Engineer",
            company: "Manufacturing Inc",
            salary: 90000,
            happiness: 70,
            requirements: { age: 22, intelligence: 75, major: "ENGINEERING" }
        },
        civil_engineer: {
            jobTitle: "Civil Engineer",
            company: "Construction Corp",
            salary: 85000,
            happiness: 65,
            requirements: { age: 22, intelligence: 75, major: "ENGINEERING" }
        },

        // Education careers
        teacher: {
            jobTitle: "Teacher",
            company: "Public School",
            salary: 45000,
            happiness: 80,
            requirements: { age: 22, intelligence: 65, major: "EDUCATION" }
        },
        principal: {
            jobTitle: "School Principal",
            company: "Public School District",
            salary: 85000,
            happiness: 75,
            requirements: { age: 30, intelligence: 75, major: "EDUCATION" }
        },
        professor: {
            jobTitle: "University Professor",
            company: "State University",
            salary: 95000,
            happiness: 85,
            requirements: { age: 30, intelligence: 85, major: "EDUCATION" }
        },

        // Arts careers
        artist: {
            jobTitle: "Professional Artist",
            company: "Freelance",
            salary: 45000,
            happiness: 90,
            requirements: { age: 22, intelligence: 50, major: "ARTS" }
        },
        musician: {
            jobTitle: "Professional Musician",
            company: "Orchestra",
            salary: 55000,
            happiness: 95,
            requirements: { age: 22, intelligence: 50, major: "ARTS" }
        },
        designer: {
            jobTitle: "Graphic Designer",
            company: "Design Studio",
            salary: 65000,
            happiness: 85,
            requirements: { age: 22, intelligence: 50, major: "ARTS" }
        }
    };

    constructor(config) {
        this.jobTitle = config.jobTitle;
        this.company = config.company;
        this.salary = config.salary;
        this.happiness = config.happiness || 50;
        this.satisfaction = config.satisfaction || 50;
        this.yearsInPosition = 0;
        this.requirements = config.requirements || {};
    }

    promote() {
        this.salary *= 1.1;
        this.satisfaction += 10;
        this.yearsInPosition = 0;
        return `You got promoted! Your new salary is ${Utils.formatMoney(this.salary)}`;
    }

    quitJob() {
        const severance = this.yearsInPosition > 5 ? this.salary * 0.3 : 0;
        return {
            message: `You quit your job${severance > 0 ? ' and received severance pay' : ''}!`,
            severance: severance
        };
    }

    yearlyUpdate() {
        this.yearsInPosition++;
        // Random satisfaction changes
        this.satisfaction = Math.max(0, Math.min(100, 
            this.satisfaction + Utils.randomInt(-10, 10)));
        
        // Small random salary adjustments
        this.salary *= (1 + Utils.randomInt(-2, 5) / 100);
        
        return {
            satisfaction: this.satisfaction,
            salary: this.salary
        };
    }
}

